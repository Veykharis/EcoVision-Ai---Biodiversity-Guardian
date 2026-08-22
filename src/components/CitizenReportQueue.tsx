import React, { useState } from 'react';
import { CitizenReport } from '../types';
import { 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  MapPin, 
  Filter, 
  PlusCircle, 
  Trash2,
  AlertCircle
} from 'lucide-react';

interface CitizenReportQueueProps {
  reports: CitizenReport[];
  onAddReport: (report: CitizenReport) => void;
}

export const CitizenReportQueue: React.FC<CitizenReportQueueProps> = ({
  reports,
  onAddReport
}) => {
  const [localReports, setLocalReports] = useState<CitizenReport[]>(reports);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CitizenReport['category']>('illegal_dumping');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [urgency, setUrgency] = useState<CitizenReport['urgency']>('high');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/citizen-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          description,
          locationName: locationName || 'Amrabad Forest Buffer Zone',
          lat: 16.4100,
          lng: 78.8300,
          urgency
        })
      });

      const data = await res.json();
      if (data.success && data.report) {
        setLocalReports([data.report, ...localReports]);
        onAddReport(data.report);
        setTitle('');
        setDescription('');
        setLocationName('');
      }
    } catch (err) {
      console.error('Error submitting report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: CitizenReport['status']) => {
    setLocalReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif-title flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Citizen Field Reporting & Hazard Dispatch Queue
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Community-driven reports for environmental hazards (illegal chemical dumping, poaching snares, invasive blooms).
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold">
            {localReports.filter((r) => r.status === 'pending').length} Pending Dispatch
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form: Submit New Field Report */}
        <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            Log New Environmental Incident
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Report Title</label>
              <input
                type="text"
                placeholder="e.g. Wire Snare Trap found near stream"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Hazard Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none cursor-pointer"
                >
                  <option value="illegal_dumping">Illegal Dumping</option>
                  <option value="poaching_hazard">Poaching Trap / Snare</option>
                  <option value="invasive_outbreak">Invasive Outbreak</option>
                  <option value="habitat_destruction">Habitat Encroachment</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Urgency Level</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none cursor-pointer"
                >
                  <option value="critical">Critical (Immediate)</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Location / Landmark</label>
              <input
                type="text"
                placeholder="e.g. Amrabad Range Sector 4"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Incident Description & Evidence</label>
              <textarea
                rows={3}
                placeholder="Provide specific details, vehicle descriptions, or environmental observation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Submit Incident Report to Forest Officers</span>
            </button>
          </form>
        </div>

        {/* Live Queue Table & Inspection */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Active Incident Queue & Forest Patrol Verification
            </h3>

            <div className="space-y-3">
              {localReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2 hover:border-slate-700 transition"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white font-serif-title flex items-center gap-2">
                        {report.title}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          report.urgency === 'critical'
                            ? 'bg-rose-500 text-white'
                            : report.urgency === 'high'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-emerald-500 text-slate-950'
                        }`}>
                          {report.urgency.toUpperCase()}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{report.locationName}</span> • <span>{new Date(report.timestamp).toLocaleString()}</span>
                      </p>
                    </div>

                    {/* Status Pills & Controls */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        report.status === 'pending'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : report.status === 'dispatched'
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {report.status}
                      </span>

                      {report.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(report.id, 'dispatched')}
                          className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold rounded-md text-[10px] transition"
                        >
                          Dispatch Ranger
                        </button>
                      )}

                      {report.status === 'dispatched' && (
                        <button
                          onClick={() => handleUpdateStatus(report.id, 'resolved')}
                          className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-md text-[10px] transition"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    {report.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
