const MenuModel = require('../models/menuModel');

class MenuController {
    static async getAllItems(req, res) {
        try {
            const items = await MenuModel.getAllItems();
            res.json(items);
        } catch (error) {
            console.error('Error fetching menu items:', error);
            res.status(500).json({ error: 'Failed to fetch menu items' });
        }
    }

    static async getItemById(req, res) {
        try {
            const item = await MenuModel.getItemById(req.params.id);
            if (!item) {
                return res.status(404).json({ error: 'Menu item not found' });
            }
            res.json(item);
        } catch (error) {
            console.error('Error fetching menu item:', error);
            res.status(500).json({ error: 'Failed to fetch menu item' });
        }
    }

    static async getItemsByCategory(req, res) {
        try {
            const items = await MenuModel.getItemsByCategory(req.params.category);
            res.json(items);
        } catch (error) {
            console.error('Error fetching menu items by category:', error);
            res.status(500).json({ error: 'Failed to fetch menu items' });
        }
    }
}

module.exports = MenuController;