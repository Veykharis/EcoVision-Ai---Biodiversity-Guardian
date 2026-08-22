/**
 * EcoVision AI - Core Data Types & Interfaces
 */

export type ConservationStatus = 'EX' | 'EW' | 'CR' | 'EN' | 'VU' | 'NT' | 'LC' | 'DD';

export type InvasiveSeverity = 'None' | 'Low' | 'Moderate' | 'High' | 'Severe';

export type UrgencyRating = 'Informational' | 'Watch' | 'Concern' | 'Urgent';

export type VerificationStatus = 'unverified' | 'verified_expert' | 'community_flagged';

export type ObserverRole = 'field_agent' | 'citizen' | 'researcher' | 'camera_trap';

export interface SpeciesTaxonomy {
  kingdom: string;
  phylum?: string;
  class: string;
  order: string;
  family: string;
  genus: string;
  species: string;
  commonName: string;
}

export interface HuggingFaceResult {
  modelName: string;
  predictedLabel: string;
  confidenceScore: number;
  imageCaption: string;
  executionTimeMs: number;
  status: 'success' | 'fallback';
}

export interface PerceptionResult {
  speciesName: string;
  scientificName: string;
  confidenceScore: number; // 0 to 1
  taxonomy: SpeciesTaxonomy;
  iucnStatus: ConservationStatus;
  iucnStatusLabel: string;
  isInvasive: boolean;
  invasiveSeverity: InvasiveSeverity;
  description: string;
  habitatType: string;
  nativeRegion: string;
  keyFeatures: string[];
  threatDetails?: string;
  imageQualityScore: number; // 0 to 100
  imageQualityNotes: string;
  huggingFaceResult?: HuggingFaceResult;
}

export interface NasaFireHotspot {
  id: string;
  lat: number;
  lng: number;
  brightness: number; // Kelvin
  frp: number; // Fire Radiative Power (MW)
  sensor: 'VIIRS_SNPP' | 'MODIS';
  acqDate: string;
  confidence: 'high' | 'nominal' | 'low';
  regionName: string;
}

export interface NasaSatelliteData {
  regionName: string;
  vegetationHealthIndex: number; // 0 to 100
  canopyDensityPct: number;
  activeHotspotsCount: number;
  fireRiskLevel: 'Low' | 'Moderate' | 'High' | 'Extreme';
  hotspots: NasaFireHotspot[];
  lastSatellitePass: string;
}

export interface AirQualityData {
  aqi: number; // 0 to 500
  category: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Hazardous';
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  no2?: number; // ppm
  stationName: string;
  fetchedAt: string;
}

export interface WeatherData {
  temperatureC: number;
  temperatureF: number;
  humidity: number;
  windSpeedKmh: number;
  weatherCondition: string;
  weatherCode: number;
  icon: string;
  uvIndex?: number;
  precipitationMm?: number;
  locationName?: string;
  lat: number;
  lng: number;
  fetchedAt: string;
  airQualityData?: AirQualityData;
}

export interface ContextAgentOutput {
  nearbySightingsCount: number;
  radiusKm: number;
  timeWindowDays: number;
  historicalMatchesCount: number;
  ragKnowledgeDocs: {
    title: string;
    source: string;
    snippet: string;
    relevanceScore: number;
  }[];
  regionalEcoSummary: string;
  weatherData?: WeatherData;
}

export interface PatternAgentOutput {
  populationTrend: 'Increasing' | 'Stable' | 'Decreasing' | 'Anomalous Spurt' | 'Uncertain';
  ecosystemPressureScore: number; // 0 to 10
  invasiveNativeInteraction: string;
  correlationFactors: string[];
  habitatFragmentationRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export interface InsightAgentOutput {
  title: string;
  summary: string;
  urgencyRating: UrgencyRating;
  ecologicalImpact: string;
  keyTakeaways: string[];
  recommendedActions: string[];
  ecologicalRiskScore: number; // 0 to 100
}

export interface AgentTelemetry {
  agentName: 'Context' | 'Pattern' | 'Insight' | 'Orchestrator';
  executionTimeMs: number;
  inputTokensEstimated: number;
  outputTokensEstimated: number;
  costUsdEstimated: number;
  status: 'success' | 'degraded' | 'failed';
  timestamp: string;
}

export interface ReasoningInsight {
  sightingId: string;
  generatedAt: string;
  context: ContextAgentOutput;
  pattern: PatternAgentOutput;
  insight: InsightAgentOutput;
  telemetry: AgentTelemetry[];
  totalPipelineTimeMs: number;
  totalCostUsd: number;
}

export interface Sighting {
  id: string;
  timestamp: string;
  locationName: string;
  region: string;
  lat: number;
  lng: number;
  imageUrl: string;
  speciesName: string;
  scientificName: string;
  confidenceScore: number;
  iucnStatus: ConservationStatus;
  isInvasive: boolean;
  invasiveSeverity: InvasiveSeverity;
  observerRole: ObserverRole;
  verifiedStatus: VerificationStatus;
  perceptionResult: PerceptionResult;
  reasoningInsight?: ReasoningInsight;
  notes?: string;
  weatherData?: WeatherData;
}

export interface CitizenReport {
  id: string;
  timestamp: string;
  title: string;
  category: 'illegal_dumping' | 'habitat_destruction' | 'poaching_hazard' | 'invasive_outbreak';
  description: string;
  locationName: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  status: 'pending' | 'reviewed' | 'dispatched' | 'resolved';
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface RegionalHealthScore {
  regionName: string;
  lat: number;
  lng: number;
  healthIndex: number; // 0-100
  speciesRichness: number;
  endangeredCount: number;
  invasiveCount: number;
  habitatThreatLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  recentTrend: 'improving' | 'stable' | 'declining';
  keyRiskFactors: string[];
  weatherData?: WeatherData;
}

export interface VoiceQueryResponse {
  queryText: string;
  intent: 'identification' | 'regional_summary' | 'invasive_alert' | 'general_qa';
  responseText: string;
  matchedSightings?: Sighting[];
  recommendedAction?: string;
}
