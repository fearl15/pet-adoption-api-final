// controllers/petController.js
const Pet = require('../models/Pet');
const { validationResult } = require('express-validator');

// Helper for sending validation errors
const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
};

// @route   POST /api/v1/pets
// @desc    Add a new pet
exports.createPet = async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
        const pet = await Pet.create(req.body);
        res.status(201).json({ success: true, data: pet });
    } catch (err) {
        // Mongoose validation or other error
        res.status(400).json({ success: false, message: 'Could not create pet', error: err.message });
    }
};

// @route   GET /api/v1/pets
// @desc    Get all pets
exports.getPets = async (req, res) => {
    try {
        const pets = await Pet.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: pets.length, data: pets });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// @route   GET /api/v1/pets/:id
// @desc    Get a single pet by ID
exports.getPet = async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ success: false, message: 'Pet not found' });
        }
        res.status(200).json({ success: true, data: pet });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// @route   PUT /api/v1/pets/:id
// @desc    Update a pet (full replacement)
exports.updatePet = async (req, res) => {
    // Note: You would typically run both ID and body validation here
    if (handleValidationErrors(req, res)) return;

    try {
        let pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the new document
            runValidators: true,
            overwrite: true // Ensure full replacement as it's a PUT
        });

        if (!pet) {
            return res.status(404).json({ success: false, message: 'Pet not found' });
        }
        res.status(200).json({ success: true, data: pet });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Update failed', error: err.message });
    }
};

// @route   PATCH /api/v1/pets/:id
// @desc    Partial update (e.g., mark as adopted)
exports.patchPet = async (req, res) => {
    if (handleValidationErrors(req, res)) return; // Use the same validation for partial updates too

    try {
        const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the new document
            runValidators: true,
            overwrite: false // Important for PATCH to only update fields present
        });

        if (!pet) {
            return res.status(404).json({ success: false, message: 'Pet not found' });
        }
        res.status(200).json({ success: true, data: pet });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Patch failed', error: err.message });
    }
};

// @route   DELETE /api/v1/pets/:id
// @desc    Delete a pet
exports.deletePet = async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
        const pet = await Pet.findByIdAndDelete(req.params.id);
        if (!pet) {
            return res.status(404).json({ success: false, message: 'Pet not found' });
        }
        // 200 OK with no content, or 204 No Content
        res.status(200).json({ success: true, message: 'Pet deleted successfully', data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// @route   GET /api/v1/pets/search?q=
// @desc    Search pets by name or type
exports.searchPets = async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
        const query = req.query.q;
        // Search by text index (name) or exact type match
        const pets = await Pet.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // Case-insensitive name search
                { type: { $regex: query, $options: 'i' } } // Case-insensitive type search
            ]
        });

        res.status(200).json({ success: true, count: pets.length, data: pets });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};