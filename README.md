# Vaulto - Cloud Storage

A modern cloud storage application built with Node.js, Express, and Firebase that allows users to securely upload, store, and manage their files in the cloud. **Ready for Vercel deployment!**

## 🚀 Features

- **User Authentication**: Secure user registration and login system with JWT tokens
- **File Upload**: Upload files to Firebase Cloud Storage with drag-and-drop support
- **File Management**: View, organize, and manage uploaded files
- **Secure Storage**: Files are stored securely in Firebase Cloud Storage
- **User Dashboard**: Personalized dashboard for each user
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **EJS Templates**: Server-side rendered pages for optimal performance
- **Vercel Ready**: Optimized for serverless deployment

## 🛠️ Tech Stack

### Backend
- **Node.js** (>=18.x) - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database for user and file metadata
- **Mongoose** - MongoDB object modeling
- **Firebase Admin SDK** - Firebase services integration
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling

### Frontend
- **EJS** - Template engine
- **Tailwind CSS** - Styling framework
- **Flowbite** - UI components
- **Remix Icons** - Icon library

### Deployment
- **Vercel** - Serverless deployment platform
- **MongoDB Atlas** - Cloud database
- **Firebase Storage** - Cloud file storage

## 📋 Prerequisites

Before running this application, make sure you have:
- Node.js (version 18.x or higher)
- MongoDB Atlas account (free tier available)
- Firebase project with Storage enabled
- Vercel account (for deployment)

## 🔧 Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Vaulto-cloud
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. **Configure Firebase (Local Development)**
   - Download your Firebase service account key from Firebase Console
   - Place it in the project root (temporarily for local development)
   - **Note**: This file will be ignored in production for security

5. **Start the application**
   ```bash
   # For development
   npm run dev
   
   # For production
   npm start
   ```

## 🚀 Vercel Deployment

This project is **fully configured for Vercel deployment**. Follow these steps:

### 1. **Set up MongoDB Atlas**
- Create a free MongoDB Atlas cluster
- Get your connection string
- Add it to Vercel environment variables as `MONGO_URI`

### 2. **Configure Firebase**
- Create a Firebase project
- Enable Cloud Storage
- Generate a service account key
- Extract values for Vercel environment variables

### 3. **Deploy to Vercel**
- Connect your GitHub repository to Vercel
- Set all required environment variables in Vercel dashboard
- Deploy!

### 4. **Required Environment Variables for Vercel**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
JWT_SECRET=your_very_secure_jwt_secret_key_here
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your_service_account_email
FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NODE_ENV=production
```

### 5. **Test Your Deployment**
- Visit `/health` endpoint to check configuration status
- Visit `/test-connection` for basic connectivity test

📖 **For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

## 🔐 Security Features

- **Password Hashing**: Passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication  
- **File Type Validation**: Upload restrictions for security
- **Environment Variables**: Sensitive data stored securely
- **Secure Cookies**: HTTP-only, secure cookies for production
- **Input Validation**: Server-side validation using express-validator

## 🐛 Recent Fixes & Improvements

This version includes fixes for:
- ✅ **Vercel Deployment Issues**: Fixed configuration for serverless deployment
- ✅ **Environment Variables**: Proper handling for production vs development
- ✅ **Firebase Configuration**: Secure environment variable setup
- ✅ **Security Vulnerabilities**: Removed sensitive files from repository
- ✅ **Error Handling**: Graceful fallbacks for database and Firebase connections
- ✅ **Cookie Security**: Production-ready cookie settings
- ✅ **File Upload**: Improved Firebase Storage integration
- ✅ **Database Connection**: Better error handling and fallbacks

## 📁 Project Structure

```
├── index.js              # Main application entry point (Vercel)
├── app.js                # Local development server
├── package.json           # Project dependencies and scripts
├── vercel.json           # Vercel deployment configuration
├── .gitignore            # Git ignore rules (security)
├── DEPLOYMENT.md         # Detailed deployment guide
├── config/
│   ├── db.js             # MongoDB connection configuration
│   ├── firebase.config.js # Firebase configuration
│   └── multer.config.js   # Multer file upload configuration
├── middlewares/
│   └── authe.js          # Authentication middleware
├── models/
│   ├── user.model.js     # User data model
│   └── files.models.js   # File metadata model
├── routes/
│   ├── index.routes.js   # Main application routes
│   └── user.routes.js    # User-related routes
└── views/
    ├── home.ejs          # Home page template
    ├── login.ejs         # Login page template
    ├── register.ejs      # Registration page template
    └── success.ejs       # Success page template
```

## 🔧 Quick Setup Guide

### For Local Development
1. **MongoDB**: Use MongoDB Atlas (free tier) or local MongoDB
2. **Firebase**: Download service account JSON file (temporarily)
3. **Environment**: Create `.env` file with required variables

### For Vercel Deployment
1. **MongoDB Atlas**: Create cluster and get connection string
2. **Firebase**: Generate service account and extract environment variables
3. **Vercel**: Set all environment variables in dashboard
4. **Deploy**: Connect GitHub repository and deploy

## 🚀 Usage

1. **Register**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials
3. **Upload Files**: Use the upload interface to add files to your cloud storage
4. **Manage Files**: View, organize, and manage your uploaded files
5. **Secure Access**: All files are private and accessible only by the file owner

## 📝 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /logout` - User logout

### File Management
- `POST /upload` - Upload files
- `GET /home` - Dashboard/home page
- `GET /view/:fileId` - View file
- `GET /download/:fileId` - Download file
- `DELETE /delete/:fileId` - Delete file

### Health & Testing
- `GET /health` - Configuration status check
- `GET /test-connection` - Basic connectivity test

## 🐛 Troubleshooting

### Common Deployment Issues

1. **Vercel Deployment Fails**
   - Check all environment variables are set in Vercel dashboard
   - Verify MongoDB Atlas connection string format
   - Ensure Firebase environment variables are correctly formatted

2. **Database Connection Issues**
   - Verify `MONGO_URI` is set correctly in Vercel
   - Check MongoDB Atlas network access settings
   - Ensure database user has proper permissions

3. **Firebase Storage Issues**
   - Verify all Firebase environment variables are set
   - Check Firebase Storage rules
   - Ensure service account has Storage Admin permissions

4. **File Upload Issues**
   - Check Firebase Storage bucket configuration
   - Verify file size limits (10MB max)
   - Check allowed file types in multer configuration

### Health Check Endpoints
- Visit `/health` to see configuration status
- Visit `/test-connection` for basic connectivity test

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License. See the `package.json` file for details.

## 🚀 Future Enhancements

- File sharing capabilities
- Folder organization
- File search functionality
- Advanced user permissions
- File version history
- Mobile application
- Real-time notifications

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
3. Test the `/health` endpoint for configuration status
4. Create an issue in the repository

---

**Made with ❤️ for secure cloud storage**

> **Ready for Vercel deployment!** 🚀