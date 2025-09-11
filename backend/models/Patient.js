const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  // Información personal básica
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  apellidos: {
    type: String,
    required: [true, 'Los apellidos son obligatorios'],
    trim: true,
    maxlength: [100, 'Los apellidos no pueden exceder 100 caracteres']
  },
  
  // Información de identificación
  dni: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    match: [/^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i, 'Formato de DNI inválido']
  },
  nie: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    match: [/^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i, 'Formato de NIE inválido']
  },
  numeroHistoriaClinica: {
    type: String,
    unique: true,
    required: true
  },

  // Información personal
  fechaNacimiento: {
    type: Date,
    required: [true, 'La fecha de nacimiento es obligatoria']
  },
  genero: {
    type: String,
    enum: ['masculino', 'femenino', 'otro', 'no_especificado'],
    default: 'no_especificado'
  },
  nacionalidad: {
    type: String,
    default: 'española'
  },
  profesion: {
    type: String,
    trim: true,
    maxlength: [100, 'La profesión no puede exceder 100 caracteres']
  },

  // Información de contacto
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Formato de email inválido']
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    trim: true,
    match: [/^(\+34|0034|34)?[6-9][0-9]{8}$/, 'Formato de teléfono español inválido']
  },
  telefonoSecundario: {
    type: String,
    trim: true,
    match: [/^(\+34|0034|34)?[6-9][0-9]{8}$/, 'Formato de teléfono español inválido']
  },

  // Dirección
  direccion: {
    calle: {
      type: String,
      trim: true,
      maxlength: [200, 'La dirección no puede exceder 200 caracteres']
    },
    numero: {
      type: String,
      trim: true,
      maxlength: [10, 'El número no puede exceder 10 caracteres']
    },
    piso: {
      type: String,
      trim: true,
      maxlength: [10, 'El piso no puede exceder 10 caracteres']
    },
    ciudad: {
      type: String,
      trim: true,
      maxlength: [100, 'La ciudad no puede exceder 100 caracteres']
    },
    provincia: {
      type: String,
      trim: true,
      maxlength: [100, 'La provincia no puede exceder 100 caracteres']
    },
    codigoPostal: {
      type: String,
      trim: true,
      match: [/^[0-9]{5}$/, 'Formato de código postal inválido']
    },
    pais: {
      type: String,
      default: 'España'
    }
  },

  // Contacto de emergencia
  contactoEmergencia: {
    nombre: {
      type: String,
      trim: true,
      maxlength: [150, 'El nombre del contacto no puede exceder 150 caracteres']
    },
    relacion: {
      type: String,
      trim: true,
      maxlength: [50, 'La relación no puede exceder 50 caracteres']
    },
    telefono: {
      type: String,
      trim: true,
      match: [/^(\+34|0034|34)?[6-9][0-9]{8}$/, 'Formato de teléfono español inválido']
    }
  },

  // Estado del paciente
  estado: {
    type: String,
    enum: ['activo', 'inactivo', 'pendiente', 'fallecido', 'suspendido'],
    default: 'activo'
  },
  motivoInactividad: {
    type: String,
    required: function() {
      return this.estado === 'inactivo' || this.estado === 'suspendido';
    }
  },

  // Información médica general
  tipoSangre: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'desconocido'],
    default: 'desconocido'
  },
  alergias: [{
    tipo: {
      type: String,
      enum: ['medicamento', 'material_dental', 'alimento', 'ambiental', 'otro']
    },
    descripcion: String,
    gravedad: {
      type: String,
      enum: ['leve', 'moderada', 'grave'],
      default: 'leve'
    },
    fechaDeteccion: Date
  }],
  
  medicamentosActuales: [{
    nombre: String,
    dosis: String,
    frecuencia: String,
    fechaInicio: Date,
    fechaFin: Date,
    activo: {
      type: Boolean,
      default: true
    }
  }],

  // Historial médico relevante
  historialMedico: {
    enfermedadesPrevias: [String],
    cirugiasPrevias: [String],
    hospitalizaciones: [String],
    condicionesCronicas: [String],
    vacunaciones: [{
      nombre: String,
      fecha: Date,
      lote: String
    }]
  },

  // Información dental específica
  informacionDental: {
    motivoConsulta: String,
    tratamientosPrevios: [String],
    ortodonciaPrevias: Boolean,
    protesisPrevias: Boolean,
    problemasATM: Boolean,
    bruxismo: Boolean,
    sensibilidadDental: Boolean,
    sangradumEncías: Boolean,
    dificultadAbrirBoca: Boolean,
    dolorMandibular: Boolean
  },

  // Hábitos y estilo de vida
  habitos: {
    fumador: {
      estado: {
        type: String,
        enum: ['nunca', 'ex_fumador', 'fumador_ocasional', 'fumador_habitual'],
        default: 'nunca'
      },
      cantidad: String, // cigarrillos por día
      fechaInicio: Date,
      fechaCese: Date
    },
    alcohol: {
      frecuencia: {
        type: String,
        enum: ['nunca', 'ocasional', 'moderado', 'frecuente'],
        default: 'nunca'
      },
      tipo: String
    },
    higieneDental: {
      cepillado: {
        frecuencia: {
          type: String,
          enum: ['nunca', '1_vez_dia', '2_veces_dia', '3_veces_dia', 'mas_3_veces'],
          default: '2_veces_dia'
        }
      },
      hilosDental: Boolean,
      enjuagueBucal: Boolean,
      limpiezaProfesional: {
        frecuencia: String,
        ultimaFecha: Date
      }
    }
  },

  // Información de citas y tratamientos
  ultimaVisita: {
    type: Date
  },
  proximaCita: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  tratamientosRealizados: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Treatment'
  }],
  presupuestosActivos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget'
  }],

  // Sede asignada
  sede: {
    type: String,
    enum: ['centro', 'norte', 'sur', 'este', 'oeste'],
    required: [true, 'La sede es obligatoria']
  },

  // Profesional asignado (dentista de cabecera)
  profesionalAsignado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Información financiera
  informacionFinanciera: {
    metodoPagoPreferido: {
      type: String,
      enum: ['efectivo', 'tarjeta', 'transferencia', 'financiacion', 'seguro'],
      default: 'tarjeta'
    },
    seguroMedico: {
      compania: String,
      numeroPoliza: String,
      vigencia: Date,
      cobertura: String
    },
    limiteCreditoPendiente: {
      type: Number,
      default: 0,
      min: 0
    },
    deudaPendiente: {
      type: Number,
      default: 0,
      min: 0
    }
  },

  // Preferencias de comunicación
  preferenciasComunicacion: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    whatsapp: { type: Boolean, default: false },
    postal: { type: Boolean, default: false },
    horarioContacto: {
      type: String,
      enum: ['manana', 'tarde', 'cualquiera'],
      default: 'cualquiera'
    },
    idiomaPreferido: {
      type: String,
      enum: ['es', 'ca', 'en'],
      default: 'es'
    }
  },

  // Consentimientos y autorizaciones
  consentimientos: [{
    tipo: {
      type: String,
      enum: ['tratamiento', 'datos', 'imagen', 'comunicacion', 'otro']
    },
    descripcion: String,
    fechaConsentimiento: {
      type: Date,
      default: Date.now
    },
    firmado: {
      type: Boolean,
      default: false
    },
    documento: String, // URL o referencia al documento
    testigo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Notas generales
  notas: {
    type: String,
    maxlength: [2000, 'Las notas no pueden exceder 2000 caracteres']
  },

  // Historial de cambios
  historialCambios: [{
    fecha: {
      type: Date,
      default: Date.now
    },
    cambio: String,
    valorAnterior: String,
    valorNuevo: String,
    realizadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Origen del paciente
  origen: {
    fuente: {
      type: String,
      enum: ['referido', 'web', 'redes_sociales', 'publicidad', 'caminando', 'otro'],
      default: 'otro'
    },
    detalles: String,
    fechaRegistro: {
      type: Date,
      default: Date.now
    }
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
patientSchema.index({ email: 1 });
patientSchema.index({ dni: 1 }, { sparse: true });
patientSchema.index({ nie: 1 }, { sparse: true });
patientSchema.index({ numeroHistoriaClinica: 1 });
patientSchema.index({ nombre: 1, apellidos: 1 });
patientSchema.index({ telefono: 1 });
patientSchema.index({ sede: 1, estado: 1 });
patientSchema.index({ fechaNacimiento: 1 });

// Virtual para nombre completo
patientSchema.virtual('nombreCompleto').get(function() {
  return `${this.nombre} ${this.apellidos}`;
});

// Virtual para calcular edad
patientSchema.virtual('edad').get(function() {
  if (!this.fechaNacimiento) return null;
  
  const today = new Date();
  const birthDate = new Date(this.fechaNacimiento);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual para dirección completa
patientSchema.virtual('direccionCompleta').get(function() {
  if (!this.direccion || !this.direccion.calle) return null;
  
  let direccion = this.direccion.calle;
  if (this.direccion.numero) direccion += ` ${this.direccion.numero}`;
  if (this.direccion.piso) direccion += `, ${this.direccion.piso}`;
  if (this.direccion.ciudad) direccion += `, ${this.direccion.ciudad}`;
  if (this.direccion.codigoPostal) direccion += ` ${this.direccion.codigoPostal}`;
  
  return direccion;
});

// Virtual para verificar si tiene alergias activas
patientSchema.virtual('tieneAlergias').get(function() {
  return this.alergias && this.alergias.length > 0;
});

// Virtual para verificar si está tomando medicamentos
patientSchema.virtual('tomaMedicamentos').get(function() {
  return this.medicamentosActuales && 
         this.medicamentosActuales.some(med => med.activo);
});

// Middleware pre-save
patientSchema.pre('save', async function(next) {
  try {
    // Generar número de historia clínica si no existe
    if (!this.numeroHistoriaClinica) {
      const count = await mongoose.model('Patient').countDocuments();
      this.numeroHistoriaClinica = `HC${String(count + 1).padStart(6, '0')}`;
    }

    // Actualizar fecha de modificación
    this.fechaActualizacion = Date.now();

    next();
  } catch (error) {
    next(error);
  }
});

// Método para obtener información básica (sin datos médicos sensibles)
patientSchema.methods.toInfoBasica = function() {
  return {
    id: this._id,
    nombre: this.nombre,
    apellidos: this.apellidos,
    nombreCompleto: this.nombreCompleto,
    email: this.email,
    telefono: this.telefono,
    fechaNacimiento: this.fechaNacimiento,
    edad: this.edad,
    estado: this.estado,
    sede: this.sede,
    ultimaVisita: this.ultimaVisita,
    numeroHistoriaClinica: this.numeroHistoriaClinica
  };
};

// Método para verificar si puede ser contactado
patientSchema.methods.puedeSerContactado = function(metodo = 'email') {
  if (this.estado !== 'activo') return false;
  
  switch (metodo) {
    case 'email':
      return this.preferenciasComunicacion.email && this.email;
    case 'sms':
      return this.preferenciasComunicacion.sms && this.telefono;
    case 'whatsapp':
      return this.preferenciasComunicacion.whatsapp && this.telefono;
    default:
      return false;
  }
};

// Método estático para buscar pacientes
patientSchema.statics.buscarPacientes = function(termino, sede = null, estado = null) {
  const query = {
    $or: [
      { nombre: { $regex: termino, $options: 'i' } },
      { apellidos: { $regex: termino, $options: 'i' } },
      { email: { $regex: termino, $options: 'i' } },
      { telefono: { $regex: termino, $options: 'i' } },
      { numeroHistoriaClinica: { $regex: termino, $options: 'i' } }
    ]
  };

  if (sede) query.sede = sede;
  if (estado) query.estado = estado;

  return this.find(query)
    .select('nombre apellidos email telefono fechaNacimiento estado sede ultimaVisita numeroHistoriaClinica')
    .sort({ apellidos: 1, nombre: 1 });
};

// Método para registrar cambio en historial
patientSchema.methods.registrarCambio = function(cambio, valorAnterior, valorNuevo, usuarioId) {
  this.historialCambios.push({
    cambio,
    valorAnterior,
    valorNuevo,
    realizadoPor: usuarioId
  });
  
  return this.save();
};

// Método para activar/desactivar paciente
patientSchema.methods.cambiarEstado = function(nuevoEstado, motivo = null, usuarioId) {
  const estadoAnterior = this.estado;
  this.estado = nuevoEstado;
  
  if (motivo && (nuevoEstado === 'inactivo' || nuevoEstado === 'suspendido')) {
    this.motivoInactividad = motivo;
  }

  this.actualizadoPor = usuarioId;
  
  this.historialCambios.push({
    cambio: `Estado cambiado de ${estadoAnterior} a ${nuevoEstado}`,
    valorAnterior: estadoAnterior,
    valorNuevo: nuevoEstado,
    realizadoPor: usuarioId
  });

  return this.save();
};

module.exports = mongoose.model('Patient', patientSchema);