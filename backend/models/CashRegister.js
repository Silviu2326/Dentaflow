const mongoose = require('mongoose');

const cashMovementSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['ingreso', 'gasto', 'apertura', 'cierre'],
    required: [true, 'El tipo de movimiento es obligatorio']
  },
  concepto: {
    type: String,
    required: [true, 'El concepto es obligatorio'],
    trim: true,
    maxlength: [200, 'El concepto no puede exceder 200 caracteres']
  },
  importe: {
    type: Number,
    required: [true, 'El importe es obligatorio']
  },
  metodoPago: {
    type: String,
    enum: ['efectivo', 'tarjeta', 'transferencia', 'cheque', 'bizum'],
    required: [true, 'El método de pago es obligatorio']
  },
  // Referencias
  reciboId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Receipt'
  },
  facturaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  // Información adicional
  observaciones: {
    type: String,
    maxlength: [500, 'Las observaciones no pueden exceder 500 caracteres']
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const cashRegisterSchema = new mongoose.Schema({
  // Información básica
  fecha: {
    type: Date,
    required: [true, 'La fecha es obligatoria'],
    unique: true
  },
  // Estados de la caja
  estado: {
    type: String,
    enum: ['abierta', 'cerrada', 'arqueo'],
    default: 'abierta'
  },
  // Información de apertura
  apertura: {
    fecha: {
      type: Date,
      required: [true, 'La fecha de apertura es obligatoria']
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario de apertura es obligatorio']
    },
    importeInicial: {
      type: Number,
      required: [true, 'El importe inicial es obligatorio'],
      default: 0,
      min: [0, 'El importe inicial no puede ser negativo']
    },
    observaciones: {
      type: String,
      maxlength: [500, 'Las observaciones no pueden exceder 500 caracteres']
    }
  },
  // Información de cierre
  cierre: {
    fecha: Date,
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    importeFinal: {
      type: Number,
      min: [0, 'El importe final no puede ser negativo']
    },
    observaciones: String,
    // Conteo físico de dinero
    conteoFisico: {
      billetes: {
        b500: { type: Number, default: 0 },
        b200: { type: Number, default: 0 },
        b100: { type: Number, default: 0 },
        b50: { type: Number, default: 0 },
        b20: { type: Number, default: 0 },
        b10: { type: Number, default: 0 },
        b5: { type: Number, default: 0 }
      },
      monedas: {
        m2: { type: Number, default: 0 },
        m1: { type: Number, default: 0 },
        c50: { type: Number, default: 0 },
        c20: { type: Number, default: 0 },
        c10: { type: Number, default: 0 },
        c5: { type: Number, default: 0 },
        c2: { type: Number, default: 0 },
        c1: { type: Number, default: 0 }
      },
      totalContado: {
        type: Number,
        default: 0
      }
    },
    diferencia: {
      type: Number,
      default: 0
    }
  },
  // Movimientos de la caja
  movimientos: [cashMovementSchema],
  // Resumen por método de pago
  resumenPagos: {
    efectivo: { type: Number, default: 0 },
    tarjeta: { type: Number, default: 0 },
    transferencia: { type: Number, default: 0 },
    cheque: { type: Number, default: 0 },
    bizum: { type: Number, default: 0 }
  },
  // Totales calculados
  totales: {
    ingresos: { type: Number, default: 0 },
    gastos: { type: Number, default: 0 },
    saldoTeorico: { type: Number, default: 0 },
    saldoReal: { type: Number, default: 0 }
  },
  // Información de turno
  turno: {
    type: String,
    enum: ['mañana', 'tarde', 'noche', 'completo'],
    default: 'completo'
  },
  responsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El responsable es obligatorio']
  },
  // Auditoría
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
cashRegisterSchema.index({ fecha: -1 });
cashRegisterSchema.index({ estado: 1, fecha: -1 });
cashRegisterSchema.index({ responsable: 1, fecha: -1 });
cashRegisterSchema.index({ 'apertura.usuario': 1 });
cashRegisterSchema.index({ 'cierre.usuario': 1 });

// Virtual para verificar si está abierta
cashRegisterSchema.virtual('estaAbierta').get(function() {
  return this.estado === 'abierta';
});

// Virtual para calcular duración
cashRegisterSchema.virtual('duracion').get(function() {
  if (!this.cierre.fecha) return null;
  const diferencia = this.cierre.fecha - this.apertura.fecha;
  const horas = Math.floor(diferencia / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  return `${horas}h ${minutos}m`;
});

// Middleware pre-save para calcular totales
cashRegisterSchema.pre('save', function(next) {
  // Calcular totales de movimientos
  const ingresos = this.movimientos
    .filter(m => m.tipo === 'ingreso')
    .reduce((sum, m) => sum + m.importe, 0);
    
  const gastos = this.movimientos
    .filter(m => m.tipo === 'gasto')
    .reduce((sum, m) => sum + Math.abs(m.importe), 0);
  
  this.totales.ingresos = ingresos;
  this.totales.gastos = gastos;
  this.totales.saldoTeorico = this.apertura.importeInicial + ingresos - gastos;
  
  // Calcular resumen por método de pago
  const metodos = ['efectivo', 'tarjeta', 'transferencia', 'cheque', 'bizum'];
  metodos.forEach(metodo => {
    this.resumenPagos[metodo] = this.movimientos
      .filter(m => m.metodoPago === metodo && m.tipo === 'ingreso')
      .reduce((sum, m) => sum + m.importe, 0);
  });
  
  // Calcular saldo real si hay conteo físico
  if (this.cierre.conteoFisico) {
    const billetes = this.cierre.conteoFisico.billetes;
    const monedas = this.cierre.conteoFisico.monedas;
    
    const totalBilletes = 
      (billetes.b500 * 500) +
      (billetes.b200 * 200) +
      (billetes.b100 * 100) +
      (billetes.b50 * 50) +
      (billetes.b20 * 20) +
      (billetes.b10 * 10) +
      (billetes.b5 * 5);
    
    const totalMonedas = 
      (monedas.m2 * 2) +
      (monedas.m1 * 1) +
      (monedas.c50 * 0.5) +
      (monedas.c20 * 0.2) +
      (monedas.c10 * 0.1) +
      (monedas.c5 * 0.05) +
      (monedas.c2 * 0.02) +
      (monedas.c1 * 0.01);
    
    this.cierre.conteoFisico.totalContado = totalBilletes + totalMonedas;
    this.totales.saldoReal = this.cierre.conteoFisico.totalContado;
    this.cierre.diferencia = this.totales.saldoReal - this.totales.saldoTeorico;
  }
  
  this.fechaActualizacion = Date.now();
  next();
});

// Método para abrir caja
cashRegisterSchema.statics.abrirCaja = async function(fecha, usuarioId, importeInicial = 0, observaciones = '') {
  const fechaNormalizada = new Date(fecha);
  fechaNormalizada.setHours(0, 0, 0, 0);
  
  // Verificar si ya existe caja para esta fecha
  const cajaExistente = await this.findOne({ fecha: fechaNormalizada });
  if (cajaExistente) {
    throw new Error('Ya existe una caja para esta fecha');
  }
  
  const caja = new this({
    fecha: fechaNormalizada,
    apertura: {
      fecha: new Date(),
      usuario: usuarioId,
      importeInicial,
      observaciones
    },
    responsable: usuarioId
  });
  
  // Agregar movimiento de apertura si hay importe inicial
  if (importeInicial > 0) {
    caja.movimientos.push({
      tipo: 'apertura',
      concepto: 'Apertura de caja',
      importe: importeInicial,
      metodoPago: 'efectivo',
      creadoPor: usuarioId
    });
  }
  
  return caja.save();
};

// Método para cerrar caja
cashRegisterSchema.methods.cerrarCaja = function(usuarioId, conteoFisico = null, observaciones = '') {
  if (this.estado !== 'abierta') {
    throw new Error('La caja no está abierta');
  }
  
  this.estado = 'cerrada';
  this.cierre = {
    fecha: new Date(),
    usuario: usuarioId,
    observaciones,
    conteoFisico: conteoFisico || {
      billetes: {},
      monedas: {},
      totalContado: this.totales.saldoTeorico
    }
  };
  
  return this.save();
};

// Método para agregar movimiento
cashRegisterSchema.methods.agregarMovimiento = function(movimiento) {
  if (this.estado !== 'abierta') {
    throw new Error('La caja no está abierta');
  }
  
  this.movimientos.push({
    ...movimiento,
    fecha: new Date()
  });
  
  return this.save();
};

// Método para obtener caja del día
cashRegisterSchema.statics.obtenerCajaDelDia = function(fecha = new Date()) {
  const fechaNormalizada = new Date(fecha);
  fechaNormalizada.setHours(0, 0, 0, 0);
  
  return this.findOne({ fecha: fechaNormalizada })
    .populate('responsable', 'nombre apellidos')
    .populate('apertura.usuario', 'nombre apellidos')
    .populate('cierre.usuario', 'nombre apellidos')
    .populate('movimientos.creadoPor', 'nombre apellidos');
};

// Método estático para obtener estadísticas
cashRegisterSchema.statics.obtenerEstadisticas = async function(fechaDesde, fechaHasta) {
  const filtroFecha = {};
  if (fechaDesde) filtroFecha.$gte = new Date(fechaDesde);
  if (fechaHasta) filtroFecha.$lte = new Date(fechaHasta);
  
  const filtro = filtroFecha ? { fecha: filtroFecha } : {};
  
  const stats = await this.aggregate([
    { $match: filtro },
    {
      $group: {
        _id: null,
        totalDias: { $sum: 1 },
        ingresoTotal: { $sum: '$totales.ingresos' },
        gastoTotal: { $sum: '$totales.gastos' },
        efectivoTotal: { $sum: '$resumenPagos.efectivo' },
        tarjetaTotal: { $sum: '$resumenPagos.tarjeta' },
        transferenciaTotal: { $sum: '$resumenPagos.transferencia' },
        promedioIngresosDiarios: { $avg: '$totales.ingresos' },
        diasConDiferencias: {
          $sum: {
            $cond: [
              { $ne: ['$cierre.diferencia', 0] },
              1,
              0
            ]
          }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalDias: 0,
    ingresoTotal: 0,
    gastoTotal: 0,
    efectivoTotal: 0,
    tarjetaTotal: 0,
    transferenciaTotal: 0,
    promedioIngresosDiarios: 0,
    diasConDiferencias: 0
  };
};

// Método para información básica
cashRegisterSchema.methods.toInfoBasica = function() {
  return {
    id: this._id,
    fecha: this.fecha,
    estado: this.estado,
    totales: this.totales,
    resumenPagos: this.resumenPagos,
    apertura: {
      fecha: this.apertura.fecha,
      importeInicial: this.apertura.importeInicial
    },
    cierre: this.cierre.fecha ? {
      fecha: this.cierre.fecha,
      diferencia: this.cierre.diferencia
    } : null
  };
};

module.exports = mongoose.model('CashRegister', cashRegisterSchema);