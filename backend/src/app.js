const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const healthRecordRoutes = require('./routes/healthRecordRoutes');
const documentRoutes = require('./routes/documentRoutes');
const vaccinationRoutes = require('./routes/vaccinationRoutes');
const qrRoutes = require('./routes/qrRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/health-records', healthRecordRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/hospitals', hospitalRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

module.exports = app;
