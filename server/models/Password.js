const mongoose = require('mongoose');

const passwordSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // References the User model
    },
    appName: {
        type: String,
        required: true,
        trim: true // Removes whitespace from both ends of a string
    },
    encryptedPassword: {
        type: String,
        required: true
    },
    iv: { // Initialization Vector for AES encryption
        type: String,
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const Password = mongoose.model('Password', passwordSchema);

module.exports = Password;