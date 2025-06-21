# PassGen: Your Secure Password Vault

# 🌟 Project Overview
PassGen is a modern, secure web application that allows users to effortlessly generate strong, unique passwords and store them securely in a personal vault. Built with a robust MERN (MongoDB, Express, React, Node.js) stack and integrated with Auth0 for seamless authentication, PassGen provides a reliable solution for managing your digital keys.

# ✨ Features
Secure Password Generation: Customize password length and include/exclude uppercase letters, lowercase letters, numbers, and symbols.
Encrypted Storage: Passwords are encrypted before being stored in the database, ensuring your sensitive data remains protected.
Personalized Vault: Access and manage only your own saved passwords after authentication.
Effortless Authentication: Secure user login and registration powered by Auth0.
Copy to Clipboard: Easily copy generated or stored passwords with a single click.
Fully Responsive Design: A clean, intuitive, and visually appealing user interface that adapts to various screen sizes (desktop, tablet, mobile).

# 🚀 Technologies Used
PassGen leverages a modern full-stack architecture to deliver its functionality.

**Frontend**
React: A JavaScript library for building user interfaces.
Tailwind CSS: A utility-first CSS framework for rapid and responsive styling.
Auth0 React SDK: Official SDK for integrating Auth0 authentication into React applications.
lucide-react: A collection of beautiful, community-maintained open-source icons.

**Backend**
Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine.

Express.js: A fast, unopinionated, minimalist web framework for Node.js.

Mongoose: An elegant MongoDB object modeling tool for Node.js.

express-jwt: Middleware for authenticating JSON Web Tokens (JWT) from Auth0.

jwks-rsa: A library to retrieve RSA public keys from a JWKS endpoint for JWT verification.

dotenv: Loads environment variables from a .env file.

cors: Node.js middleware for providing a Connect/Express middleware that can be used to enable CORS with various options.

nodemon: A tool that helps develop Node.js based applications by automatically restarting the node application when file changes are detected.

**Database**
MongoDB Atlas: A global cloud database service that provides a flexible, scalable, and highly available NoSQL database solution.

**Deployment**
Netlify: For hosting the static React frontend with continuous deployment.
Render.com: For hosting the dynamic Node.js Express backend service with continuous deployment.

# 🛠️ Getting Started (Local Development)
Follow these steps to set up and run PassGen on your local machine for development purposes.

**Prerequisites**
Before you begin, ensure you have the following installed:

Node.js (LTS version recommended) & npm (comes with Node.js) or Yarn
Git
A GitHub account
A MongoDB Atlas account (for your cloud database)
An Auth0 account (for authentication)

1. Clone the Repository
First, clone the PassGen repository to your local machine:

git clone https://github.com/AR128/PassGen.git
cd PassGen

2. Auth0 Configuration
PassGen uses Auth0 for user authentication. You'll need to set up an application and an API in your Auth0 dashboard.

A. Configure Auth0 Application (for Frontend)
Go to your Auth0 Dashboard.

Navigate to Applications > Applications.

Click Create Application, name it (e.g., "PassGen Frontend"), and select Single Page Web Applications.

Go to the "Settings" of your new application.

Copy your Domain (e.g., dev-xxxxx.us.auth0.com) and Client ID.

Under "Application URIs", set the following (for local development):

Allowed Callback URLs: http://localhost:3000

Allowed Logout URLs: http://localhost:3000

Allowed Web Origins: http://localhost:3000

Click Save Changes.

B. Configure Auth0 API (for Backend)
In your Auth0 Dashboard, navigate to Applications > APIs.

Click Create API, name it (e.g., "PassGen Backend API").

Identifier (Audience): This is crucial. Use a unique URI like https://passgen-api. Copy this value; it will be your AUTH0_AUDIENCE.

Leave "Signing Algorithm" as RS256.

Click Create.

3. MongoDB Atlas Configuration
PassGen uses MongoDB Atlas for database storage.

Go to MongoDB Atlas and log in.

Create a New Cluster: If you don't have one, create a Shared Cluster (Free Tier).

Set up IP Access List: In your cluster's settings, add your current IP address (or 0.0.0.0/0 for "Allow Access from Anywhere" during development, but not recommended for production).

Create a Database User: Under "Database Access", create a new database user with a strong password. Copy this password immediately.

Get Connection String (MONGO_URI): Go to your cluster, click "Connect," select "Connect your application," choose "Node.js" driver, and copy the connection string.

Modify URI: Add your desired database name (e.g., password-generator) before the ? in the URI.

Example: mongodb+srv://<user>:<password>@<cluster-url>/password-generator?retryWrites=true&w=majority

4. Encryption Key Generation
The backend uses an encryption key to secure your passwords.

Open your terminal/command prompt.

Run the following command to generate a strong, random 64-character hexadecimal key:

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Copy the entire output string.

5. Environment Variables Setup
You'll need two .env files (one for the backend and one for frontend configuration for Auth0).

A. Backend Environment Variables (server/.env)
Create a file named .env inside the server/ directory (PassGen/server/.env).

Paste the following content, replacing the placeholders with your actual values obtained above:

server/.env
PORT=5000
MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN_COPIED_FROM_SPA_SETTINGS
AUTH0_AUDIENCE=YOUR_AUTH0_API_IDENTIFIER_COPIED_FROM_API_SETTINGS
ENCRYPTION_KEY=YOUR_GENERATED_64_HEX_CHAR_KEY
CLIENT_ORIGIN=http://localhost:3000

B. Frontend Auth0 Configuration (client/src/auth_config.json)
Open the file PassGen/client/src/auth_config.json.

Update it with your Auth0 application's domain, client ID, and the API audience:

{
    "domain": "YOUR_AUTH0_DOMAIN_COPIED_FROM_SPA_SETTINGS",
    "clientId": "YOUR_AUTH0_CLIENT_ID_COPIED_FROM_SPA_SETTINGS",
    "audience": "YOUR_AUTH0_API_IDENTIFIER_COPIED_FROM_API_SETTINGS"
}

6. Install Dependencies
Install the required Node.js packages for both the backend and frontend.

A. For the Backend
cd server
npm install # or yarn install
cd .. # Go back to root directory

B. For the Frontend
cd client
npm install # or yarn install
cd .. # Go back to root directory

7. Run the Applications
You'll need two separate terminal windows or command prompts to run both the frontend and backend concurrently.

A. Run the Backend
In one terminal:

cd server
npm start # or npm run dev if you installed nodemon

The backend should start on http://localhost:5000. You should see MongoDB Connected: ... in the console.

B. Run the Frontend
In a separate terminal:

cd client
npm start

This will open the frontend application in your browser, typically at http://localhost:3000.

# 🌐 Deployment
PassGen is designed for seamless deployment with Netlify for the frontend and Render for the backend.

Frontend Deployment (Netlify)
The React frontend can be deployed as a static site on Netlify.

Connect your GitHub repository to Netlify.

**Build Settings:**
Base directory: client/
Build command: npm run build
Publish directory: build/
Access the deployed frontend at: https://passgen21.netlify.app
Environment Variables: After deploying your backend (see below), set REACT_APP_API_BASE_URL to your backend's public API URL (e.g., https://your-backend.onrender.com/api). Remember to trigger a new deploy after setting this.
Backend Deployment (Render.com
The Node.js Express backend can be deployed as a Web Service on Render.
Connect your GitHub repository to Render.

**Service Settings:**
Root Directory: server/
Build Command: npm install
Start Command: npm start
Environment Variables: Add all variables from your server/.env file directly in Render's dashboard (e.g., PORT, MONGO_URI, AUTH0_DOMAIN, AUTH0_AUDIENCE, ENCRYPTION_KEY).
Crucially, set CLIENT_ORIGIN to your Netlify frontend's public URL (e.g., https://passgen21.netlify.app, without a trailing slash or /api).

# 🔒 Security Note
NEVER commit your .env files to Git. They contain sensitive credentials that should not be publicly accessible. The .gitignore file is configured to prevent this, but always double-check.
Keep your Auth0 secrets and encryption keys confidential. The ENCRYPTION_KEY in your backend's .env file is critical. This key is used to encrypt and decrypt your users' passwords. If this key is lost or compromised, your stored passwords will be unrecoverable or vulnerable.
Auth0 Security: Auth0 handles the complexities of user authentication securely. Ensure your Auth0 application settings (Callback URLs, Logout URLs, Web Origins) are correctly configured for both local development (http://localhost:3000) and your deployed frontend URL (https://passgen21.netlify.app).
HTTPS: For production environments, it is crucial to serve both your frontend and backend over HTTPS to protect data in transit. Netlify and Render automatically provide HTTPS.
Password Storage: The generated passwords are encrypted at rest in the database. When a user requests their passwords, they are decrypted on the backend and sent to the frontend. It is crucial that the frontend environment is secure when displaying these.
Environment Variables: Always use environment variables for sensitive information (database credentials, API keys, encryption keys) and never hardcode them in your source code.

# 📄 License
This project is licensed under the MIT License. See the LICENSE file for more details.

# ✉️ Contact
For any questions or suggestions, feel free to open an issue in this repository.
