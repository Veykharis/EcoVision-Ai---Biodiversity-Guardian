/**
 * EcoVision AI — Perception Service
 * Orchestrates image analysis: Gemini Vision + HuggingFace ensemble.
 * Extracted from the route handler so it's testable and reusable.
 */

import { Sighting, PerceptionResult } from '../../src/types.js';
import { analyzeSpeciesImage } from '../gemini.js';
import { analyzeImageWithHuggingFace } from '../huggingface.js';
import { fetchRealtimeWeather } from '../weather.js';

export interface PerceptionInput {
  image: string;
  lat: number;
  lng: number;
  locationName: string;
  observerRole?: string;
}

export interface PerceptionOutput {
  sighting: Sighting;
  perception: PerceptionResult;
}

export async function runPerceptionPipeline(input: PerceptionInput): Promise<PerceptionOutput> {
  const { image, lat, lng, locationName, observerRole } = input;

  // Run Gemini Vision + Weather + HuggingFace in parallel
  const [perceptionResult, weatherData, huggingFaceResult] = await Promise.all([
    analyzeSpeciesImage(image, locationName),
    fetchRealtimeWeather(lat, lng, locationName),
    analyzeImageWithHuggingFace(image)
  ]);

  perceptionResult.huggingFaceResult = huggingFaceResult;

  const sighting: Sighting = {
    id: `sighting-${Date.now()}`,
    timestamp: new Date().toISOString(),
    locationName: locationName || 'Field Observation Site',
    region: 'Telangana & Hyderabad Forest Reserve',
    lat,
    lng,
    imageUrl:
      image.startsWith('http') || image.startsWith('data:')
        ? image
        : `data:image/jpeg;base64,${image}`,
    speciesName: perceptionResult.speciesName,
    scientificName: perceptionResult.scientificName,
    confidenceScore: perceptionResult.confidenceScore,
    iucnStatus: perceptionResult.iucnStatus,
    isInvasive: perceptionResult.isInvasive,
    invasiveSeverity: perceptionResult.invasiveSeverity,
    observerRole: (observerRole as Sighting['observerRole']) || 'field_agent',
    verifiedStatus: perceptionResult.confidenceScore > 0.9 ? 'verified_expert' : 'unverified',
    perceptionResult,
    weatherData
  };

  return { sighting, perception: perceptionResult };
}
