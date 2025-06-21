import React, { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getPasswords, deletePassword } from '../services/api';
import { Trash2, Copy } from 'lucide-react'; // Import icons

function PasswordList() {
    const { getAccessTokenSilently } = useAuth0();
    const [passwords, setPasswords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const fetchPasswords = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const token = await getAccessTokenSilently();
            const data = await getPasswords(token);
            setPasswords(data);
        } catch (err) {
            console.error('Failed to fetch passwords:', err);
            setError('Failed to load passwords. Please try logging in again.');
        } finally {
            setLoading(false);
        }
    }, [getAccessTokenSilently]);

    useEffect(() => {
        fetchPasswords();

        // Listen for custom event to refetch passwords after a save
        window.addEventListener('passwordSaved', fetchPasswords);

        return () => {
            window.removeEventListener('passwordSaved', fetchPasswords);
        };
    }, [fetchPasswords]);

    const handleDelete = async (id) => {
        setMessage(''); // Clear previous messages
        try {
            const token = await getAccessTokenSilently();
            await deletePassword(token, id);
            setMessage('Password deleted successfully!');
            setMessageType('success');
            setPasswords(passwords.filter(p => p._id !== id));
        } catch (err) {
            console.error('Failed to delete password:', err);
            setMessage(`Failed to delete password: ${err.message || 'Server error'}`);
            setMessageType('error');
        }
    };

    const copyPasswordToClipboard = (password) => {
        const tempInput = document.createElement('textarea');
        tempInput.value = password;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        setMessage('Password copied to clipboard!');
        setMessageType('success');
    };

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 h-full flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 border-t-4"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-100 text-red-700 rounded-xl shadow-lg border border-red-200">
                <p className="font-semibold text-center">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 h-full flex flex-col">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Your Saved Passwords</h3>

            {message && (
                <div className={`p-3 mb-4 rounded-lg text-sm flex items-center justify-center ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} border ${messageType === 'success' ? 'border-green-200' : 'border-red-200'}`}>
                    {message}
                </div>
            )}

            {passwords.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                    No passwords saved yet. <span className="font-medium text-indigo-600">Generate one!</span>
                </p>
            ) : (
                <div className="space-y-4 overflow-y-auto max-h-96 pr-2"> {/* Added max-height and overflow for scrollability */}
                    {passwords.map((p) => (
                        <div key={p._id} className="p-4 border border-gray-200 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 hover:bg-gray-100 transition duration-200">
                            <div className="mb-2 sm:mb-0 flex-grow pr-4">
                                <p className="text-md font-medium text-gray-800 flex items-center">
                                    <span className="font-bold text-indigo-600 mr-2">App:</span> {p.appName}
                                </p>
                                <p className="text-sm text-gray-700 font-mono break-all mt-1 flex items-center">
                                    <span className="font-bold text-gray-600 mr-2">Password:</span> {p.password}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                                <button
                                    onClick={() => copyPasswordToClipboard(p.password)}
                                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-md transition duration-200 flex items-center justify-center group"
                                    title="Copy password"
                                >
                                    <Copy size={16} className="group-hover:scale-110 transition-transform"/>
                                </button>
                                <button
                                    onClick={() => handleDelete(p._id)}
                                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition duration-200 flex items-center justify-center group"
                                    title="Delete password"
                                >
                                    <Trash2 size={16} className="group-hover:scale-110 transition-transform"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PasswordList;