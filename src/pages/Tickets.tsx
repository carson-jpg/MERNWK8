import React, { useState, useEffect } from 'react';
import { Ticket as TicketIcon, Calendar, Search } from 'lucide-react';
import TicketCard from '../components/Tickets/TicketCard';
import { Ticket } from '../types';
import { eventService } from '../services/eventService';
import { useAuth } from '../context/AuthContext';

const Tickets: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (isAuthenticated) {
      fetchTickets();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchTerm, statusFilter]);

  const fetchTickets = async () => {
    try {
      const userTickets = await eventService.getUserTickets();
      setTickets(userTickets);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    setFilteredTickets(filtered);
  };

  const getStatusCounts = () => {
    return {
      all: tickets.length,
      valid: tickets.filter(ticket => ticket.status === 'valid').length,
      used: tickets.filter(ticket => ticket.status === 'used').length,
      cancelled: tickets.filter(ticket => ticket.status === 'cancelled').length
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <TicketIcon className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">{statusCounts.all}</div>
              <div className="text-sm text-gray-600">Total Tickets</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600">{statusCounts.valid}</div>
              <div className="text-sm text-gray-600">Valid Tickets</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.used}</div>
              <div className="text-sm text-gray-600">Used Tickets</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-red-600">{statusCounts.cancelled}</div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="valid">Valid</option>
              <option value="used">Used</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {tickets.length === 0 ? 'No tickets yet' : 'No tickets found'}
            </h3>
            <p className="text-gray-600">
              {tickets.length === 0 
                ? 'Start by browsing and registering for events.'
                : 'Try adjusting your search criteria.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;