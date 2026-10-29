const express = require('express');
const router = express.Router();
const {
  getFees,
  getFeeStats,
  getFeeById,
  createFee,
  recordPayment,
  deleteFee,
} = require('../controllers/feeController');

router.get('/stats', getFeeStats);
router.route('/').get(getFees).post(createFee);
router.route('/:id').get(getFeeById).delete(deleteFee);
router.put('/:id/pay', recordPayment);

module.exports = router;

