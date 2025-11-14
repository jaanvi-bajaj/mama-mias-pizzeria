const supabase = require('../config/db');

class ContactModel {
    static async create(contactData) {
        const { name, email, subject, message } = contactData;

        const { data, error } = await supabase
            .from('contact_messages')
            .insert([
                {
                    name,
                    email,
                    subject,
                    message
                }
            ])
            .select()
            .single();

        if (error) {
            throw new Error(`Error creating contact message: ${error.message}`);
        }

        return data;
    }

    static async getAll() {
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Error fetching contact messages: ${error.message}`);
        }

        return data;
    }

    static async getById(id) {
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) {
            throw new Error(`Error fetching contact message: ${error.message}`);
        }

        return data;
    }
}

module.exports = ContactModel;
