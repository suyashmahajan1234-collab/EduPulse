const express = require('express');
const router = express.Router();
const {
  getTimetables,
  saveTimetable,
  deleteTimetable,
} = require('../controllers/timetableController');

router.route('/').get(getTimetables).post(saveTimetable);
router.route('/:id').delete(deleteTimetable);

module.exports = router;

