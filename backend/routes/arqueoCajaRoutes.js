const express = require('express');
const {
  getArqueos,
  getArqueoById,
  abrirCaja,
  cerrarCaja,
  reabrirCaja,
  getArqueoActivo,
  agregarIncidencia,
  resolverIncidencia,
  getResumenArqueos,
  getEstadisticasArqueo
} = require('../controllers/arqueoCajaController');

const { protect, authorize, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Aplicar protección a todas las rutas
router.use(protect);

// Rutas especiales (orden importante para evitar conflictos)
router.get('/resumen', requirePermission('caja:read'), getResumenArqueos);
router.get('/activo/:sede', requirePermission('caja:read'), getArqueoActivo);
router.post('/abrir', requirePermission('caja:create'), abrirCaja);

// Operaciones específicas de arqueo
router.put('/:id/cerrar', requirePermission('caja:update'), cerrarCaja);
router.put('/:id/reabrir', requirePermission('caja:admin'), reabrirCaja);
router.get('/:id/estadisticas', requirePermission('caja:read'), getEstadisticasArqueo);

// Gestión de incidencias
router.post('/:id/incidencias', requirePermission('caja:create'), agregarIncidencia);
router.put('/:id/incidencias/:incidenciaId/resolver', requirePermission('caja:update'), resolverIncidencia);

// CRUD básico
router.route('/')
  .get(requirePermission('caja:read'), getArqueos);

router.route('/:id')
  .get(requirePermission('caja:read'), getArqueoById);

module.exports = router;