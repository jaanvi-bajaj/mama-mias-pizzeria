const supabase = require('../config/db');

class ReservationModel {
    static async create(reservationData) {
        const { name, email, phone, date, time, guests, notes } = reservationData;

        const { data, error } = await supabase
            .from('reservations')
            .insert([
                {
                    name,
                    email,
                    phone,
                    date,
                    time,
                    guests,
                    notes: notes || null,
                    status: 'pending'
                }
            ])
            .select()
            .single();

        if (error) {
            throw new Error(`Error creating reservation: ${error.message}`);
        }

        return data;
    }

    static async getAll() {
        const { data, error } = await supabase
            .from('reservations')
            .select('*')
            .order('date', { ascending: false })
            .order('time', { ascending: false });

        if (error) {
            throw new Error(`Error fetching reservations: ${error.message}`);
        }

        return data;
    }

    static async getById(id) {
        const { data, error } = await supabase
            .from('reservations')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) {
            throw new Error(`Error fetching reservation: ${error.message}`);
        }

        return data;
    }

    static async updateStatus(id, status) {
        const { data, error } = await supabase
            .from('reservations')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(`Error updating reservation status: ${error.message}`);
        }

        return data;
    }
}

module.exports = ReservationModel;
