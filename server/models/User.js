const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    auth0Id: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);

module.exports = User;