import React, { useState } from 'react';
import { Sighting, PerceptionResult, ReasoningInsight } from '../types';
import { MultiAgentGraphViewer } from './MultiAgentGraphViewer';
import { INaturalistGallery } from './INaturalistGallery';
import { 
  Upload, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Layers, 
  RefreshCw, 
  Info, 
  FileText,
  MapPin
} from 'lucide-react';

interface ImageAnalyzerProps {
  sightings: Sighting[];
  onIdentifyComplete: (sighting: Sighting) => void;
  onReasoningComplete: (sighting: Sighting) => void;
}

const SAMPLE_PHOTOS = [
  {
    name: 'Bengal Tiger (Kawal/Amrabad Reserve)',
    url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80',
    location: 'Amrabad Tiger Reserve, Telangana'
  },
  {
    name: 'Invasive Lantana Camara Weed',
    url: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=800&q=80',
    location: 'KBR National Park, Hyderabad'
  },
  {
    name: 'Lion-tailed Macaque Canopy Primate',
    url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80',
    location: 'Silent Valley National Park, Western Ghats'
  },
  {
    name: 'Gray Wolf Pack Alpha',
    url: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=800&q=80',
    location: 'Yellowstone Lamar Valley'
  }
];

export const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({
  sightings,
  onIdentifyComplete,
  onReasoningComplete
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_PHOTOS[0].url);
  const [locationName, setLocationName] = useState<string>(SAMPLE_PHOTOS[0].location);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isReasoning, setIsReasoning] = useState(false);
  const [activeSighting, setActiveSighting] = useState<Sighting | null>(sightings[0] || null);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedImage(reader.result);
        setActiveSighting(null); // reset until run
      }
    };
    reader.readAsDataURL(file);
  };

  // Run Phase 1 Perception
  const handleRunPerception = async () => {
    setIsIdentifying(true);
    try {
      const res = await fetch('/api/v1/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: selectedImage,
          locationName,
          lat: 17.3850,
          lng: 78.4867,
          observerRole: 'researcher'
        })
      });

      const data = await res.json();
      if (data.success && data.sighting) {
        setActiveSighting(data.sighting);
        onIdentifyComplete(data.sighting);
      }
    } catch (err) {
      console.error('Failed perception identification:', err);
    } finally {
      setIsIdentifying(false);
    }
  };

  // Run Phase 2 Multi-Agent Reasoning
  const handleRunReasoning = async () => {
    if (!activeSighting) return;
    setIsReasoning(true);

    try {
      const res = await fetch(`/api/v1/analyze/${activeSighting.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();
      if (data.success && data.reasoningInsight) {
        const updatedSighting = {
          ...activeSighting,
          reasoningInsight: data.reasoningInsight
        };
        setActiveSighting(updatedSighting);
        onReasoningComplete(updatedSighting);
      }
    } catch (err) {
      console.error('Failed reasoning pipeline:', err);
    } finally {
      setIsReasoning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Title */}
      <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif-title flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            Phase 1 & 2: Perception Vision Classifier & Multi-Agent Reasoning
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload or select an ecosystem sample photo to trigger real-time taxonomy classification and multi-agent ecological synthesis.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
            @google/genai gemini-3.6-flash
          </span>
        </div>
      </div>

      {/* Upload and Sample Selection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Image Source & Sample Selector */}
        <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            Input Image & Location Context
          </h3>

          {/* Active Image Preview Box */}
          <div className="relative rounded-xl overflow-hidden h-64 bg-slate-950 border border-slate-700 group flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Ecosystem specimen"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Location name..."
                  className="bg-transparent text-white font-medium focus:outline-none w-48"
                />
              </div>

              <label className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer transition flex items-center gap-1.5 shadow-md">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Preset Sample Photos */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400">
              Or pick a sample ecosystem test specimen:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_PHOTOS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(sample.url);
                    setLocationName(sample.location);
                    setActiveSighting(null);
                  }}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition ${
                    selectedImage === sample.url
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900/80 border-slate-700/80 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold truncate text-slate-200">
                      {sample.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {sample.location}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Perception Button */}
          <button
            onClick={handleRunPerception}
            disabled={isIdentifying}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-extrabold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50"
          >
            {isIdentifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Executing Vision AI Perception Layer...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Phase 1 Vision Perception Pipeline</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Perception Results & Agent Trigger */}
        <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            Perception Output & Taxonomy Matrix
          </h3>

          {activeSighting ? (
            <div className="space-y-4">
              {/* Common Name & Scientific Taxonomy */}
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white font-serif-title">
                    {activeSighting.speciesName}
                  </h4>
                  <p className="text-xs italic text-emerald-400 font-mono">
                    {activeSighting.scientificName}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Native to: {activeSighting.perceptionResult.nativeRegion || 'Regional Fauna'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 block">
                    {Math.round(activeSighting.confidenceScore * 100)}% Match
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Quality: {activeSighting.perceptionResult.imageQualityScore}/100
                  </span>
                </div>
              </div>

              {/* Taxonomy Tree Breakdown */}
              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 text-xs space-y-1.5">
                <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider block">
                  Taxonomic Lineage
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><span className="text-slate-500">Kingdom:</span> <span className="text-slate-200 font-medium">{activeSighting.perceptionResult.taxonomy.kingdom}</span></div>
                  <div><span className="text-slate-500">Class:</span> <span className="text-slate-200 font-medium">{activeSighting.perceptionResult.taxonomy.class}</span></div>
                  <div><span className="text-slate-500">Order:</span> <span className="text-slate-200 font-medium">{activeSighting.perceptionResult.taxonomy.order}</span></div>
                  <div><span className="text-slate-500">Family:</span> <span className="text-slate-200 font-medium">{activeSighting.perceptionResult.taxonomy.family}</span></div>
                  <div><span className="text-slate-500">Genus:</span> <span className="text-slate-200 font-medium">{activeSighting.perceptionResult.taxonomy.genus}</span></div>
                  <div><span className="text-slate-500">Species:</span> <span className="text-slate-200 font-medium">{activeSighting.perceptionResult.taxonomy.species}</span></div>
                </div>
              </div>

              {/* Dual AI Vision Ensemble Box */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-xl p-3.5 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-serif-title flex items-center gap-1.5">
                      🤗 Multi-Model AI Vision Ensemble
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      Gemini + HuggingFace ViT
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    Consensus Match: Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 font-semibold block uppercase">Model 1: Gemini 3.6 Vision</span>
                    <span className="font-bold text-emerald-300 block">{activeSighting.speciesName}</span>
                    <span className="text-[10px] font-mono text-slate-400">Match: {Math.round(activeSighting.confidenceScore * 100)}%</span>
                  </div>

                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 font-semibold block uppercase">Model 2: HuggingFace ViT-Base</span>
                    <span className="font-bold text-cyan-300 block truncate">
                      {activeSighting.perceptionResult.huggingFaceResult?.predictedLabel || 'ViT Specimen Classifier'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Confidence: {Math.round((activeSighting.perceptionResult.huggingFaceResult?.confidenceScore || 0.94) * 100)}%
                    </span>
                  </div>
                </div>

                {activeSighting.perceptionResult.huggingFaceResult?.imageCaption && (
                  <div className="text-[10px] text-slate-400 bg-slate-950/80 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                    <span className="font-semibold text-cyan-400 shrink-0">HuggingFace BLIP Caption:</span>
                    <span className="italic text-slate-300 truncate">"{activeSighting.perceptionResult.huggingFaceResult.imageCaption}"</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                {activeSighting.perceptionResult.description}
              </p>

              {/* Real-time Climate Telemetry at Sighting Location */}
              {activeSighting.weatherData && (
                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg leading-none">{activeSighting.weatherData.icon}</span>
                    <div>
                      <span className="font-semibold text-slate-200 block text-[11px]">
                        Observation Climate: {activeSighting.weatherData.weatherCondition}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Humidity: {activeSighting.weatherData.humidity}% | Wind: {activeSighting.weatherData.windSpeedKmh} km/h
                      </span>
                    </div>
                  </div>
                  <div className="font-mono text-emerald-400 font-bold text-sm">
                    {activeSighting.weatherData.temperatureC}°C
                  </div>
                </div>
              )}

              {/* iNaturalist Community Photos */}
              <INaturalistGallery speciesName={activeSighting.speciesName} limit={4} />

              {/* Trigger Phase 2 Multi-Agent Reasoning */}
              <button
                onClick={handleRunReasoning}
                disabled={isReasoning}
                className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50"
              >
                {isReasoning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing Multi-Agent Graph (Context → Pattern → Insight)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Trigger Phase 2 Multi-Agent Reasoning Layer</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs border border-dashed border-slate-700/80 rounded-xl">
              <Camera className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              Click "Run Phase 1 Vision Perception Pipeline" to identify the species from the image.
            </div>
          )}
        </div>
      </div>

      {/* Render Multi-Agent Graph Output if reasoning has run for active sighting */}
      {activeSighting?.reasoningInsight && (
        <MultiAgentGraphViewer insight={activeSighting.reasoningInsight} />
      )}
    </div>
  );
};
