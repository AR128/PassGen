const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const passwordRoutes = require('./routes/password');
const cors = require('cors');
const { checkJwt } = require('./config/auth');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Body parser for JSON requests
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
// All password routes will be protected by Auth0 JWT verification.
app.use('/api/passwords', checkJwt, passwordRoutes);

// Simple root route for testing server status
app.get('/', (req, res) => {
    res.send('Password Generator API is running!');
});

// Error handling middleware (optional, but good practice)
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).send({ message: 'Invalid token' });
    }
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});