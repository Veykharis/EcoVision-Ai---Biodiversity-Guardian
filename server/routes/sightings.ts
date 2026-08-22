/**
 * EcoVision AI — Sightings Routes
 * GET  /api/v1/sightings          — list with optional filters
 * GET  /api/v1/sightings/:id      — single sighting
 * POST /api/v1/identify           — perception pipeline (image → sighting)
 */

import { Router } from 'express';
import { getAllSightings, getSightingById, addSighting } from '../services/store.js';
import { runPerceptionPipeline } from '../services/perception.js';

export const sightingsRouter = Router();

// ─── List Sightings ───────────────────────────────────────────────────────────
sightingsRouter.get('/', (req, res) => {
  const { search, region, isInvasive, iucnStatus } = req.query;
  let results = [...getAllSightings()];

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (s) =>
        s.speciesName.toLowerCase().includes(q) ||
        s.scientificName.toLowerCase().includes(q) ||
        s.locationName.toLowerCase().includes(q)
    );
  }

  if (region && typeof region === 'string') {
    results = results.filter((s) => s.region.toLowerCase().includes(region.toLowerCase()));
  }

  if (isInvasive !== undefined) {
    const flag = isInvasive === 'true';
    results = results.filter((s) => s.isInvasive === flag);
  }

  if (iucnStatus && typeof iucnStatus === 'string') {
    results = results.filter((s) => s.iucnStatus === iucnStatus);
  }

  res.json({ total: results.length, sightings: results });
});

// ─── Single Sighting ──────────────────────────────────────────────────────────
sightingsRouter.get('/:id', (req, res) => {
  const sighting = getSightingById(req.params.id);
  if (!sighting) {
    return res.status(404).json({ error: 'Sighting not found' });
  }
  res.json(sighting);
});

// ─── Perception Pipeline (Identify) ──────────────────────────────────────────
sightingsRouter.post('/identify', async (req, res) => {
  try {
    const { image, lat, lng, locationName, observerRole } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data (base64 string) is required' });
    }

    const targetLat = Number(lat) || 17.385;
    const targetLng = Number(lng) || 78.4867;
    const locationHint = locationName || `Latitude ${targetLat}, Longitude ${targetLng}`;

    const result = await runPerceptionPipeline({
      image,
      lat: targetLat,
      lng: targetLng,
      locationName: locationHint,
      observerRole
    });

    addSighting(result.sighting);

    res.json({ success: true, sighting: result.sighting, perception: result.perception });
  } catch (error: any) {
    console.error('[Sightings] Error in POST /identify:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze image perception' });
  }
});
