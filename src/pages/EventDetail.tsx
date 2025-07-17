import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, User, Users, DollarSign, Clock, ArrowLeft, Ticket } from 'lucide-react';
import { Event } from '../types';
import { eventService } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchEvent(id);
    }
  }, [id]);

  const fetchEvent = async (eventId: string) => {
    try {
      const fetchedEvent = await eventService.getEvent(eventId);
      setEvent(fetchedEvent);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event:', error);
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!event) return;

    setRegistering(true);
    try {
      await eventService.registerForEvent(event._id, quantity);
      alert('Registration successful! Check your tickets page.');
      // Refresh event data to update available tickets
      fetchEvent(event._id);
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'EEEE, MMMM dd, yyyy');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800"
          >
            Return to events
          </button>
        </div>
      </div>
    );
  }

  const isLowAvailability = event.availableTickets < event.capacity * 0.2;
  const isSoldOut = event.availableTickets === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-64 md:h-80">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {event.category}
                  </span>
                </div>
                {isLowAvailability && !isSoldOut && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Limited Tickets
                    </span>
                  </div>
                )}
                {isSoldOut && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-6 py-3 rounded-full text-lg font-bold">
                      SOLD OUT
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {event.title}
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-3" />
                      <div>
                        <p className="font-medium">{formatDate(event.date)}</p>
                        <p className="text-sm">{event.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-3" />
                      <div>
                        <p className="font-medium">{event.location}</p>
                        <p className="text-sm">{event.address}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <User className="h-5 w-5 mr-3" />
                      <div>
                        <p className="font-medium">Organized by</p>
                        <p className="text-sm">{event.organizer.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-3" />
                      <div>
                        <p className="font-medium">Capacity</p>
                        <p className="text-sm">{event.capacity} attendees</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">About this event</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Availability</h2>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Tickets Sold</span>
                      <span className="text-sm text-gray-600">
                        {event.capacity - event.availableTickets} / {event.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${((event.capacity - event.availableTickets) / event.capacity) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  <span className="text-3xl font-bold text-gray-900">
                    {event.price === 0 ? 'Free' : `$${event.price}`}
                  </span>
                </div>
                <p className="text-gray-600">per ticket</p>
              </div>

              {!isSoldOut && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of tickets
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[...Array(Math.min(5, event.availableTickets))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} ticket{i + 1 > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-semibold">
                    ${(event.price * quantity).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>${(event.price * quantity).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleRegister}
                disabled={registering || isSoldOut}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                  isSoldOut
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } ${registering ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {registering ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : isSoldOut ? (
                  'Sold Out'
                ) : (
                  <>
                    <Ticket className="h-4 w-4 mr-2" />
                    {isAuthenticated ? 'Register Now' : 'Login to Register'}
                  </>
                )}
              </button>

              {!isAuthenticated && (
                <p className="text-sm text-gray-600 text-center mt-3">
                  Please login to purchase tickets
                </p>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center text-gray-600 mb-2">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    {event.availableTickets} tickets available
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    Event starts at {event.time}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;