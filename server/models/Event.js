const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: String,
  email: String
}, { _id: false });

const eventSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  title: String,
  description: String,
  date: String,
  time: String,
  location: String,
  address: String,
  category: String,
  image: String,
  price: Number,
  capacity: Number,
  availableTickets: Number,
  organizer: organizerSchema,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
