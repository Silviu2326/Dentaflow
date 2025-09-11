const mongoose = require('mongoose');
const crypto = require('crypto');

const integrationSchema = new mongoose.Schema({
  // Información básica
  nombre: {
    type: String,
    required: [true, 'El nombre de la integración es obligatorio'],
    trim: true,
    maxlength: [200, 'El nombre no puede exceder 200 caracteres']
  },
  codigo: {
    type: String,
    required: [true, 'El código es obligatorio'],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [50, 'El código no puede exceder 50 caracteres']
  },
  // Categoría de la integración
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: [
      'contabilidad',
      'firma_digital',
      'tpv',
      'telefonia',
      'bi',
      'marketing',
      'inventario',
      'rrhh',
      'comunicaciones',
      'seguridad',
      'backup',
      'otros'
    ]
  },
  // Información del proveedor
  proveedor: {
    nombre: {
      type: String,
      required: [true, 'El nombre del proveedor es obligatorio'],
      trim: true
    },
    sitioWeb: String,
    contacto: {
      email: String,
      telefono: String,
      soporte: String
    },
    documentacion: String,
    logoUrl: String
  },
  // Estado de la integración
  estado: {
    type: String,
    enum: ['activa', 'inactiva', 'error', 'configurando', 'pausada', 'mantenimiento'],
    default: 'configurando'
  },
  // Descripción y características
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  caracteristicas: [String],
  // Versión y actualización
  version: {
    type: String,
    required: [true, 'La versión es obligatoria'],
    trim: true
  },
  versionMinima: String,
  fechaActualizacion: Date,
  // Configuración de la integración
  configuracion: {
    // Configuración de conexión
    conexion: {
      tipo: {
        type: String,
        enum: ['api', 'database', 'file', 'webhook', 'socket', 'sftp'],
        default: 'api'
      },
      url: String,
      endpoint: String,
      puerto: Number,
      ssl: { type: Boolean, default: true },
      timeout: { type: Number, default: 30000 }
    },
    // Autenticación
    autenticacion: {
      tipo: {
        type: String,
        enum: ['api_key', 'oauth2', 'basic', 'bearer', 'certificate', 'custom'],
        default: 'api_key'
      },
      credenciales: {
        type: Map,
        of: String // Datos encriptados
      },
      expiracion: Date,
      autoRenovacion: { type: Boolean, default: false }
    },
    // Configuración específica
    parametros: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    },
    // Configuración de sincronización
    sincronizacion: {
      frecuencia: {
        type: String,
        enum: ['manual', 'real_time', 'cada_minuto', 'cada_5_minutos', 'cada_15_minutos', 'cada_hora', 'diaria', 'semanal'],
        default: 'cada_hora'
      },
      ultimaSync: Date,
      proximaSync: Date,
      reintentosMaximos: { type: Number, default: 3 },
      timeoutSync: { type: Number, default: 60000 }
    }
  },
  // Datos de rendimiento
  rendimiento: {
    disponibilidad: { type: Number, default: 0 }, // Porcentaje
    tiempoRespuestaPromedio: { type: Number, default: 0 }, // ms
    solicitudesExitosas: { type: Number, default: 0 },
    solicitudesError: { type: Number, default: 0 },
    ultimoTiempoRespuesta: Number,
    ultimaVerificacion: Date
  },
  // Configuración de monitoreo
  monitoreo: {
    activo: { type: Boolean, default: true },
    alertas: {
      errorConexion: { type: Boolean, default: true },
      respuestaLenta: { type: Boolean, default: true },
      limiteRespuesta: { type: Number, default: 5000 },
      fallasConsecutivas: { type: Number, default: 3 }
    },
    notificaciones: {
      email: [String],
      webhook: String
    }
  },
  // Configuración de seguridad
  seguridad: {
    encriptacion: { type: Boolean, default: true },
    validacionCertificado: { type: Boolean, default: true },
    ipsPermitidas: [String],
    rateLimiting: {
      activo: { type: Boolean, default: false },
      solicitudesPorMinuto: Number
    }
  },
  // Logs y estadísticas
  estadisticas: {
    totalSincronizaciones: { type: Number, default: 0 },
    totalErrores: { type: Number, default: 0 },
    ultimoError: {
      fecha: Date,
      mensaje: String,
      codigo: String
    },
    tiempoActividad: { type: Number, default: 0 }, // minutos
    fechaInstalacion: { type: Date, default: Date.now }
  },
  // Configuración de datos
  mapeosDatos: [{
    campoOrigen: String,
    campoDestino: String,
    transformacion: String,
    validacion: String,
    obligatorio: { type: Boolean, default: false }
  }],
  // Webhooks y callbacks
  webhooks: [{
    evento: String,
    url: String,
    metodo: { type: String, default: 'POST' },
    headers: Map,
    activo: { type: Boolean, default: true }
  }],
  // Mantenimiento
  mantenimiento: {
    programado: Date,
    duracionEstimada: Number, // minutos
    descripcion: String,
    contactoResponsable: String
  },
  // Información de licencia
  licencia: {
    tipo: String,
    fechaVencimiento: Date,
    limitesUso: {
      solicitudesMensuales: Number,
      usuarios: Number,
      almacenamiento: Number // MB
    },
    costoMensual: Number
  },
  // Auditoría
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaModificacion: {
    type: Date,
    default: Date.now
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  modificadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Control de versiones de configuración
  historialConfiguracion: [{
    fecha: Date,
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cambios: String,
    configuracionAnterior: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // No exponer credenciales en JSON
      if (ret.configuracion && ret.configuracion.autenticacion && ret.configuracion.autenticacion.credenciales) {
        ret.configuracion.autenticacion.credenciales = '[PROTECTED]';
      }
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Índices para optimización
integrationSchema.index({ codigo: 1 });
integrationSchema.index({ categoria: 1, estado: 1 });
integrationSchema.index({ estado: 1, 'configuracion.sincronizacion.proximaSync': 1 });
integrationSchema.index({ 'proveedor.nombre': 1 });
integrationSchema.index({ fechaCreacion: -1 });
integrationSchema.index({ 'monitoreo.activo': 1, estado: 1 });

// Virtual para calcular disponibilidad
integrationSchema.virtual('disponibilidadCalculada').get(function() {
  const total = this.rendimiento.solicitudesExitosas + this.rendimiento.solicitudesError;
  if (total === 0) return 100;
  return Math.round((this.rendimiento.solicitudesExitosas / total) * 100);
});

// Virtual para verificar si necesita atención
integrationSchema.virtual('necesitaAtencion').get(function() {
  const ahora = new Date();
  const ultimaSync = this.configuracion.sincronizacion.ultimaSync;
  
  // Si está en error
  if (this.estado === 'error') return true;
  
  // Si no ha sincronizado en mucho tiempo
  if (ultimaSync && (ahora - ultimaSync) > 24 * 60 * 60 * 1000) return true;
  
  // Si tiene muchos errores consecutivos
  if (this.rendimiento.solicitudesError > 5) return true;
  
  // Si la disponibilidad es muy baja
  if (this.disponibilidadCalculada < 95) return true;
  
  return false;
});

// Virtual para estado de salud
integrationSchema.virtual('estadoSalud').get(function() {
  if (this.estado === 'error') return 'critico';
  if (this.necesitaAtencion) return 'advertencia';
  if (this.estado === 'activa' && this.disponibilidadCalculada >= 98) return 'excelente';
  if (this.estado === 'activa') return 'bueno';
  return 'desconocido';
});

// Virtual para tiempo desde última sincronización
integrationSchema.virtual('tiempoUltimaSync').get(function() {
  if (!this.configuracion.sincronizacion.ultimaSync) return 'Nunca';
  
  const ahora = new Date();
  const diferencia = ahora - this.configuracion.sincronizacion.ultimaSync;
  const minutos = Math.floor(diferencia / (1000 * 60));
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  
  if (dias > 0) return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
  if (horas > 0) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
  if (minutos > 0) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
  return 'Hace menos de un minuto';
});

// Middleware pre-save para encriptar credenciales y actualizar fechas
integrationSchema.pre('save', function(next) {
  this.fechaModificacion = Date.now();
  
  // Encriptar credenciales si han sido modificadas
  if (this.isModified('configuracion.autenticacion.credenciales')) {
    const credenciales = this.configuracion.autenticacion.credenciales;
    if (credenciales) {
      for (const [key, value] of credenciales.entries()) {
        if (value && typeof value === 'string' && !value.startsWith('enc_')) {
          credenciales.set(key, this.encriptarCredencial(value));
        }
      }
    }
  }
  
  // Calcular próxima sincronización
  if (this.isModified('configuracion.sincronizacion.frecuencia')) {
    this.calcularProximaSync();
  }
  
  next();
});

// Método para encriptar credenciales
integrationSchema.methods.encriptarCredencial = function(valor) {
  const algorithm = 'aes-256-cbc';
  const key = process.env.INTEGRATION_ENCRYPTION_KEY || 'default-key-change-in-production';
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipher(algorithm, key);
  let encrypted = cipher.update(valor, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return `enc_${iv.toString('hex')}:${encrypted}`;
};

// Método para desencriptar credenciales
integrationSchema.methods.desencriptarCredencial = function(valorEncriptado) {
  if (!valorEncriptado.startsWith('enc_')) return valorEncriptado;
  
  const algorithm = 'aes-256-cbc';
  const key = process.env.INTEGRATION_ENCRYPTION_KEY || 'default-key-change-in-production';
  const parts = valorEncriptado.substring(4).split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  
  const decipher = crypto.createDecipher(algorithm, key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

// Método para obtener credenciales desencriptadas
integrationSchema.methods.obtenerCredenciales = function() {
  const credenciales = {};
  if (this.configuracion.autenticacion.credenciales) {
    for (const [key, value] of this.configuracion.autenticacion.credenciales.entries()) {
      credenciales[key] = this.desencriptarCredencial(value);
    }
  }
  return credenciales;
};

// Método para calcular próxima sincronización
integrationSchema.methods.calcularProximaSync = function() {
  const ahora = new Date();
  const frecuencia = this.configuracion.sincronizacion.frecuencia;
  
  switch (frecuencia) {
    case 'real_time':
      this.configuracion.sincronizacion.proximaSync = ahora;
      break;
    case 'cada_minuto':
      this.configuracion.sincronizacion.proximaSync = new Date(ahora.getTime() + 60000);
      break;
    case 'cada_5_minutos':
      this.configuracion.sincronizacion.proximaSync = new Date(ahora.getTime() + 5 * 60000);
      break;
    case 'cada_15_minutos':
      this.configuracion.sincronizacion.proximaSync = new Date(ahora.getTime() + 15 * 60000);
      break;
    case 'cada_hora':
      this.configuracion.sincronizacion.proximaSync = new Date(ahora.getTime() + 60 * 60000);
      break;
    case 'diaria':
      const mañana = new Date(ahora);
      mañana.setDate(mañana.getDate() + 1);
      mañana.setHours(2, 0, 0, 0); // 2 AM
      this.configuracion.sincronizacion.proximaSync = mañana;
      break;
    case 'semanal':
      const proximaSemana = new Date(ahora);
      proximaSemana.setDate(proximaSemana.getDate() + 7);
      proximaSemana.setHours(2, 0, 0, 0);
      this.configuracion.sincronizacion.proximaSync = proximaSemana;
      break;
    default:
      this.configuracion.sincronizacion.proximaSync = null;
  }
};

// Método para actualizar estadísticas de rendimiento
integrationSchema.methods.actualizarRendimiento = function(exito, tiempoRespuesta, error = null) {
  if (exito) {
    this.rendimiento.solicitudesExitosas += 1;
  } else {
    this.rendimiento.solicitudesError += 1;
    if (error) {
      this.estadisticas.ultimoError = {
        fecha: new Date(),
        mensaje: error.message,
        codigo: error.code || 'UNKNOWN'
      };
    }
  }
  
  // Actualizar tiempo de respuesta promedio
  if (tiempoRespuesta) {
    const total = this.rendimiento.solicitudesExitosas + this.rendimiento.solicitudesError;
    this.rendimiento.tiempoRespuestaPromedio = 
      ((this.rendimiento.tiempoRespuestaPromedio * (total - 1)) + tiempoRespuesta) / total;
    this.rendimiento.ultimoTiempoRespuesta = tiempoRespuesta;
  }
  
  // Actualizar disponibilidad
  this.rendimiento.disponibilidad = this.disponibilidadCalculada;
  this.rendimiento.ultimaVerificacion = new Date();
  
  return this.save();
};

// Método para registrar sincronización
integrationSchema.methods.registrarSincronizacion = function(exito, datos = {}) {
  this.configuracion.sincronizacion.ultimaSync = new Date();
  this.estadisticas.totalSincronizaciones += 1;
  
  if (!exito) {
    this.estadisticas.totalErrores += 1;
  }
  
  // Calcular próxima sincronización
  this.calcularProximaSync();
  
  return this.save();
};

// Método para cambiar estado
integrationSchema.methods.cambiarEstado = function(nuevoEstado, motivo = '') {
  const estadoAnterior = this.estado;
  this.estado = nuevoEstado;
  
  // Registrar cambio en historial
  this.historialConfiguracion.push({
    fecha: new Date(),
    cambios: `Estado cambiado de ${estadoAnterior} a ${nuevoEstado}. Motivo: ${motivo}`,
    configuracionAnterior: { estado: estadoAnterior }
  });
  
  return this.save();
};

// Método para información básica
integrationSchema.methods.toInfoBasica = function() {
  return {
    id: this._id,
    nombre: this.nombre,
    codigo: this.codigo,
    categoria: this.categoria,
    proveedor: this.proveedor.nombre,
    estado: this.estado,
    version: this.version,
    ultimaSync: this.configuracion.sincronizacion.ultimaSync,
    disponibilidad: this.disponibilidadCalculada,
    estadoSalud: this.estadoSalud,
    tiempoUltimaSync: this.tiempoUltimaSync
  };
};

// Método estático para buscar integraciones que necesitan sincronización
integrationSchema.statics.buscarParaSincronizar = function() {
  const ahora = new Date();
  return this.find({
    estado: 'activa',
    'configuracion.sincronizacion.proximaSync': { $lte: ahora },
    'configuracion.sincronizacion.frecuencia': { $ne: 'manual' }
  });
};

// Método estático para obtener estadísticas generales
integrationSchema.statics.obtenerEstadisticas = async function() {
  const stats = await this.aggregate([
    {
      $facet: {
        general: [
          {
            $group: {
              _id: null,
              totalIntegraciones: { $sum: 1 },
              activas: {
                $sum: { $cond: [{ $eq: ['$estado', 'activa'] }, 1, 0] }
              },
              inactivas: {
                $sum: { $cond: [{ $eq: ['$estado', 'inactiva'] }, 1, 0] }
              },
              conError: {
                $sum: { $cond: [{ $eq: ['$estado', 'error'] }, 1, 0] }
              },
              configurando: {
                $sum: { $cond: [{ $eq: ['$estado', 'configurando'] }, 1, 0] }
              },
              disponibilidadPromedio: { $avg: '$rendimiento.disponibilidad' },
              tiempoRespuestaPromedio: { $avg: '$rendimiento.tiempoRespuestaPromedio' }
            }
          }
        ],
        porCategoria: [
          {
            $group: {
              _id: '$categoria',
              total: { $sum: 1 },
              activas: {
                $sum: { $cond: [{ $eq: ['$estado', 'activa'] }, 1, 0] }
              },
              inactivas: {
                $sum: { $cond: [{ $eq: ['$estado', 'inactiva'] }, 1, 0] }
              },
              errores: {
                $sum: { $cond: [{ $eq: ['$estado', 'error'] }, 1, 0] }
              }
            }
          },
          { $sort: { total: -1 } }
        ]
      }
    }
  ]);
  
  return stats[0];
};

module.exports = mongoose.model('Integration', integrationSchema);