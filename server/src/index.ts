import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';

import { config } from './config';
import { logger } from './utils/logger';

const app: Application = express();
const prisma = new PrismaClient();
const PORT = config.PORT;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok', env: config.NODE_ENV });
});

// Authentication endpoint
app.use('/auth', authRoutes);

// Start server
async function startServer() {
  try {
    // Check DB connection before starting server
    await prisma.$connect();
    logger.info('Database connected');

    const server = app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });

    // Graceful shutdown handling
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Closing server...`);
      server.close(async () => {
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
    logger.error({ error }, '❌ Failed to connect to database');
    process.exit(1);
  }
}

startServer();
