const mongoose = require('mongoose');

const firmaSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['paciente', 'profesional', 'testigo', 'tutor_legal'],
    required: true
  },
  firmante: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'firmas.tipoRef',
    required: true
  },
  tipoRef: {
    type: String,
    enum: ['Patient', 'User'],
    required: true
  },
  nombreCompleto: {
    type: String,
    required: true
  },
  dni: {
    type: String,
    trim: true
  },
  fechaFirma: {
    type: Date,
    required: true
  },
  ip: {
    type: String,
    trim: true
  },
  dispositivo: {
    type: String,
    trim: true
  },
  ubicacion: {
    latitud: Number,
    longitud: Number,
    direccion: String
  },
  metodoFirma: {
    type: String,
    enum: ['digital', 'electronica', 'presencial', 'biometrica'],
    required: true
  },
  datosVerificacion: {
    hash: String,
    algoritmo: String,
    certificado: String,
    timestampServidor: Date
  },
  firmada: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const variableResueltaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  valor: mongoose.Schema.Types.Mixed,
  fechaModificacion: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const signedDocumentSchema = new mongoose.Schema({
  // Referencia a la plantilla utilizada
  plantilla: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentTemplate',
    required: [true, 'La referencia a la plantilla es obligatoria']
  },
  nombrePlantilla: {
    type: String,
    required: true
  },
  versionPlantilla: {
    type: String,
    required: true
  },

  // Información del paciente
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'La referencia al paciente es obligatoria']
  },
  nombrePaciente: {
    type: String,
    required: true
  },

  // Profesional responsable
  profesional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El profesional responsable es obligatorio']
  },
  nombreProfesional: {
    type: String,
    required: true
  },

  // Contenido del documento
  contenidoOriginal: {
    type: String,
    required: true
  },
  contenidoFinal: {
    type: String,
    required: true
  },

  // Variables resueltas en el documento
  variables: [variableResueltaSchema],

  // Estado del documento
  estado: {
    type: String,
    enum: ['pending', 'signed', 'expired', 'cancelled', 'invalid'],
    default: 'pending'
  },

  // Fechas importantes
  fechaCreacion: {
    type: Date,
    default: Date.now,
    required: true
  },
  fechaEnvio: Date,
  fechaVencimiento: Date,
  fechaFirmaCompleta: Date,
  fechaCancelacion: Date,

  // Firmas requeridas y realizadas
  firmas: [firmaSchema],

  // Configuración de acceso
  tokenAcceso: {
    type: String,
    unique: true,
    sparse: true
  },
  requiereAutenticacion: {
    type: Boolean,
    default: true
  },
  intentosFirma: {
    type: Number,
    default: 0,
    max: 5
  },

  // Información de tratamiento asociado
  tratamiento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Treatment'
  },
  presupuesto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget'
  },
  cita: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },

  // Archivos generados
  archivos: [{
    tipo: {
      type: String,
      enum: ['pdf_original', 'pdf_firmado', 'xml_signature', 'backup'],
      required: true
    },
    nombre: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    tamaño: Number,
    hash: String,
    fechaGeneracion: {
      type: Date,
      default: Date.now
    }
  }],

  // Configuración de notificaciones
  notificaciones: {
    recordatoriosEnviados: {
      type: Number,
      default: 0
    },
    ultimoRecordatorio: Date,
    proxRecordatorio: Date,
    emailsEnviados: [String],
    smsEnviados: [String]
  },

  // Metadatos legales
  aspectosLegales: {
    requiereTestigo: {
      type: Boolean,
      default: false
    },
    menorEdad: {
      type: Boolean,
      default: false
    },
    tutorLegal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient'
    },
    consentimientoInformado: {
      type: Boolean,
      default: true
    },
    baseJuridica: String,
    politicaPrivacidad: {
      aceptada: Boolean,
      fechaAceptacion: Date,
      version: String
    }
  },

  // Auditoría y trazabilidad
  auditoria: [{
    fecha: {
      type: Date,
      default: Date.now
    },
    accion: {
      type: String,
      enum: ['creacion', 'envio', 'visualizacion', 'intento_firma', 'firma_exitosa', 'recordatorio', 'cancelacion', 'expiracion'],
      required: true
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    detalles: String,
    ip: String,
    dispositivo: String
  }],

  // Sede donde se generó
  sede: {
    type: String,
    enum: ['centro', 'norte', 'sur', 'este', 'oeste'],
    required: [true, 'La sede es obligatoria']
  },

  // Idioma del documento
  idioma: {
    type: String,
    enum: ['es', 'ca', 'en'],
    default: 'es'
  },

  // Notas internas
  notasInternas: {
    type: String,
    maxlength: [1000, 'Las notas no pueden exceder 1000 caracteres']
  },

  // Control de versiones del documento firmado
  version: {
    type: String,
    default: '1.0'
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
signedDocumentSchema.index({ paciente: 1, estado: 1 });
signedDocumentSchema.index({ profesional: 1, fechaCreacion: -1 });
signedDocumentSchema.index({ plantilla: 1 });
signedDocumentSchema.index({ estado: 1, fechaVencimiento: 1 });
signedDocumentSchema.index({ tokenAcceso: 1 }, { sparse: true });
signedDocumentSchema.index({ sede: 1, fechaCreacion: -1 });

// Virtual para verificar si está completamente firmado
signedDocumentSchema.virtual('completamenteFirmado').get(function() {
  return this.firmas.every(firma => firma.firmada);
});

// Virtual para verificar si está vencido
signedDocumentSchema.virtual('estaVencido').get(function() {
  return this.fechaVencimiento && this.fechaVencimiento < new Date() && this.estado === 'pending';
});

// Virtual para obtener firmas pendientes
signedDocumentSchema.virtual('firmasPendientes').get(function() {
  return this.firmas.filter(firma => !firma.firmada);
});

// Virtual para tiempo restante
signedDocumentSchema.virtual('tiempoRestante').get(function() {
  if (!this.fechaVencimiento || this.estado !== 'pending') return null;
  
  const ahora = new Date();
  const vencimiento = new Date(this.fechaVencimiento);
  const diffTime = vencimiento - ahora;
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  
  return diffHours > 0 ? diffHours : 0;
});

// Middleware pre-save
signedDocumentSchema.pre('save', async function(next) {
  try {
    // Generar token de acceso si no existe
    if (!this.tokenAcceso) {
      const crypto = require('crypto');
      this.tokenAcceso = crypto.randomBytes(32).toString('hex');
    }

    // Actualizar información de plantilla si cambió la referencia
    if (this.isModified('plantilla') && this.plantilla) {
      const DocumentTemplate = mongoose.model('DocumentTemplate');
      const plantilla = await DocumentTemplate.findById(this.plantilla);
      if (plantilla) {
        this.nombrePlantilla = plantilla.nombre;
        this.versionPlantilla = plantilla.versionActual;
      }
    }

    // Actualizar información del paciente si cambió la referencia
    if (this.isModified('paciente') && this.paciente) {
      const Patient = mongoose.model('Patient');
      const paciente = await Patient.findById(this.paciente).select('nombre apellidos');
      if (paciente) {
        this.nombrePaciente = `${paciente.nombre} ${paciente.apellidos}`;
      }
    }

    // Actualizar información del profesional si cambió la referencia
    if (this.isModified('profesional') && this.profesional) {
      const User = mongoose.model('User');
      const profesional = await User.findById(this.profesional).select('nombre apellidos');
      if (profesional) {
        this.nombreProfesional = `${profesional.nombre} ${profesional.apellidos}`;
      }
    }

    // Verificar si todas las firmas están completas
    if (this.completamenteFirmado && this.estado === 'pending') {
      this.estado = 'signed';
      this.fechaFirmaCompleta = Date.now();
    }

    // Verificar si está vencido
    if (this.estaVencido && this.estado === 'pending') {
      this.estado = 'expired';
    }

    // Actualizar fecha de modificación
    this.fechaActualizacion = Date.now();

    next();
  } catch (error) {
    next(error);
  }
});

// Método para agregar firma
signedDocumentSchema.methods.agregarFirma = function(datosFirma, usuarioId) {
  // Buscar la firma pendiente del tipo especificado
  const firmaIndex = this.firmas.findIndex(f => 
    f.tipo === datosFirma.tipo && 
    f.firmante.toString() === datosFirma.firmante.toString() && 
    !f.firmada
  );

  if (firmaIndex === -1) {
    throw new Error('No se encontró una firma pendiente para este tipo y usuario');
  }

  // Actualizar la firma
  this.firmas[firmaIndex] = {
    ...this.firmas[firmaIndex],
    ...datosFirma,
    fechaFirma: Date.now(),
    firmada: true
  };

  // Registrar en auditoría
  this.auditoria.push({
    accion: 'firma_exitosa',
    usuario: usuarioId,
    detalles: `Firma ${datosFirma.tipo} completada por ${datosFirma.nombreCompleto}`,
    ip: datosFirma.ip,
    dispositivo: datosFirma.dispositivo
  });

  this.actualizadoPor = usuarioId;
  
  return this.save();
};

// Método para cancelar documento
signedDocumentSchema.methods.cancelar = function(usuarioId, motivo = '') {
  this.estado = 'cancelled';
  this.fechaCancelacion = Date.now();
  this.actualizadoPor = usuarioId;

  this.auditoria.push({
    accion: 'cancelacion',
    usuario: usuarioId,
    detalles: motivo || 'Documento cancelado',
    fecha: Date.now()
  });

  return this.save();
};

// Método para enviar recordatorio
signedDocumentSchema.methods.enviarRecordatorio = function(usuarioId) {
  this.notificaciones.recordatoriosEnviados += 1;
  this.notificaciones.ultimoRecordatorio = Date.now();
  
  // Programar próximo recordatorio (3 días)
  const proximoRecordatorio = new Date();
  proximoRecordatorio.setDate(proximoRecordatorio.getDate() + 3);
  this.notificaciones.proxRecordatorio = proximoRecordatorio;

  this.auditoria.push({
    accion: 'recordatorio',
    usuario: usuarioId,
    detalles: 'Recordatorio de firma enviado',
    fecha: Date.now()
  });

  return this.save();
};

// Método para registrar visualización
signedDocumentSchema.methods.registrarVisualizacion = function(usuarioId, ip, dispositivo) {
  this.auditoria.push({
    accion: 'visualizacion',
    usuario: usuarioId,
    detalles: 'Documento visualizado',
    ip,
    dispositivo,
    fecha: Date.now()
  });

  return this.save();
};

// Método para obtener resumen
signedDocumentSchema.methods.toResumen = function() {
  return {
    id: this._id,
    paciente: this.nombrePaciente,
    document: this.nombrePlantilla,
    signedDate: this.fechaFirmaCompleta || this.fechaCreacion,
    professional: this.nombreProfesional,
    status: this.estado,
    downloadUrl: this.archivos.find(a => a.tipo === 'pdf_firmado')?.url || null,
    firmasCompletadas: this.firmas.filter(f => f.firmada).length,
    firmasRequeridas: this.firmas.length,
    tiempoRestante: this.tiempoRestante,
    estaVencido: this.estaVencido
  };
};

// Método estático para buscar documentos
signedDocumentSchema.statics.buscarDocumentos = function(filtros = {}) {
  const query = {};

  if (filtros.paciente) {
    query.$or = [
      { nombrePaciente: { $regex: filtros.paciente, $options: 'i' } },
      { paciente: filtros.paciente }
    ];
  }

  if (filtros.estado) query.estado = filtros.estado;
  if (filtros.plantilla) query.plantilla = filtros.plantilla;
  if (filtros.profesional) query.profesional = filtros.profesional;
  if (filtros.sede) query.sede = filtros.sede;

  if (filtros.fechaDesde || filtros.fechaHasta) {
    query.fechaCreacion = {};
    if (filtros.fechaDesde) query.fechaCreacion.$gte = new Date(filtros.fechaDesde);
    if (filtros.fechaHasta) query.fechaCreacion.$lte = new Date(filtros.fechaHasta);
  }

  if (filtros.vencidos) {
    query.fechaVencimiento = { $lt: new Date() };
    query.estado = 'pending';
  }

  return this.find(query)
    .populate('paciente', 'nombre apellidos numeroHistoriaClinica email telefono')
    .populate('profesional', 'nombre apellidos especialidad')
    .populate('plantilla', 'nombre tipo categoria')
    .sort({ fechaCreacion: -1 });
};

// Método estático para obtener estadísticas
signedDocumentSchema.statics.obtenerEstadisticas = function(filtros = {}) {
  const matchStage = {};
  
  if (filtros.sede) matchStage.sede = filtros.sede;
  if (filtros.fechaDesde || filtros.fechaHasta) {
    matchStage.fechaCreacion = {};
    if (filtros.fechaDesde) matchStage.fechaCreacion.$gte = new Date(filtros.fechaDesde);
    if (filtros.fechaHasta) matchStage.fechaCreacion.$lte = new Date(filtros.fechaHasta);
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalDocumentos: { $sum: 1 },
        firmados: { $sum: { $cond: [{ $eq: ['$estado', 'signed'] }, 1, 0] } },
        pendientes: { $sum: { $cond: [{ $eq: ['$estado', 'pending'] }, 1, 0] } },
        vencidos: { $sum: { $cond: [{ $eq: ['$estado', 'expired'] }, 1, 0] } },
        cancelados: { $sum: { $cond: [{ $eq: ['$estado', 'cancelled'] }, 1, 0] } },
        tiempoPromedioFirma: { 
          $avg: { 
            $subtract: ['$fechaFirmaCompleta', '$fechaCreacion'] 
          } 
        },
        recordatoriosEnviados: { $sum: '$notificaciones.recordatoriosEnviados' }
      }
    }
  ]);
};

module.exports = mongoose.model('SignedDocument', signedDocumentSchema);