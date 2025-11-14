const supabase = require('../config/db');

class TestimonialModel {
    static async getAll() {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('approved', true)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Error fetching testimonials: ${error.message}`);
        }

        return data;
    }

    static async create(testimonialData) {
        const { customer_name, rating, comment } = testimonialData;

        const { data, error } = await supabase
            .from('comments')
            .insert([
                {
                    customer_name,
                    rating,
                    comment,
                    approved: true
                }
            ])
            .select()
            .single();

        if (error) {
            throw new Error(`Error creating testimonial: ${error.message}`);
        }

        return data;
    }

    static async approve(id) {
        const { data, error } = await supabase
            .from('comments')
            .update({ approved: true })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(`Error approving testimonial: ${error.message}`);
        }

        return data;
    }
}

module.exports = TestimonialModel;
