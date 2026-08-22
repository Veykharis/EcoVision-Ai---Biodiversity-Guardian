/**
 * EcoVision AI — Analytics Route
 * GET /api/v1/analytics — ecosystem health summary + agent telemetry stats
 */

import { Router } from 'express';
import { getAllSightings, getAllReports } from '../services/store.js';
import { INITIAL_REGIONS } from '../seedData.js';

export const analyticsRouter = Router();

analyticsRouter.get('/', (_req, res) => {
  const sightings = getAllSightings();
  const reports = getAllReports();

  const totalSightings = sightings.length;
  const invasiveCount = sightings.filter((s) => s.isInvasive).length;
  const endangeredCount = sightings.filter((s) => ['CR', 'EN', 'VU'].includes(s.iucnStatus)).length;
  const verifiedCount = sightings.filter((s) => s.verifiedStatus === 'verified_expert').length;

  const analyzedSightings = sightings.filter((s) => s.reasoningInsight);
  const totalReasoningRuns = analyzedSightings.length;

  let avgLatencyMs = 0;
  let totalApiCostUsd = 0;

  if (totalReasoningRuns > 0) {
    const sumLatency = analyzedSightings.reduce(
      (acc, s) => acc + (s.reasoningInsight?.totalPipelineTimeMs || 0),
      0
    );
    const sumCost = analyzedSightings.reduce(
      (acc, s) => acc + (s.reasoningInsight?.totalCostUsd || 0),
      0
    );
    avgLatencyMs = Math.round(sumLatency / totalReasoningRuns);
    totalApiCostUsd = Number(sumCost.toFixed(5));
  }

  res.json({
    summary: {
      totalSightings,
      invasiveCount,
      endangeredCount,
      verifiedRatio: Math.round((verifiedCount / (totalSightings || 1)) * 100),
      totalCitizenReports: reports.length,
      pendingReports: reports.filter((r) => r.status === 'pending').length
    },
    agentTelemetryStats: {
      totalReasoningRuns,
      avgLatencyMs,
      totalApiCostUsd
    },
    regions: INITIAL_REGIONS
  });
});
