import { Router, Request, Response } from 'express';
import { prisma } from '../db/client';
import { authMiddleware } from '../middlewares/auth';
import { subDays } from 'date-fns';
import { exportCSV, exportPDF } from '../utils/export';
import { logEvent } from '../utils/loggerService';

const router = Router();

/**
 * GET /analytics/staff-utilization
 * Returns staff utilization by department
 */
router.get('/staff-utilization', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  const { startDate, endDate, departmentId, format } = req.query;

  try {
    const filters: any = {};
    if (startDate && endDate) {
      filters.startTime = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }
    if (departmentId) {
      filters.departmentId = departmentId;
    }

    // Total shifts assigned in period
    const totalShifts = await prisma.shift.count({ where: filters });

    // Group shifts by user to see utilization
    const utilization = await prisma.shift.groupBy({
      by: ['userId'],
      where: filters,
      _count: { _all: true },
    });

    // Attach user info
    const results = await Promise.all(
      utilization.map(async (u) => {
        const user = await prisma.user.findUnique({
          where: { id: u.userId },
          select: { id: true, email: true, role: true },
        });
        return {
          ...user,
          shiftsWorked: u._count._all,
        };
      }),
    );

    // Log analytics access
    await logEvent(
      (req as any).user?.id || null,
      'VIEW_ANALYTICS',
      JSON.stringify({
        route: '/analytics/staff-utilization',
        startDate,
        endDate,
        departmentId,
        format,
      }),
    );

    // 👉 Export logic
    if (format === 'csv') {
      return exportCSV(res, 'staff_utilization', results);
    }
    if (format === 'pdf') {
      return exportPDF(res, 'staff_utilization', results);
    }

    return res.json({
      totalShifts,
      utilization: results,
    });
  } catch (err) {
    console.error('Error fetching staff utilization:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /analytics/patient-load
 * Returns patient load grouped by department and status
 */
router.get('/patient-load', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  const { departmentId, format } = req.query;

  try {
    const filters: any = {};
    if (departmentId) {
      filters.departmentId = departmentId;
    }

    // Count patients grouped by department + status
    const load = await prisma.patient.groupBy({
      by: ['departmentId', 'status'],
      where: filters,
      _count: { _all: true },
    });

    // Attach department info
    const results = await Promise.all(
      load.map(async (item) => {
        const department = await prisma.department.findUnique({
          where: { id: item.departmentId },
          select: { id: true, name: true },
        });
        return {
          department: department?.name || 'Unknown',
          departmentId: item.departmentId,
          status: item.status,
          count: item._count._all,
        };
      }),
    );

    // Log analytics access
    await logEvent(
      (req as any).user?.id || null,
      'VIEW_ANALYTICS',
      JSON.stringify({
        route: '/analytics/patient-load',
        departmentId,
        format,
      }),
    );

    if (format === 'csv') return exportCSV(res, 'patient_load', results);
    if (format === 'pdf') return exportPDF(res, 'patient_load', results);

    return res.json({ load: results });
  } catch (err) {
    console.error('Error fetching patient load:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /analytics/trends
 * Returns patient trends (admissions, discharges, waiting congestion) over time
 */
router.get('/trends', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  const { startDate, endDate, interval = 'day', format } = req.query;

  try {
    const start = startDate ? new Date(startDate as string) : subDays(new Date(), 30);
    const end = endDate ? new Date(endDate as string) : new Date();

    // Fetch patients within range
    const patients = await prisma.patient.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Group by date (daily or weekly)
    const trends: Record<string, { admissions: number; discharges: number; waiting: number }> = {};

    patients.forEach((p) => {
      const key =
        interval === 'week'
          ? `${p.createdAt.getFullYear()}-W${Math.ceil(p.createdAt.getDate() / 7)}`
          : p.createdAt.toISOString().split('T')[0];

      if (!trends[key]) {
        trends[key] = { admissions: 0, discharges: 0, waiting: 0 };
      }

      trends[key].admissions += 1;
      if (p.status === 'DISCHARGED') {
        trends[key].discharges += 1;
      }
      if (p.status === 'WAITING') {
        trends[key].waiting += 1;
      }
    });

    const results = Object.entries(trends).map(([date, stats]) => ({
      date,
      ...stats,
    }));

    // Log analytics access
    await logEvent(
      (req as any).user?.id || null,
      'VIEW_ANALYTICS',
      JSON.stringify({
        route: '/analytics/trends',
        startDate,
        endDate,
        interval,
        format,
      }),
    );

    if (format === 'csv') return exportCSV(res, 'trends', results);
    if (format === 'pdf') return exportPDF(res, 'trends', results);

    return res.json({ interval, trends: results });
  } catch (err) {
    console.error('Error fetching trends:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
