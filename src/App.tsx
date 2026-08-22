/**
 * EcoVision AI — Application Root v2.0
 *
 * This component is now a lean layout shell.
 * All state & actions live in AppContext (src/context/AppContext.tsx).
 * All feature components are imported from src/features/ or src/components/.
 */

import React from 'react';
import { Header } from './components/Header';
import { MapView } from './components/MapView';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { MobileFieldApp } from './components/MobileFieldApp';
import { ResearchAnalytics } from './components/ResearchAnalytics';
import { CitizenReportQueue } from './components/CitizenReportQueue';
import { SystemTelemetryInspector } from './components/SystemTelemetryInspector';
import { ArchitectureReportModal } from './components/ArchitectureReportModal';
import { ToastProvider } from './components/Toast';
import { PageLoader } from './components/SkeletonLoader';
import { AlertTriangle, X, Zap, Volume2 } from 'lucide-react';
import { speakAudioDispatch } from './utils/audioDispatch';
import { AppProvider, useAppContext } from './context/AppContext';
import { Sighting } from './types';

// ─── Urgency Alert Strip ──────────────────────────────────────────────────────
const UrgencyAlertStrip: React.FC = () => {
  const { sightings, showUrgencyBanner, setShowUrgencyBanner } = useAppContext();
  const urgentSightings = sightings.filter(
    (s) => s.reasoningInsight?.insight.urgencyRating === 'Urgent'
  );

  if (!showUrgencyBanner || urgentSightings.length === 0) return null;

  const latest = urgentSightings[0];
  const alertText = `Urgent Ecological Alert for ${latest.speciesName}. ${latest.reasoningInsight?.insight.title}. Recommended intervention: ${latest.reasoningInsight?.insight.recommendedActions[0] || 'Dispatch forest patrol.'}`;

  return (
    <div className="bg-gradient-to-r from-rose-950/80 via-rose-900/60 to-rose-950/80 border-y border-rose-500/40 px-4 py-2.5 flex items-center justify-between gap-4 backdrop-blur-sm">
      <div className="flex items-center gap-3 text-xs">
        <span className="urgency-badge-pulse flex items-center gap-1.5 bg-rose-500 text-white px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider shrink-0">
          <Zap className="w-3 h-3" />
          URGENT
        </span>
        <span className="text-rose-200 font-semibold">{latest.speciesName}</span>
        <span className="text-rose-400 hidden sm:inline">—</span>
        <span className="text-rose-300/80 hidden sm:inline line-clamp-1">
          {latest.reasoningInsight?.insight.title}
        </span>
        {urgentSightings.length > 1 && (
          <span className="text-rose-400/70 hidden md:inline">
            +{urgentSightings.length - 1} more urgent alerts
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => speakAudioDispatch(alertText, true)}
          title="Announce Urgent Voice Dispatch"
          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition text-[11px] font-bold flex items-center gap-1.5"
        >
          <Volume2 className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">Voice Dispatch</span>
        </button>
        <button
          onClick={() => setShowUrgencyBanner(false)}
          className="text-rose-400/70 hover:text-rose-300 transition shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── Main View Router ─────────────────────────────────────────────────────────
const MainView: React.FC = () => {
  const {
    activeTab,
    sightings,
    reports,
    regions,
    isLoading,
    isAnalyzing,
    handleSelectSighting,
    handleRunReasoningForSighting,
    handleIdentifyComplete,
    handleReasoningComplete,
    handleNewFieldSighting,
    handleAddReport
  } = useAppContext();

  if (isLoading) {
    return <PageLoader label="Initializing EcoVision AI Telemetry & Map Layer..." />;
  }

  return (
    <>
      {activeTab === 'map' && (
        <MapView
          sightings={sightings}
          reports={reports}
          onSelectSighting={handleSelectSighting}
          onRunReasoning={handleRunReasoningForSighting}
          isAnalyzing={isAnalyzing}
        />
      )}
      {activeTab === 'analyze' && (
        <ImageAnalyzer
          sightings={sightings}
          onIdentifyComplete={handleIdentifyComplete}
          onReasoningComplete={handleReasoningComplete}
        />
      )}
      {activeTab === 'mobile' && (
        <MobileFieldApp sightings={sightings} onNewFieldSighting={handleNewFieldSighting} />
      )}
      {activeTab === 'analytics' && (
        <ResearchAnalytics sightings={sightings} regions={regions} />
      )}
      {activeTab === 'reports' && (
        <CitizenReportQueue reports={reports} onAddReport={handleAddReport} />
      )}
      {activeTab === 'telemetry' && <SystemTelemetryInspector sightings={sightings} />}
      {activeTab === 'report_doc' && <ArchitectureReportModal />}
    </>
  );
};

// ─── App Shell ────────────────────────────────────────────────────────────────
function AppShell() {
  const {
    activeTab,
    setActiveTab,
    sightings,
    invasiveCount,
    endangeredCount,
    pendingReportsCount,
    avgLatencyMs,
    urgentCount,
    handleResetSeed,
    isResetting,
    handleSyncGBIF,
    isSyncingGBIF
  } = useAppContext();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sightingsCount={sightings.length}
        invasiveCount={invasiveCount}
        endangeredCount={endangeredCount}
        pendingReportsCount={pendingReportsCount}
        avgLatencyMs={avgLatencyMs}
        urgentCount={urgentCount}
        onResetSeed={handleResetSeed}
        isResetting={isResetting}
        onSyncGBIF={handleSyncGBIF}
        isSyncingGBIF={isSyncingGBIF}
      />

      <UrgencyAlertStrip />

      <main className="flex-1 py-4">
        <MainView />
      </main>

      <footer className="bg-slate-950 border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>EcoVision AI — Perception + Multi-Agent Biodiversity Intelligence</span>
          <span>Powered by @google/genai & LangGraph DAG Orchestrator</span>
        </div>
      </footer>
    </div>
  );
}

// ─── Root Export — Providers wrap the shell ───────────────────────────────────
export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </ToastProvider>
  );
}
