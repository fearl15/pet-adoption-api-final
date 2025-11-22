// routes/petRoutes.js
const express = require('express');
const {
  getPets,
  getPet,
  createPet,
  updatePet,
  patchPet,
  deletePet,
  searchPets
} = require('../controllers/petController');

const { validatePet, validateId, validateSearch } = require('../middleware/validation');

const router = express.Router();

// Route for searching (must be before :id to prevent 'search' being treated as an ID)
router.route('/search').get(validateSearch, searchPets); // 7. GET /api/v1/pets/search?q=

router.route('/')
  .get(getPets)          // 2. GET /api/v1/pets
  .post(validatePet, createPet); // 1. POST /api/v1/pets

router.route('/:id')
  .get(validateId, getPet)         // 3. GET /api/v1/pets/:id
  .put(validateId, validatePet, updatePet)   // 4. PUT /api/v1/pets/:id
  .patch(validateId, patchPet)     // 5. PATCH /api/v1/pets/:id
  .delete(validateId, deletePet);  // 6. DELETE /api/v1/pets/:id

module.exports = router;

// Total endpoints: 7 (CRUD + Search)