const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  descripcion: {
    type: String,
    required: [true, 'La descripción del item es obligatoria'],
    trim: true
  },
  tratamientoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Treatment'
  },
  cantidad: {
    type: Number,
    required: [true, 'La cantidad es obligatoria'],
    min: [0.01, 'La cantidad debe ser mayor que 0']
  },
  precioUnitario: {
    type: Number,
    required: [true, 'El precio unitario es obligatorio'],
    min: [0, 'El precio unitario no puede ser negativo']
  },
  descuento: {
    type: Number,
    default: 0,
    min: [0, 'El descuento no puede ser negativo'],
    max: [100, 'El descuento no puede ser mayor al 100%']
  },
  iva: {
    type: Number,
    default: 21,
    min: [0, 'El IVA no puede ser negativo']
  },
  subtotal: {
    type: Number,
    required: true
  }
});

// Calcular subtotal automáticamente
invoiceItemSchema.pre('save', function(next) {
  const precioConDescuento = this.precioUnitario * (1 - this.descuento / 100);
  this.subtotal = this.cantidad * precioConDescuento;
  next();
});

const invoiceSchema = new mongoose.Schema({
  // Numeración
  numero: {
    type: String,
    required: [true, 'El número de factura es obligatorio'],
    unique: true,
    trim: true
  },
  serie: {
    type: String,
    default: 'F',
    trim: true
  },
  // Cliente/Paciente
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'El paciente es obligatorio']
  },
  pacienteNombre: {
    type: String,
    required: [true, 'El nombre del paciente es obligatorio']
  },
  pacienteDni: {
    type: String,
    trim: true
  },
  pacienteDireccion: {
    calle: String,
    ciudad: String,
    codigoPostal: String,
    provincia: String,
    pais: { type: String, default: 'España' }
  },
  // Fechas
  fecha: {
    type: Date,
    required: [true, 'La fecha es obligatoria'],
    default: Date.now
  },
  fechaVencimiento: {
    type: Date,
    required: [true, 'La fecha de vencimiento es obligatoria']
  },
  // Items de la factura
  items: [invoiceItemSchema],
  // Importes
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'El subtotal no puede ser negativo']
  },
  descuentoGlobal: {
    type: Number,
    default: 0,
    min: [0, 'El descuento global no puede ser negativo']
  },
  baseImponible: {
    type: Number,
    required: true
  },
  totalIva: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'El total no puede ser negativo']
  },
  // Estado
  estado: {
    type: String,
    enum: ['borrador', 'emitida', 'enviada', 'pagada', 'vencida', 'anulada'],
    default: 'borrador'
  },
  // Información de pago
  metodoPago: {
    type: String,
    enum: ['efectivo', 'tarjeta', 'transferencia', 'cheque', 'financiacion'],
    required: function() {
      return this.estado === 'pagada';
    }
  },
  fechaPago: {
    type: Date
  },
  referenciaPago: {
    type: String,
    trim: true
  },
  // Observaciones
  observaciones: {
    type: String,
    maxlength: [1000, 'Las observaciones no pueden exceder 1000 caracteres']
  },
  // Información fiscal
  tipoFactura: {
    type: String,
    enum: ['ordinaria', 'simplificada', 'rectificativa'],
    default: 'ordinaria'
  },
  facturaRectificada: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },
  motivoRectificacion: {
    type: String,
    maxlength: [500, 'El motivo de rectificación no puede exceder 500 caracteres']
  },
  // Información de la clínica
  clinicaDatos: {
    nombre: String,
    nif: String,
    direccion: {
      calle: String,
      ciudad: String,
      codigoPostal: String,
      provincia: String
    },
    telefono: String,
    email: String
  },
  // Auditoría
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actualizadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now
  },
  // Control de envío
  enviada: {
    type: Boolean,
    default: false
  },
  fechaEnvio: {
    type: Date
  },
  emailEnvio: {
    type: String,
    trim: true,
    lowercase: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimización
invoiceSchema.index({ numero: 1 });
invoiceSchema.index({ pacienteId: 1, fecha: -1 });
invoiceSchema.index({ estado: 1, fechaVencimiento: 1 });
invoiceSchema.index({ fecha: -1 });
invoiceSchema.index({ fechaVencimiento: 1, estado: 1 });

// Virtual para verificar si está vencida
invoiceSchema.virtual('estaVencida').get(function() {
  return this.estado !== 'pagada' && new Date() > this.fechaVencimiento;
});

// Virtual para días de retraso
invoiceSchema.virtual('diasRetraso').get(function() {
  if (this.estado === 'pagada' || !this.estaVencida) return 0;
  const diferencia = new Date() - this.fechaVencimiento;
  return Math.floor(diferencia / (1000 * 60 * 60 * 24));
});

// Virtual para estado calculado
invoiceSchema.virtual('estadoCalculado').get(function() {
  if (this.estado === 'pagada' || this.estado === 'anulada') return this.estado;
  if (this.estaVencida) return 'vencida';
  return this.estado;
});

// Middleware pre-save para calcular importes
invoiceSchema.pre('save', function(next) {
  // Calcular subtotal de items
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  
  // Aplicar descuento global
  const subtotalConDescuento = this.subtotal * (1 - this.descuentoGlobal / 100);
  
  // Calcular base imponible e IVA
  this.baseImponible = subtotalConDescuento;
  this.totalIva = this.items.reduce((sum, item) => {
    const precioConDescuento = item.precioUnitario * (1 - item.descuento / 100);
    const baseItem = item.cantidad * precioConDescuento;
    return sum + (baseItem * item.iva / 100);
  }, 0);
  
  // Calcular total
  this.total = this.baseImponible + this.totalIva;
  
  // Actualizar fecha de modificación
  this.fechaActualizacion = Date.now();
  
  // Actualizar estado si está vencida
  if (this.estado !== 'pagada' && this.estado !== 'anulada' && this.estaVencida) {
    this.estado = 'vencida';
  }
  
  next();
});

// Método para generar número de factura
invoiceSchema.statics.generarNumero = async function(serie = 'F') {
  const año = new Date().getFullYear();
  const ultimaFactura = await this.findOne({ 
    serie,
    numero: { $regex: `^${serie}-${año}-` }
  }).sort({ numero: -1 });
  
  let siguienteNumero = 1;
  if (ultimaFactura) {
    const partes = ultimaFactura.numero.split('-');
    siguienteNumero = parseInt(partes[2]) + 1;
  }
  
  return `${serie}-${año}-${siguienteNumero.toString().padStart(3, '0')}`;
};

// Método para marcar como pagada
invoiceSchema.methods.marcarComoPagada = function(metodoPago, referencia = null) {
  this.estado = 'pagada';
  this.metodoPago = metodoPago;
  this.fechaPago = new Date();
  this.referenciaPago = referencia;
  return this.save();
};

// Método para anular factura
invoiceSchema.methods.anular = function(motivo = null) {
  this.estado = 'anulada';
  if (motivo) {
    this.observaciones = (this.observaciones || '') + `\nFactura anulada: ${motivo}`;
  }
  return this.save();
};

// Método para enviar por email
invoiceSchema.methods.marcarComoEnviada = function(email) {
  this.enviada = true;
  this.fechaEnvio = new Date();
  this.emailEnvio = email;
  if (this.estado === 'emitida') {
    this.estado = 'enviada';
  }
  return this.save();
};

// Método para información básica
invoiceSchema.methods.toInfoBasica = function() {
  return {
    id: this._id,
    numero: this.numero,
    pacienteNombre: this.pacienteNombre,
    fecha: this.fecha,
    fechaVencimiento: this.fechaVencimiento,
    total: this.total,
    estado: this.estadoCalculado,
    estaVencida: this.estaVencida,
    diasRetraso: this.diasRetraso
  };
};

// Método estático para obtener estadísticas
invoiceSchema.statics.obtenerEstadisticas = async function(fechaDesde, fechaHasta) {
  const filtroFecha = {};
  if (fechaDesde) filtroFecha.$gte = new Date(fechaDesde);
  if (fechaHasta) filtroFecha.$lte = new Date(fechaHasta);
  
  const filtro = filtroFecha ? { fecha: filtroFecha } : {};
  
  const stats = await this.aggregate([
    { $match: filtro },
    {
      $group: {
        _id: null,
        totalFacturas: { $sum: 1 },
        ingresoTotal: { $sum: '$total' },
        facturasEmitidas: {
          $sum: { $cond: [{ $eq: ['$estado', 'emitida'] }, 1, 0] }
        },
        facturasPagadas: {
          $sum: { $cond: [{ $eq: ['$estado', 'pagada'] }, 1, 0] }
        },
        facturasVencidas: {
          $sum: { $cond: [{ $eq: ['$estado', 'vencida'] }, 1, 0] }
        },
        importePendiente: {
          $sum: {
            $cond: [
              { $in: ['$estado', ['emitida', 'enviada', 'vencida']] },
              '$total',
              0
            ]
          }
        },
        importePagado: {
          $sum: {
            $cond: [{ $eq: ['$estado', 'pagada'] }, '$total', 0]
          }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalFacturas: 0,
    ingresoTotal: 0,
    facturasEmitidas: 0,
    facturasPagadas: 0,
    facturasVencidas: 0,
    importePendiente: 0,
    importePagado: 0
  };
};

// Método estático para obtener facturas vencidas
invoiceSchema.statics.obtenerVencidas = function() {
  return this.find({
    estado: { $in: ['emitida', 'enviada'] },
    fechaVencimiento: { $lt: new Date() }
  }).populate('pacienteId', 'nombre apellidos email telefono');
};

module.exports = mongoose.model('Invoice', invoiceSchema);