import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/client';

/**
 * Middleware to check department capacity before admitting/updating a patient
 */
export const checkDepartmentCapacity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { departmentId } = req.body;

    if (!departmentId) {
      return res.status(400).json({ error: 'Department ID is required' });
    }

    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      include: { patients: { where: { status: 'WAITING' } } }, // only count active/waiting patients
    });

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // Check if department is at capacity
    if (department.patients.length >= department.capacity) {
      return res.status(400).json({
        error: `Department ${department.name} is at full capacity (${department.capacity})`,
      });
    }

    // Pass control if not full
    next();
  } catch (err) {
    console.error('Capacity check error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
