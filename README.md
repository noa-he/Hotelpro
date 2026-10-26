# Hotelpro

This is a full-stack hotel management web application. It handles room bookings, guest check-ins, and basic administrative tasks. 

The project is split into a frontend client and a backend server, both housed right here in this repository.

## Project Structure

* **client/** - The frontend user interface and state logic.
* **server/** - The REST API, database schemas, and server-side business logic.

## Getting Started

To run this application locally, you will need to set up both the backend and frontend environments.

### 1. Clone the repository
```bash
git clone https://github.com
cd Hotelpro
```

### 2. Backend Setup (Server)
Navigate to the server directory, install the required dependencies, and boot up the server environment:
```bash
cd server
npm install
npm run dev
```
*(Note: If the server requires environment variables for database connections, create a `.env` file in the root of the server folder before running).*

### 3. Frontend Setup (Client)
Open a new terminal session, switch over to the client directory, install the dependencies, and start the development server:
```bash
cd client
npm install
npm start
```

Once both servers are up, open your browser and navigate to the local port specified by the frontend setup to test the app.
