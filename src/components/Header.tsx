import React, { useEffect, useRef, useState } from 'react';
import { 
  Compass, 
  Scan, 
  Smartphone, 
  BarChart3, 
  AlertTriangle, 
  Cpu, 
  FileText, 
  Leaf, 
  ShieldAlert, 
  Activity,
  RefreshCw,
  Zap,
  Volume2,
  VolumeX
} from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';
import { isVoiceEnabled, setVoiceEnabled } from '../utils/audioDispatch';

export type ActiveTab = 'map' | 'analyze' | 'mobile' | 'analytics' | 'reports' | 'telemetry' | 'report_doc';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  sightingsCount: number;
  invasiveCount: number;
  endangeredCount: number;
  pendingReportsCount: number;
  avgLatencyMs: number;
  urgentCount?: number;
  onResetSeed: () => void;
  isResetting: boolean;
  onSyncGBIF?: () => void;
  isSyncingGBIF?: boolean;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

// ─── Animated Count-up Number ──────────────────────────────────────────────
const AnimatedCount: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const prevRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    const duration = 600;
    const startTime = performance.now();

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        prevRef.current = end;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value]);

  return <span className={className}>{displayValue}</span>;
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  sightingsCount,
  invasiveCount,
  endangeredCount,
  pendingReportsCount,
  avgLatencyMs,
  urgentCount = 0,
  onResetSeed,
  isResetting,
  onSyncGBIF,
  isSyncingGBIF
}) => {
  const [voiceActive, setVoiceActive] = useState<boolean>(isVoiceEnabled());

  const handleVoiceToggle = () => {
    const nextState = !voiceActive;
    setVoiceActive(nextState);
    setVoiceEnabled(nextState);
  };

  const navItems: NavItem[] = [
    { id: 'map',        label: 'Biodiversity Map',       icon: Compass },
    { id: 'analyze',    label: 'Perception & Reasoning', icon: Scan },
    { id: 'mobile',     label: 'Mobile Field Companion', icon: Smartphone },
    { id: 'analytics',  label: 'Ecosystem Analytics',    icon: BarChart3 },
    { id: 'reports',    label: 'Citizen Reports',        icon: AlertTriangle, badge: pendingReportsCount },
    { id: 'telemetry',  label: 'Agent Telemetry',        icon: Cpu },
    { id: 'report_doc', label: 'Project Specs & Defense', icon: FileText }
  ];

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            {/* Pulsing ring if urgent */}
            {urgentCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-slate-900 urgency-badge-pulse flex items-center justify-center">
                <Zap className="w-2.5 h-2.5 text-white" />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-white font-serif-title">
                EcoVision <span className="text-emerald-400 font-sans">AI</span>{' '}
                <span className="text-slate-400 font-normal text-sm font-sans">— Biodiversity Guardian</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                Multi-Agent System
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Perception & Reasoning Engine for Ecological Risk Assessment
            </p>
          </div>
        </div>

        {/* Telemetry Bar Stats + Live Climate Weather */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          {/* Live Real-Time Weather Widget */}
          <WeatherWidget compact={true} />

          <div className="bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700/60 flex items-center gap-2 shadow-sm">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Sightings:</span>
            <AnimatedCount value={sightingsCount} className="font-bold text-white font-mono" />
          </div>

          <div className="bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700/60 flex items-center gap-2 shadow-sm">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Invasive:</span>
            <AnimatedCount value={invasiveCount} className="font-bold text-amber-400 font-mono" />
          </div>

          <div className="bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700/60 flex items-center gap-2 shadow-sm">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-slate-400">Endangered:</span>
            <AnimatedCount value={endangeredCount} className="font-bold text-rose-400 font-mono" />
          </div>

          {urgentCount > 0 && (
            <div className="bg-rose-500/15 px-3 py-1.5 rounded-xl border border-rose-500/40 flex items-center gap-2 urgency-badge-pulse shadow-sm">
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-rose-300 font-bold">{urgentCount} URGENT</span>
            </div>
          )}

          <div className="bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700/60 flex items-center gap-2 hidden lg:flex shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Latency:</span>
            <span className="font-mono text-cyan-300 font-bold">{avgLatencyMs > 0 ? `${avgLatencyMs}ms` : '520ms'}</span>
          </div>

          {onSyncGBIF && (
            <button
              onClick={onSyncGBIF}
              disabled={isSyncingGBIF}
              title="Query GBIF 2.5B+ database for live real-world observations"
              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition flex items-center gap-1.5 font-bold text-[11px] shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGBIF ? 'animate-spin text-emerald-400' : 'text-emerald-400'}`} />
              <span className="hidden sm:inline">Sync Live GBIF</span>
            </button>
          )}

          <button
            onClick={onResetSeed}
            disabled={isResetting}
            title="Reset to sample demo sightings data"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline text-[11px]">Reset Data</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap relative ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
