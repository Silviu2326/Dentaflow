const Invoice = require('../models/Invoice');
const Receipt = require('../models/Receipt');
const CashRegister = require('../models/CashRegister');

// ============= INVOICE MANAGEMENT =============

// @desc    Obtener todas las facturas
// @route   GET /api/billing/invoices
// @access  Private
const getInvoices = async (req, res) => {
  try {
    const {
      search,
      estado,
      pacienteId,
      dateFrom,
      dateTo,
      vencidas,
      page = 1,
      limit = 10,
      sort = '-fecha'
    } = req.query;

    // Construir filtro
    let filter = {};

    if (search) {
      filter.$or = [
        { numero: { $regex: search, $options: 'i' } },
        { pacienteNombre: { $regex: search, $options: 'i' } }
      ];
    }

    if (estado) {
      filter.estado = estado;
    }

    if (pacienteId) {
      filter.pacienteId = pacienteId;
    }

    if (dateFrom || dateTo) {
      filter.fecha = {};
      if (dateFrom) filter.fecha.$gte = new Date(dateFrom);
      if (dateTo) filter.fecha.$lte = new Date(dateTo);
    }

    if (vencidas === 'true') {
      filter.estado = { $in: ['emitida', 'enviada'] };
      filter.fechaVencimiento = { $lt: new Date() };
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

    const invoices = await Invoice.find(filter)
      .sort(sortOption)
      .limit(limitNumber)
      .skip(skip)
      .populate('pacienteId', 'nombre apellidos email telefono')
      .populate('creadoPor', 'nombre apellidos');

    const total = await Invoice.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: invoices.length,
      total,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber)
      },
      data: invoices
    });
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Obtener factura por ID
// @route   GET /api/billing/invoices/:id
// @access  Private
const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('pacienteId', 'nombre apellidos email telefono dni direccion')
      .populate('creadoPor', 'nombre apellidos')
      .populate('actualizadoPor', 'nombre apellidos');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Error al obtener factura:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de factura inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Crear nueva factura
// @route   POST /api/billing/invoices
// @access  Private
const createInvoice = async (req, res) => {
  try {
    // Generar número de factura automáticamente
    const numero = await Invoice.generarNumero(req.body.serie || 'F');
    
    // Obtener datos del paciente
    const Patient = require('../models/Patient');
    const paciente = await Patient.findById(req.body.pacienteId);
    
    if (!paciente) {
      return res.status(400).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }

    const invoiceData = {
      ...req.body,
      numero,
      pacienteNombre: `${paciente.nombre} ${paciente.apellidos}`,
      pacienteDni: paciente.dni,
      pacienteDireccion: paciente.direccion,
      creadoPor: req.user._id,
      actualizadoPor: req.user._id
    };

    // Calcular fecha de vencimiento si no se proporciona
    if (!invoiceData.fechaVencimiento) {
      const fechaVencimiento = new Date(invoiceData.fecha || Date.now());
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 30); // 30 días por defecto
      invoiceData.fechaVencimiento = fechaVencimiento;
    }

    const invoice = await Invoice.create(invoiceData);
    
    await invoice.populate([
      { path: 'pacienteId', select: 'nombre apellidos email' },
      { path: 'creadoPor', select: 'nombre apellidos' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Factura creada exitosamente',
      data: invoice
    });
  } catch (error) {
    console.error('Error al crear factura:', error);

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

// @desc    Actualizar factura
// @route   PUT /api/billing/invoices/:id
// @access  Private
const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada'
      });
    }

    // No permitir editar facturas pagadas
    if (invoice.estado === 'pagada') {
      return res.status(400).json({
        success: false,
        message: 'No se puede editar una factura pagada'
      });
    }

    req.body.actualizadoPor = req.user._id;
    
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('pacienteId creadoPor actualizadoPor', 'nombre apellidos email');

    res.status(200).json({
      success: true,
      message: 'Factura actualizada exitosamente',
      data: updatedInvoice
    });
  } catch (error) {
    console.error('Error al actualizar factura:', error);

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

// @desc    Marcar factura como pagada
// @route   PUT /api/billing/invoices/:id/pay
// @access  Private
const payInvoice = async (req, res) => {
  try {
    const { metodoPago, referencia } = req.body;
    
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada'
      });
    }

    if (invoice.estado === 'pagada') {
      return res.status(400).json({
        success: false,
        message: 'La factura ya está pagada'
      });
    }

    await invoice.marcarComoPagada(metodoPago, referencia);

    // Crear recibo automáticamente
    const numeroRecibo = await Receipt.generarNumero();
    
    await Receipt.create({
      numero: numeroRecibo,
      pacienteId: invoice.pacienteId,
      pacienteNombre: invoice.pacienteNombre,
      pacienteDni: invoice.pacienteDni,
      facturaId: invoice._id,
      numeroFactura: invoice.numero,
      concepto: `Pago de factura ${invoice.numero}`,
      importe: invoice.total,
      metodoPago,
      referenciaPago: referencia,
      creadoPor: req.user._id
    });

    res.status(200).json({
      success: true,
      message: 'Factura marcada como pagada',
      data: invoice
    });
  } catch (error) {
    console.error('Error al marcar factura como pagada:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// ============= RECEIPTS MANAGEMENT =============

// @desc    Obtener todos los recibos
// @route   GET /api/billing/receipts
// @access  Private
const getReceipts = async (req, res) => {
  try {
    const {
      search,
      metodoPago,
      pacienteId,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sort = '-fecha'
    } = req.query;

    let filter = { estado: 'emitido' };

    if (search) {
      filter.$or = [
        { numero: { $regex: search, $options: 'i' } },
        { pacienteNombre: { $regex: search, $options: 'i' } },
        { concepto: { $regex: search, $options: 'i' } }
      ];
    }

    if (metodoPago) {
      filter.metodoPago = metodoPago;
    }

    if (pacienteId) {
      filter.pacienteId = pacienteId;
    }

    if (dateFrom || dateTo) {
      filter.fecha = {};
      if (dateFrom) filter.fecha.$gte = new Date(dateFrom);
      if (dateTo) filter.fecha.$lte = new Date(dateTo);
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

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

    const receipts = await Receipt.find(filter)
      .sort(sortOption)
      .limit(limitNumber)
      .skip(skip)
      .populate('pacienteId', 'nombre apellidos')
      .populate('creadoPor', 'nombre apellidos');

    const total = await Receipt.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: receipts.length,
      total,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber)
      },
      data: receipts
    });
  } catch (error) {
    console.error('Error al obtener recibos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Crear nuevo recibo
// @route   POST /api/billing/receipts
// @access  Private
const createReceipt = async (req, res) => {
  try {
    const numero = await Receipt.generarNumero(req.body.serie || 'R');
    
    // Obtener datos del paciente
    const Patient = require('../models/Patient');
    const paciente = await Patient.findById(req.body.pacienteId);
    
    if (!paciente) {
      return res.status(400).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }

    const receiptData = {
      ...req.body,
      numero,
      pacienteNombre: `${paciente.nombre} ${paciente.apellidos}`,
      pacienteDni: paciente.dni,
      creadoPor: req.user._id
    };

    const receipt = await Receipt.create(receiptData);
    
    await receipt.populate([
      { path: 'pacienteId', select: 'nombre apellidos' },
      { path: 'creadoPor', select: 'nombre apellidos' }
    ]);

    // Agregar movimiento a caja si está abierta
    try {
      const cajaHoy = await CashRegister.obtenerCajaDelDia();
      if (cajaHoy && cajaHoy.estaAbierta) {
        await cajaHoy.agregarMovimiento({
          tipo: 'ingreso',
          concepto: receipt.concepto,
          importe: receipt.importe,
          metodoPago: receipt.metodoPago,
          reciboId: receipt._id,
          pacienteId: receipt.pacienteId,
          creadoPor: req.user._id
        });
      }
    } catch (cajaError) {
      console.warn('No se pudo agregar movimiento a caja:', cajaError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Recibo creado exitosamente',
      data: receipt
    });
  } catch (error) {
    console.error('Error al crear recibo:', error);

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

// ============= CASH REGISTER MANAGEMENT =============

// @desc    Obtener caja del día
// @route   GET /api/billing/cash-register
// @access  Private
const getCashRegister = async (req, res) => {
  try {
    const { fecha } = req.query;
    const fechaBuscar = fecha ? new Date(fecha) : new Date();
    
    const caja = await CashRegister.obtenerCajaDelDia(fechaBuscar);

    if (!caja) {
      return res.status(404).json({
        success: false,
        message: 'No hay caja para esta fecha'
      });
    }

    res.status(200).json({
      success: true,
      data: caja
    });
  } catch (error) {
    console.error('Error al obtener caja:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Abrir caja
// @route   POST /api/billing/cash-register/open
// @access  Private
const openCashRegister = async (req, res) => {
  try {
    const { fecha, importeInicial, observaciones } = req.body;
    
    const caja = await CashRegister.abrirCaja(
      fecha || new Date(),
      req.user._id,
      importeInicial || 0,
      observaciones
    );

    res.status(201).json({
      success: true,
      message: 'Caja abierta exitosamente',
      data: caja
    });
  } catch (error) {
    console.error('Error al abrir caja:', error);
    
    if (error.message.includes('Ya existe una caja')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Cerrar caja
// @route   PUT /api/billing/cash-register/:id/close
// @access  Private
const closeCashRegister = async (req, res) => {
  try {
    const { conteoFisico, observaciones } = req.body;
    
    const caja = await CashRegister.findById(req.params.id);
    
    if (!caja) {
      return res.status(404).json({
        success: false,
        message: 'Caja no encontrada'
      });
    }

    await caja.cerrarCaja(req.user._id, conteoFisico, observaciones);

    res.status(200).json({
      success: true,
      message: 'Caja cerrada exitosamente',
      data: caja
    });
  } catch (error) {
    console.error('Error al cerrar caja:', error);
    
    if (error.message.includes('no está abierta')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// ============= STATISTICS =============

// @desc    Obtener estadísticas de facturación
// @route   GET /api/billing/stats
// @access  Private
const getBillingStats = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    
    const [invoiceStats, receiptStats, cashStats] = await Promise.all([
      Invoice.obtenerEstadisticas(dateFrom, dateTo),
      Receipt.obtenerEstadisticas(dateFrom, dateTo),
      CashRegister.obtenerEstadisticas(dateFrom, dateTo)
    ]);

    res.status(200).json({
      success: true,
      data: {
        facturas: invoiceStats,
        recibos: receiptStats,
        caja: cashStats
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

module.exports = {
  // Invoices
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  payInvoice,
  
  // Receipts
  getReceipts,
  createReceipt,
  
  // Cash Register
  getCashRegister,
  openCashRegister,
  closeCashRegister,
  
  // Statistics
  getBillingStats
};