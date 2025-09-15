import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import departmentRoutes from './routes/department.routes';
import shiftRoutes from './routes/shift.routes';
import patientRoutes from './routes/patient.routes';
import alertRoutes from './routes/alert.routes';
import logRoutes from './routes/log.routes';
import zoneRoutes from './routes/zone.routes';
import analyticsRoutes from './routes/analytics.routes';

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { config } from './config';
import { logger } from './utils/logger';

// Shift worker
import './workers/shiftWorker';
import { initSocket } from './sockets/socket';
import { initLocationChannel } from './sockets/location';
import { scheduleAllDepartmentsDaily } from './queues/scheduler';
import path from 'path';

const app: Application = express();
const prisma = new PrismaClient();
const PORT = config.PORT;

// Middlewares
app.use(cors());
// app.use(
//   cors({
//     origin: 'http://localhost:3000', // Allow requests from your frontend's URL
//     optionsSuccessStatus: 200, // For legacy browser support
//   }),
// );
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Use __dirname directly for CommonJS modules
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok', env: config.NODE_ENV });
});

// Authentication endpoint
app.use('/auth', authRoutes);

// User endpoint
app.use('/users', userRoutes);

// Department endpoint
app.use('/departments', departmentRoutes);

// Shift endpoint
app.use('/shifts', shiftRoutes);

// Patient endpoint
app.use('/patients', patientRoutes);

// Alert endpoint
app.use('/alerts', alertRoutes);

// Log endpoint
app.use('/logs', logRoutes);

// Hospital zones endpoint
app.use('/zones', zoneRoutes);

// Analytics endpoint
app.use('/analytics', analyticsRoutes);

// Start server
async function startServer() {
  try {
    // Check DB connection before starting server
    await prisma.$connect();
    logger.info('Database connected');

    await scheduleAllDepartmentsDaily();

    // Create HTTP server from Express
    const httpServer = http.createServer(app);

    // Attach Socket.IO to HTTP server
    // const io = new SocketIOServer(httpServer, {
    //   cors: {
    //     origin: '*', // allow all for now (lock down later)
    //   },
    // });

    // io.on('connection', (socket) => {
    //   logger.info(`Client connected: ${socket.id}`);

    //   socket.on('hello', (data) => {
    //     logger.info(`Hello event from client: ${JSON.stringify(data)}`);
    //     socket.emit('broadcast', { msg: 'Hello from server!' });
    //   });

    //   socket.on('disconnect', () => {
    //     logger.info(`Client disconnected: ${socket.id}`);
    //   });
    // });

    const io = initSocket(httpServer);
    // Inside startServer after socket init:
    initLocationChannel();

    // Start server
    httpServer.listen(PORT, () => {
      logger.info(`Server + Socket.IO running on http://localhost:${PORT}`);
    });

    // Graceful shutdown handling
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Closing server...`);
      httpServer.close(async () => {
        logger.info('HTTP server closed.');
        try {
          await prisma.$disconnect();
          logger.info('Database disconnected.');
        } catch (err: unknown) {
          logger.error({ err }, 'Error while disconnecting database');
        }
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT')); // Ctrl+C
    process.on('SIGTERM', () => shutdown('SIGTERM')); // kill command / Docker stop
  } catch (error: unknown) {
    logger.error({ error }, 'Failed to connect to database');
    process.exit(1);
  }
}

startServer();
