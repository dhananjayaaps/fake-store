const mongoose = require('mongoose');
const Product = require('../model/product');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Product,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [cartItemSchema],
  date: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

cartSchema.virtual('id').get(function() {
  return this.userId;
});

cartSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Cart', cartSchema);