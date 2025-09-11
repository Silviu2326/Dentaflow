const express = require('express');
const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  changePatientStatus,
  searchPatients,
  getPatientMedicalHistory,
  assignProfessional,
  getPatientStats,
  deletePatient
} = require('../controllers/patientController');

const { protect, authorize, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Aplicar protección a todas las rutas
router.use(protect);

// Rutas especiales
router.get('/search', requirePermission('patients:read'), searchPatients);
router.get('/stats', requirePermission('patients:read'), getPatientStats);

// CRUD básico
router.route('/')
  .get(requirePermission('patients:read'), getPatients)
  .post(requirePermission('patients:create'), createPatient);

router.route('/:id')
  .get(requirePermission('patients:read'), getPatientById)
  .put(requirePermission('patients:update'), updatePatient)
  .delete(authorize('owner'), deletePatient);

// Acciones específicas de pacientes
router.put('/:id/status', requirePermission('patients:update'), changePatientStatus);
router.get('/:id/medical-history', requirePermission('clinical_history:read'), getPatientMedicalHistory);
router.put('/:id/assign-professional', 
  authorize('owner', 'admin_sede'),
  assignProfessional
);

module.exports = router;