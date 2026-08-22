/**
 * EcoVision AI — iNaturalist Research-Grade Community Gallery
 * Displays verified community photos & observer credits from iNaturalist
 */

import React, { useState, useEffect } from 'react';
import { INaturalistPhoto } from '../../server/inaturalist';
import { Camera, ExternalLink, RefreshCw, CheckCircle2, User } from 'lucide-react';

interface INaturalistGalleryProps {
  speciesName: string;
  limit?: number;
  className?: string;
}

export const INaturalistGallery: React.FC<INaturalistGalleryProps> = ({
  speciesName,
  limit = 4,
  className = ''
}) => {
  const [photos, setPhotos] = useState<INaturalistPhoto[]>([]);
  const [totalObs, setTotalObs] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const loadPhotos = async () => {
      if (!speciesName) return;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/v1/inaturalist/photos?species=${encodeURIComponent(speciesName)}&limit=${limit}`);
        const data = await res.json();
        if (isMounted && data.success) {
          setPhotos(data.photos || []);
          setTotalObs(data.totalResearchObservations || 0);
        }
      } catch (err) {
        console.error('Failed to load iNaturalist gallery:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadPhotos();
    return () => { isMounted = false; };
  }, [speciesName, limit]);

  return (
    <div className={`glass-panel rounded-2xl p-4 border border-slate-800/80 space-y-3 shadow-xl ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 text-xs">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="font-bold text-white uppercase tracking-wider text-[11px] font-serif-title">
            iNaturalist Research Community Photos
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm">
            Verified Research Grade
          </span>
        </div>

        {totalObs > 0 && (
          <span className="text-[11px] font-mono text-emerald-400 font-bold">
            {totalObs.toLocaleString()} global observations
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
          <span className="font-mono text-[11px]">Fetching iNaturalist S3 Photos...</span>
        </div>
      ) : photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {photos.map((p, idx) => (
            <a
              key={p.id || idx}
              href={`https://www.inaturalist.org/observations?taxon_name=${encodeURIComponent(speciesName)}`}
              target="_blank"
              rel="noreferrer"
              className="group relative rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 aspect-square flex flex-col justify-end transition-all duration-300 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <img
                src={p.mediumUrl || p.url}
                alt={speciesName}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = p.url;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition" />
              
              <div className="relative p-2 text-[10px] space-y-0.5 z-10">
                <div className="flex items-center gap-1 text-emerald-300 font-semibold truncate">
                  <User className="w-2.5 h-2.5 shrink-0" />
                  <span className="truncate">{p.observer}</span>
                </div>
                <div className="text-slate-400 truncate text-[9px] flex items-center justify-between">
                  <span>{p.locationName.split(',')[0]}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400 group-hover:text-emerald-400 shrink-0" />
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center text-xs text-slate-500">
          No iNaturalist verified community photos found for {speciesName}.
        </div>
      )}
    </div>
  );
};
