const pool = require('../config/database');

const getHospitals = async (req, res) => {
    try {
        const { city, pmjay_status } = req.query;
        let query = 'SELECT * FROM hospitals WHERE 1=1';
        let queryParams = [];

        if (city) {
            query += ' AND city = ?';
            queryParams.push(city);
        }

        if (pmjay_status === 'true') {
            query += ' AND pmjay_status = TRUE';
        }

        query += ' ORDER BY hospital_name ASC';

        const [hospitals] = await pool.query(query, queryParams);
        res.json({ success: true, hospitals });
    } catch (error) {
        console.error('getHospitals error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getHospitalById = async (req, res) => {
    try {
        const hospitalId = req.params.id;
        const [hospitals] = await pool.query('SELECT * FROM hospitals WHERE hospital_id = ?', [hospitalId]);
        
        if (hospitals.length === 0) {
            return res.status(404).json({ success: false, message: 'Hospital not found' });
        }
        
        res.json({ success: true, hospital: hospitals[0] });
    } catch (error) {
        console.error('getHospitalById error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getHospitals,
    getHospitalById
};
