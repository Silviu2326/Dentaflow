const Evaluation = require('../models/Evaluation');
const Patient = require('../models/Patient');
const User = require('../models/User');

// @desc    Crear nueva evaluación
// @route   POST /api/evaluations
// @access  Private
const createEvaluation = async (req, res) => {
  try {
    const {
      pacienteId, tipo, titulo, descripcion, hallazgos, tratamientos,
      proximaCita, odontograma, periodontograma, evolucion, plantilla,
      adjuntos, prioridad, duracionConsulta, observaciones, 
      facturacion, tags
    } = req.body;

    // Verificar que el paciente existe
    const patient = await Patient.findById(pacienteId);
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

    // Crear evaluación
    const evaluation = await Evaluation.create({
      pacienteId,
      pacienteNombre: patient.nombreCompleto,
      tipo,
      titulo,
      descripcion,
      hallazgos: hallazgos || [],
      tratamientos: tratamientos || [],
      proximaCita,
      odontograma,
      periodontograma,
      evolucion,
      plantilla,
      adjuntos: adjuntos || [],
      prioridad: prioridad || 'media',
      profesional: req.user.id,
      sede: req.user.sede || patient.sede,
      duracionConsulta,
      observaciones,
      facturacion,
      tags: tags || [],
      creadoPor: req.user.id,
      estado: 'borrador'
    });

    // Actualizar última visita del paciente
    patient.ultimaVisita = Date.now();
    await patient.save();

    res.status(201).json({
      success: true,
      message: 'Evaluación creada exitosamente',
      data: evaluation.toResumen()
    });

  } catch (error) {
    console.error('Error en createEvaluation:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener todas las evaluaciones
// @route   GET /api/evaluations
// @access  Private
const getEvaluations = async (req, res) => {
  try {
    const {
      paciente = '',
      tipo = '',
      estado = '',
      sede = '',
      profesional = '',
      prioridad = '',
      fechaDesde = '',
      fechaHasta = '',
      titulo = '',
      tags = '',
      page = 1,
      limit = 20,
      sortBy = 'fecha',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filtros = {};
    
    if (paciente) filtros.paciente = paciente;
    if (tipo) filtros.tipo = tipo;
    if (estado) filtros.estado = estado;
    if (profesional) filtros.profesional = profesional;
    if (prioridad) filtros.prioridad = prioridad;
    if (fechaDesde) filtros.fechaDesde = fechaDesde;
    if (fechaHasta) filtros.fechaHasta = fechaHasta;
    if (titulo) filtros.titulo = titulo;
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

    // Ejecutar consulta usando el método estático del modelo
    const query = await Evaluation.buscarEvaluaciones(filtros);
    
    const evaluations = await query
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Contar total para paginación
    const totalQuery = await Evaluation.buscarEvaluaciones(filtros);
    const total = await totalQuery.countDocuments();

    // Convertir a resumen para optimizar respuesta
    const evaluationsWithInfo = evaluations.map(evaluation => {
      const evalObj = evaluation.toResumen();
      evalObj.tiempoTranscurrido = evaluation.tiempoTranscurrido;
      evalObj.pendienteRevision = evaluation.pendienteRevision;
      return evalObj;
    });

    res.status(200).json({
      success: true,
      data: {
        evaluations: evaluationsWithInfo,
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
    console.error('Error en getEvaluations:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener evaluación por ID
// @route   GET /api/evaluations/:id
// @access  Private
const getEvaluationById = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id)
      .populate('pacienteId', 'nombre apellidos numeroHistoriaClinica email telefono')
      .populate('profesional', 'nombre apellidos especialidad')
      .populate('revisadoPor', 'nombre apellidos')
      .populate('creadoPor', 'nombre apellidos')
      .populate('actualizadoPor', 'nombre apellidos')
      .populate('historialCambios.realizadoPor', 'nombre apellidos');

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Evaluación no encontrada'
      });
    }

    // Verificar acceso por sede
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      if (evaluation.sede !== req.user.sede) {
        return res.status(403).json({
          success: false,
          message: 'No tienes acceso a esta evaluación'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: evaluation
    });

  } catch (error) {
    console.error('Error en getEvaluationById:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Actualizar evaluación
// @route   PUT /api/evaluations/:id
// @access  Private
const updateEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Evaluación no encontrada'
      });
    }

    // Verificar acceso por sede
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      if (evaluation.sede !== req.user.sede) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para modificar esta evaluación'
        });
      }
    }

    // Solo el profesional que creó la evaluación o un superior puede modificarla
    if (evaluation.profesional.toString() !== req.user.id && 
        !['owner', 'hq_analyst', 'clinical_director'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Solo puedes modificar tus propias evaluaciones'
      });
    }

    const {
      tipo, titulo, descripcion, hallazgos, tratamientos,
      proximaCita, odontograma, periodontograma, evolucion, 
      plantilla, adjuntos, prioridad, duracionConsulta, 
      observaciones, facturacion, tags
    } = req.body;

    // Registrar cambios importantes en historial
    const cambiosImportantes = ['tipo', 'titulo', 'prioridad', 'estado'];
    for (const campo of cambiosImportantes) {
      if (req.body[campo] && req.body[campo] !== evaluation[campo]) {
        evaluation.historialCambios.push({
          cambio: `${campo} actualizado`,
          valorAnterior: String(evaluation[campo] || ''),
          valorNuevo: String(req.body[campo]),
          realizadoPor: req.user.id
        });
      }
    }

    // Actualizar campos
    if (tipo) evaluation.tipo = tipo;
    if (titulo) evaluation.titulo = titulo;
    if (descripcion) evaluation.descripcion = descripcion;
    if (hallazgos !== undefined) evaluation.hallazgos = hallazgos;
    if (tratamientos !== undefined) evaluation.tratamientos = tratamientos;
    if (proximaCita !== undefined) evaluation.proximaCita = proximaCita;
    if (odontograma !== undefined) evaluation.odontograma = odontograma;
    if (periodontograma !== undefined) evaluation.periodontograma = periodontograma;
    if (evolucion !== undefined) evaluation.evolucion = evolucion;
    if (plantilla !== undefined) evaluation.plantilla = plantilla;
    if (adjuntos !== undefined) evaluation.adjuntos = adjuntos;
    if (prioridad) evaluation.prioridad = prioridad;
    if (duracionConsulta !== undefined) evaluation.duracionConsulta = duracionConsulta;
    if (observaciones !== undefined) evaluation.observaciones = observaciones;
    if (facturacion !== undefined) evaluation.facturacion = facturacion;
    if (tags !== undefined) evaluation.tags = tags;

    evaluation.actualizadoPor = req.user.id;
    evaluation.fechaActualizacion = Date.now();

    await evaluation.save();

    res.status(200).json({
      success: true,
      message: 'Evaluación actualizada exitosamente',
      data: evaluation
    });

  } catch (error) {
    console.error('Error en updateEvaluation:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cambiar estado de la evaluación
// @route   PUT /api/evaluations/:id/status
// @access  Private
const changeEvaluationStatus = async (req, res) => {
  try {
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({
        success: false,
        message: 'El nuevo estado es obligatorio'
      });
    }

    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Evaluación no encontrada'
      });
    }

    // Verificar permisos para cambiar estado
    if (evaluation.profesional.toString() !== req.user.id && 
        !['owner', 'hq_analyst', 'clinical_director'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para cambiar el estado de esta evaluación'
      });
    }

    const estadoAnterior = evaluation.estado;
    evaluation.estado = estado;
    evaluation.actualizadoPor = req.user.id;

    evaluation.historialCambios.push({
      cambio: `Estado cambiado de ${estadoAnterior} a ${estado}`,
      valorAnterior: estadoAnterior,
      valorNuevo: estado,
      realizadoPor: req.user.id
    });

    await evaluation.save();

    res.status(200).json({
      success: true,
      message: 'Estado de la evaluación actualizado exitosamente',
      data: evaluation.toResumen()
    });

  } catch (error) {
    console.error('Error en changeEvaluationStatus:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Completar evaluación
// @route   PUT /api/evaluations/:id/complete
// @access  Private
const completeEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Evaluación no encontrada'
      });
    }

    // Solo el profesional puede completar su evaluación
    if (evaluation.profesional.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Solo puedes completar tus propias evaluaciones'
      });
    }

    await evaluation.completar(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Evaluación completada exitosamente',
      data: evaluation.toResumen()
    });

  } catch (error) {
    console.error('Error en completeEvaluation:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Revisar evaluación
// @route   PUT /api/evaluations/:id/review
// @access  Private
const reviewEvaluation = async (req, res) => {
  try {
    const { observaciones } = req.body;

    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Evaluación no encontrada'
      });
    }

    // Solo directores clínicos pueden revisar
    if (!['owner', 'hq_analyst', 'clinical_director'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para revisar evaluaciones'
      });
    }

    if (evaluation.estado !== 'completada') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden revisar evaluaciones completadas'
      });
    }

    await evaluation.revisar(req.user.id, observaciones);

    res.status(200).json({
      success: true,
      message: 'Evaluación revisada exitosamente',
      data: evaluation.toResumen()
    });

  } catch (error) {
    console.error('Error en reviewEvaluation:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener evaluaciones por paciente
// @route   GET /api/evaluations/patient/:patientId
// @access  Private
const getEvaluationsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { tipo, estado, limit = 50 } = req.query;

    // Verificar que el paciente existe
    const patient = await Patient.findById(patientId);
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

    // Construir filtros
    const filtros = { pacienteId };
    if (tipo) filtros.tipo = tipo;
    if (estado) filtros.estado = estado;

    const evaluations = await Evaluation.buscarEvaluaciones(filtros)
      .limit(parseInt(limit))
      .sort({ fecha: -1 });

    const evaluationsWithInfo = evaluations.map(evaluation => {
      const evalObj = evaluation.toResumen();
      evalObj.tiempoTranscurrido = evaluation.tiempoTranscurrido;
      return evalObj;
    });

    res.status(200).json({
      success: true,
      data: evaluationsWithInfo
    });

  } catch (error) {
    console.error('Error en getEvaluationsByPatient:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener estadísticas de evaluaciones
// @route   GET /api/evaluations/stats
// @access  Private
const getEvaluationStats = async (req, res) => {
  try {
    const { sede, fechaDesde, fechaHasta } = req.query;

    // Construir filtros para estadísticas
    const filtros = {};
    
    // Filtrar por sede si corresponde
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      filtros.sede = req.user.sede;
    } else if (sede) {
      filtros.sede = sede;
    }

    if (fechaDesde) filtros.fechaDesde = fechaDesde;
    if (fechaHasta) filtros.fechaHasta = fechaHasta;

    const stats = await Evaluation.obtenerEstadisticas(filtros);

    // Estadísticas por profesional
    const matchStage = {};
    if (filtros.sede) matchStage.sede = filtros.sede;
    if (filtros.fechaDesde || filtros.fechaHasta) {
      matchStage.fecha = {};
      if (filtros.fechaDesde) matchStage.fecha.$gte = new Date(filtros.fechaDesde);
      if (filtros.fechaHasta) matchStage.fecha.$lte = new Date(filtros.fechaHasta);
    }

    const statsByProfessional = await Evaluation.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$profesional',
          totalEvaluaciones: { $sum: 1 },
          tiempoPromedioConsulta: { $avg: '$duracionConsulta' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'profesional'
        }
      },
      {
        $unwind: '$profesional'
      },
      {
        $project: {
          _id: 1,
          totalEvaluaciones: 1,
          tiempoPromedioConsulta: { $round: ['$tiempoPromedioConsulta', 0] },
          profesionalNombre: { 
            $concat: ['$profesional.nombre', ' ', '$profesional.apellidos'] 
          }
        }
      },
      { $sort: { totalEvaluaciones: -1 } }
    ]);

    // Estadísticas por prioridad
    const statsByPriority = await Evaluation.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$prioridad',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        general: stats[0] || {
          totalEvaluaciones: 0,
          odontogramas: 0,
          periodontogramas: 0,
          evolutivos: 0,
          plantillas: 0,
          pendientesRevision: 0,
          evaluacionesUrgentes: 0
        },
        porProfesional: statsByProfessional,
        porPrioridad: statsByPriority
      }
    });

  } catch (error) {
    console.error('Error en getEvaluationStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Eliminar evaluación
// @route   DELETE /api/evaluations/:id
// @access  Private (Solo owner)
const deleteEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Evaluación no encontrada'
      });
    }

    // Solo permitir eliminación por owner o el profesional que la creó
    if (req.user.role !== 'owner' && 
        evaluation.profesional.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar esta evaluación'
      });
    }

    await Evaluation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Evaluación eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error en deleteEvaluation:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Buscar evaluaciones
// @route   GET /api/evaluations/search
// @access  Private
const searchEvaluations = async (req, res) => {
  try {
    const { 
      q, 
      tipo, 
      estado, 
      sede, 
      prioridad,
      fechaDesde,
      fechaHasta,
      limit = 20 
    } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Término de búsqueda requerido'
      });
    }

    // Construir filtros
    const filtros = {};
    
    // Búsqueda por texto
    filtros.paciente = q; // Esto buscará en pacienteNombre
    if (tipo) filtros.tipo = tipo;
    if (estado) filtros.estado = estado;
    if (prioridad) filtros.prioridad = prioridad;
    if (fechaDesde) filtros.fechaDesde = fechaDesde;
    if (fechaHasta) filtros.fechaHasta = fechaHasta;

    // Filtrar por sede si corresponde
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      filtros.sede = req.user.sede;
    } else if (sede) {
      filtros.sede = sede;
    }

    const evaluations = await Evaluation.buscarEvaluaciones(filtros)
      .limit(parseInt(limit))
      .sort({ fecha: -1 });

    const evaluationsWithInfo = evaluations.map(evaluation => {
      const evalObj = evaluation.toResumen();
      evalObj.tiempoTranscurrido = evaluation.tiempoTranscurrido;
      return evalObj;
    });

    res.status(200).json({
      success: true,
      data: evaluationsWithInfo
    });

  } catch (error) {
    console.error('Error en searchEvaluations:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  createEvaluation,
  getEvaluations,
  getEvaluationById,
  updateEvaluation,
  changeEvaluationStatus,
  completeEvaluation,
  reviewEvaluation,
  getEvaluationsByPatient,
  getEvaluationStats,
  deleteEvaluation,
  searchEvaluations
};