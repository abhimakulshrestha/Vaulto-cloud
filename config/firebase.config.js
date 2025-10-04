const admin = require('firebase-admin');

// Initialize Firebase Admin only if not already initialized
if (!admin.apps.length) {
    try {
        // Check if we're in production (Vercel) or development
        if (process.env.NODE_ENV === 'production' && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PRIVATE_KEY !== 'placeholder') {
            // Use environment variables for production (Vercel)
            const serviceAccount = {
                type: "service_account",
                project_id: process.env.FIREBASE_PROJECT_ID,
                private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
                private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                client_email: process.env.FIREBASE_CLIENT_EMAIL,
                client_id: process.env.FIREBASE_CLIENT_ID,
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                token_uri: "https://oauth2.googleapis.com/token",
                auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
                client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
            };
            
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'drive-9de7d.firebasestorage.app'
            });
            console.log('Firebase initialized with environment variables');
        } else {
            // Use JSON file for local development (only if file exists)
            try {
                const serviceAccount = require('../drive-9de7d-firebase-adminsdk-fbsvc-e7bf1d94f6.json');
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    storageBucket: 'drive-9de7d.firebasestorage.app'
                });
                console.log('Firebase initialized with service account file');
            } catch (fileError) {
                console.error('Firebase service account file not found:', fileError.message);
                console.log('Continuing without Firebase - file uploads will not work');
                console.log('For production deployment, set Firebase environment variables in Vercel');
                // Don't initialize Firebase if file is missing
                module.exports = null;
                return;
            }
        }
    } catch (error) {
        console.error('Firebase initialization error:', error.message);
        console.log('Continuing without Firebase - file uploads will not work');
        // Don't initialize Firebase if there's an error
        module.exports = null;
        return;
    }
}

module.exports = admin;
