
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

const User = require('./models/User');
const Event = require('./models/Event');
const Ticket = require('./models/Ticket');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventdb';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  initializeSampleEvents();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Initialize sample events if none exist
async function initializeSampleEvents() {
  const count = await Event.countDocuments();
  if (count === 0) {
    const sampleEvents = [
      {
        _id: uuidv4(),
        title: 'Tech Conference 2024',
        description: 'Join us for the biggest tech conference of the year featuring keynotes from industry leaders, hands-on workshops, and networking opportunities.',
        date: '2024-03-15',
        time: '09:00',
        location: 'San Francisco Convention Center',
        address: '747 Howard St, San Francisco, CA 94103',
        category: 'Technology',
        image: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=800',
        price: 299,
        capacity: 500,
        availableTickets: 342,
        organizer: {
          _id: uuidv4(),
          name: 'Tech Events Inc.',
          email: 'events@techevents.com'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: uuidv4(),
        title: 'Music Festival Summer 2024',
        description: 'Experience an unforgettable weekend of music with top artists performing across multiple stages. Food trucks, art installations, and more.',
        date: '2024-06-20',
        time: '14:00',
        location: 'Central Park',
        address: 'New York, NY 10024',
        category: 'Music',
        image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
        price: 89,
        capacity: 2000,
        availableTickets: 1456,
        organizer: {
          _id: uuidv4(),
          name: 'Music Fest Organizers',
          email: 'info@musicfest.com'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: uuidv4(),
        title: 'Startup Networking Event',
        description: 'Connect with fellow entrepreneurs, investors, and industry professionals. Perfect for startups looking to expand their network.',
        date: '2024-02-28',
        time: '18:00',
        location: 'Innovation Hub',
        address: '123 Innovation Dr, Austin, TX 78701',
        category: 'Business',
        image: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800',
        price: 0,
        capacity: 150,
        availableTickets: 87,
        organizer: {
          _id: uuidv4(),
          name: 'Austin Startup Community',
          email: 'hello@austinstartups.com'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: uuidv4(),
        title: 'Food & Wine Festival',
        description: 'Indulge in gourmet food and premium wines from local restaurants and wineries. Live cooking demonstrations and tastings.',
        date: '2024-04-12',
        time: '12:00',
        location: 'Waterfront Plaza',
        address: '456 Harbor Blvd, Seattle, WA 98101',
        category: 'Food',
        image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
        price: 65,
        capacity: 300,
        availableTickets: 178,
        organizer: {
          _id: uuidv4(),
          name: 'Culinary Events LLC',
          email: 'contact@culinaryevents.com'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: uuidv4(),
        title: 'Art Gallery Opening',
        description: 'Exclusive opening night for our new contemporary art exhibition featuring works from emerging local artists.',
        date: '2024-03-08',
        time: '19:00',
        location: 'Modern Art Gallery',
        address: '789 Art St, Chicago, IL 60614',
        category: 'Arts',
        image: 'https://images.pexels.com/photos/1652340/pexels-photo-1652340.jpeg?auto=compress&cs=tinysrgb&w=800',
        price: 25,
        capacity: 100,
        availableTickets: 45,
        organizer: {
          _id: uuidv4(),
          name: 'Modern Art Gallery',
          email: 'info@modernartgallery.com'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: uuidv4(),
        title: 'Fitness Bootcamp Weekend',
        description: 'Intensive weekend fitness bootcamp with professional trainers. All fitness levels welcome. Includes meals and equipment.',
        date: '2024-05-18',
        time: '08:00',
        location: 'Fitness Center Pro',
        address: '321 Fitness Ave, Los Angeles, CA 90210',
        category: 'Sports',
        image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
        price: 150,
        capacity: 50,
        availableTickets: 23,
        organizer: {
          _id: uuidv4(),
          name: 'FitLife Training',
          email: 'info@fitlifetraining.com'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await Event.insertMany(sampleEvents);
    console.log('Sample events inserted');
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      _id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      role,
      createdAt: new Date()
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      user: { _id: user._id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      user: { _id: user._id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: { _id: user._id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Event routes
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Only organizers can create events' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const event = new Event({
      _id: uuidv4(),
      ...req.body,
      availableTickets: req.body.capacity,
      organizer: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer._id !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    Object.assign(event, req.body);
    event.updatedAt = new Date();

    await event.save();
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer._id !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.remove();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Registration and ticket routes
app.post('/api/events/:id/register', authenticateToken, async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.availableTickets < quantity) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const order = new Order({
      _id: uuidv4(),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      event: event,
      quantity,
      totalAmount: event.price * quantity,
      status: 'completed',
      tickets: [],
      createdAt: new Date()
    });

    // Create tickets
    for (let i = 0; i < quantity; i++) {
      const qrCode = uuidv4();
      const ticket = new Ticket({
        _id: uuidv4(),
        event: event,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        },
        qrCode,
        status: 'valid',
        purchaseDate: new Date()
      });

      await ticket.save();
      order.tickets.push(ticket);
    }

    // Update event availability
    event.availableTickets -= quantity;
    await event.save();

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/tickets', authenticateToken, async (req, res) => {
  try {
    const userTickets = await Ticket.find({ 'user._id': req.user.userId });
    res.json(userTickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/tickets/scan', authenticateToken, async (req, res) => {
  try {
    const { qrCode } = req.body;

    const ticket = await Ticket.findOne({ qrCode });
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Invalid QR code'
      });
    }

    if (ticket.status === 'used') {
      return res.status(400).json({
        success: false,
        message: 'Ticket already used'
      });
    }

    if (ticket.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Ticket cancelled'
      });
    }

    // Mark ticket as used
    ticket.status = 'used';
    ticket.checkInDate = new Date();

    await ticket.save();

    res.json({
      success: true,
      message: 'Ticket scanned successfully',
      ticket
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/events/organizer', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Only organizers can access this endpoint' });
    }

    const organizerEvents = await Event.find({ 'organizer._id': req.user.userId });
    res.json(organizerEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const path = require('path');

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    // If the request is for an API route, return 404
    return res.status(404).json({ message: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
