const mongoose = require('mongoose');

const consentFormSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la plantilla es obligatorio'],
    trim: true,
    maxlength: [200, 'El nombre no puede exceder 200 caracteres']
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: [
      'General',
      'Cirugía',
      'Ortodoncia',
      'Implantología',
      'Endodoncia',
      'Periodoncia',
      'Estética',
      'Pediátrica',
      'Urgencias'
    ]
  },
  version: {
    type: String,
    required: [true, 'La versión es obligatoria'],
    trim: true,
    match: [/^\d+\.\d+$/, 'La versión debe tener el formato X.Y (ej: 1.0, 2.5)']
  },
  contenido: {
    type: String,
    required: [true, 'El contenido es obligatorio'],
    minlength: [50, 'El contenido debe tener al menos 50 caracteres']
  },
  activo: {
    type: Boolean,
    default: true
  },
  obligatorio: {
    type: Boolean,
    default: false
  },
  // Campos para control de versiones
  versionAnterior: {
    type: String,
    trim: true
  },
  motivoCambio: {
    type: String,
    maxlength: [500, 'El motivo del cambio no puede exceder 500 caracteres']
  },
  // Configuración de validez
  fechaVigenciaDesde: {
    type: Date,
    default: Date.now
  },
  fechaVigenciaHasta: {
    type: Date
  },
  // Campos adicionales de configuración
  requiereTestigo: {
    type: Boolean,
    default: false
  },
  permiteFirmaDigital: {
    type: Boolean,
    default: true
  },
  tiempoExpiracion: {
    type: Number, // en días
    default: 30,
    min: [1, 'El tiempo de expiración debe ser al menos 1 día']
  },
  // Campos de seguimiento legal
  codigoLegal: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    uppercase: true
  },
  baseLegal: {
    type: String,
    maxlength: [1000, 'La base legal no puede exceder 1000 caracteres']
  },
  // Campos de metadata
  tags: {
    type: [String],
    default: []
  },
  idioma: {
    type: String,
    enum: ['es', 'en', 'ca'],
    default: 'es'
  },
  // Auditoría
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actualizadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  aprobadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fechaAprobacion: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimización
consentFormSchema.index({ nombre: 1, activo: 1 });
consentFormSchema.index({ categoria: 1, activo: 1 });
consentFormSchema.index({ version: 1 });
consentFormSchema.index({ codigoLegal: 1 }, { sparse: true });
consentFormSchema.index({ fechaVigenciaDesde: 1, fechaVigenciaHasta: 1 });
consentFormSchema.index({ tags: 1 });

// Virtual para verificar si está vigente
consentFormSchema.virtual('estaVigente').get(function() {
  const ahora = new Date();
  const vigenciaDesde = this.fechaVigenciaDesde || this.fechaCreacion;
  const vigenciaHasta = this.fechaVigenciaHasta;
  
  return ahora >= vigenciaDesde && (!vigenciaHasta || ahora <= vigenciaHasta);
});

// Virtual para obtener el estado completo
consentFormSchema.virtual('estadoCompleto').get(function() {
  if (!this.activo) return 'inactiva';
  if (!this.estaVigente) return 'expirada';
  return 'activa';
});

// Virtual para mostrar información de versión
consentFormSchema.virtual('infoVersion').get(function() {
  return {
    actual: this.version,
    anterior: this.versionAnterior,
    esNuevaVersion: !!this.versionAnterior
  };
});

// Middleware pre-save para actualizar fecha de modificación
consentFormSchema.pre('save', function(next) {
  this.fechaActualizacion = Date.now();
  
  // Generar código legal si no existe
  if (!this.codigoLegal && this.isNew) {
    const categoria = this.categoria.substring(0, 3).toUpperCase();
    const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    this.codigoLegal = `${categoria}-${fecha}-${random}`;
  }
  
  next();
});

// Método para crear nueva versión
consentFormSchema.methods.crearNuevaVersion = function(nuevaVersion, motivoCambio, nuevoContenido, creadoPor) {
  const NuevoConsentimiento = this.constructor;
  
  return NuevoConsentimiento.create({
    nombre: this.nombre,
    categoria: this.categoria,
    version: nuevaVersion,
    contenido: nuevoContenido || this.contenido,
    activo: true,
    obligatorio: this.obligatorio,
    versionAnterior: this.version,
    motivoCambio,
    requiereTestigo: this.requiereTestigo,
    permiteFirmaDigital: this.permiteFirmaDigital,
    tiempoExpiracion: this.tiempoExpiracion,
    baseLegal: this.baseLegal,
    tags: this.tags,
    idioma: this.idioma,
    creadoPor
  });
};

// Método para obtener versiones anteriores
consentFormSchema.methods.obtenerVersiones = function() {
  return this.constructor.find({
    nombre: this.nombre,
    categoria: this.categoria
  }).sort({ version: -1 });
};

// Método para información básica
consentFormSchema.methods.toInfoBasica = function() {
  return {
    id: this._id,
    nombre: this.nombre,
    categoria: this.categoria,
    version: this.version,
    activo: this.activo,
    obligatorio: this.obligatorio,
    estaVigente: this.estaVigente,
    estadoCompleto: this.estadoCompleto,
    fechaCreacion: this.fechaCreacion,
    codigoLegal: this.codigoLegal
  };
};

// Método estático para buscar plantillas activas
consentFormSchema.statics.buscarActivas = function(categoria = null) {
  const filter = { 
    activo: true,
    $or: [
      { fechaVigenciaHasta: { $exists: false } },
      { fechaVigenciaHasta: { $gte: new Date() } }
    ]
  };
  
  if (categoria && categoria !== 'todos') {
    filter.categoria = categoria;
  }
  
  return this.find(filter).sort({ nombre: 1, version: -1 });
};

// Método estático para obtener estadísticas
consentFormSchema.statics.obtenerEstadisticas = async function() {
  const stats = await this.aggregate([
    {
      $facet: {
        general: [
          {
            $group: {
              _id: null,
              totalPlantillas: { $sum: 1 },
              activas: {
                $sum: {
                  $cond: [{ $eq: ['$activo', true] }, 1, 0]
                }
              },
              obligatorias: {
                $sum: {
                  $cond: [{ $eq: ['$obligatorio', true] }, 1, 0]
                }
              }
            }
          }
        ],
        porCategoria: [
          {
            $group: {
              _id: '$categoria',
              count: { $sum: 1 },
              activas: {
                $sum: {
                  $cond: [{ $eq: ['$activo', true] }, 1, 0]
                }
              }
            }
          },
          { $sort: { count: -1 } }
        ]
      }
    }
  ]);
  
  return stats[0];
};

module.exports = mongoose.model('ConsentForm', consentFormSchema);