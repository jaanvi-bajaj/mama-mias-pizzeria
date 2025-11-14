const supabase = require('../config/db');

class MenuModel {
    static async getAllItems() {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .eq('available', true)
            .order('category', { ascending: true })
            .order('name', { ascending: true });

        if (error) {
            throw new Error(`Error fetching menu items: ${error.message}`);
        }

        return data;
    }

    static async getItemById(id) {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) {
            throw new Error(`Error fetching menu item: ${error.message}`);
        }

        return data;
    }

    static async getItemsByCategory(category) {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .eq('category', category)
            .eq('available', true)
            .order('name', { ascending: true });

        if (error) {
            throw new Error(`Error fetching menu items by category: ${error.message}`);
        }

        return data;
    }
}

module.exports = MenuModel;
