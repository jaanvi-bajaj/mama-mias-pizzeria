const supabase = require('../config/db');

class HistoryModel {
    static async getAll() {
        const { data, error } = await supabase
            .from('history')
            .select('*')
            .order('year', { ascending: true });

        if (error) {
            throw new Error(`Error fetching history: ${error.message}`);
        }

        return data;
    }

    static async getById(id) {
        const { data, error } = await supabase
            .from('history')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) {
            throw new Error(`Error fetching history item: ${error.message}`);
        }

        return data;
    }

    static async create(historyData) {
        const { year, title, description } = historyData;

        const { data, error } = await supabase
            .from('history')
            .insert([
                {
                    year,
                    title,
                    description
                }
            ])
            .select()
            .single();

        if (error) {
            throw new Error(`Error creating history item: ${error.message}`);
        }

        return data;
    }
}

module.exports = HistoryModel;
