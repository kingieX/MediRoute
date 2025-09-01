import { Router, Request, Response } from 'express';
import { prisma } from '../db/client';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

/**
 * POST /patients
 * Create a new patient (Admin/Doctor/Nurse)
 */
router.post(
  '/',
  authMiddleware(['ADMIN', 'DOCTOR', 'NURSE']),
  async (req: Request, res: Response) => {
    try {
      const { name, departmentId, status } = req.body;

      if (!name || !departmentId) {
        return res.status(400).json({ error: 'name and departmentId are required' });
      }

      const department = await prisma.department.findUnique({ where: { id: departmentId } });
      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }

      const patient = await prisma.patient.create({
        data: {
          name,
          departmentId,
          status: status || 'WAITING',
        },
        select: {
          id: true,
          name: true,
          status: true,
          department: { select: { id: true, name: true } },
          createdAt: true,
        },
      });

      return res.status(201).json(patient);
    } catch (err) {
      console.error('Error creating patient:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
);

/**
 * GET /patients
 * List all patients (Admin/Doctor/Nurse)
 */
router.get(
  '/',
  authMiddleware(['ADMIN', 'DOCTOR', 'NURSE']),
  async (_req: Request, res: Response) => {
    try {
      const patients = await prisma.patient.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          status: true,
          createdAt: true,
          department: { select: { id: true, name: true } },
        },
      });

      return res.json(patients);
    } catch (err) {
      console.error('Error fetching patients:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
);

/**
 * GET /patients/:id
 * Fetch a single patient by ID (Admin/Doctor/Nurse)
 */
router.get(
  '/:id',
  authMiddleware(['ADMIN', 'DOCTOR', 'NURSE']),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const patient = await prisma.patient.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          department: { select: { id: true, name: true } },
        },
      });

      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      return res.json(patient);
    } catch (err) {
      console.error('Error fetching patient:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
);

/**
 * PUT /patients/:id
 * Update a patient (Admin/Doctor/Nurse)
 */
router.put(
  '/:id',
  authMiddleware(['ADMIN', 'DOCTOR', 'NURSE']),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, status, departmentId } = req.body;

      const patient = await prisma.patient.findUnique({ where: { id } });
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      if (status && !['WAITING', 'IN_TREATMENT', 'DISCHARGED'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }

      if (departmentId) {
        const dept = await prisma.department.findUnique({ where: { id: departmentId } });
        if (!dept) {
          return res.status(404).json({ error: 'Department not found' });
        }
      }

      const updated = await prisma.patient.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(status && { status }),
          ...(departmentId && { departmentId }),
        },
        select: {
          id: true,
          name: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          department: { select: { id: true, name: true } },
        },
      });

      return res.json(updated);
    } catch (err) {
      console.error('Error updating patient:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
);

/**
 * DELETE /patients/:id
 * Delete a patient (Admin only)
 */
router.delete('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.patient.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    await prisma.patient.delete({ where: { id } });

    return res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    console.error('Error deleting patient:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
