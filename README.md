<div align="center">

# 🌿 EcoVision AI — Biodiversity Guardian

**Perception + Multi-Agent Reasoning System for Ecological Intelligence**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Gemini](https://img.shields.io/badge/Gemini-3.6_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev)

*Identify invasive species, assess ecological threats, and generate actionable conservation insights — powered by a multi-agent AI pipeline.*

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔬 **AI Species Identification** | Upload a field photo → Gemini Vision + HuggingFace ensemble identifies species, IUCN status, and invasive risk |
| 🤖 **Multi-Agent Reasoning Pipeline** | Context Agent → Pattern Agent → Insight Agent DAG generates ecological intelligence reports |
| 🗺️ **Live Biodiversity Map** | Interactive Leaflet map with real-time sightings, NASA fire hotspots, and regional health overlays |
| 🌐 **GBIF Live Sync** | Pulls verified species occurrences from the Global Biodiversity Information Facility (2.5B+ records) |
| 🛰️ **NASA Satellite Data** | FIRMS fire detection and vegetation health via NASA Earthdata |
| 🌦️ **Real-time Weather** | Open-Meteo climate telemetry fused into every sighting and agent analysis |
| 📢 **Voice Dispatch** | ElevenLabs TTS announces urgent ecological alerts in the field |
| 📱 **Mobile Field App** | Camera capture + GPS tagging for on-the-ground observers |
| 📊 **Research Analytics** | Ecosystem health trends, species richness charts, and agent telemetry dashboards |
| 🚨 **Citizen Reports** | Community-driven incident reporting (poaching, habitat destruction, invasive outbreaks) |

---

## 🏗️ Architecture

This project uses a **modular, layered architecture** (v2.0 — fully refactored):

```
ecovision-ai/
├── server.ts                  ← Lean entry point (~50 lines)
│
├── server/
│   ├── routes/                ← One file per domain
│   │   ├── health.ts          ← GET /api/v1/health
│   │   ├── sightings.ts       ← GET /sightings, GET /sightings/:id
│   │   ├── analyze.ts         ← POST /analyze/:id (multi-agent DAG)
│   │   ├── citizenReports.ts  ← GET|POST /citizen-reports
│   │   ├── analytics.ts       ← GET /analytics
│   │   └── external.ts        ← weather, NASA, GBIF, iNaturalist, TTS, voice
│   │
│   ├── services/              ← Business logic layer
│   │   ├── store.ts           ← Centralized in-memory state (DB-ready interface)
│   │   └── perception.ts      ← Gemini + HuggingFace + Weather pipeline
│   │
│   └── [clients]              ← External API integrations
│       ├── gemini.ts          ← Perception + Multi-Agent pipeline + Voice
│       ├── gbif.ts            ← GBIF occurrence API
│       ├── nasa.ts            ← NASA Earthdata / FIRMS
│       ├── weather.ts         ← Open-Meteo real-time weather
│       ├── inaturalist.ts     ← iNaturalist community photos
│       ├── elevenlabs.ts      ← Voice synthesis (streaming)
│       └── huggingface.ts     ← Image classification
│
└── src/
    ├── context/
    │   └── AppContext.tsx      ← Global state + all actions (no prop drilling)
    ├── hooks/
    │   ├── useSightings.ts    ← Sightings fetch + filter hook
    │   └── useAnalytics.ts    ← Ecosystem stats hook
    ├── components/            ← 13 UI components
    ├── types.ts               ← Shared TypeScript types
    └── App.tsx                ← Lean layout shell
```

### Multi-Agent Pipeline

```
Image Upload
     │
     ▼
┌─────────────────┐     ┌──────────────────┐
│ Gemini Vision   │  +  │  HuggingFace CV  │  ← Perception Layer (parallel)
│ Species ID      │     │  Image Classify   │
└────────┬────────┘     └──────────────────┘
         │
         ▼
   [Sighting Created]
         │
         ▼
┌─────────────────┐
│ Context Agent   │  ← RAG + nearby sightings + real-time weather
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Pattern Agent   │  ← Population trends + ecosystem pressure scoring
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Insight Agent   │  ← Actionable report + urgency rating + interventions
└────────┬────────┘
         │
         ▼
  Ecological Intelligence Report
```

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- A [Gemini API key](https://aistudio.google.com/app/apikey)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# → Add your GEMINI_API_KEY to .env

# 3. Start development server
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🔑 Environment Variables

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
APP_URL=http://localhost:3000
ELEVENLABS_API_KEY=your_elevenlabs_key   # For voice dispatch
```

> ⚠️ Never commit `.env` — it's in `.gitignore`

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/health` | System health + active sighting count |
| `GET` | `/api/v1/sightings` | List sightings (filterable by search, region, IUCN status, invasive flag) |
| `GET` | `/api/v1/sightings/:id` | Single sighting detail |
| `POST` | `/api/v1/identify` | Analyze image → create sighting (Gemini + HuggingFace) |
| `POST` | `/api/v1/analyze/:id` | Run multi-agent reasoning pipeline for a sighting |
| `GET` | `/api/v1/analytics` | Ecosystem health summary + agent telemetry stats |
| `GET` | `/api/v1/citizen-reports` | List citizen incident reports |
| `POST` | `/api/v1/citizen-reports` | Submit a new incident report |
| `GET` | `/api/v1/weather` | Real-time weather for lat/lng |
| `GET` | `/api/v1/nasa/earthdata` | NASA satellite + fire hotspot data |
| `POST` | `/api/v1/gbif/sync` | Sync live species occurrences from GBIF |
| `GET` | `/api/v1/inaturalist/photos` | Community photos for a species |
| `POST` | `/api/v1/tts/speak` | Voice synthesis (ElevenLabs streaming) |
| `POST` | `/api/v1/voice-query` | Natural language field companion query |
| `POST` | `/api/v1/seed/reset` | Reset in-memory store to demo seeds |

---

## 🛠️ Tech Stack

**Frontend:** React 19 · TypeScript · Vite · Leaflet · Recharts · Lucide · Motion

**Backend:** Express · tsx · Node.js

**AI / APIs:**
- [Google Gemini 3.6 Flash](https://ai.google.dev) — Vision + Reasoning + Voice
- [HuggingFace](https://huggingface.co) — Image classification ensemble
- [GBIF](https://www.gbif.org) — 2.5B+ species occurrence records
- [iNaturalist](https://www.inaturalist.org) — Community observation photos
- [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov) — Active fire detection
- [Open-Meteo](https://open-meteo.com) — Free real-time weather
- [ElevenLabs](https://elevenlabs.io) — Voice synthesis

---

## 📄 License

MIT © EcoVision AI
