import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import Redis from 'ioredis';

import { prisma } from '@war-pigs/database';
import { authRoutes } from './routes/auth';
import { gameRoutes } from './routes/game';
import { shopRoutes } from './routes/shop';
import { inventoryRoutes } from './routes/inventory';
import { adminRoutes } from './routes/admin';

const server = Fastify({
  logger: true,
  trustProxy: true
});

// Redis for rate limiting and sessions
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

async function start() {
  try {
    // Plugins
    await server.register(cors, {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true
    });

    await server.register(rateLimit, {
      max: 100,
      timeWindow: '1 minute',
      redis
    });

    await server.register(jwt, {
      secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production'
    });

    // Health check
    server.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

    // Routes
    await server.register(authRoutes, { prefix: '/api/auth' });
    await server.register(gameRoutes, { prefix: '/api/game' });
    await server.register(shopRoutes, { prefix: '/api/shop' });
    await server.register(inventoryRoutes, { prefix: '/api/inventory' });
    await server.register(adminRoutes, { prefix: '/api/admin' });

    // Error handler
    server.setErrorHandler((error, request, reply) => {
      server.log.error(error);
      reply.status(500).send({ error: 'Internal server error', message: error.message });
    });

    const port = parseInt(process.env.API_PORT || '3001');
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`API server running on port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
