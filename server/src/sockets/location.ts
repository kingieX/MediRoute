import { getIO } from './socket';
import { prisma } from '../db/client';
import { logger } from '../utils/logger';

export const initLocationChannel = () => {
  const io = getIO();

  io.on('connection', (socket) => {
    logger.info(`🔌 Location channel active for socket: ${socket.id}`);

    // Listen for location updates from clients
    socket.on('location_update', async (data) => {
      const { userId, zone } = data;

      if (!userId || !zone) {
        socket.emit('error', { message: 'userId and zone are required' });
        return;
      }

      try {
        // Update DB
        const user = await prisma.user.update({
          where: { id: userId },
          data: { currentLocation: zone },
        });

        logger.info(`📍 User ${user.email} moved to ${zone}`);

        // Broadcast to all clients
        io.emit('staff_location_update', {
          userId: user.id,
          email: user.email,
          role: user.role,
          zone: user.currentLocation,
          updatedAt: user.updatedAt,
        });
      } catch (err) {
        logger.error(`❌ Failed to update location: ${err}`);
        socket.emit('error', { message: 'Failed to update location' });
      }
    });
  });
};
