'use client';
import React from 'react';
import type { Query } from '@/lib/types';

export type ControlsProps = {
  query: Query;
  setQuery: (q: Query) => void;
  onFetch: () => void;
  onLoadMock: () => void;
  loading?: boolean;
  showLabels: boolean;
  setShowLabels: (v: boolean) => void;
  linkDistance: number;
  setLinkDistance: (v: number) => void;
  chargeStrength: number;
  setChargeStrength: (v: number) => void;
  collisionPad: number;
  setCollisionPad: (v: number) => void;
  canUseMock: boolean;
};

export const Controls: React.FC<ControlsProps> = ({
  query,
  setQuery,
  onFetch,
  onLoadMock,
  loading = false,
  showLabels,
  setShowLabels,
  linkDistance,
  setLinkDistance,
  chargeStrength,
  setChargeStrength,
  collisionPad,
  setCollisionPad,
  canUseMock,
}) => (
  <div className="absolute left-5 top-5 z-50 min-w-[320px] max-h-[85vh] overflow-y-auto rounded-xl border border-white/10 bg-[rgba(20,20,30,0.9)] p-5 shadow-xl backdrop-blur-md">
    <h3 className="mb-4 text-lg font-semibold text-sky-300">API Parameters</h3>

    <div className="space-y-3">
      <label className="block text-xs text-gray-300">Start Date</label>
      <input 
        type="date" 
        className="w-full rounded-md border border-white/10 bg-transparent p-2 text-white outline-none" 
        value={query.start_date} 
        onChange={(e) => setQuery({ ...query, start_date: e.target.value })} 
      />

      <label className="block text-xs text-gray-300">End Date</label>
      <input 
        type="date" 
        className="w-full rounded-md border border-white/10 bg-transparent p-2 text-white outline-none" 
        value={query.end_date} 
        onChange={(e) => setQuery({ ...query, end_date: e.target.value })} 
      />

      <label className="block text-xs text-gray-300">Theme</label>
      <input 
        type="text" 
        placeholder="e.g., Gold, Bitcoin, Economics, Politics" 
        className="w-full rounded-md border border-white/10 bg-transparent p-2 text-white outline-none placeholder:text-white/50" 
        value={typeof query.theme === 'string' ? query.theme : query.theme?.join(', ') || ''} 
        onChange={(e) => setQuery({ ...query, theme: e.target.value })} 
      />

      <label className="block text-xs text-gray-300">Similarity Threshold</label>
      <input 
        type="number" 
        min={0} 
        max={1} 
        step={0.1} 
        className="w-full rounded-md border border-white/10 bg-transparent p-2 text-white outline-none" 
        value={query.similarity_threshold ?? 0.3} 
        onChange={(e) => setQuery({ ...query, similarity_threshold: Number(e.target.value) })} 
      />

      <label className="block text-xs text-gray-300">Max Topics</label>
      <input 
        type="number" 
        min={1} 
        className="w-full rounded-md border border-white/10 bg-transparent p-2 text-white outline-none" 
        value={query.max_topics || ''} 
        placeholder="Optional limit"
        onChange={(e) => setQuery({ ...query, max_topics: e.target.value ? Number(e.target.value) : undefined })} 
      />

      <label className="block text-xs text-gray-300">Clustering Algorithm</label>
      <select 
        className="w-full rounded-md border border-white/10 bg-transparent p-2 text-white outline-none"
        value={query.clustering_algorithm ?? 'leiden'}
        onChange={(e) => setQuery({ ...query, clustering_algorithm: e.target.value })}
      >
        <option value="leiden" className="bg-gray-800">Leiden</option>
        <option value="louvain" className="bg-gray-800">Louvain</option>
        <option value="spectral" className="bg-gray-800">Spectral</option>
        <option value="modularity" className="bg-gray-800">Modularity</option>
      </select>

      <label className="block text-xs text-gray-300">Resolution</label>
      <input 
        type="number" 
        min={0.1} 
        max={5} 
        step={0.1} 
        className="w-full rounded-md border border-white/10 bg-transparent p-2 text-white outline-none" 
        value={query.resolution ?? 1.0} 
        onChange={(e) => setQuery({ ...query, resolution: Number(e.target.value) })} 
      />

      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          checked={query.use_gpu ?? true} 
          onChange={(e) => setQuery({ ...query, use_gpu: e.target.checked })} 
        />
        <label className="text-xs text-gray-200">Use GPU acceleration</label>
      </div>

      <div className="mt-3 flex gap-2">
        <button 
          className="rounded-md bg-sky-400 px-3 py-2 text-sm font-medium text-white transition hover:-translate-y-px hover:bg-sky-500 hover:shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed" 
          onClick={onFetch}
          disabled={loading}
        >
          {loading ? 'Fetching...' : 'Fetch Data'}
        </button>
        {canUseMock && (
          <button className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:-translate-y-px hover:bg-white/20 hover:shadow-lg" onClick={onLoadMock}>
            Load Sample
          </button>
        )}
      </div>
    </div>

    <div className="my-4 h-px w-full bg-white/10" />

    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-300">Link Distance</label>
        <input type="range" min={20} max={200} value={linkDistance} onChange={(e) => setLinkDistance(Number(e.target.value))} className="w-full" />
        <span className="text-xs text-sky-300">{linkDistance}</span>
      </div>
      <div>
        <label className="block text-xs text-gray-300">Charge Strength</label>
        <input type="range" min={-500} max={-50} value={chargeStrength} onChange={(e) => setChargeStrength(Number(e.target.value))} className="w-full" />
        <span className="text-xs text-sky-300">{chargeStrength}</span>
      </div>
      <div>
        <label className="block text-xs text-gray-300">Collision Radius</label>
        <input type="range" min={0} max={50} value={collisionPad} onChange={(e) => setCollisionPad(Number(e.target.value))} className="w-full" />
        <span className="text-xs text-sky-300">{collisionPad}</span>
      </div>
    </div>

    <div className="mt-4 flex items-center justify-between">
      <button className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:-translate-y-px hover:bg-white/20 hover:shadow-lg" onClick={() => window.dispatchEvent(new CustomEvent('forcegraph:restart'))}>Restart simulation</button>
      <label className="flex items-center gap-2 text-xs text-gray-200">
        <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} />
        Show all labels
      </label>
    </div>
  </div>
);
