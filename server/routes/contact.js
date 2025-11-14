const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contactController');

router.post('/', ContactController.create);
router.get('/', ContactController.getAll);
router.get('/:id', ContactController.getById);

module.exports = router;