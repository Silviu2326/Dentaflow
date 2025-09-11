const mongoose = require('mongoose');

const budgetItemSchema = new mongoose.Schema({
  codigo: {
    type: String,
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción del tratamiento es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  cantidad: {
    type: Number,
    required: [true, 'La cantidad es obligatoria'],
    min: [1, 'La cantidad debe ser mayor a 0'],
    default: 1
  },
  precioUnitario: {
    type: Number,
    required: [true, 'El precio unitario es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  descuento: {
    type: Number,
    default: 0,
    min: [0, 'El descuento no puede ser negativo'],
    max: [100, 'El descuento no puede ser mayor al 100%']
  },
  categoria: {
    type: String,
    enum: ['preventiva', 'restauradora', 'endodoncia', 'periodoncia', 'cirugia', 'ortodoncia', 'protesis', 'estetica', 'implantologia', 'otro'],
    default: 'otro'
  },
  urgente: {
    type: Boolean,
    default: false
  },
  notas: {
    type: String,
    maxlength: [200, 'Las notas no pueden exceder 200 caracteres']
  }
}, { _id: false });

const budgetSchema = new mongoose.Schema({
  // Identificación del presupuesto
  numero: {
    type: String,
    unique: true,
    required: true
  },
  
  // Información del paciente
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'La referencia al paciente es obligatoria']
  },
  pacienteNombre: {
    type: String,
    required: [true, 'El nombre del paciente es obligatorio']
  },
  pacienteTelefono: {
    type: String,
    trim: true
  },
  pacienteEmail: {
    type: String,
    lowercase: true,
    trim: true
  },

  // Estado del presupuesto en el pipeline
  estado: {
    type: String,
    enum: ['pendiente', 'presentado', 'aceptado', 'perdido', 'caducado', 'cancelado'],
    default: 'pendiente',
    required: true
  },

  // Prioridad del presupuesto
  prioridad: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },

  // Información del tratamiento principal
  tratamientoPrincipal: {
    type: String,
    required: [true, 'El tratamiento principal es obligatorio'],
    trim: true,
    maxlength: [200, 'El tratamiento principal no puede exceder 200 caracteres']
  },

  // Detalles del presupuesto
  items: [budgetItemSchema],

  // Información financiera
  subtotal: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  descuentoGlobal: {
    type: Number,
    default: 0,
    min: [0, 'El descuento global no puede ser negativo'],
    max: [100, 'El descuento global no puede ser mayor al 100%']
  },
  impuestos: {
    type: Number,
    default: 21, // IVA por defecto
    min: 0,
    max: 50
  },
  total: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  moneda: {
    type: String,
    default: 'EUR',
    enum: ['EUR', 'USD', 'GBP']
  },

  // Fechas importantes
  fechaCreacion: {
    type: Date,
    default: Date.now,
    required: true
  },
  fechaPresentacion: {
    type: Date
  },
  fechaAceptacion: {
    type: Date
  },
  fechaRechazo: {
    type: Date
  },
  fechaVencimiento: {
    type: Date,
    required: [true, 'La fecha de vencimiento es obligatoria']
  },

  // Información del profesional
  profesional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El profesional responsable es obligatorio']
  },
  profesionalNombre: {
    type: String,
    required: true
  },

  // Sede donde se realizará el tratamiento
  sede: {
    type: String,
    enum: ['centro', 'norte', 'sur', 'este', 'oeste'],
    required: [true, 'La sede es obligatoria']
  },

  // Opciones de pago
  opcionesPago: {
    contado: {
      disponible: {
        type: Boolean,
        default: true
      },
      descuento: {
        type: Number,
        default: 0,
        min: 0,
        max: 50
      }
    },
    financiacion: {
      disponible: {
        type: Boolean,
        default: true
      },
      plazos: [{
        meses: {
          type: Number,
          min: 1,
          max: 60
        },
        interes: {
          type: Number,
          min: 0,
          max: 30
        },
        cuotaMensual: Number
      }],
      entradaMinima: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    seguro: {
      disponible: {
        type: Boolean,
        default: false
      },
      compania: String,
      cobertura: {
        type: Number,
        min: 0,
        max: 100
      },
      copago: Number
    }
  },

  // Validez y condiciones
  validezDias: {
    type: Number,
    default: 30,
    min: 1,
    max: 365
  },
  condiciones: [{
    type: String,
    maxlength: [300, 'Cada condición no puede exceder 300 caracteres']
  }],

  // Seguimiento y comunicación
  comunicaciones: [{
    fecha: {
      type: Date,
      default: Date.now
    },
    tipo: {
      type: String,
      enum: ['llamada', 'email', 'sms', 'whatsapp', 'presencial', 'otro'],
      required: true
    },
    descripcion: {
      type: String,
      required: true,
      maxlength: [500, 'La descripción no puede exceder 500 caracteres']
    },
    realizadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    resultado: {
      type: String,
      enum: ['contactado', 'no_contactado', 'interesado', 'no_interesado', 'solicita_tiempo', 'acepta', 'rechaza'],
      required: true
    },
    proximaAccion: {
      fecha: Date,
      descripcion: String
    }
  }],

  // Motivos de pérdida o rechazo
  motivoRechazo: {
    categoria: {
      type: String,
      enum: ['precio', 'tiempo', 'confianza', 'necesidad', 'competencia', 'otro']
    },
    descripcion: String,
    competidor: String
  },

  // Documentos adjuntos
  adjuntos: [{
    nombre: {
      type: String,
      required: true
    },
    tipo: {
      type: String,
      enum: ['presupuesto_pdf', 'plan_tratamiento', 'radiografia', 'foto', 'documento', 'otro'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    fechaSubida: {
      type: Date,
      default: Date.now
    },
    subidoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Métricas y análisis
  metricas: {
    tiempoEnPendiente: Number, // en horas
    tiempoEnPresentado: Number, // en horas
    tiempoHastaDecision: Number, // en horas
    numeroContactos: {
      type: Number,
      default: 0
    },
    tasaRespuesta: {
      type: Number,
      min: 0,
      max: 100
    }
  },

  // Información de conversión
  conversion: {
    fechaConversion: Date,
    tratamientosAceptados: [String],
    tratamientosRechazados: [String],
    motivosModificacion: String,
    descuentoAplicado: {
      type: Number,
      min: 0,
      max: 100
    }
  },

  // Notas internas
  notasInternas: {
    type: String,
    maxlength: [2000, 'Las notas internas no pueden exceder 2000 caracteres']
  },

  // Tags para búsqueda y categorización
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],

  // Control de cambios en el pipeline
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
      ref: 'User',
      required: true
    },
    motivo: String,
    observaciones: String
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
budgetSchema.index({ numero: 1 });
budgetSchema.index({ pacienteId: 1, estado: 1 });
budgetSchema.index({ estado: 1, fechaCreacion: -1 });
budgetSchema.index({ profesional: 1, estado: 1 });
budgetSchema.index({ sede: 1, estado: 1 });
budgetSchema.index({ fechaVencimiento: 1 });
budgetSchema.index({ prioridad: 1, estado: 1 });
budgetSchema.index({ tags: 1 });

// Virtual para verificar si está vencido
budgetSchema.virtual('estaVencido').get(function() {
  return this.fechaVencimiento < new Date() && this.estado === 'presentado';
});

// Virtual para calcular días restantes
budgetSchema.virtual('diasRestantes').get(function() {
  if (this.estado !== 'presentado') return null;
  
  const hoy = new Date();
  const vencimiento = new Date(this.fechaVencimiento);
  const diffTime = vencimiento - hoy;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
});

// Virtual para calcular tiempo en estado actual
budgetSchema.virtual('tiempoEnEstadoActual').get(function() {
  const ultimoCambio = this.historialEstados[this.historialEstados.length - 1];
  const fechaInicio = ultimoCambio ? ultimoCambio.fecha : this.fechaCreacion;
  const ahora = new Date();
  
  return Math.ceil((ahora - fechaInicio) / (1000 * 60 * 60 * 24)); // en días
});

// Virtual para tasa de conversión por profesional
budgetSchema.virtual('tasaConversion').get(function() {
  // Esta métrica se calculará a nivel agregado en el controlador
  return this.metricas.tasaRespuesta || 0;
});

// Middleware pre-save
budgetSchema.pre('save', async function(next) {
  try {
    // Generar número de presupuesto si no existe
    if (!this.numero) {
      const count = await mongoose.model('Budget').countDocuments();
      const year = new Date().getFullYear();
      this.numero = `PRES-${year}-${String(count + 1).padStart(6, '0')}`;
    }

    // Calcular totales automáticamente
    this.subtotal = this.items.reduce((sum, item) => {
      const subtotalItem = item.cantidad * item.precioUnitario;
      const descuentoItem = subtotalItem * (item.descuento / 100);
      return sum + (subtotalItem - descuentoItem);
    }, 0);

    const descuentoGlobalAmount = this.subtotal * (this.descuentoGlobal / 100);
    const subtotalConDescuento = this.subtotal - descuentoGlobalAmount;
    const impuestosAmount = subtotalConDescuento * (this.impuestos / 100);
    this.total = subtotalConDescuento + impuestosAmount;

    // Actualizar información del paciente si cambió la referencia
    if (this.isModified('pacienteId') && this.pacienteId) {
      const Patient = mongoose.model('Patient');
      const paciente = await Patient.findById(this.pacienteId).select('nombre apellidos telefono email');
      if (paciente) {
        this.pacienteNombre = `${paciente.nombre} ${paciente.apellidos}`;
        this.pacienteTelefono = paciente.telefono;
        this.pacienteEmail = paciente.email;
      }
    }

    // Actualizar información del profesional si cambió la referencia
    if (this.isModified('profesional') && this.profesional) {
      const User = mongoose.model('User');
      const profesional = await User.findById(this.profesional).select('nombre apellidos');
      if (profesional) {
        this.profesionalNombre = `${profesional.nombre} ${profesional.apellidos}`;
      }
    }

    // Establecer fecha de vencimiento si no existe
    if (!this.fechaVencimiento) {
      const fechaVenc = new Date();
      fechaVenc.setDate(fechaVenc.getDate() + this.validezDias);
      this.fechaVencimiento = fechaVenc;
    }

    // Actualizar fecha de modificación
    this.fechaActualizacion = Date.now();

    next();
  } catch (error) {
    next(error);
  }
});

// Método para cambiar estado del presupuesto
budgetSchema.methods.cambiarEstado = function(nuevoEstado, usuarioId, motivo = '', observaciones = '') {
  const estadoAnterior = this.estado;
  this.estado = nuevoEstado;
  this.actualizadoPor = usuarioId;

  // Registrar el cambio en el historial
  this.historialEstados.push({
    estado: nuevoEstado,
    fecha: Date.now(),
    usuario: usuarioId,
    motivo,
    observaciones
  });

  // Actualizar fechas específicas según el estado
  switch (nuevoEstado) {
    case 'presentado':
      if (!this.fechaPresentacion) this.fechaPresentacion = Date.now();
      break;
    case 'aceptado':
      if (!this.fechaAceptacion) this.fechaAceptacion = Date.now();
      break;
    case 'perdido':
    case 'cancelado':
      if (!this.fechaRechazo) this.fechaRechazo = Date.now();
      break;
  }

  // Calcular métricas de tiempo
  this.calcularMetricasTiempo();

  return this.save();
};

// Método para calcular métricas de tiempo
budgetSchema.methods.calcularMetricasTiempo = function() {
  const creacion = this.fechaCreacion;
  const presentacion = this.fechaPresentacion;
  const decision = this.fechaAceptacion || this.fechaRechazo;

  if (presentacion) {
    this.metricas.tiempoEnPendiente = (presentacion - creacion) / (1000 * 60 * 60); // horas
  }

  if (decision && presentacion) {
    this.metricas.tiempoEnPresentado = (decision - presentacion) / (1000 * 60 * 60); // horas
  }

  if (decision) {
    this.metricas.tiempoHastaDecision = (decision - creacion) / (1000 * 60 * 60); // horas
  }
};

// Método para agregar comunicación
budgetSchema.methods.agregarComunicacion = function(comunicacion, usuarioId) {
  comunicacion.realizadoPor = usuarioId;
  this.comunicaciones.push(comunicacion);
  this.metricas.numeroContactos = this.comunicaciones.length;
  this.actualizadoPor = usuarioId;
  
  return this.save();
};

// Método para obtener resumen del presupuesto
budgetSchema.methods.toResumen = function() {
  return {
    id: this._id,
    numero: this.numero,
    pacienteId: this.pacienteId,
    pacienteNombre: this.pacienteNombre,
    tratamientoPrincipal: this.tratamientoPrincipal,
    total: this.total,
    moneda: this.moneda,
    estado: this.estado,
    prioridad: this.prioridad,
    fechaCreacion: this.fechaCreacion,
    fechaVencimiento: this.fechaVencimiento,
    profesional: this.profesional,
    profesionalNombre: this.profesionalNombre,
    diasRestantes: this.diasRestantes,
    estaVencido: this.estaVencido,
    tiempoEnEstadoActual: this.tiempoEnEstadoActual
  };
};

// Método estático para buscar presupuestos
budgetSchema.statics.buscarPresupuestos = function(filtros = {}) {
  const query = {};

  if (filtros.paciente) {
    query.$or = [
      { pacienteNombre: { $regex: filtros.paciente, $options: 'i' } },
      { numero: { $regex: filtros.paciente, $options: 'i' } },
      { pacienteId: filtros.paciente }
    ];
  }

  if (filtros.estado) query.estado = filtros.estado;
  if (filtros.prioridad) query.prioridad = filtros.prioridad;
  if (filtros.sede) query.sede = filtros.sede;
  if (filtros.profesional) query.profesional = filtros.profesional;

  if (filtros.fechaDesde || filtros.fechaHasta) {
    query.fechaCreacion = {};
    if (filtros.fechaDesde) query.fechaCreacion.$gte = new Date(filtros.fechaDesde);
    if (filtros.fechaHasta) query.fechaCreacion.$lte = new Date(filtros.fechaHasta);
  }

  if (filtros.montoMin || filtros.montoMax) {
    query.total = {};
    if (filtros.montoMin) query.total.$gte = filtros.montoMin;
    if (filtros.montoMax) query.total.$lte = filtros.montoMax;
  }

  if (filtros.vencidos) {
    query.fechaVencimiento = { $lt: new Date() };
    query.estado = 'presentado';
  }

  if (filtros.tags && filtros.tags.length > 0) {
    query.tags = { $in: filtros.tags };
  }

  return this.find(query)
    .populate('pacienteId', 'nombre apellidos numeroHistoriaClinica telefono email')
    .populate('profesional', 'nombre apellidos especialidad')
    .populate('creadoPor', 'nombre apellidos')
    .sort({ fechaCreacion: -1 });
};

// Método estático para obtener estadísticas del pipeline
budgetSchema.statics.obtenerEstadisticasPipeline = function(filtros = {}) {
  const matchStage = {};
  
  if (filtros.sede) matchStage.sede = filtros.sede;
  if (filtros.profesional) matchStage.profesional = filtros.profesional;
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
        totalPresupuestos: { $sum: 1 },
        pendientes: { $sum: { $cond: [{ $eq: ['$estado', 'pendiente'] }, 1, 0] } },
        presentados: { $sum: { $cond: [{ $eq: ['$estado', 'presentado'] }, 1, 0] } },
        aceptados: { $sum: { $cond: [{ $eq: ['$estado', 'aceptado'] }, 1, 0] } },
        perdidos: { $sum: { $cond: [{ $eq: ['$estado', 'perdido'] }, 1, 0] } },
        valorTotalPipeline: { $sum: '$total' },
        valorAceptados: { 
          $sum: { $cond: [{ $eq: ['$estado', 'aceptado'] }, '$total', 0] } 
        },
        tiempoPromedioDecision: { $avg: '$metricas.tiempoHastaDecision' },
        presupuestosVencidos: {
          $sum: {
            $cond: [
              { 
                $and: [
                  { $eq: ['$estado', 'presentado'] },
                  { $lt: ['$fechaVencimiento', new Date()] }
                ]
              }, 
              1, 
              0
            ]
          }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Budget', budgetSchema);