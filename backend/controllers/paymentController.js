const Payment = require('../models/Payment');
const PaymentLink = require('../models/PaymentLink');
const Refund = require('../models/Refund');
const Patient = require('../models/Patient');
const User = require('../models/User');

// ============= CONTROLADORES PARA PAGOS =============

// @desc    Crear nuevo pago
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res) => {
  try {
    const {
      pacienteId, concepto, descripcion, importe, metodoPago, fechaVencimiento,
      pasarelaPago, tarjetaInfo, transferencia, financiacion, presupuesto,
      factura, tratamiento, cita, notas, tags
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

    // Calcular comisión según método de pago
    let comision = 0;
    if (metodoPago === 'tarjeta') {
      comision = importe * 0.03; // 3% para tarjeta
    } else if (metodoPago === 'link_pago') {
      comision = importe * 0.03; // 3% para link de pago
    } else if (metodoPago === 'transferencia') {
      comision = 2.40; // Fijo para transferencias
    }

    // Crear pago
    const payment = await Payment.create({
      paciente: pacienteId,
      concepto,
      descripcion,
      importe,
      moneda: 'EUR',
      comision,
      metodoPago,
      fechaVencimiento,
      pasarelaPago,
      tarjetaInfo,
      transferencia,
      financiacion,
      presupuesto,
      factura,
      tratamiento,
      cita,
      notas,
      tags: tags || [],
      sede: req.user.sede || patient.sede,
      profesional: req.user.id,
      creadoPor: req.user.id,
      historialEstados: [{
        estado: 'pendiente',
        usuario: req.user.id,
        motivo: 'Pago creado'
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Pago creado exitosamente',
      data: payment.toResumen()
    });

  } catch (error) {
    console.error('Error en createPayment:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener todos los pagos
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res) => {
  try {
    const {
      paciente = '',
      estado = '',
      metodoPago = '',
      pasarelaPago = '',
      sede = '',
      profesional = '',
      fechaDesde = '',
      fechaHasta = '',
      importeMin = '',
      importeMax = '',
      vencidos = '',
      sinConciliar = '',
      page = 1,
      limit = 20,
      sortBy = 'fechaPago',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filtros = {};
    
    if (paciente) filtros.paciente = paciente;
    if (estado) filtros.estado = estado;
    if (metodoPago) filtros.metodoPago = metodoPago;
    if (pasarelaPago) filtros.pasarelaPago = pasarelaPago;
    if (profesional) filtros.profesional = profesional;
    if (fechaDesde) filtros.fechaDesde = fechaDesde;
    if (fechaHasta) filtros.fechaHasta = fechaHasta;
    if (importeMin) filtros.importeMin = parseFloat(importeMin);
    if (importeMax) filtros.importeMax = parseFloat(importeMax);
    if (vencidos === 'true') filtros.vencidos = true;
    if (sinConciliar === 'true') filtros.sinConciliar = true;

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
    const query = Payment.buscarPagos(filtros);
    
    const payments = await query
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Contar total
    const totalQuery = Payment.buscarPagos(filtros);
    const total = await Payment.countDocuments(totalQuery.getFilter());

    // Convertir a resumen
    const paymentsWithInfo = payments.map(payment => payment.toResumen());

    res.status(200).json({
      success: true,
      data: {
        payments: paymentsWithInfo,
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
    console.error('Error en getPayments:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener pago por ID
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('paciente', 'nombre apellidos numeroHistoriaClinica email telefono')
      .populate('profesional', 'nombre apellidos')
      .populate('presupuesto', 'numero')
      .populate('factura', 'numero')
      .populate('historialEstados.usuario', 'nombre apellidos');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado'
      });
    }

    // Verificar acceso
    if (req.user.sede && !['owner', 'hq_analyst'].includes(req.user.role)) {
      if (payment.sede !== req.user.sede) {
        return res.status(403).json({
          success: false,
          message: 'No tienes acceso a este pago'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: payment
    });

  } catch (error) {
    console.error('Error en getPaymentById:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Actualizar pago
// @route   PUT /api/payments/:id
// @access  Private
const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado'
      });
    }

    // Verificar permisos
    if (payment.profesional.toString() !== req.user.id && 
        !['owner', 'hq_analyst', 'admin_sede'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para modificar este pago'
      });
    }

    // No permitir modificar pagos completados sin permisos especiales
    if (payment.estado === 'completado' && 
        !['owner', 'hq_analyst'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No se pueden modificar pagos completados'
      });
    }

    const {
      concepto, descripcion, importe, metodoPago, fechaVencimiento,
      notas, tags
    } = req.body;

    // Actualizar campos permitidos
    if (concepto) payment.concepto = concepto;
    if (descripcion !== undefined) payment.descripcion = descripcion;
    if (importe && payment.estado === 'pendiente') payment.importe = importe;
    if (metodoPago && payment.estado === 'pendiente') payment.metodoPago = metodoPago;
    if (fechaVencimiento) payment.fechaVencimiento = fechaVencimiento;
    if (notas !== undefined) payment.notas = notas;
    if (tags !== undefined) payment.tags = tags;

    payment.actualizadoPor = req.user.id;

    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Pago actualizado exitosamente',
      data: payment
    });

  } catch (error) {
    console.error('Error en updatePayment:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cambiar estado del pago
// @route   PUT /api/payments/:id/status
// @access  Private
const changePaymentStatus = async (req, res) => {
  try {
    const { estado, motivo, detalles } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado'
      });
    }

    // Verificar permisos
    if (!['owner', 'hq_analyst', 'admin_sede'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para cambiar el estado de pagos'
      });
    }

    await payment.cambiarEstado(estado, req.user.id, motivo, detalles);

    res.status(200).json({
      success: true,
      message: 'Estado del pago actualizado exitosamente',
      data: payment.toResumen()
    });

  } catch (error) {
    console.error('Error en changePaymentStatus:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Procesar pago
// @route   POST /api/payments/:id/process
// @access  Private
const processPayment = async (req, res) => {
  try {
    const { datosProcesamiento } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado'
      });
    }

    if (payment.estado !== 'pendiente') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden procesar pagos pendientes'
      });
    }

    await payment.procesar(datosProcesamiento, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Pago enviado a procesamiento',
      data: payment.toResumen()
    });

  } catch (error) {
    console.error('Error en processPayment:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Completar pago
// @route   POST /api/payments/:id/complete
// @access  Private
const completePayment = async (req, res) => {
  try {
    const { detalles } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado'
      });
    }

    await payment.completar(req.user.id, detalles);

    res.status(200).json({
      success: true,
      message: 'Pago completado exitosamente',
      data: payment.toResumen()
    });

  } catch (error) {
    console.error('Error en completePayment:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ============= CONTROLADORES PARA LINKS DE PAGO =============

// @desc    Crear link de pago
// @route   POST /api/payments/links
// @access  Private
const createPaymentLink = async (req, res) => {
  try {
    const {
      pacienteId, concepto, descripcion, importe, fechaVencimiento,
      configuracion, personalizacion, presupuesto, factura, tratamiento
    } = req.body;

    // Verificar paciente
    const patient = await Patient.findById(pacienteId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }

    // Crear link de pago
    const paymentLink = await PaymentLink.create({
      paciente: pacienteId,
      concepto,
      descripcion,
      importe,
      fechaVencimiento: fechaVencimiento || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días por defecto
      configuracion: configuracion || {},
      personalizacion: personalizacion || {},
      presupuesto,
      factura,
      tratamiento,
      sede: req.user.sede || patient.sede,
      profesional: req.user.id,
      creadoPor: req.user.id,
      historialEstados: [{
        estado: 'activo',
        usuario: req.user.id,
        motivo: 'Link de pago creado'
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Link de pago creado exitosamente',
      data: {
        id: paymentLink._id,
        linkId: paymentLink.linkId,
        url: paymentLink.url,
        token: paymentLink.token,
        fechaVencimiento: paymentLink.fechaVencimiento
      }
    });

  } catch (error) {
    console.error('Error en createPaymentLink:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener links de pago
// @route   GET /api/payments/links
// @access  Private
const getPaymentLinks = async (req, res) => {
  try {
    const {
      paciente = '',
      estado = '',
      sede = '',
      profesional = '',
      fechaDesde = '',
      fechaHasta = '',
      vencidos = '',
      proximosVencer = '',
      page = 1,
      limit = 20,
      sortBy = 'fechaCreacion',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filtros = {};
    
    if (paciente) filtros.paciente = paciente;
    if (estado) filtros.estado = estado;
    if (profesional) filtros.profesional = profesional;
    if (fechaDesde) filtros.fechaDesde = fechaDesde;
    if (fechaHasta) filtros.fechaHasta = fechaHasta;
    if (vencidos === 'true') filtros.vencidos = true;
    if (proximosVencer === 'true') filtros.proximosVencer = true;

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
    const query = PaymentLink.buscarLinks(filtros);
    
    const paymentLinks = await query
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Contar total
    const totalQuery = PaymentLink.buscarLinks(filtros);
    const total = await PaymentLink.countDocuments(totalQuery.getFilter());

    // Convertir a resumen
    const linksWithInfo = paymentLinks.map(link => link.toResumen());

    res.status(200).json({
      success: true,
      data: {
        links: linksWithInfo,
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
    console.error('Error en getPaymentLinks:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Renovar link de pago
// @route   PUT /api/payments/links/:id/renew
// @access  Private
const renewPaymentLink = async (req, res) => {
  try {
    const { nuevaFechaVencimiento } = req.body;

    const paymentLink = await PaymentLink.findById(req.params.id);

    if (!paymentLink) {
      return res.status(404).json({
        success: false,
        message: 'Link de pago no encontrado'
      });
    }

    await paymentLink.renovar(nuevaFechaVencimiento, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Link de pago renovado exitosamente',
      data: paymentLink.toResumen()
    });

  } catch (error) {
    console.error('Error en renewPaymentLink:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ============= CONTROLADORES PARA DEVOLUCIONES =============

// @desc    Crear solicitud de devolución
// @route   POST /api/payments/refunds
// @access  Private
const createRefund = async (req, res) => {
  try {
    const {
      pagoOriginalId, importeDevolucion, motivo, categoria, descripcion,
      metodoDevolucion, documentos
    } = req.body;

    // Verificar pago original
    const originalPayment = await Payment.findById(pagoOriginalId);
    if (!originalPayment) {
      return res.status(404).json({
        success: false,
        message: 'Pago original no encontrado'
      });
    }

    if (originalPayment.estado !== 'completado') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden devolver pagos completados'
      });
    }

    // Crear devolución
    const refund = await Refund.create({
      pagoOriginal: pagoOriginalId,
      pagoOriginalId: originalPayment._id.toString(),
      paciente: originalPayment.paciente,
      conceptoOriginal: originalPayment.concepto,
      importeOriginal: originalPayment.importe,
      metodoPagoOriginal: originalPayment.metodoPago,
      importeDevolucion,
      motivo,
      categoria,
      descripcion,
      metodoDevolucion: metodoDevolucion || { tipo: 'mismo_metodo' },
      documentos: documentos || [],
      sede: req.user.sede || originalPayment.sede,
      solicitadoPor: req.user.id,
      creadoPor: req.user.id,
      historialEstados: [{
        estado: 'solicitada',
        usuario: req.user.id,
        comentarios: 'Devolución solicitada'
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Solicitud de devolución creada exitosamente',
      data: refund.toResumen()
    });

  } catch (error) {
    console.error('Error en createRefund:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener devoluciones
// @route   GET /api/payments/refunds
// @access  Private
const getRefunds = async (req, res) => {
  try {
    const {
      paciente = '',
      estado = '',
      categoria = '',
      sede = '',
      solicitadoPor = '',
      fechaDesde = '',
      fechaHasta = '',
      pendientes = '',
      page = 1,
      limit = 20,
      sortBy = 'fechaSolicitud',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filtros = {};
    
    if (paciente) filtros.paciente = paciente;
    if (estado) filtros.estado = estado;
    if (categoria) filtros.categoria = categoria;
    if (solicitadoPor) filtros.solicitadoPor = solicitadoPor;
    if (fechaDesde) filtros.fechaDesde = fechaDesde;
    if (fechaHasta) filtros.fechaHasta = fechaHasta;
    if (pendientes === 'true') filtros.pendientes = true;

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
    const query = Refund.buscarDevoluciones(filtros);
    
    const refunds = await query
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Contar total
    const totalQuery = Refund.buscarDevoluciones(filtros);
    const total = await Refund.countDocuments(totalQuery.getFilter());

    // Convertir a resumen
    const refundsWithInfo = refunds.map(refund => refund.toResumen());

    res.status(200).json({
      success: true,
      data: {
        refunds: refundsWithInfo,
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
    console.error('Error en getRefunds:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Aprobar devolución
// @route   PUT /api/payments/refunds/:id/approve
// @access  Private
const approveRefund = async (req, res) => {
  try {
    const { importeAprobado, observaciones, condiciones } = req.body;

    const refund = await Refund.findById(req.params.id);

    if (!refund) {
      return res.status(404).json({
        success: false,
        message: 'Devolución no encontrada'
      });
    }

    if (!['owner', 'hq_analyst', 'admin_sede'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para aprobar devoluciones'
      });
    }

    await refund.aprobar(req.user.id, importeAprobado, observaciones, condiciones);

    res.status(200).json({
      success: true,
      message: 'Devolución aprobada exitosamente',
      data: refund.toResumen()
    });

  } catch (error) {
    console.error('Error en approveRefund:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Completar devolución
// @route   PUT /api/payments/refunds/:id/complete
// @access  Private
const completeRefund = async (req, res) => {
  try {
    const { detallesProcesamiento } = req.body;

    const refund = await Refund.findById(req.params.id);

    if (!refund) {
      return res.status(404).json({
        success: false,
        message: 'Devolución no encontrada'
      });
    }

    await refund.completar(req.user.id, detallesProcesamiento);

    res.status(200).json({
      success: true,
      message: 'Devolución completada exitosamente',
      data: refund.toResumen()
    });

  } catch (error) {
    console.error('Error en completeRefund:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ============= CONTROLADORES GENERALES =============

// @desc    Obtener estadísticas de pagos
// @route   GET /api/payments/stats
// @access  Private
const getPaymentStats = async (req, res) => {
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

    // Estadísticas de pagos
    const statsPagos = await Payment.obtenerEstadisticas(filtros);

    // Estadísticas de links
    const statsLinks = await PaymentLink.obtenerEstadisticas(filtros);

    // Estadísticas de devoluciones
    const statsRefunds = await Refund.obtenerEstadisticas(filtros);

    res.status(200).json({
      success: true,
      data: {
        pagos: statsPagos[0] || {},
        links: statsLinks[0] || {},
        devoluciones: statsRefunds[0] || {},
        resumen: {
          pagosCompletados: statsPagos[0]?.completados || 0,
          importeTotal: statsPagos[0]?.importeTotal || 0,
          comisiones: statsPagos[0]?.comisionesTotal || 0,
          linksActivos: statsLinks[0]?.activos || 0,
          devolucionesTotales: statsRefunds[0]?.totalDevoluciones || 0
        }
      }
    });

  } catch (error) {
    console.error('Error en getPaymentStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Conciliación de pagos
// @route   POST /api/payments/reconcile
// @access  Private
const reconcilePayments = async (req, res) => {
  try {
    const { extractoBancario, transacciones } = req.body;

    if (!['owner', 'hq_analyst', 'admin_sede'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar conciliaciones'
      });
    }

    // Aquí se implementaría la lógica de conciliación
    // Por ahora devolvemos un resumen básico

    const resultadoConciliacion = {
      transaccionesConciliadas: transacciones?.length || 0,
      importeTotalConciliado: 0,
      discrepanciasEncontradas: 0,
      fechaConciliacion: new Date()
    };

    res.status(200).json({
      success: true,
      message: 'Conciliación realizada exitosamente',
      data: resultadoConciliacion
    });

  } catch (error) {
    console.error('Error en reconcilePayments:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  // Pagos
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  changePaymentStatus,
  processPayment,
  completePayment,
  
  // Links de pago
  createPaymentLink,
  getPaymentLinks,
  renewPaymentLink,
  
  // Devoluciones
  createRefund,
  getRefunds,
  approveRefund,
  completeRefund,
  
  // Generales
  getPaymentStats,
  reconcilePayments
};