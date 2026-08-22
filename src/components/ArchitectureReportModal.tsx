import React from 'react';
import { FileText, Cpu, CheckCircle2, HelpCircle, Layers, Sparkles, ShieldCheck } from 'lucide-react';

export const ArchitectureReportModal: React.FC = () => {
  const vivaQuestions = [
    {
      q: '1. How do you prevent wrong species identification from propagating into false ecological insights?',
      a: 'We implement multi-tier confidence thresholding and uncertainty propagation. Detections below 85% confidence are flagged as "Unverified Specimen" in the Context Agent prompt. The Pattern and Insight agents explicitly ingest the confidence score and adjust their urgency rating down to "Watch/Unverified", preventing false alarm escalation.'
    },
    {
      q: '2. Why use a multi-agent Directed Acyclic Graph (DAG) instead of a single big prompt?',
      a: 'A single prompt lacks isolation, leads to hallucination in multi-step reasoning, and inflates token cost. Using LangGraph/DAG architecture allows parallel execution (Context + RAG retrieval run simultaneously), deterministic schema enforcement (JSON outputs per node), isolated failure recovery, and precise per-agent cost/latency telemetry.'
    },
    {
      q: '3. How does the system handle real-time spatial queries for 100,000+ sightings?',
      a: 'We utilize PostGIS GIST spatial indexing with ST_DWithin bounding boxes. Sighting queries filter by geographic radius (e.g. 5km) and temporal window (30 days) at the database layer before feeding only relevant candidate records into the Context Agent, avoiding prompt context bloat.'
    },
    {
      q: '4. How is edge inference supported on mobile when network connection is unavailable?',
      a: 'We employ a dual-runtime strategy: quantized ONNX Runtime / TFLite models run locally on the client device for instant offline vision classification. Sighting metadata is queued in IndexedDB and synchronized to the server multi-agent pipeline automatically upon network reconnect.'
    },
    {
      q: '5. How do you monitor and manage production LLM API costs?',
      a: 'Every agent invocation logs exact input/output token counts and calculates costs using gemini-3.6-flash rates ($0.000075 / 1k input tokens, $0.0003 / 1k output tokens). Regional context summaries are cached to eliminate redundant API calls for adjacent sightings.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      {/* Header */}
      <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-serif-title text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            EcoVision AI — Architecture Specification & Viva / Interview Defense Guide
          </h2>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
            Phase 4 Spec
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Complete engineering report detailing problem statement, multi-agent pipeline architecture, and technical defense responses.
        </p>
      </div>

      {/* Problem Statement & Differentiator */}
      <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-emerald-400 font-serif-title flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          System Core Philosophy & The Differentiator
        </h3>

        <div className="text-xs text-slate-300 leading-relaxed space-y-3">
          <p>
            Standard species identifiers (iNaturalist, PlantNet, Merlin) are simple single-pass computer vision classifiers. They answer <em>"What is this?"</em> but stop there.
          </p>
          <p>
            <strong>EcoVision AI's core differentiator is the Reasoning Layer:</strong> a multi-agent system that interprets raw detections, cross-references historical spatial telemetry (PostGIS), searches ecological knowledge bases (IUCN, regional forest reports), and produces actionable intelligence—answering <em>"What does this sighting mean for ecosystem health?"</em>
          </p>
        </div>
      </div>

      {/* Mermaid Architecture Flow Diagram Code */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-3 font-mono text-xs">
        <div className="text-slate-400 font-sans font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          Mermaid Directed Acyclic Graph (DAG) Pipeline
        </div>
        <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-teal-300 overflow-x-auto text-[11px] leading-normal">
{`graph TD
  UserImage[Client Image Upload / Camera] --> PerceptionLayer[Phase 1: Gemini Vision Classifier]
  PerceptionLayer --> SightingStore[(PostgreSQL / PostGIS Database)]
  
  subgraph MultiAgent Reasoning Layer (Phase 2)
    SightingStore --> ContextAgent[1. Context & RAG Agent]
    ContextAgent --> PatternAgent[2. Pattern Analysis Agent]
    PatternAgent --> InsightAgent[3. Insight & Action Synthesis Agent]
  end

  InsightAgent --> EcologicalReport[Actionable Ecological Intelligence Report]
  InsightAgent --> TelemetryInspector[Agent Cost & Latency Log]`}
        </pre>
      </div>

      {/* 5 Hard Technical Viva / Interview Questions */}
      <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-amber-300 font-serif-title flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          Technical Interview & Viva Defense Questions
        </h3>

        <div className="space-y-4">
          {vivaQuestions.map((item, idx) => (
            <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-white leading-normal">
                {item.q}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                <strong className="text-emerald-400 block mb-1">Defense Answer:</strong>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
