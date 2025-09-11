const express = require('express');
const {
  getTreatments,
  getTreatment,
  createTreatment,
  updateTreatment,
  deleteTreatment,
  reactivateTreatment,
  getTreatmentStats,
  searchTreatments,
  getCategories
} = require('../controllers/treatmentController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de protección a todas las rutas
router.use(protect);

// Rutas específicas (deben ir antes de las rutas con parámetros)
router.get('/stats', authorize(['owner', 'admin_sede', 'hq_analyst']), getTreatmentStats);
router.get('/categories', getCategories);
router.get('/search/:searchTerm', searchTreatments);

// Rutas principales CRUD
router.route('/')
  .get(getTreatments)
  .post(
    authorize(['owner', 'admin_sede', 'clinical_professional']), 
    createTreatment
  );

router.route('/:id')
  .get(getTreatment)
  .put(
    authorize(['owner', 'admin_sede', 'clinical_professional']), 
    updateTreatment
  )
  .delete(
    authorize(['owner', 'admin_sede']), 
    deleteTreatment
  );

// Ruta para reactivar tratamiento
router.put('/:id/reactivate', 
  authorize(['owner', 'admin_sede']), 
  reactivateTreatment
);

module.exports = router;