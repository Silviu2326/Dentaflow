const Treatment = require('../models/Treatment');

// @desc    Obtener todos los tratamientos
// @route   GET /api/treatments
// @access  Private
const getTreatments = async (req, res) => {
  try {
    const {
      search,
      categoria,
      activo,
      precioMin,
      precioMax,
      complejidad,
      page = 1,
      limit = 10,
      sort = 'nombre'
    } = req.query;

    // Construir filtro de búsqueda
    let filter = {};

    if (search) {
      filter.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } },
        { codigoInterno: { $regex: search, $options: 'i' } }
      ];
    }

    if (categoria && categoria !== 'todos') {
      filter.categoria = categoria;
    }

    if (activo !== undefined) {
      filter.activo = activo === 'true';
    }

    if (precioMin || precioMax) {
      filter.precio = {};
      if (precioMin) filter.precio.$gte = parseFloat(precioMin);
      if (precioMax) filter.precio.$lte = parseFloat(precioMax);
    }

    if (complejidad) {
      filter.complejidad = complejidad;
    }

    // Configurar paginación
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Configurar ordenamiento
    let sortOption = {};
    if (sort) {
      const sortFields = sort.split(',');
      sortFields.forEach(field => {
        if (field.startsWith('-')) {
          sortOption[field.substring(1)] = -1;
        } else {
          sortOption[field] = 1;
        }
      });
    }

    // Ejecutar consulta
    const treatments = await Treatment.find(filter)
      .sort(sortOption)
      .limit(limitNumber)
      .skip(skip)
      .populate('creadoPor', 'nombre apellidos')
      .populate('actualizadoPor', 'nombre apellidos');

    // Contar total de documentos
    const total = await Treatment.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: treatments.length,
      total,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber),
        hasNext: pageNumber < Math.ceil(total / limitNumber),
        hasPrev: pageNumber > 1
      },
      data: treatments
    });
  } catch (error) {
    console.error('Error al obtener tratamientos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Obtener tratamiento por ID
// @route   GET /api/treatments/:id
// @access  Private
const getTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id)
      .populate('creadoPor', 'nombre apellidos')
      .populate('actualizadoPor', 'nombre apellidos');

    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: 'Tratamiento no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: treatment
    });
  } catch (error) {
    console.error('Error al obtener tratamiento:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de tratamiento inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Crear nuevo tratamiento
// @route   POST /api/treatments
// @access  Private
const createTreatment = async (req, res) => {
  try {
    const {
      nombre,
      categoria,
      precio,
      duracion,
      materiales,
      descripcion,
      codigoInterno,
      requiereConsentimiento,
      especialidadRequerida,
      complejidad,
      instrucciones,
      costoMateriales,
      margenBeneficio
    } = req.body;

    // Verificar si ya existe un tratamiento con el mismo nombre
    const existingTreatment = await Treatment.findOne({ 
      nombre: { $regex: new RegExp(`^${nombre}$`, 'i') },
      activo: true
    });

    if (existingTreatment) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un tratamiento con ese nombre'
      });
    }

    // Verificar código interno único si se proporciona
    if (codigoInterno) {
      const existingCode = await Treatment.findOne({ codigoInterno });
      if (existingCode) {
        return res.status(400).json({
          success: false,
          message: 'El código interno ya está en uso'
        });
      }
    }

    // Crear tratamiento
    const treatment = await Treatment.create({
      nombre,
      categoria,
      precio,
      duracion,
      materiales: materiales || [],
      descripcion,
      codigoInterno,
      requiereConsentimiento: requiereConsentimiento || false,
      especialidadRequerida,
      complejidad: complejidad || 'media',
      instrucciones,
      costoMateriales: costoMateriales || 0,
      margenBeneficio,
      creadoPor: req.user._id,
      actualizadoPor: req.user._id
    });

    // Poblar campos de usuario
    await treatment.populate('creadoPor', 'nombre apellidos');

    res.status(201).json({
      success: true,
      message: 'Tratamiento creado exitosamente',
      data: treatment
    });
  } catch (error) {
    console.error('Error al crear tratamiento:', error);

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
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Actualizar tratamiento
// @route   PUT /api/treatments/:id
// @access  Private
const updateTreatment = async (req, res) => {
  try {
    let treatment = await Treatment.findById(req.params.id);

    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: 'Tratamiento no encontrado'
      });
    }

    // Verificar nombre único si se está cambiando
    if (req.body.nombre && req.body.nombre !== treatment.nombre) {
      const existingTreatment = await Treatment.findOne({
        nombre: { $regex: new RegExp(`^${req.body.nombre}$`, 'i') },
        _id: { $ne: req.params.id },
        activo: true
      });

      if (existingTreatment) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un tratamiento con ese nombre'
        });
      }
    }

    // Verificar código interno único si se está cambiando
    if (req.body.codigoInterno && req.body.codigoInterno !== treatment.codigoInterno) {
      const existingCode = await Treatment.findOne({
        codigoInterno: req.body.codigoInterno,
        _id: { $ne: req.params.id }
      });

      if (existingCode) {
        return res.status(400).json({
          success: false,
          message: 'El código interno ya está en uso'
        });
      }
    }

    // Actualizar tratamiento
    req.body.actualizadoPor = req.user._id;
    treatment = await Treatment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('creadoPor actualizadoPor', 'nombre apellidos');

    res.status(200).json({
      success: true,
      message: 'Tratamiento actualizado exitosamente',
      data: treatment
    });
  } catch (error) {
    console.error('Error al actualizar tratamiento:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de tratamiento inválido'
      });
    }

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
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Eliminar tratamiento (soft delete)
// @route   DELETE /api/treatments/:id
// @access  Private
const deleteTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id);

    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: 'Tratamiento no encontrado'
      });
    }

    // Soft delete - marcar como inactivo
    treatment.activo = false;
    treatment.actualizadoPor = req.user._id;
    await treatment.save();

    res.status(200).json({
      success: true,
      message: 'Tratamiento desactivado exitosamente',
      data: {}
    });
  } catch (error) {
    console.error('Error al eliminar tratamiento:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de tratamiento inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Reactivar tratamiento
// @route   PUT /api/treatments/:id/reactivate
// @access  Private
const reactivateTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id);

    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: 'Tratamiento no encontrado'
      });
    }

    treatment.activo = true;
    treatment.actualizadoPor = req.user._id;
    await treatment.save();

    res.status(200).json({
      success: true,
      message: 'Tratamiento reactivado exitosamente',
      data: treatment
    });
  } catch (error) {
    console.error('Error al reactivar tratamiento:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de tratamiento inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Obtener estadísticas de tratamientos
// @route   GET /api/treatments/stats
// @access  Private
const getTreatmentStats = async (req, res) => {
  try {
    const stats = await Treatment.obtenerEstadisticas();

    // Estadísticas adicionales por categoría
    const statsByCategory = await Treatment.aggregate([
      { $match: { activo: true } },
      {
        $group: {
          _id: '$categoria',
          count: { $sum: 1 },
          precioPromedio: { $avg: '$precio' },
          duracionPromedia: { $avg: '$duracion' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        general: stats,
        porCategoria: statsByCategory
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Buscar tratamientos por texto
// @route   GET /api/treatments/search/:searchTerm
// @access  Private
const searchTreatments = async (req, res) => {
  try {
    const { searchTerm } = req.params;
    const { limit = 10 } = req.query;

    const treatments = await Treatment.find({
      $or: [
        { nombre: { $regex: searchTerm, $options: 'i' } },
        { descripcion: { $regex: searchTerm, $options: 'i' } },
        { categoria: { $regex: searchTerm, $options: 'i' } },
        { codigoInterno: { $regex: searchTerm, $options: 'i' } }
      ],
      activo: true
    })
    .select('nombre categoria precio duracion descripcion codigoInterno')
    .limit(parseInt(limit))
    .sort({ nombre: 1 });

    res.status(200).json({
      success: true,
      count: treatments.length,
      data: treatments
    });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Obtener categorías de tratamientos
// @route   GET /api/treatments/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const categories = await Treatment.distinct('categoria', { activo: true });
    
    res.status(200).json({
      success: true,
      data: categories.sort()
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

module.exports = {
  getTreatments,
  getTreatment,
  createTreatment,
  updateTreatment,
  deleteTreatment,
  reactivateTreatment,
  getTreatmentStats,
  searchTreatments,
  getCategories
};