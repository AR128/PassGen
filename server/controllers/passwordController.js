const Password = require('../models/Password');
const User = require('../models/User');
const { encrypt, decrypt } = require('../utils/cryptoUtils');
const crypto = require('crypto');

// @desc    Generate a random password
// @route   POST /api/passwords/generate
// @access  Private (Auth0 protected)
const generatePassword = (req, res) => {
    const { length = 12, includeUppercase = true, includeLowercase = true, includeNumbers = true, includeSymbols = true } = req.body;

    let chars = '';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (chars.length === 0) {
        return res.status(400).json({ message: 'At least one character type must be selected.' });
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    res.json({ password });
};


// @desc    Save a password for the authenticated user
// @route   POST /api/passwords
// @access  Private (Auth0 protected)
const savePassword = async (req, res) => {
    const { appName, password: plainPassword } = req.body;
    const auth0Id = req.auth.sub; // Auth0 user ID

    if (!appName || !plainPassword) {
        return res.status(400).json({ message: 'Please provide app name and password.' });
    }

    try {
        // Find or create the user in your database
        let user = await User.findOne({ auth0Id });
        if (!user) {
            user = await User.create({ auth0Id });
        }

        // Encrypt the password
        const { encryptedData, iv } = encrypt(plainPassword);

        const password = await Password.create({
            userId: user._id,
            appName,
            encryptedPassword: encryptedData,
            iv: iv.toString('hex') // Store IV as a hex string
        });

        // Respond with the saved password (excluding sensitive data)
        res.status(201).json({
            _id: password._id,
            appName: password.appName,
            createdAt: password.createdAt
        });
    } catch (error) {
        console.error('Error saving password:', error);
        res.status(500).json({ message: 'Server error while saving password.' });
    }
};

// @desc    Get all passwords for the authenticated user
// @route   GET /api/passwords
// @access  Private (Auth0 protected)
const getPasswords = async (req, res) => {
    const auth0Id = req.auth.sub; // Auth0 user ID

    try {
        const user = await User.findOne({ auth0Id });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Find passwords associated with this user ID
        const passwords = await Password.find({ userId: user._id });

        // Decrypt each password before sending to the client
        const decryptedPasswords = passwords.map(p => {
            try {
                const decrypted = decrypt(p.encryptedPassword, Buffer.from(p.iv, 'hex'));
                return {
                    _id: p._id,
                    appName: p.appName,
                    password: decrypted,
                    createdAt: p.createdAt
                };
            } catch (decryptionError) {
                console.error(`Error decrypting password for app ${p.appName}:`, decryptionError);
                return {
                    _id: p._id,
                    appName: p.appName,
                    password: '[Decryption Error]', // Indicate an error without crashing
                    createdAt: p.createdAt
                };
            }
        });

        res.json(decryptedPasswords);
    } catch (error) {
        console.error('Error fetching passwords:', error);
        res.status(500).json({ message: 'Server error while fetching passwords.' });
    }
};

// @desc    Delete a password
// @route   DELETE /api/passwords/:id
// @access  Private (Auth0 protected)
const deletePassword = async (req, res) => {
    const auth0Id = req.auth.sub; // Auth0 user ID
    const passwordId = req.params.id;

    try {
        const user = await User.findOne({ auth0Id });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const password = await Password.findOne({ _id: passwordId, userId: user._id });

        if (!password) {
            return res.status(404).json({ message: 'Password not found or not authorized to delete.' });
        }

        await Password.deleteOne({ _id: passwordId }); // Use deleteOne or findByIdAndDelete
        res.json({ message: 'Password removed' });

    } catch (error) {
        console.error('Error deleting password:', error);
        res.status(500).json({ message: 'Server error while deleting password.' });
    }
};

module.exports = {
    generatePassword,
    savePassword,
    getPasswords,
    deletePassword
};