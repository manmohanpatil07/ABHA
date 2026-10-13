const pool = require('../config/database');

const getHospitals = async (req, res) => {
    try {
        const { city, state, pmjay_status, latitude, longitude, radius } = req.query;
        let queryParams = [];
        let selectClause = 'SELECT hospital_id, hospital_name, address, city, state, pincode, hospital_type, phone, latitude, longitude, pmjay_status, verified_at, created_at';
        let whereClause = ' WHERE 1=1';
        let havingClause = '';
        let orderClause = '';

        // If coordinates are provided, calculate distance
        if (latitude && longitude) {
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);
            
            if (isNaN(lat) || isNaN(lng)) {
                return res.status(400).json({ success: false, message: 'Invalid latitude or longitude' });
            }

            selectClause += `, ( 6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ) AS distance`;
            queryParams.push(lat, lng, lat);
            
            orderClause = ' ORDER BY distance ASC';

            if (radius) {
                const rad = parseFloat(radius);
                if (!isNaN(rad)) {
                    havingClause = ' HAVING distance <= ?';
                    queryParams.push(rad);
                }
            }
        } else {
            orderClause = ' ORDER BY hospital_name ASC';
        }

        if (city) {
            whereClause += ' AND city = ?';
            queryParams.push(city);
        }
        
        if (state) {
            whereClause += ' AND state = ?';
            queryParams.push(state);
        }

        if (pmjay_status === 'true') {
            whereClause += ' AND pmjay_status = TRUE';
        } else if (pmjay_status === 'false') {
            whereClause += ' AND pmjay_status = FALSE';
        }

        const finalQuery = `${selectClause} FROM hospitals${whereClause}${havingClause}${orderClause}`;

        const [hospitals] = await pool.query(finalQuery, queryParams);
        res.json({ success: true, hospitals });
    } catch (error) {
        console.error('getHospitals error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getHospitalById = async (req, res) => {
    try {
        const hospitalId = req.params.id;
        
        if (isNaN(parseInt(hospitalId))) {
            return res.status(400).json({ success: false, message: 'Invalid hospital ID' });
        }

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
