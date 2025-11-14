const express = require('express');
const router = express.Router();
const TestimonialController = require('../controllers/testimonialController');

router.get('/', TestimonialController.getAll);
router.post('/', TestimonialController.create);
router.patch('/:id/approve', TestimonialController.approve);

module.exports = router;