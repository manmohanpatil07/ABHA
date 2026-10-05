const pool = require('../config/database');

// Health Records
const getHealthRecords = async (req, res) => {
    try {
        const userId = req.user.userId;
        const [records] = await pool.query(
            `SELECT record_id, user_id, record_type, title, description, record_date, created_at 
             FROM health_records WHERE user_id = ? ORDER BY record_date DESC`,
            [userId]
        );
        res.json({ success: true, records });
    } catch (error) {
        console.error('getHealthRecords error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const addHealthRecord = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { record_type, title, description, record_date } = req.body;
        
        if (!record_type || !title || !record_date) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const [result] = await pool.query(
            `INSERT INTO health_records (user_id, record_type, title, description, record_date) 
             VALUES (?, ?, ?, ?, ?)`,
            [userId, record_type, title, description || null, record_date]
        );
        
        res.status(201).json({ success: true, message: 'Record added successfully', recordId: result.insertId });
    } catch (error) {
        console.error('addHealthRecord error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteHealthRecord = async (req, res) => {
    try {
        const userId = req.user.userId;
        const recordId = req.params.id;

        const [result] = await pool.query(
            'DELETE FROM health_records WHERE record_id = ? AND user_id = ?',
            [recordId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Record not found or not authorized' });
        }

        res.json({ success: true, message: 'Record deleted successfully' });
    } catch (error) {
        console.error('deleteHealthRecord error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getHealthRecords,
    addHealthRecord,
    deleteHealthRecord
};
