const express = require('express');
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  confirmAppointment,
  checkinAppointment,
  getTodayAppointments,
  getAvailability,
  deleteAppointment
} = require('../controllers/appointmentController');

const { protect, authorize, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Aplicar protección a todas las rutas
router.use(protect);

// Rutas especiales
router.get('/today', requirePermission('agenda:read'), getTodayAppointments);
router.get('/availability', requirePermission('agenda:read'), getAvailability);

// CRUD básico
router.route('/')
  .get(requirePermission('agenda:read'), getAppointments)
  .post(requirePermission('agenda:create'), createAppointment);

router.route('/:id')
  .get(requirePermission('agenda:read'), getAppointmentById)
  .put(requirePermission('agenda:update'), updateAppointment)
  .delete(authorize('owner', 'admin_sede'), deleteAppointment);

// Acciones específicas de citas
router.put('/:id/cancel', requirePermission('agenda:update'), cancelAppointment);
router.put('/:id/confirm', requirePermission('agenda:update'), confirmAppointment);
router.put('/:id/checkin', requirePermission('agenda:update'), checkinAppointment);

module.exports = router;