const pool = require('../config/database');

const getProviderProfile = async (req, res) => {
    try {
        const providerId = req.user.providerId;

        const [providers] = await pool.query(
            `SELECT provider_id, full_name, provider_type, clinic_name, mobile, email, city, state, created_at
             FROM providers WHERE provider_id = ?`,
            [providerId]
        );

        if (providers.length === 0) {
            return res.status(404).json({ success: false, message: 'Provider not found' });
        }

        res.json({ success: true, provider: providers[0] });
    } catch (error) {
        console.error('getProviderProfile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const scanPatientQR = async (req, res) => {
    try {
        const providerId = req.user.providerId;
        const { access_token } = req.body;

        if (!access_token) {
            return res.status(400).json({ success: false, message: 'QR access token is required' });
        }

        const [records] = await pool.query(
            `SELECT access_id, user_id, provider_id, access_token, permission, expires_at, created_at
             FROM qr_access WHERE access_token = ?`,
            [access_token]
        );

        if (records.length === 0) {
            return res.status(404).json({ success: false, message: 'Invalid QR code' });
        }

        const qrRecord = records[0];

        // Validate expiration
        const now = new Date();
        const expiresAt = new Date(qrRecord.expires_at);
        if (now > expiresAt) {
            return res.status(403).json({ success: false, message: 'QR code has expired' });
        }

        // Validate provider if restricted
        if (qrRecord.provider_id && qrRecord.provider_id !== providerId) {
            return res.status(403).json({ success: false, message: 'QR code is not authorized for this provider' });
        }

        // Validate permission
        if (qrRecord.permission !== 'view') {
            return res.status(403).json({ success: false, message: 'Invalid permission level' });
        }

        // Return successful authorization context
        res.json({ 
            success: true, 
            message: 'QR code verified successfully',
            user_id: qrRecord.user_id,
            access_id: qrRecord.access_id
        });
    } catch (error) {
        console.error('scanPatientQR error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getAuthorizedPatientDetails = async (req, res) => {
    try {
        const providerId = req.user.providerId;
        const userId = req.params.userId;
        const accessId = req.query.accessId;

        if (!userId || !accessId) {
            return res.status(400).json({ success: false, message: 'Missing userId or accessId' });
        }

        // 1. Re-verify the authorization via qr_access
        const [accessRecords] = await pool.query(
            `SELECT * FROM qr_access WHERE access_id = ? AND user_id = ?`,
            [accessId, userId]
        );

        if (accessRecords.length === 0) {
            return res.status(403).json({ success: false, message: 'Unauthorized access attempt' });
        }

        const access = accessRecords[0];
        
        if (new Date() > new Date(access.expires_at)) {
            return res.status(403).json({ success: false, message: 'Access has expired' });
        }
        
        if (access.provider_id && access.provider_id !== providerId) {
            return res.status(403).json({ success: false, message: 'Access denied for this provider' });
        }

        // 2. Fetch patient details safely
        const [users] = await pool.query(
            `SELECT user_id, full_name, mobile, email, date_of_birth, gender, city, state, blood_group, emergency_contact
             FROM users WHERE user_id = ?`,
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        // 3. Fetch health records
        const [healthRecords] = await pool.query(
            `SELECT record_id, record_type, title, description, record_date, created_at
             FROM health_records WHERE user_id = ? ORDER BY record_date DESC`,
            [userId]
        );

        // 4. Fetch documents
        const [documents] = await pool.query(
            `SELECT document_id, document_type, document_name, file_url, created_at
             FROM documents WHERE user_id = ? ORDER BY created_at DESC`,
            [userId]
        );

        // 5. Fetch vaccinations
        const [vaccinations] = await pool.query(
            `SELECT vaccination_id, vaccine_name, vaccination_date, next_due_date, notes
             FROM vaccinations WHERE user_id = ? ORDER BY vaccination_date DESC`,
            [userId]
        );

        res.json({
            success: true,
            patient: users[0],
            records: healthRecords,
            documents: documents,
            vaccinations: vaccinations
        });

    } catch (error) {
        console.error('getAuthorizedPatientDetails error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getProviderProfile,
    scanPatientQR,
    getAuthorizedPatientDetails
};
