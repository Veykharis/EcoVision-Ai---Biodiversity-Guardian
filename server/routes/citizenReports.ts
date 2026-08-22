/**
 * EcoVision AI — Citizen Reports Routes
 * GET  /api/v1/citizen-reports   — list all reports
 * POST /api/v1/citizen-reports   — submit a new report
 */

import { Router } from 'express';
import { CitizenReport } from '../../src/types.js';
import { getAllReports, addReport } from '../services/store.js';

export const citizenReportsRouter = Router();

// ─── List Reports ─────────────────────────────────────────────────────────────
citizenReportsRouter.get('/', (_req, res) => {
  const reports = getAllReports();
  res.json({ total: reports.length, reports });
});

// ─── Submit Report ────────────────────────────────────────────────────────────
citizenReportsRouter.post('/', (req, res) => {
  const { title, category, description, locationName, lat, lng, urgency, imageUrl } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const newReport: CitizenReport = {
    id: `report-${Date.now()}`,
    timestamp: new Date().toISOString(),
    title,
    category: category || 'illegal_dumping',
    description,
    locationName: locationName || 'Reported Location',
    lat: Number(lat) || 17.385,
    lng: Number(lng) || 78.4867,
    imageUrl,
    status: 'pending',
    urgency: urgency || 'medium'
  };

  addReport(newReport);
  res.json({ success: true, report: newReport });
});
