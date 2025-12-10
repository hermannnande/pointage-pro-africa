const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');
const { clockInValidation, clockOutValidation, validate } = require('../middleware/validator');
const upload = require('../middleware/upload');

// Routes employés
router.post('/clock-in', 
  protect, 
  upload.single('selfie'),
  clockInValidation, 
  validate, 
  attendanceController.clockIn
);

router.post('/clock-out', 
  protect,
  upload.single('selfie'),
  clockOutValidation, 
  validate, 
  attendanceController.clockOut
);

router.post('/sync', protect, attendanceController.syncAttendances);

router.get('/my-attendances', protect, attendanceController.getMyAttendances);

// Routes managers/admin
router.get('/team', 
  protect, 
  authorize('manager', 'admin', 'super_admin'), 
  attendanceController.getTeamAttendances
);

router.put('/:id/correct', 
  protect, 
  authorize('manager', 'admin', 'super_admin'), 
  attendanceController.correctAttendance
);

module.exports = router;

