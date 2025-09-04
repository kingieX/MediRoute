const { io } = require('socket.io-client');

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('✅ Connected to server');

  // Simulate moving between zones
  const zones = ['ER', 'ICU', 'WARD1', 'LAB', 'PHARMACY'];
  let i = 0;

  setInterval(() => {
    const zone = zones[i % zones.length];
    socket.emit('location_update', { userId: 'cmeyjewcd0000x5k41h0sjc4b', zone });
    console.log(`📍 Sent location update: ${zone}`);
    i++;
  }, 5000);
});

socket.on('staff_location_update', (data) => {
  console.log('📡 Broadcast:', data);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected');
});
