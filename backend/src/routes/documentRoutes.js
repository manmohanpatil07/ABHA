const express = require('express');
const router = express.Router();
const { getDocuments, addDocument, deleteDocument } = require('../controllers/documentController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getDocuments);
router.post('/', addDocument);
router.delete('/:id', deleteDocument);

module.exports = router;
