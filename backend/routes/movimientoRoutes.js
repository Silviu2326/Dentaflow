const express = require('express');
const {
  getMovimientos,
  getMovimientoById,
  createMovimiento,
  updateMovimiento,
  anularMovimiento,
  getResumenPorFecha,
  buscarMovimientos,
  getMovimientosPorRango
} = require('../controllers/movimientoController');

const { protect, authorize, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Aplicar protección a todas las rutas
router.use(protect);

// Rutas especiales (orden importante para evitar conflictos)
router.get('/buscar', requirePermission('caja:read'), buscarMovimientos);
router.get('/rango', requirePermission('caja:read'), getMovimientosPorRango);
router.get('/resumen/:fecha', requirePermission('caja:read'), getResumenPorFecha);

// Operaciones específicas
router.put('/:id/anular', requirePermission('caja:delete'), anularMovimiento);

// CRUD básico
router.route('/')
  .get(requirePermission('caja:read'), getMovimientos)
  .post(requirePermission('caja:create'), createMovimiento);

router.route('/:id')
  .get(requirePermission('caja:read'), getMovimientoById)
  .put(requirePermission('caja:update'), updateMovimiento);

module.exports = router;