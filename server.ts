/**
 * EcoVision AI — Server Entry Point v2.0
 *
 * This file is intentionally lean. All route logic lives in server/routes/*.
 * All business logic lives in server/services/*.
 * All external API clients live in server/*.ts
 */

import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// ─── Route Modules ────────────────────────────────────────────────────────────
import { healthRouter } from './server/routes/health.js';
import { sightingsRouter } from './server/routes/sightings.js';
import { analyzeRouter } from './server/routes/analyze.js';
import { citizenReportsRouter } from './server/routes/citizenReports.js';
import { analyticsRouter } from './server/routes/analytics.js';
import { externalRouter } from './server/routes/external.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // ─── Global Middleware ──────────────────────────────────────────────────────
  app.use(express.json({ limit: '20mb' })); // 20mb for base64 camera uploads

  // ─── API Routes ─────────────────────────────────────────────────────────────
  app.use('/api/v1/health', healthRouter);
  app.use('/api/v1/sightings', sightingsRouter);
  app.use('/api/v1/analyze', analyzeRouter);
  app.use('/api/v1/citizen-reports', citizenReportsRouter);
  app.use('/api/v1/analytics', analyticsRouter);
  app.use('/api/v1', externalRouter); // weather, nasa, gbif, inaturalist, tts, voice-query, seed

  // ─── Frontend Serving ───────────────────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    // Development: Vite middleware for HMR
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve built SPA
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EcoVision AI Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
