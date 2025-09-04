const { io } = require('socket.io-client');

// Connect to your running backend
const socket = io('http://localhost:5000', {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('✅ Connected to server with id:', socket.id);

  // Send a test event to server
  socket.emit('hello', { msg: 'Hello from client!' });
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from server');
});

// Optional: listen for broadcasts
socket.on('broadcast', (data) => {
  console.log('📢 Broadcast received:', data);
});
