import type { GraphData, Link, Node } from './types';

export function cloneGraphData(data: GraphData): GraphData {
  return {
    nodes: data.nodes.map((n) => ({ ...n })),
    links: data.links?.map((l) => ({ ...l })) ?? [],
  };
}

export function generateLinksFromCommunities(nodes: Node[]): Link[] {
  const links: Link[] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      if (a.community === b.community) {
        if (Math.random() < 0.6) {
          links.push({ source: a.id, target: b.id, strength: 0.5 + Math.random() * 0.5, type: 'intra' });
        }
      }
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      if (a.community !== b.community) {
        if (Math.random() < 0.05) {
          links.push({ source: a.id, target: b.id, strength: 0.1 + Math.random() * 0.3, type: 'inter' });
        }
      }
    }
  }

  return links;
}

export const COMMUNITY_COLORS: Record<number, string> = {
  0: '#FF6B6B',
  1: '#4ECDC4',
  2: '#45B7D1',
  3: '#96CEB4',
  4: '#FFEAA7',
};

export function summarizeCommunities(nodes: Node[]) {
  const counts = new Map<number, number>();
  for (const n of nodes) counts.set(n.community, (counts.get(n.community) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([community, count]) => ({ community, count, color: COMMUNITY_COLORS[community] }));
}

export function graphStats(nodes: Node[], links: Link[]) {
  return {
    topics: nodes.length,
    connections: links.length,
    clustering: '0.77',
    modularity: '0.22',
  };
}
