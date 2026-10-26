import { io } from 'socket.io-client';

// The socket lives on the same host as the API, without the /api suffix
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const socket = io(API.replace(/\/api\/?$/, ''), { transports: ['websocket', 'polling'] });

export default socket;
