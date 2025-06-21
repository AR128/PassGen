import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import AuthButtons from './components/AuthButtons';
import PasswordGenerator from './components/PasswordGenerator';
import PasswordList from './components/PasswordList';
import './index.css'; // Import Tailwind CSS

function App() {
    const { isAuthenticated, isLoading, user } = useAuth0();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-700">
                Loading application...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 bg-pattern flex flex-col items-center justify-center p-4 antialiased">
            {/* Header: Enhanced with vibrant colors, stronger shadow, and better alignment */}
            <header className="w-full max-w-4xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-t-xl shadow-lg mb-0 flex flex-col sm:flex-row justify-between items-center sm:items-baseline text-white">
                {/* PassGen title with enhanced styling */}
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 sm:mb-0 drop-shadow-md">PassGen</h1>
                <div className="sm:ml-auto">
                    <AuthButtons />
                </div>
            </header>

            {/* Main content area: Updated background and shadow */}
            <main className="w-full max-w-4xl bg-white p-8 rounded-b-xl shadow-lg">
                {isAuthenticated ? (
                    <>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                            Welcome, <span className="text-indigo-600">{user.name || user.nickname || user.email}</span>!
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <PasswordGenerator />
                            <PasswordList />
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-xl text-gray-800 mb-4 font-semibold">
                            PassGen: Your Secure Password Vault
                        </p>
                        <p className="text-md text-gray-700 mb-6 max-w-lg mx-auto leading-relaxed">
                            Effortlessly generate strong, unique passwords and store them securely for all your online accounts.
                            Gain peace of mind with a dedicated vault for your digital keys.
                        </p>
                        <p className="text-lg text-indigo-700 font-semibold mb-8 animate-pulse">
                            Please log in or sign up to get started!
                        </p>
                        {/* AuthButtons are already in the header, no need for redundancy here */}
                    </div>
                )}
            </main>
            <footer className="mt-8 text-gray-600 text-sm opacity-90">
                &copy; {new Date().getFullYear()} PassGen. All rights reserved.
            </footer>
        </div>
    );
}

export default App;