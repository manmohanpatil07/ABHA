const express = require('express');
const router = express.Router();
const { getHospitals, getHospitalById } = require('../controllers/hospitalController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // Only authenticated users can access hospital data based on architecture

router.get('/', getHospitals);
router.get('/:id', getHospitalById);

module.exports = router;
