/**
 * EcoVision AI — useSightings Hook
 * Encapsulates sighting fetch + refetch logic.
 * Components that only need sightings data use this instead of the full AppContext.
 */

import { useState, useEffect, useCallback } from 'react';
import { Sighting } from '../types';

interface UseSightingsOptions {
  search?: string;
  region?: string;
  isInvasive?: boolean;
  iucnStatus?: string;
  autoFetch?: boolean;
}

export function useSightings(options: UseSightingsOptions = {}) {
  const { search, region, isInvasive, iucnStatus, autoFetch = true } = options;

  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSightings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (region) params.set('region', region);
      if (isInvasive !== undefined) params.set('isInvasive', String(isInvasive));
      if (iucnStatus) params.set('iucnStatus', iucnStatus);

      const url = `/api/v1/sightings${params.toString() ? `?${params}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setSightings(data.sightings ?? []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sightings');
    } finally {
      setIsLoading(false);
    }
  }, [search, region, isInvasive, iucnStatus]);

  useEffect(() => {
    if (autoFetch) {
      fetchSightings();
    }
  }, [fetchSightings, autoFetch]);

  const addSighting = useCallback((sighting: Sighting) => {
    setSightings((prev) => [sighting, ...prev]);
  }, []);

  const updateSighting = useCallback((updated: Sighting) => {
    setSightings((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }, []);

  return { sightings, setSightings, isLoading, error, refetch: fetchSightings, addSighting, updateSighting };
}
