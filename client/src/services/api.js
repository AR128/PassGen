const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Helper function to handle fetch responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
    }
    return response.json();
};

/**
 * Generates a new password from the backend.
 * @param {string} token - Auth0 access token.
 * @param {object} options - Password generation options (length, char types).
 * @returns {Promise<object>} - Contains the generated password.
 */
export const generatePassword = async (token, options) => {
    const response = await fetch(`${API_BASE_URL}/passwords/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(options)
    });
    return handleResponse(response);
};

/**
 * Saves a password to the backend for the current user.
 * @param {string} token - Auth0 access token.
 * @param {string} appName - Name of the application the password is for.
 * @param {string} password - The plain text password to save.
 * @returns {Promise<object>} - Confirmation of save.
 */
export const savePassword = async (token, appName, password) => {
    const response = await fetch(`${API_BASE_URL}/passwords`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ appName, password })
    });
    return handleResponse(response);
};

/**
 * Fetches all passwords for the current user from the backend.
 * @param {string} token - Auth0 access token.
 * @returns {Promise<Array<object>>} - List of passwords (including decrypted passwords).
 */
export const getPasswords = async (token) => {
    const response = await fetch(`${API_BASE_URL}/passwords`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return handleResponse(response);
};

/**
 * Deletes a specific password from the backend.
 * @param {string} token - Auth0 access token.
 * @param {string} id - ID of the password to delete.
 * @returns {Promise<object>} - Confirmation of deletion.
 */
export const deletePassword = async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/passwords/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return handleResponse(response);
};