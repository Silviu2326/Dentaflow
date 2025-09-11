const DocumentTemplate = require('../models/DocumentTemplate');
const SignedDocument = require('../models/SignedDocument');
const Patient = require('../models/Patient');
const User = require('../models/User');

// ============= CONTROLADORES PARA PLANTILLAS =============

// @desc    Crear nueva plantilla de documento
// @route   POST /api/documents/templates
// @access  Private
const createTemplate = async (req, res) => {
  try {
    const {
      nombre, descripcion, tipo, categoria, contenido, variables,
      requiereFirma, configLegal, acceso, personalizacion, tags,
      idiomas, notificaciones
    } = req.body;

    // Verificar que no existe una plantilla con el mismo nombre
    const existingTemplate = await DocumentTemplate.findOne({ 
      nombre, 
      sede: req.user.sede || 'centro' 
    });
    
    if (existingTemplate) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una plantilla con ese nombre'
      });
    }

    // Crear plantilla
    const template = await DocumentTemplate.create({
      nombre,
      descripcion,
      tipo,
      categoria,
      estado: 'draft',
      versiones: [{
        numero: '1.0',
        contenido: contenido || 'Contenido de la plantilla',
        cambios: 'Versión inicial',
        creadoPor: req.user.id,
        activa: true
      }],
      variables: variables || [],
      requiereFirma: requiereFirma || {
        paciente: true,
        profesional: true,
        testigo: false
      },
      configLegal: configLegal || {},
      acceso: {
        ...acceso,
        sedes: acceso?.sedes || [req.user.sede || 'centro']
      },
      personalizacion: personalizacion || {},
      tags: tags || [],
      idiomas: idiomas || [{ codigo: 'es', nombre: 'Español' }],
      notificaciones: notificaciones || {},
      sede: req.user.sede || 'centro',
      creadoPor: req.user.id,
      historialCambios: [{
        accion: 'creacion',
        descripcion: 'Plantilla creada',
        usuario: req.user.id
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Plantilla creada exitosamente',
      data: template.toResumen()
    });

  } catch (error) {
    console.error('Error en createTemplate:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener todas las plantillas
// @route   GET /api/documents/templates
// @access  Private
const getTemplates = async (req, res) => {
  try {
    const {
      nombre = '',
      tipo = '',
      categoria = '',
      estado = '',
      sede = '',
      tags = '',
      page = 1,
      limit = 20,
      sortBy = 'fechaActualizacion',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filtros = {};
    
    if (nombre) filtros.nombre = nombre;
    if (tipo) filtros.tipo = tipo;
    if (categoria) filtros.categoria = categoria;
    if (estado) filtros.estado = estado;
    if (tags) filtros.tags = tags.split(',').map(tag => tag.trim());

    // Filtrar por sede si el usuario tiene sede específica
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      filtros.sede = req.user.sede;
    } else if (sede) {
      filtros.sede = sede;
    }

    // Configurar ordenamiento
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Ejecutar consulta
    const query = DocumentTemplate.buscarPlantillas(filtros);
    
    const templates = await query
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Contar total para paginación
    const totalQuery = DocumentTemplate.buscarPlantillas(filtros);
    const total = await DocumentTemplate.countDocuments(totalQuery.getFilter());

    // Convertir a resumen
    const templatesWithInfo = templates.map(template => {
      const templateObj = template.toResumen();
      return {
        ...templateObj,
        lastUpdate: template.fechaActualizacion,
        usage: template.estadisticas.vecesUsado
      };
    });

    res.status(200).json({
      success: true,
      data: {
        templates: templatesWithInfo,
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
    console.error('Error en getTemplates:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener plantilla por ID
// @route   GET /api/documents/templates/:id
// @access  Private
const getTemplateById = async (req, res) => {
  try {
    const template = await DocumentTemplate.findById(req.params.id)
      .populate('creadoPor', 'nombre apellidos')
      .populate('actualizadoPor', 'nombre apellidos')
      .populate('historialCambios.usuario', 'nombre apellidos');

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Plantilla no encontrada'
      });
    }

    // Verificar acceso por sede
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      if (template.sede !== req.user.sede) {
        return res.status(403).json({
          success: false,
          message: 'No tienes acceso a esta plantilla'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: template
    });

  } catch (error) {
    console.error('Error en getTemplateById:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Actualizar plantilla
// @route   PUT /api/documents/templates/:id
// @access  Private
const updateTemplate = async (req, res) => {
  try {
    const template = await DocumentTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Plantilla no encontrada'
      });
    }

    // Verificar permisos
    if (template.creadoPor.toString() !== req.user.id && 
        !['owner', 'hq_analyst', 'admin_sede'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para modificar esta plantilla'
      });
    }

    const {
      nombre, descripcion, contenido, variables, requiereFirma,
      configLegal, acceso, personalizacion, tags, idiomas,
      notificaciones, cambios
    } = req.body;

    // Si se proporciona nuevo contenido, crear nueva versión
    if (contenido && contenido !== template.versionActivaObj?.contenido) {
      await template.crearNuevaVersion(
        contenido, 
        cambios || 'Actualización de contenido', 
        req.user.id
      );
    }

    // Actualizar otros campos
    if (nombre) template.nombre = nombre;
    if (descripcion !== undefined) template.descripcion = descripcion;
    if (variables !== undefined) template.variables = variables;
    if (requiereFirma) template.requiereFirma = { ...template.requiereFirma, ...requiereFirma };
    if (configLegal) template.configLegal = { ...template.configLegal, ...configLegal };
    if (acceso) template.acceso = { ...template.acceso, ...acceso };
    if (personalizacion) template.personalizacion = { ...template.personalizacion, ...personalizacion };
    if (tags !== undefined) template.tags = tags;
    if (idiomas !== undefined) template.idiomas = idiomas;
    if (notificaciones) template.notificaciones = { ...template.notificaciones, ...notificaciones };

    template.actualizadoPor = req.user.id;

    await template.save();

    res.status(200).json({
      success: true,
      message: 'Plantilla actualizada exitosamente',
      data: template
    });

  } catch (error) {
    console.error('Error en updateTemplate:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Activar/Desactivar plantilla
// @route   PUT /api/documents/templates/:id/status
// @access  Private
const changeTemplateStatus = async (req, res) => {
  try {
    const { estado, motivo } = req.body;

    const template = await DocumentTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Plantilla no encontrada'
      });
    }

    // Verificar permisos
    if (!['owner', 'hq_analyst', 'admin_sede'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para cambiar el estado de plantillas'
      });
    }

    if (estado === 'active') {
      await template.activar(req.user.id);
    } else if (estado === 'inactive') {
      await template.desactivar(req.user.id, motivo);
    } else {
      template.estado = estado;
      template.actualizadoPor = req.user.id;
      await template.save();
    }

    res.status(200).json({
      success: true,
      message: 'Estado de plantilla actualizado exitosamente',
      data: template.toResumen()
    });

  } catch (error) {
    console.error('Error en changeTemplateStatus:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ============= CONTROLADORES PARA DOCUMENTOS FIRMADOS =============

// @desc    Generar documento para firma
// @route   POST /api/documents/signed
// @access  Private
const generateSignedDocument = async (req, res) => {
  try {
    const {
      plantillaId, pacienteId, variables, tratamiento, presupuesto,
      cita, requiereTestigo, tutorLegal, fechaVencimiento
    } = req.body;

    // Verificar plantilla
    const template = await DocumentTemplate.findById(plantillaId);
    if (!template || template.estado !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Plantilla no válida o inactiva'
      });
    }

    // Verificar paciente
    const patient = await Patient.findById(pacienteId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }

    // Procesar contenido con variables
    let contenidoFinal = template.versionActivaObj.contenido;
    const variablesResueltas = [];

    // Reemplazar variables del sistema
    contenidoFinal = contenidoFinal
      .replace(/\{\{paciente\.nombre\}\}/g, patient.nombreCompleto)
      .replace(/\{\{paciente\.dni\}\}/g, patient.dni || '')
      .replace(/\{\{profesional\.nombre\}\}/g, req.user.nombreCompleto)
      .replace(/\{\{fecha\}\}/g, new Date().toLocaleDateString('es-ES'));

    // Reemplazar variables personalizadas
    if (variables) {
      Object.keys(variables).forEach(key => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        contenidoFinal = contenidoFinal.replace(regex, variables[key]);
        variablesResueltas.push({
          nombre: key,
          valor: variables[key]
        });
      });
    }

    // Configurar firmas requeridas
    const firmas = [];
    
    if (template.requiereFirma.paciente) {
      firmas.push({
        tipo: 'paciente',
        firmante: pacienteId,
        tipoRef: 'Patient',
        nombreCompleto: patient.nombreCompleto,
        dni: patient.dni,
        firmada: false
      });
    }

    if (template.requiereFirma.profesional) {
      firmas.push({
        tipo: 'profesional',
        firmante: req.user.id,
        tipoRef: 'User',
        nombreCompleto: req.user.nombreCompleto,
        dni: req.user.dni,
        firmada: false
      });
    }

    if (requiereTestigo && template.requiereFirma.testigo) {
      // Agregar testigo si se especifica
      firmas.push({
        tipo: 'testigo',
        firmante: req.user.id, // Por defecto el mismo profesional
        tipoRef: 'User',
        nombreCompleto: req.user.nombreCompleto,
        firmada: false
      });
    }

    // Configurar vencimiento
    const vencimiento = fechaVencimiento ? 
      new Date(fechaVencimiento) : 
      new Date(Date.now() + (template.configLegal.periodoValidez || 30) * 24 * 60 * 60 * 1000);

    // Crear documento firmado
    const signedDoc = await SignedDocument.create({
      plantilla: plantillaId,
      nombrePlantilla: template.nombre,
      versionPlantilla: template.versionActual,
      paciente: pacienteId,
      nombrePaciente: patient.nombreCompleto,
      profesional: req.user.id,
      nombreProfesional: req.user.nombreCompleto,
      contenidoOriginal: template.versionActivaObj.contenido,
      contenidoFinal,
      variables: variablesResueltas,
      firmas,
      fechaVencimiento: vencimiento,
      tratamiento,
      presupuesto,
      cita,
      aspectosLegales: {
        requiereTestigo: requiereTestigo || false,
        tutorLegal,
        consentimientoInformado: template.tipo === 'consentimiento'
      },
      sede: req.user.sede || patient.sede,
      creadoPor: req.user.id,
      auditoria: [{
        accion: 'creacion',
        usuario: req.user.id,
        detalles: 'Documento generado para firma'
      }]
    });

    // Incrementar uso de la plantilla
    await template.incrementarUso();

    res.status(201).json({
      success: true,
      message: 'Documento generado exitosamente',
      data: {
        id: signedDoc._id,
        tokenAcceso: signedDoc.tokenAcceso,
        firmasRequeridas: signedDoc.firmas.length,
        fechaVencimiento: signedDoc.fechaVencimiento,
        urlFirma: `/firma/${signedDoc.tokenAcceso}`
      }
    });

  } catch (error) {
    console.error('Error en generateSignedDocument:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener documentos firmados
// @route   GET /api/documents/signed
// @access  Private
const getSignedDocuments = async (req, res) => {
  try {
    const {
      paciente = '',
      estado = '',
      plantilla = '',
      profesional = '',
      sede = '',
      fechaDesde = '',
      fechaHasta = '',
      vencidos = '',
      page = 1,
      limit = 20,
      sortBy = 'fechaCreacion',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filtros = {};
    
    if (paciente) filtros.paciente = paciente;
    if (estado) filtros.estado = estado;
    if (plantilla) filtros.plantilla = plantilla;
    if (profesional) filtros.profesional = profesional;
    if (fechaDesde) filtros.fechaDesde = fechaDesde;
    if (fechaHasta) filtros.fechaHasta = fechaHasta;
    if (vencidos === 'true') filtros.vencidos = true;

    // Filtrar por sede si corresponde
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      filtros.sede = req.user.sede;
    } else if (sede) {
      filtros.sede = sede;
    }

    // Configurar ordenamiento
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Ejecutar consulta
    const query = SignedDocument.buscarDocumentos(filtros);
    
    const documents = await query
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Contar total
    const totalQuery = SignedDocument.buscarDocumentos(filtros);
    const total = await SignedDocument.countDocuments(totalQuery.getFilter());

    // Convertir a formato para frontend
    const documentsWithInfo = documents.map(doc => doc.toResumen());

    res.status(200).json({
      success: true,
      data: {
        documents: documentsWithInfo,
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
    console.error('Error en getSignedDocuments:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener documento firmado por ID
// @route   GET /api/documents/signed/:id
// @access  Private
const getSignedDocumentById = async (req, res) => {
  try {
    const document = await SignedDocument.findById(req.params.id)
      .populate('paciente', 'nombre apellidos numeroHistoriaClinica email telefono')
      .populate('profesional', 'nombre apellidos especialidad')
      .populate('plantilla', 'nombre tipo categoria')
      .populate('auditoria.usuario', 'nombre apellidos');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento no encontrado'
      });
    }

    // Verificar acceso
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      if (document.sede !== req.user.sede) {
        return res.status(403).json({
          success: false,
          message: 'No tienes acceso a este documento'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: document
    });

  } catch (error) {
    console.error('Error en getSignedDocumentById:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Firmar documento
// @route   POST /api/documents/signed/:id/sign
// @access  Public (con token)
const signDocument = async (req, res) => {
  try {
    const { tipo, firmante, metodoFirma, ip, dispositivo, ubicacion } = req.body;

    const document = await SignedDocument.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento no encontrado'
      });
    }

    if (document.estado !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Este documento ya no está disponible para firma'
      });
    }

    if (document.estaVencido) {
      return res.status(400).json({
        success: false,
        message: 'Este documento ha vencido'
      });
    }

    // Buscar la firma pendiente
    const firma = document.firmas.find(f => 
      f.tipo === tipo && 
      f.firmante.toString() === firmante && 
      !f.firmada
    );

    if (!firma) {
      return res.status(400).json({
        success: false,
        message: 'Firma no válida o ya completada'
      });
    }

    // Datos de la firma
    const datosFirma = {
      tipo,
      firmante,
      nombreCompleto: firma.nombreCompleto,
      metodoFirma: metodoFirma || 'digital',
      ip,
      dispositivo,
      ubicacion
    };

    await document.agregarFirma(datosFirma, req.user?.id);

    res.status(200).json({
      success: true,
      message: 'Documento firmado exitosamente',
      data: {
        firmasCompletadas: document.firmas.filter(f => f.firmada).length,
        firmasRequeridas: document.firmas.length,
        documentoCompleto: document.completamenteFirmado
      }
    });

  } catch (error) {
    console.error('Error en signDocument:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener estadísticas de documentos
// @route   GET /api/documents/stats
// @access  Private
const getDocumentStats = async (req, res) => {
  try {
    const { sede, fechaDesde, fechaHasta } = req.query;

    const filtros = {};
    
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      filtros.sede = req.user.sede;
    } else if (sede) {
      filtros.sede = sede;
    }

    if (fechaDesde) filtros.fechaDesde = fechaDesde;
    if (fechaHasta) filtros.fechaHasta = fechaHasta;

    // Estadísticas de plantillas
    const statsPlantillas = await DocumentTemplate.obtenerEstadisticas(filtros);

    // Estadísticas de documentos firmados
    const statsDocumentos = await SignedDocument.obtenerEstadisticas(filtros);

    res.status(200).json({
      success: true,
      data: {
        plantillas: statsPlantillas[0] || {},
        documentos: statsDocumentos[0] || {},
        resumen: {
          plantillasActivas: statsPlantillas[0]?.activas || 0,
          documentosFirmados: statsDocumentos[0]?.firmados || 0,
          documentosPendientes: statsDocumentos[0]?.pendientes || 0,
          totalDescargas: (statsPlantillas[0]?.totalDescargas || 0)
        }
      }
    });

  } catch (error) {
    console.error('Error en getDocumentStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Buscar plantillas y documentos
// @route   GET /api/documents/search
// @access  Private
const searchDocuments = async (req, res) => {
  try {
    const { q, tipo = 'all', limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Término de búsqueda requerido'
      });
    }

    const results = { plantillas: [], documentos: [] };

    // Buscar plantillas
    if (tipo === 'all' || tipo === 'plantillas') {
      const plantillas = await DocumentTemplate.buscarPlantillas({ nombre: q })
        .limit(parseInt(limit) / 2);
      results.plantillas = plantillas.map(p => p.toResumen());
    }

    // Buscar documentos firmados
    if (tipo === 'all' || tipo === 'documentos') {
      const documentos = await SignedDocument.buscarDocumentos({ paciente: q })
        .limit(parseInt(limit) / 2);
      results.documentos = documentos.map(d => d.toResumen());
    }

    res.status(200).json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Error en searchDocuments:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  // Plantillas
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  changeTemplateStatus,
  
  // Documentos firmados
  generateSignedDocument,
  getSignedDocuments,
  getSignedDocumentById,
  signDocument,
  
  // Generales
  getDocumentStats,
  searchDocuments
};