/**
 * EcoVision AI — Mobile Field Companion App
 * Real-time clock, voice waveform animation, more query presets, offline queue
 */

import React, { useState, useEffect } from 'react';
import { Sighting } from '../types';
import {
  Smartphone,
  WifiOff,
  Wifi,
  Mic,
  Volume2,
  VolumeX,
  UploadCloud,
  Camera,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  MapPin,
  Send,
  Battery,
  Signal
} from 'lucide-react';
import { speakAudioDispatch } from '../utils/audioDispatch';

interface MobileFieldAppProps {
  sightings: Sighting[];
  onNewFieldSighting: (sighting: Sighting) => void;
}

// ─── Voice Waveform Animation ───────────────────────────────────────────────
const VoiceWaveform: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const bars = [3, 5, 8, 12, 9, 6, 11, 7, 4, 10, 6, 8, 3];
  return (
    <div className="flex items-center justify-center gap-0.5 h-8">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-300 ${
            isActive
              ? 'bg-teal-400 wave-bar'
              : 'bg-slate-600'
          }`}
          style={{
            height: isActive ? `${h * 2}px` : '4px',
            animationDelay: isActive ? `${i * 60}ms` : undefined,
            animationDuration: isActive ? `${0.6 + (i % 4) * 0.15}s` : undefined,
          }}
        />
      ))}
    </div>
  );
};

// ─── Real-time Clock ────────────────────────────────────────────────────────
const LiveClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-bold text-slate-200 font-mono text-[12px]">
      {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
    </span>
  );
};

const VOICE_PRESETS = [
  'What did I find in Amrabad?',
  'Is Lantana invasive here?',
  'Show all endangered species',
  'Latest invasive outbreak nearby?',
  'How many sightings today?',
  'Recommend urgent interventions'
];

const MOCK_CAPTURES = [
  {
    speciesName: 'Indian Leopard',
    scientificName: 'Panthera pardus fusca',
    url: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80',
    location: 'Amrabad Forest Ridge, Sector 2',
    lat: 16.3950,
    lng: 78.8250,
    isInvasive: false,
    iucnStatus: 'VU' as const
  },
  {
    speciesName: 'Parthenium Weed',
    scientificName: 'Parthenium hysterophorus',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    location: 'Maheshwaram Agricultural Fringe',
    lat: 17.1350,
    lng: 78.4350,
    isInvasive: true,
    iucnStatus: 'LC' as const
  },
  {
    speciesName: 'Indian Rock Python',
    scientificName: 'Python molurus',
    url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=800&q=80',
    location: 'KBR National Park, Hyderabad',
    lat: 17.4271,
    lng: 78.4377,
    isInvasive: false,
    iucnStatus: 'VU' as const
  }
];

export const MobileFieldApp: React.FC<MobileFieldAppProps> = ({ sightings, onNewFieldSighting }) => {
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [voiceAnswer, setVoiceAnswer] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [recentCapture, setRecentCapture] = useState<any | null>(null);
  const [batteryLevel] = useState(Math.floor(Math.random() * 40) + 55);

  // Field Camera Snapshot Simulation
  const handleCaptureFieldPhoto = () => {
    const item = MOCK_CAPTURES[Math.floor(Math.random() * MOCK_CAPTURES.length)];

    if (isOfflineMode) {
      const queuedItem = {
        id: `offline-${Date.now()}`,
        ...item,
        timestamp: new Date().toISOString(),
        status: 'queued_for_sync'
      };
      setOfflineQueue((prev) => [queuedItem, ...prev]);
      setRecentCapture(queuedItem);
    } else {
      const newSighting: Sighting = {
        id: `field-${Date.now()}`,
        timestamp: new Date().toISOString(),
        locationName: item.location,
        region: 'Telangana & Hyderabad Forest Reserve',
        lat: item.lat,
        lng: item.lng,
        imageUrl: item.url,
        speciesName: item.speciesName,
        scientificName: item.scientificName,
        confidenceScore: 0.94,
        iucnStatus: item.iucnStatus,
        isInvasive: item.isInvasive,
        invasiveSeverity: item.isInvasive ? 'High' : 'None',
        observerRole: 'field_agent',
        verifiedStatus: 'verified_expert',
        perceptionResult: {
          speciesName: item.speciesName,
          scientificName: item.scientificName,
          confidenceScore: 0.94,
          taxonomy: {
            kingdom: 'Animalia',
            class: 'Mammalia',
            order: 'Carnivora',
            family: 'Felidae',
            genus: item.scientificName.split(' ')[0],
            species: item.scientificName,
            commonName: item.speciesName
          },
          iucnStatus: item.iucnStatus,
          iucnStatusLabel: item.iucnStatus === 'VU' ? 'Vulnerable' : 'Least Concern',
          isInvasive: item.isInvasive,
          invasiveSeverity: item.isInvasive ? 'High' : 'None',
          description: 'Captured via EcoVision Mobile Field Camera — ONNX edge pre-screened.',
          habitatType: 'Deciduous Scrub & Fringe Forest',
          nativeRegion: 'Indian Subcontinent',
          keyFeatures: ['Confirmed field sighting', 'AI-edge classified'],
          imageQualityScore: 91,
          imageQualityNotes: 'Clear mobile snapshot.'
        }
      };
      setRecentCapture({ ...item, timestamp: new Date().toISOString() });
      onNewFieldSighting(newSighting);
    }
  };

  // Sync Offline Queue
  const handleSyncQueue = () => {
    offlineQueue.forEach((item) => {
      const newSighting: Sighting = {
        id: `synced-${Date.now()}-${Math.random()}`,
        timestamp: item.timestamp,
        locationName: item.location,
        region: 'Telangana & Hyderabad Forest Reserve',
        lat: item.lat,
        lng: item.lng,
        imageUrl: item.url,
        speciesName: item.speciesName,
        scientificName: item.scientificName,
        confidenceScore: 0.91,
        iucnStatus: item.iucnStatus,
        isInvasive: item.isInvasive,
        invasiveSeverity: item.isInvasive ? 'High' : 'None',
        observerRole: 'field_agent',
        verifiedStatus: 'unverified',
        perceptionResult: {
          speciesName: item.speciesName,
          scientificName: item.scientificName,
          confidenceScore: 0.91,
          taxonomy: {
            kingdom: 'Animalia',
            class: 'Specimen',
            order: 'Order',
            family: 'Family',
            genus: 'Genus',
            species: item.speciesName,
            commonName: item.speciesName
          },
          iucnStatus: item.iucnStatus,
          iucnStatusLabel: 'Logged via Offline Sync',
          isInvasive: item.isInvasive,
          invasiveSeverity: item.isInvasive ? 'High' : 'None',
          description: 'Synchronized from offline field queue upon network reconnect.',
          habitatType: 'Field Habitat',
          nativeRegion: 'Regional',
          keyFeatures: ['ONNX edge inference matched'],
          imageQualityScore: 85,
          imageQualityNotes: 'ONNX edge inference matched.'
        }
      };
      onNewFieldSighting(newSighting);
    });
    setOfflineQueue([]);
  };

  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true); // Audio OFF by default

  // Voice Assistant Handler
  const handleVoiceQuerySubmit = async (queryText?: string) => {
    const textToQuery = queryText || voiceQuery;
    if (!textToQuery) return;

    setIsProcessingVoice(true);
    setVoiceAnswer(null);
    try {
      const res = await fetch('/api/v1/voice-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToQuery })
      });
      const data = await res.json();
      const answer = data.responseText || 'Field query analyzed.';
      setVoiceAnswer(answer);
      if (!isAudioMuted) {
        speakAudioDispatch(answer, true);
      }
    } catch {
      const fallbackAnswer = `Checked local field database: ${sightings.length} active sightings logged in current sector. ${sightings.filter(s => s.isInvasive).length} invasive specimens flagged.`;
      setVoiceAnswer(fallbackAnswer);
      if (!isAudioMuted) {
        speakAudioDispatch(fallbackAnswer, true);
      }
    } finally {
      setIsProcessingVoice(false);
    }
  };

  // Simulate mic listening toggle
  const handleMicToggle = () => {
    if (isListening) {
      setIsListening(false);
      if (voiceQuery) handleVoiceQuerySubmit(voiceQuery);
    } else {
      setIsListening(true);
      // Auto-stop after 3s for demo
      setTimeout(() => setIsListening(false), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Mobile Device Frame */}
        <div className="bg-slate-950 rounded-[40px] p-1 border-[6px] border-slate-700 shadow-2xl relative max-w-sm mx-auto overflow-hidden">
          {/* Notch */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-950 rounded-b-2xl z-10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-700" />
          </div>

          <div className="bg-slate-900 rounded-[34px] overflow-hidden">
            {/* Status Bar */}
            <div className="bg-slate-900 px-5 pt-7 pb-2 flex items-center justify-between text-[11px]">
              <LiveClock />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOfflineMode(!isOfflineMode)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition ${
                    isOfflineMode
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {isOfflineMode ? (
                    <><WifiOff className="w-3 h-3 text-amber-400" /><span>Offline</span></>
                  ) : (
                    <><Wifi className="w-3 h-3 text-emerald-400" /><span>5G</span></>
                  )}
                </button>
                <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                  <span>{batteryLevel}%</span>
                  <Battery className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Screen Body */}
            <div className="p-4 space-y-4 text-xs bg-slate-900 min-h-[540px]">
              <div className="text-center pb-2 border-b border-slate-800">
                <h3 className="text-base font-bold text-white font-serif-title flex items-center justify-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  EcoVision Field App
                </h3>
                <p className="text-[11px] text-slate-400">Edge Inference & Voice Field Companion</p>
              </div>

              {/* Offline Warning */}
              {isOfflineMode && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-[11px] text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Offline Edge Mode Active</strong>
                    Using on-device ONNX/TFLite for basic identification. Reasoning insights sync when online.
                  </div>
                </div>
              )}

              {/* Recent Capture Preview */}
              {recentCapture && (
                <div className={`rounded-xl overflow-hidden border ${
                  recentCapture.isInvasive ? 'border-amber-500/40' : 'border-emerald-500/30'
                } relative`}>
                  <img
                    src={recentCapture.url}
                    alt={recentCapture.speciesName}
                    className="w-full h-28 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-white">{recentCapture.speciesName}</p>
                      <p className="text-[10px] text-emerald-300 italic">{recentCapture.scientificName}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      recentCapture.isInvasive ? 'bg-amber-500 text-slate-900' : 'bg-emerald-500 text-slate-900'
                    }`}>
                      {recentCapture.isInvasive ? '⚠ Invasive' : '✓ Native'}
                    </span>
                  </div>
                </div>
              )}

              {/* Field Camera Action */}
              <div className="bg-slate-800 rounded-2xl p-3.5 border border-slate-700 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Capture Specimen</h4>
                  <p className="text-[11px] text-slate-400">Snap photo in the field for AI identification</p>
                </div>
                <button
                  id="field-capture-btn"
                  onClick={handleCaptureFieldPhoto}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
                >
                  <Camera className="w-4 h-4" />
                  <span>{isOfflineMode ? 'Queue Offline Capture' : 'Instant Field Identify'}</span>
                </button>
              </div>

              {/* Voice Field Assistant */}
              <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Mic className={`w-3.5 h-3.5 ${isListening ? 'text-teal-400' : 'text-slate-400'}`} />
                    AI Field Voice Companion
                  </span>
                  <button 
                    onClick={() => {
                      const next = !isAudioMuted;
                      setIsAudioMuted(next);
                      if (!next && voiceAnswer) {
                        speakAudioDispatch(voiceAnswer, true);
                      } else if (next && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                      }
                    }} 
                    title={isAudioMuted ? 'Voice Audio OFF — Click to enable voice speech' : 'Voice Audio ON — Click to mute voice speech'}
                    className={`px-2 py-0.5 rounded-lg transition border flex items-center gap-1 text-[10px] font-semibold ${
                      !isAudioMuted 
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 bio-glow-cyan' 
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {!isAudioMuted ? (
                      <><Volume2 className="w-3 h-3 text-teal-400" /><span>Audio ON</span></>
                    ) : (
                      <><VolumeX className="w-3 h-3 text-slate-400" /><span>Audio OFF</span></>
                    )}
                  </button>
                </div>

                {/* Waveform */}
                <VoiceWaveform isActive={isListening || isProcessingVoice} />

                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={voiceQuery}
                    onChange={(e) => setVoiceQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleVoiceQuerySubmit()}
                    placeholder="Ask the field AI..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                  <button
                    onClick={() => handleVoiceQuerySubmit()}
                    disabled={isProcessingVoice}
                    className="p-1.5 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded-lg transition disabled:opacity-50"
                  >
                    {isProcessingVoice ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Preset buttons — expanded to 6 */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {VOICE_PRESETS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setVoiceQuery(q); handleVoiceQuerySubmit(q); }}
                      className="text-[10px] bg-slate-900 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {voiceAnswer && (
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-teal-500/30 text-[11px] text-teal-200 leading-normal max-h-28 overflow-y-auto thin-scrollbar">
                    {voiceAnswer}
                  </div>
                )}
              </div>

              {/* Offline Sync Queue */}
              {offlineQueue.length > 0 && (
                <div className="bg-slate-800 p-3 rounded-2xl border border-amber-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                    <span className="flex items-center gap-1">
                      <UploadCloud className="w-3.5 h-3.5" />
                      Offline Queue ({offlineQueue.length})
                    </span>
                    <button
                      onClick={handleSyncQueue}
                      className="px-2 py-1 bg-amber-500 text-slate-950 font-bold rounded text-[10px]"
                    >
                      Sync to Server
                    </button>
                  </div>
                  <div className="space-y-1 max-h-28 overflow-y-auto thin-scrollbar pr-1">
                    {offlineQueue.map((item, idx) => (
                      <div key={idx} className="bg-slate-900 p-2 rounded-lg border border-slate-700 flex items-center justify-between text-[10px]">
                        <div>
                          <strong className="text-white block">{item.speciesName}</strong>
                          <span className="text-slate-400">{item.location}</span>
                        </div>
                        <span className="text-amber-400 font-mono">Queued</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Recent Field Stats */}
        <div className="space-y-6">
          <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 font-serif-title flex items-center gap-2">
              <Signal className="w-4 h-4 text-emerald-400" />
              Current Field Session
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Session Sightings</span>
                <p className="text-2xl font-bold text-emerald-400 font-mono">{sightings.length}</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Offline Queue</span>
                <p className="text-2xl font-bold text-amber-400 font-mono">{offlineQueue.length}</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Invasive Flags</span>
                <p className="text-2xl font-bold text-rose-400 font-mono">{sightings.filter(s => s.isInvasive).length}</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Device Battery</span>
                <p className={`text-2xl font-bold font-mono ${batteryLevel < 30 ? 'text-rose-400' : 'text-emerald-400'}`}>{batteryLevel}%</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recent Sightings (Last 5)</h3>
            <div className="space-y-2 thin-scrollbar overflow-y-auto max-h-64">
              {sightings.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <img src={s.imageUrl} alt={s.speciesName} className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{s.speciesName}</p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 truncate">
                      <MapPin className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                      {s.locationName}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    s.isInvasive ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {s.iucnStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
