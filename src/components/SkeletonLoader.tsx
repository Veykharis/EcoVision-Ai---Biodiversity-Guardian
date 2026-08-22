/**
 * EcoVision AI — Skeleton Loader Components
 * Dark shimmer skeleton placeholders for data-loading states
 */

import React from 'react';

const Shimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative overflow-hidden rounded-lg bg-slate-800 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-700/40 to-transparent" />
  </div>
);

export const KPICardSkeleton: React.FC = () => (
  <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-lg space-y-3">
    <Shimmer className="h-3 w-24" />
    <Shimmer className="h-8 w-32" />
    <Shimmer className="h-2.5 w-40" />
  </div>
);

export const SightingCardSkeleton: React.FC = () => (
  <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-3">
    <div className="flex items-start gap-3">
      <Shimmer className="w-12 h-12 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-4 w-3/4" />
        <Shimmer className="h-3 w-1/2" />
      </div>
    </div>
    <Shimmer className="h-3 w-full" />
    <Shimmer className="h-3 w-2/3" />
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700 shadow-xl space-y-4">
    <Shimmer className="h-4 w-48" />
    <div className="h-64 flex items-end justify-around gap-2 pt-4">
      {[65, 80, 45, 90, 55, 70, 85, 40, 75, 60].map((h, i) => (
        <Shimmer key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%` } as React.CSSProperties} />
      ))}
    </div>
  </div>
);

export const MapPanelSkeleton: React.FC = () => (
  <div className="bg-slate-800/90 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
    <div className="p-3 border-b border-slate-700/60 flex gap-2">
      <Shimmer className="h-5 w-32" />
      <Shimmer className="h-5 w-20" />
    </div>
    <Shimmer className="w-full h-[500px] rounded-none" />
  </div>
);

export const PageLoader: React.FC<{ label?: string }> = ({ label = 'Initializing...' }) => (
  <div className="flex flex-col items-center justify-center py-24 space-y-4 text-slate-400">
    <div className="relative w-14 h-14">
      <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
      <div className="absolute inset-0 rounded-full border-2 border-t-emerald-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      <div className="absolute inset-2 rounded-full border border-teal-500/30 animate-ping" />
    </div>
    <p className="text-xs font-mono animate-pulse">{label}</p>
  </div>
);
