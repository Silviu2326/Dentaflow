const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  // Numeración
  numero: {
    type: String,
    required: [true, 'El número de recibo es obligatorio'],
    unique: true,
    trim: true
  },
  serie: {
    type: String,
    default: 'R',
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
  // Relación con factura (opcional)
  facturaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },
  numeroFactura: {
    type: String,
    trim: true
  },
  // Fechas
  fecha: {
    type: Date,
    required: [true, 'La fecha es obligatoria'],
    default: Date.now
  },
  // Concepto y tratamiento
  concepto: {
    type: String,
    required: [true, 'El concepto es obligatorio'],
    trim: true,
    maxlength: [500, 'El concepto no puede exceder 500 caracteres']
  },
  tratamientoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Treatment'
  },
  tratamientoNombre: {
    type: String,
    trim: true
  },
  // Importes
  importe: {
    type: Number,
    required: [true, 'El importe es obligatorio'],
    min: [0.01, 'El importe debe ser mayor que 0']
  },
  // Información de pago
  metodoPago: {
    type: String,
    enum: ['efectivo', 'tarjeta', 'transferencia', 'cheque', 'bizum'],
    required: [true, 'El método de pago es obligatorio']
  },
  referenciaPago: {
    type: String,
    trim: true
  },
  // Para pagos con tarjeta
  tarjeta: {
    tipo: {
      type: String,
      enum: ['debito', 'credito']
    },
    terminacion: String, // Últimos 4 dígitos
    autorizacion: String,
    lote: String
  },
  // Para transferencias
  transferencia: {
    banco: String,
    iban: String,
    referencia: String
  },
  // Para cheques
  cheque: {
    numero: String,
    banco: String,
    fecha: Date
  },
  // Estado del recibo
  estado: {
    type: String,
    enum: ['emitido', 'anulado'],
    default: 'emitido'
  },
  // Observaciones
  observaciones: {
    type: String,
    maxlength: [500, 'Las observaciones no pueden exceder 500 caracteres']
  },
  // Información del profesional que atendió
  profesionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  profesionalNombre: {
    type: String,
    trim: true
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
    }
  },
  // Información de caja
  cajaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CashRegister'
  },
  turno: {
    type: String,
    enum: ['mañana', 'tarde', 'noche'],
    default: 'mañana'
  },
  // Auditoría
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  // Para anulaciones
  anuladoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fechaAnulacion: {
    type: Date
  },
  motivoAnulacion: {
    type: String,
    maxlength: [500, 'El motivo de anulación no puede exceder 500 caracteres']
  },
  // Información adicional
  descuentoAplicado: {
    type: Number,
    default: 0,
    min: [0, 'El descuento no puede ser negativo']
  },
  importeOriginal: {
    type: Number,
    min: [0, 'El importe original no puede ser negativo']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimización
receiptSchema.index({ numero: 1 });
receiptSchema.index({ pacienteId: 1, fecha: -1 });
receiptSchema.index({ fecha: -1 });
receiptSchema.index({ metodoPago: 1, fecha: -1 });
receiptSchema.index({ facturaId: 1 });
receiptSchema.index({ estado: 1 });
receiptSchema.index({ cajaId: 1, fecha: -1 });

// Virtual para mostrar método de pago formateado
receiptSchema.virtual('metodoPagoDisplay').get(function() {
  const metodos = {
    'efectivo': 'Efectivo',
    'tarjeta': 'Tarjeta',
    'transferencia': 'Transferencia',
    'cheque': 'Cheque',
    'bizum': 'Bizum'
  };
  return metodos[this.metodoPago] || this.metodoPago;
});

// Virtual para información completa de pago
receiptSchema.virtual('infoPagoCompleta').get(function() {
  let info = this.metodoPagoDisplay;
  
  switch (this.metodoPago) {
    case 'tarjeta':
      if (this.tarjeta && this.tarjeta.terminacion) {
        info += ` ****${this.tarjeta.terminacion}`;
      }
      break;
    case 'transferencia':
      if (this.transferencia && this.transferencia.referencia) {
        info += ` (${this.transferencia.referencia})`;
      }
      break;
    case 'cheque':
      if (this.cheque && this.cheque.numero) {
        info += ` Nº${this.cheque.numero}`;
      }
      break;
  }
  
  return info;
});

// Método estático para generar número de recibo
receiptSchema.statics.generarNumero = async function(serie = 'R') {
  const año = new Date().getFullYear();
  const ultimoRecibo = await this.findOne({ 
    serie,
    numero: { $regex: `^${serie}-${año}-` }
  }).sort({ numero: -1 });
  
  let siguienteNumero = 1;
  if (ultimoRecibo) {
    const partes = ultimoRecibo.numero.split('-');
    siguienteNumero = parseInt(partes[2]) + 1;
  }
  
  return `${serie}-${año}-${siguienteNumero.toString().padStart(4, '0')}`;
};

// Método para anular recibo
receiptSchema.methods.anular = function(motivo, usuarioId) {
  this.estado = 'anulado';
  this.motivoAnulacion = motivo;
  this.anuladoPor = usuarioId;
  this.fechaAnulacion = new Date();
  return this.save();
};

// Método para información básica
receiptSchema.methods.toInfoBasica = function() {
  return {
    id: this._id,
    numero: this.numero,
    pacienteNombre: this.pacienteNombre,
    fecha: this.fecha,
    importe: this.importe,
    metodoPago: this.metodoPagoDisplay,
    concepto: this.concepto,
    estado: this.estado
  };
};

// Método estático para obtener estadísticas por período
receiptSchema.statics.obtenerEstadisticas = async function(fechaDesde, fechaHasta) {
  const filtroFecha = {};
  if (fechaDesde) filtroFecha.$gte = new Date(fechaDesde);
  if (fechaHasta) filtroFecha.$lte = new Date(fechaHasta);
  
  const filtro = { estado: 'emitido' };
  if (Object.keys(filtroFecha).length > 0) {
    filtro.fecha = filtroFecha;
  }
  
  const stats = await this.aggregate([
    { $match: filtro },
    {
      $group: {
        _id: null,
        totalRecibos: { $sum: 1 },
        importeTotal: { $sum: '$importe' },
        efectivo: {
          $sum: {
            $cond: [{ $eq: ['$metodoPago', 'efectivo'] }, '$importe', 0]
          }
        },
        tarjeta: {
          $sum: {
            $cond: [{ $eq: ['$metodoPago', 'tarjeta'] }, '$importe', 0]
          }
        },
        transferencia: {
          $sum: {
            $cond: [{ $eq: ['$metodoPago', 'transferencia'] }, '$importe', 0]
          }
        },
        otros: {
          $sum: {
            $cond: [
              { $not: { $in: ['$metodoPago', ['efectivo', 'tarjeta', 'transferencia']] } },
              '$importe',
              0
            ]
          }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalRecibos: 0,
    importeTotal: 0,
    efectivo: 0,
    tarjeta: 0,
    transferencia: 0,
    otros: 0
  };
};

// Método estático para obtener recibos por método de pago
receiptSchema.statics.obtenerPorMetodoPago = function(fechaDesde, fechaHasta) {
  const filtroFecha = {};
  if (fechaDesde) filtroFecha.$gte = new Date(fechaDesde);
  if (fechaHasta) filtroFecha.$lte = new Date(fechaHasta);
  
  const filtro = { estado: 'emitido' };
  if (Object.keys(filtroFecha).length > 0) {
    filtro.fecha = filtroFecha;
  }
  
  return this.aggregate([
    { $match: filtro },
    {
      $group: {
        _id: '$metodoPago',
        count: { $sum: 1 },
        total: { $sum: '$importe' }
      }
    },
    { $sort: { total: -1 } }
  ]);
};

// Método estático para obtener recibos diarios
receiptSchema.statics.obtenerRecibosDiarios = function(fecha) {
  const inicioDia = new Date(fecha);
  inicioDia.setHours(0, 0, 0, 0);
  
  const finDia = new Date(fecha);
  finDia.setHours(23, 59, 59, 999);
  
  return this.find({
    fecha: { $gte: inicioDia, $lte: finDia },
    estado: 'emitido'
  })
  .populate('pacienteId', 'nombre apellidos')
  .populate('creadoPor', 'nombre apellidos')
  .sort({ fecha: -1 });
};

module.exports = mongoose.model('Receipt', receiptSchema);