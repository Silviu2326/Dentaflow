const mongoose = require('mongoose');

const arqueoCajaSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: [true, 'La fecha es obligatoria'],
    default: Date.now
  },
  
  fechaCierre: {
    type: Date,
    required: function() {
      return this.estado === 'cerrada';
    }
  },
  
  saldoInicial: {
    type: Number,
    required: [true, 'El saldo inicial es obligatorio'],
    min: [0, 'El saldo inicial no puede ser negativo'],
    default: 0
  },
  
  totalIngresos: {
    type: Number,
    required: [true, 'El total de ingresos es obligatorio'],
    min: [0, 'El total de ingresos no puede ser negativo'],
    default: 0
  },
  
  totalGastos: {
    type: Number,
    required: [true, 'El total de gastos es obligatorio'],
    min: [0, 'El total de gastos no puede ser negativo'],
    default: 0
  },
  
  saldoTeorico: {
    type: Number,
    required: [true, 'El saldo teórico es obligatorio']
  },
  
  saldoReal: {
    type: Number,
    required: function() {
      return this.estado === 'cerrada';
    },
    default: 0
  },
  
  diferencia: {
    type: Number,
    default: 0
  },
  
  estado: {
    type: String,
    enum: ['abierta', 'cerrada'],
    default: 'abierta',
    required: true
  },
  
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio']
  },
  
  usuarioCierre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.estado === 'cerrada';
    }
  },
  
  sede: {
    type: String,
    enum: ['centro', 'norte', 'sur', 'este', 'oeste'],
    required: [true, 'La sede es obligatoria']
  },
  
  observaciones: {
    type: String,
    maxlength: [1000, 'Las observaciones no pueden exceder 1000 caracteres']
  },
  
  desglose: {
    billetes: {
      b500: { type: Number, default: 0, min: 0 },
      b200: { type: Number, default: 0, min: 0 },
      b100: { type: Number, default: 0, min: 0 },
      b50: { type: Number, default: 0, min: 0 },
      b20: { type: Number, default: 0, min: 0 },
      b10: { type: Number, default: 0, min: 0 },
      b5: { type: Number, default: 0, min: 0 }
    },
    monedas: {
      m2: { type: Number, default: 0, min: 0 },
      m1: { type: Number, default: 0, min: 0 },
      c50: { type: Number, default: 0, min: 0 },
      c20: { type: Number, default: 0, min: 0 },
      c10: { type: Number, default: 0, min: 0 },
      c5: { type: Number, default: 0, min: 0 },
      c2: { type: Number, default: 0, min: 0 },
      c1: { type: Number, default: 0, min: 0 }
    }
  },
  
  movimientos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movimiento'
  }],
  
  totalEfectivo: {
    type: Number,
    default: 0
  },
  
  totalTarjeta: {
    type: Number,
    default: 0
  },
  
  totalTransferencia: {
    type: Number,
    default: 0
  },
  
  totalBizum: {
    type: Number,
    default: 0
  },
  
  totalFinanciacion: {
    type: Number,
    default: 0
  },
  
  documentos: [{
    tipo: {
      type: String,
      enum: ['arqueo', 'cierre', 'incidencia', 'justificante']
    },
    url: String,
    nombre: String,
    fechaSubida: {
      type: Date,
      default: Date.now
    }
  }],
  
  incidencias: [{
    tipo: {
      type: String,
      enum: ['diferencia', 'faltante', 'sobrante', 'error_sistema', 'otro']
    },
    descripcion: String,
    importe: Number,
    fecha: {
      type: Date,
      default: Date.now
    },
    resuelto: {
      type: Boolean,
      default: false
    },
    fechaResolucion: Date,
    solucion: String
  }],
  
  historialCambios: [{
    fecha: {
      type: Date,
      default: Date.now
    },
    accion: String,
    valorAnterior: String,
    valorNuevo: String,
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
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
arqueoCajaSchema.index({ fecha: -1, sede: 1 });
arqueoCajaSchema.index({ estado: 1, sede: 1 });
arqueoCajaSchema.index({ usuario: 1 });
arqueoCajaSchema.index({ fechaCierre: -1 }, { sparse: true });

// Virtual para calcular el total de efectivo del desglose
arqueoCajaSchema.virtual('totalEfectivoDesglose').get(function() {
  if (!this.desglose) return 0;
  
  const billetes = this.desglose.billetes || {};
  const monedas = this.desglose.monedas || {};
  
  const totalBilletes = 
    (billetes.b500 || 0) * 500 +
    (billetes.b200 || 0) * 200 +
    (billetes.b100 || 0) * 100 +
    (billetes.b50 || 0) * 50 +
    (billetes.b20 || 0) * 20 +
    (billetes.b10 || 0) * 10 +
    (billetes.b5 || 0) * 5;
  
  const totalMonedas = 
    (monedas.m2 || 0) * 2 +
    (monedas.m1 || 0) * 1 +
    (monedas.c50 || 0) * 0.5 +
    (monedas.c20 || 0) * 0.2 +
    (monedas.c10 || 0) * 0.1 +
    (monedas.c5 || 0) * 0.05 +
    (monedas.c2 || 0) * 0.02 +
    (monedas.c1 || 0) * 0.01;
  
  return Math.round((totalBilletes + totalMonedas) * 100) / 100;
});

// Virtual para verificar si tiene incidencias sin resolver
arqueoCajaSchema.virtual('tieneIncidenciasPendientes').get(function() {
  return this.incidencias && this.incidencias.some(inc => !inc.resuelto);
});

// Virtual para el nombre del usuario
arqueoCajaSchema.virtual('nombreUsuario').get(function() {
  return this.usuario ? `${this.usuario.nombre} ${this.usuario.apellidos}` : null;
});

// Middleware pre-save para cálculos automáticos
arqueoCajaSchema.pre('save', async function(next) {
  try {
    // Calcular saldo teórico
    this.saldoTeorico = this.saldoInicial + this.totalIngresos - this.totalGastos;
    
    // Calcular diferencia si está cerrada
    if (this.estado === 'cerrada' && this.saldoReal !== undefined) {
      this.diferencia = this.saldoReal - this.saldoTeorico;
    }
    
    // Actualizar usuario que modifica
    if (!this.isNew) {
      this.actualizadoPor = this.usuario;
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Método para cerrar caja
arqueoCajaSchema.methods.cerrarCaja = function(saldoReal, usuarioId, observaciones = null, desglose = null) {
  this.estado = 'cerrada';
  this.fechaCierre = Date.now();
  this.saldoReal = saldoReal;
  this.diferencia = saldoReal - this.saldoTeorico;
  this.usuarioCierre = usuarioId;
  this.actualizadoPor = usuarioId;
  
  if (observaciones) {
    this.observaciones = observaciones;
  }
  
  if (desglose) {
    this.desglose = desglose;
  }
  
  // Registrar cambio en historial
  this.historialCambios.push({
    accion: 'Cierre de caja',
    valorAnterior: 'abierta',
    valorNuevo: 'cerrada',
    usuario: usuarioId
  });
  
  return this.save();
};

// Método para reabrir caja
arqueoCajaSchema.methods.reabrirCaja = function(usuarioId, motivo) {
  this.estado = 'abierta';
  this.fechaCierre = undefined;
  this.usuarioCierre = undefined;
  this.saldoReal = 0;
  this.diferencia = 0;
  this.actualizadoPor = usuarioId;
  
  // Registrar cambio en historial
  this.historialCambios.push({
    accion: 'Reapertura de caja',
    valorAnterior: 'cerrada',
    valorNuevo: 'abierta',
    usuario: usuarioId
  });
  
  // Agregar incidencia
  this.incidencias.push({
    tipo: 'otro',
    descripcion: `Caja reabierta: ${motivo}`,
    fecha: Date.now()
  });
  
  return this.save();
};

// Método para agregar movimiento
arqueoCajaSchema.methods.agregarMovimiento = function(movimientoId, tipo, importe, metodoPago) {
  if (!this.movimientos.includes(movimientoId)) {
    this.movimientos.push(movimientoId);
  }
  
  // Actualizar totales
  if (tipo === 'ingreso') {
    this.totalIngresos += importe;
  } else {
    this.totalGastos += importe;
  }
  
  // Actualizar totales por método de pago
  switch (metodoPago) {
    case 'Efectivo':
      this.totalEfectivo += importe;
      break;
    case 'Tarjeta':
      this.totalTarjeta += importe;
      break;
    case 'Transferencia':
      this.totalTransferencia += importe;
      break;
    case 'Bizum':
      this.totalBizum += importe;
      break;
    case 'Financiación':
      this.totalFinanciacion += importe;
      break;
  }
  
  return this.save();
};

// Método para agregar incidencia
arqueoCajaSchema.methods.agregarIncidencia = function(tipo, descripcion, importe = null) {
  this.incidencias.push({
    tipo,
    descripcion,
    importe,
    fecha: Date.now()
  });
  
  return this.save();
};

// Método para resolver incidencia
arqueoCajaSchema.methods.resolverIncidencia = function(incidenciaId, solucion, usuarioId) {
  const incidencia = this.incidencias.id(incidenciaId);
  if (!incidencia) {
    throw new Error('Incidencia no encontrada');
  }
  
  incidencia.resuelto = true;
  incidencia.fechaResolucion = Date.now();
  incidencia.solucion = solucion;
  
  // Registrar en historial
  this.historialCambios.push({
    accion: 'Resolución de incidencia',
    valorAnterior: 'pendiente',
    valorNuevo: 'resuelto',
    usuario: usuarioId
  });
  
  return this.save();
};

// Método estático para obtener arqueo activo por sede
arqueoCajaSchema.statics.obtenerArqueoActivo = function(sede) {
  return this.findOne({
    sede,
    estado: 'abierta'
  }).populate('usuario', 'nombre apellidos').populate('movimientos');
};

// Método estático para obtener último saldo cerrado
arqueoCajaSchema.statics.obtenerUltimoSaldoCerrado = function(sede) {
  return this.findOne({
    sede,
    estado: 'cerrada'
  }).sort({ fechaCierre: -1 });
};

// Método estático para obtener resumen por rango de fechas
arqueoCajaSchema.statics.obtenerResumenPorRango = function(fechaInicio, fechaFin, sede = null) {
  const query = {
    fecha: {
      $gte: new Date(fechaInicio),
      $lte: new Date(fechaFin)
    }
  };

  if (sede) query.sede = sede;

  return this.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$sede',
        totalIngresos: { $sum: '$totalIngresos' },
        totalGastos: { $sum: '$totalGastos' },
        totalDiferencias: { $sum: '$diferencia' },
        cantidadArqueos: { $sum: 1 },
        arqueosAbiertos: {
          $sum: { $cond: [{ $eq: ['$estado', 'abierta'] }, 1, 0] }
        }
      }
    }
  ]);
};

// Método para validar estado antes de operaciones críticas
arqueoCajaSchema.methods.validarEstadoParaOperacion = function() {
  if (this.estado === 'cerrada') {
    throw new Error('No se pueden realizar operaciones en una caja cerrada');
  }
  return true;
};

// Hook pre-validación
arqueoCajaSchema.pre('validate', function() {
  // Validar que solo haya una caja abierta por sede por día
  if (this.estado === 'abierta' && this.isNew) {
    return mongoose.model('ArqueoCaja').findOne({
      sede: this.sede,
      estado: 'abierta',
      fecha: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    }).then(arqueoExistente => {
      if (arqueoExistente) {
        throw new Error('Ya existe una caja abierta para esta sede en la fecha actual');
      }
    });
  }
});

module.exports = mongoose.model('ArqueoCaja', arqueoCajaSchema);