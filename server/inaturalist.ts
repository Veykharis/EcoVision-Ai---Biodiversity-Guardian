/**
 * EcoVision AI — iNaturalist API Integration Service
 * Fetches research-grade wildlife photos, observer credits, and verified counts
 * No API key required for public research endpoints
 */

export interface INaturalistPhoto {
  id: number;
  url: string;
  mediumUrl: string;
  attribution: string;
  observer: string;
  observedOn: string;
  locationName: string;
  qualityGrade: string;
}

export interface INaturalistSpeciesData {
  speciesName: string;
  totalResearchObservations: number;
  photos: INaturalistPhoto[];
}

export async function fetchINaturalistSpeciesPhotos(speciesName: string, limit: number = 4): Promise<INaturalistSpeciesData> {
  try {
    const params = new URLSearchParams({
      q: speciesName,
      quality_grade: 'research',
      has: 'photos',
      per_page: String(limit),
      order: 'desc',
      order_by: 'votes'
    });

    const url = `https://api.inaturalist.org/v1/observations?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`iNaturalist API error ${res.status}`);
    }

    const data = await res.json();
    const totalCount = data.total_results || 0;
    const results = data.results || [];

    const photos: INaturalistPhoto[] = [];

    results.forEach((obs: any) => {
      const observer = obs.user?.login || obs.user?.name || 'iNaturalist Observer';
      const observedOn = obs.observed_on_string || obs.created_at?.slice(0, 10) || 'Recent';
      const locationName = obs.place_guess || 'Wild Habitat';
      const qualityGrade = obs.quality_grade || 'research';

      if (obs.photos && obs.photos.length > 0) {
        obs.photos.forEach((p: any) => {
          if (p.url && photos.length < limit * 2) {
            // Convert square thumbnail URL to medium/large resolution S3 URL
            const mediumUrl = p.url.replace('/square.', '/medium.').replace('/square.jpg', '/medium.jpg');
            photos.push({
              id: p.id || Math.random(),
              url: p.url,
              mediumUrl,
              attribution: p.attribution || `© ${observer}`,
              observer,
              observedOn,
              locationName,
              qualityGrade
            });
          }
        });
      }
    });

    return {
      speciesName,
      totalResearchObservations: totalCount,
      photos: photos.slice(0, limit)
    };
  } catch (error) {
    console.error('Error fetching iNaturalist photos:', error);
    return {
      speciesName,
      totalResearchObservations: 0,
      photos: []
    };
  }
}
