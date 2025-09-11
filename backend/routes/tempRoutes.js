const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Ruta de prueba simple
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Rutas temporales funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// @desc    Login temporal (SIN JWT - SOLO PARA TESTING)
// @route   POST /api/temp/login
// @access  Public - SOLO PARA TESTING
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    const User = mongoose.model('User');
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Para testing, aceptamos "password" directamente sin verificar hash
    if (password !== 'password') {
      return res.status(401).json({
        success: false,
        message: 'Contraseña incorrecta'
      });
    }

    const roleMapping = {
      'owner': 'Owner / HQ Admin',
      'hq_analyst': 'HQ Analista', 
      'admin_sede': 'Admin de Sede',
      'reception': 'Recepción',
      'clinical_professional': 'Profesional Clínico',
      'assistant_nurse': 'Asistente/Enfermería',
      'finance': 'Finanzas / Caja',
      'marketing': 'Marketing',
      'operations': 'Operaciones / Inventario',
      'external_auditor': 'Auditor Externo (RO)'
    };

    // Simular token (normalmente sería JWT)
    const mockToken = `mock_token_${user._id}_${Date.now()}`;

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user._id,
          nombre: user.nombre,
          apellidos: user.apellidos,
          email: user.email,
          role: user.role,
          displayRole: roleMapping[user.role] || user.role,
          activo: user.activo
        },
        token: mockToken,
        note: 'Este es un token simulado - en producción sería un JWT'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el login',
      error: error.message
    });
  }
});

// @desc    Obtener todos los usuarios (TEMPORAL - SIN AUTENTICACIÓN)
// @route   GET /api/temp/users
// @access  Public - SOLO PARA TESTING
router.get('/users', async (req, res) => {
  try {
    // Intentar obtener el modelo User
    let User;
    try {
      User = mongoose.model('User');
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Modelo User no encontrado. Ejecuta npm run seed primero.',
        error: error.message
      });
    }

    const users = await User.find({}, '-password') // Excluir password por seguridad
      .sort({ fechaCreacion: -1 })
      .lean();

    const roleMapping = {
      'owner': 'Owner / HQ Admin',
      'hq_analyst': 'HQ Analista', 
      'admin_sede': 'Admin de Sede',
      'reception': 'Recepción',
      'clinical_professional': 'Profesional Clínico',
      'assistant_nurse': 'Asistente/Enfermería',
      'finance': 'Finanzas / Caja',
      'marketing': 'Marketing',
      'operations': 'Operaciones / Inventario',
      'external_auditor': 'Auditor Externo (RO)'
    };

    const usersWithDisplayRole = users.map(user => ({
      ...user,
      displayRole: roleMapping[user.role] || user.role,
      passwordNote: 'password (hasheada en BD)'
    }));

    res.json({
      success: true,
      message: 'Lista de usuarios obtenida exitosamente',
      total: users.length,
      data: usersWithDisplayRole
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
});

// @desc    Obtener estadísticas de usuarios
// @route   GET /api/temp/users/stats
// @access  Public - SOLO PARA TESTING
router.get('/users/stats', async (req, res) => {
  try {
    const User = mongoose.model('User');
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          activos: { $sum: { $cond: ['$activo', 1, 0] } }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const roleMapping = {
      'owner': 'Owner / HQ Admin',
      'hq_analyst': 'HQ Analista', 
      'admin_sede': 'Admin de Sede',
      'reception': 'Recepción',
      'clinical_professional': 'Profesional Clínico',
      'assistant_nurse': 'Asistente/Enfermería',
      'finance': 'Finanzas / Caja',
      'marketing': 'Marketing',
      'operations': 'Operaciones / Inventario',
      'external_auditor': 'Auditor Externo (RO)'
    };

    const statsWithDisplayRole = stats.map(stat => ({
      role: stat._id,
      displayRole: roleMapping[stat._id] || stat._id,
      count: stat.count,
      activos: stat.activos
    }));

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ activo: true });

    res.json({
      success: true,
      message: 'Estadísticas de usuarios obtenidas exitosamente',
      data: {
        resumen: {
          total: totalUsers,
          activos: activeUsers,
          inactivos: totalUsers - activeUsers
        },
        porRol: statsWithDisplayRole
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

// @desc    Recrear todos los usuarios
// @route   POST /api/temp/users/recreate
// @access  Public - SOLO PARA TESTING
router.post('/users/recreate', async (req, res) => {
  try {
    const User = mongoose.model('User');
    // Eliminar todos los usuarios existentes
    const deletedCount = await User.deleteMany({});
    
    // Mensaje de información
    console.log('Usuarios eliminados, necesitarás ejecutar npm run seed para recrearlos');
    
    res.json({
      success: true,
      message: 'Usuarios eliminados. Ejecuta npm run seed para recrearlos',
      data: {
        eliminados: deletedCount.deletedCount
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al recrear usuarios',
      error: error.message
    });
  }
});

module.exports = router;