/**
 * EcoVision AI — useAnalytics Hook
 * Fetches ecosystem health summary and agent telemetry stats.
 */

import { useState, useEffect, useCallback } from 'react';
import { RegionalHealthScore } from '../types';

interface AnalyticsSummary {
  totalSightings: number;
  invasiveCount: number;
  endangeredCount: number;
  verifiedRatio: number;
  totalCitizenReports: number;
  pendingReports: number;
}

interface AgentTelemetryStats {
  totalReasoningRuns: number;
  avgLatencyMs: number;
  totalApiCostUsd: number;
}

interface AnalyticsData {
  summary: AnalyticsSummary;
  agentTelemetryStats: AgentTelemetryStats;
  regions: RegionalHealthScore[];
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/analytics');
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    summary: data?.summary ?? null,
    agentTelemetryStats: data?.agentTelemetryStats ?? null,
    regions: data?.regions ?? [],
    isLoading,
    error,
    refetch: fetchAnalytics
  };
}
