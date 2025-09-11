const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del tratamiento es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: [
      'Preventiva',
      'Operatoria', 
      'Prótesis',
      'Cirugía',
      'Ortodoncia',
      'Endodoncia',
      'Periodoncia',
      'Implantología',
      'Estética',
      'Pediátrica'
    ]
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  duracion: {
    type: Number,
    required: [true, 'La duración es obligatoria'],
    min: [1, 'La duración debe ser al menos 1 minuto']
  },
  materiales: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length >= 0;
      },
      message: 'Los materiales deben ser un array válido'
    }
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  activo: {
    type: Boolean,
    default: true
  },
  codigoInterno: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  requiereConsentimiento: {
    type: Boolean,
    default: false
  },
  especialidadRequerida: {
    type: String,
    enum: [
      'odontologia_general',
      'endodoncia',
      'periodoncia', 
      'cirugia',
      'ortodoncia',
      'implantologia',
      'estetica',
      'pediatrica'
    ]
  },
  complejidad: {
    type: String,
    enum: ['baja', 'media', 'alta'],
    default: 'media'
  },
  instrucciones: {
    preoperatorias: String,
    postoperatorias: String,
    contraindicaciones: String
  },
  costoMateriales: {
    type: Number,
    min: [0, 'El costo de materiales no puede ser negativo'],
    default: 0
  },
  margenBeneficio: {
    type: Number,
    min: [0, 'El margen de beneficio no puede ser negativo'],
    max: [100, 'El margen de beneficio no puede exceder 100%']
  },
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
    ref: 'User'
  },
  actualizadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimización
treatmentSchema.index({ nombre: 1 });
treatmentSchema.index({ categoria: 1 });
treatmentSchema.index({ activo: 1 });
treatmentSchema.index({ precio: 1 });
treatmentSchema.index({ duracion: 1 });
treatmentSchema.index({ codigoInterno: 1 }, { sparse: true });

// Virtual para calcular precio con margen
treatmentSchema.virtual('precioConMargen').get(function() {
  if (this.margenBeneficio && this.costoMateriales) {
    const costoTotal = this.costoMateriales;
    return costoTotal * (1 + this.margenBeneficio / 100);
  }
  return this.precio;
});

// Virtual para obtener la categoría en formato display
treatmentSchema.virtual('categoriaDisplay').get(function() {
  const categoriaNames = {
    'Preventiva': 'Preventiva',
    'Operatoria': 'Operatoria Dental',
    'Prótesis': 'Prótesis Dental',
    'Cirugía': 'Cirugía Oral',
    'Ortodoncia': 'Ortodoncia',
    'Endodoncia': 'Endodoncia',
    'Periodoncia': 'Periodoncia',
    'Implantología': 'Implantología',
    'Estética': 'Odontología Estética',
    'Pediátrica': 'Odontopediatría'
  };
  return categoriaNames[this.categoria] || this.categoria;
});

// Virtual para mostrar duración en formato legible
treatmentSchema.virtual('duracionDisplay').get(function() {
  if (this.duracion < 60) {
    return `${this.duracion} min`;
  } else {
    const horas = Math.floor(this.duracion / 60);
    const minutos = this.duracion % 60;
    return minutos > 0 ? `${horas}h ${minutos}min` : `${horas}h`;
  }
});

// Middleware pre-save para actualizar fecha de modificación
treatmentSchema.pre('save', function(next) {
  this.fechaActualizacion = Date.now();
  
  // Generar código interno si no existe
  if (!this.codigoInterno && this.isNew) {
    const categoria = this.categoria.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.codigoInterno = `${categoria}${random}`;
  }
  
  next();
});

// Método para obtener información básica del tratamiento
treatmentSchema.methods.toInfoBasica = function() {
  return {
    id: this._id,
    nombre: this.nombre,
    categoria: this.categoria,
    categoriaDisplay: this.categoriaDisplay,
    precio: this.precio,
    duracion: this.duracion,
    duracionDisplay: this.duracionDisplay,
    descripcion: this.descripcion,
    activo: this.activo,
    codigoInterno: this.codigoInterno
  };
};

// Método estático para buscar por categoría
treatmentSchema.statics.buscarPorCategoria = function(categoria) {
  return this.find({ categoria, activo: true });
};

// Método estático para obtener estadísticas
treatmentSchema.statics.obtenerEstadisticas = async function() {
  const stats = await this.aggregate([
    { $match: { activo: true } },
    {
      $group: {
        _id: null,
        totalTratamientos: { $sum: 1 },
        precioPromedio: { $avg: '$precio' },
        duracionPromedia: { $avg: '$duracion' },
        precioMinimo: { $min: '$precio' },
        precioMaximo: { $max: '$precio' }
      }
    }
  ]);
  
  const categorias = await this.distinct('categoria', { activo: true });
  
  return {
    ...stats[0],
    totalCategorias: categorias.length,
    categorias
  };
};

// Método estático para buscar tratamientos por precio
treatmentSchema.statics.buscarPorRangoPrecio = function(precioMin, precioMax) {
  return this.find({
    precio: { $gte: precioMin, $lte: precioMax },
    activo: true
  });
};

module.exports = mongoose.model('Treatment', treatmentSchema);