const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  // Información del producto
  productoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'El producto es obligatorio']
  },
  productoNombre: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio']
  },
  productoCodigo: {
    type: String,
    required: [true, 'El código del producto es obligatorio']
  },
  // Información del lote
  numeroLote: {
    type: String,
    required: [true, 'El número de lote es obligatorio'],
    trim: true,
    uppercase: true,
    maxlength: [50, 'El número de lote no puede exceder 50 caracteres']
  },
  loteProveedor: {
    type: String,
    trim: true,
    maxlength: [50, 'El lote del proveedor no puede exceder 50 caracteres']
  },
  // Fechas importantes
  fechaIngreso: {
    type: Date,
    required: [true, 'La fecha de ingreso es obligatoria'],
    default: Date.now
  },
  fechaProduccion: {
    type: Date
  },
  fechaVencimiento: {
    type: Date,
    required: [true, 'La fecha de vencimiento es obligatoria']
  },
  // Cantidad y stock
  cantidadInicial: {
    type: Number,
    required: [true, 'La cantidad inicial es obligatoria'],
    min: [1, 'La cantidad inicial debe ser al menos 1']
  },
  cantidadActual: {
    type: Number,
    required: [true, 'La cantidad actual es obligatoria'],
    min: [0, 'La cantidad actual no puede ser negativa']
  },
  cantidadReservada: {
    type: Number,
    default: 0,
    min: [0, 'La cantidad reservada no puede ser negativa']
  },
  // Información del proveedor
  proveedor: {
    nombre: {
      type: String,
      required: [true, 'El nombre del proveedor es obligatorio'],
      trim: true
    },
    contacto: String,
    factura: String,
    ordenCompra: String
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
  // Estado del lote
  estado: {
    type: String,
    enum: ['activo', 'proximo_vencer', 'vencido', 'agotado', 'retirado', 'cuarentena'],
    default: 'activo'
  },
  // Información de calidad
  controlCalidad: {
    aprobado: {
      type: Boolean,
      default: false
    },
    fechaControl: Date,
    responsable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    observaciones: String,
    certificadoCalidad: String // URL del certificado
  },
  // Información regulatoria
  registroSanitario: String,
  invima: String,
  notificacionSanitaria: String,
  // Costos
  costoUnitario: {
    type: Number,
    required: [true, 'El costo unitario es obligatorio'],
    min: [0, 'El costo unitario no puede ser negativo']
  },
  costoTotal: {
    type: Number,
    required: true
  },
  // Temperatura y condiciones de almacenamiento
  condicionesAlmacenamiento: {
    temperatura: {
      min: Number,
      max: Number,
      actual: Number
    },
    humedad: {
      min: Number,
      max: Number,
      actual: Number
    },
    requiereRefrigeracion: {
      type: Boolean,
      default: false
    },
    observaciones: String
  },
  // Movimientos del lote
  movimientos: [{
    fecha: {
      type: Date,
      default: Date.now
    },
    tipo: {
      type: String,
      enum: ['entrada', 'salida', 'ajuste', 'transferencia', 'devolución', 'merma'],
      required: true
    },
    cantidad: {
      type: Number,
      required: true
    },
    cantidadAnterior: Number,
    cantidadPosterior: Number,
    motivo: String,
    referenciaDocumento: String,
    responsable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    observaciones: String
  }],
  // Alertas configuradas
  alertas: {
    vencimiento: {
      activa: { type: Boolean, default: true },
      diasAntes: { type: Number, default: 90 }
    },
    stockBajo: {
      activa: { type: Boolean, default: true },
      cantidadMinima: { type: Number, default: 10 }
    }
  },
  // Información de retiro (si aplica)
  retiro: {
    fecha: Date,
    motivo: {
      type: String,
      enum: ['vencimiento', 'daño', 'recall', 'calidad', 'otro']
    },
    descripcion: String,
    responsable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    documentoSoporte: String
  },
  // Trazabilidad
  trazabilidad: {
    origen: String,
    destino: String,
    cadenaFrio: {
      mantenida: Boolean,
      temperaturas: [{
        fecha: Date,
        temperatura: Number,
        responsable: String
      }]
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
batchSchema.index({ numeroLote: 1 });
batchSchema.index({ productoId: 1, estado: 1 });
batchSchema.index({ fechaVencimiento: 1, estado: 1 });
batchSchema.index({ 'ubicacion.sede': 1, 'ubicacion.zona': 1 });
batchSchema.index({ 'proveedor.nombre': 1 });
batchSchema.index({ estado: 1, fechaVencimiento: 1 });
batchSchema.index({ fechaIngreso: -1 });

// Virtual para ubicación completa
batchSchema.virtual('ubicacionCompleta').get(function() {
  let ubicacion = `${this.ubicacion.sede} - ${this.ubicacion.zona}`;
  if (this.ubicacion.estante) {
    ubicacion += ` - Estante ${this.ubicacion.estante}`;
  }
  if (this.ubicacion.nivel) {
    ubicacion += ` - Nivel ${this.ubicacion.nivel}`;
  }
  return ubicacion;
});

// Virtual para calcular días hasta vencimiento
batchSchema.virtual('diasParaVencer').get(function() {
  const ahora = new Date();
  const diferencia = this.fechaVencimiento - ahora;
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
});

// Virtual para verificar si está vencido
batchSchema.virtual('estaVencido').get(function() {
  return this.fechaVencimiento < new Date();
});

// Virtual para verificar si está próximo a vencer
batchSchema.virtual('proximoAVencer').get(function() {
  const diasRestantes = this.diasParaVencer;
  return diasRestantes > 0 && diasRestantes <= (this.alertas.vencimiento.diasAntes || 90);
});

// Virtual para calcular porcentaje de stock usado
batchSchema.virtual('porcentajeUsado').get(function() {
  if (this.cantidadInicial === 0) return 0;
  return Math.round(((this.cantidadInicial - this.cantidadActual) / this.cantidadInicial) * 100);
});

// Virtual para cantidad disponible (actual - reservada)
batchSchema.virtual('cantidadDisponible').get(function() {
  return Math.max(0, this.cantidadActual - this.cantidadReservada);
});

// Middleware pre-save para actualizar fecha de modificación y calcular totales
batchSchema.pre('save', function(next) {
  this.fechaActualizacion = Date.now();
  
  // Calcular costo total
  this.costoTotal = this.cantidadInicial * this.costoUnitario;
  
  // Actualizar estado basado en condiciones
  if (this.cantidadActual <= 0) {
    this.estado = 'agotado';
  } else if (this.estaVencido) {
    this.estado = 'vencido';
  } else if (this.proximoAVencer) {
    this.estado = 'proximo_vencer';
  } else if (this.estado === 'proximo_vencer' || this.estado === 'vencido') {
    // Revertir a activo si ya no está próximo a vencer o vencido
    this.estado = 'activo';
  }
  
  next();
});

// Método para registrar movimiento
batchSchema.methods.registrarMovimiento = function(tipo, cantidad, motivo, responsable, observaciones = '') {
  const cantidadAnterior = this.cantidadActual;
  
  if (tipo === 'salida' || tipo === 'merma') {
    this.cantidadActual = Math.max(0, this.cantidadActual - Math.abs(cantidad));
  } else if (tipo === 'entrada') {
    this.cantidadActual += Math.abs(cantidad);
  } else if (tipo === 'ajuste') {
    this.cantidadActual = Math.max(0, cantidad);
  }
  
  this.movimientos.push({
    tipo,
    cantidad: Math.abs(cantidad),
    cantidadAnterior,
    cantidadPosterior: this.cantidadActual,
    motivo,
    responsable,
    observaciones
  });
  
  return this.save();
};

// Método para retirar lote
batchSchema.methods.retirarLote = function(motivo, descripcion, responsable) {
  this.estado = 'retirado';
  this.retiro = {
    fecha: new Date(),
    motivo,
    descripcion,
    responsable
  };
  
  return this.save();
};

// Método para información básica
batchSchema.methods.toInfoBasica = function() {
  return {
    id: this._id,
    numeroLote: this.numeroLote,
    productoNombre: this.productoNombre,
    cantidadActual: this.cantidadActual,
    cantidadDisponible: this.cantidadDisponible,
    fechaVencimiento: this.fechaVencimiento,
    diasParaVencer: this.diasParaVencer,
    estado: this.estado,
    ubicacionCompleta: this.ubicacionCompleta,
    proveedor: this.proveedor.nombre
  };
};

// Método estático para buscar lotes próximos a vencer
batchSchema.statics.proximosAVencer = function(dias = 90) {
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() + dias);
  
  return this.find({
    fechaVencimiento: {
      $lte: fechaLimite,
      $gte: new Date()
    },
    estado: { $in: ['activo', 'proximo_vencer'] },
    cantidadActual: { $gt: 0 }
  })
  .populate('productoId', 'nombre codigo categoria')
  .sort({ fechaVencimiento: 1 });
};

// Método estático para buscar lotes vencidos
batchSchema.statics.lotesVencidos = function() {
  return this.find({
    fechaVencimiento: { $lt: new Date() },
    estado: { $ne: 'retirado' },
    cantidadActual: { $gt: 0 }
  })
  .populate('productoId', 'nombre codigo categoria')
  .sort({ fechaVencimiento: 1 });
};

// Método estático para obtener estadísticas
batchSchema.statics.obtenerEstadisticas = async function() {
  const fechaActual = new Date();
  const fecha30Dias = new Date();
  fecha30Dias.setDate(fecha30Dias.getDate() + 30);
  const fecha90Dias = new Date();
  fecha90Dias.setDate(fecha90Dias.getDate() + 90);
  
  const stats = await this.aggregate([
    {
      $facet: {
        general: [
          {
            $group: {
              _id: null,
              totalLotes: { $sum: 1 },
              lotesActivos: {
                $sum: { $cond: [{ $eq: ['$estado', 'activo'] }, 1, 0] }
              },
              lotesVencidos: {
                $sum: { $cond: [{ $lt: ['$fechaVencimiento', fechaActual] }, 1, 0] }
              },
              lotesProximoVencer30: {
                $sum: { 
                  $cond: [
                    { 
                      $and: [
                        { $gte: ['$fechaVencimiento', fechaActual] },
                        { $lte: ['$fechaVencimiento', fecha30Dias] }
                      ]
                    }, 
                    1, 
                    0
                  ]
                }
              },
              lotesProximoVencer90: {
                $sum: { 
                  $cond: [
                    { 
                      $and: [
                        { $gte: ['$fechaVencimiento', fechaActual] },
                        { $lte: ['$fechaVencimiento', fecha90Dias] }
                      ]
                    }, 
                    1, 
                    0
                  ]
                }
              },
              valorInventario: {
                $sum: { $multiply: ['$cantidadActual', '$costoUnitario'] }
              }
            }
          }
        ],
        porEstado: [
          {
            $group: {
              _id: '$estado',
              count: { $sum: 1 },
              cantidadTotal: { $sum: '$cantidadActual' }
            }
          },
          { $sort: { count: -1 } }
        ]
      }
    }
  ]);
  
  return stats[0];
};

// Método estático para buscar por producto
batchSchema.statics.buscarPorProducto = function(productoId, soloActivos = true) {
  const filtro = { productoId };
  if (soloActivos) {
    filtro.estado = { $in: ['activo', 'proximo_vencer'] };
    filtro.cantidadActual = { $gt: 0 };
  }
  
  return this.find(filtro)
    .populate('productoId', 'nombre codigo categoria')
    .sort({ fechaVencimiento: 1 });
};

module.exports = mongoose.model('Batch', batchSchema);