/**
 * EcoVision AI — Biodiversity Map View
 * Leaflet map + sightings sidebar + live urgency ticker + enhanced filter controls
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sighting, CitizenReport, ConservationStatus, NasaSatelliteData } from '../types';
import {
  Search,
  Filter,
  MapPin,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Eye,
  Layers,
  Compass,
  Zap,
  Activity,
  TreePine,
  Flame,
  Globe,
  Satellite
} from 'lucide-react';
import L from 'leaflet';
import { WeatherWidget } from './WeatherWidget';

interface MapViewProps {
  sightings: Sighting[];
  reports: CitizenReport[];
  onSelectSighting: (sighting: Sighting) => void;
  onRunReasoning: (sighting: Sighting) => void;
  isAnalyzing: boolean;
}

// ─── Live Sightings Ticker ─────────────────────────────────────────────────
const SightingsTicker: React.FC<{ sightings: Sighting[] }> = ({ sightings }) => {
  const recent = sightings.slice(0, 10);
  if (recent.length === 0) return null;

  const tickerItems = [...recent, ...recent]; // duplicate for seamless loop

  return (
    <div className="bg-slate-950/80 border-b border-slate-800 py-1.5 px-4 overflow-hidden">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 shrink-0">
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">LIVE</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="ticker-scroll gap-8">
            {tickerItems.map((s, i) => (
              <span key={`${s.id}-${i}`} className="flex items-center gap-2 text-[11px] whitespace-nowrap pr-8">
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  s.isInvasive ? 'bg-amber-400' :
                  ['CR', 'EN'].includes(s.iucnStatus) ? 'bg-rose-400' : 'bg-emerald-400'
                }`} />
                <span className="text-slate-300 font-medium">{s.speciesName}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-500">{s.locationName}</span>
                {s.isInvasive && (
                  <span className="text-[10px] font-bold text-amber-400 border border-amber-500/30 px-1 rounded">INVASIVE</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Eco Hero Banner ────────────────────────────────────────────────────────
const EcoHeroBanner: React.FC<{ sightings: Sighting[]; reports: CitizenReport[] }> = ({ sightings, reports }) => {
  const invasiveCount = sightings.filter(s => s.isInvasive).length;
  const endangeredCount = sightings.filter(s => ['CR', 'EN', 'VU'].includes(s.iucnStatus)).length;
  const urgentCount = sightings.filter(s => s.reasoningInsight?.insight.urgencyRating === 'Urgent').length;
  const healthScore = Math.max(0, Math.round(100 - invasiveCount * 4 - endangeredCount * 2));

  return (
    <div className="eco-gradient-animated rounded-2xl p-5 border border-emerald-500/20 shadow-xl relative overflow-hidden mb-6">
      {/* Decorative overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-transparent pointer-events-none" />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
        <TreePine className="w-32 h-32 text-emerald-300" />
      </div>

      <div className="relative flex flex-wrap items-center gap-6">
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-lg font-bold text-white font-serif-title flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            EcoVision Live Spatial Intelligence Map
          </h2>
          <p className="text-xs text-emerald-300/80 mt-1">
            Real-time biodiversity sightings across {new Set(sightings.map(s => s.region)).size} monitored regions
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap text-xs">
          <div className="glass-panel px-3 py-2 rounded-xl flex flex-col items-center gap-0.5">
            <span className="text-slate-400 text-[10px] uppercase">Ecosystem Health</span>
            <span className={`text-xl font-bold font-mono ${healthScore >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {healthScore}/100
            </span>
          </div>
          <div className="glass-panel px-3 py-2 rounded-xl flex flex-col items-center gap-0.5">
            <span className="text-slate-400 text-[10px] uppercase">Total Sightings</span>
            <span className="text-xl font-bold font-mono text-white">{sightings.length}</span>
          </div>
          {urgentCount > 0 && (
            <div className="glass-panel px-3 py-2 rounded-xl flex flex-col items-center gap-0.5 border-rose-500/30 urgency-badge-pulse">
              <span className="text-rose-400 text-[10px] uppercase font-bold">Urgent Alerts</span>
              <span className="text-xl font-bold font-mono text-rose-400">{urgentCount}</span>
            </div>
          )}
          <div className="glass-panel px-3 py-2 rounded-xl flex flex-col items-center gap-0.5">
            <span className="text-slate-400 text-[10px] uppercase">Pending Reports</span>
            <span className="text-xl font-bold font-mono text-amber-400">{reports.filter(r => r.status === 'pending').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MapView: React.FC<MapViewProps> = ({
  sightings,
  reports,
  onSelectSighting,
  onRunReasoning,
  isAnalyzing
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const isInitialFitDoneRef = useRef<boolean>(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [filterInvasiveOnly, setFilterInvasiveOnly] = useState(false);
  const [filterIucn, setFilterIucn] = useState<string>('all');
  const [selectedSighting, setSelectedSighting] = useState<Sighting | null>(sightings[0] || null);
  const [showNasaSatellite, setShowNasaSatellite] = useState<boolean>(false);
  const [nasaData, setNasaData] = useState<NasaSatelliteData | null>(null);

  // Fetch NASA satellite telemetry when toggle is active
  useEffect(() => {
    if (!showNasaSatellite) return;
    let isMounted = true;
    const fetchNasa = async () => {
      try {
        const res = await fetch('/api/v1/nasa/earthdata');
        const data = await res.json();
        if (isMounted && data.success) {
          setNasaData(data.nasaData);
        }
      } catch (err) {
        console.error('Failed to fetch NASA satellite data:', err);
      }
    };
    fetchNasa();
    return () => { isMounted = false; };
  }, [showNasaSatellite]);

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map || filteredSightings.length === 0) return;
    const bounds = L.latLngBounds(filteredSightings.map((s) => [s.lat, s.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11, animate: true });
  };

  const filteredSightings = sightings.filter((s) => {
    const matchesSearch =
      s.speciesName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || s.region === selectedRegion;
    const matchesInvasive = !filterInvasiveOnly || s.isInvasive;
    const matchesIucn = filterIucn === 'all' || s.iucnStatus === filterIucn;
    return matchesSearch && matchesRegion && matchesInvasive && matchesIucn;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [17.3850, 78.4867],
        zoom: 6,
        zoomControl: false,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      setTimeout(() => { map.invalidateSize(); }, 200);
    }

    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
    });

    if (mapContainerRef.current) resizeObserver.observe(mapContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const prevFilterKeyRef = useRef<string>('');
  const currentFilterKey = `${selectedRegion}_${filterInvasiveOnly}_${filterIucn}_${searchQuery}`;

  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    filteredSightings.forEach((s) => {
      let pinColor = '#10b981';
      if (s.isInvasive) pinColor = '#f59e0b';
      if (['CR', 'EN', 'VU'].includes(s.iucnStatus)) pinColor = '#ef4444';

      const isSelected = selectedSighting?.id === s.id;

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background-color: ${pinColor};
            width: ${isSelected ? '34px' : '28px'};
            height: ${isSelected ? '34px' : '28px'};
            border-radius: 50%;
            border: ${isSelected ? '3px' : '2px'} solid ${isSelected ? '#fff' : '#0f172a'};
            box-shadow: 0 0 ${isSelected ? '20px' : '12px'} ${pinColor}${isSelected ? 'CC' : '80'};
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.2s;
          ">
            ${s.isInvasive ? '⚠️' : s.iucnStatus === 'EN' || s.iucnStatus === 'CR' ? '🚨' : '🌿'}
          </div>
        `,
        iconSize: [isSelected ? 34 : 28, isSelected ? 34 : 28],
        iconAnchor: [isSelected ? 17 : 14, isSelected ? 17 : 14]
      });

      const marker = L.marker([s.lat, s.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedSighting(s);
        onSelectSighting(s);
      });

      marker.bindTooltip(`
        <div style="background: #0f172a; color: white; padding: 6px 10px; border-radius: 6px; font-size: 12px; border: 1px solid #334155;">
          <strong>${s.speciesName}</strong><br/>
          <span style="color: #94a3b8;">${s.locationName}</span>
        </div>
      `, { direction: 'top', offset: [0, -10] });

      markersGroup.addLayer(marker);
    });

    reports.forEach((r) => {
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background-color: #06b6d4;
            width: 24px; height: 24px;
            border-radius: 6px;
            border: 2px solid #0f172a;
            box-shadow: 0 0 10px #06b6d480;
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: 10px;
          ">📢</div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([r.lat, r.lng], { icon: customIcon });
      marker.bindTooltip(`
        <div style="background: #0f172a; color: #06b6d4; padding: 6px 10px; border-radius: 6px; font-size: 11px;">
          <strong>Report: ${r.title}</strong><br/>
          <span>${r.category.replace(/_/g, ' ')}</span>
        </div>
      `);
      markersGroup.addLayer(marker);
    });

    // Render NASA satellite fire hotspots if active
    if (showNasaSatellite && nasaData && nasaData.hotspots) {
      nasaData.hotspots.forEach((h) => {
        const fireIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div style="
              background: radial-gradient(circle, #ff4500 0%, #dc2626 100%);
              width: 32px; height: 32px;
              border-radius: 50%;
              border: 2px solid #ffffff;
              box-shadow: 0 0 16px #ff4500, 0 0 28px #dc2626;
              display: flex; align-items: center; justify-content: center;
              font-size: 14px;
              animation: urgency-pulse 1.2s infinite;
            ">
              🔥
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const fireMarker = L.marker([h.lat, h.lng], { icon: fireIcon });
        fireMarker.bindTooltip(`
          <div style="background: #090d16; color: white; padding: 8px 12px; border-radius: 8px; font-size: 11px; border: 1px solid #ef4444;">
            <strong style="color: #f87171;">🔥 NASA Satellite Thermal Hotspot</strong><br/>
            <span>Region: ${h.regionName}</span><br/>
            <span>Sensor: ${h.sensor} | Brightness: ${h.brightness}K</span><br/>
            <span>Fire Radiative Power: ${h.frp} MW</span>
          </div>
        `, { direction: 'top', offset: [0, -12] });

        markersGroup.addLayer(fireMarker);
      });
    }

    const prevFilterKey = prevFilterKeyRef.current;
    if (prevFilterKey !== currentFilterKey && filteredSightings.length > 0) {
      const bounds = L.latLngBounds(filteredSightings.map((s) => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11, animate: true });
      prevFilterKeyRef.current = currentFilterKey;
    }
  }, [filteredSightings, reports, selectedSighting, showNasaSatellite, nasaData]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      {/* Sightings Ticker */}
      <SightingsTicker sightings={sightings} />

      {/* Hero Banner */}
      <EcoHeroBanner sightings={sightings} reports={reports} />

      {/* Real-time Weather & Climate Telemetry Panel */}
      <WeatherWidget
        lat={selectedSighting?.lat ?? 17.3850}
        lng={selectedSighting?.lng ?? 78.4867}
        locationName={selectedSighting?.locationName ?? 'Telangana & Hyderabad Forest Reserve'}
      />

      {/* Search & Filter Header */}
      <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            id="map-search-input"
            placeholder="Search species, scientific name, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Global Regions</option>
              <option value="Telangana & Hyderabad Forest Reserve">Telangana / Hyderabad</option>
              <option value="Western Ghats Biodiversity Hotspot">Western Ghats</option>
              <option value="Yellowstone Ecosystem Preserve">Yellowstone Preserve</option>
              <option value="Amazon Rainforest Basin - Sector Delta">Amazon Basin</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterIucn}
              onChange={(e) => setFilterIucn(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All IUCN Statuses</option>
              <option value="CR">Critically Endangered (CR)</option>
              <option value="EN">Endangered (EN)</option>
              <option value="VU">Vulnerable (VU)</option>
              <option value="NT">Near Threatened (NT)</option>
              <option value="LC">Least Concern (LC)</option>
            </select>
          </div>

          <button
            onClick={() => setShowNasaSatellite(!showNasaSatellite)}
            title="Toggle live NASA MODIS/VIIRS satellite wildfire hotspots & canopy health"
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition border ${
              showNasaSatellite
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 bio-glow-emerald shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <Satellite className={`w-3.5 h-3.5 ${showNasaSatellite ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
            <span>{showNasaSatellite ? 'NASA Satellites: ON' : 'NASA Satellites'}</span>
          </button>

          <button
            id="invasive-filter-btn"
            onClick={() => setFilterInvasiveOnly(!filterInvasiveOnly)}
            className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition ${
              filterInvasiveOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Invasive Only</span>
          </button>
        </div>
      </div>

      {/* NASA Satellite Earthdata Telemetry Panel */}
      {showNasaSatellite && nasaData && (
        <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/80 rounded-2xl p-4 border border-rose-500/30 text-xs space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="font-bold text-white uppercase tracking-wider text-[11px] font-serif-title">
                NASA FIRMS & Earthdata Satellite Telemetry
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                MODIS / VIIRS Orbit Pass
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">{nasaData.lastSatellitePass}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Active Hotspots</span>
              <span className="font-bold text-rose-400 text-base font-mono">{nasaData.activeHotspotsCount} Fire Clusters</span>
            </div>

            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Thermal Fire Risk</span>
              <span className="font-bold text-amber-400 text-base font-mono">{nasaData.fireRiskLevel}</span>
            </div>

            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Canopy Density</span>
              <span className="font-bold text-emerald-400 text-base font-mono">{nasaData.canopyDensityPct}% NDVI</span>
            </div>

            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Vegetation Health</span>
              <span className="font-bold text-cyan-400 text-base font-mono">{nasaData.vegetationHealthIndex} / 100</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Map & Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Map */}
        <div className="lg:col-span-2 bg-slate-800/90 rounded-2xl p-2 border border-slate-700 shadow-xl overflow-hidden relative min-h-[520px] h-[580px] flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700/60 mb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-200">Live PostGIS Spatial Telemetry Layer</span>
              <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                {filteredSightings.length} Sightings
              </span>
              <button
                id="map-recenter-btn"
                onClick={handleRecenter}
                title="Fit map to visible pins"
                className="ml-2 px-2 py-1 bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded text-[10px] font-medium flex items-center gap-1 transition"
              >
                <Compass className="w-3 h-3 text-emerald-400" />
                <span>Fit Map</span>
              </button>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Endangered</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Invasive</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Native</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500" /> Report</span>
            </div>
          </div>
          <div ref={mapContainerRef} className="w-full flex-1 rounded-xl overflow-hidden shadow-inner" />
        </div>

        {/* Right: Selected Detail + Sightings Sidebar List */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto thin-scrollbar">
          {/* Selected Sighting Detail Panel */}
          <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700 shadow-xl">
            {selectedSighting ? (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden h-44 bg-slate-950 border border-slate-700/80 group">
                  <img
                    src={selectedSighting.imageUrl}
                    alt={selectedSighting.speciesName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white font-serif-title leading-tight">
                        {selectedSighting.speciesName}
                      </h3>
                      <p className="text-xs italic text-emerald-300 font-mono">{selectedSighting.scientificName}</p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-900/90 text-emerald-400 border border-emerald-500/30">
                      {Math.round(selectedSighting.confidenceScore * 100)}%
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <div className={`px-2.5 py-1 rounded-md font-semibold border ${
                    ['CR', 'EN'].includes(selectedSighting.iucnStatus)
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      : selectedSighting.iucnStatus === 'VU'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  }`}>
                    IUCN: {selectedSighting.perceptionResult.iucnStatusLabel || selectedSighting.iucnStatus}
                  </div>
                  {selectedSighting.isInvasive ? (
                    <div className="px-2.5 py-1 rounded-md font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      Invasive ({selectedSighting.invasiveSeverity})
                    </div>
                  ) : (
                    <div className="px-2.5 py-1 rounded-md font-medium bg-slate-900 text-slate-400 border border-slate-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Native
                    </div>
                  )}
                </div>

                <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700/60 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-medium text-white">{selectedSighting.locationName}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] pl-5">
                    {selectedSighting.region} · {selectedSighting.lat.toFixed(4)}, {selectedSighting.lng.toFixed(4)}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800 line-clamp-3">
                  {selectedSighting.perceptionResult.description}
                </p>

                {/* Reasoning Insight Preview */}
                {selectedSighting.reasoningInsight && (
                  <div className="bg-gradient-to-br from-slate-900 to-teal-950/40 p-3.5 rounded-xl border border-teal-500/30 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-teal-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                        Ecological Report
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedSighting.reasoningInsight.insight.urgencyRating === 'Urgent'
                          ? 'bg-rose-500 text-white'
                          : selectedSighting.reasoningInsight.insight.urgencyRating === 'Concern'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-emerald-500 text-slate-950'
                      }`}>
                        {selectedSighting.reasoningInsight.insight.urgencyRating}
                      </span>
                    </div>
                    <p className="text-slate-200 text-[11px] font-medium">{selectedSighting.reasoningInsight.insight.title}</p>
                    <p className="text-slate-400 text-[11px] line-clamp-2">{selectedSighting.reasoningInsight.insight.summary}</p>
                  </div>
                )}

                {/* Actions */}
                <button
                  id={`run-reasoning-${selectedSighting.id}`}
                  onClick={() => onRunReasoning(selectedSighting)}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{selectedSighting.reasoningInsight ? 'Re-run Agent Graph' : 'Trigger Multi-Agent Reasoning'}</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                <Eye className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                Select a sighting pin on the map to inspect perception and reasoning intelligence.
              </div>
            )}
          </div>

          {/* Scrollable Sightings Sidebar List */}
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700/60 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">All Sightings</span>
              <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                {filteredSightings.length}
              </span>
            </div>
            <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto thin-scrollbar">
              {filteredSightings.map((s) => (
                <button
                  key={s.id}
                  id={`sighting-list-${s.id}`}
                  onClick={() => {
                    setSelectedSighting(s);
                    onSelectSighting(s);
                    // Pan map to sighting
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.setView([s.lat, s.lng], 11, { animate: true });
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-700/50 ${
                    selectedSighting?.id === s.id ? 'bg-emerald-500/10 border-l-2 border-emerald-500' : ''
                  }`}
                >
                  <img src={s.imageUrl} alt={s.speciesName} className="w-9 h-9 rounded-lg object-cover border border-slate-700 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{s.speciesName}</p>
                    <p className="text-[10px] text-slate-500 truncate">{s.locationName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      ['CR', 'EN'].includes(s.iucnStatus) ? 'bg-rose-500/20 text-rose-300' :
                      s.iucnStatus === 'VU' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {s.iucnStatus}
                    </span>
                    {s.isInvasive && (
                      <ShieldAlert className="w-3 h-3 text-amber-400" />
                    )}
                    {s.reasoningInsight && (
                      <Zap className="w-3 h-3 text-teal-400" title="AI analyzed" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
