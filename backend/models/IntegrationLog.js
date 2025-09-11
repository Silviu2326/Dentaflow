const mongoose = require('mongoose');

const integrationLogSchema = new mongoose.Schema({
  // Referencia a la integración
  integracionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Integration',
    required: [true, 'La integración es obligatoria']
  },
  integracionNombre: {
    type: String,
    required: [true, 'El nombre de la integración es obligatorio']
  },
  integracionCategoria: {
    type: String,
    required: [true, 'La categoría de la integración es obligatoria']
  },
  // Tipo de evento/log
  tipo: {
    type: String,
    enum: [
      'sync',
      'error',
      'config',
      'auth',
      'conexion',
      'webhook',
      'mantenimiento',
      'alerta',
      'performance',
      'seguridad',
      'debug'
    ],
    required: [true, 'El tipo de log es obligatorio']
  },
  // Información del evento
  evento: {
    type: String,
    required: [true, 'El evento es obligatorio'],
    maxlength: [100, 'El evento no puede exceder 100 caracteres']
  },
  mensaje: {
    type: String,
    required: [true, 'El mensaje es obligatorio'],
    maxlength: [500, 'El mensaje no puede exceder 500 caracteres']
  },
  detalles: {
    type: String,
    maxlength: [2000, 'Los detalles no pueden exceder 2000 caracteres']
  },
  // Estado del evento
  estado: {
    type: String,
    enum: ['exito', 'warning', 'error', 'info'],
    required: [true, 'El estado es obligatorio']
  },
  // Información técnica
  codigo: {
    http: Number,
    error: String,
    interno: String
  },
  // Datos de la solicitud/respuesta
  solicitud: {
    metodo: String,
    url: String,
    headers: Map,
    parametros: mongoose.Schema.Types.Mixed,
    cuerpo: mongoose.Schema.Types.Mixed,
    tamaño: Number // bytes
  },
  respuesta: {
    codigo: Number,
    headers: Map,
    cuerpo: mongoose.Schema.Types.Mixed,
    tamaño: Number, // bytes
    tiempoRespuesta: Number // ms
  },
  // Contexto adicional
  contexto: {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sesion: String,
    ip: String,
    userAgent: String,
    ubicacion: String
  },
  // Información de rendimiento
  rendimiento: {
    inicio: Date,
    fin: Date,
    duracion: Number, // ms
    memoria: Number, // MB
    cpu: Number, // porcentaje
    red: {
      entrada: Number, // bytes
      salida: Number // bytes
    }
  },
  // Datos específicos del tipo de evento
  datosEvento: {
    // Para sincronizaciones
    sincronizacion: {
      registrosAfectados: Number,
      tipoOperacion: {
        type: String,
        enum: ['CREATE', 'UPDATE', 'DELETE', 'SYNC', 'IMPORT', 'EXPORT']
      },
      tablaAfectada: String,
      filtros: mongoose.Schema.Types.Mixed
    },
    // Para errores
    errorInfo: {
      linea: Number,
      archivo: String,
      funcion: String,
      stackTrace: String,
      esRecurrente: Boolean,
      vecesOcurrido: Number
    },
    // Para configuración
    configuracion: {
      campoModificado: String,
      valorAnterior: mongoose.Schema.Types.Mixed,
      valorNuevo: mongoose.Schema.Types.Mixed,
      validado: Boolean
    },
    // Para autenticación
    autenticacion: {
      metodo: String,
      exito: Boolean,
      tokenRenovado: Boolean,
      expiracion: Date
    }
  },
  // Clasificación de severidad
  severidad: {
    type: String,
    enum: ['critica', 'alta', 'media', 'baja', 'info'],
    default: 'media'
  },
  // Información de resolución (para errores)
  resolucion: {
    estado: {
      type: String,
      enum: ['pendiente', 'en_progreso', 'resuelto', 'no_resolvible'],
      default: 'pendiente'
    },
    fecha: Date,
    descripcion: String,
    responsable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    solucion: String,
    tiempoResolucion: Number // minutos
  },
  // Etiquetas para categorización
  etiquetas: [String],
  // Información de trazabilidad
  correlacionId: String, // Para rastrear eventos relacionados
  transaccionId: String, // Para agrupar operaciones
  // Información de notificación
  notificacion: {
    enviada: { type: Boolean, default: false },
    fecha: Date,
    destinatarios: [String],
    canales: [String] // email, sms, webhook, slack
  },
  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  // Retención de datos
  fechaExpiracion: Date,
  // Archivado
  archivado: {
    type: Boolean,
    default: false
  },
  fechaArchivo: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimización
integrationLogSchema.index({ integracionId: 1, timestamp: -1 });
integrationLogSchema.index({ tipo: 1, timestamp: -1 });
integrationLogSchema.index({ estado: 1, timestamp: -1 });
integrationLogSchema.index({ severidad: 1, timestamp: -1 });
integrationLogSchema.index({ timestamp: -1 });
integrationLogSchema.index({ correlacionId: 1 });
integrationLogSchema.index({ transaccionId: 1 });
integrationLogSchema.index({ fechaExpiracion: 1 });
integrationLogSchema.index({ archivado: 1, timestamp: -1 });
integrationLogSchema.index({ 'contexto.usuario': 1, timestamp: -1 });

// Virtual para calcular tiempo transcurrido
integrationLogSchema.virtual('tiempoTranscurrido').get(function() {
  const ahora = new Date();
  const diferencia = ahora - this.timestamp;
  const minutos = Math.floor(diferencia / (1000 * 60));
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  
  if (dias > 0) return `hace ${dias} día${dias > 1 ? 's' : ''}`;
  if (horas > 0) return `hace ${horas} hora${horas > 1 ? 's' : ''}`;
  if (minutos > 0) return `hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
  return 'hace un momento';
});

// Virtual para verificar si es reciente
integrationLogSchema.virtual('esReciente').get(function() {
  const ahora = new Date();
  const diferencia = ahora - this.timestamp;
  return diferencia < (24 * 60 * 60 * 1000); // 24 horas
});

// Virtual para obtener color de estado
integrationLogSchema.virtual('colorEstado').get(function() {
  const colores = {
    'exito': '#10B981', // green
    'warning': '#F59E0B', // yellow
    'error': '#EF4444', // red
    'info': '#3B82F6' // blue
  };
  return colores[this.estado] || colores.info;
});

// Virtual para obtener icono del tipo
integrationLogSchema.virtual('iconoTipo').get(function() {
  const iconos = {
    'sync': 'refresh-cw',
    'error': 'alert-triangle',
    'config': 'settings',
    'auth': 'key',
    'conexion': 'wifi',
    'webhook': 'zap',
    'mantenimiento': 'tool',
    'alerta': 'bell',
    'performance': 'activity',
    'seguridad': 'shield',
    'debug': 'bug'
  };
  return iconos[this.tipo] || 'info';
});

// Middleware pre-save para configurar expiración y validaciones
integrationLogSchema.pre('save', function(next) {
  // Configurar fecha de expiración si no existe (90 días por defecto)
  if (!this.fechaExpiracion) {
    const fechaExp = new Date();
    fechaExp.setDate(fechaExp.getDate() + 90);
    this.fechaExpiracion = fechaExp;
  }
  
  // Calcular duración si tenemos inicio y fin
  if (this.rendimiento.inicio && this.rendimiento.fin) {
    this.rendimiento.duracion = this.rendimiento.fin - this.rendimiento.inicio;
  }
  
  // Generar ID de correlación si no existe
  if (!this.correlacionId) {
    this.correlacionId = `${this.integracionId}_${Date.now()}`;
  }
  
  next();
});

// Método para marcar como resuelto
integrationLogSchema.methods.marcarComoResuelto = function(descripcion, responsable, solucion) {
  this.resolucion = {
    estado: 'resuelto',
    fecha: new Date(),
    descripcion,
    responsable,
    solucion,
    tiempoResolucion: Math.floor((new Date() - this.timestamp) / (1000 * 60))
  };
  return this.save();
};

// Método para archivar
integrationLogSchema.methods.archivar = function() {
  this.archivado = true;
  this.fechaArchivo = new Date();
  return this.save();
};

// Método para enviar notificación
integrationLogSchema.methods.enviarNotificacion = function(destinatarios, canales) {
  this.notificacion = {
    enviada: true,
    fecha: new Date(),
    destinatarios,
    canales
  };
  return this.save();
};

// Método para información básica
integrationLogSchema.methods.toInfoBasica = function() {
  return {
    id: this._id,
    integracionNombre: this.integracionNombre,
    tipo: this.tipo,
    evento: this.evento,
    mensaje: this.mensaje,
    estado: this.estado,
    timestamp: this.timestamp,
    tiempoTranscurrido: this.tiempoTranscurrido,
    severidad: this.severidad,
    colorEstado: this.colorEstado,
    iconoTipo: this.iconoTipo
  };
};

// Método estático para crear log de sincronización
integrationLogSchema.statics.crearLogSincronizacion = function(integracion, exito, detalles = {}) {
  return this.create({
    integracionId: integracion._id,
    integracionNombre: integracion.nombre,
    integracionCategoria: integracion.categoria,
    tipo: 'sync',
    evento: 'sincronizacion',
    mensaje: exito ? 'Sincronización completada exitosamente' : 'Error en sincronización',
    estado: exito ? 'exito' : 'error',
    detalles: detalles.descripcion || '',
    datosEvento: {
      sincronizacion: {
        registrosAfectados: detalles.registros || 0,
        tipoOperacion: detalles.operacion || 'SYNC',
        tablaAfectada: detalles.tabla || ''
      }
    },
    rendimiento: {
      duracion: detalles.duracion || 0
    },
    severidad: exito ? 'info' : 'media'
  });
};

// Método estático para crear log de error
integrationLogSchema.statics.crearLogError = function(integracion, error, contexto = {}) {
  return this.create({
    integracionId: integracion._id,
    integracionNombre: integracion.nombre,
    integracionCategoria: integracion.categoria,
    tipo: 'error',
    evento: 'error_sistema',
    mensaje: error.message || 'Error no especificado',
    estado: 'error',
    detalles: error.stack || '',
    codigo: {
      error: error.code || 'UNKNOWN',
      http: error.statusCode || 500
    },
    datosEvento: {
      errorInfo: {
        stackTrace: error.stack,
        esRecurrente: false,
        vecesOcurrido: 1
      }
    },
    contexto,
    severidad: 'alta'
  });
};

// Método estático para obtener estadísticas
integrationLogSchema.statics.obtenerEstadisticas = async function(integracionId = null, fechaDesde = null, fechaHasta = null) {
  let filtro = {};
  
  if (integracionId) {
    filtro.integracionId = integracionId;
  }
  
  if (fechaDesde || fechaHasta) {
    filtro.timestamp = {};
    if (fechaDesde) filtro.timestamp.$gte = new Date(fechaDesde);
    if (fechaHasta) filtro.timestamp.$lte = new Date(fechaHasta);
  }
  
  const stats = await this.aggregate([
    { $match: filtro },
    {
      $facet: {
        general: [
          {
            $group: {
              _id: null,
              totalLogs: { $sum: 1 },
              exitosos: {
                $sum: { $cond: [{ $eq: ['$estado', 'exito'] }, 1, 0] }
              },
              errores: {
                $sum: { $cond: [{ $eq: ['$estado', 'error'] }, 1, 0] }
              },
              warnings: {
                $sum: { $cond: [{ $eq: ['$estado', 'warning'] }, 1, 0] }
              },
              tiempoPromedioRespuesta: {
                $avg: '$rendimiento.duracion'
              }
            }
          }
        ],
        porTipo: [
          {
            $group: {
              _id: '$tipo',
              count: { $sum: 1 },
              errores: {
                $sum: { $cond: [{ $eq: ['$estado', 'error'] }, 1, 0] }
              }
            }
          },
          { $sort: { count: -1 } }
        ],
        porIntegracion: [
          {
            $group: {
              _id: '$integracionId',
              integracionNombre: { $first: '$integracionNombre' },
              count: { $sum: 1 },
              errores: {
                $sum: { $cond: [{ $eq: ['$estado', 'error'] }, 1, 0] }
              }
            }
          },
          { $sort: { count: -1 } }
        ]
      }
    }
  ]);
  
  return stats[0];
};

// Método estático para limpiar logs expirados
integrationLogSchema.statics.limpiarExpirados = function() {
  return this.deleteMany({
    fechaExpiracion: { $lt: new Date() },
    archivado: false
  });
};

// Método estático para obtener logs recientes por integración
integrationLogSchema.statics.obtenerRecientes = function(integracionId, limite = 50) {
  return this.find({ integracionId })
    .sort({ timestamp: -1 })
    .limit(limite)
    .populate('contexto.usuario', 'nombre apellidos')
    .populate('resolucion.responsable', 'nombre apellidos');
};

module.exports = mongoose.model('IntegrationLog', integrationLogSchema);