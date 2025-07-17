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

const ticketSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  event: eventRefSchema,
  user: userRefSchema,
  qrCode: String,
  status: {
    type: String,
    enum: ['valid', 'used', 'cancelled'],
    default: 'valid'
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  checkInDate: Date
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
