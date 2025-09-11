const express = require('express');
const {
  // CRUD Operations
  getIntegrations,
  getIntegration,
  createIntegration,
  updateIntegration,
  deleteIntegration,
  
  // Logs
  getIntegrationLogs,
  
  // Statistics
  getIntegrationsStats,
  
  // Actions
  testIntegration,
  syncIntegration
} = require('../controllers/integrationController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de protección a todas las rutas
router.use(protect);

// ============= STATISTICS =============
router.get('/stats', 
  authorize(['owner', 'admin_sede', 'operations', 'hq_analyst']), 
  getIntegrationsStats
);

// ============= INTEGRATION MANAGEMENT =============

// Get all integrations
router.get('/', 
  authorize(['owner', 'admin_sede', 'operations', 'hq_analyst']), 
  getIntegrations
);

// Create new integration
router.post('/', 
  authorize(['owner', 'admin_sede']), 
  createIntegration
);

// Get specific integration
router.get('/:id', 
  authorize(['owner', 'admin_sede', 'operations', 'hq_analyst']), 
  getIntegration
);

// Update integration
router.put('/:id', 
  authorize(['owner', 'admin_sede']), 
  updateIntegration
);

// Delete integration
router.delete('/:id', 
  authorize(['owner']), 
  deleteIntegration
);

// ============= INTEGRATION ACTIONS =============

// Test integration connection
router.post('/:id/test', 
  authorize(['owner', 'admin_sede', 'operations']), 
  testIntegration
);

// Sync integration
router.post('/:id/sync', 
  authorize(['owner', 'admin_sede', 'operations']), 
  syncIntegration
);

// ============= LOGS MANAGEMENT =============

// Get integration logs
router.get('/:id/logs', 
  authorize(['owner', 'admin_sede', 'operations', 'hq_analyst']), 
  getIntegrationLogs
);

module.exports = router;