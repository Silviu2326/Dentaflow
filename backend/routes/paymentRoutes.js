const express = require('express');
const {
  // Pagos
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  changePaymentStatus,
  processPayment,
  completePayment,
  
  // Links de pago
  createPaymentLink,
  getPaymentLinks,
  renewPaymentLink,
  
  // Devoluciones
  createRefund,
  getRefunds,
  approveRefund,
  completeRefund,
  
  // Generales
  getPaymentStats,
  reconcilePayments
} = require('../controllers/paymentController');

const { protect, authorize, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Aplicar protección a todas las rutas
router.use(protect);

// Rutas especiales - deben ir antes que las rutas con parámetros
router.get('/stats', requirePermission('payments:read'), getPaymentStats);
router.post('/reconcile', authorize('owner', 'hq_analyst', 'admin_sede'), reconcilePayments);

// ============= RUTAS PARA PAGOS =============

// CRUD básico de pagos
router.route('/')
  .get(requirePermission('payments:read'), getPayments)
  .post(requirePermission('payments:create'), createPayment);

router.route('/:id')
  .get(requirePermission('payments:read'), getPaymentById)
  .put(requirePermission('payments:update'), updatePayment);

// Acciones específicas de pagos
router.put('/:id/status', 
  authorize('owner', 'hq_analyst', 'admin_sede'), 
  changePaymentStatus
);

router.post('/:id/process', 
  requirePermission('payments:update'), 
  processPayment
);

router.post('/:id/complete', 
  requirePermission('payments:update'), 
  completePayment
);

// ============= RUTAS PARA LINKS DE PAGO =============

// CRUD básico de links de pago
router.route('/links')
  .get(requirePermission('payments:read'), getPaymentLinks)
  .post(requirePermission('payments:create'), createPaymentLink);

// Acciones específicas de links
router.put('/links/:id/renew', 
  requirePermission('payments:update'), 
  renewPaymentLink
);

// ============= RUTAS PARA DEVOLUCIONES =============

// CRUD básico de devoluciones
router.route('/refunds')
  .get(requirePermission('payments:read'), getRefunds)
  .post(requirePermission('payments:create'), createRefund);

// Acciones específicas de devoluciones
router.put('/refunds/:id/approve', 
  authorize('owner', 'hq_analyst', 'admin_sede'), 
  approveRefund
);

router.put('/refunds/:id/complete', 
  requirePermission('payments:update'), 
  completeRefund
);

module.exports = router;