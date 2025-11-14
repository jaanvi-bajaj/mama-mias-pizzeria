const ReservationModel = require('../models/reservationModel');

class ReservationController {
    static async create(req, res) {
        try {
            const { name, email, phone, date, time, guests } = req.body;

            if (!name || !email || !phone || !date || !time || !guests) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    message: 'Please provide name, email, phone, date, time, and guests'
                });
            }

            if (guests < 1 || guests > 20) {
                return res.status(400).json({
                    error: 'Invalid number of guests',
                    message: 'Number of guests must be between 1 and 20'
                });
            }

            const reservation = await ReservationModel.create(req.body);
            res.status(201).json({
                message: 'Reservation created successfully',
                data: reservation
            });
        } catch (error) {
            console.error('Error creating reservation:', error);
            res.status(500).json({ error: 'Failed to create reservation' });
        }
    }

    static async getAll(req, res) {
        try {
            const reservations = await ReservationModel.getAll();
            res.json(reservations);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            res.status(500).json({ error: 'Failed to fetch reservations' });
        }
    }

    static async getById(req, res) {
        try {
            const reservation = await ReservationModel.getById(req.params.id);
            if (!reservation) {
                return res.status(404).json({ error: 'Reservation not found' });
            }
            res.json(reservation);
        } catch (error) {
            console.error('Error fetching reservation:', error);
            res.status(500).json({ error: 'Failed to fetch reservation' });
        }
    }

    static async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const updated = await ReservationModel.updateStatus(req.params.id, status);
            if (!updated) {
                return res.status(404).json({ error: 'Reservation not found' });
            }
            res.json({ message: 'Reservation status updated successfully' });
        } catch (error) {
            console.error('Error updating reservation status:', error);
            res.status(500).json({ error: 'Failed to update reservation status' });
        }
    }
}

module.exports = ReservationController;