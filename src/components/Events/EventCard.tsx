import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { Event } from '../../types';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const isLowAvailability = event.availableTickets < event.capacity * 0.2;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {event.category}
          </span>
        </div>
        {isLowAvailability && (
          <div className="absolute top-4 left-4">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Limited Tickets
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {event.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {formatDate(event.date)} at {event.time}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm truncate">
              {event.location}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm">
                {event.availableTickets} / {event.capacity} available
              </span>
            </div>
            
            <div className="flex items-center text-green-600 font-semibold">
              <DollarSign className="h-4 w-4 mr-1" />
              <span>{event.price === 0 ? 'Free' : `$${event.price}`}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((event.capacity - event.availableTickets) / event.capacity) * 100}%`
              }}
            />
          </div>
          <span className="text-xs text-gray-500 ml-2">
            {Math.round(((event.capacity - event.availableTickets) / event.capacity) * 100)}% sold
          </span>
        </div>
        
        <Link
          to={`/events/${event._id}`}
          className="block w-full mt-4 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;