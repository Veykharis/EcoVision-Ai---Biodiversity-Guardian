/**
 * EcoVision AI — External Data & Utility Routes
 * POST /api/v1/identify              — perception pipeline (backward-compatible alias)
 * GET  /api/v1/weather               — real-time weather telemetry
 * GET  /api/v1/nasa/earthdata        — NASA satellite + FIRMS fire data
 * POST /api/v1/gbif/sync             — GBIF live species occurrence sync
 * GET  /api/v1/inaturalist/photos    — iNaturalist community photos
 * POST /api/v1/tts/speak             — ElevenLabs voice synthesis (streaming)
 * POST /api/v1/voice-query           — Natural language / voice field companion
 * POST /api/v1/seed/reset            — Reset in-memory store to seed data
 */

import { Router } from 'express';
import { fetchRealtimeWeather } from '../weather.js';
import { fetchNasaSatelliteData } from '../nasa.js';
import { fetchGBIFLiveSightings } from '../gbif.js';
import { fetchINaturalistSpeciesPhotos } from '../inaturalist.js';
import { synthesizeSpeech } from '../elevenlabs.js';
import { processVoiceOrTextQuery } from '../gemini.js';
import { getAllSightings, addSighting, addSightings, resetToSeed } from '../services/store.js';
import { runPerceptionPipeline } from '../services/perception.js';

export const externalRouter = Router();

// ─── Identify (Backward-Compatible Alias for /api/v1/identify) ───────────────
externalRouter.post('/identify', async (req, res) => {
  try {
    const { image, lat, lng, locationName, observerRole } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image data (base64 string) is required' });
    }
    const targetLat = Number(lat) || 17.385;
    const targetLng = Number(lng) || 78.4867;
    const locationHint = locationName || `Latitude ${targetLat}, Longitude ${targetLng}`;

    const result = await runPerceptionPipeline({
      image, lat: targetLat, lng: targetLng, locationName: locationHint, observerRole
    });
    addSighting(result.sighting);
    res.json({ success: true, sighting: result.sighting, perception: result.perception });
  } catch (error: any) {
    console.error('[External] Error in POST /identify:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze image perception' });
  }
});

// ─── Weather Telemetry ────────────────────────────────────────────────────────
externalRouter.get('/weather', async (req, res) => {
  try {
    const lat = Number(req.query.lat) || 17.385;
    const lng = Number(req.query.lng) || 78.4867;
    const locationName = (req.query.location as string) || 'Telangana Forest Reserve';
    const weather = await fetchRealtimeWeather(lat, lng, locationName);
    res.json({ success: true, weather });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch real-time weather telemetry' });
  }
});

// ─── NASA Earthdata / FIRMS ───────────────────────────────────────────────────
externalRouter.get('/nasa/earthdata', async (req, res) => {
  try {
    const lat = Number(req.query.lat) || 17.385;
    const lng = Number(req.query.lng) || 78.4867;
    const regionName = (req.query.region as string) || 'Telangana Wildlife Reserves';
    const nasaData = await fetchNasaSatelliteData(lat, lng, regionName);
    res.json({ success: true, nasaData });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch NASA satellite telemetry' });
  }
});

// ─── GBIF Live Sync ───────────────────────────────────────────────────────────
externalRouter.post('/gbif/sync', async (req, res) => {
  try {
    const query = (req.body.query as string) || 'India';
    const limit = Number(req.body.limit) || 8;

    const liveSightings = await fetchGBIFLiveSightings(query, limit);
    if (liveSightings.length > 0) {
      addSightings(liveSightings);
    }

    res.json({ success: true, count: liveSightings.length, query, sightings: liveSightings });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to sync live GBIF telemetry' });
  }
});

// ─── iNaturalist Photos ───────────────────────────────────────────────────────
externalRouter.get('/inaturalist/photos', async (req, res) => {
  try {
    const species = (req.query.species as string) || 'Panthera tigris';
    const limit = Number(req.query.limit) || 4;
    const data = await fetchINaturalistSpeciesPhotos(species, limit);
    res.json({ success: true, ...data });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch iNaturalist community photos' });
  }
});

// ─── ElevenLabs TTS ───────────────────────────────────────────────────────────
externalRouter.post('/tts/speak', async (req, res) => {
  try {
    const text = req.body.text || 'EcoVision AI audio dispatch test.';
    const voiceId = req.body.voiceId;
    await synthesizeSpeech(text, res, voiceId);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to synthesize voice audio dispatch' });
  }
});

// ─── Voice / Text Field Companion ─────────────────────────────────────────────
externalRouter.post('/voice-query', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query string is required' });
    }
    const sightings = getAllSightings();
    const answer = await processVoiceOrTextQuery(query, sightings);
    res.json({
      queryText: query,
      responseText: answer,
      matchedSightings: sightings.slice(0, 3)
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Voice query processing failed' });
  }
});

// ─── Seed Reset ───────────────────────────────────────────────────────────────
externalRouter.post('/seed/reset', (_req, res) => {
  resetToSeed();
  res.json({ success: true, message: 'Data reset to initial demo seeds.' });
});
