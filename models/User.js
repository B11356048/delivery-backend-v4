const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    role: { 
        type: String, 
        required: true,
        enum: ['customer', 'merchant', 'driver', 'admin'] // 對應你 HTML 的四端身分
    },
    email: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
