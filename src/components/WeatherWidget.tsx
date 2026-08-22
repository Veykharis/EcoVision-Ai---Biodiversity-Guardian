/**
 * EcoVision AI — Real-time Weather & Climate Telemetry Widget
 * Fetches live weather & temperature from Open-Meteo API
 */

import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types';
import { 
  CloudSun, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  CloudRain, 
  RefreshCw, 
  MapPin, 
  Compass
} from 'lucide-react';

interface WeatherWidgetProps {
  lat?: number;
  lng?: number;
  locationName?: string;
  className?: string;
  compact?: boolean;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  lat = 17.3850,
  lng = 78.4867,
  locationName = 'Telangana & Hyderabad Forest Reserve',
  className = '',
  compact = false
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/weather?lat=${lat}&lng=${lng}&location=${encodeURIComponent(locationName)}`);
      const data = await res.json();
      if (data.success && data.weather) {
        setWeather(data.weather);
      } else {
        throw new Error('Failed to parse weather telemetry');
      }
    } catch (err: any) {
      console.error('Weather widget error:', err);
      setError('Telemetry offline');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [lat, lng, locationName]);

  if (compact) {
    return (
      <div className={`bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-lg flex items-center gap-2.5 text-xs ${className}`}>
        {isLoading ? (
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
        ) : weather ? (
          <>
            <span className="text-base leading-none">{weather.icon}</span>
            <div className="flex items-center gap-1.5 font-mono">
              <span className="font-bold text-white">{weather.temperatureC}°C</span>
              <span className="text-slate-400">({weather.temperatureF}°F)</span>
            </div>
            <span className="text-slate-400 hidden sm:inline">· {weather.weatherCondition}</span>
          </>
        ) : (
          <span className="text-slate-500 text-[11px]">Climate Offline</span>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-slate-900/90 via-slate-900 to-slate-950 rounded-2xl p-4 border border-slate-800 shadow-xl relative overflow-hidden ${className}`}>
      {/* Subtle ambient light glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CloudSun className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              Live Climate Telemetry
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </h4>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-emerald-400" />
              {locationName}
            </p>
          </div>
        </div>

        <button
          onClick={fetchWeather}
          disabled={isLoading}
          title="Refresh live weather telemetry"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="py-6 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
          <span className="font-mono text-[11px]">Polling Open-Meteo Satellite Data...</span>
        </div>
      ) : weather ? (
        <div className="pt-3 space-y-3">
          {/* Main Temperature Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none">{weather.icon}</span>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-white font-mono">{weather.temperatureC}°C</span>
                  <span className="text-sm font-semibold text-slate-400 font-mono">/ {weather.temperatureF}°F</span>
                </div>
                <span className="text-xs font-semibold text-emerald-300">{weather.weatherCondition}</span>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-400">
              <span className="block text-slate-500 font-mono">Updated</span>
              <span>{new Date(weather.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Grid of Weather Metrics */}
          <div className="grid grid-cols-4 gap-2.5 text-xs">
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-700/60 hover:border-cyan-500/40 transition flex flex-col items-center justify-center text-center shadow-md">
              <Droplets className="w-4 h-4 text-cyan-400 mb-0.5 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
              <span className="text-[10px] text-slate-400 font-semibold">Humidity</span>
              <span className="font-bold text-white font-mono text-sm">{weather.humidity}%</span>
            </div>

            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-700/60 hover:border-teal-500/40 transition flex flex-col items-center justify-center text-center shadow-md">
              <Wind className="w-4 h-4 text-teal-400 mb-0.5 drop-shadow-[0_0_8px_rgba(20,184,166,0.4)]" />
              <span className="text-[10px] text-slate-400 font-semibold">Wind</span>
              <span className="font-bold text-white font-mono text-sm">{weather.windSpeedKmh} <span className="text-[9px] text-slate-400 font-normal">km/h</span></span>
            </div>

            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-700/60 hover:border-amber-500/40 transition flex flex-col items-center justify-center text-center shadow-md">
              <Sun className="w-4 h-4 text-amber-400 mb-0.5 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
              <span className="text-[10px] text-slate-400 font-semibold">UV Index</span>
              <span className="font-bold text-white font-mono text-sm">{weather.uvIndex ?? 'Low'}</span>
            </div>

            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-700/60 hover:border-blue-500/40 transition flex flex-col items-center justify-center text-center shadow-md">
              <CloudRain className="w-4 h-4 text-blue-400 mb-0.5 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
              <span className="text-[10px] text-slate-400 font-semibold">Precip.</span>
              <span className="font-bold text-white font-mono text-sm">{weather.precipitationMm ?? 0} <span className="text-[9px] text-slate-400 font-normal">mm</span></span>
            </div>
          </div>

          {/* OpenAQ Global Air Quality Telemetry Banner */}
          {weather.airQualityData && (
            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-2.5 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold text-[11px] font-mono flex items-center gap-1">
                  🍃 OpenAQ Air Telemetry:
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  weather.airQualityData.aqi <= 50 
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' 
                    : weather.airQualityData.aqi <= 100 
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/40' 
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                }`}>
                  AQI {weather.airQualityData.aqi} — {weather.airQualityData.category}
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 hidden sm:block">
                PM2.5: <span className="text-white font-bold">{weather.airQualityData.pm25} µg/m³</span> | PM10: <span className="text-white font-bold">{weather.airQualityData.pm10} µg/m³</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-4 text-center text-slate-400 text-xs">
          Weather telemetry temporarily unavailable.
        </div>
      )}
    </div>
  );
};
