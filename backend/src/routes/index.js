const express = require('express');
const router = express.Router();

// Importer les routes
const authRoutes = require('./auth');
const attendanceRoutes = require('./attendance');
const leaveRoutes = require('./leave');
const userRoutes = require('./user');

// Utiliser les routes
router.use('/auth', authRoutes);
router.use('/attendances', attendanceRoutes);
router.use('/leaves', leaveRoutes);
router.use('/users', userRoutes);

// Route racine de l'API
router.get('/', (req, res) => {
  res.json({
    message: 'API Système de Pointage',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      attendances: '/api/attendances',
      leaves: '/api/leaves',
      users: '/api/users'
    }
  });
});

module.exports = router;

