const Integration = require('../models/Integration');
const IntegrationLog = require('../models/IntegrationLog');

// @desc    Obtener todas las integraciones
// @route   GET /api/integrations
// @access  Private - Owner, Admin_Sede, Operations, HQ_Analyst
const getIntegrations = async (req, res) => {
  try {
    const {
      categoria,
      estado,
      proveedor,
      activa,
      sede,
      search,
      sortBy = 'nombre',
      sortOrder = 'asc',
      page = 1,
      limit = 10
    } = req.query;

    // Construcción del filtro
    const filter = {};

    if (categoria) filter.categoria = categoria;
    if (estado) filter.estado = estado;
    if (proveedor) filter.proveedor = proveedor;
    if (activa !== undefined) filter.activa = activa === 'true';
    if (sede) filter.sedeId = sede;

    if (search) {
      filter.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { codigo: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } },
        { proveedor: { $regex: search, $options: 'i' } }
      ];
    }

    // Configuración de paginación
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Configuración de ordenamiento
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Obtener integraciones
    const integraciones = await Integration.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate('sedeId', 'nombre ciudad')
      .populate('creadoPor', 'nombre apellidos')
      .populate('modificadoPor', 'nombre apellidos')
      .lean();

    // Agregar información de estado y última actividad
    const integracionesEnriquecidas = await Promise.all(
      integraciones.map(async (integracion) => {
        const ultimaActividad = await IntegrationLog.findOne({
          integracionId: integracion._id
        }).sort({ timestamp: -1 }).lean();

        return {
          ...integracion,
          ultimaActividad: ultimaActividad ? ultimaActividad.timestamp : null,
          estadoReal: integracion.activa && integracion.estado === 'conectada' ? 'activa' : 'inactiva'
        };
      })
    );

    const total = await Integration.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: integracionesEnriquecidas,
      pagination: {
        current: pageNum,
        pages: totalPages,
        total,
        limit: limitNum
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las integraciones',
      error: error.message
    });
  }
};

// @desc    Obtener integración por ID
// @route   GET /api/integrations/:id
// @access  Private - Owner, Admin_Sede, Operations, HQ_Analyst
const getIntegration = async (req, res) => {
  try {
    const integracion = await Integration.findById(req.params.id)
      .populate('sedeId', 'nombre ciudad direccion')
      .populate('creadoPor', 'nombre apellidos email')
      .populate('modificadoPor', 'nombre apellidos email');

    if (!integracion) {
      return res.status(404).json({
        success: false,
        message: 'Integración no encontrada'
      });
    }

    // Obtener logs recientes
    const logsRecientes = await IntegrationLog.find({
      integracionId: integracion._id
    })
      .sort({ timestamp: -1 })
      .limit(20)
      .populate('contexto.usuario', 'nombre apellidos')
      .lean();

    // Obtener estadísticas
    const estadisticas = await IntegrationLog.obtenerEstadisticas(integracion._id);

    res.json({
      success: true,
      data: {
        ...integracion.toObject(),
        logsRecientes,
        estadisticas
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la integración',
      error: error.message
    });
  }
};

// @desc    Crear nueva integración
// @route   POST /api/integrations
// @access  Private - Owner, Admin_Sede
const createIntegration = async (req, res) => {
  try {
    // Agregar el usuario creador
    req.body.creadoPor = req.user.id;

    const integracion = await Integration.create(req.body);

    // Crear log de creación
    await IntegrationLog.create({
      integracionId: integracion._id,
      integracionNombre: integracion.nombre,
      integracionCategoria: integracion.categoria,
      tipo: 'config',
      evento: 'creacion',
      mensaje: 'Integración creada exitosamente',
      estado: 'exito',
      contexto: {
        usuario: req.user.id,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      },
      severidad: 'info'
    });

    const integracionCreada = await Integration.findById(integracion._id)
      .populate('sedeId', 'nombre ciudad')
      .populate('creadoPor', 'nombre apellidos');

    res.status(201).json({
      success: true,
      message: 'Integración creada exitosamente',
      data: integracionCreada
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una integración con ese código'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear la integración',
      error: error.message
    });
  }
};

// @desc    Actualizar integración
// @route   PUT /api/integrations/:id
// @access  Private - Owner, Admin_Sede
const updateIntegration = async (req, res) => {
  try {
    const integracion = await Integration.findById(req.params.id);

    if (!integracion) {
      return res.status(404).json({
        success: false,
        message: 'Integración no encontrada'
      });
    }

    // Agregar el usuario modificador
    req.body.modificadoPor = req.user.id;
    req.body.fechaModificacion = new Date();

    // Guardar configuración anterior para auditoría
    const configuracionAnterior = {
      nombre: integracion.nombre,
      descripcion: integracion.descripcion,
      activa: integracion.activa,
      configuracion: integracion.configuracion
    };

    const integracionActualizada = await Integration.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('sedeId', 'nombre ciudad')
      .populate('modificadoPor', 'nombre apellidos');

    // Crear log de modificación
    await IntegrationLog.create({
      integracionId: integracion._id,
      integracionNombre: integracion.nombre,
      integracionCategoria: integracion.categoria,
      tipo: 'config',
      evento: 'modificacion',
      mensaje: 'Integración modificada',
      estado: 'exito',
      datosEvento: {
        configuracion: {
          valorAnterior: configuracionAnterior,
          valorNuevo: {
            nombre: integracionActualizada.nombre,
            descripcion: integracionActualizada.descripcion,
            activa: integracionActualizada.activa
          }
        }
      },
      contexto: {
        usuario: req.user.id,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      },
      severidad: 'info'
    });

    res.json({
      success: true,
      message: 'Integración actualizada exitosamente',
      data: integracionActualizada
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una integración con ese código'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar la integración',
      error: error.message
    });
  }
};

// @desc    Eliminar integración
// @route   DELETE /api/integrations/:id
// @access  Private - Owner
const deleteIntegration = async (req, res) => {
  try {
    const integracion = await Integration.findById(req.params.id);

    if (!integracion) {
      return res.status(404).json({
        success: false,
        message: 'Integración no encontrada'
      });
    }

    // Verificar si tiene logs asociados
    const tieneActividad = await IntegrationLog.countDocuments({
      integracionId: integracion._id
    });

    if (tieneActividad > 0) {
      // Soft delete - marcar como inactiva y archivada
      await Integration.findByIdAndUpdate(req.params.id, {
        activa: false,
        estado: 'desconectada',
        fechaEliminacion: new Date(),
        eliminadaPor: req.user.id
      });

      // Crear log de eliminación
      await IntegrationLog.create({
        integracionId: integracion._id,
        integracionNombre: integracion.nombre,
        integracionCategoria: integracion.categoria,
        tipo: 'config',
        evento: 'eliminacion_logica',
        mensaje: 'Integración desactivada (eliminación lógica)',
        estado: 'warning',
        contexto: {
          usuario: req.user.id,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        },
        severidad: 'media'
      });

      return res.json({
        success: true,
        message: 'Integración desactivada correctamente (tiene actividad registrada)'
      });
    }

    // Hard delete si no tiene actividad
    await Integration.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Integración eliminada exitosamente'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la integración',
      error: error.message
    });
  }
};

// @desc    Obtener logs de integración
// @route   GET /api/integrations/:id/logs
// @access  Private - Owner, Admin_Sede, Operations, HQ_Analyst
const getIntegrationLogs = async (req, res) => {
  try {
    const {
      tipo,
      estado,
      severidad,
      fechaDesde,
      fechaHasta,
      page = 1,
      limit = 50
    } = req.query;

    const filtro = { integracionId: req.params.id };

    if (tipo) filtro.tipo = tipo;
    if (estado) filtro.estado = estado;
    if (severidad) filtro.severidad = severidad;

    if (fechaDesde || fechaHasta) {
      filtro.timestamp = {};
      if (fechaDesde) filtro.timestamp.$gte = new Date(fechaDesde);
      if (fechaHasta) filtro.timestamp.$lte = new Date(fechaHasta);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const logs = await IntegrationLog.find(filtro)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('contexto.usuario', 'nombre apellidos')
      .populate('resolucion.responsable', 'nombre apellidos')
      .lean();

    const total = await IntegrationLog.countDocuments(filtro);

    res.json({
      success: true,
      data: logs,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los logs',
      error: error.message
    });
  }
};

// @desc    Obtener estadísticas de integraciones
// @route   GET /api/integrations/stats
// @access  Private - Owner, Admin_Sede, Operations, HQ_Analyst
const getIntegrationsStats = async (req, res) => {
  try {
    const { fechaDesde, fechaHasta } = req.query;

    // Estadísticas generales de integraciones
    const totalIntegraciones = await Integration.countDocuments();
    const activas = await Integration.countDocuments({ activa: true });
    const conectadas = await Integration.countDocuments({ estado: 'conectada' });

    // Distribución por categoría
    const porCategoria = await Integration.aggregate([
      {
        $group: {
          _id: '$categoria',
          count: { $sum: 1 },
          activas: {
            $sum: { $cond: [{ $eq: ['$activa', true] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Estadísticas de logs
    const statsLogs = await IntegrationLog.obtenerEstadisticas(null, fechaDesde, fechaHasta);

    // Integraciones más activas
    const masActivas = await IntegrationLog.aggregate([
      {
        $group: {
          _id: '$integracionId',
          integracionNombre: { $first: '$integracionNombre' },
          totalLogs: { $sum: 1 },
          errores: {
            $sum: { $cond: [{ $eq: ['$estado', 'error'] }, 1, 0] }
          }
        }
      },
      { $sort: { totalLogs: -1 } },
      { $limit: 10 }
    ]);

    // Últimos eventos por severidad
    const eventosRecientes = await IntegrationLog.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('integracionId', 'nombre categoria')
      .lean();

    res.json({
      success: true,
      data: {
        resumen: {
          total: totalIntegraciones,
          activas,
          conectadas,
          inactivas: totalIntegraciones - activas,
          porcentajeActividad: totalIntegraciones > 0 ? ((activas / totalIntegraciones) * 100).toFixed(1) : 0
        },
        porCategoria,
        logs: statsLogs,
        masActivas,
        eventosRecientes
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las estadísticas',
      error: error.message
    });
  }
};

// @desc    Probar conexión de integración
// @route   POST /api/integrations/:id/test
// @access  Private - Owner, Admin_Sede, Operations
const testIntegration = async (req, res) => {
  try {
    const integracion = await Integration.findById(req.params.id);

    if (!integracion) {
      return res.status(404).json({
        success: false,
        message: 'Integración no encontrada'
      });
    }

    const inicioTest = new Date();
    let resultado = {
      exito: false,
      mensaje: 'Prueba de conexión fallida',
      detalles: {},
      tiempoRespuesta: 0
    };

    try {
      // Aquí iría la lógica específica de prueba según el tipo de integración
      // Por ahora simulamos una prueba básica
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular tiempo de conexión
      
      resultado = {
        exito: true,
        mensaje: 'Conexión exitosa',
        detalles: {
          estado: 'conectada',
          version: '1.0.0',
          ultimaRespuesta: new Date()
        },
        tiempoRespuesta: new Date() - inicioTest
      };

      // Actualizar estado de la integración
      await Integration.findByIdAndUpdate(req.params.id, {
        estado: 'conectada',
        ultimaPrueba: new Date(),
        estadoConexion: {
          activa: true,
          ultimaConexion: new Date(),
          tiempoRespuesta: resultado.tiempoRespuesta
        }
      });

    } catch (testError) {
      resultado = {
        exito: false,
        mensaje: testError.message,
        detalles: { error: testError.toString() },
        tiempoRespuesta: new Date() - inicioTest
      };

      // Actualizar estado como desconectada
      await Integration.findByIdAndUpdate(req.params.id, {
        estado: 'desconectada',
        ultimaPrueba: new Date()
      });
    }

    // Crear log de la prueba
    await IntegrationLog.create({
      integracionId: integracion._id,
      integracionNombre: integracion.nombre,
      integracionCategoria: integracion.categoria,
      tipo: 'conexion',
      evento: 'prueba_conexion',
      mensaje: resultado.mensaje,
      estado: resultado.exito ? 'exito' : 'error',
      detalles: JSON.stringify(resultado.detalles),
      rendimiento: {
        duracion: resultado.tiempoRespuesta
      },
      contexto: {
        usuario: req.user.id,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      },
      severidad: resultado.exito ? 'info' : 'media'
    });

    res.json({
      success: true,
      data: resultado
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al probar la integración',
      error: error.message
    });
  }
};

// @desc    Sincronizar integración
// @route   POST /api/integrations/:id/sync
// @access  Private - Owner, Admin_Sede, Operations
const syncIntegration = async (req, res) => {
  try {
    const integracion = await Integration.findById(req.params.id);

    if (!integracion) {
      return res.status(404).json({
        success: false,
        message: 'Integración no encontrada'
      });
    }

    if (!integracion.activa) {
      return res.status(400).json({
        success: false,
        message: 'La integración no está activa'
      });
    }

    const inicioSync = new Date();
    let resultado = {
      exito: false,
      registrosAfectados: 0,
      operaciones: [],
      errores: []
    };

    try {
      // Simular proceso de sincronización
      await new Promise(resolve => setTimeout(resolve, 2000));

      resultado = {
        exito: true,
        registrosAfectados: Math.floor(Math.random() * 100) + 1,
        operaciones: ['CREATE', 'UPDATE'],
        errores: []
      };

      // Actualizar última sincronización
      await Integration.findByIdAndUpdate(req.params.id, {
        ultimaSincronizacion: new Date(),
        'estadisticas.sincronizacionesExitosas': integracion.estadisticas.sincronizacionesExitosas + 1
      });

    } catch (syncError) {
      resultado = {
        exito: false,
        registrosAfectados: 0,
        operaciones: [],
        errores: [syncError.message]
      };

      await Integration.findByIdAndUpdate(req.params.id, {
        'estadisticas.sincronizacionesFallidas': integracion.estadisticas.sincronizacionesFallidas + 1
      });
    }

    // Crear log de sincronización
    await IntegrationLog.crearLogSincronizacion(integracion, resultado.exito, {
      descripcion: `Sincronización ${resultado.exito ? 'exitosa' : 'fallida'}`,
      registros: resultado.registrosAfectados,
      duracion: new Date() - inicioSync,
      operacion: resultado.operaciones.join(', ')
    });

    res.json({
      success: true,
      data: resultado
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al sincronizar la integración',
      error: error.message
    });
  }
};

module.exports = {
  getIntegrations,
  getIntegration,
  createIntegration,
  updateIntegration,
  deleteIntegration,
  getIntegrationLogs,
  getIntegrationsStats,
  testIntegration,
  syncIntegration
};