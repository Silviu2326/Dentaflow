const Budget = require('../models/Budget');
const Patient = require('../models/Patient');
const User = require('../models/User');

// @desc    Crear nuevo presupuesto
// @route   POST /api/budgets
// @access  Private
const createBudget = async (req, res) => {
  try {
    const {
      pacienteId, tratamientoPrincipal, items, descuentoGlobal, impuestos,
      prioridad, validezDias, opcionesPago, condiciones, tags, notasInternas
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

    // Crear presupuesto
    const budget = await Budget.create({
      pacienteId,
      tratamientoPrincipal,
      items: items || [],
      descuentoGlobal: descuentoGlobal || 0,
      impuestos: impuestos || 21,
      prioridad: prioridad || 'medium',
      validezDias: validezDias || 30,
      profesional: req.user.id,
      sede: req.user.sede || patient.sede,
      opcionesPago: opcionesPago || {
        contado: { disponible: true, descuento: 0 },
        financiacion: { disponible: true, plazos: [] },
        seguro: { disponible: false }
      },
      condiciones: condiciones || [],
      tags: tags || [],
      notasInternas,
      creadoPor: req.user.id,
      estado: 'pendiente',
      historialEstados: [{
        estado: 'pendiente',
        fecha: Date.now(),
        usuario: req.user.id,
        motivo: 'Creación inicial del presupuesto'
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Presupuesto creado exitosamente',
      data: budget.toResumen()
    });

  } catch (error) {
    console.error('Error en createBudget:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener todos los presupuestos
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
  try {
    const {
      paciente = '',
      estado = '',
      prioridad = '',
      sede = '',
      profesional = '',
      fechaDesde = '',
      fechaHasta = '',
      montoMin = '',
      montoMax = '',
      vencidos = '',
      tags = '',
      page = 1,
      limit = 20,
      sortBy = 'fechaCreacion',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filtros = {};
    
    if (paciente) filtros.paciente = paciente;
    if (estado) filtros.estado = estado;
    if (prioridad) filtros.prioridad = prioridad;
    if (profesional) filtros.profesional = profesional;
    if (fechaDesde) filtros.fechaDesde = fechaDesde;
    if (fechaHasta) filtros.fechaHasta = fechaHasta;
    if (montoMin) filtros.montoMin = parseFloat(montoMin);
    if (montoMax) filtros.montoMax = parseFloat(montoMax);
    if (vencidos === 'true') filtros.vencidos = true;
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
    const query = Budget.buscarPresupuestos(filtros);
    
    const budgets = await query
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Contar total para paginación
    const totalQuery = Budget.buscarPresupuestos(filtros);
    const total = await Budget.countDocuments(totalQuery.getFilter());

    // Convertir a resumen para optimizar respuesta
    const budgetsWithInfo = budgets.map(budget => {
      const budgetObj = budget.toResumen();
      return budgetObj;
    });

    res.status(200).json({
      success: true,
      data: {
        budgets: budgetsWithInfo,
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
    console.error('Error en getBudgets:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener presupuesto por ID
// @route   GET /api/budgets/:id
// @access  Private
const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id)
      .populate('pacienteId', 'nombre apellidos numeroHistoriaClinica email telefono direccion')
      .populate('profesional', 'nombre apellidos especialidad')
      .populate('creadoPor', 'nombre apellidos')
      .populate('actualizadoPor', 'nombre apellidos')
      .populate('historialEstados.usuario', 'nombre apellidos')
      .populate('comunicaciones.realizadoPor', 'nombre apellidos');

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Presupuesto no encontrado'
      });
    }

    // Verificar acceso por sede
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      if (budget.sede !== req.user.sede) {
        return res.status(403).json({
          success: false,
          message: 'No tienes acceso a este presupuesto'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: budget
    });

  } catch (error) {
    console.error('Error en getBudgetById:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Actualizar presupuesto
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Presupuesto no encontrado'
      });
    }

    // Verificar acceso por sede
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      if (budget.sede !== req.user.sede) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para modificar este presupuesto'
        });
      }
    }

    // Solo el profesional que creó el presupuesto o un superior puede modificarlo
    if (budget.profesional.toString() !== req.user.id && 
        !['owner', 'hq_analyst', 'admin_sede'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Solo puedes modificar tus propios presupuestos'
      });
    }

    // No permitir modificar presupuestos aceptados o perdidos sin permisos especiales
    if (['aceptado', 'perdido'].includes(budget.estado) && 
        !['owner', 'hq_analyst'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No se pueden modificar presupuestos finalizados'
      });
    }

    const {
      tratamientoPrincipal, items, descuentoGlobal, impuestos, prioridad,
      validezDias, opcionesPago, condiciones, tags, notasInternas
    } = req.body;

    // Actualizar campos
    if (tratamientoPrincipal) budget.tratamientoPrincipal = tratamientoPrincipal;
    if (items !== undefined) budget.items = items;
    if (descuentoGlobal !== undefined) budget.descuentoGlobal = descuentoGlobal;
    if (impuestos !== undefined) budget.impuestos = impuestos;
    if (prioridad) budget.prioridad = prioridad;
    if (validezDias) budget.validezDias = validezDias;
    if (opcionesPago) budget.opcionesPago = { ...budget.opcionesPago, ...opcionesPago };
    if (condiciones !== undefined) budget.condiciones = condiciones;
    if (tags !== undefined) budget.tags = tags;
    if (notasInternas !== undefined) budget.notasInternas = notasInternas;

    budget.actualizadoPor = req.user.id;
    budget.fechaActualizacion = Date.now();

    await budget.save();

    res.status(200).json({
      success: true,
      message: 'Presupuesto actualizado exitosamente',
      data: budget
    });

  } catch (error) {
    console.error('Error en updateBudget:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cambiar estado del presupuesto (Pipeline)
// @route   PUT /api/budgets/:id/status
// @access  Private
const changeBudgetStatus = async (req, res) => {
  try {
    const { estado, motivo, observaciones, motivoRechazo } = req.body;

    if (!estado) {
      return res.status(400).json({
        success: false,
        message: 'El nuevo estado es obligatorio'
      });
    }

    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Presupuesto no encontrado'
      });
    }

    // Verificar permisos para cambiar estado
    if (budget.profesional.toString() !== req.user.id && 
        !['owner', 'hq_analyst', 'admin_sede'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para cambiar el estado de este presupuesto'
      });
    }

    // Validar transiciones de estado válidas
    const transicionesValidas = {
      'pendiente': ['presentado', 'cancelado'],
      'presentado': ['aceptado', 'perdido', 'caducado'],
      'aceptado': ['perdido'], // Solo en casos excepcionales
      'perdido': ['presentado'], // Reactivar si es necesario
      'caducado': ['presentado'], // Renovar presupuesto
      'cancelado': ['pendiente'] // Reactivar
    };

    if (!transicionesValidas[budget.estado]?.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: `No se puede cambiar de ${budget.estado} a ${estado}`
      });
    }

    // Si se rechaza, requiere motivo
    if (estado === 'perdido' && !motivoRechazo) {
      return res.status(400).json({
        success: false,
        message: 'El motivo de rechazo es obligatorio para presupuestos perdidos'
      });
    }

    // Agregar información de rechazo si aplica
    if (estado === 'perdido' && motivoRechazo) {
      budget.motivoRechazo = motivoRechazo;
    }

    // Cambiar estado usando el método del modelo
    await budget.cambiarEstado(estado, req.user.id, motivo, observaciones);

    res.status(200).json({
      success: true,
      message: 'Estado del presupuesto actualizado exitosamente',
      data: budget.toResumen()
    });

  } catch (error) {
    console.error('Error en changeBudgetStatus:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Agregar comunicación al presupuesto
// @route   POST /api/budgets/:id/communication
// @access  Private
const addCommunication = async (req, res) => {
  try {
    const { tipo, descripcion, resultado, proximaAccion } = req.body;

    if (!tipo || !descripcion || !resultado) {
      return res.status(400).json({
        success: false,
        message: 'Tipo, descripción y resultado son obligatorios'
      });
    }

    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Presupuesto no encontrado'
      });
    }

    const comunicacion = {
      tipo,
      descripcion,
      resultado,
      proximaAccion
    };

    await budget.agregarComunicacion(comunicacion, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Comunicación agregada exitosamente',
      data: budget.comunicaciones[budget.comunicaciones.length - 1]
    });

  } catch (error) {
    console.error('Error en addCommunication:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener presupuestos por paciente
// @route   GET /api/budgets/patient/:patientId
// @access  Private
const getBudgetsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { estado, limit = 50 } = req.query;

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
    if (estado) filtros.estado = estado;

    const budgets = await Budget.buscarPresupuestos(filtros)
      .limit(parseInt(limit))
      .sort({ fechaCreacion: -1 });

    const budgetsWithInfo = budgets.map(budget => budget.toResumen());

    res.status(200).json({
      success: true,
      data: budgetsWithInfo
    });

  } catch (error) {
    console.error('Error en getBudgetsByPatient:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener estadísticas del pipeline de presupuestos
// @route   GET /api/budgets/pipeline/stats
// @access  Private
const getPipelineStats = async (req, res) => {
  try {
    const { sede, profesional, fechaDesde, fechaHasta } = req.query;

    // Construir filtros
    const filtros = {};
    
    // Filtrar por sede si corresponde
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      filtros.sede = req.user.sede;
    } else if (sede) {
      filtros.sede = sede;
    }

    if (profesional) filtros.profesional = profesional;
    if (fechaDesde) filtros.fechaDesde = fechaDesde;
    if (fechaHasta) filtros.fechaHasta = fechaHasta;

    const stats = await Budget.obtenerEstadisticasPipeline(filtros);

    // Estadísticas por profesional
    const matchStage = {};
    if (filtros.sede) matchStage.sede = filtros.sede;
    if (filtros.profesional) matchStage.profesional = filtros.profesional;
    if (filtros.fechaDesde || filtros.fechaHasta) {
      matchStage.fechaCreacion = {};
      if (filtros.fechaDesde) matchStage.fechaCreacion.$gte = new Date(filtros.fechaDesde);
      if (filtros.fechaHasta) matchStage.fechaCreacion.$lte = new Date(filtros.fechaHasta);
    }

    const statsByProfessional = await Budget.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$profesional',
          totalPresupuestos: { $sum: 1 },
          aceptados: { $sum: { $cond: [{ $eq: ['$estado', 'aceptado'] }, 1, 0] } },
          valorTotal: { $sum: '$total' },
          valorAceptado: { $sum: { $cond: [{ $eq: ['$estado', 'aceptado'] }, '$total', 0] } },
          tiempoPromedio: { $avg: '$metricas.tiempoHastaDecision' }
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
          totalPresupuestos: 1,
          aceptados: 1,
          valorTotal: { $round: ['$valorTotal', 2] },
          valorAceptado: { $round: ['$valorAceptado', 2] },
          tasaConversion: { 
            $round: [
              { $multiply: [{ $divide: ['$aceptados', '$totalPresupuestos'] }, 100] }, 
              1
            ] 
          },
          tiempoPromedio: { $round: ['$tiempoPromedio', 0] },
          profesionalNombre: { 
            $concat: ['$profesional.nombre', ' ', '$profesional.apellidos'] 
          }
        }
      },
      { $sort: { valorAceptado: -1 } }
    ]);

    // Estadísticas por estado y mes (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const trendData = await Budget.aggregate([
      { 
        $match: { 
          ...matchStage, 
          fechaCreacion: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$fechaCreacion' },
            month: { $month: '$fechaCreacion' },
            estado: '$estado'
          },
          count: { $sum: 1 },
          valor: { $sum: '$total' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        general: stats[0] || {
          totalPresupuestos: 0,
          pendientes: 0,
          presentados: 0,
          aceptados: 0,
          perdidos: 0,
          valorTotalPipeline: 0,
          valorAceptados: 0,
          tiempoPromedioDecision: 0,
          presupuestosVencidos: 0
        },
        porProfesional: statsByProfessional,
        tendenciaMensual: trendData
      }
    });

  } catch (error) {
    console.error('Error en getPipelineStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener presupuestos para el pipeline (agrupados por estado)
// @route   GET /api/budgets/pipeline
// @access  Private
const getPipelineData = async (req, res) => {
  try {
    const { sede, profesional } = req.query;

    // Construir filtros base
    const filtros = {};
    
    // Filtrar por sede si corresponde
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      filtros.sede = req.user.sede;
    } else if (sede) {
      filtros.sede = sede;
    }

    if (profesional) filtros.profesional = profesional;

    // Obtener presupuestos por cada estado
    const estados = ['pendiente', 'presentado', 'aceptado', 'perdido'];
    const pipeline = {};

    for (const estado of estados) {
      const estadoFiltros = { ...filtros, estado };
      const presupuestos = await Budget.buscarPresupuestos(estadoFiltros)
        .sort({ prioridad: 1, fechaCreacion: -1 })
        .limit(50);
      
      pipeline[estado] = presupuestos.map(budget => ({
        id: budget._id,
        patient: budget.pacienteNombre,
        treatment: budget.tratamientoPrincipal,
        amount: budget.total,
        date: budget.fechaCreacion,
        professional: budget.profesionalNombre,
        phone: budget.pacienteTelefono,
        email: budget.pacienteEmail,
        priority: budget.prioridad,
        numero: budget.numero,
        diasRestantes: budget.diasRestantes,
        estaVencido: budget.estaVencido
      }));
    }

    res.status(200).json({
      success: true,
      data: pipeline
    });

  } catch (error) {
    console.error('Error en getPipelineData:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Buscar presupuestos
// @route   GET /api/budgets/search
// @access  Private
const searchBudgets = async (req, res) => {
  try {
    const { 
      q, 
      estado, 
      prioridad, 
      sede,
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
    filtros.paciente = q; // Esto buscará en pacienteNombre y número
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

    const budgets = await Budget.buscarPresupuestos(filtros)
      .limit(parseInt(limit))
      .sort({ fechaCreacion: -1 });

    const budgetsWithInfo = budgets.map(budget => budget.toResumen());

    res.status(200).json({
      success: true,
      data: budgetsWithInfo
    });

  } catch (error) {
    console.error('Error en searchBudgets:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Eliminar presupuesto
// @route   DELETE /api/budgets/:id
// @access  Private (Solo owner)
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Presupuesto no encontrado'
      });
    }

    // Solo permitir eliminación por owner o el profesional que lo creó si está en borrador
    if (req.user.role !== 'owner') {
      if (budget.profesional.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para eliminar este presupuesto'
        });
      }
      
      if (budget.estado !== 'pendiente') {
        return res.status(403).json({
          success: false,
          message: 'Solo se pueden eliminar presupuestos pendientes'
        });
      }
    }

    await Budget.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Presupuesto eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error en deleteBudget:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  changeBudgetStatus,
  addCommunication,
  getBudgetsByPatient,
  getPipelineStats,
  getPipelineData,
  searchBudgets,
  deleteBudget
};