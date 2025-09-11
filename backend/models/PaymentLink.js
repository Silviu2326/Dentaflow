const mongoose = require('mongoose');
const crypto = require('crypto');

const paymentLinkSchema = new mongoose.Schema({
  // Identificador único del link
  linkId: {
    type: String,
    unique: true,
    required: true
  },
  
  // URL completa del link de pago
  url: {
    type: String,
    required: true,
    unique: true
  },

  // Token de seguridad para acceso
  token: {
    type: String,
    required: true,
    unique: true
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
  pacienteEmail: {
    type: String,
    required: true
  },
  pacienteTelefono: {
    type: String,
    trim: true
  },

  // Concepto del pago
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

  // Importe y moneda
  importe: {
    type: Number,
    required: [true, 'El importe es obligatorio'],
    min: [0.01, 'El importe debe ser mayor a 0']
  },
  moneda: {
    type: String,
    default: 'EUR',
    enum: ['EUR', 'USD', 'GBP']
  },

  // Estado del link
  estado: {
    type: String,
    enum: ['activo', 'pagado', 'vencido', 'cancelado', 'suspendido'],
    default: 'activo'
  },

  // Fechas importantes
  fechaCreacion: {
    type: Date,
    default: Date.now,
    required: true
  },
  fechaVencimiento: {
    type: Date,
    required: [true, 'La fecha de vencimiento es obligatoria']
  },
  fechaPago: Date,
  fechaCancelacion: Date,

  // Configuración del link
  configuracion: {
    permitirPagoParcial: {
      type: Boolean,
      default: false
    },
    importeMinimo: {
      type: Number,
      min: 0.01
    },
    limiteTentativas: {
      type: Number,
      default: 3,
      min: 1,
      max: 10
    },
    requiereConfirmacion: {
      type: Boolean,
      default: true
    },
    mostrarDescripcion: {
      type: Boolean,
      default: true
    }
  },

  // Personalización visual
  personalizacion: {
    colorPrimario: {
      type: String,
      default: '#3B82F6'
    },
    logo: String,
    nombreClinica: String,
    mensaje: {
      type: String,
      maxlength: [500, 'El mensaje no puede exceder 500 caracteres']
    },
    idioma: {
      type: String,
      enum: ['es', 'ca', 'en'],
      default: 'es'
    }
  },

  // Estadísticas de uso
  estadisticas: {
    intentosPago: {
      type: Number,
      default: 0
    },
    visualizaciones: {
      type: Number,
      default: 0
    },
    ultimoIntento: Date,
    ultimaVisualizacion: Date,
    dispositivosAcceso: [{
      tipo: String,
      navegador: String,
      ip: String,
      fecha: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // Información del pago realizado
  pagoRealizado: {
    pagoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    numeroTransaccion: String,
    fechaPago: Date,
    metodoPago: String,
    pasarelaPago: String,
    referenciaExterna: String,
    importePagado: Number,
    comision: Number
  },

  // Recordatorios enviados
  recordatorios: [{
    tipo: {
      type: String,
      enum: ['email', 'sms', 'whatsapp'],
      required: true
    },
    fechaEnvio: {
      type: Date,
      default: Date.now
    },
    destinatario: String,
    plantilla: String,
    estado: {
      type: String,
      enum: ['enviado', 'entregado', 'leido', 'fallido'],
      default: 'enviado'
    },
    response: mongoose.Schema.Types.Mixed
  }],

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

  // Configuración de pasarela de pago
  pasarelaConfig: {
    pasarela: {
      type: String,
      enum: ['stripe', 'redsys', 'paypal', 'bizum'],
      default: 'stripe'
    },
    configuracion: mongoose.Schema.Types.Mixed,
    webhookUrl: String,
    returnUrl: String,
    cancelUrl: String
  },

  // Condiciones y términos
  condiciones: {
    aceptarTerminos: {
      type: Boolean,
      default: true
    },
    textoTerminos: String,
    politicaPrivacidad: String,
    condicionesCancelacion: String
  },

  // Información de seguridad
  seguridad: {
    requiereAutenticacion: {
      type: Boolean,
      default: false
    },
    codigoVerificacion: String,
    intentosFallidos: {
      type: Number,
      default: 0
    },
    bloqueado: {
      type: Boolean,
      default: false
    },
    fechaBloqueo: Date,
    ipsBloqueadas: [String]
  },

  // Notificaciones automáticas
  notificaciones: {
    notificarCreacion: {
      type: Boolean,
      default: true
    },
    notificarPago: {
      type: Boolean,
      default: true
    },
    notificarVencimiento: {
      type: Boolean,
      default: true
    },
    recordatorioAutomatico: {
      activo: {
        type: Boolean,
        default: true
      },
      diasAntes: {
        type: Number,
        default: 3
      },
      frecuencia: {
        type: Number,
        default: 24 // horas
      }
    }
  },

  // Sede donde se creó
  sede: {
    type: String,
    enum: ['centro', 'norte', 'sur', 'este', 'oeste'],
    required: [true, 'La sede es obligatoria']
  },

  // Profesional que creó el link
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

  // Notas internas
  notasInternas: {
    type: String,
    maxlength: [1000, 'Las notas internas no pueden exceder 1000 caracteres']
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
paymentLinkSchema.index({ linkId: 1 });
paymentLinkSchema.index({ token: 1 });
paymentLinkSchema.index({ paciente: 1, estado: 1 });
paymentLinkSchema.index({ estado: 1, fechaVencimiento: 1 });
paymentLinkSchema.index({ profesional: 1, fechaCreacion: -1 });
paymentLinkSchema.index({ sede: 1, fechaCreacion: -1 });
paymentLinkSchema.index({ fechaVencimiento: 1 });

// Virtual para verificar si está vencido
paymentLinkSchema.virtual('estaVencido').get(function() {
  return this.fechaVencimiento < new Date() && this.estado === 'activo';
});

// Virtual para días restantes
paymentLinkSchema.virtual('diasRestantes').get(function() {
  if (this.estado !== 'activo') return null;
  
  const hoy = new Date();
  const vencimiento = new Date(this.fechaVencimiento);
  const diffTime = vencimiento - hoy;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
});

// Virtual para URL pública
paymentLinkSchema.virtual('urlPublica').get(function() {
  const baseUrl = process.env.PAYMENT_BASE_URL || 'https://pay.clinicapp.com';
  return `${baseUrl}/link/${this.token}`;
});

// Middleware pre-save
paymentLinkSchema.pre('save', async function(next) {
  try {
    // Generar linkId si no existe
    if (!this.linkId) {
      const count = await mongoose.model('PaymentLink').countDocuments();
      this.linkId = `LNK-${String(count + 1).padStart(8, '0')}`;
    }

    // Generar token si no existe
    if (!this.token) {
      this.token = crypto.randomBytes(32).toString('hex');
    }

    // Generar URL si no existe
    if (!this.url) {
      const baseUrl = process.env.PAYMENT_BASE_URL || 'https://pay.clinicapp.com';
      this.url = `${baseUrl}/link/${this.token}`;
    }

    // Actualizar información del paciente si cambió la referencia
    if (this.isModified('paciente') && this.paciente) {
      const Patient = mongoose.model('Patient');
      const paciente = await Patient.findById(this.paciente).select('nombre apellidos email telefono');
      if (paciente) {
        this.pacienteNombre = `${paciente.nombre} ${paciente.apellidos}`;
        this.pacienteEmail = paciente.email;
        this.pacienteTelefono = paciente.telefono;
      }
    }

    // Verificar vencimiento automático
    if (this.estaVencido && this.estado === 'activo') {
      this.estado = 'vencido';
    }

    // Actualizar fecha de modificación
    this.fechaActualizacion = Date.now();

    next();
  } catch (error) {
    next(error);
  }
});

// Método para registrar visualización
paymentLinkSchema.methods.registrarVisualizacion = function(datosDispositivo = {}) {
  this.estadisticas.visualizaciones += 1;
  this.estadisticas.ultimaVisualizacion = Date.now();
  
  if (datosDispositivo.tipo || datosDispositivo.navegador || datosDispositivo.ip) {
    this.estadisticas.dispositivosAcceso.push({
      tipo: datosDispositivo.tipo,
      navegador: datosDispositivo.navegador,
      ip: datosDispositivo.ip
    });
  }

  return this.save();
};

// Método para registrar intento de pago
paymentLinkSchema.methods.registrarIntentoPago = function(detalles = {}) {
  this.estadisticas.intentosPago += 1;
  this.estadisticas.ultimoIntento = Date.now();

  // Si excede el límite, bloquear
  if (this.estadisticas.intentosPago >= this.configuracion.limiteTentativas) {
    this.seguridad.bloqueado = true;
    this.seguridad.fechaBloqueo = Date.now();
    this.estado = 'suspendido';
  }

  this.historialEstados.push({
    estado: 'intento_pago',
    motivo: 'Intento de pago registrado',
    detalles
  });

  return this.save();
};

// Método para marcar como pagado
paymentLinkSchema.methods.marcarPagado = function(datosPago, usuarioId) {
  this.estado = 'pagado';
  this.fechaPago = Date.now();
  
  this.pagoRealizado = {
    pagoId: datosPago.pagoId,
    numeroTransaccion: datosPago.numeroTransaccion,
    fechaPago: datosPago.fechaPago || Date.now(),
    metodoPago: datosPago.metodoPago,
    pasarelaPago: datosPago.pasarelaPago,
    referenciaExterna: datosPago.referenciaExterna,
    importePagado: datosPago.importePagado || this.importe,
    comision: datosPago.comision || 0
  };

  this.actualizadoPor = usuarioId;

  this.historialEstados.push({
    estado: 'pagado',
    usuario: usuarioId,
    motivo: 'Link de pago completado exitosamente',
    detalles: datosPago
  });

  return this.save();
};

// Método para cancelar
paymentLinkSchema.methods.cancelar = function(usuarioId, motivo = '') {
  this.estado = 'cancelado';
  this.fechaCancelacion = Date.now();
  this.actualizadoPor = usuarioId;

  this.historialEstados.push({
    estado: 'cancelado',
    usuario: usuarioId,
    motivo: motivo || 'Link de pago cancelado',
    detalles: { fechaCancelacion: this.fechaCancelacion }
  });

  return this.save();
};

// Método para enviar recordatorio
paymentLinkSchema.methods.enviarRecordatorio = async function(tipo, destinatario, plantilla = null) {
  const recordatorio = {
    tipo,
    destinatario,
    plantilla,
    estado: 'enviado'
  };

  try {
    // Aquí se integraría con el servicio de notificaciones
    // Por ahora solo registramos el recordatorio
    this.recordatorios.push(recordatorio);
    await this.save();
    
    return { success: true, recordatorio };
  } catch (error) {
    recordatorio.estado = 'fallido';
    recordatorio.response = { error: error.message };
    this.recordatorios.push(recordatorio);
    await this.save();
    
    return { success: false, error: error.message };
  }
};

// Método para renovar link vencido
paymentLinkSchema.methods.renovar = function(nuevaFechaVencimiento, usuarioId) {
  this.estado = 'activo';
  this.fechaVencimiento = nuevaFechaVencimiento;
  this.estadisticas.intentosPago = 0;
  this.seguridad.bloqueado = false;
  this.seguridad.intentosFallidos = 0;
  this.actualizadoPor = usuarioId;

  this.historialEstados.push({
    estado: 'renovado',
    usuario: usuarioId,
    motivo: 'Link renovado con nueva fecha de vencimiento',
    detalles: { 
      nuevaFechaVencimiento,
      fechaRenovacion: Date.now() 
    }
  });

  return this.save();
};

// Método para obtener resumen
paymentLinkSchema.methods.toResumen = function() {
  return {
    id: this._id,
    linkId: this.linkId,
    pacienteId: this.paciente,
    pacienteNombre: this.pacienteNombre,
    concepto: this.concepto,
    importe: this.importe,
    fechaCreacion: this.fechaCreacion,
    fechaVencimiento: this.fechaVencimiento,
    url: this.url,
    estado: this.estado,
    intentosPago: this.estadisticas.intentosPago,
    ultimoIntento: this.estadisticas.ultimoIntento,
    diasRestantes: this.diasRestantes,
    estaVencido: this.estaVencido
  };
};

// Método estático para buscar links
paymentLinkSchema.statics.buscarLinks = function(filtros = {}) {
  const query = {};

  if (filtros.paciente) {
    query.$or = [
      { pacienteNombre: { $regex: filtros.paciente, $options: 'i' } },
      { concepto: { $regex: filtros.paciente, $options: 'i' } },
      { linkId: { $regex: filtros.paciente, $options: 'i' } }
    ];
  }

  if (filtros.estado) query.estado = filtros.estado;
  if (filtros.sede) query.sede = filtros.sede;
  if (filtros.profesional) query.profesional = filtros.profesional;

  if (filtros.fechaDesde || filtros.fechaHasta) {
    query.fechaCreacion = {};
    if (filtros.fechaDesde) query.fechaCreacion.$gte = new Date(filtros.fechaDesde);
    if (filtros.fechaHasta) query.fechaCreacion.$lte = new Date(filtros.fechaHasta);
  }

  if (filtros.vencidos) {
    query.fechaVencimiento = { $lt: new Date() };
    query.estado = 'activo';
  }

  if (filtros.proximosVencer) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + (filtros.diasAntes || 7));
    query.fechaVencimiento = { 
      $gte: new Date(), 
      $lte: fechaLimite 
    };
    query.estado = 'activo';
  }

  return this.find(query)
    .populate('paciente', 'nombre apellidos email telefono')
    .populate('profesional', 'nombre apellidos')
    .populate('presupuesto', 'numero')
    .sort({ fechaCreacion: -1 });
};

// Método estático para obtener estadísticas
paymentLinkSchema.statics.obtenerEstadisticas = function(filtros = {}) {
  const matchStage = {};
  
  if (filtros.sede) matchStage.sede = filtros.sede;
  if (filtros.fechaDesde || filtros.fechaHasta) {
    matchStage.fechaCreacion = {};
    if (filtros.fechaDesde) matchStage.fechaCreacion.$gte = new Date(filtros.fechaDesde);
    if (filtros.fechaHasta) matchStage.fechaCreacion.$lte = new Date(filtros.fechaHasta);
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalLinks: { $sum: 1 },
        
        // Por estado
        activos: { $sum: { $cond: [{ $eq: ['$estado', 'activo'] }, 1, 0] } },
        pagados: { $sum: { $cond: [{ $eq: ['$estado', 'pagado'] }, 1, 0] } },
        vencidos: { $sum: { $cond: [{ $eq: ['$estado', 'vencido'] }, 1, 0] } },
        cancelados: { $sum: { $cond: [{ $eq: ['$estado', 'cancelado'] }, 1, 0] } },
        
        // Importes
        importeTotal: { $sum: '$importe' },
        importePagado: { 
          $sum: { $cond: [{ $eq: ['$estado', 'pagado'] }, '$importe', 0] } 
        },
        importePendiente: { 
          $sum: { $cond: [{ $eq: ['$estado', 'activo'] }, '$importe', 0] } 
        },
        
        // Estadísticas de uso
        totalVisualizaciones: { $sum: '$estadisticas.visualizaciones' },
        totalIntentos: { $sum: '$estadisticas.intentosPago' },
        
        // Promedios
        importePromedio: { $avg: '$importe' },
        intentosPromedio: { $avg: '$estadisticas.intentosPago' },
        
        // Tasa de conversión
        tasaConversion: {
          $multiply: [
            { $divide: [
              { $sum: { $cond: [{ $eq: ['$estado', 'pagado'] }, 1, 0] } },
              { $sum: 1 }
            ]},
            100
          ]
        }
      }
    }
  ]);
};

module.exports = mongoose.model('PaymentLink', paymentLinkSchema);