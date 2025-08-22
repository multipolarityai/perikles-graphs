'use client';
import React, { useMemo } from 'react';
import { graphStats } from '@/lib/graph';
import type { Link, Node } from '@/lib/types';

export const StatsBar: React.FC<{ nodes: Node[]; links: Link[] }> = ({ nodes, links }) => {
  const s = useMemo(() => graphStats(nodes, links), [nodes, links]);
  return (
    <div className="pointer-events-none absolute bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-white/10 bg-[rgba(20,20,30,0.9)] px-6 py-3 shadow-xl backdrop-blur-md">
      <div className="flex gap-8 text-center">
        <div>
          <div className="text-lg font-bold text-sky-300">{s.topics}</div>
          <div className="text-[11px] text-white/70">Topics</div>
        </div>
        <div>
          <div className="text-lg font-bold text-sky-300">{s.connections}</div>
          <div className="text-[11px] text-white/70">Connections</div>
        </div>
        <div>
          <div className="text-lg font-bold text-sky-300">{s.clustering}</div>
          <div className="text-[11px] text-white/70">Clustering</div>
        </div>
        <div>
          <div className="text-lg font-bold text-sky-300">{s.modularity}</div>
          <div className="text-[11px] text-white/70">Modularity</div>
        </div>
      </div>
    </div>
  );
};
