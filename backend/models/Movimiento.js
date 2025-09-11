const mongoose = require('mongoose');

const movimientoSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: [true, 'La fecha es obligatoria'],
    default: Date.now
  },
  
  tipo: {
    type: String,
    required: [true, 'El tipo es obligatorio'],
    enum: ['ingreso', 'gasto']
  },
  
  concepto: {
    type: String,
    required: [true, 'El concepto es obligatorio'],
    trim: true,
    maxlength: [200, 'El concepto no puede exceder 200 caracteres']
  },
  
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: {
      values: ['Servicios', 'Productos', 'Suministros', 'Administración', 'Mantenimiento', 'Otros'],
      message: 'Categoría no válida'
    }
  },
  
  importe: {
    type: Number,
    required: [true, 'El importe es obligatorio'],
    min: [0.01, 'El importe debe ser mayor a 0']
  },
  
  metodoPago: {
    type: String,
    required: [true, 'El método de pago es obligatorio'],
    enum: {
      values: ['Efectivo', 'Tarjeta', 'Transferencia', 'Bizum', 'Financiación'],
      message: 'Método de pago no válido'
    }
  },
  
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: function() {
      return this.tipo === 'ingreso' && this.categoria === 'Servicios';
    }
  },
  
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  
  numeroRecibo: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    match: [/^R-\d{4}-\d{3,6}$/, 'Formato de número de recibo inválido (R-YYYY-NNN)']
  },
  
  numeroFactura: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    match: [/^F-\d{4}-\d{3,6}$/, 'Formato de número de factura inválido (F-YYYY-NNN)']
  },
  
  sede: {
    type: String,
    enum: ['centro', 'norte', 'sur', 'este', 'oeste'],
    required: [true, 'La sede es obligatoria']
  },
  
  usuarioResponsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario responsable es obligatorio']
  },
  
  arqueo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ArqueoCaja'
  },
  
  documentos: [{
    tipo: {
      type: String,
      enum: ['recibo', 'factura', 'ticket', 'justificante', 'otro']
    },
    url: String,
    nombre: String,
    fechaSubida: {
      type: Date,
      default: Date.now
    }
  }],
  
  estado: {
    type: String,
    enum: ['pendiente', 'procesado', 'anulado'],
    default: 'procesado'
  },
  
  notas: {
    type: String,
    maxlength: [1000, 'Las notas no pueden exceder 1000 caracteres']
  },
  
  motivoAnulacion: {
    type: String,
    required: function() {
      return this.estado === 'anulado';
    },
    maxlength: [500, 'El motivo de anulación no puede exceder 500 caracteres']
  },
  
  fechaAnulacion: {
    type: Date,
    required: function() {
      return this.estado === 'anulado';
    }
  },
  
  usuarioAnulacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.estado === 'anulado';
    }
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
movimientoSchema.index({ fecha: -1, sede: 1 });
movimientoSchema.index({ tipo: 1, categoria: 1 });
movimientoSchema.index({ paciente: 1 }, { sparse: true });
movimientoSchema.index({ numeroRecibo: 1 }, { sparse: true });
movimientoSchema.index({ numeroFactura: 1 }, { sparse: true });
movimientoSchema.index({ estado: 1 });
movimientoSchema.index({ usuarioResponsable: 1 });
movimientoSchema.index({ arqueo: 1 }, { sparse: true });

// Virtual para el nombre del paciente
movimientoSchema.virtual('nombrePaciente').get(function() {
  return this.paciente ? `${this.paciente.nombre} ${this.paciente.apellidos}` : null;
});

// Middleware pre-save para generar números de recibo/factura
movimientoSchema.pre('save', async function(next) {
  try {
    if (this.isNew && this.tipo === 'ingreso' && !this.numeroRecibo) {
      const year = new Date().getFullYear();
      const count = await mongoose.model('Movimiento').countDocuments({
        tipo: 'ingreso',
        createdAt: {
          $gte: new Date(year, 0, 1),
          $lt: new Date(year + 1, 0, 1)
        }
      });
      this.numeroRecibo = `R-${year}-${String(count + 1).padStart(3, '0')}`;
    }

    this.actualizadoPor = this.usuarioResponsable;
    next();
  } catch (error) {
    next(error);
  }
});

// Método para anular movimiento
movimientoSchema.methods.anular = function(motivo, usuarioId) {
  this.estado = 'anulado';
  this.motivoAnulacion = motivo;
  this.fechaAnulacion = Date.now();
  this.usuarioAnulacion = usuarioId;
  this.actualizadoPor = usuarioId;
  
  return this.save();
};

// Método estático para obtener resumen por fecha
movimientoSchema.statics.obtenerResumenPorFecha = function(fecha, sede = null) {
  const query = {
    fecha: {
      $gte: new Date(fecha),
      $lt: new Date(new Date(fecha).getTime() + 24 * 60 * 60 * 1000)
    },
    estado: { $ne: 'anulado' }
  };

  if (sede) query.sede = sede;

  return this.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$tipo',
        total: { $sum: '$importe' },
        cantidad: { $sum: 1 },
        movimientos: { $push: '$$ROOT' }
      }
    }
  ]);
};

// Método estático para obtener movimientos por rango de fechas
movimientoSchema.statics.obtenerMovimientosPorRango = function(fechaInicio, fechaFin, sede = null, tipo = null) {
  const query = {
    fecha: {
      $gte: new Date(fechaInicio),
      $lte: new Date(fechaFin)
    },
    estado: { $ne: 'anulado' }
  };

  if (sede) query.sede = sede;
  if (tipo) query.tipo = tipo;

  return this.find(query)
    .populate('paciente', 'nombre apellidos')
    .populate('usuarioResponsable', 'nombre apellidos')
    .sort({ fecha: -1 });
};

// Método estático para buscar movimientos
movimientoSchema.statics.buscarMovimientos = function(termino, sede = null, fechaInicio = null, fechaFin = null) {
  const query = {
    $or: [
      { concepto: { $regex: termino, $options: 'i' } },
      { descripcion: { $regex: termino, $options: 'i' } },
      { numeroRecibo: { $regex: termino, $options: 'i' } },
      { numeroFactura: { $regex: termino, $options: 'i' } }
    ],
    estado: { $ne: 'anulado' }
  };

  if (sede) query.sede = sede;
  if (fechaInicio && fechaFin) {
    query.fecha = {
      $gte: new Date(fechaInicio),
      $lte: new Date(fechaFin)
    };
  }

  return this.find(query)
    .populate('paciente', 'nombre apellidos')
    .populate('usuarioResponsable', 'nombre apellidos')
    .sort({ fecha: -1 });
};

// Método para validar categoría según tipo
movimientoSchema.methods.validarCategoria = function() {
  const categoriasIngreso = ['Servicios', 'Productos', 'Otros'];
  const categoriasGasto = ['Suministros', 'Administración', 'Mantenimiento', 'Otros'];
  
  if (this.tipo === 'ingreso' && !categoriasIngreso.includes(this.categoria)) {
    throw new Error('Categoría no válida para ingresos');
  }
  
  if (this.tipo === 'gasto' && !categoriasGasto.includes(this.categoria)) {
    throw new Error('Categoría no válida para gastos');
  }
  
  return true;
};

// Hook pre-validación
movimientoSchema.pre('validate', function() {
  this.validarCategoria();
});

module.exports = mongoose.model('Movimiento', movimientoSchema);