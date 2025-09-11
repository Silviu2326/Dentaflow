const mongoose = require('mongoose');

const costeMaterialSchema = new mongoose.Schema({
  material: {
    type: String,
    required: [true, 'El nombre del material es obligatorio'],
    trim: true,
    maxlength: [200, 'El nombre del material no puede exceder 200 caracteres']
  },
  
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: {
      values: ['Implantes', 'Endodoncia', 'Prótesis', 'Preventiva', 'Anestésicos', 'Farmacia', 'Instrumental', 'Desechables', 'Radiología', 'Laboratorio', 'Otros'],
      message: 'Categoría no válida'
    }
  },
  
  precioUnitario: {
    type: Number,
    required: [true, 'El precio unitario es obligatorio'],
    min: [0, 'El precio unitario no puede ser negativo']
  },
  
  cantidadUsada: {
    type: Number,
    required: [true, 'La cantidad usada es obligatoria'],
    min: [0, 'La cantidad usada no puede ser negativa']
  },
  
  unidadMedida: {
    type: String,
    enum: ['unidad', 'gramo', 'ml', 'cm', 'metro', 'kg', 'litro', 'caja', 'blister', 'jeringa'],
    default: 'unidad'
  },
  
  costeTotal: {
    type: Number,
    required: true
  },
  
  proveedor: {
    type: String,
    required: [true, 'El proveedor es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre del proveedor no puede exceder 100 caracteres']
  },
  
  tratamiento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CosteTratamiento',
    required: [true, 'El tratamiento asociado es obligatorio']
  },
  
  fecha: {
    type: Date,
    required: [true, 'La fecha es obligatoria'],
    default: Date.now
  },
  
  sede: {
    type: String,
    enum: ['centro', 'norte', 'sur', 'este', 'oeste'],
    required: [true, 'La sede es obligatoria']
  },
  
  lote: {
    numero: String,
    fechaCaducidad: Date,
    fechaFabricacion: Date
  },
  
  inventario: {
    stockActual: { type: Number, default: 0 },
    stockMinimo: { type: Number, default: 0 },
    stockMaximo: { type: Number, default: 0 },
    puntoReorden: { type: Number, default: 0 },
    ubicacionAlmacen: String
  },
  
  preciosHistoricos: [{
    fecha: { type: Date, default: Date.now },
    precio: Number,
    proveedor: String,
    motivoCambio: String
  }],
  
  consumo: {
    ultimoMes: { type: Number, default: 0 },
    ultimoTrimestre: { type: Number, default: 0 },
    ultimoSemestre: { type: Number, default: 0 },
    ultimoAño: { type: Number, default: 0 },
    promedioMensual: { type: Number, default: 0 },
    tendencia: {
      type: String,
      enum: ['creciente', 'estable', 'decreciente'],
      default: 'estable'
    }
  },
  
  calidad: {
    certificaciones: [String],
    nivelCalidad: {
      type: String,
      enum: ['basico', 'estandar', 'premium', 'profesional'],
      default: 'estandar'
    },
    fabricante: String,
    paisOrigen: String,
    registroSanitario: String
  },
  
  rentabilidad: {
    margenPorUnidad: Number,
    margenPorcentaje: Number,
    rotacion: Number, // veces por año
    valorInventario: Number,
    costeMedioAlmacenamiento: Number
  },
  
  estadisticasUso: {
    frecuenciaUso: {
      type: String,
      enum: ['diaria', 'semanal', 'mensual', 'ocasional', 'rara'],
      default: 'ocasional'
    },
    profesionalesQueUsan: [{
      profesional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      cantidadUsada: Number,
      frecuencia: String
    }],
    tratamientosAsociados: [{
      tratamiento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CosteTratamiento'
      },
      cantidadPromedio: Number,
      costoPromedio: Number
    }],
    eficienciaUso: { type: Number, min: 0, max: 100 }, // % utilización vs desperdicio
    desperdicioPromedio: { type: Number, default: 0 }
  },
  
  comparativaPrecios: {
    precioMercado: Number,
    posicionCompetitiva: {
      type: String,
      enum: ['economico', 'competitivo', 'premium']
    },
    proveedoresAlternativos: [{
      proveedor: String,
      precio: Number,
      calidad: String,
      tiempoEntrega: Number,
      condicionesPago: String
    }]
  },
  
  alertas: {
    stockBajo: { type: Boolean, default: false },
    proximoCaducidad: { type: Boolean, default: false },
    aumentoPrecio: { type: Boolean, default: false },
    bajaRotacion: { type: Boolean, default: false },
    altoConsumo: { type: Boolean, default: false }
  },
  
  observaciones: {
    type: String,
    maxlength: [1000, 'Las observaciones no pueden exceder 1000 caracteres']
  },
  
  estado: {
    type: String,
    enum: ['activo', 'descontinuado', 'reemplazado', 'temporal'],
    default: 'activo'
  },
  
  materialReemplazo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CosteMaterial'
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
costeMaterialSchema.index({ material: 1, sede: 1 });
costeMaterialSchema.index({ categoria: 1 });
costeMaterialSchema.index({ proveedor: 1 });
costeMaterialSchema.index({ tratamiento: 1 });
costeMaterialSchema.index({ fecha: -1 });
costeMaterialSchema.index({ precioUnitario: -1 });
costeMaterialSchema.index({ estado: 1 });
costeMaterialSchema.index({ 'inventario.stockActual': 1 });

// Virtual para nombre del tratamiento
costeMaterialSchema.virtual('nombreTratamiento').get(function() {
  return this.tratamiento ? this.tratamiento.tratamiento : null;
});

// Virtual para coste por unidad de medida
costeMaterialSchema.virtual('costePorUnidad').get(function() {
  return this.cantidadUsada > 0 ? this.costeTotal / this.cantidadUsada : 0;
});

// Virtual para rotación anual
costeMaterialSchema.virtual('rotacionAnual').get(function() {
  if (!this.consumo.promedioMensual || !this.inventario.stockActual) return 0;
  const consumoAnual = this.consumo.promedioMensual * 12;
  return this.inventario.stockActual > 0 ? consumoAnual / this.inventario.stockActual : 0;
});

// Virtual para valor total en inventario
costeMaterialSchema.virtual('valorInventario').get(function() {
  return this.inventario.stockActual * this.precioUnitario;
});

// Middleware pre-save para cálculos automáticos
costeMaterialSchema.pre('save', function(next) {
  // Calcular coste total
  this.costeTotal = this.precioUnitario * this.cantidadUsada;
  
  // Calcular rentabilidad si hay datos suficientes
  if (this.tratamiento && this.tratamiento.precioVenta) {
    this.rentabilidad.margenPorUnidad = this.tratamiento.precioVenta - this.costeTotal;
    this.rentabilidad.margenPorcentaje = this.tratamiento.precioVenta > 0 ? 
      (this.rentabilidad.margenPorUnidad / this.tratamiento.precioVenta) * 100 : 0;
  }
  
  // Actualizar valor de inventario
  if (this.rentabilidad) {
    this.rentabilidad.valorInventario = this.valorInventario;
  }
  
  // Verificar alertas
  this.verificarAlertas();
  
  // Actualizar usuario modificador
  if (!this.isNew) {
    this.actualizadoPor = this.creadoPor;
  }
  
  next();
});

// Método para verificar alertas
costeMaterialSchema.methods.verificarAlertas = function() {
  // Stock bajo
  this.alertas.stockBajo = this.inventario.stockActual <= this.inventario.stockMinimo;
  
  // Próximo a caducidad (30 días)
  if (this.lote.fechaCaducidad) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + 30);
    this.alertas.proximoCaducidad = this.lote.fechaCaducidad <= fechaLimite;
  }
  
  // Baja rotación (menos de 4 veces al año)
  this.alertas.bajaRotacion = this.rotacionAnual < 4;
  
  // Alto consumo (más del doble del promedio)
  if (this.consumo.promedioMensual > 0) {
    this.alertas.altoConsumo = this.consumo.ultimoMes > (this.consumo.promedioMensual * 2);
  }
};

// Método para actualizar precio
costeMaterialSchema.methods.actualizarPrecio = function(nuevoPrecio, proveedor, motivo, usuarioId) {
  // Guardar precio anterior en historial
  this.preciosHistoricos.push({
    fecha: new Date(),
    precio: this.precioUnitario,
    proveedor: this.proveedor,
    motivoCambio: motivo || 'Actualización de precio'
  });
  
  // Verificar aumento significativo (más del 10%)
  const aumentoPorcentaje = ((nuevoPrecio - this.precioUnitario) / this.precioUnitario) * 100;
  this.alertas.aumentoPrecio = aumentoPorcentaje > 10;
  
  // Actualizar precio y proveedor
  this.precioUnitario = nuevoPrecio;
  if (proveedor) this.proveedor = proveedor;
  this.actualizadoPor = usuarioId;
  
  return this.save();
};

// Método para actualizar stock
costeMaterialSchema.methods.actualizarStock = function(nuevoStock, usuarioId) {
  this.inventario.stockActual = nuevoStock;
  this.actualizadoPor = usuarioId;
  
  // Verificar alertas después del cambio
  this.verificarAlertas();
  
  return this.save();
};

// Método para registrar consumo
costeMaterialSchema.methods.registrarConsumo = function(cantidad, tratamientoId, profesionalId) {
  // Actualizar stock
  this.inventario.stockActual = Math.max(0, this.inventario.stockActual - cantidad);
  
  // Agregar a estadísticas de uso
  const profesionalExistente = this.estadisticasUso.profesionalesQueUsan
    .find(p => p.profesional.toString() === profesionalId.toString());
  
  if (profesionalExistente) {
    profesionalExistente.cantidadUsada += cantidad;
  } else {
    this.estadisticasUso.profesionalesQueUsan.push({
      profesional: profesionalId,
      cantidadUsada: cantidad,
      frecuencia: 'ocasional'
    });
  }
  
  // Actualizar tratamientos asociados
  const tratamientoExistente = this.estadisticasUso.tratamientosAsociados
    .find(t => t.tratamiento.toString() === tratamientoId.toString());
  
  if (tratamientoExistente) {
    const totalAnterior = tratamientoExistente.cantidadPromedio * tratamientoExistente.uses || 1;
    tratamientoExistente.uses = (tratamientoExistente.uses || 1) + 1;
    tratamientoExistente.cantidadPromedio = (totalAnterior + cantidad) / tratamientoExistente.uses;
  } else {
    this.estadisticasUso.tratamientosAsociados.push({
      tratamiento: tratamientoId,
      cantidadPromedio: cantidad,
      costoPromedio: cantidad * this.precioUnitario,
      uses: 1
    });
  }
  
  return this.save();
};

// Método estático para análisis por categoría
costeMaterialSchema.statics.obtenerAnalisisPorCategoria = function(sede = null, fechaInicio = null, fechaFin = null) {
  const query = { estado: 'activo' };
  
  if (sede) query.sede = sede;
  if (fechaInicio && fechaFin) {
    query.fecha = {
      $gte: new Date(fechaInicio),
      $lte: new Date(fechaFin)
    };
  }
  
  return this.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$categoria',
        totalMateriales: { $sum: 1 },
        costoTotal: { $sum: '$costeTotal' },
        cantidadTotal: { $sum: '$cantidadUsada' },
        precioPromedio: { $avg: '$precioUnitario' },
        mayorConsumo: {
          $max: {
            material: '$material',
            cantidad: '$cantidadUsada',
            costo: '$costeTotal'
          }
        },
        proveedoresPrincipales: { $addToSet: '$proveedor' }
      }
    },
    { $sort: { costoTotal: -1 } }
  ]);
};

// Método estático para análisis por proveedor
costeMaterialSchema.statics.obtenerAnalisisPorProveedor = function(sede = null, periodo = null) {
  const query = { estado: 'activo' };
  
  if (sede) query.sede = sede;
  if (periodo) {
    query.fecha = {
      $gte: new Date(periodo.fechaInicio),
      $lte: new Date(periodo.fechaFin)
    };
  }
  
  return this.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$proveedor',
        materialesSupertidos: { $sum: 1 },
        costoTotal: { $sum: '$costeTotal' },
        precioPromedio: { $avg: '$precioUnitario' },
        categorias: { $addToSet: '$categoria' },
        ultimoPedido: { $max: '$fecha' },
        materialMasCaro: {
          $max: {
            material: '$material',
            precio: '$precioUnitario'
          }
        }
      }
    },
    { $sort: { costoTotal: -1 } }
  ]);
};

// Método estático para obtener materiales con stock bajo
costeMaterialSchema.statics.obtenerStockBajo = function(sede = null) {
  const query = { 
    estado: 'activo',
    'alertas.stockBajo': true
  };
  
  if (sede) query.sede = sede;
  
  return this.find(query)
    .populate('tratamiento', 'tratamiento categoria')
    .sort({ 'inventario.stockActual': 1 });
};

// Método estático para obtener próximos a caducar
costeMaterialSchema.statics.obtenerProximosCaducidad = function(dias = 30, sede = null) {
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() + dias);
  
  const query = {
    estado: 'activo',
    'lote.fechaCaducidad': { $lte: fechaLimite }
  };
  
  if (sede) query.sede = sede;
  
  return this.find(query)
    .populate('tratamiento', 'tratamiento categoria')
    .sort({ 'lote.fechaCaducidad': 1 });
};

// Método estático para optimización de inventario
costeMaterialSchema.statics.obtenerOptimizacionInventario = function(sede = null) {
  const query = { estado: 'activo' };
  if (sede) query.sede = sede;
  
  return this.aggregate([
    { $match: query },
    {
      $addFields: {
        rotacionAnual: {
          $cond: {
            if: { $gt: ['$inventario.stockActual', 0] },
            then: { $divide: [{ $multiply: ['$consumo.promedioMensual', 12] }, '$inventario.stockActual'] },
            else: 0
          }
        },
        valorInventario: { $multiply: ['$inventario.stockActual', '$precioUnitario'] }
      }
    },
    {
      $project: {
        material: 1,
        categoria: 1,
        stockActual: '$inventario.stockActual',
        stockOptimo: {
          $cond: {
            if: { $gt: ['$consumo.promedioMensual', 0] },
            then: { $multiply: ['$consumo.promedioMensual', 3] }, // 3 meses de stock
            else: '$inventario.stockMinimo'
          }
        },
        rotacionAnual: 1,
        valorInventario: 1,
        recomendacion: {
          $switch: {
            branches: [
              { case: { $lt: ['$rotacionAnual', 2] }, then: 'Reducir stock - Baja rotación' },
              { case: { $gt: ['$rotacionAnual', 12] }, then: 'Aumentar stock - Alta rotación' },
              { case: { $eq: ['$inventario.stockActual', 0] }, then: 'Stock agotado - Reabastecer urgente' }
            ],
            default: 'Stock óptimo'
          }
        }
      }
    },
    { $sort: { valorInventario: -1 } }
  ]);
};

module.exports = mongoose.model('CosteMaterial', costeMaterialSchema);