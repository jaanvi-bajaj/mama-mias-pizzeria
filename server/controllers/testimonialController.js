const TestimonialModel = require('../models/testimonialModel');

class TestimonialController {
    static async getAll(req, res) {
        try {
            const testimonials = await TestimonialModel.getAll();
            res.json(testimonials);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            res.status(500).json({ error: 'Failed to fetch testimonials' });
        }
    }

    static async create(req, res) {
        try {
            const { customer_name, rating, comment } = req.body;

            if (!customer_name || !rating || !comment) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    message: 'Please provide customer_name, rating, and comment'
                });
            }

            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    error: 'Invalid rating',
                    message: 'Rating must be between 1 and 5'
                });
            }

            const testimonial = await TestimonialModel.create(req.body);
            res.status(201).json({
                message: 'Testimonial submitted successfully',
                data: testimonial
            });
        } catch (error) {
            console.error('Error creating testimonial:', error);
            res.status(500).json({ error: 'Failed to submit testimonial' });
        }
    }

    static async approve(req, res) {
        try {
            const approved = await TestimonialModel.approve(req.params.id);
            if (!approved) {
                return res.status(404).json({ error: 'Testimonial not found' });
            }
            res.json({ message: 'Testimonial approved successfully' });
        } catch (error) {
            console.error('Error approving testimonial:', error);
            res.status(500).json({ error: 'Failed to approve testimonial' });
        }
    }
}

module.exports = TestimonialController;