// server.js
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

// Connect to database
// connectDB();

const app = express();

// --- Core Middleware ---
app.use(express.json()); // Body parser for JSON
// app.use(helmetMiddleware); // Secure HTTP headers
app.use(corsMiddleware); // Enable CORS

// --- Swagger Docs Setup ---
// Load the OpenAPI spec file
const swaggerDocument = YAML.load(fs.readFileSync('swagger/api-docs.yaml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
