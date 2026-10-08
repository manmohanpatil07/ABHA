const express = require('express');
const router = express.Router();
const { getProviderProfile, scanPatientQR, getAuthorizedPatientDetails } = require('../controllers/providerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All provider routes require: valid JWT + healthcare_provider role
router.use(authMiddleware);
router.use(roleMiddleware(['healthcare_provider']));

router.get('/profile', getProviderProfile);
router.post('/scan-qr', scanPatientQR);
router.get('/patient/:userId', getAuthorizedPatientDetails);

module.exports = router;
