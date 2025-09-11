const express = require('express');
const {
  createEvaluation,
  getEvaluations,
  getEvaluationById,
  updateEvaluation,
  changeEvaluationStatus,
  completeEvaluation,
  reviewEvaluation,
  getEvaluationsByPatient,
  getEvaluationStats,
  deleteEvaluation,
  searchEvaluations
} = require('../controllers/evaluationController');

const { protect, authorize, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Aplicar protección a todas las rutas
router.use(protect);

// Rutas especiales - deben ir antes que las rutas con parámetros
router.get('/search', requirePermission('clinical_history:read'), searchEvaluations);
router.get('/stats', requirePermission('clinical_history:read'), getEvaluationStats);

// Rutas por paciente
router.get('/patient/:patientId', 
  requirePermission('clinical_history:read'), 
  getEvaluationsByPatient
);

// CRUD básico
router.route('/')
  .get(requirePermission('clinical_history:read'), getEvaluations)
  .post(requirePermission('clinical_history:write'), createEvaluation);

router.route('/:id')
  .get(requirePermission('clinical_history:read'), getEvaluationById)
  .put(requirePermission('clinical_history:write'), updateEvaluation)
  .delete(authorize('owner'), deleteEvaluation);

// Acciones específicas de evaluaciones
router.put('/:id/status', 
  requirePermission('clinical_history:write'), 
  changeEvaluationStatus
);

router.put('/:id/complete', 
  requirePermission('clinical_history:write'), 
  completeEvaluation
);

router.put('/:id/review', 
  authorize('owner', 'clinical_director', 'hq_analyst'), 
  reviewEvaluation
);

module.exports = router;