const Product = require('../models/Product');
const Batch = require('../models/Batch');
const InventoryAlert = require('../models/InventoryAlert');

// ============= PRODUCT MANAGEMENT =============

// @desc    Obtener todos los productos
// @route   GET /api/inventory/products
// @access  Private
const getProducts = async (req, res) => {
  try {
    const {
      search,
      categoria,
      ubicacion,
      estado,
      stockBajo,
      proveedor,
      page = 1,
      limit = 10,
      sort = 'nombre'
    } = req.query;

    // Construir filtro
    let filter = {};

    if (search) {
      filter.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { codigo: { $regex: search, $options: 'i' } },
        { marca: { $regex: search, $options: 'i' } }
      ];
    }

    if (categoria && categoria !== 'todas') {
      filter.categoria = categoria;
    }

    if (ubicacion && ubicacion !== 'todas') {
      filter['ubicacion.sede'] = { $regex: ubicacion, $options: 'i' };
    }

    if (estado) {
      filter.estado = estado;
    } else {
      filter.estado = 'activo'; // Por defecto solo productos activos
    }

    if (stockBajo === 'true') {
      filter.$expr = { $lte: ['$stockActual', '$stockMinimo'] };
    }

    if (proveedor) {
      filter['proveedor.nombre'] = { $regex: proveedor, $options: 'i' };
    }

    // Paginación
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Ordenamiento
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

    const products = await Product.find(filter)
      .sort(sortOption)
      .limit(limitNumber)
      .skip(skip)
      .populate('creadoPor', 'nombre apellidos')
      .populate('actualizadoPor', 'nombre apellidos');

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber)
      },
      data: products
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Obtener producto por ID
// @route   GET /api/inventory/products/:id
// @access  Private
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('creadoPor', 'nombre apellidos')
      .populate('actualizadoPor', 'nombre apellidos');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Obtener lotes asociados
    const batches = await Batch.find({ productoId: product._id })
      .sort({ fechaVencimiento: 1 });

    res.status(200).json({
      success: true,
      data: {
        ...product.toObject(),
        lotes: batches
      }
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Crear nuevo producto
// @route   POST /api/inventory/products
// @access  Private
const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      creadoPor: req.user._id,
      actualizadoPor: req.user._id
    };

    // Verificar código único
    const existingProduct = await Product.findOne({ 
      codigo: productData.codigo.toUpperCase() 
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un producto con ese código'
      });
    }

    const product = await Product.create(productData);
    await product.populate('creadoPor', 'nombre apellidos');

    // Crear alerta si el stock inicial está por debajo del mínimo
    if (product.stockActual <= product.stockMinimo) {
      await InventoryAlert.crearAlerta({
        tipo: product.stockActual === 0 ? 'stock_agotado' : 
              product.stockActual <= (product.stockMinimo * 0.5) ? 'stock_critico' : 'stock_bajo',
        titulo: `Stock ${product.stockActual === 0 ? 'Agotado' : 'Bajo'} - ${product.nombre}`,
        descripcion: `Stock actual: ${product.stockActual}. Mínimo: ${product.stockMinimo}`,
        productoId: product._id,
        productoNombre: product.nombre,
        productoCodigo: product.codigo,
        prioridad: product.stockActual === 0 ? 'critica' : 
                  product.stockActual <= (product.stockMinimo * 0.5) ? 'alta' : 'media',
        valores: {
          stockActual: product.stockActual,
          stockMinimo: product.stockMinimo
        },
        ubicacion: {
          sede: product.ubicacion.sede,
          zona: product.ubicacion.zona
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: product
    });
  } catch (error) {
    console.error('Error al crear producto:', error);

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

// @desc    Actualizar producto
// @route   PUT /api/inventory/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Verificar código único si se está cambiando
    if (req.body.codigo && req.body.codigo.toUpperCase() !== product.codigo) {
      const existingProduct = await Product.findOne({
        codigo: req.body.codigo.toUpperCase(),
        _id: { $ne: req.params.id }
      });

      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un producto con ese código'
        });
      }
    }

    req.body.actualizadoPor = req.user._id;
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('creadoPor actualizadoPor', 'nombre apellidos');

    res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);

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

// @desc    Actualizar stock de producto
// @route   PUT /api/inventory/products/:id/stock
// @access  Private
const updateProductStock = async (req, res) => {
  try {
    const { cantidad, tipo, motivo, lote, fechaVencimiento } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const stockAnterior = product.stockActual;
    await product.actualizarStock(cantidad, tipo, lote, fechaVencimiento);

    // Verificar si necesita crear alertas
    if (product.stockActual <= product.stockMinimo && stockAnterior > product.stockMinimo) {
      await InventoryAlert.crearAlerta({
        tipo: product.stockActual === 0 ? 'stock_agotado' : 
              product.stockActual <= (product.stockMinimo * 0.5) ? 'stock_critico' : 'stock_bajo',
        titulo: `Stock ${product.stockActual === 0 ? 'Agotado' : 'Bajo'} - ${product.nombre}`,
        descripcion: `Stock actual: ${product.stockActual}. Mínimo: ${product.stockMinimo}`,
        productoId: product._id,
        productoNombre: product.nombre,
        productoCodigo: product.codigo,
        prioridad: product.stockActual === 0 ? 'critica' : 
                  product.stockActual <= (product.stockMinimo * 0.5) ? 'alta' : 'media',
        valores: {
          stockActual: product.stockActual,
          stockMinimo: product.stockMinimo
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock actualizado exitosamente',
      data: {
        stockAnterior,
        stockActual: product.stockActual,
        producto: product
      }
    });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// ============= BATCH MANAGEMENT =============

// @desc    Obtener todos los lotes
// @route   GET /api/inventory/batches
// @access  Private
const getBatches = async (req, res) => {
  try {
    const {
      search,
      productoId,
      estado,
      proximoVencer,
      vencidos,
      ubicacion,
      page = 1,
      limit = 10,
      sort = 'fechaVencimiento'
    } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { numeroLote: { $regex: search, $options: 'i' } },
        { productoNombre: { $regex: search, $options: 'i' } }
      ];
    }

    if (productoId) {
      filter.productoId = productoId;
    }

    if (estado) {
      filter.estado = estado;
    }

    if (proximoVencer === 'true') {
      const fecha90Dias = new Date();
      fecha90Dias.setDate(fecha90Dias.getDate() + 90);
      filter.fechaVencimiento = { 
        $gte: new Date(), 
        $lte: fecha90Dias 
      };
      filter.cantidadActual = { $gt: 0 };
    }

    if (vencidos === 'true') {
      filter.fechaVencimiento = { $lt: new Date() };
      filter.estado = { $ne: 'retirado' };
    }

    if (ubicacion) {
      filter['ubicacion.sede'] = { $regex: ubicacion, $options: 'i' };
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

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

    const batches = await Batch.find(filter)
      .sort(sortOption)
      .limit(limitNumber)
      .skip(skip)
      .populate('productoId', 'nombre codigo categoria')
      .populate('creadoPor', 'nombre apellidos');

    const total = await Batch.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: batches.length,
      total,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber)
      },
      data: batches
    });
  } catch (error) {
    console.error('Error al obtener lotes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Crear nuevo lote
// @route   POST /api/inventory/batches
// @access  Private
const createBatch = async (req, res) => {
  try {
    // Obtener información del producto
    const product = await Product.findById(req.body.productoId);
    
    if (!product) {
      return res.status(400).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const batchData = {
      ...req.body,
      productoNombre: product.nombre,
      productoCodigo: product.codigo,
      cantidadActual: req.body.cantidadInicial,
      creadoPor: req.user._id
    };

    const batch = await Batch.create(batchData);
    
    // Actualizar stock del producto
    await product.actualizarStock(
      batch.cantidadInicial, 
      'entrada', 
      batch.numeroLote, 
      batch.fechaVencimiento
    );

    // Crear alerta si está próximo a vencer
    if (batch.proximoAVencer) {
      await InventoryAlert.crearAlerta({
        tipo: 'vencimiento_proximo',
        titulo: `Próximo a Vencer - ${product.nombre}`,
        descripcion: `Lote ${batch.numeroLote} vence el ${batch.fechaVencimiento.toLocaleDateString()}`,
        productoId: product._id,
        productoNombre: product.nombre,
        productoCodigo: product.codigo,
        loteId: batch._id,
        numeroLote: batch.numeroLote,
        prioridad: batch.diasParaVencer <= 30 ? 'alta' : 'media',
        valores: {
          cantidadLote: batch.cantidadActual,
          fechaVencimientoLote: batch.fechaVencimiento,
          diasParaVencer: batch.diasParaVencer
        }
      });
    }

    await batch.populate([
      { path: 'productoId', select: 'nombre codigo categoria' },
      { path: 'creadoPor', select: 'nombre apellidos' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Lote creado exitosamente',
      data: batch
    });
  } catch (error) {
    console.error('Error al crear lote:', error);

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

// ============= ALERTS MANAGEMENT =============

// @desc    Obtener alertas de inventario
// @route   GET /api/inventory/alerts
// @access  Private
const getInventoryAlerts = async (req, res) => {
  try {
    const {
      tipo,
      prioridad,
      estado,
      productoId,
      leidas,
      page = 1,
      limit = 10,
      sort = '-fechaAlerta'
    } = req.query;

    let filter = {};

    if (tipo) {
      filter.tipo = tipo;
    }

    if (prioridad) {
      filter.prioridad = prioridad;
    }

    if (estado) {
      filter.estado = estado;
    } else {
      filter.estado = { $in: ['activa', 'leida'] }; // Por defecto solo alertas activas y leídas
    }

    if (productoId) {
      filter.productoId = productoId;
    }

    if (leidas !== undefined) {
      if (leidas === 'false') {
        filter.estado = 'activa';
      } else if (leidas === 'true') {
        filter.estado = { $in: ['leida', 'resuelta'] };
      }
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

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

    const alerts = await InventoryAlert.find(filter)
      .sort(sortOption)
      .limit(limitNumber)
      .skip(skip)
      .populate('productoId', 'nombre codigo categoria')
      .populate('loteId', 'numeroLote fechaVencimiento');

    const total = await InventoryAlert.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: alerts.length,
      total,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber)
      },
      data: alerts
    });
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Marcar alerta como leída
// @route   PUT /api/inventory/alerts/:id/read
// @access  Private
const markAlertAsRead = async (req, res) => {
  try {
    const alert = await InventoryAlert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alerta no encontrada'
      });
    }

    await alert.marcarComoLeida(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Alerta marcada como leída',
      data: alert
    });
  } catch (error) {
    console.error('Error al marcar alerta como leída:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// ============= STATISTICS =============

// @desc    Obtener estadísticas de inventario
// @route   GET /api/inventory/stats
// @access  Private
const getInventoryStats = async (req, res) => {
  try {
    const [productStats, batchStats, alertStats] = await Promise.all([
      Product.obtenerEstadisticas(),
      Batch.obtenerEstadisticas(),
      InventoryAlert.obtenerEstadisticas()
    ]);

    // Obtener productos con stock bajo
    const lowStockProducts = await Product.buscarStockBajo();
    const criticalStockProducts = await Product.buscarStockCritico();

    // Obtener lotes próximos a vencer
    const expiringBatches = await Batch.proximosAVencer(30);
    const expiredBatches = await Batch.lotesVencidos();

    res.status(200).json({
      success: true,
      data: {
        productos: productStats,
        lotes: batchStats,
        alertas: alertStats,
        resumen: {
          stockBajo: lowStockProducts.length,
          stockCritico: criticalStockProducts.length,
          proximosVencer: expiringBatches.length,
          vencidos: expiredBatches.length
        }
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

module.exports = {
  // Products
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  updateProductStock,
  
  // Batches
  getBatches,
  createBatch,
  
  // Alerts
  getInventoryAlerts,
  markAlertAsRead,
  
  // Statistics
  getInventoryStats
};