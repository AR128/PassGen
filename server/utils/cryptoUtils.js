const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

// Ensure your encryption key is 32 bytes (256 bits) for AES-256
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // Use a hex string from .env
const ALGORITHM = 'aes-256-cbc';

if (ENCRYPTION_KEY.length !== 32) {
    console.error('CRITICAL ERROR: ENCRYPTION_KEY in .env must be exactly 32 bytes (64 hex characters).');
    process.exit(1); // Exit if the key is not valid, as security depends on it.
}

/**
 * Encrypts a plain text string using AES-256-CBC.
 * @param {string} text - The plain text to encrypt.
 * @returns {{encryptedData: string, iv: Buffer}} - The encrypted data as a hex string and the IV as a Buffer.
 */
function encrypt(text) {
    const iv = crypto.randomBytes(16); // IV for AES-256-CBC is always 16 bytes
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedData: encrypted, iv: iv };
}

/**
 * Decrypts an AES-256-CBC encrypted hex string.
 * @param {string} encryptedData - The encrypted data as a hex string.
 * @param {Buffer} iv - The Initialization Vector as a Buffer.
 * @returns {string} - The decrypted plain text.
 */
function decrypt(encryptedData, iv) {
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = { encrypt, decrypt };