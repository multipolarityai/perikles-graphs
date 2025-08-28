'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ForceGraph } from '@/components/ForceGraph';
import { Controls } from '@/components/Controls';
import { Legend } from '@/components/Legend';
import { StatsBar } from '@/components/StatsBar';
import { Navigation } from '@/components/Navigation';
import { fetchGraphData } from '@/lib/api';
import { generateLinksFromCommunities } from '@/lib/graph';
import type { GraphData, Query } from '@/lib/types';
import { getMockGraph } from '@/data/mock';
import { useRestartSignal } from '@/lib/useRestartSignal';

export default function Page() {
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Calculate yesterday's date dynamically
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
  const [query, setQuery] = useState<Query>({ 
    start_date: yesterdayString, 
    end_date: yesterdayString, 
    theme: ['Gold'], // Default to single theme in array
    similarity_threshold: 0.3,
    clustering_algorithm: 'leiden',
    resolution: 1.0,
    use_gpu: true,
    random_state: 42,
    max_iterations: 100,
    max_topics: 100, // Limit to 100 topics for faster processing
    save_to_db: false
  });

  const [showLabels, setShowLabels] = useState(false);
  const [linkDistance, setLinkDistance] = useState(80);
  const [chargeStrength, setChargeStrength] = useState(-200);
  const [collisionPad, setCollisionPad] = useState(15);

  const canUseMock = useMemo(() => true, []); // Always allow mock data as fallback

  const handleFetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchGraphData(query);
      setGraph({ nodes: data.nodes, links: data.links ?? generateLinksFromCommunities(data.nodes) });
      console.log('Successfully fetched data:', data);
    } catch (err) {
      console.error('Fetch error:', err);
      alert(`Fetching failed: ${err instanceof Error ? err.message : 'Unknown error'}. You can try the sample data instead.`);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleLoadMock = useCallback(() => { setGraph(getMockGraph()); }, []);

  useEffect(() => { 
    // Load mock data by default
    setGraph(getMockGraph()); 
  }, []);

  useRestartSignal(() => {
    setLinkDistance((d) => d + 0.0001);
    setTimeout(() => setLinkDistance((d) => d - 0.0001), 0);
  });

  const nodes = graph?.nodes ?? [];
  const links = graph?.links ?? [];

  return (
    <main className="relative h-screen w-screen">
      <Navigation />
      
      {/* Main content with top padding to account for navigation */}
      <div className="pt-20 h-full">
        <ForceGraph data={graph} linkDistance={linkDistance} chargeStrength={chargeStrength} collisionPad={collisionPad} showLabels={showLabels} />
      </div>

      <Controls
        query={query}
        setQuery={setQuery}
        onFetch={handleFetch}
        onLoadMock={handleLoadMock}
        loading={loading}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
        linkDistance={linkDistance}
        setLinkDistance={setLinkDistance}
        chargeStrength={chargeStrength}
        setChargeStrength={setChargeStrength}
        collisionPad={collisionPad}
        setCollisionPad={setCollisionPad}
        canUseMock={canUseMock}
      />

      {nodes.length > 0 && <Legend nodes={nodes} />}
      {nodes.length > 0 && <StatsBar nodes={nodes} links={links} />}
      
      {/* Add metadata display if available */}
      {graph?.metadata && (
        <div className="absolute top-24 right-4 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-lg max-w-xs z-40">
          <h3 className="font-semibold text-gray-900 border-b pb-1 mb-2 text-sm">Network Analysis</h3>
          <div className="space-y-1 text-xs">
            {graph.metadata.algorithmUsed && (
              <div>
                <span className="text-gray-600">Algorithm:</span>
                <span className="ml-1 font-medium capitalize">{graph.metadata.algorithmUsed}</span>
              </div>
            )}
            {graph.metadata.modularityScore !== undefined && (
              <div>
                <span className="text-gray-600">Modularity:</span>
                <span className="ml-1 font-medium">{graph.metadata.modularityScore.toFixed(3)}</span>
              </div>
            )}
            {graph.metadata.processingTime && (
              <div>
                <span className="text-gray-600">Processing:</span>
                <span className="ml-1 font-medium">{graph.metadata.processingTime.toFixed(2)}s</span>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
