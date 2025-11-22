// middleware/validation.js
const { body, query, param } = require('express-validator');

exports.validatePet = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('type')
    .isIn(['Dog', 'Cat', 'Rabbit', 'Other']).withMessage('Invalid pet type'),
  body('age')
    .isInt({ min: 0 }).withMessage('Age must be a non-negative integer'),
  body('location')
    .notEmpty().withMessage('Location is required')
];

exports.validateId = [
  param('id').isMongoId().withMessage('Invalid Pet ID format')
];

exports.validateSearch = [
    query('q').isString().withMessage('Search query must be a string')
];