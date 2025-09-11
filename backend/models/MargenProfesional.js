const mongoose = require('mongoose');

const margenProfesionalSchema = new mongoose.Schema({
  profesional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El profesional es obligatorio']
  },
  
  especialidad: {
    type: String,
    required: [true, 'La especialidad es obligatoria'],
    enum: {
      values: ['Endodoncia', 'Implantología', 'Preventiva', 'Prótesis', 'Ortodoncia', 'Cirugía', 'Estética', 'Periodoncia', 'Higiene Dental', 'Odontología General'],
      message: 'Especialidad no válida'
    }
  },
  
  periodo: {
    tipo: {
      type: String,
      enum: ['diario', 'semanal', 'mensual', 'trimestral', 'semestral', 'anual'],
      required: true
    },
    fechaInicio: {
      type: Date,
      required: true
    },
    fechaFin: {
      type: Date,
      required: true
    },
    descripcion: String // ej: "Enero 2024", "Q1 2024"
  },
  
  sede: {
    type: String,
    enum: ['centro', 'norte', 'sur', 'este', 'oeste'],
    required: [true, 'La sede es obligatoria']
  },
  
  costePorHora: {
    type: Number,
    required: [true, 'El coste por hora es obligatorio'],
    min: [0, 'El coste por hora no puede ser negativo']
  },
  
  horasTrabajadas: {
    type: Number,
    required: [true, 'Las horas trabajadas son obligatorias'],
    min: [0, 'Las horas trabajadas no pueden ser negativas']
  },
  
  horasProductivas: {
    type: Number,
    min: [0, 'Las horas productivas no pueden ser negativas']
  },
  
  tratamientosRealizados: {
    type: Number,
    required: [true, 'El número de tratamientos es obligatorio'],
    min: [0, 'Los tratamientos realizados no pueden ser negativos']
  },
  
  ingresosBrutos: {
    type: Number,
    required: [true, 'Los ingresos brutos son obligatorios'],
    min: [0, 'Los ingresos brutos no pueden ser negativos']
  },
  
  costesTotales: {
    type: Number,
    required: [true, 'Los costes totales son obligatorios'],
    min: [0, 'Los costes totales no pueden ser negativos']
  },
  
  margenNeto: {
    type: Number,
    required: true
  },
  
  margenPorcentaje: {
    type: Number,
    required: true,
    min: [0, 'El margen porcentaje no puede ser negativo']
  },
  
  eficiencia: {
    type: Number,
    required: [true, 'La eficiencia es obligatoria'],
    min: [0, 'La eficiencia no puede ser negativa'],
    max: [100, 'La eficiencia no puede exceder 100%']
  },
  
  detallesCostes: {
    salarioBase: { type: Number, default: 0 },
    comisiones: { type: Number, default: 0 },
    seguridadSocial: { type: Number, default: 0 },
    formacion: { type: Number, default: 0 },
    equipamiento: { type: Number, default: 0 },
    materiales: { type: Number, default: 0 },
    gastosIndirectos: { type: Number, default: 0 }
  },
  
  metricas: {
    ingresoPorHora: Number,
    ingresoPorTratamiento: Number,
    tiempoPromedioTratamiento: Number,
    pacientesAtendidos: Number,
    tasaRetencion: { type: Number, min: 0, max: 100 },
    satisfaccionPromedio: { type: Number, min: 1, max: 5 },
    tratamientosPorHora: Number
  },
  
  objetivos: {
    ingresosMeta: Number,
    margenMeta: Number,
    eficienciaMeta: Number,
    tratamientosMeta: Number,
    horasMeta: Number,
    cumplimientoGeneral: { type: Number, min: 0, max: 100 }
  },
  
  comparativas: {
    periodoAnterior: {
      ingresos: Number,
      margen: Number,
      eficiencia: Number,
      tratamientos: Number,
      variacionIngresos: Number,
      variacionMargen: Number,
      variacionEficiencia: Number
    },
    promedioEquipo: {
      ingresos: Number,
      margen: Number,
      eficiencia: Number,
      posicionRelativa: {
        type: String,
        enum: ['por_debajo', 'promedio', 'por_encima']
      }
    }
  },
  
  detallesTratamientos: [{
    tratamiento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CosteTratamiento'
    },
    cantidad: Number,
    tiempoTotal: Number,
    ingresoTotal: Number,
    margenTotal: Number,
    eficienciaPromedio: Number
  }],
  
  evaluaciones: [{
    fecha: { type: Date, default: Date.now },
    evaluador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    puntuacion: { type: Number, min: 1, max: 5 },
    competenciasTecnicas: { type: Number, min: 1, max: 5 },
    competenciasComerciales: { type: Number, min: 1, max: 5 },
    gestionTiempo: { type: Number, min: 1, max: 5 },
    satisfaccionPaciente: { type: Number, min: 1, max: 5 },
    comentarios: String,
    planMejora: String
  }],
  
  incentivos: {
    bonoProductividad: Number,
    bonoCalidad: Number,
    bonoRetencion: Number,
    totalIncentivos: Number,
    criteriosBonus: [{
      criterio: String,
      metaAlcanzada: Boolean,
      valorBonus: Number
    }]
  },
  
  estado: {
    type: String,
    enum: ['draft', 'calculado', 'revisado', 'aprobado', 'cerrado'],
    default: 'calculado'
  },
  
  observaciones: {
    type: String,
    maxlength: [1000, 'Las observaciones no pueden exceder 1000 caracteres']
  },
  
  calculadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  revisadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  fechaRevision: Date,
  
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
margenProfesionalSchema.index({ profesional: 1, 'periodo.fechaInicio': -1 });
margenProfesionalSchema.index({ especialidad: 1, sede: 1 });
margenProfesionalSchema.index({ 'periodo.tipo': 1, 'periodo.fechaInicio': -1 });
margenProfesionalSchema.index({ margenPorcentaje: -1 });
margenProfesionalSchema.index({ eficiencia: -1 });
margenProfesionalSchema.index({ estado: 1 });

// Virtual para el nombre del profesional
margenProfesionalSchema.virtual('nombreProfesional').get(function() {
  return this.profesional ? 
    `${this.profesional.nombre} ${this.profesional.apellidos}` : 
    null;
});

// Virtual para productividad por hora
margenProfesionalSchema.virtual('productividadHora').get(function() {
  return this.horasTrabajadas > 0 ? 
    this.ingresosBrutos / this.horasTrabajadas : 0;
});

// Virtual para coste por tratamiento
margenProfesionalSchema.virtual('costePorTratamiento').get(function() {
  return this.tratamientosRealizados > 0 ? 
    this.costesTotales / this.tratamientosRealizados : 0;
});

// Virtual para porcentaje horas productivas
margenProfesionalSchema.virtual('porcentajeHorasProductivas').get(function() {
  return this.horasTrabajadas > 0 && this.horasProductivas ? 
    (this.horasProductivas / this.horasTrabajadas) * 100 : 0;
});

// Middleware pre-save para cálculos automáticos
margenProfesionalSchema.pre('save', function(next) {
  // Calcular margen neto
  this.margenNeto = this.ingresosBrutos - this.costesTotales;
  
  // Calcular margen porcentaje
  this.margenPorcentaje = this.ingresosBrutos > 0 ? 
    (this.margenNeto / this.ingresosBrutos) * 100 : 0;
  
  // Calcular métricas automáticas
  if (this.metricas) {
    this.metricas.ingresoPorHora = this.horasTrabajadas > 0 ? 
      this.ingresosBrutos / this.horasTrabajadas : 0;
    
    this.metricas.ingresoPorTratamiento = this.tratamientosRealizados > 0 ? 
      this.ingresosBrutos / this.tratamientosRealizados : 0;
    
    this.metricas.tiempoPromedioTratamiento = this.tratamientosRealizados > 0 ? 
      (this.horasTrabajadas * 60) / this.tratamientosRealizados : 0;
    
    this.metricas.tratamientosPorHora = this.horasTrabajadas > 0 ? 
      this.tratamientosRealizados / this.horasTrabajadas : 0;
  }
  
  // Calcular total de incentivos
  if (this.incentivos) {
    this.incentivos.totalIncentivos = 
      (this.incentivos.bonoProductividad || 0) +
      (this.incentivos.bonoCalidad || 0) +
      (this.incentivos.bonoRetencion || 0);
  }
  
  // Calcular cumplimiento de objetivos
  if (this.objetivos) {
    let cumplimientos = [];
    
    if (this.objetivos.ingresosMeta) {
      cumplimientos.push(Math.min(100, (this.ingresosBrutos / this.objetivos.ingresosMeta) * 100));
    }
    
    if (this.objetivos.margenMeta) {
      cumplimientos.push(Math.min(100, (this.margenPorcentaje / this.objetivos.margenMeta) * 100));
    }
    
    if (this.objetivos.eficienciaMeta) {
      cumplimientos.push(Math.min(100, (this.eficiencia / this.objetivos.eficienciaMeta) * 100));
    }
    
    if (this.objetivos.tratamientosMeta) {
      cumplimientos.push(Math.min(100, (this.tratamientosRealizados / this.objetivos.tratamientosMeta) * 100));
    }
    
    if (cumplimientos.length > 0) {
      this.objetivos.cumplimientoGeneral = 
        cumplimientos.reduce((a, b) => a + b, 0) / cumplimientos.length;
    }
  }
  
  // Actualizar usuario modificador
  if (!this.isNew) {
    this.actualizadoPor = this.creadoPor;
  }
  
  next();
});

// Método para agregar evaluación
margenProfesionalSchema.methods.agregarEvaluacion = function(evaluacionData, evaluadorId) {
  const evaluacion = {
    ...evaluacionData,
    evaluador: evaluadorId,
    fecha: new Date()
  };
  
  this.evaluaciones.push(evaluacion);
  return this.save();
};

// Método para calcular comparativas con periodo anterior
margenProfesionalSchema.methods.calcularComparativas = async function() {
  const PeriodoAnterior = this.constructor;
  
  // Buscar periodo anterior
  const periodoAnterior = await PeriodoAnterior.findOne({
    profesional: this.profesional,
    'periodo.tipo': this.periodo.tipo,
    'periodo.fechaFin': { $lt: this.periodo.fechaInicio }
  }).sort({ 'periodo.fechaFin': -1 });
  
  if (periodoAnterior) {
    this.comparativas.periodoAnterior = {
      ingresos: periodoAnterior.ingresosBrutos,
      margen: periodoAnterior.margenPorcentaje,
      eficiencia: periodoAnterior.eficiencia,
      tratamientos: periodoAnterior.tratamientosRealizados,
      variacionIngresos: this.ingresosBrutos - periodoAnterior.ingresosBrutos,
      variacionMargen: this.margenPorcentaje - periodoAnterior.margenPorcentaje,
      variacionEficiencia: this.eficiencia - periodoAnterior.eficiencia
    };
  }
  
  // Calcular promedios del equipo
  const promediosEquipo = await PeriodoAnterior.aggregate([
    {
      $match: {
        sede: this.sede,
        'periodo.fechaInicio': this.periodo.fechaInicio,
        'periodo.fechaFin': this.periodo.fechaFin
      }
    },
    {
      $group: {
        _id: null,
        promedioIngresos: { $avg: '$ingresosBrutos' },
        promedioMargen: { $avg: '$margenPorcentaje' },
        promedioEficiencia: { $avg: '$eficiencia' }
      }
    }
  ]);
  
  if (promediosEquipo.length > 0) {
    const promedio = promediosEquipo[0];
    this.comparativas.promedioEquipo = {
      ingresos: promedio.promedioIngresos,
      margen: promedio.promedioMargen,
      eficiencia: promedio.promedioEficiencia,
      posicionRelativa: this.margenPorcentaje > promedio.promedioMargen ? 'por_encima' :
                       this.margenPorcentaje < promedio.promedioMargen ? 'por_debajo' : 'promedio'
    };
  }
  
  return this.save();
};

// Método estático para obtener ranking de profesionales
margenProfesionalSchema.statics.obtenerRanking = function(sede = null, especialidad = null, periodo = null) {
  const query = { estado: { $ne: 'draft' } };
  
  if (sede) query.sede = sede;
  if (especialidad) query.especialidad = especialidad;
  if (periodo) {
    query['periodo.tipo'] = periodo.tipo;
    query['periodo.fechaInicio'] = { $gte: new Date(periodo.fechaInicio) };
    query['periodo.fechaFin'] = { $lte: new Date(periodo.fechaFin) };
  }
  
  return this.find(query)
    .populate('profesional', 'nombre apellidos email')
    .sort({ margenPorcentaje: -1, eficiencia: -1 });
};

// Método estático para obtener estadísticas generales
margenProfesionalSchema.statics.obtenerEstadisticasGenerales = function(sede = null, periodo = null) {
  const query = { estado: { $ne: 'draft' } };
  
  if (sede) query.sede = sede;
  if (periodo) {
    query['periodo.fechaInicio'] = { $gte: new Date(periodo.fechaInicio) };
    query['periodo.fechaFin'] = { $lte: new Date(periodo.fechaFin) };
  }
  
  return this.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalProfesionales: { $sum: 1 },
        totalIngresos: { $sum: '$ingresosBrutos' },
        totalCostes: { $sum: '$costesTotales' },
        totalMargen: { $sum: '$margenNeto' },
        promedioMargen: { $avg: '$margenPorcentaje' },
        promedioEficiencia: { $avg: '$eficiencia' },
        totalTratamientos: { $sum: '$tratamientosRealizados' },
        totalHoras: { $sum: '$horasTrabajadas' },
        mejorMargen: { $max: '$margenPorcentaje' },
        mejorEficiencia: { $max: '$eficiencia' }
      }
    }
  ]);
};

// Método estático para análisis por especialidad
margenProfesionalSchema.statics.obtenerAnalisisPorEspecialidad = function(sede = null, periodo = null) {
  const query = { estado: { $ne: 'draft' } };
  
  if (sede) query.sede = sede;
  if (periodo) {
    query['periodo.fechaInicio'] = { $gte: new Date(periodo.fechaInicio) };
    query['periodo.fechaFin'] = { $lte: new Date(periodo.fechaFin) };
  }
  
  return this.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$especialidad',
        profesionales: { $sum: 1 },
        promedioIngresos: { $avg: '$ingresosBrutos' },
        promedioMargen: { $avg: '$margenPorcentaje' },
        promedioEficiencia: { $avg: '$eficiencia' },
        totalIngresos: { $sum: '$ingresosBrutos' },
        totalTratamientos: { $sum: '$tratamientosRealizados' },
        mejorProfesional: {
          $max: {
            margen: '$margenPorcentaje',
            nombre: '$nombreProfesional'
          }
        }
      }
    },
    { $sort: { totalIngresos: -1 } }
  ]);
};

// Método para aprobar margen
margenProfesionalSchema.methods.aprobar = function(usuarioId, observaciones = null) {
  this.estado = 'aprobado';
  this.revisadoPor = usuarioId;
  this.fechaRevision = new Date();
  if (observaciones) {
    this.observaciones = observaciones;
  }
  
  return this.save();
};

module.exports = mongoose.model('MargenProfesional', margenProfesionalSchema);