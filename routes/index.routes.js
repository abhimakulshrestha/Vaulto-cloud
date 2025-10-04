const express = require('express');
const upload = require('../config/multer.config');
const router = express.Router();
const fileModel = require('../models/files.models');
const authMiddleware = require('../middlewares/authe');
const firebase = require('../config/firebase.config');

// Check if Firebase is available
const isFirebaseAvailable = firebase && firebase.apps && firebase.apps.length > 0;

router.get('/home', authMiddleware, async(req, res) => {
    try {
        const userFiles = await fileModel.find({ user: req.user.id });
        console.log('User files:', userFiles);
        res.render('home', { files: userFiles });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.render('home', { files: [] });
    }
});

router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const newFile = await fileModel.create({
            path: req.file.path, // This will be the Firebase Storage URL
            originalname: req.file.originalname,
            user: req.user.id
        });
        
        // Redirect to success page with file name
        res.render('success', { fileName: req.file.originalname });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to upload file', 
            details: error.message 
        });
    }
});

router.get('/view/:fileId', authMiddleware, async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const loggedInUserId = req.user.id;

        const file = await fileModel.findOne({ _id: fileId, user: loggedInUserId });
        if (!file) {
            return res.status(404).json({ error: 'File not found or unauthorized' });
        }

        if (!isFirebaseAvailable) {
            return res.status(503).json({ error: 'File storage not available' });
        }

        const bucket = firebase.storage().bucket();
        const fileRef = bucket.file(file.path);
        
        const signedUrl = await fileRef.getSignedUrl({
            action: 'read',
            expires: Date.now() + 60 * 60 * 1000, // 1 hour
        });
        
        res.redirect(signedUrl[0]);
    } catch (error) {
        console.error('View error:', error);
        res.status(500).json({ error: 'Failed to view file', details: error.message });
    }
});

router.get('/download/:fileId', authMiddleware, async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const loggedInUserId = req.user.id;

        const file = await fileModel.findOne({ _id: fileId, user: loggedInUserId });
        if (!file) {
            return res.status(404).json({ error: 'File not found or unauthorized' });
        }

        if (!isFirebaseAvailable) {
            return res.status(503).json({ error: 'File storage not available' });
        }

        const bucket = firebase.storage().bucket();
        const fileRef = bucket.file(file.path);
        
        const signedUrl = await fileRef.getSignedUrl({
            action: 'read',
            expires: Date.now() + 60 * 60 * 1000, // 1 hour
        });
        
        res.redirect(signedUrl[0]);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Failed to download file', details: error.message });
    }
});

router.delete('/delete/:fileId', authMiddleware, async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const loggedInUserId = req.user.id;

        const file = await fileModel.findOne({ _id: fileId, user: loggedInUserId });
        if (!file) {
            return res.status(404).json({ error: 'File not found or unauthorized' });
        }

        // Delete from Firebase Storage
        if (isFirebaseAvailable) {
            const bucket = firebase.storage().bucket();
            const fileRef = bucket.file(file.path);
            
            try {
                await fileRef.delete();
                console.log('File deleted from Firebase Storage:', file.path);
            } catch (firebaseError) {
                console.error('Firebase deletion error:', firebaseError);
                // Continue with database deletion even if Firebase deletion fails
            }
        }

        // Delete from database
        await fileModel.findByIdAndDelete(fileId);
        
        res.json({ 
            success: true, 
            message: 'File deleted successfully',
            fileId: fileId 
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Failed to delete file', details: error.message });
    }
});

module.exports = router;