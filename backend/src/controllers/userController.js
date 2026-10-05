const pool = require('../config/database');

const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const [users] = await pool.query(
            `SELECT user_id, full_name, mobile, email, date_of_birth, gender, city, state, blood_group, emergency_contact 
             FROM users WHERE user_id = ?`,
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, profile: users[0] });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { full_name, email, date_of_birth, gender, city, state, blood_group, emergency_contact } = req.body;

        await pool.query(
            `UPDATE users 
             SET full_name = ?, email = ?, date_of_birth = ?, gender = ?, city = ?, state = ?, blood_group = ?, emergency_contact = ?, updated_at = CURRENT_TIMESTAMP
             WHERE user_id = ?`,
            [full_name, email || null, date_of_birth || null, gender || null, city || null, state || null, blood_group || null, emergency_contact || null, userId]
        );

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getProfile,
    updateProfile
};
