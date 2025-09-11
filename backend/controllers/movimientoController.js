const Movimiento = require('../models/Movimiento');
const ArqueoCaja = require('../models/ArqueoCaja');
const Patient = require('../models/Patient');

// @desc    Obtener todos los movimientos
// @route   GET /api/movimientos
// @access  Private
const getMovimientos = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      sede, 
      tipo, 
      categoria, 
      fechaInicio, 
      fechaFin, 
      estado = 'procesado',
      search 
    } = req.query;

    const query = { estado: { $ne: 'anulado' } };

    // Filtros
    if (sede) query.sede = sede;
    if (tipo) query.tipo = tipo;
    if (categoria) query.categoria = categoria;
    if (estado !== 'all') query.estado = estado;

    // Filtro por rango de fechas
    if (fechaInicio || fechaFin) {
      query.fecha = {};
      if (fechaInicio) query.fecha.$gte = new Date(fechaInicio);
      if (fechaFin) query.fecha.$lte = new Date(new Date(fechaFin).setHours(23, 59, 59, 999));
    }

    // Búsqueda por texto
    if (search) {
      query.$or = [
        { concepto: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } },
        { numeroRecibo: { $regex: search, $options: 'i' } },
        { numeroFactura: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { fecha: -1 },
      populate: [
        { path: 'paciente', select: 'nombre apellidos numeroHistoriaClinica' },
        { path: 'usuarioResponsable', select: 'nombre apellidos' },
        { path: 'arqueo', select: 'fecha estado' }
      ]
    };

    const movimientos = await Movimiento.paginate(query, options);

    res.json({
      success: true,
      data: movimientos
    });
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Obtener movimiento por ID
// @route   GET /api/movimientos/:id
// @access  Private
const getMovimientoById = async (req, res) => {
  try {
    const movimiento = await Movimiento.findById(req.params.id)
      .populate('paciente', 'nombre apellidos numeroHistoriaClinica email telefono')
      .populate('usuarioResponsable', 'nombre apellidos email')
      .populate('creadoPor', 'nombre apellidos')
      .populate('actualizadoPor', 'nombre apellidos')
      .populate('usuarioAnulacion', 'nombre apellidos')
      .populate('arqueo', 'fecha estado saldoTeorico');

    if (!movimiento) {
      return res.status(404).json({
        success: false,
        message: 'Movimiento no encontrado'
      });
    }

    res.json({
      success: true,
      data: movimiento
    });
  } catch (error) {
    console.error('Error al obtener movimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Crear nuevo movimiento
// @route   POST /api/movimientos
// @access  Private
const createMovimiento = async (req, res) => {
  try {
    const {
      tipo,
      concepto,
      categoria,
      importe,
      metodoPago,
      paciente,
      descripcion,
      sede,
      notas,
      documentos
    } = req.body;

    // Verificar que existe una caja abierta para la sede
    const arqueoActivo = await ArqueoCaja.obtenerArqueoActivo(sede);
    if (!arqueoActivo) {
      return res.status(400).json({
        success: false,
        message: 'No hay una caja abierta para esta sede. Debe abrir la caja primero.'
      });
    }

    // Validar paciente si es requerido
    if (paciente) {
      const pacienteExists = await Patient.findById(paciente);
      if (!pacienteExists) {
        return res.status(400).json({
          success: false,
          message: 'Paciente no encontrado'
        });
      }
    }

    // Crear movimiento
    const movimiento = await Movimiento.create({
      tipo,
      concepto,
      categoria,
      importe: parseFloat(importe),
      metodoPago,
      paciente: paciente || undefined,
      descripcion,
      sede,
      usuarioResponsable: req.user._id,
      arqueo: arqueoActivo._id,
      notas,
      documentos: documentos || [],
      creadoPor: req.user._id
    });

    // Actualizar totales en el arqueo
    await arqueoActivo.agregarMovimiento(
      movimiento._id,
      tipo,
      parseFloat(importe),
      metodoPago
    );

    // Poblar datos para respuesta
    const movimientoCreado = await Movimiento.findById(movimiento._id)
      .populate('paciente', 'nombre apellidos numeroHistoriaClinica')
      .populate('usuarioResponsable', 'nombre apellidos');

    res.status(201).json({
      success: true,
      data: movimientoCreado,
      message: 'Movimiento creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear movimiento:', error);
    
    // Manejar errores de validación de Mongoose
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

// @desc    Actualizar movimiento
// @route   PUT /api/movimientos/:id
// @access  Private
const updateMovimiento = async (req, res) => {
  try {
    const movimiento = await Movimiento.findById(req.params.id);

    if (!movimiento) {
      return res.status(404).json({
        success: false,
        message: 'Movimiento no encontrado'
      });
    }

    // Verificar que no esté anulado
    if (movimiento.estado === 'anulado') {
      return res.status(400).json({
        success: false,
        message: 'No se puede modificar un movimiento anulado'
      });
    }

    // Verificar que la caja asociada esté abierta
    const arqueo = await ArqueoCaja.findById(movimiento.arqueo);
    if (arqueo && arqueo.estado === 'cerrada') {
      return res.status(400).json({
        success: false,
        message: 'No se puede modificar un movimiento de una caja cerrada'
      });
    }

    const {
      concepto,
      descripcion,
      notas,
      documentos
    } = req.body;

    // Solo permitir actualizar campos específicos
    const updateData = {
      actualizadoPor: req.user._id
    };

    if (concepto !== undefined) updateData.concepto = concepto;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (notas !== undefined) updateData.notas = notas;
    if (documentos !== undefined) updateData.documentos = documentos;

    const movimientoActualizado = await Movimiento.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('paciente', 'nombre apellidos numeroHistoriaClinica')
     .populate('usuarioResponsable', 'nombre apellidos')
     .populate('actualizadoPor', 'nombre apellidos');

    res.json({
      success: true,
      data: movimientoActualizado,
      message: 'Movimiento actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar movimiento:', error);
    
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

// @desc    Anular movimiento
// @route   PUT /api/movimientos/:id/anular
// @access  Private
const anularMovimiento = async (req, res) => {
  try {
    const { motivo } = req.body;

    if (!motivo || motivo.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El motivo de anulación es obligatorio'
      });
    }

    const movimiento = await Movimiento.findById(req.params.id);

    if (!movimiento) {
      return res.status(404).json({
        success: false,
        message: 'Movimiento no encontrado'
      });
    }

    if (movimiento.estado === 'anulado') {
      return res.status(400).json({
        success: false,
        message: 'El movimiento ya está anulado'
      });
    }

    // Verificar que la caja asociada esté abierta
    const arqueo = await ArqueoCaja.findById(movimiento.arqueo);
    if (arqueo && arqueo.estado === 'cerrada') {
      return res.status(400).json({
        success: false,
        message: 'No se puede anular un movimiento de una caja cerrada'
      });
    }

    // Anular movimiento
    await movimiento.anular(motivo, req.user._id);

    // Actualizar totales en el arqueo
    if (arqueo) {
      if (movimiento.tipo === 'ingreso') {
        arqueo.totalIngresos = Math.max(0, arqueo.totalIngresos - movimiento.importe);
      } else {
        arqueo.totalGastos = Math.max(0, arqueo.totalGastos - movimiento.importe);
      }

      // Actualizar totales por método de pago
      switch (movimiento.metodoPago) {
        case 'Efectivo':
          arqueo.totalEfectivo = Math.max(0, arqueo.totalEfectivo - movimiento.importe);
          break;
        case 'Tarjeta':
          arqueo.totalTarjeta = Math.max(0, arqueo.totalTarjeta - movimiento.importe);
          break;
        case 'Transferencia':
          arqueo.totalTransferencia = Math.max(0, arqueo.totalTransferencia - movimiento.importe);
          break;
        case 'Bizum':
          arqueo.totalBizum = Math.max(0, arqueo.totalBizum - movimiento.importe);
          break;
        case 'Financiación':
          arqueo.totalFinanciacion = Math.max(0, arqueo.totalFinanciacion - movimiento.importe);
          break;
      }

      await arqueo.save();
    }

    const movimientoAnulado = await Movimiento.findById(req.params.id)
      .populate('paciente', 'nombre apellidos numeroHistoriaClinica')
      .populate('usuarioResponsable', 'nombre apellidos')
      .populate('usuarioAnulacion', 'nombre apellidos');

    res.json({
      success: true,
      data: movimientoAnulado,
      message: 'Movimiento anulado exitosamente'
    });
  } catch (error) {
    console.error('Error al anular movimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Obtener resumen de movimientos por fecha
// @route   GET /api/movimientos/resumen/:fecha
// @access  Private
const getResumenPorFecha = async (req, res) => {
  try {
    const { fecha } = req.params;
    const { sede } = req.query;

    if (!fecha) {
      return res.status(400).json({
        success: false,
        message: 'La fecha es obligatoria'
      });
    }

    const resumen = await Movimiento.obtenerResumenPorFecha(fecha, sede);

    // Procesar resultados para formato más útil
    const resultado = {
      fecha: fecha,
      sede: sede || 'todas',
      ingresos: {
        total: 0,
        cantidad: 0,
        movimientos: []
      },
      gastos: {
        total: 0,
        cantidad: 0,
        movimientos: []
      },
      balance: 0
    };

    resumen.forEach(item => {
      if (item._id === 'ingreso') {
        resultado.ingresos.total = item.total;
        resultado.ingresos.cantidad = item.cantidad;
        resultado.ingresos.movimientos = item.movimientos;
      } else if (item._id === 'gasto') {
        resultado.gastos.total = item.total;
        resultado.gastos.cantidad = item.cantidad;
        resultado.gastos.movimientos = item.movimientos;
      }
    });

    resultado.balance = resultado.ingresos.total - resultado.gastos.total;

    res.json({
      success: true,
      data: resultado
    });
  } catch (error) {
    console.error('Error al obtener resumen:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Buscar movimientos
// @route   GET /api/movimientos/buscar
// @access  Private
const buscarMovimientos = async (req, res) => {
  try {
    const { termino, sede, fechaInicio, fechaFin, limit = 20 } = req.query;

    if (!termino || termino.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'El término de búsqueda debe tener al menos 2 caracteres'
      });
    }

    const movimientos = await Movimiento.buscarMovimientos(
      termino.trim(),
      sede,
      fechaInicio,
      fechaFin
    ).limit(parseInt(limit));

    res.json({
      success: true,
      data: movimientos,
      totalEncontrados: movimientos.length
    });
  } catch (error) {
    console.error('Error al buscar movimientos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Obtener movimientos por rango de fechas
// @route   GET /api/movimientos/rango
// @access  Private
const getMovimientosPorRango = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, sede, tipo } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        success: false,
        message: 'Las fechas de inicio y fin son obligatorias'
      });
    }

    const movimientos = await Movimiento.obtenerMovimientosPorRango(
      fechaInicio,
      fechaFin,
      sede,
      tipo
    );

    // Calcular estadísticas
    const stats = {
      totalMovimientos: movimientos.length,
      totalIngresos: 0,
      totalGastos: 0,
      cantidadIngresos: 0,
      cantidadGastos: 0
    };

    movimientos.forEach(mov => {
      if (mov.tipo === 'ingreso') {
        stats.totalIngresos += mov.importe;
        stats.cantidadIngresos++;
      } else {
        stats.totalGastos += mov.importe;
        stats.cantidadGastos++;
      }
    });

    stats.balance = stats.totalIngresos - stats.totalGastos;

    res.json({
      success: true,
      data: movimientos,
      estadisticas: stats
    });
  } catch (error) {
    console.error('Error al obtener movimientos por rango:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getMovimientos,
  getMovimientoById,
  createMovimiento,
  updateMovimiento,
  anularMovimiento,
  getResumenPorFecha,
  buscarMovimientos,
  getMovimientosPorRango
};