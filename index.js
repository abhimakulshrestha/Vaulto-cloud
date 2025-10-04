const express = require('express');
const userRouter = require('./routes/user.routes');
const indexRouter = require('./routes/index.routes');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');

// Add error handling for database connection
try {
    const connectToDB = require('./config/db');
    connectToDB().catch(err => {
        console.log('Database connection failed:', err.message);
        console.log('Continuing without database connection...');
    });
} catch (error) {
    console.log('Database module error:', error.message);
    console.log('Continuing without database connection...');
}

// Initialize Firebase
try {
    require('./config/firebase.config');
} catch (error) {
    console.log('Firebase initialization error:', error.message);
    console.log('Continuing without Firebase...');
}

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/', userRouter);

// Export the Express app for Vercel
module.exports = app;