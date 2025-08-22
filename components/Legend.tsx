'use client';
import React, { useMemo } from 'react';
import { summarizeCommunities } from '@/lib/graph';
import type { Node } from '@/lib/types';

export const Legend: React.FC<{ nodes: Node[] }> = ({ nodes }) => {
  const items = useMemo(() => summarizeCommunities(nodes), [nodes]);
  return (
    <div className="absolute right-5 top-5 z-50 rounded-xl border border-white/10 bg-[rgba(20,20,30,0.9)] p-5 shadow-xl backdrop-blur-md">
      <div className="mb-3 text-sm font-semibold text-sky-300">Topic Communities</div>
      <div className="space-y-2 text-xs text-white">
        {items.map((it) => (
          <div key={it.community} className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full shadow" style={{ background: it.color }} />
            <span>Community {it.community}</span>
            <span className="ml-auto text-white/60">{it.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
