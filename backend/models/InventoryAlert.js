const mongoose = require('mongoose');

const inventoryAlertSchema = new mongoose.Schema({
  // Tipo de alerta
  tipo: {
    type: String,
    enum: [
      'stock_bajo',
      'stock_critico',
      'stock_agotado',
      'vencimiento_proximo',
      'vencido',
      'temperatura_alta',
      'temperatura_baja',
      'calidad_rechazada',
      'proveedor_retraso',
      'producto_descontinuado',
      'lote_retirado',
      'inventario_negativo'
    ],
    required: [true, 'El tipo de alerta es obligatorio']
  },
  // Información básica
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  // Referencias
  productoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'El producto es obligatorio']
  },
  productoNombre: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio']
  },
  productoCodigo: {
    type: String,
    required: [true, 'El código del producto es obligatorio']
  },
  loteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch'
  },
  numeroLote: String,
  // Prioridad de la alerta
  prioridad: {
    type: String,
    enum: ['baja', 'media', 'alta', 'critica'],
    required: [true, 'La prioridad es obligatoria'],
    default: 'media'
  },
  // Estado de la alerta
  estado: {
    type: String,
    enum: ['activa', 'leida', 'resuelta', 'ignorada', 'expirada'],
    default: 'activa'
  },
  // Fechas importantes
  fechaAlerta: {
    type: Date,
    required: [true, 'La fecha de alerta es obligatoria'],
    default: Date.now
  },
  fechaVencimiento: {
    type: Date // Para alertas con tiempo límite
  },
  fechaLectura: Date,
  fechaResolucion: Date,
  // Valores específicos de la alerta
  valores: {
    stockActual: Number,
    stockMinimo: Number,
    stockCritico: Number,
    cantidadLote: Number,
    fechaVencimientoLote: Date,
    temperaturaActual: Number,
    temperaturaMinima: Number,
    temperaturaMaxima: Number,
    diasParaVencer: Number
  },
  // Ubicación del problema
  ubicacion: {
    sede: String,
    zona: String,
    estante: String,
    nivel: String
  },
  // Información de seguimiento
  seguimiento: {
    notificacionEnviada: {
      type: Boolean,
      default: false
    },
    fechaNotificacion: Date,
    usuariosNotificados: [{
      usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      fecha: Date,
      metodo: {
        type: String,
        enum: ['email', 'sms', 'push', 'sistema']
      }
    }],
    recordatoriosEnviados: {
      type: Number,
      default: 0
    },
    ultimoRecordatorio: Date
  },
  // Acciones recomendadas
  accionesRecomendadas: [{
    accion: {
      type: String,
      required: true
    },
    descripcion: String,
    prioridad: {
      type: String,
      enum: ['baja', 'media', 'alta'],
      default: 'media'
    },
    completada: {
      type: Boolean,
      default: false
    },
    fechaCompletada: Date,
    responsable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  // Resolución de la alerta
  resolucion: {
    metodo: {
      type: String,
      enum: [
        'restock',
        'pedido_realizado',
        'producto_retirado',
        'lote_descartado',
        'temperatura_corregida',
        'proveedor_contactado',
        'inventario_ajustado',
        'otro'
      ]
    },
    descripcion: String,
    responsable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    documentos: [String], // URLs de documentos de soporte
    costoResolucion: Number
  },
  // Configuración de repetición
  configuracion: {
    esRecurrente: {
      type: Boolean,
      default: false
    },
    frecuencia: {
      type: String,
      enum: ['diaria', 'semanal', 'mensual', 'personalizada']
    },
    proximaEvaluacion: Date,
    autoResolver: {
      type: Boolean,
      default: false
    },
    condicionAutoResolucion: String
  },
  // Impacto de la alerta
  impacto: {
    nivel: {
      type: String,
      enum: ['bajo', 'medio', 'alto', 'critico'],
      default: 'medio'
    },
    descripcion: String,
    afectaOperaciones: {
      type: Boolean,
      default: false
    },
    afectaPacientes: {
      type: Boolean,
      default: false
    },
    costoEstimado: Number
  },
  // Etiquetas para categorización
  etiquetas: [{
    type: String,
    trim: true
  }],
  // Observaciones adicionales
  observaciones: {
    type: String,
    maxlength: [1000, 'Las observaciones no pueden exceder 1000 caracteres']
  },
  // Auditoría
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
  },
  // Sistema que generó la alerta
  origenSistema: {
    type: String,
    enum: ['automatico', 'manual', 'importado', 'api'],
    default: 'automatico'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimización
inventoryAlertSchema.index({ tipo: 1, estado: 1 });
inventoryAlertSchema.index({ productoId: 1, estado: 1 });
inventoryAlertSchema.index({ prioridad: 1, fechaAlerta: -1 });
inventoryAlertSchema.index({ estado: 1, fechaAlerta: -1 });
inventoryAlertSchema.index({ fechaVencimiento: 1, estado: 1 });
inventoryAlertSchema.index({ 'seguimiento.notificacionEnviada': 1 });
inventoryAlertSchema.index({ 'ubicacion.sede': 1, estado: 1 });
inventoryAlertSchema.index({ etiquetas: 1 });

// Virtual para verificar si está vencida
inventoryAlertSchema.virtual('estaVencida').get(function() {
  return this.fechaVencimiento && new Date() > this.fechaVencimiento;
});

// Virtual para calcular tiempo transcurrido
inventoryAlertSchema.virtual('tiempoTranscurrido').get(function() {
  const ahora = new Date();
  const diferencia = ahora - this.fechaAlerta;
  const horas = Math.floor(diferencia / (1000 * 60 * 60));
  const dias = Math.floor(horas / 24);
  
  if (dias > 0) {
    return `${dias} día${dias > 1 ? 's' : ''}`;
  } else {
    return `${horas} hora${horas !== 1 ? 's' : ''}`;
  }
});

// Virtual para obtener color de prioridad
inventoryAlertSchema.virtual('colorPrioridad').get(function() {
  const colores = {
    'baja': '#10B981', // green
    'media': '#F59E0B', // yellow
    'alta': '#EF4444', // red
    'critica': '#7C2D12' // dark red
  };
  return colores[this.prioridad] || colores.media;
});

// Virtual para obtener icono del tipo de alerta
inventoryAlertSchema.virtual('iconoTipo').get(function() {
  const iconos = {
    'stock_bajo': 'trending-down',
    'stock_critico': 'alert-triangle',
    'stock_agotado': 'x-circle',
    'vencimiento_proximo': 'clock',
    'vencido': 'alert-triangle',
    'temperatura_alta': 'thermometer',
    'temperatura_baja': 'thermometer',
    'calidad_rechazada': 'x-octagon',
    'proveedor_retraso': 'truck',
    'producto_descontinuado': 'archive',
    'lote_retirado': 'trash',
    'inventario_negativo': 'minus-circle'
  };
  return iconos[this.tipo] || 'alert-circle';
});

// Middleware pre-save para actualizar fecha de modificación
inventoryAlertSchema.pre('save', function(next) {
  this.fechaActualizacion = Date.now();
  
  // Auto-expirar alertas vencidas
  if (this.estaVencida && this.estado === 'activa') {
    this.estado = 'expirada';
  }
  
  // Actualizar fecha de lectura si cambia de activa a leida
  if (this.isModified('estado') && this.estado === 'leida' && !this.fechaLectura) {
    this.fechaLectura = new Date();
  }
  
  // Actualizar fecha de resolución
  if (this.isModified('estado') && this.estado === 'resuelta' && !this.fechaResolucion) {
    this.fechaResolucion = new Date();
  }
  
  next();
});

// Método para marcar como leída
inventoryAlertSchema.methods.marcarComoLeida = function(usuarioId) {
  this.estado = 'leida';
  this.fechaLectura = new Date();
  this.actualizadoPor = usuarioId;
  return this.save();
};

// Método para resolver alerta
inventoryAlertSchema.methods.resolver = function(metodo, descripcion, usuarioId, costoResolucion = 0) {
  this.estado = 'resuelta';
  this.fechaResolucion = new Date();
  this.resolucion = {
    metodo,
    descripcion,
    responsable: usuarioId,
    costoResolucion
  };
  this.actualizadoPor = usuarioId;
  return this.save();
};

// Método para ignorar alerta
inventoryAlertSchema.methods.ignorar = function(usuarioId, motivo = '') {
  this.estado = 'ignorada';
  this.observaciones = (this.observaciones || '') + `\nIgnorada: ${motivo}`;
  this.actualizadoPor = usuarioId;
  return this.save();
};

// Método para registrar notificación
inventoryAlertSchema.methods.registrarNotificacion = function(usuarioId, metodo = 'sistema') {
  if (!this.seguimiento.usuariosNotificados) {
    this.seguimiento.usuariosNotificados = [];
  }
  
  this.seguimiento.usuariosNotificados.push({
    usuario: usuarioId,
    fecha: new Date(),
    metodo
  });
  
  if (!this.seguimiento.notificacionEnviada) {
    this.seguimiento.notificacionEnviada = true;
    this.seguimiento.fechaNotificacion = new Date();
  }
  
  return this.save();
};

// Método para enviar recordatorio
inventoryAlertSchema.methods.enviarRecordatorio = function() {
  this.seguimiento.recordatoriosEnviados = (this.seguimiento.recordatoriosEnviados || 0) + 1;
  this.seguimiento.ultimoRecordatorio = new Date();
  return this.save();
};

// Método para información básica
inventoryAlertSchema.methods.toInfoBasica = function() {
  return {
    id: this._id,
    tipo: this.tipo,
    titulo: this.titulo,
    descripcion: this.descripcion,
    prioridad: this.prioridad,
    estado: this.estado,
    productoNombre: this.productoNombre,
    productoCodigo: this.productoCodigo,
    fechaAlerta: this.fechaAlerta,
    tiempoTranscurrido: this.tiempoTranscurrido,
    colorPrioridad: this.colorPrioridad,
    iconoTipo: this.iconoTipo
  };
};

// Método estático para crear alerta automática
inventoryAlertSchema.statics.crearAlerta = async function(datos) {
  const alerta = new this({
    tipo: datos.tipo,
    titulo: datos.titulo,
    descripcion: datos.descripcion,
    productoId: datos.productoId,
    productoNombre: datos.productoNombre,
    productoCodigo: datos.productoCodigo,
    loteId: datos.loteId,
    numeroLote: datos.numeroLote,
    prioridad: datos.prioridad || 'media',
    valores: datos.valores,
    ubicacion: datos.ubicacion,
    accionesRecomendadas: datos.accionesRecomendadas || [],
    etiquetas: datos.etiquetas || [],
    origenSistema: 'automatico'
  });
  
  return alerta.save();
};

// Método estático para obtener alertas activas
inventoryAlertSchema.statics.obtenerActivas = function(filtros = {}) {
  const filtro = { 
    estado: { $in: ['activa', 'leida'] },
    ...filtros
  };
  
  return this.find(filtro)
    .populate('productoId', 'nombre codigo categoria')
    .populate('loteId', 'numeroLote fechaVencimiento')
    .sort({ prioridad: -1, fechaAlerta: -1 });
};

// Método estático para obtener estadísticas
inventoryAlertSchema.statics.obtenerEstadisticas = async function() {
  const stats = await this.aggregate([
    {
      $facet: {
        general: [
          {
            $group: {
              _id: null,
              totalAlertas: { $sum: 1 },
              activas: {
                $sum: { $cond: [{ $eq: ['$estado', 'activa'] }, 1, 0] }
              },
              leidas: {
                $sum: { $cond: [{ $eq: ['$estado', 'leida'] }, 1, 0] }
              },
              resueltas: {
                $sum: { $cond: [{ $eq: ['$estado', 'resuelta'] }, 1, 0] }
              },
              criticas: {
                $sum: { $cond: [{ $eq: ['$prioridad', 'critica'] }, 1, 0] }
              },
              altas: {
                $sum: { $cond: [{ $eq: ['$prioridad', 'alta'] }, 1, 0] }
              }
            }
          }
        ],
        porTipo: [
          {
            $group: {
              _id: '$tipo',
              count: { $sum: 1 },
              activas: {
                $sum: { $cond: [{ $eq: ['$estado', 'activa'] }, 1, 0] }
              }
            }
          },
          { $sort: { count: -1 } }
        ],
        porPrioridad: [
          {
            $group: {
              _id: '$prioridad',
              count: { $sum: 1 },
              activas: {
                $sum: { $cond: [{ $eq: ['$estado', 'activa'] }, 1, 0] }
              }
            }
          },
          { $sort: { _id: 1 } }
        ]
      }
    }
  ]);
  
  return stats[0];
};

// Método estático para limpiar alertas expiradas
inventoryAlertSchema.statics.limpiarExpiradas = function() {
  return this.updateMany(
    {
      fechaVencimiento: { $lt: new Date() },
      estado: { $in: ['activa', 'leida'] }
    },
    { estado: 'expirada' }
  );
};

// Método estático para alertas por producto
inventoryAlertSchema.statics.obtenerPorProducto = function(productoId, soloActivas = true) {
  const filtro = { productoId };
  if (soloActivas) {
    filtro.estado = { $in: ['activa', 'leida'] };
  }
  
  return this.find(filtro).sort({ fechaAlerta: -1 });
};

module.exports = mongoose.model('InventoryAlert', inventoryAlertSchema);