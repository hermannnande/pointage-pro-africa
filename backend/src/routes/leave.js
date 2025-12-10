const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/auth');
const { createLeaveValidation, validate } = require('../middleware/validator');
const upload = require('../middleware/upload');

// Routes employés
router.post('/', 
  protect,
  upload.array('attachments', 5),
  createLeaveValidation, 
  validate, 
  leaveController.createLeave
);

router.get('/my-leaves', protect, leaveController.getMyLeaves);

router.delete('/:id', protect, leaveController.cancelLeave);

// Routes managers/admin
router.get('/team', 
  protect, 
  authorize('manager', 'admin', 'super_admin'), 
  leaveController.getTeamLeaves
);

router.put('/:id/review', 
  protect, 
  authorize('manager', 'admin', 'super_admin'), 
  leaveController.reviewLeave
);

module.exports = router;

