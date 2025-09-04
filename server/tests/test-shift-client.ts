// Run with: node test-shift-client.js
const { io } = require('socket.io-client');

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
  reconnection: true, // enable auto-reconnect
  reconnectionAttempts: 10, // try 10 times before giving up
  reconnectionDelay: 5000, // wait 5s between retries
});

socket.on('connect', () => {
  console.log('✅ Connected to Socket.IO server with ID:', socket.id);
});

socket.on('connect_error', (err) => {
  console.error('⚠️ Connection error:', err.message);
});

socket.on('reconnect_attempt', (attempt) => {
  console.log(`🔄 Reconnect attempt #${attempt}`);
});

socket.on('reconnect_failed', () => {
  console.error('❌ Failed to reconnect after max attempts');
});

socket.on('shift:created', (data) => {
  console.log('📢 Shift Created Event:', data);
});

socket.on('patient:created', (data) => {
  console.log('📢 Patient Created Event:', data);
});

socket.on('patient:statusUpdated', (data) => {
  console.log('📢 Patient Status Updated:', data);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from server');
});
