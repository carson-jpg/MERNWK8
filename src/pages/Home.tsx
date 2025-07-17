import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, TrendingUp } from 'lucide-react';
import EventCard from '../components/Events/EventCard';
import EventFilters from '../components/Events/EventFilters';
import { Event } from '../types';
import { eventService } from '../services/eventService';

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedCategory, selectedLocation]);

  const fetchEvents = async () => {
    try {
      const fetchedEvents = await eventService.getEvents();
      setEvents(fetchedEvents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    if (selectedLocation) {
      filtered = filtered.filter(event => event.location === selectedLocation);
    }

    setFilteredEvents(filtered);
  };

  const categories = [...new Set(events.map(event => event.category))];
  const locations = [...new Set(events.map(event => event.location))];

  const stats = {
    totalEvents: events.length,
    totalCapacity: events.reduce((sum, event) => sum + event.capacity, 0),
    averagePrice: events.length > 0 ? events.reduce((sum, event) => sum + event.price, 0) / events.length : 0,
    categories: categories.length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Events
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Find and book tickets for the most exciting events in your area
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-8 w-8 text-blue-200" />
                </div>
                <div className="text-2xl font-bold">{stats.totalEvents}</div>
                <div className="text-blue-200">Events</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-blue-200" />
                </div>
                <div className="text-2xl font-bold">{stats.totalCapacity.toLocaleString()}</div>
                <div className="text-blue-200">Capacity</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-blue-200" />
                </div>
                <div className="text-2xl font-bold">${stats.averagePrice.toFixed(0)}</div>
                <div className="text-blue-200">Avg Price</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="h-8 w-8 text-blue-200" />
                </div>
                <div className="text-2xl font-bold">{stats.categories}</div>
                <div className="text-blue-200">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EventFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          categories={categories}
          locations={locations}
        />

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {filteredEvents.length === events.length 
              ? 'All Events' 
              : `${filteredEvents.length} Event${filteredEvents.length !== 1 ? 's' : ''} Found`}
          </h2>
          <p className="text-gray-600">
            Discover and book tickets for amazing events
          </p>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or check back later for new events.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;