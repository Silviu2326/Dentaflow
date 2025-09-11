const ArqueoCaja = require('../models/ArqueoCaja');
const Movimiento = require('../models/Movimiento');

// @desc    Obtener todos los arqueos
// @route   GET /api/arqueos
// @access  Private
const getArqueos = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      sede, 
      estado, 
      fechaInicio, 
      fechaFin, 
      usuario 
    } = req.query;

    const query = {};

    // Filtros
    if (sede) query.sede = sede;
    if (estado) query.estado = estado;
    if (usuario) query.usuario = usuario;

    // Filtro por rango de fechas
    if (fechaInicio || fechaFin) {
      query.fecha = {};
      if (fechaInicio) query.fecha.$gte = new Date(fechaInicio);
      if (fechaFin) query.fecha.$lte = new Date(new Date(fechaFin).setHours(23, 59, 59, 999));
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { fecha: -1 },
      populate: [
        { path: 'usuario', select: 'nombre apellidos' },
        { path: 'usuarioCierre', select: 'nombre apellidos' },
        { path: 'movimientos', select: 'tipo importe concepto fecha' }
      ]
    };

    const arqueos = await ArqueoCaja.paginate(query, options);

    res.json({
      success: true,
      data: arqueos
    });
  } catch (error) {
    console.error('Error al obtener arqueos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Obtener arqueo por ID
// @route   GET /api/arqueos/:id
// @access  Private
const getArqueoById = async (req, res) => {
  try {
    const arqueo = await ArqueoCaja.findById(req.params.id)
      .populate('usuario', 'nombre apellidos email')
      .populate('usuarioCierre', 'nombre apellidos email')
      .populate('creadoPor', 'nombre apellidos')
      .populate('actualizadoPor', 'nombre apellidos')
      .populate({
        path: 'movimientos',
        populate: {
          path: 'paciente usuarioResponsable',
          select: 'nombre apellidos numeroHistoriaClinica'
        }
      })
      .populate({
        path: 'historialCambios.usuario',
        select: 'nombre apellidos'
      });

    if (!arqueo) {
      return res.status(404).json({
        success: false,
        message: 'Arqueo no encontrado'
      });
    }

    res.json({
      success: true,
      data: arqueo
    });
  } catch (error) {
    console.error('Error al obtener arqueo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Abrir nueva caja
// @route   POST /api/arqueos/abrir
// @access  Private
const abrirCaja = async (req, res) => {
  try {
    const { sede, saldoInicial = 0, observaciones } = req.body;

    if (!sede) {
      return res.status(400).json({
        success: false,
        message: 'La sede es obligatoria'
      });
    }

    // Verificar que no hay una caja abierta para esta sede hoy
    const hoy = new Date();
    const inicioDelDia = new Date(hoy.setHours(0, 0, 0, 0));
    const finDelDia = new Date(hoy.setHours(23, 59, 59, 999));

    const cajaExistente = await ArqueoCaja.findOne({
      sede,
      estado: 'abierta',
      fecha: {
        $gte: inicioDelDia,
        $lte: finDelDia
      }
    });

    if (cajaExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una caja abierta para esta sede en la fecha actual'
      });
    }

    // Obtener el último saldo cerrado para calcular saldo inicial automático
    let saldoInicialCalculado = parseFloat(saldoInicial);
    
    if (saldoInicialCalculado === 0) {
      const ultimoCierre = await ArqueoCaja.obtenerUltimoSaldoCerrado(sede);
      if (ultimoCierre) {
        saldoInicialCalculado = ultimoCierre.saldoReal || 0;
      }
    }

    // Crear nuevo arqueo
    const arqueo = await ArqueoCaja.create({
      fecha: new Date(),
      saldoInicial: saldoInicialCalculado,
      sede,
      usuario: req.user._id,
      observaciones,
      creadoPor: req.user._id,
      totalIngresos: 0,
      totalGastos: 0,
      totalEfectivo: saldoInicialCalculado,
      totalTarjeta: 0,
      totalTransferencia: 0,
      totalBizum: 0,
      totalFinanciacion: 0
    });

    const arqueoCreado = await ArqueoCaja.findById(arqueo._id)
      .populate('usuario', 'nombre apellidos');

    res.status(201).json({
      success: true,
      data: arqueoCreado,
      message: 'Caja abierta exitosamente'
    });
  } catch (error) {
    console.error('Error al abrir caja:', error);
    
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
      error: error.message
    });
  }
};

// @desc    Cerrar caja
// @route   PUT /api/arqueos/:id/cerrar
// @access  Private
const cerrarCaja = async (req, res) => {
  try {
    const { saldoReal, observaciones, desglose } = req.body;

    if (saldoReal === undefined || saldoReal === null) {
      return res.status(400).json({
        success: false,
        message: 'El saldo real es obligatorio para cerrar la caja'
      });
    }

    const arqueo = await ArqueoCaja.findById(req.params.id);

    if (!arqueo) {
      return res.status(404).json({
        success: false,
        message: 'Arqueo no encontrado'
      });
    }

    if (arqueo.estado === 'cerrada') {
      return res.status(400).json({
        success: false,
        message: 'La caja ya está cerrada'
      });
    }

    // Cerrar caja
    await arqueo.cerrarCaja(
      parseFloat(saldoReal),
      req.user._id,
      observaciones,
      desglose
    );

    // Crear incidencia automática si hay diferencia significativa
    const diferencia = Math.abs(arqueo.diferencia);
    if (diferencia > 5) { // Diferencia mayor a 5 euros
      await arqueo.agregarIncidencia(
        diferencia > 50 ? 'faltante' : 'diferencia',
        `Diferencia de €${arqueo.diferencia.toFixed(2)} al cierre de caja`,
        arqueo.diferencia
      );
    }

    const arqueoCerrado = await ArqueoCaja.findById(req.params.id)
      .populate('usuario', 'nombre apellidos')
      .populate('usuarioCierre', 'nombre apellidos')
      .populate('movimientos');

    res.json({
      success: true,
      data: arqueoCerrado,
      message: 'Caja cerrada exitosamente'
    });
  } catch (error) {
    console.error('Error al cerrar caja:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Reabrir caja
// @route   PUT /api/arqueos/:id/reabrir
// @access  Private
const reabrirCaja = async (req, res) => {
  try {
    const { motivo } = req.body;

    if (!motivo || motivo.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El motivo para reabrir la caja es obligatorio'
      });
    }

    const arqueo = await ArqueoCaja.findById(req.params.id);

    if (!arqueo) {
      return res.status(404).json({
        success: false,
        message: 'Arqueo no encontrado'
      });
    }

    if (arqueo.estado === 'abierta') {
      return res.status(400).json({
        success: false,
        message: 'La caja ya está abierta'
      });
    }

    // Verificar que no hay otra caja abierta para la misma sede
    const cajaActiva = await ArqueoCaja.obtenerArqueoActivo(arqueo.sede);
    if (cajaActiva && cajaActiva._id.toString() !== arqueo._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una caja abierta para esta sede'
      });
    }

    // Reabrir caja
    await arqueo.reabrirCaja(req.user._id, motivo);

    const arqueoReabierto = await ArqueoCaja.findById(req.params.id)
      .populate('usuario', 'nombre apellidos')
      .populate('movimientos');

    res.json({
      success: true,
      data: arqueoReabierto,
      message: 'Caja reabierta exitosamente'
    });
  } catch (error) {
    console.error('Error al reabrir caja:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Obtener arqueo activo por sede
// @route   GET /api/arqueos/activo/:sede
// @access  Private
const getArqueoActivo = async (req, res) => {
  try {
    const { sede } = req.params;

    const arqueoActivo = await ArqueoCaja.obtenerArqueoActivo(sede);

    if (!arqueoActivo) {
      return res.status(404).json({
        success: false,
        message: 'No hay caja abierta para esta sede'
      });
    }

    res.json({
      success: true,
      data: arqueoActivo
    });
  } catch (error) {
    console.error('Error al obtener arqueo activo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Agregar incidencia al arqueo
// @route   POST /api/arqueos/:id/incidencias
// @access  Private
const agregarIncidencia = async (req, res) => {
  try {
    const { tipo, descripcion, importe } = req.body;

    if (!tipo || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Tipo y descripción son obligatorios'
      });
    }

    const arqueo = await ArqueoCaja.findById(req.params.id);

    if (!arqueo) {
      return res.status(404).json({
        success: false,
        message: 'Arqueo no encontrado'
      });
    }

    await arqueo.agregarIncidencia(tipo, descripcion, importe ? parseFloat(importe) : null);

    const arqueoActualizado = await ArqueoCaja.findById(req.params.id)
      .populate('usuario', 'nombre apellidos');

    res.json({
      success: true,
      data: arqueoActualizado,
      message: 'Incidencia agregada exitosamente'
    });
  } catch (error) {
    console.error('Error al agregar incidencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Resolver incidencia
// @route   PUT /api/arqueos/:id/incidencias/:incidenciaId/resolver
// @access  Private
const resolverIncidencia = async (req, res) => {
  try {
    const { solucion } = req.body;
    const { id, incidenciaId } = req.params;

    if (!solucion || solucion.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'La solución es obligatoria'
      });
    }

    const arqueo = await ArqueoCaja.findById(id);

    if (!arqueo) {
      return res.status(404).json({
        success: false,
        message: 'Arqueo no encontrado'
      });
    }

    await arqueo.resolverIncidencia(incidenciaId, solucion, req.user._id);

    const arqueoActualizado = await ArqueoCaja.findById(id)
      .populate('usuario', 'nombre apellidos')
      .populate('historialCambios.usuario', 'nombre apellidos');

    res.json({
      success: true,
      data: arqueoActualizado,
      message: 'Incidencia resuelta exitosamente'
    });
  } catch (error) {
    console.error('Error al resolver incidencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Obtener resumen de arqueos por rango de fechas
// @route   GET /api/arqueos/resumen
// @access  Private
const getResumenArqueos = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, sede } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        success: false,
        message: 'Las fechas de inicio y fin son obligatorias'
      });
    }

    const resumen = await ArqueoCaja.obtenerResumenPorRango(
      fechaInicio,
      fechaFin,
      sede
    );

    res.json({
      success: true,
      data: resumen
    });
  } catch (error) {
    console.error('Error al obtener resumen de arqueos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Obtener estadísticas del arqueo
// @route   GET /api/arqueos/:id/estadisticas
// @access  Private
const getEstadisticasArqueo = async (req, res) => {
  try {
    const arqueo = await ArqueoCaja.findById(req.params.id)
      .populate('movimientos');

    if (!arqueo) {
      return res.status(404).json({
        success: false,
        message: 'Arqueo no encontrado'
      });
    }

    const estadisticas = {
      totales: {
        saldoInicial: arqueo.saldoInicial,
        totalIngresos: arqueo.totalIngresos,
        totalGastos: arqueo.totalGastos,
        saldoTeorico: arqueo.saldoTeorico,
        saldoReal: arqueo.saldoReal,
        diferencia: arqueo.diferencia
      },
      metodosPago: {
        efectivo: arqueo.totalEfectivo,
        tarjeta: arqueo.totalTarjeta,
        transferencia: arqueo.totalTransferencia,
        bizum: arqueo.totalBizum,
        financiacion: arqueo.totalFinanciacion
      },
      movimientos: {
        totalMovimientos: arqueo.movimientos.length,
        ingresos: arqueo.movimientos.filter(m => m.tipo === 'ingreso').length,
        gastos: arqueo.movimientos.filter(m => m.tipo === 'gasto').length
      },
      estado: {
        estado: arqueo.estado,
        fechaApertura: arqueo.fecha,
        fechaCierre: arqueo.fechaCierre,
        tiempoAbierto: arqueo.fechaCierre ? 
          Math.round((new Date(arqueo.fechaCierre) - new Date(arqueo.fecha)) / (1000 * 60 * 60)) : 
          Math.round((new Date() - new Date(arqueo.fecha)) / (1000 * 60 * 60))
      },
      incidencias: {
        total: arqueo.incidencias.length,
        pendientes: arqueo.incidencias.filter(i => !i.resuelto).length,
        resueltas: arqueo.incidencias.filter(i => i.resuelto).length
      }
    };

    res.json({
      success: true,
      data: estadisticas
    });
  } catch (error) {
    console.error('Error al obtener estadísticas del arqueo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getArqueos,
  getArqueoById,
  abrirCaja,
  cerrarCaja,
  reabrirCaja,
  getArqueoActivo,
  agregarIncidencia,
  resolverIncidencia,
  getResumenArqueos,
  getEstadisticasArqueo
};