const express = require('express');
const router = express.Router();
const { generateQR, getQRAccessRecords, revokeQRAccess } = require('../controllers/qrController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/generate', generateQR);
router.get('/', getQRAccessRecords);
router.delete('/:id', revokeQRAccess);

module.exports = router;
