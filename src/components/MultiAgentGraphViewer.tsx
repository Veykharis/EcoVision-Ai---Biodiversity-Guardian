/**
 * EcoVision AI — Multi-Agent Graph Viewer
 * Animated DAG visualization with sequential node glow on mount
 */

import React, { useEffect, useState } from 'react';
import { ReasoningInsight } from '../types';
import {
  Sparkles,
  Database,
  TrendingUp,
  FileCheck2,
  Cpu,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Zap,
  GitBranch
} from 'lucide-react';

interface MultiAgentGraphViewerProps {
  insight: ReasoningInsight;
  isExecuting?: boolean;
}

// ─── Progress Ring ──────────────────────────────────────────────────────────
const RiskRing: React.FC<{ score: number }> = ({ score }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);
  const strokeColor = score >= 70 ? '#ef4444' : score >= 40 ? '#f59e0b' : '#10b981';

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (score / 100) * circumference);
    }, 500);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="#1e293b" strokeWidth="5" />
        <circle
          cx="36" cy="36" r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="progress-ring-circle"
          style={{ filter: `drop-shadow(0 0 6px ${strokeColor}80)` }}
        />
      </svg>
      <span className="text-sm font-bold font-mono" style={{ color: strokeColor }}>
        {score}
      </span>
    </div>
  );
};

// ─── Agent Node ─────────────────────────────────────────────────────────────
const AgentNode: React.FC<{
  number: number;
  title: string;
  icon: React.ElementType;
  latencyMs: number;
  accentColor: string;
  borderColor: string;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ number, title, icon: Icon, latencyMs, accentColor, borderColor, isActive, children }) => (
  <div
    className={`relative rounded-xl p-4 border flex flex-col space-y-3 transition-all duration-700 ${
      isActive
        ? `${borderColor} bg-slate-800/80 agent-node-active`
        : 'border-slate-800 bg-slate-800/40 opacity-50'
    }`}
  >
    {/* Node number badge */}
    <div
      className={`absolute -top-3 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-slate-900 transition-all duration-500 ${
        isActive ? `${accentColor} text-slate-900` : 'bg-slate-700 text-slate-400'
      }`}
    >
      {number}
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
        <Icon className={`w-4 h-4 ${isActive ? accentColor.replace('bg-', 'text-') : 'text-slate-500'}`} />
        <span>{title}</span>
      </div>
      {isActive && (
        <span className={`px-2 py-0.5 text-[10px] font-mono rounded border ${borderColor} ${accentColor.replace('bg-', 'text-').replace('500', '300')} bg-opacity-10`}>
          {latencyMs}ms
        </span>
      )}
    </div>
    {children}
  </div>
);

// ─── Arrow Connector ────────────────────────────────────────────────────────
const FlowArrow: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div className={`hidden md:flex items-center justify-center transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-20'}`}>
    <div className={`h-px flex-1 transition-all duration-700 ${isActive ? 'bg-gradient-to-r from-teal-500/60 to-teal-500/30' : 'bg-slate-700'}`} />
    <ArrowRight className={`w-4 h-4 mx-1 ${isActive ? 'text-teal-400' : 'text-slate-600'}`} />
    <div className={`h-px flex-1 transition-all duration-700 ${isActive ? 'bg-gradient-to-r from-teal-500/30 to-transparent' : 'bg-slate-700'}`} />
  </div>
);

export const MultiAgentGraphViewer: React.FC<MultiAgentGraphViewerProps> = ({
  insight,
  isExecuting = false
}) => {
  const { context, pattern, insight: synthesis, telemetry, totalPipelineTimeMs, totalCostUsd } = insight;

  // Sequential node activation for visual effect
  const [activeNodes, setActiveNodes] = useState<number[]>([]);

  useEffect(() => {
    setActiveNodes([]);
    const timers = [
      setTimeout(() => setActiveNodes([1]),       300),
      setTimeout(() => setActiveNodes([1, 2]),     900),
      setTimeout(() => setActiveNodes([1, 2, 3]), 1600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [insight.sightingId]);

  const contextTel = telemetry.find((t) => t.agentName === 'Context');
  const patternTel = telemetry.find((t) => t.agentName === 'Pattern');
  const insightTel = telemetry.find((t) => t.agentName === 'Insight');

  const urgencyColor =
    synthesis.urgencyRating === 'Urgent'  ? 'bg-rose-500 text-white' :
    synthesis.urgencyRating === 'Concern' ? 'bg-amber-500 text-slate-950' :
    synthesis.urgencyRating === 'Watch'   ? 'bg-blue-500 text-white' :
                                            'bg-emerald-500 text-slate-950';

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-700/80 p-6 space-y-6 shadow-2xl card-enter">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 agent-node-active">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-serif-title">
              LangGraph Multi-Agent DAG — Execution Complete
            </h3>
            <p className="text-xs text-slate-400">
              Parallel Context &amp; RAG Retrieval → Temporal Pattern Synthesis → Actionable Ecological Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs flex-wrap">
          <div className="bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Total Latency:</span>
            <span className="font-mono text-cyan-300 font-bold">{totalPipelineTimeMs}ms</span>
          </div>

          <div className="bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Est. API Cost:</span>
            <span className="font-mono text-emerald-400 font-bold">${totalCostUsd.toFixed(6)}</span>
          </div>

          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${urgencyColor}`}>
            {synthesis.urgencyRating} Urgency
          </span>
        </div>
      </div>

      {/* Visual Agent Graph */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-2 items-center">
        {/* Agent 1: Context Agent */}
        <AgentNode
          number={1}
          title="Context & RAG Agent"
          icon={Database}
          latencyMs={contextTel?.executionTimeMs ?? 120}
          accentColor="bg-cyan-400"
          borderColor="border-cyan-500/40"
          isActive={activeNodes.includes(1)}
        >
          <p className="text-xs text-slate-300 leading-normal line-clamp-3">{context.regionalEcoSummary}</p>
          <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 text-[11px] space-y-1">
            {context.weatherData && (
              <div className="text-slate-400 font-semibold flex items-center justify-between pb-1 border-b border-slate-800/80">
                <span>Climate Telemetry:</span>
                <span className="text-emerald-400 font-mono">
                  {context.weatherData.icon} {context.weatherData.temperatureC}°C · {context.weatherData.humidity}% humidity
                </span>
              </div>
            )}
            <div className="text-slate-400 font-semibold flex items-center justify-between">
              <span>Nearby Sightings (5km):</span>
              <span className="text-white">{context.nearbySightingsCount}</span>
            </div>
            <div className="text-slate-400 font-semibold flex items-center justify-between">
              <span>RAG Knowledge Docs:</span>
              <span className="text-cyan-400">{context.ragKnowledgeDocs.length} Articles</span>
            </div>
          </div>
        </AgentNode>

        <FlowArrow isActive={activeNodes.includes(2)} />

        {/* Agent 2: Pattern Agent */}
        <AgentNode
          number={2}
          title="Pattern & Dynamics Agent"
          icon={TrendingUp}
          latencyMs={patternTel?.executionTimeMs ?? 160}
          accentColor="bg-amber-400"
          borderColor="border-amber-500/40"
          isActive={activeNodes.includes(2)}
        >
          <div className="flex items-center justify-between text-xs bg-slate-900/90 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400">Population Trend:</span>
            <span className="font-semibold text-amber-300">{pattern.populationTrend}</span>
          </div>
          <p className="text-xs text-slate-300 leading-normal line-clamp-2">{pattern.invasiveNativeInteraction}</p>
          <div className="text-[11px] text-slate-400 space-y-1">
            <span className="font-medium text-slate-300">Correlation Drivers:</span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400">
              {pattern.correlationFactors.slice(0, 2).map((factor, idx) => (
                <li key={idx}>{factor}</li>
              ))}
            </ul>
          </div>
        </AgentNode>

        <FlowArrow isActive={activeNodes.includes(3)} />

        {/* Agent 3: Insight Agent */}
        <AgentNode
          number={3}
          title="Insight & Action Agent"
          icon={FileCheck2}
          latencyMs={insightTel?.executionTimeMs ?? 210}
          accentColor="bg-teal-400"
          borderColor="border-teal-500/50"
          isActive={activeNodes.includes(3)}
        >
          <p className="text-xs font-bold text-white font-serif-title">{synthesis.title}</p>
          <p className="text-xs text-slate-300 leading-normal line-clamp-3">{synthesis.summary}</p>
          <div className="flex items-center justify-between pt-1 border-t border-slate-700/60">
            <span className="text-[11px] text-slate-400">Ecological Risk Index:</span>
            <RiskRing score={synthesis.ecologicalRiskScore} />
          </div>
        </AgentNode>
      </div>

      {/* Synthesized Ecological Intelligence Report */}
      <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2 font-serif-title">
            <Sparkles className="w-4 h-4" />
            Synthesized Field Recommendations &amp; Key Takeaways
          </h4>
          <span className="text-[11px] text-slate-400">
            Generated at {new Date(insight.generatedAt).toLocaleTimeString()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs stagger-children">
          {/* Key Takeaways */}
          <div className="space-y-2">
            <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">
              Key Ecological Observations
            </h5>
            <ul className="space-y-2">
              {synthesis.keyTakeaways.map((takeaway, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 card-enter"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Interventions */}
          <div className="space-y-2">
            <h5 className="font-bold text-amber-300 uppercase tracking-wider text-[10px]">
              Recommended Ecological Interventions
            </h5>
            <ul className="space-y-2">
              {synthesis.recommendedActions.map((action, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 card-enter"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
