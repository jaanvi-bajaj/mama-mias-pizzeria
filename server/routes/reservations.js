const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/reservationController');

router.post('/', ReservationController.create);
router.get('/', ReservationController.getAll);
router.get('/:id', ReservationController.getById);
router.patch('/:id/status', ReservationController.updateStatus);

module.exports = router;