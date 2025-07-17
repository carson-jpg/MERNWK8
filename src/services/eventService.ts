import { Event, Ticket, Order } from '../types';

class EventService {
  private baseURL = 'http://localhost:3001/api';

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getEvents(): Promise<Event[]> {
    const response = await fetch(`${this.baseURL}/events`);
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    return response.json();
  }

  async getEvent(id: string): Promise<Event> {
    const response = await fetch(`${this.baseURL}/events/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch event');
    }
    return response.json();
  }

  async createEvent(event: Omit<Event, '_id' | 'organizer' | 'createdAt' | 'updatedAt' | 'availableTickets'>): Promise<Event> {
    const response = await fetch(`${this.baseURL}/events`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create event');
    }

    return response.json();
  }

  async updateEvent(id: string, event: Partial<Event>): Promise<Event> {
    const response = await fetch(`${this.baseURL}/events/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update event');
    }

    return response.json();
  }

  async deleteEvent(id: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/events/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
  }

  async registerForEvent(eventId: string, quantity: number = 1): Promise<Order> {
    const response = await fetch(`${this.baseURL}/events/${eventId}/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to register for event');
    }

    return response.json();
  }

  async getUserTickets(): Promise<Ticket[]> {
    const response = await fetch(`${this.baseURL}/tickets`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    return response.json();
  }

  async getOrganizerEvents(): Promise<Event[]> {
    const response = await fetch(`${this.baseURL}/events/organizer`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch organizer events');
    }

    return response.json();
  }

  async scanTicket(qrCode: string): Promise<{ success: boolean; message: string; ticket?: Ticket }> {
    const response = await fetch(`${this.baseURL}/tickets/scan`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ qrCode }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to scan ticket');
    }

    return response.json();
  }
}

export const eventService = new EventService();