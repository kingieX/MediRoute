// src/utils/socket.ts
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

/**
 * Initialize Socket.IO with the given HTTP server
 */
export const initSocket = (httpServer: any) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*', // ✅ allow all for now (lock down later in prod)
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Get the Socket.IO instance
 */
export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initSocket first.');
  }
  return io;
};

/**
 * Emit an event globally
 */
export const emitEvent = (event: string, payload: any) => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initSocket first.');
  }
  io.emit(event, payload);
};
