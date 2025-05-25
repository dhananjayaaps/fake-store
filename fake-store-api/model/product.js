const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  title: String,
  price: Number,
  image: String,
  description: String,
  category: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);