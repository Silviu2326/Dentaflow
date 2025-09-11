const CosteTratamiento = require('../models/CosteTratamiento');
const MargenProfesional = require('../models/MargenProfesional');
const CosteMaterial = require('../models/CosteMaterial');
const User = require('../models/User');

// ============ COSTES DE TRATAMIENTOS ============

// @desc    Obtener todos los costes de tratamientos
// @route   GET /api/costes/tratamientos
// @access  Private
const getCostesTratamientos = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      categoria, 
      sede, 
      profesional,
      search,
      sortBy = 'margenPorcentaje',
      sortOrder = 'desc'
    } = req.query;

    const query = { 'configuracion.activo': true };

    // Filtros
    if (categoria && categoria !== 'todas') query.categoria = categoria;
    if (sede) query.sede = sede;
    if (profesional) query.profesionalPrincipal = profesional;

    // Búsqueda
    if (search) {
      query.$or = [
        { tratamiento: { $regex: search, $options: 'i' } },
        { categoria: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
      populate: {
        path: 'profesionalPrincipal',
        select: 'nombre apellidos especialidad'
      }
    };

    const tratamientos = await CosteTratamiento.paginate(query, options);

    res.json({
      success: true,
      data: tratamientos
    });
  } catch (error) {
    console.error('Error al obtener costes tratamientos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Obtener coste de tratamiento por ID
// @route   GET /api/costes/tratamientos/:id
// @access  Private
const getCosteTratamientoById = async (req, res) => {
  try {
    const tratamiento = await CosteTratamiento.findById(req.params.id)
      .populate('profesionalPrincipal', 'nombre apellidos especialidad email')
      .populate('creadoPor', 'nombre apellidos')
      .populate('actualizadoPor', 'nombre apellidos')
      .populate('historialCambios.usuario', 'nombre apellidos');

    if (!tratamiento) {
      return res.status(404).json({
        success: false,
        message: 'Tratamiento no encontrado'
      });
    }

    res.json({
      success: true,
      data: tratamiento
    });
  } catch (error) {
    console.error('Error al obtener tratamiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Crear nuevo coste de tratamiento
// @route   POST /api/costes/tratamientos
// @access  Private
const createCosteTratamiento = async (req, res) => {
  try {
    const {
      tratamiento,
      categoria,
      duracionMinutos,
      costeMaterial,
      costeManoObra,
      precioVenta,
      profesionalPrincipal,
      sede,
      costesDetallados,
      competencia,
      configuracion,
      observaciones
    } = req.body;

    // Verificar que el profesional existe
    const profesional = await User.findById(profesionalPrincipal);
    if (!profesional) {
      return res.status(400).json({
        success: false,
        message: 'Profesional no encontrado'
      });
    }

    const costeTratamiento = await CosteTratamiento.create({
      tratamiento,
      categoria,
      duracionMinutos,
      costeMaterial: parseFloat(costeMaterial),
      costeManoObra: parseFloat(costeManoObra),
      precioVenta: parseFloat(precioVenta),
      profesionalPrincipal,
      sede,
      costesDetallados: costesDetallados || {},
      competencia: competencia || {},
      configuracion: configuracion || {},
      observaciones,
      creadoPor: req.user._id
    });

    const tratamientoCreado = await CosteTratamiento.findById(costeTratamiento._id)
      .populate('profesionalPrincipal', 'nombre apellidos especialidad');

    res.status(201).json({
      success: true,
      data: tratamientoCreado,
      message: 'Coste de tratamiento creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear coste tratamiento:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Actualizar coste de tratamiento
// @route   PUT /api/costes/tratamientos/:id
// @access  Private
const updateCosteTratamiento = async (req, res) => {
  try {
    const tratamiento = await CosteTratamiento.findById(req.params.id);

    if (!tratamiento) {
      return res.status(404).json({
        success: false,
        message: 'Tratamiento no encontrado'
      });
    }

    // Registrar cambios en historial
    const camposACambiar = [
      'costeMaterial', 'costeManoObra', 'precioVenta', 'duracionMinutos'
    ];

    for (const campo of camposACambiar) {
      if (req.body[campo] !== undefined && req.body[campo] !== tratamiento[campo]) {
        await tratamiento.registrarCambio(
          campo,
          tratamiento[campo],
          req.body[campo],
          req.user._id,
          'Actualización manual'
        );
      }
    }

    // Actualizar campos
    Object.assign(tratamiento, req.body);
    tratamiento.actualizadoPor = req.user._id;

    await tratamiento.save();

    const tratamientoActualizado = await CosteTratamiento.findById(req.params.id)
      .populate('profesionalPrincipal', 'nombre apellidos especialidad');

    res.json({
      success: true,
      data: tratamientoActualizado,
      message: 'Tratamiento actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar tratamiento:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Obtener análisis por categoría
// @route   GET /api/costes/tratamientos/analisis/categoria
// @access  Private
const getAnalisisPorCategoria = async (req, res) => {
  try {
    const { sede, fechaInicio, fechaFin } = req.query;

    const analisis = await CosteTratamiento.obtenerAnalisisPorCategoria(
      sede,
      fechaInicio,
      fechaFin
    );

    res.json({
      success: true,
      data: analisis
    });
  } catch (error) {
    console.error('Error al obtener análisis por categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// ============ MÁRGENES PROFESIONALES ============

// @desc    Obtener márgenes profesionales
// @route   GET /api/costes/profesionales
// @access  Private
const getMargenesProfesionales = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      sede, 
      especialidad, 
      periodo,
      sortBy = 'margenPorcentaje',
      sortOrder = 'desc'
    } = req.query;

    const query = { estado: { $ne: 'draft' } };

    if (sede) query.sede = sede;
    if (especialidad) query.especialidad = especialidad;
    
    if (periodo) {
      const [año, mes] = periodo.split('-');
      const fechaInicio = new Date(parseInt(año), parseInt(mes) - 1, 1);
      const fechaFin = new Date(parseInt(año), parseInt(mes), 0);
      
      query['periodo.fechaInicio'] = { $gte: fechaInicio };
      query['periodo.fechaFin'] = { $lte: fechaFin };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
      populate: [
        { path: 'profesional', select: 'nombre apellidos especialidad email' },
        { path: 'calculadoPor', select: 'nombre apellidos' },
        { path: 'revisadoPor', select: 'nombre apellidos' }
      ]
    };

    const margenes = await MargenProfesional.paginate(query, options);

    res.json({
      success: true,
      data: margenes
    });
  } catch (error) {
    console.error('Error al obtener márgenes profesionales:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Crear margen profesional
// @route   POST /api/costes/profesionales
// @access  Private
const createMargenProfesional = async (req, res) => {
  try {
    const {
      profesional,
      especialidad,
      periodo,
      sede,
      costePorHora,
      horasTrabajadas,
      tratamientosRealizados,
      ingresosBrutos,
      costesTotales,
      eficiencia,
      detallesCostes,
      metricas,
      objetivos,
      observaciones
    } = req.body;

    const margen = await MargenProfesional.create({
      profesional,
      especialidad,
      periodo,
      sede,
      costePorHora: parseFloat(costePorHora),
      horasTrabajadas: parseFloat(horasTrabajadas),
      tratamientosRealizados: parseInt(tratamientosRealizados),
      ingresosBrutos: parseFloat(ingresosBrutos),
      costesTotales: parseFloat(costesTotales),
      eficiencia: parseFloat(eficiencia),
      detallesCostes: detallesCostes || {},
      metricas: metricas || {},
      objetivos: objetivos || {},
      observaciones,
      calculadoPor: req.user._id,
      creadoPor: req.user._id
    });

    // Calcular comparativas
    await margen.calcularComparativas();

    const margenCreado = await MargenProfesional.findById(margen._id)
      .populate('profesional', 'nombre apellidos especialidad');

    res.status(201).json({
      success: true,
      data: margenCreado,
      message: 'Margen profesional creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear margen profesional:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Obtener ranking de profesionales
// @route   GET /api/costes/profesionales/ranking
// @access  Private
const getRankingProfesionales = async (req, res) => {
  try {
    const { sede, especialidad, periodo } = req.query;

    let filtrosPeriodo = null;
    if (periodo) {
      const [año, mes] = periodo.split('-');
      filtrosPeriodo = {
        tipo: 'mensual',
        fechaInicio: new Date(parseInt(año), parseInt(mes) - 1, 1).toISOString(),
        fechaFin: new Date(parseInt(año), parseInt(mes), 0).toISOString()
      };
    }

    const ranking = await MargenProfesional.obtenerRanking(
      sede,
      especialidad,
      filtrosPeriodo
    );

    res.json({
      success: true,
      data: ranking
    });
  } catch (error) {
    console.error('Error al obtener ranking:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Obtener estadísticas generales
// @route   GET /api/costes/profesionales/estadisticas
// @access  Private
const getEstadisticasGenerales = async (req, res) => {
  try {
    const { sede, periodo } = req.query;

    let filtrosPeriodo = null;
    if (periodo) {
      const [año, mes] = periodo.split('-');
      filtrosPeriodo = {
        fechaInicio: new Date(parseInt(año), parseInt(mes) - 1, 1).toISOString(),
        fechaFin: new Date(parseInt(año), parseInt(mes), 0).toISOString()
      };
    }

    const estadisticas = await MargenProfesional.obtenerEstadisticasGenerales(
      sede,
      filtrosPeriodo
    );

    res.json({
      success: true,
      data: estadisticas[0] || {}
    });
  } catch (error) {
    console.error('Error al obtener estadísticas generales:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// ============ COSTES DE MATERIALES ============

// @desc    Obtener costes de materiales
// @route   GET /api/costes/materiales
// @access  Private
const getCostesMateriales = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      categoria, 
      sede, 
      proveedor,
      tratamiento,
      search,
      fechaInicio,
      fechaFin,
      sortBy = 'costeTotal',
      sortOrder = 'desc'
    } = req.query;

    const query = { estado: 'activo' };

    // Filtros
    if (categoria && categoria !== 'todas') query.categoria = categoria;
    if (sede) query.sede = sede;
    if (proveedor) query.proveedor = proveedor;
    if (tratamiento) query.tratamiento = tratamiento;

    // Filtro de fechas
    if (fechaInicio || fechaFin) {
      query.fecha = {};
      if (fechaInicio) query.fecha.$gte = new Date(fechaInicio);
      if (fechaFin) query.fecha.$lte = new Date(fechaFin);
    }

    // Búsqueda
    if (search) {
      query.$or = [
        { material: { $regex: search, $options: 'i' } },
        { categoria: { $regex: search, $options: 'i' } },
        { proveedor: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
      populate: {
        path: 'tratamiento',
        select: 'tratamiento categoria'
      }
    };

    const materiales = await CosteMaterial.paginate(query, options);

    res.json({
      success: true,
      data: materiales
    });
  } catch (error) {
    console.error('Error al obtener costes materiales:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Crear coste de material
// @route   POST /api/costes/materiales
// @access  Private
const createCosteMaterial = async (req, res) => {
  try {
    const {
      material,
      categoria,
      precioUnitario,
      cantidadUsada,
      unidadMedida,
      proveedor,
      tratamiento,
      sede,
      lote,
      inventario,
      calidad,
      observaciones
    } = req.body;

    const costeMaterial = await CosteMaterial.create({
      material,
      categoria,
      precioUnitario: parseFloat(precioUnitario),
      cantidadUsada: parseFloat(cantidadUsada),
      unidadMedida: unidadMedida || 'unidad',
      proveedor,
      tratamiento,
      sede,
      lote: lote || {},
      inventario: inventario || {},
      calidad: calidad || {},
      observaciones,
      creadoPor: req.user._id
    });

    const materialCreado = await CosteMaterial.findById(costeMaterial._id)
      .populate('tratamiento', 'tratamiento categoria');

    res.status(201).json({
      success: true,
      data: materialCreado,
      message: 'Coste de material creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear coste material:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Obtener análisis de materiales por categoría
// @route   GET /api/costes/materiales/analisis/categoria
// @access  Private
const getAnalisisMaterialesPorCategoria = async (req, res) => {
  try {
    const { sede, fechaInicio, fechaFin } = req.query;

    const analisis = await CosteMaterial.obtenerAnalisisPorCategoria(
      sede,
      fechaInicio,
      fechaFin
    );

    res.json({
      success: true,
      data: analisis
    });
  } catch (error) {
    console.error('Error al obtener análisis por categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Obtener análisis por proveedor
// @route   GET /api/costes/materiales/analisis/proveedor
// @access  Private
const getAnalisisPorProveedor = async (req, res) => {
  try {
    const { sede, fechaInicio, fechaFin } = req.query;

    let periodo = null;
    if (fechaInicio && fechaFin) {
      periodo = { fechaInicio, fechaFin };
    }

    const analisis = await CosteMaterial.obtenerAnalisisPorProveedor(sede, periodo);

    res.json({
      success: true,
      data: analisis
    });
  } catch (error) {
    console.error('Error al obtener análisis por proveedor:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Obtener materiales con stock bajo
// @route   GET /api/costes/materiales/stock-bajo
// @access  Private
const getMaterialesStockBajo = async (req, res) => {
  try {
    const { sede } = req.query;

    const materiales = await CosteMaterial.obtenerStockBajo(sede);

    res.json({
      success: true,
      data: materiales
    });
  } catch (error) {
    console.error('Error al obtener materiales con stock bajo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// ============ DASHBOARD Y ANÁLISIS GENERALES ============

// @desc    Obtener dashboard de costes
// @route   GET /api/costes/dashboard
// @access  Private
const getDashboardCostes = async (req, res) => {
  try {
    const { sede, periodo } = req.query;

    // Estadísticas de tratamientos
    const [
      estatsTratamientos,
      estatsProfesionales,
      estatsMateriales,
      tratamientosMasRentables,
      materialesAltoConsumo
    ] = await Promise.all([
      // Tratamientos más rentables
      CosteTratamiento.obtenerMasRentables(5, sede),
      
      // Estadísticas profesionales
      MargenProfesional.obtenerEstadisticasGenerales(sede, periodo ? {
        fechaInicio: new Date(periodo + '-01'),
        fechaFin: new Date(new Date(periodo + '-01').getFullYear(), new Date(periodo + '-01').getMonth() + 1, 0)
      } : null),
      
      // Análisis de materiales por categoría
      CosteMaterial.obtenerAnalisisPorCategoria(sede),
      
      // Top tratamientos por rentabilidad
      CosteTratamiento.aggregate([
        { 
          $match: { 
            'configuracion.activo': true,
            ...(sede && { sede })
          } 
        },
        { 
          $group: {
            _id: null,
            totalTratamientos: { $sum: 1 },
            margenPromedio: { $avg: '$margenPorcentaje' },
            ingresoTotal: { $sum: '$precioVenta' },
            costoTotal: { $sum: '$costeTotal' },
            mejorTratamiento: { $max: { tratamiento: '$tratamiento', margen: '$margenPorcentaje' } }
          }
        }
      ]),
      
      // Materiales de alto consumo
      CosteMaterial.aggregate([
        { 
          $match: { 
            estado: 'activo',
            ...(sede && { sede })
          } 
        },
        { $sort: { costeTotal: -1 } },
        { $limit: 5 }
      ])
    ]);

    const dashboard = {
      tratamientos: {
        masRentables: tratamientosMasRentables,
        estadisticas: estatsTratamientos[0] || {}
      },
      profesionales: {
        estadisticas: estatsProfesionales[0] || {}
      },
      materiales: {
        analisisPorCategoria: estatsMateriales,
        altoConsumo: materialesAltoConsumo
      },
      resumen: {
        fecha: new Date(),
        sede: sede || 'todas'
      }
    };

    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error('Error al obtener dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  // Tratamientos
  getCostesTratamientos,
  getCosteTratamientoById,
  createCosteTratamiento,
  updateCosteTratamiento,
  getAnalisisPorCategoria,
  
  // Profesionales
  getMargenesProfesionales,
  createMargenProfesional,
  getRankingProfesionales,
  getEstadisticasGenerales,
  
  // Materiales
  getCostesMateriales,
  createCosteMaterial,
  getAnalisisMaterialesPorCategoria,
  getAnalisisPorProveedor,
  getMaterialesStockBajo,
  
  // Dashboard
  getDashboardCostes
};