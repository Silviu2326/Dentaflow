const mongoose = require('mongoose');

const costeTratamientoSchema = new mongoose.Schema({
  tratamiento: {
    type: String,
    required: [true, 'El nombre del tratamiento es obligatorio'],
    trim: true,
    maxlength: [200, 'El nombre del tratamiento no puede exceder 200 caracteres']
  },
  
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: {
      values: ['Endodoncia', 'Implantología', 'Preventiva', 'Prótesis', 'Ortodoncia', 'Cirugía', 'Estética', 'Periodoncia', 'Otros'],
      message: 'Categoría no válida'
    }
  },
  
  duracionMinutos: {
    type: Number,
    required: [true, 'La duración en minutos es obligatoria'],
    min: [5, 'La duración mínima es 5 minutos'],
    max: [480, 'La duración máxima es 8 horas (480 minutos)']
  },
  
  costeMaterial: {
    type: Number,
    required: [true, 'El coste del material es obligatorio'],
    min: [0, 'El coste del material no puede ser negativo']
  },
  
  costeManoObra: {
    type: Number,
    required: [true, 'El coste de mano de obra es obligatorio'],
    min: [0, 'El coste de mano de obra no puede ser negativo']
  },
  
  costeTotal: {
    type: Number,
    required: true
  },
  
  precioVenta: {
    type: Number,
    required: [true, 'El precio de venta es obligatorio'],
    min: [0, 'El precio de venta no puede ser negativo']
  },
  
  margen: {
    type: Number,
    required: true
  },
  
  margenPorcentaje: {
    type: Number,
    required: true,
    min: [0, 'El margen porcentaje no puede ser negativo'],
    max: [100, 'El margen porcentaje no puede exceder 100%']
  },
  
  profesionalPrincipal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El profesional principal es obligatorio']
  },
  
  sede: {
    type: String,
    enum: ['centro', 'norte', 'sur', 'este', 'oeste'],
    required: [true, 'La sede es obligatoria']
  },
  
  costesDetallados: {
    materialesPrincipales: [{
      material: String,
      cantidad: Number,
      precioUnitario: Number,
      costeTotal: Number
    }],
    tiempoDetallado: [{
      fase: String,
      minutos: Number,
      costePorMinuto: Number,
      costeTotal: Number
    }],
    equipamiento: [{
      equipo: String,
      tiempoUso: Number,
      costePorMinuto: Number,
      costeTotal: Number
    }],
    gastosIndirectos: {
      porcentaje: { type: Number, default: 0 },
      importe: { type: Number, default: 0 }
    }
  },
  
  estadisticas: {
    vecesRealizado: { type: Number, default: 0 },
    tiempoPromedioReal: Number,
    desviacionTiempo: Number,
    satisfaccionPaciente: { type: Number, min: 1, max: 5 },
    tasaExito: { type: Number, min: 0, max: 100 }
  },
  
  competencia: {
    precioMercado: Number,
    posicionCompetitiva: {
      type: String,
      enum: ['por_debajo', 'igual', 'por_encima']
    },
    ventajaCompetitiva: String
  },
  
  rentabilidad: {
    puntoEquilibrio: Number,
    contribucionMargen: Number,
    roiPorcentaje: Number
  },
  
  configuracion: {
    activo: { type: Boolean, default: true },
    requiereAprobacion: { type: Boolean, default: false },
    nivelComplejidad: {
      type: String,
      enum: ['basico', 'intermedio', 'avanzado', 'experto'],
      default: 'basico'
    }
  },
  
  historialCambios: [{
    fecha: { type: Date, default: Date.now },
    campo: String,
    valorAnterior: mongoose.Schema.Types.Mixed,
    valorNuevo: mongoose.Schema.Types.Mixed,
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    motivo: String
  }],
  
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
costeTratamientoSchema.index({ tratamiento: 1, sede: 1 });
costeTratamientoSchema.index({ categoria: 1 });
costeTratamientoSchema.index({ profesionalPrincipal: 1 });
costeTratamientoSchema.index({ margenPorcentaje: -1 });
costeTratamientoSchema.index({ precioVenta: -1 });
costeTratamientoSchema.index({ 'configuracion.activo': 1 });

// Virtual para el nombre del profesional
costeTratamientoSchema.virtual('nombreProfesional').get(function() {
  return this.profesionalPrincipal ? 
    `${this.profesionalPrincipal.nombre} ${this.profesionalPrincipal.apellidos}` : 
    null;
});

// Virtual para duración en formato legible
costeTratamientoSchema.virtual('duracionFormateada').get(function() {
  const horas = Math.floor(this.duracionMinutos / 60);
  const minutos = this.duracionMinutos % 60;
  
  if (horas === 0) return `${minutos} min`;
  if (minutos === 0) return `${horas}h`;
  return `${horas}h ${minutos}min`;
});

// Virtual para rentabilidad por minuto
costeTratamientoSchema.virtual('rentabilidadPorMinuto').get(function() {
  return this.duracionMinutos > 0 ? this.margen / this.duracionMinutos : 0;
});

// Middleware pre-save para calcular campos automáticos
costeTratamientoSchema.pre('save', function(next) {
  // Calcular coste total
  this.costeTotal = this.costeMaterial + this.costeManoObra;
  
  // Agregar gastos indirectos si están configurados
  if (this.costesDetallados && this.costesDetallados.gastosIndirectos) {
    if (this.costesDetallados.gastosIndirectos.porcentaje > 0) {
      const gastosIndirectos = this.costeTotal * (this.costesDetallados.gastosIndirectos.porcentaje / 100);
      this.costeTotal += gastosIndirectos;
      this.costesDetallados.gastosIndirectos.importe = gastosIndirectos;
    } else if (this.costesDetallados.gastosIndirectos.importe > 0) {
      this.costeTotal += this.costesDetallados.gastosIndirectos.importe;
    }
  }
  
  // Calcular margen
  this.margen = this.precioVenta - this.costeTotal;
  
  // Calcular margen porcentaje
  this.margenPorcentaje = this.precioVenta > 0 ? 
    (this.margen / this.precioVenta) * 100 : 0;
  
  // Calcular rentabilidad
  if (this.rentabilidad) {
    this.rentabilidad.contribucionMargen = this.margen;
    this.rentabilidad.roiPorcentaje = this.costeTotal > 0 ? 
      (this.margen / this.costeTotal) * 100 : 0;
  }
  
  // Actualizar usuario modificador
  if (!this.isNew) {
    this.actualizadoPor = this.creadoPor;
  }
  
  next();
});

// Método para agregar cambio al historial
costeTratamientoSchema.methods.registrarCambio = function(campo, valorAnterior, valorNuevo, usuarioId, motivo = null) {
  this.historialCambios.push({
    campo,
    valorAnterior,
    valorNuevo,
    usuario: usuarioId,
    motivo
  });
  
  return this.save();
};

// Método para actualizar estadísticas
costeTratamientoSchema.methods.actualizarEstadisticas = function(tiempoReal, satisfaccion = null, exito = true) {
  if (!this.estadisticas) {
    this.estadisticas = {};
  }
  
  this.estadisticas.vecesRealizado = (this.estadisticas.vecesRealizado || 0) + 1;
  
  // Actualizar tiempo promedio
  if (this.estadisticas.tiempoPromedioReal) {
    this.estadisticas.tiempoPromedioReal = 
      ((this.estadisticas.tiempoPromedioReal * (this.estadisticas.vecesRealizado - 1)) + tiempoReal) / 
      this.estadisticas.vecesRealizado;
  } else {
    this.estadisticas.tiempoPromedioReal = tiempoReal;
  }
  
  // Calcular desviación
  this.estadisticas.desviacionTiempo = 
    Math.abs(this.estadisticas.tiempoPromedioReal - this.duracionMinutos);
  
  // Actualizar satisfacción (promedio)
  if (satisfaccion) {
    if (this.estadisticas.satisfaccionPaciente) {
      this.estadisticas.satisfaccionPaciente = 
        ((this.estadisticas.satisfaccionPaciente * (this.estadisticas.vecesRealizado - 1)) + satisfaccion) / 
        this.estadisticas.vecesRealizado;
    } else {
      this.estadisticas.satisfaccionPaciente = satisfaccion;
    }
  }
  
  // Actualizar tasa de éxito
  const exitosAnteriores = this.estadisticas.tasaExito ? 
    Math.round((this.estadisticas.tasaExito / 100) * (this.estadisticas.vecesRealizado - 1)) : 0;
  const totalExitos = exitosAnteriores + (exito ? 1 : 0);
  this.estadisticas.tasaExito = (totalExitos / this.estadisticas.vecesRealizado) * 100;
  
  return this.save();
};

// Método estático para obtener análisis por categoría
costeTratamientoSchema.statics.obtenerAnalisisPorCategoria = function(sede = null, fechaInicio = null, fechaFin = null) {
  const query = { 'configuracion.activo': true };
  
  if (sede) query.sede = sede;
  if (fechaInicio && fechaFin) {
    query.updatedAt = {
      $gte: new Date(fechaInicio),
      $lte: new Date(fechaFin)
    };
  }
  
  return this.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$categoria',
        totalTratamientos: { $sum: 1 },
        promedioMargen: { $avg: '$margenPorcentaje' },
        promedioTiempo: { $avg: '$duracionMinutos' },
        totalIngresos: { $sum: '$precioVenta' },
        totalCostes: { $sum: '$costeTotal' },
        margenTotal: { $sum: '$margen' },
        tratamientoMasRentable: {
          $max: {
            tratamiento: '$tratamiento',
            margen: '$margenPorcentaje'
          }
        }
      }
    },
    { $sort: { totalIngresos: -1 } }
  ]);
};

// Método estático para buscar tratamientos
costeTratamientoSchema.statics.buscarTratamientos = function(termino, categoria = null, sede = null) {
  const query = {
    $or: [
      { tratamiento: { $regex: termino, $options: 'i' } },
      { categoria: { $regex: termino, $options: 'i' } }
    ],
    'configuracion.activo': true
  };
  
  if (categoria) query.categoria = categoria;
  if (sede) query.sede = sede;
  
  return this.find(query)
    .populate('profesionalPrincipal', 'nombre apellidos especialidad')
    .sort({ margenPorcentaje: -1 });
};

// Método para comparar con competencia
costeTratamientoSchema.methods.compararConCompetencia = function() {
  if (!this.competencia || !this.competencia.precioMercado) {
    return { posicion: 'sin_datos', diferencia: 0 };
  }
  
  const diferencia = this.precioVenta - this.competencia.precioMercado;
  const porcentajeDiferencia = (diferencia / this.competencia.precioMercado) * 100;
  
  let posicion;
  if (Math.abs(porcentajeDiferencia) <= 5) {
    posicion = 'competitivo';
  } else if (porcentajeDiferencia > 5) {
    posicion = 'premium';
  } else {
    posicion = 'economico';
  }
  
  return {
    posicion,
    diferencia,
    porcentajeDiferencia
  };
};

// Método estático para obtener tratamientos más rentables
costeTratamientoSchema.statics.obtenerMasRentables = function(limite = 10, sede = null) {
  const query = { 'configuracion.activo': true };
  if (sede) query.sede = sede;
  
  return this.find(query)
    .populate('profesionalPrincipal', 'nombre apellidos')
    .sort({ margenPorcentaje: -1 })
    .limit(limite);
};

module.exports = mongoose.model('CosteTratamiento', costeTratamientoSchema);