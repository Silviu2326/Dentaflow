const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Identificación única del pago
  numeroTransaccion: {
    type: String,
    unique: true,
    required: true
  },

  // Información del paciente
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'La referencia al paciente es obligatoria']
  },
  pacienteNombre: {
    type: String,
    required: true
  },

  // Concepto y descripción del pago
  concepto: {
    type: String,
    required: [true, 'El concepto del pago es obligatorio'],
    trim: true,
    maxlength: [500, 'El concepto no puede exceder 500 caracteres']
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },

  // Importes y moneda
  importe: {
    type: Number,
    required: [true, 'El importe es obligatorio'],
    min: [0, 'El importe no puede ser negativo']
  },
  moneda: {
    type: String,
    default: 'EUR',
    enum: ['EUR', 'USD', 'GBP']
  },
  comision: {
    type: Number,
    default: 0,
    min: [0, 'La comisión no puede ser negativa']
  },
  importeNeto: {
    type: Number,
    required: true,
    min: [0, 'El importe neto no puede ser negativo']
  },

  // Método de pago
  metodoPago: {
    type: String,
    enum: ['tarjeta', 'efectivo', 'transferencia', 'link_pago', 'financiacion', 'cheque', 'otro'],
    required: [true, 'El método de pago es obligatorio']
  },

  // Estado del pago
  estado: {
    type: String,
    enum: ['pendiente', 'procesando', 'completado', 'fallido', 'devuelto', 'cancelado', 'parcial'],
    default: 'pendiente',
    required: true
  },

  // Fechas importantes
  fechaPago: {
    type: Date,
    default: Date.now,
    required: true
  },
  fechaVencimiento: Date,
  fechaCompletado: Date,
  fechaCancelacion: Date,

  // Información de la pasarela de pago
  pasarelaPago: {
    type: String,
    enum: ['stripe', 'redsys', 'paypal', 'bizum', 'manual', 'otro']
  },
  referenciaExterna: {
    type: String,
    trim: true
  },
  webhookData: {
    type: mongoose.Schema.Types.Mixed
  },

  // Información de tarjeta (encriptada/tokenizada)
  tarjetaInfo: {
    ultimos4Digitos: String,
    marca: {
      type: String,
      enum: ['visa', 'mastercard', 'amex', 'otro']
    },
    tipoTarjeta: {
      type: String,
      enum: ['credito', 'debito', 'prepago']
    },
    tokenTarjeta: String, // Token de la pasarela
    fechaExpiracion: String, // MM/YY
    pais: String
  },

  // Información de transferencia
  transferencia: {
    numeroCuenta: String,
    codigoBanco: String,
    referencia: String,
    fechaTransferencia: Date,
    conceptoTransferencia: String
  },

  // Información de financiación
  financiacion: {
    numeroContrato: String,
    entidad: String,
    plazoMeses: Number,
    cuotaMensual: Number,
    interes: Number,
    fechaVencimientoCuota: Date,
    cuotasRestantes: Number
  },

  // Referencias a otros documentos
  presupuesto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget'
  },
  factura: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },
  tratamiento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Treatment'
  },
  cita: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },

  // Link de pago asociado
  linkPago: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentLink'
  },

  // Información de conciliación
  conciliacion: {
    conciliado: {
      type: Boolean,
      default: false
    },
    fechaConciliacion: Date,
    extractoBancario: String,
    discrepancias: [String],
    ajustes: [{
      motivo: String,
      importe: Number,
      fecha: {
        type: Date,
        default: Date.now
      },
      usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  },

  // Devoluciones relacionadas
  tieneDevolucion: {
    type: Boolean,
    default: false
  },
  importeDevuelto: {
    type: Number,
    default: 0,
    min: 0
  },

  // Información fiscal y contable
  fiscal: {
    iva: {
      tipo: {
        type: Number,
        default: 21
      },
      base: Number,
      cuota: Number
    },
    retencion: {
      tipo: Number,
      base: Number,
      cuota: Number
    },
    numeroFactura: String,
    serieFactura: String,
    fechaFacturacion: Date
  },

  // Notas y observaciones
  notas: {
    type: String,
    maxlength: [1000, 'Las notas no pueden exceder 1000 caracteres']
  },
  notasInternas: {
    type: String,
    maxlength: [1000, 'Las notas internas no pueden exceder 1000 caracteres']
  },

  // Información de seguridad
  seguridadPago: {
    ip: String,
    userAgent: String,
    codigoAutorizacion: String,
    verificacion3DS: {
      type: Boolean,
      default: false
    },
    riesgoFraude: {
      nivel: {
        type: String,
        enum: ['bajo', 'medio', 'alto'],
        default: 'bajo'
      },
      puntuacion: Number,
      motivos: [String]
    }
  },

  // Sede donde se realizó el pago
  sede: {
    type: String,
    enum: ['centro', 'norte', 'sur', 'este', 'oeste'],
    required: [true, 'La sede es obligatoria']
  },

  // Profesional que registró el pago
  profesional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El profesional es obligatorio']
  },

  // Historial de estados
  historialEstados: [{
    estado: {
      type: String,
      required: true
    },
    fecha: {
      type: Date,
      default: Date.now
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    motivo: String,
    detalles: mongoose.Schema.Types.Mixed
  }],

  // Tags para búsqueda y categorización
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],

  // Control de creación y actualización
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimización
paymentSchema.index({ numeroTransaccion: 1 });
paymentSchema.index({ paciente: 1, fechaPago: -1 });
paymentSchema.index({ estado: 1, fechaPago: -1 });
paymentSchema.index({ metodoPago: 1, estado: 1 });
paymentSchema.index({ pasarelaPago: 1, referenciaExterna: 1 });
paymentSchema.index({ sede: 1, fechaPago: -1 });
paymentSchema.index({ 'conciliacion.conciliado': 1 });
paymentSchema.index({ fechaPago: -1 });

// Virtual para verificar si está vencido
paymentSchema.virtual('estaVencido').get(function() {
  return this.fechaVencimiento && this.fechaVencimiento < new Date() && this.estado === 'pendiente';
});

// Virtual para calcular días de vencimiento
paymentSchema.virtual('diasVencimiento').get(function() {
  if (!this.fechaVencimiento || this.estado !== 'pendiente') return null;
  
  const hoy = new Date();
  const vencimiento = new Date(this.fechaVencimiento);
  const diffTime = vencimiento - hoy;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
});

// Virtual para porcentaje de comisión
paymentSchema.virtual('porcentajeComision').get(function() {
  if (this.importe === 0) return 0;
  return ((this.comision / this.importe) * 100).toFixed(2);
});

// Middleware pre-save
paymentSchema.pre('save', async function(next) {
  try {
    // Generar número de transacción si no existe
    if (!this.numeroTransaccion) {
      const year = new Date().getFullYear();
      const count = await mongoose.model('Payment').countDocuments();
      this.numeroTransaccion = `TXN-${year}-${String(count + 1).padStart(6, '0')}`;
    }

    // Calcular importe neto
    this.importeNeto = this.importe - this.comision;

    // Actualizar información del paciente si cambió la referencia
    if (this.isModified('paciente') && this.paciente) {
      const Patient = mongoose.model('Patient');
      const paciente = await Patient.findById(this.paciente).select('nombre apellidos');
      if (paciente) {
        this.pacienteNombre = `${paciente.nombre} ${paciente.apellidos}`;
      }
    }

    // Actualizar fechas según estado
    if (this.isModified('estado')) {
      switch (this.estado) {
        case 'completado':
          if (!this.fechaCompletado) this.fechaCompletado = Date.now();
          break;
        case 'cancelado':
          if (!this.fechaCancelacion) this.fechaCancelacion = Date.now();
          break;
      }
    }

    // Actualizar fecha de modificación
    this.fechaActualizacion = Date.now();

    next();
  } catch (error) {
    next(error);
  }
});

// Método para cambiar estado
paymentSchema.methods.cambiarEstado = function(nuevoEstado, usuarioId, motivo = '', detalles = {}) {
  const estadoAnterior = this.estado;
  this.estado = nuevoEstado;
  this.actualizadoPor = usuarioId;

  // Registrar en historial
  this.historialEstados.push({
    estado: nuevoEstado,
    fecha: Date.now(),
    usuario: usuarioId,
    motivo,
    detalles
  });

  return this.save();
};

// Método para procesar pago
paymentSchema.methods.procesar = async function(datosProcesamiento, usuarioId) {
  this.estado = 'procesando';
  
  // Actualizar información de procesamiento
  if (datosProcesamiento.pasarelaPago) {
    this.pasarelaPago = datosProcesamiento.pasarelaPago;
  }
  
  if (datosProcesamiento.referenciaExterna) {
    this.referenciaExterna = datosProcesamiento.referenciaExterna;
  }

  if (datosProcesamiento.tarjetaInfo) {
    this.tarjetaInfo = { ...this.tarjetaInfo, ...datosProcesamiento.tarjetaInfo };
  }

  if (datosProcesamiento.seguridadPago) {
    this.seguridadPago = { ...this.seguridadPago, ...datosProcesamiento.seguridadPago };
  }

  this.actualizadoPor = usuarioId;

  // Registrar en historial
  this.historialEstados.push({
    estado: 'procesando',
    usuario: usuarioId,
    motivo: 'Pago enviado a procesamiento',
    detalles: datosProcesamiento
  });

  return this.save();
};

// Método para completar pago
paymentSchema.methods.completar = function(usuarioId, detalles = {}) {
  this.estado = 'completado';
  this.fechaCompletado = Date.now();
  this.actualizadoPor = usuarioId;

  if (detalles.codigoAutorizacion) {
    this.seguridadPago = this.seguridadPago || {};
    this.seguridadPago.codigoAutorizacion = detalles.codigoAutorizacion;
  }

  this.historialEstados.push({
    estado: 'completado',
    usuario: usuarioId,
    motivo: 'Pago completado exitosamente',
    detalles
  });

  return this.save();
};

// Método para marcar como fallido
paymentSchema.methods.marcarFallido = function(usuarioId, motivo, detalles = {}) {
  this.estado = 'fallido';
  this.actualizadoPor = usuarioId;

  this.historialEstados.push({
    estado: 'fallido',
    usuario: usuarioId,
    motivo,
    detalles
  });

  return this.save();
};

// Método para conciliar
paymentSchema.methods.conciliar = function(usuarioId, datosExtracto = {}) {
  this.conciliacion.conciliado = true;
  this.conciliacion.fechaConciliacion = Date.now();
  if (datosExtracto.referencia) {
    this.conciliacion.extractoBancario = datosExtracto.referencia;
  }
  
  this.actualizadoPor = usuarioId;

  return this.save();
};

// Método para obtener resumen
paymentSchema.methods.toResumen = function() {
  return {
    id: this._id,
    numeroTransaccion: this.numeroTransaccion,
    pacienteId: this.paciente,
    pacienteNombre: this.pacienteNombre,
    concepto: this.concepto,
    importe: this.importe,
    metodoPago: this.metodoPago,
    estado: this.estado,
    fechaPago: this.fechaPago,
    fechaVencimiento: this.fechaVencimiento,
    pasarelaPago: this.pasarelaPago,
    referenciaExterna: this.referenciaExterna,
    comision: this.comision,
    importeNeto: this.importeNeto,
    estaVencido: this.estaVencido,
    diasVencimiento: this.diasVencimiento
  };
};

// Método estático para buscar pagos
paymentSchema.statics.buscarPagos = function(filtros = {}) {
  const query = {};

  if (filtros.paciente) {
    query.$or = [
      { pacienteNombre: { $regex: filtros.paciente, $options: 'i' } },
      { numeroTransaccion: { $regex: filtros.paciente, $options: 'i' } },
      { concepto: { $regex: filtros.paciente, $options: 'i' } }
    ];
  }

  if (filtros.estado) query.estado = filtros.estado;
  if (filtros.metodoPago) query.metodoPago = filtros.metodoPago;
  if (filtros.pasarelaPago) query.pasarelaPago = filtros.pasarelaPago;
  if (filtros.sede) query.sede = filtros.sede;
  if (filtros.profesional) query.profesional = filtros.profesional;

  if (filtros.fechaDesde || filtros.fechaHasta) {
    query.fechaPago = {};
    if (filtros.fechaDesde) query.fechaPago.$gte = new Date(filtros.fechaDesde);
    if (filtros.fechaHasta) query.fechaPago.$lte = new Date(filtros.fechaHasta);
  }

  if (filtros.importeMin || filtros.importeMax) {
    query.importe = {};
    if (filtros.importeMin) query.importe.$gte = filtros.importeMin;
    if (filtros.importeMax) query.importe.$lte = filtros.importeMax;
  }

  if (filtros.vencidos) {
    query.fechaVencimiento = { $lt: new Date() };
    query.estado = 'pendiente';
  }

  if (filtros.sinConciliar) {
    query['conciliacion.conciliado'] = false;
    query.estado = 'completado';
  }

  return this.find(query)
    .populate('paciente', 'nombre apellidos numeroHistoriaClinica email telefono')
    .populate('profesional', 'nombre apellidos')
    .populate('presupuesto', 'numero')
    .populate('factura', 'numero')
    .sort({ fechaPago: -1 });
};

// Método estático para obtener estadísticas
paymentSchema.statics.obtenerEstadisticas = function(filtros = {}) {
  const matchStage = {};
  
  if (filtros.sede) matchStage.sede = filtros.sede;
  if (filtros.fechaDesde || filtros.fechaHasta) {
    matchStage.fechaPago = {};
    if (filtros.fechaDesde) matchStage.fechaPago.$gte = new Date(filtros.fechaDesde);
    if (filtros.fechaHasta) matchStage.fechaPago.$lte = new Date(filtros.fechaHasta);
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalPagos: { $sum: 1 },
        importeTotal: { $sum: '$importe' },
        importeNeto: { $sum: '$importeNeto' },
        comisionesTotal: { $sum: '$comision' },
        
        // Por estado
        completados: { $sum: { $cond: [{ $eq: ['$estado', 'completado'] }, 1, 0] } },
        pendientes: { $sum: { $cond: [{ $eq: ['$estado', 'pendiente'] }, 1, 0] } },
        fallidos: { $sum: { $cond: [{ $eq: ['$estado', 'fallido'] }, 1, 0] } },
        
        // Importes por estado
        importeCompletados: { $sum: { $cond: [{ $eq: ['$estado', 'completado'] }, '$importe', 0] } },
        importePendientes: { $sum: { $cond: [{ $eq: ['$estado', 'pendiente'] }, '$importe', 0] } },
        
        // Por método de pago
        tarjeta: { $sum: { $cond: [{ $eq: ['$metodoPago', 'tarjeta'] }, '$importe', 0] } },
        efectivo: { $sum: { $cond: [{ $eq: ['$metodoPago', 'efectivo'] }, '$importe', 0] } },
        transferencia: { $sum: { $cond: [{ $eq: ['$metodoPago', 'transferencia'] }, '$importe', 0] } },
        linkPago: { $sum: { $cond: [{ $eq: ['$metodoPago', 'link_pago'] }, '$importe', 0] } },
        
        // Conciliación
        sinConciliar: { 
          $sum: { 
            $cond: [
              { $and: [
                { $eq: ['$estado', 'completado'] },
                { $eq: ['$conciliacion.conciliado', false] }
              ]}, 
              '$importe', 
              0
            ] 
          } 
        },
        
        // Promedio
        importePromedio: { $avg: '$importe' },
        comisionPromedio: { $avg: '$comision' }
      }
    }
  ]);
};

module.exports = mongoose.model('Payment', paymentSchema);