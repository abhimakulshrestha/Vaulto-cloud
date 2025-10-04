const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Root route - redirect to home if logged in, otherwise to login
router.get('/', (req, res) => {
    const token = req.cookies.token;
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET);
            return res.redirect('/home');
        } catch (err) {
            // Token is invalid, continue to login
        }
    }
    res.redirect('/login');
});

router.get('/test-connection', (req, res) => {
    res.send('<h1>Server is working!</h1><p>Connection successful</p>');
});

// Health check endpoint for deployment debugging
router.get('/health', (req, res) => {
    const healthCheck = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: process.env.MONGO_URI ? 'Configured' : 'Not configured',
        firebase: process.env.FIREBASE_PROJECT_ID ? 'Configured' : 'Not configured',
        jwt: process.env.JWT_SECRET ? 'Configured' : 'Not configured'
    };
    res.json(healthCheck);
});

router.get('/register', (req, res) => {
    console.log('Loading register form from EJS...');
    res.render('register');
});

router.post('/register', 
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('username').trim().isLength({ min: 3 }).notEmpty().withMessage('Username must be at least 3 characters long'),
    async(req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message:'Invalid data' });
            }
            
            const {email, username, password} = req.body;
            
            // Check if user already exists
            const existingUser = await userModel.findOne({ 
                $or: [{ email }, { username }] 
            });
            
            if (existingUser) {
                return res.status(400).json({ 
                    message: 'User with this email or username already exists' 
                });
            }
            
            const hashPassword = await bcrypt.hash(password, 10);
            const newUser = await userModel.create({
                email,
                username,
                password: hashPassword
            });
            
            // Don't send the password in response
            const userResponse = {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                createdAt: newUser.createdAt
            };
            
            res.status(201).json({
                message: 'User registered successfully',
                user: userResponse
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ 
                message: 'Internal server error',
                error: error.message 
            });
        }
});

router.get('/login', (req, res) => {
    res.render('login')
});

router.post('/login', 
    body('username').trim().isLength({ min: 3 }).notEmpty().withMessage('Username is required'),
    body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    async(req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message:'Invalid data' });
            }

            const {username, password} = req.body;
            const user = await userModel.findOne({ username: username });
            if(!user){
                return res.status(400).json({message:'Invalid username or password'});
            }
            
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(400).json({message:'Invalid username or password'});
            }
            
            const token = jwt.sign(
                {id: user._id, username: user.username, email: user.email}, 
                process.env.JWT_SECRET, 
                {expiresIn: '1d'}
            );
            
            res.cookie('token', token, { 
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });
            
            res.json({
                message: 'Login successful', 
                userId: user._id, 
                username: user.username
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ 
                message: 'Internal server error',
                error: error.message 
            });
        }
    }
);

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

module.exports = router;