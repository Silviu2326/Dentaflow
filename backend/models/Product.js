const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Información básica
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true,
    maxlength: [200, 'El nombre no puede exceder 200 caracteres']
  },
  codigo: {
    type: String,
    required: [true, 'El código del producto es obligatorio'],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [50, 'El código no puede exceder 50 caracteres']
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: [
      'Materiales de Obturación',
      'Anestésicos',
      'Protección Personal',
      'Instrumental',
      'Esterilización',
      'Radiología',
      'Endodoncia',
      'Periodoncia',
      'Cirugía Oral',
      'Ortodoncia',
      'Prótesis',
      'Blanqueamiento',
      'Higiene Oral',
      'Medicamentos',
      'Consumibles',
      'Equipamiento',
      'Otros'
    ]
  },
  // Descripción y especificaciones
  descripcion: {
    type: String,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  marca: {
    type: String,
    trim: true,
    maxlength: [100, 'La marca no puede exceder 100 caracteres']
  },
  modelo: {
    type: String,
    trim: true,
    maxlength: [100, 'El modelo no puede exceder 100 caracteres']
  },
  // Unidad de medida
  unidadMedida: {
    type: String,
    required: [true, 'La unidad de medida es obligatoria'],
    enum: [
      'Unidades',
      'Cajas',
      'Paquetes',
      'Cápsulas',
      'Carpules',
      'Jeringas',
      'Tubos',
      'Frascos',
      'Sobres',
      'Rollos',
      'Metros',
      'Kilogramos',
      'Gramos',
      'Mililitros',
      'Litros'
    ]
  },
  // Control de stock
  stockMinimo: {
    type: Number,
    required: [true, 'El stock mínimo es obligatorio'],
    min: [0, 'El stock mínimo no puede ser negativo']
  },
  stockActual: {
    type: Number,
    required: [true, 'El stock actual es obligatorio'],
    min: [0, 'El stock actual no puede ser negativo'],
    default: 0
  },
  stockMaximo: {
    type: Number,
    required: [true, 'El stock máximo es obligatorio'],
    min: [1, 'El stock máximo debe ser al menos 1']
  },
  // Ubicación y almacenamiento
  ubicacion: {
    sede: {
      type: String,
      enum: ['Sede Central', 'Sede Norte', 'Sede Sur', 'Sede Este', 'Sede Oeste'],
      required: [true, 'La sede es obligatoria']
    },
    zona: {
      type: String,
      enum: ['Almacén A', 'Almacén B', 'Almacén General', 'Consulta 1', 'Consulta 2', 'Consulta 3', 'Laboratorio', 'Esterilización'],
      required: [true, 'La zona es obligatoria']
    },
    estante: String,
    nivel: String
  },
  // Información del proveedor
  proveedor: {
    nombre: {
      type: String,
      required: [true, 'El nombre del proveedor es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre del proveedor no puede exceder 100 caracteres']
    },
    contacto: {
      telefono: String,
      email: String,
      direccion: String
    },
    tiempoEntrega: {
      type: Number, // días
      default: 7
    }
  },
  // Información financiera
  precioUnitario: {
    type: Number,
    required: [true, 'El precio unitario es obligatorio'],
    min: [0, 'El precio unitario no puede ser negativo']
  },
  costoPromedio: {
    type: Number,
    min: [0, 'El costo promedio no puede ser negativo']
  },
  // Fechas importantes
  ultimaCompra: {
    type: Date
  },
  proximaRevision: {
    type: Date
  },
  // Estado del producto
  estado: {
    type: String,
    enum: ['activo', 'inactivo', 'descontinuado'],
    default: 'activo'
  },
  // Configuración de alertas
  alertas: {
    stockBajo: {
      type: Boolean,
      default: true
    },
    stockCritico: {
      type: Boolean,
      default: true
    },
    vencimiento: {
      type: Boolean,
      default: true
    },
    diasAntesVencimiento: {
      type: Number,
      default: 90
    }
  },
  // Características especiales
  requiereReceta: {
    type: Boolean,
    default: false
  },
  esControlado: {
    type: Boolean,
    default: false
  },
  requiereRefrigeracion: {
    type: Boolean,
    default: false
  },
  temperaturaAlmacenamiento: {
    min: Number,
    max: Number,
    unidad: {
      type: String,
      enum: ['celsius', 'fahrenheit'],
      default: 'celsius'
    }
  },
  // Información de seguimiento
  registroSanitario: String,
  loteActual: String,
  fechaVencimientoActual: Date,
  // Estadísticas de uso
  consumoPromedio: {
    cantidad: Number,
    periodo: {
      type: String,
      enum: ['diario', 'semanal', 'mensual'],
      default: 'mensual'
    }
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimización
productSchema.index({ codigo: 1 });
productSchema.index({ nombre: 1 });
productSchema.index({ categoria: 1, estado: 1 });
productSchema.index({ 'ubicacion.sede': 1, 'ubicacion.zona': 1 });
productSchema.index({ 'proveedor.nombre': 1 });
productSchema.index({ stockActual: 1, stockMinimo: 1 });
productSchema.index({ ultimaCompra: -1 });
productSchema.index({ estado: 1, fechaActualizacion: -1 });

// Virtual para la ubicación completa
productSchema.virtual('ubicacionCompleta').get(function() {
  let ubicacion = `${this.ubicacion.sede} - ${this.ubicacion.zona}`;
  if (this.ubicacion.estante) {
    ubicacion += ` - Estante ${this.ubicacion.estante}`;
  }
  if (this.ubicacion.nivel) {
    ubicacion += ` - Nivel ${this.ubicacion.nivel}`;
  }
  return ubicacion;
});

// Virtual para calcular el estado del stock
productSchema.virtual('estadoStock').get(function() {
  if (this.stockActual === 0) return 'agotado';
  if (this.stockActual <= this.stockMinimo * 0.5) return 'critico';
  if (this.stockActual <= this.stockMinimo) return 'bajo';
  return 'normal';
});

// Virtual para calcular porcentaje de stock
productSchema.virtual('porcentajeStock').get(function() {
  if (this.stockMaximo === 0) return 0;
  return Math.round((this.stockActual / this.stockMaximo) * 100);
});

// Virtual para calcular días de stock restante
productSchema.virtual('diasStockRestante').get(function() {
  if (!this.consumoPromedio || !this.consumoPromedio.cantidad || this.consumoPromedio.cantidad <= 0) {
    return null;
  }
  
  let consumoDiario = this.consumoPromedio.cantidad;
  switch (this.consumoPromedio.periodo) {
    case 'semanal':
      consumoDiario = consumoDiario / 7;
      break;
    case 'mensual':
      consumoDiario = consumoDiario / 30;
      break;
    default:
      break;
  }
  
  return Math.floor(this.stockActual / consumoDiario);
});

// Virtual para información de vencimiento
productSchema.virtual('infoVencimiento').get(function() {
  if (!this.fechaVencimientoActual) return null;
  
  const ahora = new Date();
  const diasParaVencer = Math.ceil((this.fechaVencimientoActual - ahora) / (1000 * 60 * 60 * 24));
  
  let estado = 'vigente';
  if (diasParaVencer < 0) {
    estado = 'vencido';
  } else if (diasParaVencer <= this.alertas.diasAntesVencimiento) {
    estado = 'proximo_vencer';
  }
  
  return {
    diasParaVencer,
    estado,
    fechaVencimiento: this.fechaVencimientoActual
  };
});

// Middleware pre-save para actualizar fecha de modificación
productSchema.pre('save', function(next) {
  this.fechaActualizacion = Date.now();
  
  // Validar que stock mínimo no sea mayor que stock máximo
  if (this.stockMinimo > this.stockMaximo) {
    return next(new Error('El stock mínimo no puede ser mayor que el stock máximo'));
  }
  
  next();
});

// Método para actualizar stock
productSchema.methods.actualizarStock = function(cantidad, tipo = 'entrada', lote = null, fechaVencimiento = null) {
  if (tipo === 'entrada') {
    this.stockActual += cantidad;
    if (lote) this.loteActual = lote;
    if (fechaVencimiento) this.fechaVencimientoActual = fechaVencimiento;
  } else if (tipo === 'salida') {
    this.stockActual = Math.max(0, this.stockActual - cantidad);
  }
  
  return this.save();
};

// Método para verificar si necesita reposición
productSchema.methods.necesitaReposicion = function() {
  return this.stockActual <= this.stockMinimo;
};

// Método para calcular cantidad sugerida de pedido
productSchema.methods.cantidadSugeridaPedido = function() {
  const diferencia = this.stockMaximo - this.stockActual;
  return Math.max(0, diferencia);
};

// Método para información básica
productSchema.methods.toInfoBasica = function() {
  return {
    id: this._id,
    nombre: this.nombre,
    codigo: this.codigo,
    categoria: this.categoria,
    stockActual: this.stockActual,
    stockMinimo: this.stockMinimo,
    stockMaximo: this.stockMaximo,
    estadoStock: this.estadoStock,
    ubicacionCompleta: this.ubicacionCompleta,
    precioUnitario: this.precioUnitario,
    ultimaCompra: this.ultimaCompra
  };
};

// Método estático para buscar productos con stock bajo
productSchema.statics.buscarStockBajo = function() {
  return this.find({
    $expr: { $lte: ['$stockActual', '$stockMinimo'] },
    estado: 'activo'
  }).populate('creadoPor', 'nombre apellidos');
};

// Método estático para buscar productos críticos
productSchema.statics.buscarStockCritico = function() {
  return this.find({
    $expr: { $lte: ['$stockActual', { $multiply: ['$stockMinimo', 0.5] }] },
    estado: 'activo'
  }).populate('creadoPor', 'nombre apellidos');
};

// Método estático para obtener estadísticas
productSchema.statics.obtenerEstadisticas = async function() {
  const stats = await this.aggregate([
    { $match: { estado: 'activo' } },
    {
      $group: {
        _id: null,
        totalProductos: { $sum: 1 },
        stockBajo: {
          $sum: {
            $cond: [{ $lte: ['$stockActual', '$stockMinimo'] }, 1, 0]
          }
        },
        stockCritico: {
          $sum: {
            $cond: [{ $lte: ['$stockActual', { $multiply: ['$stockMinimo', 0.5] }] }, 1, 0]
          }
        },
        stockNormal: {
          $sum: {
            $cond: [{ $gt: ['$stockActual', '$stockMinimo'] }, 1, 0]
          }
        },
        agotados: {
          $sum: {
            $cond: [{ $eq: ['$stockActual', 0] }, 1, 0]
          }
        },
        valorInventario: {
          $sum: { $multiply: ['$stockActual', '$precioUnitario'] }
        }
      }
    }
  ]);

  // Estadísticas por categoría
  const statsPorCategoria = await this.aggregate([
    { $match: { estado: 'activo' } },
    {
      $group: {
        _id: '$categoria',
        count: { $sum: 1 },
        valorTotal: { $sum: { $multiply: ['$stockActual', '$precioUnitario'] } }
      }
    },
    { $sort: { count: -1 } }
  ]);

  return {
    general: stats[0] || {
      totalProductos: 0,
      stockBajo: 0,
      stockCritico: 0,
      stockNormal: 0,
      agotados: 0,
      valorInventario: 0
    },
    porCategoria: statsPorCategoria
  };
};

// Método estático para productos próximos a vencer
productSchema.statics.proximosAVencer = function(dias = 90) {
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() + dias);
  
  return this.find({
    fechaVencimientoActual: {
      $exists: true,
      $lte: fechaLimite,
      $gte: new Date()
    },
    estado: 'activo'
  }).sort({ fechaVencimientoActual: 1 });
};

// Método estático para productos vencidos
productSchema.statics.productosVencidos = function() {
  return this.find({
    fechaVencimientoActual: {
      $exists: true,
      $lt: new Date()
    },
    estado: 'activo'
  }).sort({ fechaVencimientoActual: 1 });
};

module.exports = mongoose.model('Product', productSchema);