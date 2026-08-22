# EcoVision AI — Master Architecture & Project Report
### Perception + Multi-Agent Reasoning System for Biodiversity Intelligence

## 1. Problem Statement & Core Differentiator
Most species identification applications (iNaturalist, PlantNet, Merlin) operate solely as isolated computer vision classifiers. They answer **"What species is this?"** but fail to explain **"What does this sighting mean for ecosystem health?"**

**EcoVision AI's differentiator is the Reasoning Layer:**
A multi-agent directed graph (LangGraph DAG) that takes raw detections, retrieves spatial-temporal historical context (PostGIS), searches IUCN Red List knowledge bases (RAG), analyzes population trends, and produces actionable ecological intelligence reports with urgency ratings and intervention protocols.

---

## 2. System Architecture & Directed Acyclic Graph (DAG)

```mermaid
graph TD
  UserImage[Client Image Upload / Camera] --> PerceptionLayer[Phase 1: Gemini Vision Classifier]
  PerceptionLayer --> SightingStore[(PostgreSQL / PostGIS Database)]
  
  subgraph MultiAgent Reasoning Layer (Phase 2)
    SightingStore --> ContextAgent[1. Context & RAG Agent]
    ContextAgent --> PatternAgent[2. Pattern Analysis Agent]
    PatternAgent --> InsightAgent[3. Insight & Action Synthesis Agent]
  end

  InsightAgent --> EcologicalReport[Actionable Ecological Intelligence Report]
  InsightAgent --> TelemetryInspector[Agent Cost & Latency Log]
```

---

## 3. Multi-Agent System Breakdown

1. **Context Agent**:
   - Performs spatial-temporal lookup (sightings within 5km in last 30 days).
   - Retrieves relevant IUCN Red List guidelines and regional invasive impact studies via RAG.
2. **Pattern Agent**:
   - Analyzes population trends (Increasing, Decreasing, Anomalous Spurt).
   - Computes ecosystem pressure scores and evaluates invasive-native competition dynamics.
3. **Insight Agent**:
   - Synthesizes Context and Pattern outputs.
   - Assigns Urgency Rating (Informational, Watch, Concern, Urgent) and outputs concrete intervention steps.
4. **Orchestrator**:
   - Executes DAG pipeline, tracks per-agent latency and token costs, handles graceful partial degradation.

---

## 4. Technical Defense & Interview Q&A

### Q1: How do you prevent wrong species identification from propagating into false ecological insights?
**Answer:** Multi-tier confidence thresholding + confidence propagation. High-confidence detections (>90%) auto-pass. Low-confidence detections are flagged as "Unverified Specimen" in the Context Agent prompt. The Pattern and Insight agents explicitly ingest the confidence score and downgrade urgency ratings accordingly.

### Q2: Why use a multi-agent Directed Acyclic Graph (DAG) over a single large LLM prompt?
**Answer:** Separation of concerns, deterministic JSON output schemas, parallel execution (Context + RAG retrieval run simultaneously), isolated error handling, and precise per-agent token/cost telemetry.

### Q3: How does the system handle real-time geospatial queries for 100,000+ sightings?
**Answer:** PostGIS GIST spatial indexing (`ST_DWithin`) bounding box pre-filtering before passing candidate spatial neighbors into Context Agent prompts.

### Q4: How is edge inference supported on mobile when network is unavailable?
**Answer:** Dual-runtime strategy: ONNX Runtime / TFLite quantized models running locally on client for immediate vision classification; queuing sighting telemetry into an IndexedDB / local sync queue until network connectivity resumes.

### Q5: How do you monitor and manage production LLM costs?
**Answer:** Per-agent token logging ($0.000075 / 1k input tokens, $0.0003 / 1k output tokens), prompt compression, caching frequent regional Context summaries, and model routing (`gemini-3.6-flash` for high throughput).
