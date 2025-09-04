import { Worker } from 'bullmq';
import { config } from '../config';
import { prisma } from '../db/client';
import { logger } from '../utils/logger';
import Redis from 'ioredis';
import { getIO } from '../sockets/socket';

const redis = new Redis(config.REDIS_URL);

export const shiftWorker = new Worker(
  'shiftQueue',
  async (job) => {
    logger.info(`Processing job ${job.id} with data: ${JSON.stringify(job.data)}`);

    const { departmentId, date } = job.data;

    // Get all doctors + nurses in the department
    const availableUsers = await prisma.user.findMany({
      where: { role: { in: ['DOCTOR', 'NURSE'] } },
      orderBy: { createdAt: 'asc' }, // consistent ordering
    });

    if (availableUsers.length === 0) {
      throw new Error('No staff available for auto-assignment');
    }

    // Round-robin index tracking in Redis
    const key = `dept:${departmentId}:lastIndex`;
    let lastIndex = parseInt((await redis.get(key)) || '-1', 10);

    // Pick next index
    const nextIndex = (lastIndex + 1) % availableUsers.length;
    const user = availableUsers[nextIndex];

    // Save new index back to Redis
    await redis.set(key, nextIndex.toString());

    // Create shift for selected user
    const shift = await prisma.shift.create({
      data: {
        userId: user.id,
        departmentId,
        startTime: new Date(date),
        endTime: new Date(new Date(date).getTime() + 8 * 60 * 60 * 1000), // 8h shift
      },
    });

    logger.info(
      `Auto-assigned shift for ${user.email} (round-robin) in department ${departmentId}`,
    );
    // console.log('Shift: ', shift);

    // 🔥 Emit event for new shift
    getIO().emit('shift:created', job);

    return shift;
  },
  {
    connection: { url: config.REDIS_URL },
  },
);

shiftWorker.on('failed', (job, err) => {
  logger.error(` Job ${job?.id} failed: ${err.message}`);
});
