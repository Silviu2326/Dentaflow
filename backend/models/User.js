const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Formato de email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false
  },
  role: {
    type: String,
    enum: [
      'owner',                    // Propietario - Acceso total
      'hq_analyst',              // Analista HQ - Solo reportes y análisis
      'admin_sede',              // Admin de Sede - Gestión completa de sede
      'reception',               // Recepción - Agenda, pacientes, facturación
      'clinical_professional',   // Profesional Clínico - Agenda, historia clínica
      'assistant_nurse',         // Asistente/Enfermería - Apoyo clínico limitado
      'finance',                 // Finanzas/Caja - Gestión financiera
      'marketing',               // Marketing - Campañas y comunicaciones
      'operations',              // Operaciones/Inventario - Gestión de inventario
      'external_auditor'         // Auditor Externo - Solo lectura para auditoría
    ],
    default: 'reception',
    required: [true, 'El rol es obligatorio']
  },
  roleDisplayName: {
    type: String,
    default: function() {
      const roleDisplayNames = {
        'owner': 'Propietario',
        'hq_analyst': 'Analista HQ',
        'admin_sede': 'Administrador de Sede',
        'reception': 'Recepción',
        'clinical_professional': 'Profesional Clínico',
        'assistant_nurse': 'Asistente/Enfermería',
        'finance': 'Finanzas',
        'marketing': 'Marketing',
        'operations': 'Operaciones',
        'external_auditor': 'Auditor Externo'
      };
      return roleDisplayNames[this.role] || this.role;
    }
  },
  sede: {
    type: String,
    required: function() {
      return ['admin_sede', 'reception', 'clinical_professional', 'assistant_nurse'].includes(this.role);
    },
    enum: ['centro', 'norte', 'sur', 'este', 'oeste']
  },
  telefono: {
    type: String,
    trim: true,
    match: [/^(\+34|0034|34)?[6-9][0-9]{8}$/, 'Formato de teléfono español inválido']
  },
  dni: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    match: [/^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i, 'Formato de DNI inválido']
  },
  especialidad: {
    type: String,
    required: function() {
      return this.role === 'clinical_professional';
    },
    enum: ['odontologia_general', 'endodoncia', 'periodoncia', 'cirugia', 'ortodoncia', 'implantologia', 'estetica', 'pediatrica']
  },
  numeroColegiadoProfesional: {
    type: String,
    required: function() {
      return this.role === 'clinical_professional';
    },
    trim: true
  },
  horarioTrabajo: {
    lunes: { inicio: String, fin: String },
    martes: { inicio: String, fin: String },
    miercoles: { inicio: String, fin: String },
    jueves: { inicio: String, fin: String },
    viernes: { inicio: String, fin: String },
    sabado: { inicio: String, fin: String },
    domingo: { inicio: String, fin: String }
  },
  permisos: {
    type: [String],
    default: function() {
      const rolePermissions = {
        'owner': ['*'], // Acceso total
        'hq_analyst': [
          'dashboard:read', 'reports:read', 'analytics:read', 'costs:read', 
          'payments:read', 'audit:read', 'hq_overview:read'
        ],
        'admin_sede': [
          'dashboard:read', 'agenda:*', 'patients:*', 'appointments:*', 
          'clinical_history:*', 'consents:*', 'documents:*', 'budgets:*', 
          'billing:*', 'cash_management:*', 'inventory:*', 'costs:read', 
          'payments:*', 'reports:*', 'users_management:*', 'telephony:*', 
          'dam:*', 'online_booking:*', 'hq_commissions:read'
        ],
        'reception': [
          'agenda:*', 'patients:*', 'appointments:*', 'budgets:*', 
          'billing:*', 'cash_management:*', 'documents:read', 
          'consents:read', 'reports:read'
        ],
        'clinical_professional': [
          'agenda:*', 'patients:read', 'clinical_history:*', 'consents:*', 
          'budgets:*', 'documents:*', 'dam:*', 'reports:read'
        ],
        'assistant_nurse': [
          'agenda:read', 'patients:read', 'clinical_history:*', 
          'appointments:read', 'documents:read', 'consents:read'
        ],
        'finance': [
          'billing:*', 'payments:*', 'cash_management:*', 'reports:*', 
          'costs:read', 'audit:read'
        ],
        'marketing': [
          'marketing_funnels:*', 'marketing_communications:*', 'dam:read', 
          'online_booking:*', 'reports:read'
        ],
        'operations': [
          'inventory:*', 'costs:*', 'reports:read'
        ],
        'external_auditor': [
          'reports:read', 'billing:read', 'cash_management:read', 'audit:read'
        ]
      };
      return rolePermissions[this.role] || [];
    }
  },
  activo: {
    type: Boolean,
    default: true
  },
  ultimoAcceso: {
    type: Date
  },
  configuracion: {
    notificaciones: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    tema: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    idioma: {
      type: String,
      enum: ['es', 'en', 'ca'],
      default: 'es'
    },
    dashboardPersonalizado: {
      widgets: [String],
      orden: [String]
    }
  },
  tokenRecuperacion: {
    token: String,
    expira: Date
  },
  intentosLogin: {
    type: Number,
    default: 0
  },
  bloqueadoHasta: {
    type: Date
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
userSchema.index({ email: 1 });
userSchema.index({ role: 1, sede: 1 });
userSchema.index({ activo: 1 });
userSchema.index({ dni: 1 }, { sparse: true });

// Virtual para nombre completo
userSchema.virtual('nombreCompleto').get(function() {
  return `${this.nombre} ${this.apellidos}`;
});

// Virtual para verificar si está bloqueado
userSchema.virtual('estaBloqueado').get(function() {
  return this.bloqueadoHasta && this.bloqueadoHasta > Date.now();
});

// Middleware pre-save para encriptar contraseña
userSchema.pre('save', async function(next) {
  // Solo encriptar si la contraseña ha sido modificada
  if (!this.isModified('password')) return next();
  
  try {
    // Encriptar contraseña
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Actualizar fecha de modificación
    this.fechaActualizacion = Date.now();
    
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.compararPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para verificar permisos
userSchema.methods.tienePermiso = function(permiso) {
  // Owner tiene todos los permisos
  if (this.role === 'owner') return true;
  
  // Verificar permiso específico o wildcard
  return this.permisos.includes(permiso) || this.permisos.includes('*') || 
         this.permisos.some(p => p.endsWith('*') && permiso.startsWith(p.slice(0, -1)));
};

// Método para incrementar intentos de login
userSchema.methods.incrementarIntentosLogin = function() {
  // Si ya está bloqueado y el tiempo ha pasado, resetear
  if (this.bloqueadoHasta && this.bloqueadoHasta <= Date.now()) {
    return this.updateOne({
      $unset: { bloqueadoHasta: 1, intentosLogin: 1 }
    });
  }
  
  this.intentosLogin += 1;
  
  // Bloquear después de 5 intentos por 2 horas
  if (this.intentosLogin >= 5 && !this.estaBloqueado) {
    this.bloqueadoHasta = Date.now() + 2 * 60 * 60 * 1000; // 2 horas
  }
  
  return this.save();
};

// Método para resetear intentos de login
userSchema.methods.resetearIntentosLogin = function() {
  return this.updateOne({
    $unset: { intentosLogin: 1, bloqueadoHasta: 1 }
  });
};

// Método para actualizar último acceso
userSchema.methods.actualizarUltimoAcceso = function() {
  this.ultimoAcceso = Date.now();
  return this.save({ validateBeforeSave: false });
};

// Método para generar token de recuperación
userSchema.methods.generarTokenRecuperacion = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.tokenRecuperacion = {
    token: crypto.createHash('sha256').update(token).digest('hex'),
    expira: Date.now() + 10 * 60 * 1000 // 10 minutos
  };
  
  return token;
};

// Método estático para buscar por token de recuperación
userSchema.statics.buscarPorTokenRecuperacion = function(token) {
  const crypto = require('crypto');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  return this.findOne({
    'tokenRecuperacion.token': hashedToken,
    'tokenRecuperacion.expira': { $gt: Date.now() }
  });
};

// Método para obtener información básica (sin datos sensibles)
userSchema.methods.toInfoBasica = function() {
  return {
    id: this._id,
    nombre: this.nombre,
    apellidos: this.apellidos,
    nombreCompleto: this.nombreCompleto,
    email: this.email,
    role: this.role,
    roleDisplayName: this.roleDisplayName,
    sede: this.sede,
    especialidad: this.especialidad,
    activo: this.activo,
    ultimoAcceso: this.ultimoAcceso
  };
};

module.exports = mongoose.model('User', userSchema);