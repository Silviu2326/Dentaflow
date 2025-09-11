const express = require('express');
const {
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
} = require('../controllers/inventoryController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de protección a todas las rutas
router.use(protect);

// ============= STATISTICS =============
router.get('/stats', 
  authorize(['owner', 'admin_sede', 'operations', 'hq_analyst']), 
  getInventoryStats
);

// ============= PRODUCT ROUTES =============

// Get all products
router.get('/products', 
  authorize(['owner', 'admin_sede', 'operations', 'clinical_professional', 'reception']), 
  getProducts
);

// Create new product
router.post('/products', 
  authorize(['owner', 'admin_sede', 'operations']), 
  createProduct
);

// Get specific product
router.get('/products/:id', 
  authorize(['owner', 'admin_sede', 'operations', 'clinical_professional', 'reception']), 
  getProduct
);

// Update product
router.put('/products/:id', 
  authorize(['owner', 'admin_sede', 'operations']), 
  updateProduct
);

// Update product stock
router.put('/products/:id/stock', 
  authorize(['owner', 'admin_sede', 'operations', 'clinical_professional']), 
  updateProductStock
);

// ============= BATCH ROUTES =============

// Get all batches
router.get('/batches', 
  authorize(['owner', 'admin_sede', 'operations', 'clinical_professional']), 
  getBatches
);

// Create new batch
router.post('/batches', 
  authorize(['owner', 'admin_sede', 'operations']), 
  createBatch
);

// ============= ALERT ROUTES =============

// Get inventory alerts
router.get('/alerts', 
  authorize(['owner', 'admin_sede', 'operations', 'clinical_professional', 'reception']), 
  getInventoryAlerts
);

// Mark alert as read
router.put('/alerts/:id/read', 
  authorize(['owner', 'admin_sede', 'operations', 'clinical_professional', 'reception']), 
  markAlertAsRead
);

module.exports = router;