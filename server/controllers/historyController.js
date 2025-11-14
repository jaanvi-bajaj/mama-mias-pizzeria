const HistoryModel = require('../models/historyModel');

class HistoryController {
    static async getAll(req, res) {
        try {
            const history = await HistoryModel.getAll();
            res.json(history);
        } catch (error) {
            console.error('Error fetching history:', error);
            res.status(500).json({ error: 'Failed to fetch history' });
        }
    }

    static async getById(req, res) {
        try {
            const historyItem = await HistoryModel.getById(req.params.id);
            if (!historyItem) {
                return res.status(404).json({ error: 'History item not found' });
            }
            res.json(historyItem);
        } catch (error) {
            console.error('Error fetching history item:', error);
            res.status(500).json({ error: 'Failed to fetch history item' });
        }
    }

    static async create(req, res) {
        try {
            const history = await HistoryModel.create(req.body);
            res.status(201).json({
                message: 'History item created successfully',
                data: history
            });
        } catch (error) {
            console.error('Error creating history item:', error);
            res.status(500).json({ error: 'Failed to create history item' });
        }
    }
}

module.exports = HistoryController;
