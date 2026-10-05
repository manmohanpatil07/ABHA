const express = require('express');
const router = express.Router();
const { getVaccinations, addVaccination, updateVaccination, deleteVaccination } = require('../controllers/vaccinationController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getVaccinations);
router.post('/', addVaccination);
router.put('/:id', updateVaccination);
router.delete('/:id', deleteVaccination);

module.exports = router;
