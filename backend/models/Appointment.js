const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  // Información del paciente
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'El paciente es obligatorio']
  },
  pacienteNombre: {
    type: String,
    required: [true, 'El nombre del paciente es obligatorio']
  },
  pacienteTelefono: {
    type: String,
    trim: true
  },
  pacienteEmail: {
    type: String,
    lowercase: true,
    trim: true
  },

  // Fecha y tiempo
  fecha: {
    type: Date,
    required: [true, 'La fecha es obligatoria']
  },
  horaInicio: {
    type: String,
    required: [true, 'La hora de inicio es obligatoria'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
  },
  horaFin: {
    type: String,
    required: [true, 'La hora de fin es obligatoria'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
  },
  duracion: {
    type: Number,
    required: [true, 'La duración es obligatoria'],
    enum: [15, 30, 45, 60, 90, 120, 150, 180],
    default: 60
  },

  // Tratamiento y profesional
  tratamiento: {
    type: String,
    required: [true, 'El tratamiento es obligatorio'],
    enum: [
      'limpieza',
      'revision',
      'endodoncia',
      'extraccion',
      'empaste',
      'blanqueamiento',
      'ortodoncia',
      'cirugia',
      'protesis',
      'implante',
      'periodoncia',
      'estetica',
      'urgencia',
      'evaluacion',
      'seguimiento',
      'otro'
    ]
  },
  tratamientoDescripcion: {
    type: String,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  
  profesional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El profesional es obligatorio']
  },
  profesionalNombre: {
    type: String,
    required: [true, 'El nombre del profesional es obligatorio']
  },

  // Sede
  sede: {
    type: String,
    required: [true, 'La sede es obligatoria'],
    enum: ['centro', 'norte', 'sur', 'este', 'oeste']
  },

  // Estado de la cita
  estado: {
    type: String,
    required: [true, 'El estado es obligatorio'],
    enum: [
      'programada',      // Cita confirmada
      'pendiente',       // Pendiente de confirmación
      'confirmada',      // Confirmada por el paciente
      'en_sala_espera',  // Paciente en sala de espera
      'en_consulta',     // En consulta actualmente
      'completada',      // Cita completada
      'cancelada',       // Cancelada
      'no_asistio',      // Paciente no asistió
      'reprogramada'     // Reprogramada para otra fecha
    ],
    default: 'pendiente'
  },

  // Detalles adicionales
  notas: {
    type: String,
    maxlength: [1000, 'Las notas no pueden exceder 1000 caracteres']
  },
  
  motivoCancelacion: {
    type: String,
    required: function() {
      return this.estado === 'cancelada';
    }
  },

  // Recordatorios
  recordatorioEnviado: {
    sms: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: false },
    fecha: Date
  },

  confirmacionEnviada: {
    type: Boolean,
    default: false
  },

  // Lista de espera y overbooking
  esListaEspera: {
    type: Boolean,
    default: false
  },
  
  esOverbooking: {
    type: Boolean,
    default: false
  },

  prioridad: {
    type: String,
    enum: ['baja', 'normal', 'alta', 'urgente'],
    default: 'normal'
  },

  // Información financiera
  costoEstimado: {
    type: Number,
    min: 0
  },
  
  presupuestoAsociado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget'
  },

  // Sala/Box asignado
  salaAsignada: {
    type: String,
    enum: ['sala1', 'sala2', 'sala3', 'sala4', 'sala5', 'box1', 'box2', 'box3']
  },

  // Historial de cambios
  historialCambios: [{
    fecha: {
      type: Date,
      default: Date.now
    },
    cambio: String,
    realizadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Cita recurrente
  esRecurrente: {
    type: Boolean,
    default: false
  },
  
  recurrencia: {
    tipo: {
      type: String,
      enum: ['diaria', 'semanal', 'quincenal', 'mensual']
    },
    diasSemana: [Number], // 0-6 (domingo-sábado)
    fechaFin: Date,
    citaOriginal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    }
  },

  // Tiempo de llegada y salida
  horaLlegada: String,
  horaSalida: String,
  tiempoEspera: Number, // en minutos

  // Fuente de la cita
  origen: {
    type: String,
    enum: ['presencial', 'telefono', 'web', 'app', 'whatsapp', 'email', 'portal_paciente'],
    default: 'presencial'
  },

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
appointmentSchema.index({ fecha: 1, sede: 1 });
appointmentSchema.index({ profesional: 1, fecha: 1 });
appointmentSchema.index({ paciente: 1 });
appointmentSchema.index({ estado: 1 });
appointmentSchema.index({ sede: 1, fecha: 1, horaInicio: 1 });

// Virtual para fecha y hora completa
appointmentSchema.virtual('fechaHoraCompleta').get(function() {
  if (this.fecha && this.horaInicio) {
    const fecha = new Date(this.fecha);
    const [hora, minutos] = this.horaInicio.split(':');
    fecha.setHours(parseInt(hora), parseInt(minutos));
    return fecha;
  }
  return null;
});

// Virtual para verificar si está atrasada
appointmentSchema.virtual('estaAtrasada').get(function() {
  if (this.estado === 'programada' || this.estado === 'confirmada') {
    const ahora = new Date();
    const fechaCita = this.fechaHoraCompleta;
    return fechaCita && fechaCita < ahora;
  }
  return false;
});

// Middleware pre-save para calcular hora fin
appointmentSchema.pre('save', function(next) {
  if (this.isModified('horaInicio') || this.isModified('duracion')) {
    const [hora, minutos] = this.horaInicio.split(':').map(Number);
    const totalMinutos = hora * 60 + minutos + this.duracion;
    const horaFin = Math.floor(totalMinutos / 60);
    const minutosFin = totalMinutos % 60;
    this.horaFin = `${String(horaFin).padStart(2, '0')}:${String(minutosFin).padStart(2, '0')}`;
  }

  // Actualizar fecha de modificación
  this.fechaActualizacion = Date.now();

  next();
});

// Método para verificar disponibilidad
appointmentSchema.statics.verificarDisponibilidad = async function(fecha, horaInicio, horaFin, profesional, sede, excludeId = null) {
  const query = {
    fecha,
    profesional,
    sede,
    estado: { $nin: ['cancelada', 'no_asistio'] },
    $or: [
      // Nueva cita empieza durante una existente
      { horaInicio: { $lte: horaInicio }, horaFin: { $gt: horaInicio } },
      // Nueva cita termina durante una existente
      { horaInicio: { $lt: horaFin }, horaFin: { $gte: horaFin } },
      // Nueva cita engloba una existente
      { horaInicio: { $gte: horaInicio }, horaFin: { $lte: horaFin } }
    ]
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const conflictos = await this.find(query);
  return conflictos.length === 0;
};

// Método para obtener citas del día
appointmentSchema.statics.obtenerCitasDelDia = function(fecha, sede = null, profesional = null) {
  const inicioDelDia = new Date(fecha);
  inicioDelDia.setHours(0, 0, 0, 0);
  
  const finDelDia = new Date(fecha);
  finDelDia.setHours(23, 59, 59, 999);

  const query = {
    fecha: {
      $gte: inicioDelDia,
      $lte: finDelDia
    }
  };

  if (sede) query.sede = sede;
  if (profesional) query.profesional = profesional;

  return this.find(query)
    .populate('paciente', 'nombre apellidos telefono email')
    .populate('profesional', 'nombre apellidos especialidad')
    .sort({ horaInicio: 1 });
};

// Método para cancelar cita
appointmentSchema.methods.cancelar = function(motivo, usuarioId) {
  this.estado = 'cancelada';
  this.motivoCancelacion = motivo;
  this.actualizadoPor = usuarioId;
  
  this.historialCambios.push({
    cambio: `Cita cancelada: ${motivo}`,
    realizadoPor: usuarioId
  });

  return this.save();
};

// Método para confirmar cita
appointmentSchema.methods.confirmar = function(usuarioId) {
  this.estado = 'confirmada';
  this.actualizadoPor = usuarioId;
  
  this.historialCambios.push({
    cambio: 'Cita confirmada',
    realizadoPor: usuarioId
  });

  return this.save();
};

// Método para marcar llegada del paciente
appointmentSchema.methods.marcarLlegada = function(hora = null) {
  const ahora = new Date();
  this.horaLlegada = hora || `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
  this.estado = 'en_sala_espera';
  
  // Calcular tiempo de espera si la cita ya debería haber empezado
  const [horaInicio, minutosInicio] = this.horaInicio.split(':').map(Number);
  const [horaLlegada, minutosLlegada] = this.horaLlegada.split(':').map(Number);
  
  const minutosInicioTotal = horaInicio * 60 + minutosInicio;
  const minutosLlegadaTotal = horaLlegada * 60 + minutosLlegada;
  
  if (minutosLlegadaTotal > minutosInicioTotal) {
    this.tiempoEspera = 0;
  } else {
    this.tiempoEspera = minutosInicioTotal - minutosLlegadaTotal;
  }

  return this.save();
};

module.exports = mongoose.model('Appointment', appointmentSchema);