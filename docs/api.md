# API Documentation

## Authentication

### Register
- **URL:** `/api/auth/register`
- **Method:** POST
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "User Name",
    "role": "user" // or "organizer"
  }
  ```
- **Response:** User object and JWT token

### Login
- **URL:** `/api/auth/login`
- **Method:** POST
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:** User object and JWT token

### Verify Token
- **URL:** `/api/auth/verify`
- **Method:** GET
- **Headers:** Authorization: Bearer <token>
- **Response:** User object

## Events

### Get All Events
- **URL:** `/api/events`
- **Method:** GET
- **Response:** List of events

### Get Event by ID
- **URL:** `/api/events/:id`
- **Method:** GET
- **Response:** Event object

### Create Event
- **URL:** `/api/events`
- **Method:** POST
- **Headers:** Authorization: Bearer <token>
- **Body:** Event object
- **Response:** Created event object

### Update Event
- **URL:** `/api/events/:id`
- **Method:** PUT
- **Headers:** Authorization: Bearer <token>
- **Body:** Updated event fields
- **Response:** Updated event object

### Delete Event
- **URL:** `/api/events/:id`
- **Method:** DELETE
- **Headers:** Authorization: Bearer <token>
- **Response:** 204 No Content

## Tickets

### Register for Event (Purchase Tickets)
- **URL:** `/api/events/:id/register`
- **Method:** POST
- **Headers:** Authorization: Bearer <token>
- **Body:**
  ```json
  {
    "quantity": 2
  }
  ```
- **Response:** Order object with tickets

### Get User Tickets
- **URL:** `/api/tickets`
- **Method:** GET
- **Headers:** Authorization: Bearer <token>
- **Response:** List of tickets

### Scan Ticket
- **URL:** `/api/tickets/scan`
- **Method:** POST
- **Headers:** Authorization: Bearer <token>
- **Body:**
  ```json
  {
    "qrCode": "ticket-qr-code"
  }
  ```
- **Response:** Scan result and ticket info

## Organizer Events

### Get Organizer's Events
- **URL:** `/api/events/organizer`
- **Method:** GET
- **Headers:** Authorization: Bearer <token>
- **Response:** List of events created by the organizer
