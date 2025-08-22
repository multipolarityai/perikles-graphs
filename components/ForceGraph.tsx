'use client';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { COMMUNITY_COLORS, cloneGraphData, generateLinksFromCommunities } from '@/lib/graph';
import type { GraphData } from '@/lib/types';

export type ForceGraphProps = {
  data: GraphData | null;
  width?: number;
  height?: number;
  linkDistance: number;
  chargeStrength: number;
  collisionPad: number;
  showLabels: boolean;
};

export const ForceGraph: React.FC<ForceGraphProps> = ({
  data,
  width,
  height,
  linkDistance,
  chargeStrength,
  collisionPad,
  showLabels,
}) => {
  const [dimensions, setDimensions] = React.useState({ width: 1200, height: 800 });
  const [isMounted, setIsMounted] = React.useState(false);
  
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const simulationRef = useRef<d3.Simulation<any, undefined> | null>(null);

  React.useEffect(() => {
    setIsMounted(true);
    const updateDimensions = () => {
      setDimensions({
        width: width || window.innerWidth,
        height: height || window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [width, height]);

  useEffect(() => {
    if (!isMounted || !svgRef.current || !gRef.current) return;

    const root = d3.select(svgRef.current);
    const g = d3.select(gRef.current);
    g.selectAll('*').remove();

    if (!data || data.nodes.length === 0) {
      const defs = root.append('defs');
      const filter = defs.append('filter').attr('id', 'glow');
      filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

      g.append('text')
        .attr('x', dimensions.width / 2)
        .attr('y', dimensions.height / 2 - 10)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .style('font-size', 16)
        .text('Use the panel to load data and render the network');
      return;
    }

    const { nodes, links: inputLinks = [] } = cloneGraphData(data);
    const links = inputLinks.length > 0 ? inputLinks : generateLinksFromCommunities(nodes);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
      });

    root.call(zoom as any);

    const defs = root.append('defs');
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const link = g
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-linecap', 'round')
      .attr('pointer-events', 'none')
      .attr('class', (d: any) => (d.type === 'intra' ? 'intra' : 'inter'))
      .attr('stroke', (d: any) => (d.type === 'intra' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'))
      .attr('stroke-dasharray', (d: any) => (d.type === 'inter' ? '2,3' : null))
      .attr('stroke-width', (d: any) => d.strength * 2);

    const node = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g.node')
      .data(nodes, (d: any) => d.id)
      .join((enter) => {
        const ng = enter.append('g').attr('class', 'node');

        ng.append('circle')
          .attr('r', (d: any) => Math.sqrt(d.articles) * 3)
          .attr('fill', (d: any) => COMMUNITY_COLORS[d.community] || '#999')
          .style('filter', 'url(#glow)');

        ng.append('text')
          .attr('dy', '.35em')
          .attr('text-anchor', 'middle')
          .style('font-size', '11px')
          .style('font-weight', 600)
          .style('fill', '#fff')
          .style('text-shadow', '0 0 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5)')
          .style('opacity', (d: any) => (showLabels || d.articles > 30 ? 1 : 0))
          .text((d: any) => (showLabels || d.articles > 30 ? d.label : ''));

        return ng;
      });

    const showTooltip = (evt: MouseEvent, d: any) => {
      const tip = tooltipRef.current;
      if (!tip) return;

      const connected = new Set<string>();
      links.forEach((l: any) => {
        const sid = typeof l.source === 'object' ? (l.source as any).id : (l.source as any);
        const tid = typeof l.target === 'object' ? (l.target as any).id : (l.target as any);
        if (sid === d.id) connected.add(tid as string);
        if (tid === d.id) connected.add(sid as string);
      });

      node.style('opacity', (n: any) => (connected.has(n.id) || n.id === d.id ? 1 : 0.3));
      link.style('opacity', (l: any) => {
        const sid = typeof l.source === 'object' ? (l.source as any).id : (l.source as any);
        const tid = typeof l.target === 'object' ? (l.target as any).id : (l.target as any);
        return sid === d.id || tid === d.id ? 0.8 : 0.1;
      });

      const bounds = (evt.currentTarget as SVGGElement).getBoundingClientRect();
      tip.style.opacity = '1';
      tip.style.left = bounds.left + bounds.width / 2 + 'px';
      tip.style.top = bounds.top - 10 + 'px';
      tip.style.transform = 'translateX(-50%) translateY(-100%)';
      tip.innerHTML = `
        <strong style="color:#4fc3f7;display:block;margin-bottom:8px;font-size:14px">${d.label}</strong>
        <div style="display:flex;justify-content:space-between;margin:4px 0;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.1)">
          <span style="color:#aaa">Community</span>
          <span style="color:#fff;font-weight:600">${d.community}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin:4px 0;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.1)">
          <span style="color:#aaa">Articles</span>
          <span style="color:#fff;font-weight:600">${d.articles}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin:4px 0;padding:4px 0;">
          <span style="color:#aaa">Connections</span>
          <span style="color:#fff;font-weight:600">${connected.size}</span>
        </div>
      `;
    };

    const hideTooltip = () => {
      const tip = tooltipRef.current;
      if (!tip) return;
      node.style('opacity', 1);
      link.style('opacity', (l: any) => (l.type === 'intra' ? 0.15 : 0.05));
      tip.style.opacity = '0';
    };

    const drag = d3
      .drag<SVGGElement, any>()
      .on('start', (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0.3).restart();
        (d as any).fx = (d as any).x;
        (d as any).fy = (d as any).y;
      })
      .on('drag', (event, d) => {
        (d as any).fx = event.x;
        (d as any).fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0);
        (d as any).fx = null;
        (d as any).fy = null;
      });

    node.on('mouseover', function (event, d) { showTooltip(event as unknown as MouseEvent, d); })
        .on('mouseout', hideTooltip)
        .call(drag as any);

    const sim = d3
      .forceSimulation(nodes as any)
      .force(
        'link',
        d3
          .forceLink(links as any)
          .id((d: any) => (d as any).id)
          .distance((d: any) => (d.type === 'intra' ? linkDistance : linkDistance * 2))
          .strength((d: any) => d.strength)
      )
      .force('charge', d3.forceManyBody().strength(chargeStrength as any).distanceMax(400))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => Math.sqrt((d as any).articles) * 3 + collisionPad))
      .force(
        'x',
        d3
          .forceX()
          .x((d: any) => ({ 0: dimensions.width * 0.3, 1: dimensions.width * 0.7, 2: dimensions.width * 0.5, 3: dimensions.width * 0.3, 4: dimensions.width * 0.7 }[(d as any).community]))
          .strength(0.05)
      )
      .force(
        'y',
        d3
          .forceY()
          .y((d: any) => ({ 0: dimensions.height * 0.35, 1: dimensions.height * 0.35, 2: dimensions.height * 0.5, 3: dimensions.height * 0.65, 4: dimensions.height * 0.65 }[(d as any).community]))
          .strength(0.05)
      );

    simulationRef.current = sim as any;

    sim.on('tick', () => {
      link
        .attr('x1', (d: any) => (typeof d.source === 'object' ? (d.source as any).x : 0))
        .attr('y1', (d: any) => (typeof d.source === 'object' ? (d.source as any).y : 0))
        .attr('x2', (d: any) => (typeof d.target === 'object' ? (d.target as any).x : 0))
        .attr('y2', (d: any) => (typeof d.target === 'object' ? (d.target as any).y : 0));

      node.attr('transform', (d: any) => `translate(${(d as any).x},${(d as any).y})`);
    });

    const fit = () => {
      const bounds = (g.node() as SVGGElement).getBBox();
      const fullWidth = dimensions.width;
      const fullHeight = dimensions.height;
      const widthScale = fullWidth / bounds.width;
      const heightScale = fullHeight / bounds.height;
      const scale = 0.8 * Math.min(widthScale, heightScale);
      const translate = [
        fullWidth / 2 - scale * (bounds.x + bounds.width / 2),
        fullHeight / 2 - scale * (bounds.y + bounds.height / 2),
      ];
      root.transition().duration(750).call((zoom as any).transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
    };
    const t = setTimeout(fit, 600);

    return () => {
      clearTimeout(t);
      sim.stop();
      simulationRef.current = null;
    };
  }, [data, linkDistance, chargeStrength, collisionPad, showLabels, dimensions.width, dimensions.height]);

  // Don't render the graph until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-[linear-gradient(135deg,#1e3c72_0%,#2a5298_100%)]">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[linear-gradient(135deg,#1e3c72_0%,#2a5298_100%)]">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="block">
        <g ref={gRef} />
      </svg>

      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-50 rounded-lg border border-white/10 bg-[rgba(20,20,30,0.95)] px-4 py-3 text-sm text-white shadow-2xl backdrop-blur-md"
        style={{ opacity: 0, maxWidth: 350, lineHeight: 1.5 }}
      />
    </div>
  );
};
