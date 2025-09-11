const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
  // Número de transacción de la devolución
  numeroTransaccion: {
    type: String,
    unique: true,
    required: true
  },

  // Referencia al pago original
  pagoOriginal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: [true, 'La referencia al pago original es obligatoria']
  },
  pagoOriginalId: {
    type: String,
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

  // Información del pago original
  conceptoOriginal: {
    type: String,
    required: true
  },
  importeOriginal: {
    type: Number,
    required: true,
    min: [0, 'El importe original no puede ser negativo']
  },
  metodoPagoOriginal: {
    type: String,
    enum: ['tarjeta', 'efectivo', 'transferencia', 'link_pago', 'financiacion', 'cheque', 'otro'],
    required: true
  },

  // Información de la devolución
  importeDevolucion: {
    type: Number,
    required: [true, 'El importe de devolución es obligatorio'],
    min: [0.01, 'El importe de devolución debe ser mayor a 0']
  },
  moneda: {
    type: String,
    default: 'EUR',
    enum: ['EUR', 'USD', 'GBP']
  },
  
  // Tipo de devolución
  tipoDevolucion: {
    type: String,
    enum: ['total', 'parcial'],
    required: true
  },

  // Estado de la devolución
  estado: {
    type: String,
    enum: ['solicitada', 'revisando', 'aprobada', 'rechazada', 'procesando', 'completada', 'fallida', 'cancelada'],
    default: 'solicitada'
  },

  // Motivo de la devolución
  motivo: {
    type: String,
    required: [true, 'El motivo de la devolución es obligatorio'],
    trim: true,
    maxlength: [500, 'El motivo no puede exceder 500 caracteres']
  },
  categoria: {
    type: String,
    enum: [
      'cancelacion_tratamiento',
      'insatisfaccion_servicio', 
      'error_facturacion',
      'duplicacion_pago',
      'cambio_tratamiento',
      'problema_tecnico',
      'solicitud_paciente',
      'error_administrativo',
      'otro'
    ],
    required: true
  },

  // Descripción detallada
  descripcion: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },

  // Fechas importantes
  fechaSolicitud: {
    type: Date,
    default: Date.now,
    required: true
  },
  fechaRevision: Date,
  fechaAprobacion: Date,
  fechaRechazo: Date,
  fechaProceso: Date,
  fechaCompletado: Date,

  // Información de aprobación
  aprobacion: {
    aprobadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    fechaAprobacion: Date,
    observaciones: {
      type: String,
      maxlength: [500, 'Las observaciones no pueden exceder 500 caracteres']
    },
    importeAprobado: Number,
    condiciones: [String]
  },

  // Información de rechazo
  rechazo: {
    rechazadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    fechaRechazo: Date,
    motivoRechazo: {
      type: String,
      maxlength: [500, 'El motivo de rechazo no puede exceder 500 caracteres']
    },
    observaciones: {
      type: String,
      maxlength: [500, 'Las observaciones no pueden exceder 500 caracteres']
    }
  },

  // Información de procesamiento
  procesamiento: {
    pasarelaPago: {
      type: String,
      enum: ['stripe', 'redsys', 'paypal', 'manual']
    },
    referenciaExterna: String,
    numeroAutorizacion: String,
    comisionDevolucion: {
      type: Number,
      default: 0,
      min: 0
    },
    importeNetoDev: Number,
    fechaEjecucion: Date,
    tiempoProcesamiento: Number, // en horas
    detallesRespuesta: mongoose.Schema.Types.Mixed
  },

  // Método de devolución
  metodoDevolucion: {
    tipo: {
      type: String,
      enum: ['mismo_metodo', 'transferencia', 'efectivo', 'cheque', 'credito_cuenta'],
      default: 'mismo_metodo'
    },
    detalles: {
      numeroCuenta: String,
      titularCuenta: String,
      codigoBanco: String,
      concepto: String,
      observaciones: String
    }
  },

  // Documentación adjunta
  documentos: [{
    tipo: {
      type: String,
      enum: ['solicitud', 'justificante', 'autorizacion', 'comprobante', 'correspondencia'],
      required: true
    },
    nombre: String,
    url: String,
    fechaSubida: {
      type: Date,
      default: Date.now
    },
    subidoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Comunicaciones con el paciente
  comunicaciones: [{
    fecha: {
      type: Date,
      default: Date.now
    },
    tipo: {
      type: String,
      enum: ['email', 'telefono', 'sms', 'presencial', 'carta'],
      required: true
    },
    asunto: String,
    mensaje: String,
    respuesta: String,
    realizadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    estado: {
      type: String,
      enum: ['enviado', 'recibido', 'leido', 'respondido'],
      default: 'enviado'
    }
  }],

  // Información contable y fiscal
  contabilidad: {
    cuentaContable: String,
    centroCostos: String,
    afectaFacturacion: {
      type: Boolean,
      default: true
    },
    facturaOriginal: String,
    facturaRectificativa: String,
    impactoIVA: {
      tipo: Number,
      base: Number,
      cuota: Number
    },
    fechaContabilizacion: Date
  },

  // Información de seguimiento interno
  seguimiento: {
    prioridad: {
      type: String,
      enum: ['baja', 'media', 'alta', 'urgente'],
      default: 'media'
    },
    asignadoA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    fechaAsignacion: Date,
    tiempoLimite: Date,
    recordatorios: [{
      fecha: Date,
      mensaje: String,
      usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  },

  // Impacto en otras áreas
  impactos: {
    afectaTratamiento: {
      type: Boolean,
      default: false
    },
    tratamiento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Treatment'
    },
    afectaPresupuesto: {
      type: Boolean,
      default: false
    },
    presupuesto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget'
    },
    afectaComisiones: {
      type: Boolean,
      default: false
    },
    detallesImpacto: String
  },

  // Sede donde se procesa
  sede: {
    type: String,
    enum: ['centro', 'norte', 'sur', 'este', 'oeste'],
    required: [true, 'La sede es obligatoria']
  },

  // Profesionales involucrados
  solicitadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Debe especificarse quién solicita la devolución']
  },
  procesadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Historial completo de estados
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
    comentarios: String,
    documentos: [String]
  }],

  // Notas internas
  notasInternas: {
    type: String,
    maxlength: [2000, 'Las notas internas no pueden exceder 2000 caracteres']
  },

  // Control de versiones y auditoría
  version: {
    type: Number,
    default: 1
  },
  ultimaModificacion: {
    fecha: {
      type: Date,
      default: Date.now
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cambios: [String]
  },

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
refundSchema.index({ numeroTransaccion: 1 });
refundSchema.index({ pagoOriginal: 1 });
refundSchema.index({ paciente: 1, fechaSolicitud: -1 });
refundSchema.index({ estado: 1, fechaSolicitud: -1 });
refundSchema.index({ categoria: 1, estado: 1 });
refundSchema.index({ sede: 1, fechaSolicitud: -1 });
refundSchema.index({ 'aprobacion.aprobadoPor': 1 });
refundSchema.index({ 'seguimiento.asignadoA': 1 });

// Virtual para calcular días de procesamiento
refundSchema.virtual('diasProcesamiento').get(function() {
  const fechaInicio = this.fechaSolicitud;
  const fechaFin = this.fechaCompletado || new Date();
  const diffTime = Math.abs(fechaFin - fechaInicio);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual para verificar si está en plazo
refundSchema.virtual('enPlazo').get(function() {
  if (!this.seguimiento.tiempoLimite) return true;
  return new Date() <= this.seguimiento.tiempoLimite;
});

// Virtual para porcentaje devuelto
refundSchema.virtual('porcentajeDevuelto').get(function() {
  if (this.importeOriginal === 0) return 0;
  return ((this.importeDevolucion / this.importeOriginal) * 100).toFixed(2);
});

// Middleware pre-save
refundSchema.pre('save', async function(next) {
  try {
    // Generar número de transacción si no existe
    if (!this.numeroTransaccion) {
      const year = new Date().getFullYear();
      const count = await mongoose.model('Refund').countDocuments();
      this.numeroTransaccion = `REF-${year}-${String(count + 1).padStart(6, '0')}`;
    }

    // Determinar tipo de devolución
    if (this.importeDevolucion >= this.importeOriginal) {
      this.tipoDevolucion = 'total';
    } else {
      this.tipoDevolucion = 'parcial';
    }

    // Calcular importe neto si hay comisión
    if (this.procesamiento && this.procesamiento.comisionDevolucion) {
      this.procesamiento.importeNetoDev = this.importeDevolucion - this.procesamiento.comisionDevolucion;
    }

    // Actualizar información del paciente si cambió
    if (this.isModified('paciente') && this.paciente) {
      const Patient = mongoose.model('Patient');
      const paciente = await Patient.findById(this.paciente).select('nombre apellidos');
      if (paciente) {
        this.pacienteNombre = `${paciente.nombre} ${paciente.apellidos}`;
      }
    }

    // Actualizar fechas según estado
    if (this.isModified('estado')) {
      const ahora = Date.now();
      switch (this.estado) {
        case 'aprobada':
          if (!this.fechaAprobacion) this.fechaAprobacion = ahora;
          break;
        case 'rechazada':
          if (!this.fechaRechazo) this.fechaRechazo = ahora;
          break;
        case 'procesando':
          if (!this.fechaProceso) this.fechaProceso = ahora;
          break;
        case 'completada':
          if (!this.fechaCompletado) this.fechaCompletado = ahora;
          break;
      }
    }

    // Actualizar fecha de modificación
    this.fechaActualizacion = Date.now();
    this.version += 1;

    next();
  } catch (error) {
    next(error);
  }
});

// Método para cambiar estado
refundSchema.methods.cambiarEstado = function(nuevoEstado, usuarioId, comentarios = '') {
  const estadoAnterior = this.estado;
  this.estado = nuevoEstado;
  this.actualizadoPor = usuarioId;

  // Registrar en historial
  this.historialEstados.push({
    estado: nuevoEstado,
    usuario: usuarioId,
    comentarios
  });

  // Actualizar información específica según el estado
  const ahora = Date.now();
  switch (nuevoEstado) {
    case 'aprobada':
      this.aprobacion = this.aprobacion || {};
      this.aprobacion.aprobadoPor = usuarioId;
      this.aprobacion.fechaAprobacion = ahora;
      break;
    case 'rechazada':
      this.rechazo = this.rechazo || {};
      this.rechazo.rechazadoPor = usuarioId;
      this.rechazo.fechaRechazo = ahora;
      break;
    case 'procesando':
      this.procesadoPor = usuarioId;
      this.fechaProceso = ahora;
      break;
  }

  return this.save();
};

// Método para aprobar devolución
refundSchema.methods.aprobar = function(usuarioId, importeAprobado = null, observaciones = '', condiciones = []) {
  this.estado = 'aprobada';
  this.aprobacion = {
    aprobadoPor: usuarioId,
    fechaAprobacion: Date.now(),
    importeAprobado: importeAprobado || this.importeDevolucion,
    observaciones,
    condiciones
  };

  this.historialEstados.push({
    estado: 'aprobada',
    usuario: usuarioId,
    comentarios: `Devolución aprobada. ${observaciones}`,
    documentos: []
  });

  return this.save();
};

// Método para rechazar devolución
refundSchema.methods.rechazar = function(usuarioId, motivoRechazo, observaciones = '') {
  this.estado = 'rechazada';
  this.rechazo = {
    rechazadoPor: usuarioId,
    fechaRechazo: Date.now(),
    motivoRechazo,
    observaciones
  };

  this.historialEstados.push({
    estado: 'rechazada',
    usuario: usuarioId,
    comentarios: `Devolución rechazada: ${motivoRechazo}`,
    documentos: []
  });

  return this.save();
};

// Método para completar devolución
refundSchema.methods.completar = function(usuarioId, detallesProcesamiento = {}) {
  this.estado = 'completada';
  this.fechaCompletado = Date.now();
  this.procesadoPor = usuarioId;

  if (detallesProcesamiento) {
    this.procesamiento = { 
      ...this.procesamiento, 
      ...detallesProcesamiento,
      fechaEjecucion: Date.now()
    };
  }

  this.historialEstados.push({
    estado: 'completada',
    usuario: usuarioId,
    comentarios: 'Devolución completada exitosamente',
    documentos: []
  });

  return this.save();
};

// Método para agregar comunicación
refundSchema.methods.agregarComunicacion = function(comunicacion, usuarioId) {
  comunicacion.realizadoPor = usuarioId;
  this.comunicaciones.push(comunicacion);
  return this.save();
};

// Método para asignar a usuario
refundSchema.methods.asignar = function(usuarioId, asignadoPor) {
  this.seguimiento = this.seguimiento || {};
  this.seguimiento.asignadoA = usuarioId;
  this.seguimiento.fechaAsignacion = Date.now();
  this.actualizadoPor = asignadoPor;

  this.historialEstados.push({
    estado: 'asignada',
    usuario: asignadoPor,
    comentarios: `Devolución asignada a usuario ${usuarioId}`
  });

  return this.save();
};

// Método para obtener resumen
refundSchema.methods.toResumen = function() {
  return {
    id: this._id,
    numeroTransaccion: this.numeroTransaccion,
    pagoOriginalId: this.pagoOriginalId,
    pacienteNombre: this.pacienteNombre,
    conceptoOriginal: this.conceptoOriginal,
    importeOriginal: this.importeOriginal,
    importeDevolucion: this.importeDevolucion,
    motivo: this.motivo,
    categoria: this.categoria,
    fechaSolicitud: this.fechaSolicitud,
    fechaProceso: this.fechaProceso,
    estado: this.estado,
    aprobadoPor: this.aprobacion?.aprobadoPor ? 'Sí' : 'No',
    diasProcesamiento: this.diasProcesamiento,
    porcentajeDevuelto: this.porcentajeDevuelto
  };
};

// Método estático para buscar devoluciones
refundSchema.statics.buscarDevoluciones = function(filtros = {}) {
  const query = {};

  if (filtros.paciente) {
    query.$or = [
      { pacienteNombre: { $regex: filtros.paciente, $options: 'i' } },
      { conceptoOriginal: { $regex: filtros.paciente, $options: 'i' } },
      { numeroTransaccion: { $regex: filtros.paciente, $options: 'i' } },
      { motivo: { $regex: filtros.paciente, $options: 'i' } }
    ];
  }

  if (filtros.estado) query.estado = filtros.estado;
  if (filtros.categoria) query.categoria = filtros.categoria;
  if (filtros.sede) query.sede = filtros.sede;
  if (filtros.solicitadoPor) query.solicitadoPor = filtros.solicitadoPor;

  if (filtros.fechaDesde || filtros.fechaHasta) {
    query.fechaSolicitud = {};
    if (filtros.fechaDesde) query.fechaSolicitud.$gte = new Date(filtros.fechaDesde);
    if (filtros.fechaHasta) query.fechaSolicitud.$lte = new Date(filtros.fechaHasta);
  }

  if (filtros.importeMin || filtros.importeMax) {
    query.importeDevolucion = {};
    if (filtros.importeMin) query.importeDevolucion.$gte = filtros.importeMin;
    if (filtros.importeMax) query.importeDevolucion.$lte = filtros.importeMax;
  }

  if (filtros.pendientes) {
    query.estado = { $in: ['solicitada', 'revisando', 'aprobada', 'procesando'] };
  }

  return this.find(query)
    .populate('paciente', 'nombre apellidos email telefono')
    .populate('pagoOriginal', 'numeroTransaccion metodoPago')
    .populate('solicitadoPor', 'nombre apellidos')
    .populate('aprobacion.aprobadoPor', 'nombre apellidos')
    .populate('rechazo.rechazadoPor', 'nombre apellidos')
    .sort({ fechaSolicitud: -1 });
};

// Método estático para obtener estadísticas
refundSchema.statics.obtenerEstadisticas = function(filtros = {}) {
  const matchStage = {};
  
  if (filtros.sede) matchStage.sede = filtros.sede;
  if (filtros.fechaDesde || filtros.fechaHasta) {
    matchStage.fechaSolicitud = {};
    if (filtros.fechaDesde) matchStage.fechaSolicitud.$gte = new Date(filtros.fechaDesde);
    if (filtros.fechaHasta) matchStage.fechaSolicitud.$lte = new Date(filtros.fechaHasta);
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalDevoluciones: { $sum: 1 },
        importeTotalDevuelto: { $sum: '$importeDevolucion' },
        
        // Por estado
        solicitadas: { $sum: { $cond: [{ $eq: ['$estado', 'solicitada'] }, 1, 0] } },
        aprobadas: { $sum: { $cond: [{ $eq: ['$estado', 'aprobada'] }, 1, 0] } },
        completadas: { $sum: { $cond: [{ $eq: ['$estado', 'completada'] }, 1, 0] } },
        rechazadas: { $sum: { $cond: [{ $eq: ['$estado', 'rechazada'] }, 1, 0] } },
        procesando: { $sum: { $cond: [{ $eq: ['$estado', 'procesando'] }, 1, 0] } },
        
        // Importes por estado
        importeCompletadas: { $sum: { $cond: [{ $eq: ['$estado', 'completada'] }, '$importeDevolucion', 0] } },
        importeProcesando: { $sum: { $cond: [{ $eq: ['$estado', 'procesando'] }, '$importeDevolucion', 0] } },
        importePendientes: { $sum: { $cond: [{ $eq: ['$estado', 'solicitada'] }, '$importeDevolucion', 0] } },
        
        // Por categoría
        cancelacionTratamiento: { $sum: { $cond: [{ $eq: ['$categoria', 'cancelacion_tratamiento'] }, '$importeDevolucion', 0] } },
        errorFacturacion: { $sum: { $cond: [{ $eq: ['$categoria', 'error_facturacion'] }, '$importeDevolucion', 0] } },
        insatisfaccion: { $sum: { $cond: [{ $eq: ['$categoria', 'insatisfaccion_servicio'] }, '$importeDevolucion', 0] } },
        
        // Promedios
        importePromedio: { $avg: '$importeDevolucion' },
        tiempoProcesamiento: { $avg: '$diasProcesamiento' },
        
        // Tasas
        tasaAprobacion: {
          $multiply: [
            { $divide: [
              { $sum: { $cond: [{ $in: ['$estado', ['aprobada', 'completada']] }, 1, 0] } },
              { $sum: 1 }
            ]},
            100
          ]
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Refund', refundSchema);