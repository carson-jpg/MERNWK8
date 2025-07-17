import React from 'react';
import { Calendar, MapPin, User, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Ticket } from '../../types';
import { format } from 'date-fns';
import QRCode from 'react-qr-code';

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'used':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'text-green-600 bg-green-50';
      case 'used':
        return 'text-blue-600 bg-blue-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative p-6 h-full flex items-center">
          <div className="text-white">
            <h3 className="text-xl font-bold mb-1">{ticket.event.title}</h3>
            <p className="text-blue-100">{ticket.event.category}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
            {getStatusIcon(ticket.status)}
            <span className="text-sm font-medium capitalize">{ticket.status}</span>
          </div>
          <div className="text-sm text-gray-600">
            #{ticket._id.slice(-6)}
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-3" />
            <span className="text-sm">
              {formatDate(ticket.event.date)} at {ticket.event.time}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-3" />
            <span className="text-sm">{ticket.event.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <User className="h-4 w-4 mr-3" />
            <span className="text-sm">{ticket.user.name}</span>
          </div>
        </div>
        
        {ticket.status === 'valid' && (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="mb-2">
              <QRCode value={ticket.qrCode} size={120} />
            </div>
            <p className="text-xs text-gray-600">
              Show this QR code at the event entrance
            </p>
          </div>
        )}
        
        {ticket.checkInDate && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Checked in:</strong> {format(new Date(ticket.checkInDate), 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketCard;