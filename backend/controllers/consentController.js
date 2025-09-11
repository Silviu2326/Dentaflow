const ConsentForm = require('../models/ConsentForm');
const ConsentRecord = require('../models/ConsentRecord');

// ============= CONSENT FORM TEMPLATES =============

// @desc    Obtener todas las plantillas de consentimiento
// @route   GET /api/consents/templates
// @access  Private
const getConsentTemplates = async (req, res) => {
  try {
    const {
      search,
      categoria,
      activo,
      vigente,
      page = 1,
      limit = 10,
      sort = 'nombre'
    } = req.query;

    // Construir filtro
    let filter = {};

    if (search) {
      filter.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { codigoLegal: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (categoria && categoria !== 'todos') {
      filter.categoria = categoria;
    }

    if (activo !== undefined) {
      filter.activo = activo === 'true';
    }

    if (vigente === 'true') {
      const now = new Date();
      filter.fechaVigenciaDesde = { $lte: now };
      filter.$or = [
        { fechaVigenciaHasta: { $exists: false } },
        { fechaVigenciaHasta: { $gte: now } }
      ];
    }

    // Paginación
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Ordenamiento
    let sortOption = {};
    if (sort) {
      const sortFields = sort.split(',');
      sortFields.forEach(field => {
        if (field.startsWith('-')) {
          sortOption[field.substring(1)] = -1;
        } else {
          sortOption[field] = 1;
        }
      });
    }

    const templates = await ConsentForm.find(filter)
      .sort(sortOption)
      .limit(limitNumber)
      .skip(skip)
      .populate('creadoPor', 'nombre apellidos')
      .populate('actualizadoPor', 'nombre apellidos')
      .populate('aprobadoPor', 'nombre apellidos');

    const total = await ConsentForm.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: templates.length,
      total,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber)
      },
      data: templates
    });
  } catch (error) {
    console.error('Error al obtener plantillas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Obtener plantilla por ID
// @route   GET /api/consents/templates/:id
// @access  Private
const getConsentTemplate = async (req, res) => {
  try {
    const template = await ConsentForm.findById(req.params.id)
      .populate('creadoPor', 'nombre apellidos')
      .populate('actualizadoPor', 'nombre apellidos')
      .populate('aprobadoPor', 'nombre apellidos');

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Plantilla no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Error al obtener plantilla:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de plantilla inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Crear nueva plantilla de consentimiento
// @route   POST /api/consents/templates
// @access  Private
const createConsentTemplate = async (req, res) => {
  try {
    const templateData = {
      ...req.body,
      creadoPor: req.user._id,
      actualizadoPor: req.user._id
    };

    // Verificar si ya existe una plantilla con el mismo nombre
    const existingTemplate = await ConsentForm.findOne({
      nombre: { $regex: new RegExp(`^${req.body.nombre}$`, 'i') },
      activo: true
    });

    if (existingTemplate) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una plantilla activa con ese nombre'
      });
    }

    const template = await ConsentForm.create(templateData);
    await template.populate('creadoPor', 'nombre apellidos');

    res.status(201).json({
      success: true,
      message: 'Plantilla creada exitosamente',
      data: template
    });
  } catch (error) {
    console.error('Error al crear plantilla:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Actualizar plantilla de consentimiento
// @route   PUT /api/consents/templates/:id
// @access  Private
const updateConsentTemplate = async (req, res) => {
  try {
    const template = await ConsentForm.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Plantilla no encontrada'
      });
    }

    // Agregar campos de auditoría
    req.body.actualizadoPor = req.user._id;

    const updatedTemplate = await ConsentForm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('creadoPor actualizadoPor aprobadoPor', 'nombre apellidos');

    res.status(200).json({
      success: true,
      message: 'Plantilla actualizada exitosamente',
      data: updatedTemplate
    });
  } catch (error) {
    console.error('Error al actualizar plantilla:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Crear nueva versión de plantilla
// @route   POST /api/consents/templates/:id/new-version
// @access  Private
const createNewTemplateVersion = async (req, res) => {
  try {
    const template = await ConsentForm.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Plantilla no encontrada'
      });
    }

    const { version, motivoCambio, contenido } = req.body;

    if (!version || !motivoCambio) {
      return res.status(400).json({
        success: false,
        message: 'La versión y el motivo del cambio son obligatorios'
      });
    }

    // Desactivar versión anterior
    template.activo = false;
    await template.save();

    // Crear nueva versión
    const newTemplate = await template.crearNuevaVersion(
      version,
      motivoCambio,
      contenido,
      req.user._id
    );

    await newTemplate.populate('creadoPor', 'nombre apellidos');

    res.status(201).json({
      success: true,
      message: 'Nueva versión creada exitosamente',
      data: newTemplate
    });
  } catch (error) {
    console.error('Error al crear nueva versión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// ============= CONSENT RECORDS =============

// @desc    Obtener registros de consentimiento
// @route   GET /api/consents/records
// @access  Private
const getConsentRecords = async (req, res) => {
  try {
    const {
      search,
      estado,
      pacienteId,
      formularioId,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sort = '-fechaCreacion'
    } = req.query;

    // Construir filtro
    let filter = {};

    if (search) {
      filter.$or = [
        { pacienteNombre: { $regex: search, $options: 'i' } },
        { formularioNombre: { $regex: search, $options: 'i' } }
      ];
    }

    if (estado) {
      filter.estado = estado;
    }

    if (pacienteId) {
      filter.pacienteId = pacienteId;
    }

    if (formularioId) {
      filter.formularioId = formularioId;
    }

    if (dateFrom || dateTo) {
      filter.fechaCreacion = {};
      if (dateFrom) filter.fechaCreacion.$gte = new Date(dateFrom);
      if (dateTo) filter.fechaCreacion.$lte = new Date(dateTo);
    }

    // Paginación
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Ordenamiento
    let sortOption = {};
    if (sort) {
      const sortFields = sort.split(',');
      sortFields.forEach(field => {
        if (field.startsWith('-')) {
          sortOption[field.substring(1)] = -1;
        } else {
          sortOption[field] = 1;
        }
      });
    }

    const records = await ConsentRecord.find(filter)
      .sort(sortOption)
      .limit(limitNumber)
      .skip(skip)
      .populate('pacienteId', 'nombre apellidos email telefono')
      .populate('formularioId', 'nombre categoria version')
      .populate('creadoPor', 'nombre apellidos')
      .populate('enviadoPor', 'nombre apellidos');

    const total = await ConsentRecord.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: records.length,
      total,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber)
      },
      data: records
    });
  } catch (error) {
    console.error('Error al obtener registros:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Crear registro de consentimiento
// @route   POST /api/consents/records
// @access  Private
const createConsentRecord = async (req, res) => {
  try {
    const { pacienteId, formularioId } = req.body;

    // Verificar que el formulario existe y está activo
    const template = await ConsentForm.findOne({ 
      _id: formularioId, 
      activo: true 
    });

    if (!template) {
      return res.status(400).json({
        success: false,
        message: 'Formulario no encontrado o inactivo'
      });
    }

    // Obtener información del paciente
    const Patient = require('../models/Patient');
    const paciente = await Patient.findById(pacienteId);

    if (!paciente) {
      return res.status(400).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }

    // Crear registro
    const recordData = {
      pacienteId,
      formularioId,
      pacienteNombre: `${paciente.nombre} ${paciente.apellidos}`,
      pacienteDni: paciente.dni,
      pacienteEmail: paciente.email,
      pacienteTelefono: paciente.telefono,
      formularioNombre: template.nombre,
      formularioVersion: template.version,
      formularioContenido: template.contenido,
      formularioCategoria: template.categoria,
      creadoPor: req.user._id
    };

    // Calcular fecha de expiración
    if (template.tiempoExpiracion) {
      recordData.fechaExpiracion = new Date(
        Date.now() + template.tiempoExpiracion * 24 * 60 * 60 * 1000
      );
    }

    const record = await ConsentRecord.create(recordData);
    await record.populate([
      { path: 'pacienteId', select: 'nombre apellidos email' },
      { path: 'formularioId', select: 'nombre categoria version' },
      { path: 'creadoPor', select: 'nombre apellidos' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Registro de consentimiento creado exitosamente',
      data: record
    });
  } catch (error) {
    console.error('Error al crear registro:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Enviar consentimiento por email/SMS
// @route   PUT /api/consents/records/:id/send
// @access  Private
const sendConsentRecord = async (req, res) => {
  try {
    const record = await ConsentRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Registro no encontrado'
      });
    }

    const { metodo = 'email' } = req.body;

    await record.marcarComoEnviado(req.user._id, metodo);

    // TODO: Implementar envío real de email/SMS
    // await enviarEmail(record.pacienteEmail, record.tokenAcceso);

    res.status(200).json({
      success: true,
      message: 'Consentimiento enviado exitosamente',
      data: record
    });
  } catch (error) {
    console.error('Error al enviar consentimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Obtener estadísticas de consentimientos
// @route   GET /api/consents/stats
// @access  Private
const getConsentStats = async (req, res) => {
  try {
    const [templateStats, recordStats] = await Promise.all([
      ConsentForm.obtenerEstadisticas(),
      ConsentRecord.obtenerEstadisticas()
    ]);

    res.status(200).json({
      success: true,
      data: {
        plantillas: templateStats,
        registros: recordStats
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// ============= PUBLIC ENDPOINTS FOR PATIENTS =============

// @desc    Obtener consentimiento por token (para pacientes)
// @route   GET /api/consents/sign/:token
// @access  Public
const getConsentByToken = async (req, res) => {
  try {
    const record = await ConsentRecord.buscarPorToken(req.params.token);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Consentimiento no encontrado o expirado'
      });
    }

    // Marcar como visto si es la primera vez
    if (record.estado === 'enviado') {
      await record.marcarComoVisto();
    }

    res.status(200).json({
      success: true,
      data: {
        id: record._id,
        pacienteNombre: record.pacienteNombre,
        formularioNombre: record.formularioNombre,
        formularioContenido: record.formularioContenido,
        formularioVersion: record.formularioVersion,
        fechaExpiracion: record.fechaExpiracion,
        requiereTestigo: record.testigo ? true : false
      }
    });
  } catch (error) {
    console.error('Error al obtener consentimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Firmar consentimiento
// @route   POST /api/consents/sign/:token
// @access  Public
const signConsent = async (req, res) => {
  try {
    const record = await ConsentRecord.buscarPorToken(req.params.token);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Consentimiento no encontrado o expirado'
      });
    }

    if (record.estado !== 'visto' && record.estado !== 'enviado') {
      return res.status(400).json({
        success: false,
        message: 'El consentimiento no puede ser firmado en su estado actual'
      });
    }

    const datosSignature = {
      firma: req.body.firma,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      geolocalizacion: req.body.geolocalizacion,
      testigo: req.body.testigo
    };

    await record.firmar(datosSignature);

    res.status(200).json({
      success: true,
      message: 'Consentimiento firmado exitosamente',
      data: {
        fechaFirma: record.fechaFirma,
        evidencia: record.evidencia
      }
    });
  } catch (error) {
    console.error('Error al firmar consentimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  // Templates
  getConsentTemplates,
  getConsentTemplate,
  createConsentTemplate,
  updateConsentTemplate,
  createNewTemplateVersion,
  
  // Records
  getConsentRecords,
  createConsentRecord,
  sendConsentRecord,
  
  // Stats
  getConsentStats,
  
  // Public
  getConsentByToken,
  signConsent
};