/**
 * EcoVision AI — Global Application Context
 *
 * Centralizes all shared state that was previously scattered across App.tsx.
 * Components consume this via `useAppContext()` — no more prop drilling.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Sighting, CitizenReport, RegionalHealthScore } from '../types';
import { useToast } from '../components/Toast';

// ─── Context Shape ────────────────────────────────────────────────────────────

export type ActiveTab =
  | 'map'
  | 'analyze'
  | 'mobile'
  | 'analytics'
  | 'reports'
  | 'telemetry'
  | 'report_doc';

interface AppContextValue {
  // State
  activeTab: ActiveTab;
  sightings: Sighting[];
  reports: CitizenReport[];
  regions: RegionalHealthScore[];
  isLoading: boolean;
  isResetting: boolean;
  isSyncingGBIF: boolean;
  isAnalyzing: boolean;
  showUrgencyBanner: boolean;

  // Derived stats
  invasiveCount: number;
  endangeredCount: number;
  pendingReportsCount: number;
  urgentCount: number;
  avgLatencyMs: number;

  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  setShowUrgencyBanner: (show: boolean) => void;
  fetchData: () => Promise<void>;
  handleSyncGBIF: () => Promise<void>;
  handleResetSeed: () => Promise<void>;
  handleRunReasoningForSighting: (sighting: Sighting) => Promise<void>;
  handleIdentifyComplete: (sighting: Sighting) => void;
  handleReasoningComplete: (sighting: Sighting) => void;
  handleNewFieldSighting: (sighting: Sighting) => void;
  handleAddReport: (report: CitizenReport) => void;
  handleSelectSighting: (sighting: Sighting) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [regions, setRegions] = useState<RegionalHealthScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [isSyncingGBIF, setIsSyncingGBIF] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showUrgencyBanner, setShowUrgencyBanner] = useState(true);

  // ─── Derived Stats ──────────────────────────────────────────────────────────
  const invasiveCount = sightings.filter((s) => s.isInvasive).length;
  const endangeredCount = sightings.filter((s) => ['CR', 'EN', 'VU'].includes(s.iucnStatus)).length;
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;
  const urgentCount = sightings.filter(
    (s) => s.reasoningInsight?.insight.urgencyRating === 'Urgent'
  ).length;
  const analyzed = sightings.filter((s) => s.reasoningInsight);
  const avgLatencyMs =
    analyzed.length > 0
      ? Math.round(
          analyzed.reduce((acc, s) => acc + (s.reasoningInsight?.totalPipelineTimeMs || 0), 0) /
            analyzed.length
        )
      : 520;

  // ─── Data Fetching ──────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sightingsRes, reportsRes, analyticsRes] = await Promise.all([
        fetch('/api/v1/sightings'),
        fetch('/api/v1/citizen-reports'),
        fetch('/api/v1/analytics')
      ]);

      const sightingsData = await sightingsRes.json();
      const reportsData = await reportsRes.json();
      const analyticsData = await analyticsRes.json();

      if (sightingsData.sightings) setSightings(sightingsData.sightings);
      if (reportsData.reports) setReports(reportsData.reports);
      if (analyticsData.regions) setRegions(analyticsData.regions);
    } catch (err) {
      console.error('Error fetching initial data:', err);
      addToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Could not reach the EcoVision backend. Check that the server is running.',
        duration: 6000
      });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── GBIF Sync ──────────────────────────────────────────────────────────────
  const handleSyncGBIF = useCallback(async () => {
    setIsSyncingGBIF(true);
    addToast({
      type: 'info',
      title: 'Connecting to GBIF 2.5B+ Network...',
      message: 'Pulling real species occurrences, photos & GPS for India...'
    });
    try {
      const res = await fetch('/api/v1/gbif/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'India', limit: 8 })
      });
      const data = await res.json();
      if (data.success && data.sightings) {
        setSightings((prev) => {
          const existingIds = new Set(prev.map((s) => s.id));
          const newUnique = data.sightings.filter((s: Sighting) => !existingIds.has(s.id));
          return [...newUnique, ...prev];
        });
        addToast({
          type: 'success',
          title: 'GBIF Live Network Synced',
          message: `Imported ${data.count} real research observations with live GPS and photos.`
        });
      }
    } catch (err) {
      console.error('Error syncing GBIF:', err);
      addToast({ type: 'error', title: 'GBIF Sync Failed', message: 'Could not reach GBIF servers.' });
    } finally {
      setIsSyncingGBIF(false);
    }
  }, [addToast]);

  // ─── Seed Reset ─────────────────────────────────────────────────────────────
  const handleResetSeed = useCallback(async () => {
    setIsResetting(true);
    try {
      await fetch('/api/v1/seed/reset', { method: 'POST' });
      await fetchData();
      addToast({ type: 'success', title: 'Data Reset', message: 'Demo seed data restored successfully.' });
    } catch (err) {
      console.error('Error resetting seed:', err);
      addToast({ type: 'error', title: 'Reset Failed', message: 'Could not reset demo seed data.' });
    } finally {
      setIsResetting(false);
    }
  }, [fetchData, addToast]);

  // ─── Multi-Agent Reasoning ──────────────────────────────────────────────────
  const handleRunReasoningForSighting = useCallback(
    async (sighting: Sighting) => {
      setIsAnalyzing(true);
      addToast({
        type: 'info',
        title: 'Multi-Agent Pipeline Starting',
        message: `Running Context → Pattern → Insight DAG for ${sighting.speciesName}...`,
        duration: 8000
      });
      try {
        const res = await fetch(`/api/v1/analyze/${sighting.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (data.success && data.reasoningInsight) {
          setSightings((prev) =>
            prev.map((s) =>
              s.id === sighting.id ? { ...s, reasoningInsight: data.reasoningInsight } : s
            )
          );
          const urgency = data.reasoningInsight.insight?.urgencyRating;
          addToast({
            type: urgency === 'Urgent' || urgency === 'Concern' ? 'warning' : 'success',
            title: 'Ecological Report Ready',
            message: `${data.reasoningInsight.insight?.title} (${urgency} Urgency)`
          });
        }
      } catch (err) {
        console.error('Error running reasoning:', err);
        addToast({
          type: 'error',
          title: 'Reasoning Pipeline Failed',
          message: 'Multi-agent DAG encountered an error. Check your GEMINI_API_KEY.'
        });
      } finally {
        setIsAnalyzing(false);
      }
    },
    [addToast]
  );

  // ─── Simple Handlers ────────────────────────────────────────────────────────
  const handleIdentifyComplete = useCallback(
    (newSighting: Sighting) => {
      setSightings((prev) => [newSighting, ...prev]);
      addToast({
        type: 'success',
        title: 'Species Identified',
        message: `${newSighting.speciesName} — ${Math.round(newSighting.confidenceScore * 100)}% confidence`
      });
    },
    [addToast]
  );

  const handleReasoningComplete = useCallback((updatedSighting: Sighting) => {
    setSightings((prev) => prev.map((s) => (s.id === updatedSighting.id ? updatedSighting : s)));
  }, []);

  const handleNewFieldSighting = useCallback(
    (sighting: Sighting) => {
      setSightings((prev) => [sighting, ...prev]);
      addToast({
        type: 'success',
        title: 'Field Sighting Logged',
        message: `${sighting.speciesName} captured at ${sighting.locationName}`
      });
    },
    [addToast]
  );

  const handleAddReport = useCallback(
    (report: CitizenReport) => {
      setReports((prev) => [report, ...prev]);
      addToast({
        type: 'warning',
        title: 'Report Submitted',
        message: `Incident "${report.title}" dispatched to Forest Officers.`
      });
    },
    [addToast]
  );

  const handleSelectSighting = useCallback(
    (_sighting: Sighting) => {
      if (activeTab !== 'map') setActiveTab('map');
    },
    [activeTab]
  );

  // ─── Context Value ───────────────────────────────────────────────────────────
  const value: AppContextValue = {
    activeTab,
    sightings,
    reports,
    regions,
    isLoading,
    isResetting,
    isSyncingGBIF,
    isAnalyzing,
    showUrgencyBanner,
    invasiveCount,
    endangeredCount,
    pendingReportsCount,
    urgentCount,
    avgLatencyMs,
    setActiveTab,
    setShowUrgencyBanner,
    fetchData,
    handleSyncGBIF,
    handleResetSeed,
    handleRunReasoningForSighting,
    handleIdentifyComplete,
    handleReasoningComplete,
    handleNewFieldSighting,
    handleAddReport,
    handleSelectSighting
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
