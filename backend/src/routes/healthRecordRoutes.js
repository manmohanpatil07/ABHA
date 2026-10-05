const express = require('express');
const router = express.Router();
const { getHealthRecords, addHealthRecord, deleteHealthRecord } = require('../controllers/healthRecordController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getHealthRecords);
router.post('/', addHealthRecord);
router.delete('/:id', deleteHealthRecord);

module.exports = router;
