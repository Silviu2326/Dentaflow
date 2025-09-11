const Patient = require('../models/Patient');
const User = require('../models/User');

// @desc    Crear nuevo paciente
// @route   POST /api/patients
// @access  Private
const createPatient = async (req, res) => {
  try {
    const {
      nombre, apellidos, email, telefono, fechaNacimiento, genero,
      dni, nie, profesion, direccion, contactoEmergencia,
      alergias, medicamentosActuales, historialMedico,
      informacionDental, habitos, sede, notas, origen
    } = req.body;

    // Verificar si ya existe un paciente con ese email
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un paciente con ese email'
      });
    }

    // Verificar DNI único si se proporciona
    if (dni) {
      const dniExists = await Patient.findOne({ dni });
      if (dniExists) {
        return res.status(400).json({
          success: false,
          message: 'DNI ya registrado'
        });
      }
    }

    // Verificar NIE único si se proporciona
    if (nie) {
      const nieExists = await Patient.findOne({ nie });
      if (nieExists) {
        return res.status(400).json({
          success: false,
          message: 'NIE ya registrado'
        });
      }
    }

    // Crear paciente
    const patient = await Patient.create({
      nombre,
      apellidos,
      email,
      telefono,
      fechaNacimiento,
      genero,
      dni,
      nie,
      profesion,
      direccion,
      contactoEmergencia,
      alergias,
      medicamentosActuales,
      historialMedico,
      informacionDental,
      habitos,
      sede: sede || req.user.sede,
      notas,
      origen,
      creadoPor: req.user.id,
      estado: 'activo'
    });

    res.status(201).json({
      success: true,
      message: 'Paciente creado exitosamente',
      data: patient.toInfoBasica()
    });

  } catch (error) {
    console.error('Error en createPatient:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener todos los pacientes
// @route   GET /api/patients
// @access  Private
const getPatients = async (req, res) => {
  try {
    const {
      search = '',
      estado = '',
      sede = '',
      page = 1,
      limit = 20,
      sortBy = 'apellidos',
      sortOrder = 'asc'
    } = req.query;

    // Construir filtros
    const filters = {};

    // Filtro de búsqueda
    if (search) {
      filters.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { apellidos: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { telefono: { $regex: search, $options: 'i' } },
        { numeroHistoriaClinica: { $regex: search, $options: 'i' } }
      ];
    }

    if (estado) filters.estado = estado;
    if (sede) filters.sede = sede;

    // Filtrar por sede si el usuario tiene sede específica
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      filters.sede = req.user.sede;
    }

    // Configurar ordenamiento
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Ejecutar consulta
    const patients = await Patient.find(filters)
      .select('nombre apellidos email telefono fechaNacimiento estado sede ultimaVisita numeroHistoriaClinica')
      .populate('proximaCita', 'fecha horaInicio tratamiento')
      .populate('profesionalAsignado', 'nombre apellidos')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Patient.countDocuments(filters);

    // Agregar información calculada
    const patientsWithInfo = patients.map(patient => {
      const patientObj = patient.toObject();
      patientObj.edad = patient.edad;
      patientObj.nombreCompleto = patient.nombreCompleto;
      return patientObj;
    });

    res.status(200).json({
      success: true,
      data: {
        patients: patientsWithInfo,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error en getPatients:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener paciente por ID
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('proximaCita', 'fecha horaInicio tratamiento profesional')
      .populate('profesionalAsignado', 'nombre apellidos especialidad')
      .populate('creadoPor', 'nombre apellidos')
      .populate('actualizadoPor', 'nombre apellidos')
      .populate('historialCambios.realizadoPor', 'nombre apellidos');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }

    // Verificar acceso por sede
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      if (patient.sede !== req.user.sede) {
        return res.status(403).json({
          success: false,
          message: 'No tienes acceso a este paciente'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: patient
    });

  } catch (error) {
    console.error('Error en getPatientById:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Actualizar paciente
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }

    // Verificar acceso por sede
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      if (patient.sede !== req.user.sede) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para modificar este paciente'
        });
      }
    }

    const {
      nombre, apellidos, email, telefono, fechaNacimiento, genero,
      dni, nie, profesion, direccion, contactoEmergencia,
      alergias, medicamentosActuales, historialMedico,
      informacionDental, habitos, notas, preferenciasComunicacion,
      informacionFinanciera
    } = req.body;

    // Verificar email único
    if (email && email !== patient.email) {
      const emailExists = await Patient.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email ya registrado por otro paciente'
        });
      }
    }

    // Verificar DNI único
    if (dni && dni !== patient.dni) {
      const dniExists = await Patient.findOne({ dni });
      if (dniExists) {
        return res.status(400).json({
          success: false,
          message: 'DNI ya registrado'
        });
      }
    }

    // Registrar cambios importantes en historial
    const cambiosImportantes = ['email', 'telefono', 'fechaNacimiento', 'dni', 'nie'];
    for (const campo of cambiosImportantes) {
      if (req.body[campo] && req.body[campo] !== patient[campo]) {
        patient.historialCambios.push({
          cambio: `${campo} actualizado`,
          valorAnterior: String(patient[campo] || ''),
          valorNuevo: String(req.body[campo]),
          realizadoPor: req.user.id
        });
      }
    }

    // Actualizar campos
    if (nombre) patient.nombre = nombre;
    if (apellidos) patient.apellidos = apellidos;
    if (email) patient.email = email;
    if (telefono) patient.telefono = telefono;
    if (fechaNacimiento) patient.fechaNacimiento = fechaNacimiento;
    if (genero) patient.genero = genero;
    if (dni) patient.dni = dni;
    if (nie) patient.nie = nie;
    if (profesion) patient.profesion = profesion;
    if (direccion) patient.direccion = { ...patient.direccion, ...direccion };
    if (contactoEmergencia) patient.contactoEmergencia = { ...patient.contactoEmergencia, ...contactoEmergencia };
    if (alergias) patient.alergias = alergias;
    if (medicamentosActuales) patient.medicamentosActuales = medicamentosActuales;
    if (historialMedico) patient.historialMedico = { ...patient.historialMedico, ...historialMedico };
    if (informacionDental) patient.informacionDental = { ...patient.informacionDental, ...informacionDental };
    if (habitos) patient.habitos = { ...patient.habitos, ...habitos };
    if (notas !== undefined) patient.notas = notas;
    if (preferenciasComunicacion) patient.preferenciasComunicacion = { ...patient.preferenciasComunicacion, ...preferenciasComunicacion };
    if (informacionFinanciera) patient.informacionFinanciera = { ...patient.informacionFinanciera, ...informacionFinanciera };

    patient.actualizadoPor = req.user.id;
    patient.fechaActualizacion = Date.now();

    await patient.save();

    res.status(200).json({
      success: true,
      message: 'Paciente actualizado exitosamente',
      data: patient
    });

  } catch (error) {
    console.error('Error en updatePatient:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cambiar estado del paciente
// @route   PUT /api/patients/:id/status
// @access  Private
const changePatientStatus = async (req, res) => {
  try {
    const { estado, motivo } = req.body;

    if (!estado) {
      return res.status(400).json({
        success: false,
        message: 'El nuevo estado es obligatorio'
      });
    }

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }

    // Verificar acceso por sede
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      if (patient.sede !== req.user.sede) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para cambiar el estado de este paciente'
        });
      }
    }

    await patient.cambiarEstado(estado, motivo, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Estado del paciente actualizado exitosamente',
      data: patient.toInfoBasica()
    });

  } catch (error) {
    console.error('Error en changePatientStatus:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Buscar pacientes
// @route   GET /api/patients/search
// @access  Private
const searchPatients = async (req, res) => {
  try {
    const { q, sede, estado, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Término de búsqueda requerido'
      });
    }

    // Filtrar por sede del usuario si corresponde
    let filtroSede = sede;
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      filtroSede = req.user.sede;
    }

    const patients = await Patient.buscarPacientes(q, filtroSede, estado)
      .limit(parseInt(limit));

    // Agregar información calculada
    const patientsWithInfo = patients.map(patient => {
      const patientObj = patient.toObject();
      patientObj.edad = patient.edad;
      patientObj.nombreCompleto = patient.nombreCompleto;
      return patientObj;
    });

    res.status(200).json({
      success: true,
      data: patientsWithInfo
    });

  } catch (error) {
    console.error('Error en searchPatients:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener historial médico del paciente
// @route   GET /api/patients/:id/medical-history
// @access  Private
const getPatientMedicalHistory = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .select('nombre apellidos numeroHistoriaClinica historialMedico alergias medicamentosActuales informacionDental habitos consentimientos')
      .populate('historialCambios.realizadoPor', 'nombre apellidos');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }

    // Verificar permisos para ver historial médico
    if (!req.user.tienePermiso('clinical_history:read')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver el historial médico'
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });

  } catch (error) {
    console.error('Error en getPatientMedicalHistory:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Asignar profesional al paciente
// @route   PUT /api/patients/:id/assign-professional
// @access  Private
const assignProfessional = async (req, res) => {
  try {
    const { profesionalId } = req.body;

    if (!profesionalId) {
      return res.status(400).json({
        success: false,
        message: 'ID del profesional es obligatorio'
      });
    }

    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }

    const professional = await User.findById(profesionalId);
    if (!professional || professional.role !== 'clinical_professional') {
      return res.status(400).json({
        success: false,
        message: 'Profesional no válido'
      });
    }

    patient.profesionalAsignado = profesionalId;
    patient.actualizadoPor = req.user.id;
    
    patient.historialCambios.push({
      cambio: `Profesional asignado: ${professional.nombreCompleto}`,
      valorAnterior: patient.profesionalAsignado ? 'Otro profesional' : 'Sin asignar',
      valorNuevo: professional.nombreCompleto,
      realizadoPor: req.user.id
    });

    await patient.save();

    res.status(200).json({
      success: true,
      message: 'Profesional asignado exitosamente',
      data: patient.toInfoBasica()
    });

  } catch (error) {
    console.error('Error en assignProfessional:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener estadísticas de pacientes
// @route   GET /api/patients/stats
// @access  Private
const getPatientStats = async (req, res) => {
  try {
    const { sede } = req.query;

    // Filtrar por sede si corresponde
    const matchStage = {};
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      matchStage.sede = req.user.sede;
    } else if (sede) {
      matchStage.sede = sede;
    }

    const stats = await Patient.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          activos: { $sum: { $cond: [{ $eq: ['$estado', 'activo'] }, 1, 0] } },
          inactivos: { $sum: { $cond: [{ $eq: ['$estado', 'inactivo'] }, 1, 0] } },
          pendientes: { $sum: { $cond: [{ $eq: ['$estado', 'pendiente'] }, 1, 0] } },
          conAlergias: { $sum: { $cond: [{ $gt: [{ $size: { $ifNull: ['$alergias', []] } }, 0] }, 1, 0] } },
          conMedicamentos: { $sum: { $cond: [{ $gt: [{ $size: { $ifNull: ['$medicamentosActuales', []] } }, 0] }, 1, 0] } }
        }
      }
    ]);

    // Estadísticas por sede
    const statsBySede = await Patient.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$sede',
          total: { $sum: 1 },
          activos: { $sum: { $cond: [{ $eq: ['$estado', 'activo'] }, 1, 0] } }
        }
      }
    ]);

    // Estadísticas por edad
    const statsByAge = await Patient.aggregate([
      { $match: matchStage },
      {
        $project: {
          edad: {
            $floor: {
              $divide: [
                { $subtract: [new Date(), '$fechaNacimiento'] },
                1000 * 60 * 60 * 24 * 365
              ]
            }
          }
        }
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lt: ['$edad', 18] }, then: 'menores' },
                { case: { $lt: ['$edad', 35] }, then: 'jovenes' },
                { case: { $lt: ['$edad', 65] }, then: 'adultos' },
                { case: { $gte: ['$edad', 65] }, then: 'mayores' }
              ],
              default: 'otros'
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        general: stats[0] || {
          total: 0, activos: 0, inactivos: 0, pendientes: 0,
          conAlergias: 0, conMedicamentos: 0
        },
        porSede: statsBySede,
        porEdad: statsByAge
      }
    });

  } catch (error) {
    console.error('Error en getPatientStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Eliminar paciente
// @route   DELETE /api/patients/:id
// @access  Private (Solo owner)
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }

    // Solo permitir eliminación por owner
    if (req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Solo el propietario puede eliminar pacientes'
      });
    }

    await Patient.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Paciente eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error en deletePatient:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  changePatientStatus,
  searchPatients,
  getPatientMedicalHistory,
  assignProfessional,
  getPatientStats,
  deletePatient
};