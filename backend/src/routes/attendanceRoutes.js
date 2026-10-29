const express = require('express');
const router = express.Router();
const {
  getAttendance,
  saveAttendance,
  getAttendanceSummary,
} = require('../controllers/attendanceController');

router.get('/summary', getAttendanceSummary);
router.route('/').get(getAttendance).post(saveAttendance);

module.exports = router;

