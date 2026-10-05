const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const register = async (req, res) => {
    try {
        const { full_name, mobile, email, date_of_birth, gender, city, state, password } = req.body;

        if (!full_name || !mobile || !date_of_birth || !gender || !password) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const [existing] = await pool.query('SELECT * FROM users WHERE mobile = ?', [mobile]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Mobile number already registered' });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            `INSERT INTO users (full_name, mobile, email, date_of_birth, gender, city, state, password_hash)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [full_name, mobile, email || null, date_of_birth, gender, city || null, state || null, password_hash]
        );

        res.status(201).json({ success: true, message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { mobile, password } = req.body;

        if (!mobile || !password) {
            return res.status(400).json({ success: false, message: 'Mobile and password required' });
        }

        const [users] = await pool.query('SELECT * FROM users WHERE mobile = ?', [mobile]);
        
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.user_id, role: 'user' },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            token,
            role: 'user',
            userId: user.user_id,
            user: {
                full_name: user.full_name,
                mobile: user.mobile
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    register,
    login
};
