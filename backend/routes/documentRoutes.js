const express = require('express');
const {
  // Plantillas
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  changeTemplateStatus,
  
  // Documentos firmados
  generateSignedDocument,
  getSignedDocuments,
  getSignedDocumentById,
  signDocument,
  
  // Generales
  getDocumentStats,
  searchDocuments
} = require('../controllers/documentController');

const { protect, authorize, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Rutas públicas (para firma)
router.post('/signed/:id/sign', signDocument);

// Aplicar protección al resto de rutas
router.use(protect);

// Rutas especiales - deben ir antes que las rutas con parámetros
router.get('/search', requirePermission('documents:read'), searchDocuments);
router.get('/stats', requirePermission('documents:read'), getDocumentStats);

// ============= RUTAS PARA PLANTILLAS =============

// CRUD básico de plantillas
router.route('/templates')
  .get(requirePermission('documents:read'), getTemplates)
  .post(requirePermission('documents:create'), createTemplate);

router.route('/templates/:id')
  .get(requirePermission('documents:read'), getTemplateById)
  .put(requirePermission('documents:update'), updateTemplate);

// Cambiar estado de plantilla
router.put('/templates/:id/status', 
  authorize('owner', 'hq_analyst', 'admin_sede'), 
  changeTemplateStatus
);

// ============= RUTAS PARA DOCUMENTOS FIRMADOS =============

// CRUD básico de documentos firmados
router.route('/signed')
  .get(requirePermission('documents:read'), getSignedDocuments)
  .post(requirePermission('documents:create'), generateSignedDocument);

router.route('/signed/:id')
  .get(requirePermission('documents:read'), getSignedDocumentById);

module.exports = router;