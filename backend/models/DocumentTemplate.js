const mongoose = require('mongoose');

const variableSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  tipo: {
    type: String,
    enum: ['texto', 'fecha', 'numero', 'booleano', 'seleccion', 'paciente', 'profesional'],
    required: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  opciones: [String], // Para campos de selección
  requerido: {
    type: Boolean,
    default: false
  },
  valorDefecto: mongoose.Schema.Types.Mixed
}, { _id: false });

const versionSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true
  },
  contenido: {
    type: String,
    required: true
  },
  cambios: {
    type: String,
    maxlength: [1000, 'Los cambios no pueden exceder 1000 caracteres']
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activa: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const documentTemplateSchema = new mongoose.Schema({
  // Información básica
  nombre: {
    type: String,
    required: [true, 'El nombre de la plantilla es obligatorio'],
    trim: true,
    maxlength: [200, 'El nombre no puede exceder 200 caracteres']
  },
  
  descripcion: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },

  // Tipo de documento
  tipo: {
    type: String,
    enum: ['consentimiento', 'contrato', 'informacion', 'receta', 'certificado', 'informe', 'otro'],
    required: [true, 'El tipo de documento es obligatorio']
  },

  // Categoría médica
  categoria: {
    type: String,
    enum: ['general', 'endodoncia', 'implantologia', 'ortodoncia', 'cirugia', 'periodoncia', 'estetica', 'pediatria', 'otro'],
    required: [true, 'La categoría es obligatoria']
  },

  // Estado de la plantilla
  estado: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'archived'],
    default: 'draft'
  },

  // Control de versiones
  versiones: [versionSchema],
  versionActual: {
    type: String,
    default: '1.0'
  },

  // Variables dinámicas en la plantilla
  variables: [variableSchema],

  // Configuración de firma
  requiereFirma: {
    paciente: {
      type: Boolean,
      default: true
    },
    profesional: {
      type: Boolean,
      default: true
    },
    testigo: {
      type: Boolean,
      default: false
    }
  },

  // Configuración legal
  configLegal: {
    periodoValidez: {
      type: Number, // días
      default: 365
    },
    requiereRenovacion: {
      type: Boolean,
      default: false
    },
    baseJuridica: {
      type: String,
      maxlength: [500, 'La base jurídica no puede exceder 500 caracteres']
    }
  },

  // Metadatos de uso
  estadisticas: {
    vecesUsado: {
      type: Number,
      default: 0
    },
    ultimoUso: Date,
    descargas: {
      type: Number,
      default: 0
    }
  },

  // Configuración de acceso
  acceso: {
    publico: {
      type: Boolean,
      default: false
    },
    sedes: [{
      type: String,
      enum: ['centro', 'norte', 'sur', 'este', 'oeste']
    }],
    roles: [{
      type: String,
      enum: ['owner', 'admin_sede', 'clinical_professional', 'clinical_director', 'receptionist']
    }]
  },

  // Configuración de personalización
  personalizacion: {
    permitirEdicion: {
      type: Boolean,
      default: true
    },
    camposEditables: [String], // Lista de variables que se pueden editar
    formatosSalida: [{
      tipo: {
        type: String,
        enum: ['pdf', 'word', 'html'],
        required: true
      },
      plantilla: String, // URL o referencia a la plantilla de formato
      activo: {
        type: Boolean,
        default: true
      }
    }]
  },

  // Etiquetas y búsqueda
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],

  // Configuración de notificaciones
  notificaciones: {
    recordatorioFirma: {
      activo: {
        type: Boolean,
        default: true
      },
      diasAntes: {
        type: Number,
        default: 7
      }
    },
    vencimientoDocumento: {
      activo: {
        type: Boolean,
        default: true
      },
      diasAntes: {
        type: Number,
        default: 30
      }
    }
  },

  // Sede donde se creó
  sede: {
    type: String,
    enum: ['centro', 'norte', 'sur', 'este', 'oeste'],
    required: [true, 'La sede es obligatoria']
  },

  // Idiomas disponibles
  idiomas: [{
    codigo: {
      type: String,
      required: true,
      enum: ['es', 'ca', 'en']
    },
    nombre: String,
    contenido: String
  }],

  // Historial de cambios importantes
  historialCambios: [{
    fecha: {
      type: Date,
      default: Date.now
    },
    accion: {
      type: String,
      enum: ['creacion', 'modificacion', 'activacion', 'desactivacion', 'archivado'],
      required: true
    },
    descripcion: String,
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    versionAfectada: String
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
documentTemplateSchema.index({ nombre: 1 });
documentTemplateSchema.index({ tipo: 1, categoria: 1 });
documentTemplateSchema.index({ estado: 1 });
documentTemplateSchema.index({ sede: 1, estado: 1 });
documentTemplateSchema.index({ tags: 1 });
documentTemplateSchema.index({ 'estadisticas.vecesUsado': -1 });

// Virtual para obtener la versión activa
documentTemplateSchema.virtual('versionActivaObj').get(function() {
  return this.versiones.find(v => v.activa) || this.versiones[this.versiones.length - 1];
});

// Virtual para verificar si tiene versiones pendientes
documentTemplateSchema.virtual('tieneVersionesPendientes').get(function() {
  return this.versiones.some(v => !v.activa);
});

// Middleware pre-save
documentTemplateSchema.pre('save', async function(next) {
  try {
    // Actualizar fecha de modificación
    this.fechaActualizacion = Date.now();

    // Si no hay versiones, crear la primera
    if (this.versiones.length === 0) {
      this.versiones.push({
        numero: '1.0',
        contenido: 'Contenido inicial de la plantilla',
        cambios: 'Versión inicial',
        creadoPor: this.creadoPor,
        activa: true
      });
    }

    // Asegurar que solo hay una versión activa
    if (this.isModified('versiones')) {
      const versionesActivas = this.versiones.filter(v => v.activa);
      if (versionesActivas.length > 1) {
        // Desactivar todas excepto la última
        this.versiones.forEach((v, index) => {
          v.activa = index === this.versiones.length - 1;
        });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Método para crear nueva versión
documentTemplateSchema.methods.crearNuevaVersion = function(contenido, cambios, usuarioId) {
  // Desactivar versión actual
  this.versiones.forEach(v => v.activa = false);

  // Calcular nuevo número de versión
  const numeros = this.versiones.map(v => parseFloat(v.numero)).sort((a, b) => b - a);
  const siguienteNumero = (numeros[0] + 0.1).toFixed(1);

  // Agregar nueva versión
  this.versiones.push({
    numero: siguienteNumero,
    contenido,
    cambios,
    creadoPor: usuarioId,
    activa: true
  });

  this.versionActual = siguienteNumero;
  this.actualizadoPor = usuarioId;

  // Registrar en historial
  this.historialCambios.push({
    accion: 'modificacion',
    descripcion: `Nueva versión ${siguienteNumero}: ${cambios}`,
    usuario: usuarioId,
    versionAfectada: siguienteNumero
  });

  return this.save();
};

// Método para activar plantilla
documentTemplateSchema.methods.activar = function(usuarioId) {
  this.estado = 'active';
  this.actualizadoPor = usuarioId;
  
  this.historialCambios.push({
    accion: 'activacion',
    descripcion: 'Plantilla activada',
    usuario: usuarioId,
    versionAfectada: this.versionActual
  });

  return this.save();
};

// Método para desactivar plantilla
documentTemplateSchema.methods.desactivar = function(usuarioId, motivo = '') {
  this.estado = 'inactive';
  this.actualizadoPor = usuarioId;
  
  this.historialCambios.push({
    accion: 'desactivacion',
    descripcion: motivo || 'Plantilla desactivada',
    usuario: usuarioId,
    versionAfectada: this.versionActual
  });

  return this.save();
};

// Método para incrementar uso
documentTemplateSchema.methods.incrementarUso = function() {
  this.estadisticas.vecesUsado += 1;
  this.estadisticas.ultimoUso = Date.now();
  return this.save();
};

// Método para incrementar descargas
documentTemplateSchema.methods.incrementarDescargas = function() {
  this.estadisticas.descargas += 1;
  return this.save();
};

// Método para obtener resumen
documentTemplateSchema.methods.toResumen = function() {
  return {
    id: this._id,
    nombre: this.nombre,
    tipo: this.tipo,
    categoria: this.categoria,
    estado: this.estado,
    version: this.versionActual,
    fechaActualizacion: this.fechaActualizacion,
    uso: this.estadisticas.vecesUsado,
    descargas: this.estadisticas.descargas
  };
};

// Método estático para buscar plantillas
documentTemplateSchema.statics.buscarPlantillas = function(filtros = {}) {
  const query = {};

  if (filtros.nombre) {
    query.nombre = { $regex: filtros.nombre, $options: 'i' };
  }

  if (filtros.tipo) query.tipo = filtros.tipo;
  if (filtros.categoria) query.categoria = filtros.categoria;
  if (filtros.estado) query.estado = filtros.estado;
  if (filtros.sede) query.sede = filtros.sede;

  if (filtros.tags && filtros.tags.length > 0) {
    query.tags = { $in: filtros.tags };
  }

  if (filtros.fechaDesde || filtros.fechaHasta) {
    query.fechaCreacion = {};
    if (filtros.fechaDesde) query.fechaCreacion.$gte = new Date(filtros.fechaDesde);
    if (filtros.fechaHasta) query.fechaCreacion.$lte = new Date(filtros.fechaHasta);
  }

  return this.find(query)
    .populate('creadoPor', 'nombre apellidos')
    .populate('actualizadoPor', 'nombre apellidos')
    .sort({ 'estadisticas.vecesUsado': -1, fechaActualizacion: -1 });
};

// Método estático para obtener estadísticas
documentTemplateSchema.statics.obtenerEstadisticas = function(filtros = {}) {
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
        totalPlantillas: { $sum: 1 },
        activas: { $sum: { $cond: [{ $eq: ['$estado', 'active'] }, 1, 0] } },
        inactivas: { $sum: { $cond: [{ $eq: ['$estado', 'inactive'] }, 1, 0] } },
        borradores: { $sum: { $cond: [{ $eq: ['$estado', 'draft'] }, 1, 0] } },
        totalUsos: { $sum: '$estadisticas.vecesUsado' },
        totalDescargas: { $sum: '$estadisticas.descargas' },
        // Por tipo
        consentimientos: { $sum: { $cond: [{ $eq: ['$tipo', 'consentimiento'] }, 1, 0] } },
        contratos: { $sum: { $cond: [{ $eq: ['$tipo', 'contrato'] }, 1, 0] } },
        informacion: { $sum: { $cond: [{ $eq: ['$tipo', 'informacion'] }, 1, 0] } },
        // Por categoría más usada
        endodoncia: { $sum: { $cond: [{ $eq: ['$categoria', 'endodoncia'] }, '$estadisticas.vecesUsado', 0] } },
        implantologia: { $sum: { $cond: [{ $eq: ['$categoria', 'implantologia'] }, '$estadisticas.vecesUsado', 0] } },
        ortodoncia: { $sum: { $cond: [{ $eq: ['$categoria', 'ortodoncia'] }, '$estadisticas.vecesUsado', 0] } }
      }
    }
  ]);
};

module.exports = mongoose.model('DocumentTemplate', documentTemplateSchema);