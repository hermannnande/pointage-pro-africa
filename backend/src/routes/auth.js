const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { loginValidation, registerValidation, validate } = require('../middleware/validator');

// Routes publiques
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);

// Routes protégées
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);
router.post('/change-password', protect, authController.changePassword);
router.post('/device-token', protect, authController.registerDeviceToken);

module.exports = router;

