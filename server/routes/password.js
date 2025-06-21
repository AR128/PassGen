const express = require('express');
const {
    generatePassword,
    savePassword,
    getPasswords,
    deletePassword
} = require('../controllers/passwordController');

const router = express.Router();

// Routes for password management
router.route('/generate').post(generatePassword);
router.route('/').post(savePassword).get(getPasswords);
router.route('/:id').delete(deletePassword);

module.exports = router;