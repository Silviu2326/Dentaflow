const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generar JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Registrar usuario
// @route   POST /api/users/register
// @access  Private (Solo owner y admin_sede pueden crear usuarios)
const registerUser = async (req, res) => {
  try {
    const {
      nombre, apellidos, email, password, role, sede, telefono, dni,
      especialidad, numeroColegiadoProfesional, horarioTrabajo
    } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Usuario ya existe con ese email'
      });
    }

    // Verificar DNI único si se proporciona
    if (dni) {
      const dniExists = await User.findOne({ dni });
      if (dniExists) {
        return res.status(400).json({
          success: false,
          message: 'DNI ya registrado'
        });
      }
    }

    // Crear usuario
    const user = await User.create({
      nombre,
      apellidos,
      email,
      password,
      role,
      sede,
      telefono,
      dni,
      especialidad,
      numeroColegiadoProfesional,
      horarioTrabajo,
      creadoPor: req.user.id
    });

    // Generar token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: {
        user: user.toInfoBasica(),
        token
      }
    });

  } catch (error) {
    console.error('Error en registerUser:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login usuario
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona email y contraseña'
      });
    }

    // Buscar usuario y incluir password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!user.activo) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta desactivada. Contacta con el administrador'
      });
    }

    // Verificar si está bloqueado
    if (user.estaBloqueado) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta temporalmente bloqueada por múltiples intentos fallidos'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await user.compararPassword(password);

    if (!isPasswordValid) {
      // Incrementar intentos de login
      await user.incrementarIntentosLogin();
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Login exitoso - resetear intentos y actualizar último acceso
    await user.resetearIntentosLogin();
    await user.actualizarUltimoAcceso();

    // Generar token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: user.toInfoBasica(),
        token
      }
    });

  } catch (error) {
    console.error('Error en loginUser:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener usuario actual
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: user.toInfoBasica()
      }
    });

  } catch (error) {
    console.error('Error en getMe:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Actualizar perfil usuario
// @route   PUT /api/users/me
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const {
      nombre, apellidos, telefono, horarioTrabajo, configuracion
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar campos permitidos
    if (nombre) user.nombre = nombre;
    if (apellidos) user.apellidos = apellidos;
    if (telefono) user.telefono = telefono;
    if (horarioTrabajo) user.horarioTrabajo = horarioTrabajo;
    if (configuracion) user.configuracion = { ...user.configuracion, ...configuracion };

    user.actualizadoPor = req.user.id;
    user.fechaActualizacion = Date.now();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: {
        user: user.toInfoBasica()
      }
    });

  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cambiar contraseña
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Proporciona contraseña actual y nueva'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await user.compararPassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar contraseña
    user.password = newPassword;
    user.actualizadoPor = req.user.id;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error en changePassword:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private (Solo owner, hq_analyst, admin_sede)
const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role = '',
      sede = '',
      activo = ''
    } = req.query;

    // Construir filtros
    const filters = {};

    if (search) {
      filters.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { apellidos: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) filters.role = role;
    if (sede) filters.sede = sede;
    if (activo !== '') filters.activo = activo === 'true';

    // Filtro por sede para admin_sede
    if (req.user.role === 'admin_sede') {
      filters.sede = req.user.sede;
    }

    // Ejecutar consulta
    const users = await User.find(filters)
      .select('-password -tokenRecuperacion')
      .sort({ fechaCreacion: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('creadoPor', 'nombre apellidos')
      .populate('actualizadoPor', 'nombre apellidos');

    const total = await User.countDocuments(filters);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Error en getUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener usuario por ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -tokenRecuperacion')
      .populate('creadoPor', 'nombre apellidos')
      .populate('actualizadoPor', 'nombre apellidos');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Error en getUserById:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Actualizar usuario
// @route   PUT /api/users/:id
// @access  Private (Solo owner y admin_sede)
const updateUser = async (req, res) => {
  try {
    const {
      nombre, apellidos, email, role, sede, telefono, dni,
      especialidad, numeroColegiadoProfesional, horarioTrabajo, activo
    } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar permisos para modificar
    if (req.user.role === 'admin_sede' && user.sede !== req.user.sede) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para modificar este usuario'
      });
    }

    // Verificar email único
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email ya registrado'
        });
      }
    }

    // Verificar DNI único
    if (dni && dni !== user.dni) {
      const dniExists = await User.findOne({ dni });
      if (dniExists) {
        return res.status(400).json({
          success: false,
          message: 'DNI ya registrado'
        });
      }
    }

    // Actualizar campos
    if (nombre) user.nombre = nombre;
    if (apellidos) user.apellidos = apellidos;
    if (email) user.email = email;
    if (role) user.role = role;
    if (sede) user.sede = sede;
    if (telefono) user.telefono = telefono;
    if (dni) user.dni = dni;
    if (especialidad) user.especialidad = especialidad;
    if (numeroColegiadoProfesional) user.numeroColegiadoProfesional = numeroColegiadoProfesional;
    if (horarioTrabajo) user.horarioTrabajo = horarioTrabajo;
    if (typeof activo === 'boolean') user.activo = activo;

    user.actualizadoPor = req.user.id;
    user.fechaActualizacion = Date.now();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: {
        user: user.toInfoBasica()
      }
    });

  } catch (error) {
    console.error('Error en updateUser:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Eliminar usuario
// @route   DELETE /api/users/:id
// @access  Private (Solo owner)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // No permitir eliminar el propio usuario
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar tu propio usuario'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error en deleteUser:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Solicitar recuperación de contraseña
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No existe usuario con ese email'
      });
    }

    if (!user.activo) {
      return res.status(400).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }

    // Generar token de recuperación
    const resetToken = user.generarTokenRecuperacion();
    await user.save({ validateBeforeSave: false });

    // Aquí se enviaría el email con el token
    // Por ahora solo devolvemos el token (EN PRODUCCIÓN QUITAR ESTO)
    res.status(200).json({
      success: true,
      message: 'Token de recuperación generado',
      resetToken // QUITAR EN PRODUCCIÓN
    });

  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Resetear contraseña
// @route   PUT /api/users/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Proporciona nueva contraseña'
      });
    }

    // Buscar usuario por token
    const user = await User.buscarPorTokenRecuperacion(token);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    // Actualizar contraseña y limpiar token
    user.password = password;
    user.tokenRecuperacion = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword
};