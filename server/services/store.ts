/**
 * EcoVision AI — Centralized In-Memory Data Store
 * Single source of truth for all runtime state.
 * Swap this module out for a DB adapter (Prisma/SQLite) without touching routes.
 */

import { Sighting, CitizenReport } from '../../src/types.js';
import { INITIAL_SIGHTINGS, INITIAL_CITIZEN_REPORTS } from '../seedData.js';

// ─── Store State ─────────────────────────────────────────────────────────────

let sightingsStore: Sighting[] = [...INITIAL_SIGHTINGS];
let citizenReportsStore: CitizenReport[] = [...INITIAL_CITIZEN_REPORTS];

// ─── Sightings ───────────────────────────────────────────────────────────────

export function getAllSightings(): Sighting[] {
  return sightingsStore;
}

export function getSightingById(id: string): Sighting | undefined {
  return sightingsStore.find((s) => s.id === id);
}

export function addSighting(sighting: Sighting): void {
  sightingsStore.unshift(sighting);
}

export function addSightings(sightings: Sighting[]): void {
  const existingIds = new Set(sightingsStore.map((s) => s.id));
  const unique = sightings.filter((s) => !existingIds.has(s.id));
  sightingsStore = [...unique, ...sightingsStore];
}

export function updateSighting(id: string, patch: Partial<Sighting>): Sighting | null {
  const idx = sightingsStore.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  sightingsStore[idx] = { ...sightingsStore[idx], ...patch };
  return sightingsStore[idx];
}

// ─── Citizen Reports ─────────────────────────────────────────────────────────

export function getAllReports(): CitizenReport[] {
  return citizenReportsStore;
}

export function addReport(report: CitizenReport): void {
  citizenReportsStore.unshift(report);
}

// ─── Seed Reset ──────────────────────────────────────────────────────────────

export function resetToSeed(): void {
  sightingsStore = [...INITIAL_SIGHTINGS];
  citizenReportsStore = [...INITIAL_CITIZEN_REPORTS];
}
