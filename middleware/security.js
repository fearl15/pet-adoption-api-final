// middleware/security.js
const helmet = require('helmet');
const cors = require('cors');

// Helmet for securing HTTP headers
exports.helmetMiddleware = helmet();

// CORS for cross-origin resource sharing
// In production, you'd specify a whitelist of allowed origins
exports.corsMiddleware = cors({
  origin: '*', // Allow all origins for simplicity in this project
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
});