import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import departmentRoutes from './routes/department.routes';
import shiftRoutes from './routes/shift.routes';
import patientRoutes from './routes/patient.routes';
import { prisma } from './db/client';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes under test
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/departments', departmentRoutes);
app.use('/shifts', shiftRoutes);
app.use('/patients', patientRoutes);

// Simple health route (for debugging tests)
app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' });
});

export { app, prisma };
