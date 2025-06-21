import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import authConfig from './auth_config.json'; // Your Auth0 configuration
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Auth0Provider
            domain={authConfig.domain}
            clientId={authConfig.clientId}
            authorizationParams={{
                redirect_uri: window.location.origin,
                audience: authConfig.audience, // Specify your API audience
                scope: 'openid profile email' // Request necessary scopes
            }}
            useRefreshTokens={true} // Enable refresh tokens for longer sessions
            cacheLocation="localstorage" // Cache tokens in local storage
        >
            <App />
        </Auth0Provider>
    </React.StrictMode>
);