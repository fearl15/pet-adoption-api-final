const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { helmetMiddleware, corsMiddleware } = require('./middleware/security');
const petRoutes = require('./routes/petRoutes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('js-yaml');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to database (MUST be restored for functional endpoints)
connectDB(); // <-- RESTORED

const app = express();

// --- Core Middleware ---
app.use(express.json()); // Body parser for JSON
app.use(helmetMiddleware); // <-- RESTORED Security Middleware
app.use(corsMiddleware); // Enable CORS

// --- Swagger Docs Setup (with Graceful Error Handling) ---
let swaggerDocument = null; 

try {
    // Attempt to load the file using the original, most reliable path
    const swaggerPath = path.join(__dirname, 'swagger/api-docs.yaml');
    swaggerDocument = YAML.load(fs.readFileSync(swaggerPath, 'utf8'));
    console.log('Swagger documentation loaded successfully.');
} catch (err) {
    // This catches the error if Vercel cannot read the file during initialization.
    console.error('WARNING: Failed to load swagger/api-docs.yaml. Documentation may be unavailable.', err.message);
}

// Only set up the route if the document successfully loaded
if (swaggerDocument) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
    // Provide a fallback route to prevent the crash/blank page
    app.get('/api-docs', (req, res) => {
        res.status(503).json({ success: false, message: 'API Documentation is temporarily unavailable due to a server file access error.' });
    });
}

// --- Primary API Routes ---
app.use('/api/v1/pets', petRoutes);

// --- Simple Root Route ---
app.get('/', (req, res) => {
    res.send('Welcome to the Pet Adoption API! Access documentation at /api-docs');
});

// --- Custom 404/Error Handling (Graceful Error Handling) ---
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Resource Not Found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
