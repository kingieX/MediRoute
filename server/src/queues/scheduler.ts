import { prisma } from '../db/client';
import { shiftQueue } from './shiftQueue';
import { logger } from '../utils/logger';

/**
 * Schedule daily auto-assign jobs for all departments
 */
export async function scheduleAllDepartmentsDaily() {
  const departments = await prisma.department.findMany();

  if (departments.length === 0) {
    logger.warn('⚠️ No departments found for auto-scheduling.');
    return;
  }

  for (const dept of departments) {
    await shiftQueue.add(
      'autoAssign',
      {
        departmentId: dept.id,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
        strategy: 'round_robin',
      },
      {
        // Alternative using 'every'
        repeat: {
          every: 24 * 60 * 60 * 1000, // run every 24 hours (in milliseconds)
        },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    logger.info(`Scheduled daily auto-assign for department ${dept.name} (${dept.id})`);
  }
}
