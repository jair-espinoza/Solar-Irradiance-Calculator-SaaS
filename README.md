# Solar Panel Irradiance Forecast Fullstack 

Solar irradiance (W/m²) is computed using a position-sensitive solar physics formula that accounts for the relative angle between the sun and the panel surface. This full-stack web application allows users to calculate solar irradiance and estimated energy output, in order to helps optimize the panel tilt angle and direction for maximum efficiency. 

Built with **Node.js, Express, MongoDB, and React (Vite)**, the backend (server directory) includes the calculation logic and API endpoints, all developed from the ground up to provide for flexible service.

---
## Features
- Solar irradiance and energy output calculation
- User authentication with JWT
- Secure password hashing
- Save and manage calculation history for comparison
- Custom RESTful API
- Responsive React frontend

---
## Tech Stack

### Backend
- Node.js
- Express 5
- MongoDB & Mongoose
- JWT Authentication
- bcrypt
- dotenv

### Frontend
- React 19
- React Router
- Vite
- TypeScript
- ESLint

---
## Installation & Setup
### Clone the repository
```bash
git clone https://github.com/jair-espinoza/Solar-Irradiance-Calculator-SaaS.git
cd spp_fullstack
```

### create a .env file
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=your_client_url

---

## Backend Setup
cd server
npm install
npm run dev

---
## Frontend Setup
cd client
npm install
npm run dev

---
## API Overview
-----------------------------------------------------------------------
| Method | Endpoint              | Description                       |
|--------|----------------------|------------------------------------|
| POST   | /auth/register        | Register a new user               |
| POST   | /auth/login           | Login user and set JWT cookie     |
| POST   | /solar/calculate      | Calculate solar irradiance        |
| POST   | /solar                | Save calculation record           |
| GET    | /solar                | Retrieve saved calculations       |
| GET    | /solar/:id            | Retrieve a single calculation     |
------------------------------------------------------------------------