const pool = require('../config/database');

const getVaccinations = async (req, res) => {
    try {
        const userId = req.user.userId;
        const [vaccinations] = await pool.query(
            `SELECT vaccination_id, user_id, vaccine_name, vaccination_date, next_due_date, notes, created_at 
             FROM vaccinations WHERE user_id = ? ORDER BY vaccination_date DESC`,
            [userId]
        );
        res.json({ success: true, vaccinations });
    } catch (error) {
        console.error('getVaccinations error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const addVaccination = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { vaccine_name, vaccination_date, next_due_date, notes } = req.body;
        
        if (!vaccine_name || !vaccination_date) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const [result] = await pool.query(
            `INSERT INTO vaccinations (user_id, vaccine_name, vaccination_date, next_due_date, notes) 
             VALUES (?, ?, ?, ?, ?)`,
            [userId, vaccine_name, vaccination_date, next_due_date || null, notes || null]
        );
        
        res.status(201).json({ success: true, message: 'Vaccination added successfully', vaccinationId: result.insertId });
    } catch (error) {
        console.error('addVaccination error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateVaccination = async (req, res) => {
    try {
        const userId = req.user.userId;
        const vaccinationId = req.params.id;
        const { vaccine_name, vaccination_date, next_due_date, notes } = req.body;

        const [result] = await pool.query(
            `UPDATE vaccinations 
             SET vaccine_name = ?, vaccination_date = ?, next_due_date = ?, notes = ? 
             WHERE vaccination_id = ? AND user_id = ?`,
            [vaccine_name, vaccination_date, next_due_date || null, notes || null, vaccinationId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Vaccination not found or not authorized' });
        }

        res.json({ success: true, message: 'Vaccination updated successfully' });
    } catch (error) {
        console.error('updateVaccination error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteVaccination = async (req, res) => {
    try {
        const userId = req.user.userId;
        const vaccinationId = req.params.id;

        const [result] = await pool.query(
            'DELETE FROM vaccinations WHERE vaccination_id = ? AND user_id = ?',
            [vaccinationId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Vaccination not found or not authorized' });
        }

        res.json({ success: true, message: 'Vaccination deleted successfully' });
    } catch (error) {
        console.error('deleteVaccination error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getVaccinations,
    addVaccination,
    updateVaccination,
    deleteVaccination
};
