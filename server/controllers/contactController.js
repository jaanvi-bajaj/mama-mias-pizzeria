const ContactModel = require('../models/contactModel');

class ContactController {
    static async create(req, res) {
        try {
            const messageId = await ContactModel.create(req.body);
            res.status(201).json({
                message: 'Message sent successfully',
                id: messageId
            });
        } catch (error) {
            console.error('Error creating contact message:', error);
            res.status(500).json({ error: 'Failed to send message' });
        }
    }

    static async getAll(req, res) {
        try {
            const messages = await ContactModel.getAll();
            res.json(messages);
        } catch (error) {
            console.error('Error fetching contact messages:', error);
            res.status(500).json({ error: 'Failed to fetch messages' });
        }
    }

    static async getById(req, res) {
        try {
            const message = await ContactModel.getById(req.params.id);
            if (!message) {
                return res.status(404).json({ error: 'Message not found' });
            }
            res.json(message);
        } catch (error) {
            console.error('Error fetching contact message:', error);
            res.status(500).json({ error: 'Failed to fetch message' });
        }
    }
}

module.exports = ContactController;