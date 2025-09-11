const express = require('express');
const {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  changeBudgetStatus,
  addCommunication,
  getBudgetsByPatient,
  getPipelineStats,
  getPipelineData,
  searchBudgets,
  deleteBudget
} = require('../controllers/budgetController');

const { protect, authorize, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Aplicar protección a todas las rutas
router.use(protect);

// Rutas especiales - deben ir antes que las rutas con parámetros
router.get('/search', requirePermission('budgets:read'), searchBudgets);
router.get('/pipeline/stats', requirePermission('budgets:read'), getPipelineStats);
router.get('/pipeline', requirePermission('budgets:read'), getPipelineData);

// Rutas por paciente
router.get('/patient/:patientId', 
  requirePermission('budgets:read'), 
  getBudgetsByPatient
);

// CRUD básico
router.route('/')
  .get(requirePermission('budgets:read'), getBudgets)
  .post(requirePermission('budgets:create'), createBudget);

router.route('/:id')
  .get(requirePermission('budgets:read'), getBudgetById)
  .put(requirePermission('budgets:update'), updateBudget)
  .delete(authorize('owner'), deleteBudget);

// Acciones específicas de presupuestos
router.put('/:id/status', 
  requirePermission('budgets:update'), 
  changeBudgetStatus
);

router.post('/:id/communication', 
  requirePermission('budgets:update'), 
  addCommunication
);

module.exports = router;