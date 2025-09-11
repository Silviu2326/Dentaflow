const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rutas
const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar si existe el token en los headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado - Token requerido'
      });
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar usuario por ID del token
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'No autorizado - Usuario no encontrado'
        });
      }

      // Verificar si el usuario está activo
      if (!user.activo) {
        return res.status(401).json({
          success: false,
          message: 'No autorizado - Usuario inactivo'
        });
      }

      // Verificar si está bloqueado
      if (user.estaBloqueado) {
        return res.status(401).json({
          success: false,
          message: 'No autorizado - Usuario bloqueado temporalmente'
        });
      }

      // Agregar usuario a req para usar en siguientes middlewares
      req.user = user;
      next();

    } catch (error) {
      console.error('Error verificando token:', error);
      return res.status(401).json({
        success: false,
        message: 'No autorizado - Token inválido'
      });
    }

  } catch (error) {
    console.error('Error en middleware protect:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Middleware para autorizar roles específicos
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado - Usuario requerido'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso'
      });
    }

    next();
  };
};

// Middleware para verificar permisos específicos
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado - Usuario requerido'
      });
    }

    if (!req.user.tienePermiso(permission)) {
      return res.status(403).json({
        success: false,
        message: `No tienes permisos para: ${permission}`
      });
    }

    next();
  };
};

// Middleware para verificar sede (solo para roles con sede específica)
const requireSede = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado - Usuario requerido'
    });
  }

  // Roles que requieren sede específica
  const rolesSede = ['admin_sede', 'reception', 'clinical_professional', 'assistant_nurse'];
  
  if (rolesSede.includes(req.user.role) && !req.user.sede) {
    return res.status(403).json({
      success: false,
      message: 'Usuario no tiene sede asignada'
    });
  }

  next();
};

// Middleware para verificar acceso a sede específica
const requireSedeAccess = (sedeParam = 'sede') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado - Usuario requerido'
      });
    }

    const sedeRequerida = req.params[sedeParam] || req.body[sedeParam] || req.query[sedeParam];

    // Owner y hq_analyst tienen acceso a todas las sedes
    if (['owner', 'hq_analyst'].includes(req.user.role)) {
      return next();
    }

    // Otros usuarios solo pueden acceder a su sede
    if (req.user.sede !== sedeRequerida) {
      return res.status(403).json({
        success: false,
        message: 'No tienes acceso a esta sede'
      });
    }

    next();
  };
};

// Middleware para verificar horario de trabajo
const checkWorkingHours = (req, res, next) => {
  if (!req.user || !req.user.horarioTrabajo) {
    return next(); // Si no hay horario definido, permitir acceso
  }

  const now = new Date();
  const currentDay = now.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM

  const horarioHoy = req.user.horarioTrabajo[currentDay];

  if (!horarioHoy || !horarioHoy.inicio || !horarioHoy.fin) {
    return res.status(403).json({
      success: false,
      message: 'Acceso fuera del horario de trabajo'
    });
  }

  if (currentTime < horarioHoy.inicio || currentTime > horarioHoy.fin) {
    return res.status(403).json({
      success: false,
      message: `Acceso permitido de ${horarioHoy.inicio} a ${horarioHoy.fin}`
    });
  }

  next();
};

// Middleware para log de actividad
const logActivity = (action) => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Solo registrar si la operación fue exitosa
      if (res.statusCode >= 200 && res.statusCode < 400) {
        console.log(`[${new Date().toISOString()}] ${req.user?.email || 'Anonymous'} - ${action} - ${req.method} ${req.originalUrl}`);
      }
      
      originalSend.call(this, data);
    };

    next();
  };
};

// Middleware para rate limiting por usuario
const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    if (!req.user) return next();

    const userId = req.user.id;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Limpiar requests antiguos
    if (requests.has(userId)) {
      const userRequests = requests.get(userId).filter(time => time > windowStart);
      requests.set(userId, userRequests);
    }

    const userRequests = requests.get(userId) || [];
    
    if (userRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Demasiadas peticiones. Intenta más tarde.'
      });
    }

    userRequests.push(now);
    requests.set(userId, userRequests);
    
    next();
  };
};

module.exports = {
  protect,
  authorize,
  requirePermission,
  requireSede,
  requireSedeAccess,
  checkWorkingHours,
  logActivity,
  userRateLimit
};