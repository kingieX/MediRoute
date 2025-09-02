import { Queue } from 'bullmq';
import { config } from '../config';

export const shiftQueue = new Queue('shiftQueue', {
  connection: {
    url: config.REDIS_URL, // from .env
  },
});
