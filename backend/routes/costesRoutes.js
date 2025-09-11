const express = require('express');
const {
  // Tratamientos
  getCostesTratamientos,
  getCosteTratamientoById,
  createCosteTratamiento,
  updateCosteTratamiento,
  getAnalisisPorCategoria,
  
  // Profesionales
  getMargenesProfesionales,
  createMargenProfesional,
  getRankingProfesionales,
  getEstadisticasGenerales,
  
  // Materiales
  getCostesMateriales,
  createCosteMaterial,
  getAnalisisMaterialesPorCategoria,
  getAnalisisPorProveedor,
  getMaterialesStockBajo,
  
  // Dashboard
  getDashboardCostes
} = require('../controllers/costesController');

const { protect, authorize, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Aplicar protección a todas las rutas
router.use(protect);

// ============ DASHBOARD ============
router.get('/dashboard', requirePermission('costes:read'), getDashboardCostes);

// ============ TRATAMIENTOS ============
// Rutas especiales (orden importante para evitar conflictos)
router.get('/tratamientos/analisis/categoria', requirePermission('costes:read'), getAnalisisPorCategoria);

// CRUD básico para tratamientos
router.route('/tratamientos')
  .get(requirePermission('costes:read'), getCostesTratamientos)
  .post(requirePermission('costes:create'), createCosteTratamiento);

router.route('/tratamientos/:id')
  .get(requirePermission('costes:read'), getCosteTratamientoById)
  .put(requirePermission('costes:update'), updateCosteTratamiento);

// ============ PROFESIONALES ============
// Rutas especiales
router.get('/profesionales/ranking', requirePermission('costes:read'), getRankingProfesionales);
router.get('/profesionales/estadisticas', requirePermission('costes:read'), getEstadisticasGenerales);

// CRUD básico para profesionales
router.route('/profesionales')
  .get(requirePermission('costes:read'), getMargenesProfesionales)
  .post(requirePermission('costes:create'), createMargenProfesional);

// ============ MATERIALES ============
// Rutas especiales (orden importante)
router.get('/materiales/stock-bajo', requirePermission('costes:read'), getMaterialesStockBajo);
router.get('/materiales/analisis/categoria', requirePermission('costes:read'), getAnalisisMaterialesPorCategoria);
router.get('/materiales/analisis/proveedor', requirePermission('costes:read'), getAnalisisPorProveedor);

// CRUD básico para materiales
router.route('/materiales')
  .get(requirePermission('costes:read'), getCostesMateriales)
  .post(requirePermission('costes:create'), createCosteMaterial);

module.exports = router;