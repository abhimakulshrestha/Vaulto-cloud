const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const firebase = require('./firebase.config');

// Custom storage engine for Firebase
class FirebaseStorage {
    constructor(opts) {
        this.bucket = firebase.storage().bucket(opts.bucketName);
        this.unique = opts.unique || false;
    }

    _handleFile(req, file, cb) {
        const fileName = this.unique ? 
            `${Date.now()}_${uuidv4()}_${file.originalname}` : 
            file.originalname;

        const fileRef = this.bucket.file(fileName);
        const stream = fileRef.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        stream.on('error', (error) => {
            console.error('Firebase upload error:', error);
            cb(error);
        });

        stream.on('finish', () => {
            cb(null, {
                path: fileName,
                filename: fileName,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: stream.bytesWritten,
                bucket: this.bucket.name,
            });
        });

        file.stream.pipe(stream);
    }

    _removeFile(req, file, cb) {
        const fileRef = this.bucket.file(file.path);
        fileRef.delete().then(() => {
            cb(null);
        }).catch((error) => {
            cb(error);
        });
    }
}

let storage;

// Check if Firebase is available
const firebaseAdmin = require('./firebase.config');
if (firebaseAdmin && firebaseAdmin.apps && firebaseAdmin.apps.length > 0) {
    try {
        storage = new FirebaseStorage({
            bucketName: process.env.FIREBASE_STORAGE_BUCKET || 'drive-9de7d.firebasestorage.app',
            unique: true
        });
        console.log('Using Firebase Storage');
    } catch (error) {
        console.error('Firebase Storage configuration error:', error);
        console.log('Using memory storage as fallback');
        storage = multer.memoryStorage();
    }
} else {
    console.log('Firebase not available, using memory storage');
    storage = multer.memoryStorage();
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Basic security check
        const allowedMimes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
            'application/pdf', 'text/plain', 'text/csv',
            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/zip', 'application/x-zip-compressed', 'application/json',
            'video/mp4', 'video/mpeg', 'video/quicktime',
            'audio/mpeg', 'audio/wav', 'audio/ogg'
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`File type ${file.mimetype} not allowed`), false);
        }
    }
});

module.exports = upload;