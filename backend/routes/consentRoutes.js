const express = require('express');
const {
  // Templates
  getConsentTemplates,
  getConsentTemplate,
  createConsentTemplate,
  updateConsentTemplate,
  createNewTemplateVersion,
  
  // Records
  getConsentRecords,
  createConsentRecord,
  sendConsentRecord,
  
  // Stats
  getConsentStats,
  
  // Public
  getConsentByToken,
  signConsent
} = require('../controllers/consentController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// ============= PUBLIC ROUTES (for patients) =============
// These routes don't require authentication as they're accessed by patients via token

// Obtener consentimiento para firmar (por token)
router.get('/sign/:token', getConsentByToken);

// Firmar consentimiento
router.post('/sign/:token', signConsent);

// ============= PROTECTED ROUTES =============
// Apply authentication middleware to all routes below
router.use(protect);

// ============= STATISTICS =============
router.get('/stats', 
  authorize(['owner', 'admin_sede', 'hq_analyst']), 
  getConsentStats
);

// ============= TEMPLATE MANAGEMENT =============

// Get all consent templates
router.get('/templates', getConsentTemplates);

// Create new consent template
router.post('/templates', 
  authorize(['owner', 'admin_sede', 'clinical_professional']), 
  createConsentTemplate
);

// Get specific template
router.get('/templates/:id', getConsentTemplate);

// Update template
router.put('/templates/:id', 
  authorize(['owner', 'admin_sede', 'clinical_professional']), 
  updateConsentTemplate
);

// Create new version of template
router.post('/templates/:id/new-version', 
  authorize(['owner', 'admin_sede', 'clinical_professional']), 
  createNewTemplateVersion
);

// ============= CONSENT RECORDS MANAGEMENT =============

// Get all consent records
router.get('/records', getConsentRecords);

// Create new consent record
router.post('/records', 
  authorize(['owner', 'admin_sede', 'reception', 'clinical_professional']), 
  createConsentRecord
);

// Send consent record to patient
router.put('/records/:id/send', 
  authorize(['owner', 'admin_sede', 'reception', 'clinical_professional']), 
  sendConsentRecord
);

module.exports = router;