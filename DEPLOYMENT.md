# Vaulto Cloud - Vercel Deployment Guide

## Prerequisites

1. **MongoDB Atlas Account**: Create a free MongoDB Atlas cluster
2. **Firebase Project**: Set up a Firebase project with Storage enabled
3. **Vercel Account**: Sign up at vercel.com

## Environment Variables Setup

### Required Environment Variables

Set these in your Vercel project dashboard under Settings > Environment Variables:

#### Database Configuration
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
```

#### JWT Configuration
```
JWT_SECRET=your_very_secure_jwt_secret_key_here
```

#### Firebase Configuration (Production)
```
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your_service_account_email
FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
```

#### Environment
```
NODE_ENV=production
```

## Firebase Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Storage in the project

2. **Generate Service Account**:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Extract the values from the JSON file for environment variables

3. **Storage Rules**:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

## MongoDB Atlas Setup

1. **Create Cluster**:
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string

2. **Database Access**:
   - Create a database user
   - Set up network access (allow all IPs for development)

## Deployment Steps

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Connect your GitHub repository to Vercel
   - Set all environment variables in Vercel dashboard
   - Deploy

3. **Verify Deployment**:
   - Check the `/health` endpoint: `https://your-app.vercel.app/health`
   - Test the `/test-connection` endpoint: `https://your-app.vercel.app/test-connection`

## Troubleshooting

### Common Issues

1. **Database Connection Failed**:
   - Check MONGO_URI format
   - Ensure MongoDB Atlas allows connections from all IPs
   - Verify database user credentials

2. **Firebase Storage Not Working**:
   - Verify all Firebase environment variables are set correctly
   - Check Firebase Storage rules
   - Ensure service account has proper permissions

3. **JWT Token Issues**:
   - Verify JWT_SECRET is set
   - Check token expiration settings

4. **File Upload Issues**:
   - Check Firebase Storage bucket configuration
   - Verify file size limits (10MB max)
   - Check allowed file types

### Health Check Endpoints

- `/health` - Shows configuration status
- `/test-connection` - Basic connectivity test

## Security Notes

- Never commit `.env` files or Firebase service account JSON files
- Use strong, unique JWT secrets
- Regularly rotate API keys and secrets
- Monitor your application logs for errors

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify all environment variables are set
3. Test endpoints individually
4. Check MongoDB Atlas and Firebase console for errors