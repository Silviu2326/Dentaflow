const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Rutas públicas
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Rutas protegidas - requieren autenticación
router.use(protect);

// Perfil del usuario actual
router.route('/me')
  .get(getMe)
  .put(updateProfile);

// Cambiar contraseña
router.put('/change-password', changePassword);

// Gestión de usuarios - requiere permisos específicos
router.route('/')
  .get(
    authorize('owner', 'hq_analyst', 'admin_sede'),
    getUsers
  )
  .post(
    authorize('owner', 'admin_sede'),
    registerUser
  );

router.route('/:id')
  .get(
    authorize('owner', 'hq_analyst', 'admin_sede', 'reception', 'clinical_professional'),
    getUserById
  )
  .put(
    authorize('owner', 'admin_sede'),
    updateUser
  )
  .delete(
    authorize('owner'),
    deleteUser
  );

module.exports = router;