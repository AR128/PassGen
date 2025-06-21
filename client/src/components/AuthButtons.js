import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function AuthButtons() {
    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

    // Base styles for buttons
    const baseBtnClasses = "font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-75";

    return (
        <div className="flex space-x-4">
            {!isAuthenticated ? (
                <button
                    onClick={() => loginWithRedirect()}
                    className={`${baseBtnClasses} bg-gradient-to-r from-green-500 to-teal-600 text-white hover:from-green-600 hover:to-teal-700 focus:ring-green-300`}
                >
                    Log In / Sign Up
                </button>
            ) : (
                <button
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                    className={`${baseBtnClasses} bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 focus:ring-red-300`}
                >
                    Log Out
                </button>
            )}
        </div>
    );
}

export default AuthButtons;