const pool = require('../config/database');

const getDocuments = async (req, res) => {
    try {
        const userId = req.user.userId;
        const [documents] = await pool.query(
            `SELECT document_id, user_id, document_type, document_name, file_url, uploaded_at 
             FROM documents WHERE user_id = ? ORDER BY uploaded_at DESC`,
            [userId]
        );
        res.json({ success: true, documents });
    } catch (error) {
        console.error('getDocuments error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const addDocument = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { document_type, document_name, file_url } = req.body;
        
        if (!document_type || !document_name || !file_url) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const [result] = await pool.query(
            `INSERT INTO documents (user_id, document_type, document_name, file_url) 
             VALUES (?, ?, ?, ?)`,
            [userId, document_type, document_name, file_url]
        );
        
        res.status(201).json({ success: true, message: 'Document added successfully', documentId: result.insertId });
    } catch (error) {
        console.error('addDocument error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteDocument = async (req, res) => {
    try {
        const userId = req.user.userId;
        const documentId = req.params.id;

        const [result] = await pool.query(
            'DELETE FROM documents WHERE document_id = ? AND user_id = ?',
            [documentId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Document not found or not authorized' });
        }

        res.json({ success: true, message: 'Document deleted successfully' });
    } catch (error) {
        console.error('deleteDocument error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getDocuments,
    addDocument,
    deleteDocument
};
