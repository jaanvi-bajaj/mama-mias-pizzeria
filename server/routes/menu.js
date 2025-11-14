const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/menuController');

router.get('/', MenuController.getAllItems);
router.get('/:id', MenuController.getItemById);
router.get('/category/:category', MenuController.getItemsByCategory);

module.exports = router;