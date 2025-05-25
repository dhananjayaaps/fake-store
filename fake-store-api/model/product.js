const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);