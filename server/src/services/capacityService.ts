import { prisma } from '../db/client';
import { logger } from '../utils/logger';

/**
 * Capacity Service:
 *  - Checks if a department can admit more patients
 *  - Optionally raises alerts if threshold is breached
 */
export class CapacityService {
  /**
   * Check if department is below capacity before admitting a patient
   */
  static async checkCapacityBeforeAdmission(departmentId: string): Promise<void> {
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      include: { patients: { where: { status: 'WAITING' } } },
    });

    if (!department) {
      throw new Error('Department not found');
    }

    const activePatients = department.patients.length;

    if (activePatients >= department.capacity) {
      throw new Error(`Department "${department.name}" is at full capacity`);
    }

    // Raise warning if usage > 80%
    const usage = (activePatients / department.capacity) * 100;
    if (usage >= 80) {
      await prisma.alert.create({
        data: {
          type: 'CAPACITY_THRESHOLD',
          message: `Department "${department.name}" is ${usage.toFixed(0)}% full`,
        },
      });
      logger.warn(`Capacity warning for ${department.name}: ${usage}%`);
    }
  }
}
