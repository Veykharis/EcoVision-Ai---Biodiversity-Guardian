/**
 * EcoVision AI — Multi-Agent Reasoning Route
 * POST /api/v1/analyze/:id — triggers Context → Pattern → Insight pipeline
 */

import { Router } from 'express';
import { getAllSightings, getSightingById, updateSighting } from '../services/store.js';
import { runMultiAgentReasoningPipeline } from '../gemini.js';

export const analyzeRouter = Router();

analyzeRouter.post('/:id', async (req, res) => {
  try {
    const sightingId = req.params.id;
    const sighting = getSightingById(sightingId);

    if (!sighting) {
      return res.status(404).json({ error: 'Sighting record not found' });
    }

    // Run Context → Pattern → Insight DAG
    const reasoningInsight = await runMultiAgentReasoningPipeline(sighting, getAllSightings());

    // Persist insight to store
    updateSighting(sightingId, { reasoningInsight });

    res.json({ success: true, sightingId, reasoningInsight });
  } catch (error: any) {
    console.error('[Analyze] Error in POST /analyze/:id:', error);
    res.status(500).json({ error: error.message || 'Failed to execute multi-agent reasoning pipeline' });
  }
});
