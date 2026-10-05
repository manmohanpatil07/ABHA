const pool = require('../config/database');
const crypto = require('crypto');

const generateQR = async (req, res) => {
    try {
        const userId = req.user.userId;
        const providerId = req.body.provider_id || null;
        const permission = req.body.permission || 'view';
        
        // Generate a secure random token
        const accessToken = crypto.randomBytes(32).toString('hex');
        
        // Default expiry is 24 hours from now
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const [result] = await pool.query(
            `INSERT INTO qr_access (user_id, provider_id, access_token, permission, expires_at) 
             VALUES (?, ?, ?, ?, ?)`,
            [userId, providerId, accessToken, permission, expiresAt]
        );
        
        res.status(201).json({ success: true, message: 'QR Access generated successfully', accessToken, expiresAt });
    } catch (error) {
        console.error('generateQR error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getQRAccessRecords = async (req, res) => {
    try {
        const userId = req.user.userId;
        const [records] = await pool.query(
            `SELECT access_id, user_id, provider_id, access_token, permission, expires_at, created_at 
             FROM qr_access WHERE user_id = ? ORDER BY created_at DESC`,
            [userId]
        );
        res.json({ success: true, records });
    } catch (error) {
        console.error('getQRAccessRecords error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const revokeQRAccess = async (req, res) => {
    try {
        const userId = req.user.userId;
        const accessId = req.params.id;

        const [result] = await pool.query(
            'DELETE FROM qr_access WHERE access_id = ? AND user_id = ?',
            [accessId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Access record not found or not authorized' });
        }

        res.json({ success: true, message: 'Access revoked successfully' });
    } catch (error) {
        console.error('revokeQRAccess error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    generateQR,
    getQRAccessRecords,
    revokeQRAccess
};
