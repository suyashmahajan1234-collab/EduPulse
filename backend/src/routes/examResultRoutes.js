const express = require('express');
const router = express.Router();
const {
  getExamResults,
  getExamResultById,
  createExamResult,
  updateExamResult,
  deleteExamResult,
} = require('../controllers/examResultController');

router.route('/').get(getExamResults).post(createExamResult);
router.route('/:id').get(getExamResultById).put(updateExamResult).delete(deleteExamResult);

module.exports = router;

