# Event Ticketing System

## Project Overview
This is a full-stack event ticketing system application with a React frontend and an Express backend. It allows users to browse events, register, purchase tickets, and manage their orders. Organizers can create and manage events.

## Features
- User registration and authentication with JWT
- Event browsing and filtering
- Ticket purchasing and QR code generation
- Organizer event management
- Real-time updates with Socket.io (if applicable)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory with the following variables:
   ```
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend server:
   ```bash
   npm run server
   ```

### Frontend Setup
1. Navigate to the project root directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to `http://localhost:3000` (or the port shown in the terminal).

### Production Build
- To build the frontend for production:
  ```bash
  npm run build
  ```
- The build output will be in the `dist` folder.

## Deployment
- Backend can be deployed on platforms like Heroku, Render, or DigitalOcean.
- Frontend can be deployed on Netlify, Vercel, or similar static hosting services.
- CI/CD pipelines are set up using GitHub Actions for automated testing and deployment.

## Monitoring and Error Tracking
- Integrated with Sentry for real-time error tracking on both backend and frontend.

## Documentation
- API documentation is available in the `docs/api.md` file.
- User guide and technical architecture overview are included in the `docs` folder.

## Contributing
Contributions are welcome! Please open issues or pull requests for improvements.

## License
This project is licensed under the MIT License.
