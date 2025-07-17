const mongoose = require('mongoose');

const userRefSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: String,
  email: String
}, { _id: false });

const eventRefSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  title: String,
  date: String,
  time: String,
  location: String
}, { _id: false });

const ticketRefSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  qrCode: String,
  status: String,
  purchaseDate: Date,
  checkInDate: Date
}, { _id: false });

const orderSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  user: userRefSchema,
  event: eventRefSchema,
  quantity: Number,
  totalAmount: Number,
  status: {
    type: String,
    enum: ['completed', 'cancelled', 'pending'],
    default: 'completed'
  },
  tickets: [ticketRefSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
