const mongoose = require('mongoose');

const toothSurfaceSchema = new mongoose.Schema({
  oclusal: { type: Boolean, default: false },
  mesial: { type: Boolean, default: false },
  distal: { type: Boolean, default: false },
  vestibular: { type: Boolean, default: false },
  lingual: { type: Boolean, default: false }
}, { _id: false });

const toothStatusSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    min: 11,
    max: 48
  },
  status: {
    type: String,
    enum: ['sano', 'caries', 'obturado', 'corona', 'ausente', 'implante'],
    default: 'sano'
  },
  surfaces: toothSurfaceSchema,
  notas: {
    type: String,
    maxlength: [200, 'Las notas del diente no pueden exceder 200 caracteres']
  }
}, { _id: false });

const evaluationSchema = new mongoose.Schema({
  // Referencia al paciente
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'La referencia al paciente es obligatoria']
  },
  pacienteNombre: {
    type: String,
    required: [true, 'El nombre del paciente es obligatorio']
  },

  // Información básica de la evaluación
  fecha: {
    type: Date,
    required: [true, 'La fecha de evaluación es obligatoria'],
    default: Date.now
  },
  tipo: {
    type: String,
    enum: ['odontograma', 'periodontograma', 'evolutivo', 'plantilla'],
    required: [true, 'El tipo de evaluación es obligatorio']
  },
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },

  // Hallazgos clínicos
  hallazgos: [{
    type: String,
    trim: true,
    maxlength: [500, 'Cada hallazgo no puede exceder 500 caracteres']
  }],

  // Tratamientos propuestos o realizados
  tratamientos: [{
    type: String,
    trim: true,
    maxlength: [500, 'Cada tratamiento no puede exceder 500 caracteres']
  }],

  // Próxima cita programada
  proximaCita: {
    type: Date
  },

  // Odontograma específico para evaluaciones de tipo odontograma
  odontograma: {
    type: [toothStatusSchema],
    validate: {
      validator: function(teeth) {
        if (this.tipo === 'odontograma' && (!teeth || teeth.length === 0)) {
          return false;
        }
        return true;
      },
      message: 'El odontograma es obligatorio para evaluaciones de tipo odontograma'
    }
  },

  // Información específica para periodontograma
  periodontograma: {
    // Sondaje periodontal por sectores
    sectores: [{
      sector: {
        type: String,
        enum: ['superior_derecho', 'superior_anterior', 'superior_izquierdo', 
               'inferior_izquierdo', 'inferior_anterior', 'inferior_derecho']
      },
      profundidadPromedio: {
        type: Number,
        min: 0,
        max: 15
      },
      sangradoSondaje: {
        type: Boolean,
        default: false
      },
      supuracion: {
        type: Boolean,
        default: false
      },
      movilidad: {
        type: String,
        enum: ['ninguna', 'grado_1', 'grado_2', 'grado_3'],
        default: 'ninguna'
      }
    }],
    
    // Índices periodontales
    indiceGingival: {
      type: Number,
      min: 0,
      max: 3
    },
    indicePlaca: {
      type: Number,
      min: 0,
      max: 3
    },
    indiceSangrado: {
      type: Number,
      min: 0,
      max: 100
    }
  },

  // Información específica para evaluación evolutiva
  evolucion: {
    motivoConsulta: {
      type: String,
      maxlength: [500, 'El motivo de consulta no puede exceder 500 caracteres']
    },
    sintomasActuales: [{
      type: String,
      maxlength: [200, 'Cada síntoma no puede exceder 200 caracteres']
    }],
    evolucionTratamiento: {
      type: String,
      maxlength: [1000, 'La evolución del tratamiento no puede exceder 1000 caracteres']
    },
    complicaciones: [{
      tipo: String,
      descripcion: String,
      fecha: {
        type: Date,
        default: Date.now
      },
      resolucion: String
    }],
    recomendaciones: [{
      type: String,
      maxlength: [300, 'Cada recomendación no puede exceder 300 caracteres']
    }]
  },

  // Plantillas predefinidas
  plantilla: {
    nombrePlantilla: String,
    campos: [{
      nombre: String,
      tipo: {
        type: String,
        enum: ['texto', 'numero', 'fecha', 'seleccion', 'checkbox']
      },
      valor: mongoose.Schema.Types.Mixed,
      obligatorio: {
        type: Boolean,
        default: false
      }
    }]
  },

  // Imágenes y documentos adjuntos
  adjuntos: [{
    tipo: {
      type: String,
      enum: ['imagen', 'radiografia', 'documento', 'video'],
      required: true
    },
    nombre: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    descripcion: String,
    fechaSubida: {
      type: Date,
      default: Date.now
    },
    tamaño: Number, // en bytes
    mimetype: String
  }],

  // Estado de la evaluación
  estado: {
    type: String,
    enum: ['borrador', 'completada', 'revisada', 'archivada'],
    default: 'borrador'
  },

  // Prioridad clínica
  prioridad: {
    type: String,
    enum: ['baja', 'media', 'alta', 'urgente'],
    default: 'media'
  },

  // Profesional que realizó la evaluación
  profesional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El profesional que realiza la evaluación es obligatorio']
  },

  // Profesional que revisó la evaluación (si aplica)
  revisadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fechaRevision: Date,

  // Sede donde se realizó la evaluación
  sede: {
    type: String,
    enum: ['centro', 'norte', 'sur', 'este', 'oeste'],
    required: [true, 'La sede es obligatoria']
  },

  // Duración de la consulta (en minutos)
  duracionConsulta: {
    type: Number,
    min: 5,
    max: 300
  },

  // Observaciones adicionales
  observaciones: {
    type: String,
    maxlength: [2000, 'Las observaciones no pueden exceder 2000 caracteres']
  },

  // Información de facturación relacionada
  facturacion: {
    procedimientosCodigos: [String], // Códigos de procedimientos para facturación
    costeEstimado: {
      type: Number,
      min: 0
    },
    cubiertoPorSeguro: {
      type: Boolean,
      default: false
    }
  },

  // Tags para búsqueda y categorización
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],

  // Control de versiones
  version: {
    type: Number,
    default: 1
  },
  evaluacionAnterior: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evaluation'
  },

  // Historial de cambios
  historialCambios: [{
    fecha: {
      type: Date,
      default: Date.now
    },
    cambio: String,
    valorAnterior: String,
    valorNuevo: String,
    realizadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
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
evaluationSchema.index({ pacienteId: 1, fecha: -1 });
evaluationSchema.index({ tipo: 1, estado: 1 });
evaluationSchema.index({ profesional: 1, fecha: -1 });
evaluationSchema.index({ sede: 1, fecha: -1 });
evaluationSchema.index({ proximaCita: 1 });
evaluationSchema.index({ estado: 1, prioridad: 1 });
evaluationSchema.index({ tags: 1 });

// Virtual para obtener el tiempo transcurrido desde la evaluación
evaluationSchema.virtual('tiempoTranscurrido').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.fecha);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
  if (diffDays < 365) return `Hace ${Math.ceil(diffDays / 30)} meses`;
  return `Hace ${Math.ceil(diffDays / 365)} años`;
});

// Virtual para verificar si está pendiente de revisión
evaluationSchema.virtual('pendienteRevision').get(function() {
  return this.estado === 'completada' && !this.revisadoPor;
});

// Virtual para contar dientes afectados en odontograma
evaluationSchema.virtual('dientesAfectados').get(function() {
  if (!this.odontograma || this.odontograma.length === 0) return 0;
  return this.odontograma.filter(tooth => tooth.status !== 'sano').length;
});

// Middleware pre-save
evaluationSchema.pre('save', async function(next) {
  try {
    // Actualizar fecha de modificación
    this.fechaActualizacion = Date.now();

    // Si es una actualización, incrementar versión
    if (!this.isNew && this.isModified()) {
      this.version += 1;
    }

    // Actualizar nombre del paciente si cambió la referencia
    if (this.isModified('pacienteId') && this.pacienteId) {
      const Patient = mongoose.model('Patient');
      const paciente = await Patient.findById(this.pacienteId).select('nombre apellidos');
      if (paciente) {
        this.pacienteNombre = `${paciente.nombre} ${paciente.apellidos}`;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Método para obtener resumen de la evaluación
evaluationSchema.methods.toResumen = function() {
  return {
    id: this._id,
    pacienteId: this.pacienteId,
    pacienteNombre: this.pacienteNombre,
    fecha: this.fecha,
    tipo: this.tipo,
    titulo: this.titulo,
    estado: this.estado,
    prioridad: this.prioridad,
    proximaCita: this.proximaCita,
    tiempoTranscurrido: this.tiempoTranscurrido,
    profesional: this.profesional,
    dientesAfectados: this.dientesAfectados,
    cantidadHallazgos: this.hallazgos ? this.hallazgos.length : 0,
    cantidadTratamientos: this.tratamientos ? this.tratamientos.length : 0
  };
};

// Método para marcar como completada
evaluationSchema.methods.completar = function(usuarioId) {
  this.estado = 'completada';
  this.actualizadoPor = usuarioId;
  this.historialCambios.push({
    cambio: 'Evaluación marcada como completada',
    valorAnterior: 'borrador',
    valorNuevo: 'completada',
    realizadoPor: usuarioId
  });
  
  return this.save();
};

// Método para revisar evaluación
evaluationSchema.methods.revisar = function(usuarioId, observaciones = null) {
  this.estado = 'revisada';
  this.revisadoPor = usuarioId;
  this.fechaRevision = Date.now();
  this.actualizadoPor = usuarioId;
  
  let cambio = 'Evaluación revisada';
  if (observaciones) {
    cambio += ` - Observaciones: ${observaciones}`;
    this.observaciones = this.observaciones ? 
      `${this.observaciones}\n\nRevisión: ${observaciones}` : 
      `Revisión: ${observaciones}`;
  }
  
  this.historialCambios.push({
    cambio,
    valorAnterior: 'completada',
    valorNuevo: 'revisada',
    realizadoPor: usuarioId
  });
  
  return this.save();
};

// Método estático para buscar evaluaciones
evaluationSchema.statics.buscarEvaluaciones = function(filtros = {}) {
  const query = {};
  
  if (filtros.paciente) {
    query.$or = [
      { pacienteNombre: { $regex: filtros.paciente, $options: 'i' } },
      { pacienteId: filtros.paciente }
    ];
  }
  
  if (filtros.tipo) query.tipo = filtros.tipo;
  if (filtros.estado) query.estado = filtros.estado;
  if (filtros.sede) query.sede = filtros.sede;
  if (filtros.profesional) query.profesional = filtros.profesional;
  if (filtros.prioridad) query.prioridad = filtros.prioridad;
  
  if (filtros.fechaDesde || filtros.fechaHasta) {
    query.fecha = {};
    if (filtros.fechaDesde) query.fecha.$gte = new Date(filtros.fechaDesde);
    if (filtros.fechaHasta) query.fecha.$lte = new Date(filtros.fechaHasta);
  }
  
  if (filtros.titulo) {
    query.titulo = { $regex: filtros.titulo, $options: 'i' };
  }
  
  if (filtros.tags && filtros.tags.length > 0) {
    query.tags = { $in: filtros.tags };
  }
  
  return this.find(query)
    .populate('pacienteId', 'nombre apellidos numeroHistoriaClinica')
    .populate('profesional', 'nombre apellidos especialidad')
    .populate('revisadoPor', 'nombre apellidos')
    .sort({ fecha: -1 });
};

// Método estático para obtener estadísticas
evaluationSchema.statics.obtenerEstadisticas = function(filtros = {}) {
  const matchStage = {};
  
  if (filtros.sede) matchStage.sede = filtros.sede;
  if (filtros.fechaDesde || filtros.fechaHasta) {
    matchStage.fecha = {};
    if (filtros.fechaDesde) matchStage.fecha.$gte = new Date(filtros.fechaDesde);
    if (filtros.fechaHasta) matchStage.fecha.$lte = new Date(filtros.fechaHasta);
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalEvaluaciones: { $sum: 1 },
        odontogramas: { 
          $sum: { $cond: [{ $eq: ['$tipo', 'odontograma'] }, 1, 0] }
        },
        periodontogramas: { 
          $sum: { $cond: [{ $eq: ['$tipo', 'periodontograma'] }, 1, 0] }
        },
        evolutivos: { 
          $sum: { $cond: [{ $eq: ['$tipo', 'evolutivo'] }, 1, 0] }
        },
        plantillas: { 
          $sum: { $cond: [{ $eq: ['$tipo', 'plantilla'] }, 1, 0] }
        },
        pendientesRevision: {
          $sum: { 
            $cond: [
              { $and: [
                { $eq: ['$estado', 'completada'] },
                { $eq: ['$revisadoPor', null] }
              ]}, 
              1, 
              0
            ]
          }
        },
        evaluacionesUrgentes: {
          $sum: { $cond: [{ $eq: ['$prioridad', 'urgente'] }, 1, 0] }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Evaluation', evaluationSchema);