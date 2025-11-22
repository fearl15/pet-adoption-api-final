// models/Pet.js
const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  type: {
    type: String,
    enum: ['Dog', 'Cat', 'Rabbit', 'Other'],
    required: true
  },
  breed: {
    type: String,
    required: false
  },
  age: {
    type: Number,
    required: [true, 'Please add an age'],
    min: [0, 'Age must be 0 or greater']
  },
  isAdopted: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    required: [true, 'Please add the pet location']
  }
}, { timestamps: true });

// Create an index for the search endpoint (name and type)
PetSchema.index({ name: 'text', type: 1 });

module.exports = mongoose.model('Pet', PetSchema);