const express = require('express');
const router = express.Router();
const HistoryController = require('../controllers/historyController');

router.get('/', HistoryController.getAll);
router.get('/:id', HistoryController.getById);
router.post('/', HistoryController.create);

module.exports = router;
