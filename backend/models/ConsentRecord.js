const mongoose = require('mongoose');
const crypto = require('crypto');

const consentRecordSchema = new mongoose.Schema({
  // Referencias
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'El ID del paciente es obligatorio']
  },
  formularioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ConsentForm',
    required: [true, 'El ID del formulario es obligatorio']
  },
  // Información del paciente (desnormalizada para histórico)
  pacienteNombre: {
    type: String,
    required: [true, 'El nombre del paciente es obligatorio'],
    trim: true
  },
  pacienteDni: {
    type: String,
    trim: true
  },
  pacienteEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  pacienteTelefono: {
    type: String,
    trim: true
  },
  // Información del formulario (desnormalizada para histórico)
  formularioNombre: {
    type: String,
    required: [true, 'El nombre del formulario es obligatorio']
  },
  formularioVersion: {
    type: String,
    required: [true, 'La versión del formulario es obligatoria']
  },
  formularioContenido: {
    type: String,
    required: [true, 'El contenido del formulario es obligatorio']
  },
  formularioCategoria: {
    type: String,
    required: [true, 'La categoría del formulario es obligatoria']
  },
  // Estado y fechas
  estado: {
    type: String,
    enum: ['pendiente', 'enviado', 'visto', 'firmado', 'rechazado', 'expirado'],
    default: 'pendiente'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaEnvio: {
    type: Date
  },
  fechaVisto: {
    type: Date
  },
  fechaFirma: {
    type: Date
  },
  fechaRechazo: {
    type: Date
  },
  fechaExpiracion: {
    type: Date
  },
  // Información de firma y evidencia legal
  firmaDigital: {
    type: String // Base64 de la firma digital
  },
  ip: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  geolocalizacion: {
    latitud: Number,
    longitud: Number,
    precision: Number
  },
  // Hash de evidencia legal
  evidencia: {
    type: String,
    unique: true,
    sparse: true
  },
  // Información del testigo (si aplica)
  testigo: {
    nombre: String,
    dni: String,
    relacion: String,
    firma: String // Base64 de la firma del testigo
  },
  // Razón de rechazo
  motivoRechazo: {
    type: String,
    maxlength: [500, 'El motivo de rechazo no puede exceder 500 caracteres']
  },
  // Método de envío y acceso
  metodoEnvio: {
    type: String,
    enum: ['email', 'sms', 'presencial', 'portal'],
    default: 'email'
  },
  tokenAcceso: {
    type: String,
    unique: true,
    sparse: true
  },
  tokenExpiracion: {
    type: Date
  },
  numeroIntentos: {
    type: Number,
    default: 0
  },
  // Auditoría
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enviadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Información adicional
  notas: {
    type: String,
    maxlength: [1000, 'Las notas no pueden exceder 1000 caracteres']
  },
  // Configuración específica
  recordatoriosEnviados: {
    type: Number,
    default: 0
  },
  fechaUltimoRecordatorio: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimización
consentRecordSchema.index({ pacienteId: 1, estado: 1 });
consentRecordSchema.index({ formularioId: 1 });
consentRecordSchema.index({ estado: 1, fechaCreacion: -1 });
consentRecordSchema.index({ fechaExpiracion: 1 });
consentRecordSchema.index({ tokenAcceso: 1 }, { sparse: true });
consentRecordSchema.index({ evidencia: 1 }, { sparse: true });
consentRecordSchema.index({ 'pacienteEmail': 1 });

// Virtual para verificar si está expirado
consentRecordSchema.virtual('estaExpirado').get(function() {
  return this.fechaExpiracion && new Date() > this.fechaExpiracion;
});

// Virtual para verificar si está pendiente de acción
consentRecordSchema.virtual('requiereAccion').get(function() {
  return ['pendiente', 'enviado', 'visto'].includes(this.estado) && !this.estaExpirado;
});

// Virtual para calcular tiempo transcurrido
consentRecordSchema.virtual('tiempoTranscurrido').get(function() {
  const fechaReferencia = this.fechaEnvio || this.fechaCreacion;
  const ahora = new Date();
  const diferencia = ahora - fechaReferencia;
  
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (dias > 0) {
    return `${dias} día${dias > 1 ? 's' : ''}`;
  } else if (horas > 0) {
    return `${horas} hora${horas > 1 ? 's' : ''}`;
  } else {
    return 'Hace poco';
  }
});

// Middleware pre-save para generar evidencia legal
consentRecordSchema.pre('save', function(next) {
  // Generar token de acceso para nuevos registros
  if (this.isNew && !this.tokenAcceso) {
    this.tokenAcceso = crypto.randomBytes(32).toString('hex');
    
    // Calcular fecha de expiración basada en el formulario
    if (!this.fechaExpiracion) {
      const diasExpiracion = 30; // Por defecto 30 días
      this.fechaExpiracion = new Date(Date.now() + diasExpiracion * 24 * 60 * 60 * 1000);
    }
  }
  
  // Generar hash de evidencia cuando se firma
  if (this.isModified('estado') && this.estado === 'firmado' && !this.evidencia) {
    const datosEvidencia = {
      pacienteId: this.pacienteId,
      formularioId: this.formularioId,
      formularioVersion: this.formularioVersion,
      fechaFirma: this.fechaFirma || new Date(),
      ip: this.ip,
      userAgent: this.userAgent
    };
    
    this.evidencia = crypto
      .createHash('sha256')
      .update(JSON.stringify(datosEvidencia))
      .digest('hex');
  }
  
  // Actualizar fecha de expiración automáticamente si está expirado
  if (this.estaExpirado && this.estado !== 'expirado') {
    this.estado = 'expirado';
  }
  
  next();
});

// Método para marcar como enviado
consentRecordSchema.methods.marcarComoEnviado = function(enviadoPor, metodo = 'email') {
  this.estado = 'enviado';
  this.fechaEnvio = new Date();
  this.enviadoPor = enviadoPor;
  this.metodoEnvio = metodo;
  return this.save();
};

// Método para marcar como visto
consentRecordSchema.methods.marcarComoVisto = function() {
  if (this.estado === 'enviado') {
    this.estado = 'visto';
    this.fechaVisto = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Método para firmar consentimiento
consentRecordSchema.methods.firmar = function(datosSignature = {}) {
  this.estado = 'firmado';
  this.fechaFirma = new Date();
  this.firmaDigital = datosSignature.firma;
  this.ip = datosSignature.ip;
  this.userAgent = datosSignature.userAgent;
  
  if (datosSignature.geolocalizacion) {
    this.geolocalizacion = datosSignature.geolocalizacion;
  }
  
  if (datosSignature.testigo) {
    this.testigo = datosSignature.testigo;
  }
  
  return this.save();
};

// Método para rechazar consentimiento
consentRecordSchema.methods.rechazar = function(motivo) {
  this.estado = 'rechazado';
  this.fechaRechazo = new Date();
  this.motivoRechazo = motivo;
  return this.save();
};

// Método para generar nuevo token de acceso
consentRecordSchema.methods.generarNuevoToken = function() {
  this.tokenAcceso = crypto.randomBytes(32).toString('hex');
  this.tokenExpiracion = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
  this.numeroIntentos = 0;
  return this.save();
};

// Método para información básica
consentRecordSchema.methods.toInfoBasica = function() {
  return {
    id: this._id,
    pacienteNombre: this.pacienteNombre,
    formularioNombre: this.formularioNombre,
    estado: this.estado,
    fechaCreacion: this.fechaCreacion,
    fechaEnvio: this.fechaEnvio,
    fechaFirma: this.fechaFirma,
    estaExpirado: this.estaExpirado,
    requiereAccion: this.requiereAccion,
    tiempoTranscurrido: this.tiempoTranscurrido
  };
};

// Método estático para buscar por token
consentRecordSchema.statics.buscarPorToken = function(token) {
  return this.findOne({
    tokenAcceso: token,
    tokenExpiracion: { $gt: new Date() },
    estado: { $in: ['enviado', 'visto'] }
  });
};

// Método estático para obtener estadísticas
consentRecordSchema.statics.obtenerEstadisticas = async function() {
  const stats = await this.aggregate([
    {
      $facet: {
        general: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              firmados: {
                $sum: { $cond: [{ $eq: ['$estado', 'firmado'] }, 1, 0] }
              },
              pendientes: {
                $sum: { $cond: [{ $eq: ['$estado', 'pendiente'] }, 1, 0] }
              },
              enviados: {
                $sum: { $cond: [{ $eq: ['$estado', 'enviado'] }, 1, 0] }
              },
              rechazados: {
                $sum: { $cond: [{ $eq: ['$estado', 'rechazado'] }, 1, 0] }
              }
            }
          }
        ],
        porMes: [
          {
            $group: {
              _id: {
                año: { $year: '$fechaCreacion' },
                mes: { $month: '$fechaCreacion' }
              },
              total: { $sum: 1 },
              firmados: {
                $sum: { $cond: [{ $eq: ['$estado', 'firmado'] }, 1, 0] }
              }
            }
          },
          { $sort: { '_id.año': -1, '_id.mes': -1 } },
          { $limit: 12 }
        ]
      }
    }
  ]);
  
  return stats[0];
};

// Método estático para limpiar registros expirados
consentRecordSchema.statics.limpiarExpirados = function() {
  return this.updateMany(
    {
      fechaExpiracion: { $lt: new Date() },
      estado: { $nin: ['firmado', 'rechazado', 'expirado'] }
    },
    { estado: 'expirado' }
  );
};

module.exports = mongoose.model('ConsentRecord', consentRecordSchema);