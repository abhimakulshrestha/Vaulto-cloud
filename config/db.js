const mongoose = require('mongoose');

function connectToDB() {
    return mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('Connected to MongoDB');
    }).catch((error) => {
        console.error('MongoDB connection error:', error.message);
        throw error;
    });
}
module.exports = connectToDB;