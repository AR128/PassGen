import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { generatePassword, savePassword } from '../services/api';
import { Copy } from 'lucide-react'; // Import Copy icon

function PasswordGenerator() {
    const { getAccessTokenSilently } = useAuth0();
    const [length, setLength] = useState(12);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [appName, setAppName] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const handleGenerate = async () => {
        setMessage(''); // Clear previous messages
        setGeneratedPassword(''); // Clear previous password

        if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
            setMessage('Please select at least one character type.');
            setMessageType('error');
            return;
        }

        try {
            const token = await getAccessTokenSilently();
            const response = await generatePassword(token, {
                length,
                includeUppercase,
                includeLowercase,
                includeNumbers,
                includeSymbols
            });
            setGeneratedPassword(response.password);
        } catch (error) {
            console.error('Error generating password:', error);
            setMessage('Failed to generate password. Please try again.');
            setMessageType('error');
        }
    };

    const handleSave = async () => {
        setMessage(''); // Clear previous messages
        if (!appName.trim()) {
            setMessage('App name cannot be empty.');
            setMessageType('error');
            return;
        }
        if (!generatedPassword) {
            setMessage('Please generate a password first.');
            setMessageType('error');
            return;
        }

        try {
            const token = await getAccessTokenSilently();
            await savePassword(token, appName, generatedPassword);
            setMessage('Password saved successfully!');
            setMessageType('success');
            setAppName('');
            setGeneratedPassword('');
            window.dispatchEvent(new Event('passwordSaved')); // Custom event for refresh
        } catch (error) {
            console.error('Error saving password:', error);
            setMessage(`Failed to save password: ${error.message || 'Server error'}`);
            setMessageType('error');
        }
    };

    const copyToClipboard = () => {
        if (generatedPassword) {
            // Using execCommand for better iframe compatibility
            const tempInput = document.createElement('textarea');
            tempInput.value = generatedPassword;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            setMessage('Password copied to clipboard!');
            setMessageType('success');
        }
    };


    return (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 h-full flex flex-col">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Generate New Password</h3>

            {message && (
                <div className={`p-3 mb-4 rounded-lg text-sm flex items-center justify-center ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} border ${messageType === 'success' ? 'border-green-200' : 'border-red-200'}`}>
                    {message}
                </div>
            )}

            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="length">
                    Password Length: <span className="text-indigo-600 font-bold">{length}</span>
                </label>
                <input
                    type="range"
                    id="length"
                    min="6"
                    max="30"
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg appearance-none cursor-pointer range-lg accent-blue-600 shadow-inner"
                />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="uppercase"
                        checked={includeUppercase}
                        onChange={(e) => setIncludeUppercase(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500 transition duration-200 cursor-pointer"
                    />
                    <label htmlFor="uppercase" className="ml-2 text-gray-700 text-base select-none">Uppercase (A-Z)</label>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="lowercase"
                        checked={includeLowercase}
                        onChange={(e) => setIncludeLowercase(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500 transition duration-200 cursor-pointer"
                    />
                    <label htmlFor="lowercase" className="ml-2 text-gray-700 text-base select-none">Lowercase (a-z)</label>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="numbers"
                        checked={includeNumbers}
                        onChange={(e) => setIncludeNumbers(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500 transition duration-200 cursor-pointer"
                    />
                    <label htmlFor="numbers" className="ml-2 text-gray-700 text-base select-none">Numbers (0-9)</label>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="symbols"
                        checked={includeSymbols}
                        onChange={(e) => setIncludeSymbols(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500 transition duration-200 cursor-pointer"
                    />
                    <label htmlFor="symbols" className="ml-2 text-gray-700 text-base select-none">Symbols (!@#$)</label>
                </div>
            </div>

            <button
                onClick={handleGenerate}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 mb-6"
            >
                Generate Password
            </button>

            {generatedPassword && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between shadow-inner">
                    <input
                        type="text"
                        readOnly
                        value={generatedPassword}
                        className="flex-grow bg-transparent text-gray-900 text-lg font-mono outline-none mr-3 break-all"
                    />
                    <button
                        onClick={copyToClipboard}
                        className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition duration-200 hover:text-indigo-600 flex items-center justify-center group"
                        title="Copy to clipboard"
                    >
                        <Copy size={20} className="group-hover:scale-110 transition-transform"/>
                    </button>
                </div>
            )}

            {generatedPassword && (
                <div className="mt-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="appName">
                        App Name
                    </label>
                    <input
                        type="text"
                        id="appName"
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        placeholder="e.g., Google, Facebook"
                        className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                    />
                    <button
                        onClick={handleSave}
                        className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
                    >
                        Save Password
                    </button>
                </div>
            )}
        </div>
    );
}

export default PasswordGenerator;