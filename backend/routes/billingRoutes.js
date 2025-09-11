const express = require('express');
const {
  // Invoices
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  payInvoice,
  
  // Receipts
  getReceipts,
  createReceipt,
  
  // Cash Register
  getCashRegister,
  openCashRegister,
  closeCashRegister,
  
  // Statistics
  getBillingStats
} = require('../controllers/billingController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de protección a todas las rutas
router.use(protect);

// ============= STATISTICS =============
router.get('/stats', 
  authorize(['owner', 'admin_sede', 'hq_analyst', 'finance']), 
  getBillingStats
);

// ============= INVOICE ROUTES =============

// Get all invoices
router.get('/invoices', 
  authorize(['owner', 'admin_sede', 'reception', 'finance']), 
  getInvoices
);

// Create new invoice
router.post('/invoices', 
  authorize(['owner', 'admin_sede', 'reception']), 
  createInvoice
);

// Get specific invoice
router.get('/invoices/:id', 
  authorize(['owner', 'admin_sede', 'reception', 'finance']), 
  getInvoice
);

// Update invoice
router.put('/invoices/:id', 
  authorize(['owner', 'admin_sede', 'reception']), 
  updateInvoice
);

// Mark invoice as paid
router.put('/invoices/:id/pay', 
  authorize(['owner', 'admin_sede', 'reception', 'finance']), 
  payInvoice
);

// ============= RECEIPT ROUTES =============

// Get all receipts
router.get('/receipts', 
  authorize(['owner', 'admin_sede', 'reception', 'finance']), 
  getReceipts
);

// Create new receipt
router.post('/receipts', 
  authorize(['owner', 'admin_sede', 'reception']), 
  createReceipt
);

// ============= CASH REGISTER ROUTES =============

// Get cash register for specific date
router.get('/cash-register', 
  authorize(['owner', 'admin_sede', 'reception', 'finance']), 
  getCashRegister
);

// Open cash register
router.post('/cash-register/open', 
  authorize(['owner', 'admin_sede', 'reception']), 
  openCashRegister
);

// Close cash register
router.put('/cash-register/:id/close', 
  authorize(['owner', 'admin_sede', 'reception']), 
  closeCashRegister
);

module.exports = router;