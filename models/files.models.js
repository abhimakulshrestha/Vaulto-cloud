const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    path: { type: String, required: [true, 'Path is Required'] },
    originalname: { type: String, required: [true, 'Original Name is Required'] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: [true, 'User is Required'] },
}, { timestamps: true });

const file = mongoose.model('file', fileSchema);
module.exports = file;
