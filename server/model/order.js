const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      itemname: {
        type: String,
        required: true,
      },
      itemprice: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      images: {
        image1: { type: String, required: true },
        image2: { type: String },
        image3: { type: String },
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order; 