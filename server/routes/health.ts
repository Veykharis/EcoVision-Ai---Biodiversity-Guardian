/**
 * EcoVision AI — Health Check Route
 * GET /api/v1/health
 */

import { Router } from 'express';
import { getAllSightings, getAllReports } from '../services/store.js';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    system: 'EcoVision AI - Biodiversity Guardian Backend',
    version: '2.0.0',
    activeSightings: getAllSightings().length,
    activeReports: getAllReports().length,
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});
