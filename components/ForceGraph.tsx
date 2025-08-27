'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { generateCommunityColor, cloneGraphData, generateLinksFromCommunities } from '@/lib/graph';
import type { GraphData, Node } from '@/lib/types';

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
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
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

    // Add click handler to clear selection when clicking on empty space
    root.on('click', function(event) {
      if (event.target === svgRef.current) {
        setSelectedNode(null);
        // Reset all highlighting
        node.style('opacity', 1);
        link.style('opacity', (l: any) => (l.type === 'intra' ? 0.15 : 0.05));
      }
    });

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
          .attr('fill', (d: any) => generateCommunityColor(d.community))
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
      
      // Enhanced tooltip content with insights
      let tooltipContent = `
        <strong style="color:#4fc3f7;display:block;margin-bottom:8px;font-size:14px">${d.label}</strong>
        <div style="display:flex;justify-content:space-between;margin:4px 0;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.1)">
          <span style="color:#aaa">Community</span>
          <span style="color:#fff;font-weight:600">${d.community}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin:4px 0;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.1)">
          <span style="color:#aaa">Articles</span>
          <span style="color:#fff;font-weight:600">${d.articles}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin:4px 0;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.1)">
          <span style="color:#aaa">Connections</span>
          <span style="color:#fff;font-weight:600">${connected.size}</span>
        </div>`;
      
      if (d.theme) {
        tooltipContent += `
        <div style="display:flex;justify-content:space-between;margin:4px 0;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.1)">
          <span style="color:#aaa">Theme</span>
          <span style="color:#fff;font-weight:600">${d.theme}</span>
        </div>`;
      }
      
      if (d.confidence !== undefined) {
        tooltipContent += `
        <div style="display:flex;justify-content:space-between;margin:4px 0;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.1)">
          <span style="color:#aaa">Confidence</span>
          <span style="color:#fff;font-weight:600">${(d.confidence * 100).toFixed(1)}%</span>
        </div>`;
      }
      
      if (d.description) {
        tooltipContent += `
        <div style="margin:8px 0;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.1)">
          <span style="color:#aaa;display:block;margin-bottom:4px">Description</span>
          <span style="color:#fff;font-size:12px;font-style:italic">"${d.description.length > 120 ? d.description.substring(0, 120) + '...' : d.description}"</span>
        </div>`;
      }
      
      if (d.insights && d.insights.length > 0) {
        tooltipContent += `
        <div style="margin:8px 0;padding:4px 0">
          <span style="color:#aaa;display:block;margin-bottom:4px">Key Insights</span>
          <div style="max-height:100px;overflow-y:auto">`;
        
        d.insights.slice(0, 3).forEach((insight: string) => {
          tooltipContent += `
            <div style="color:#fff;font-size:11px;margin:2px 0;padding:3px 6px;background:rgba(79,195,247,0.2);border-radius:3px">
              • ${insight.length > 80 ? insight.substring(0, 80) + '...' : insight}
            </div>`;
        });
        
        if (d.insights.length > 3) {
          tooltipContent += `
            <div style="color:#aaa;font-size:10px;margin-top:4px;font-style:italic">
              +${d.insights.length - 3} more insights...
            </div>`;
        }
        
        tooltipContent += `</div></div>`;
      }
      
      if (d.referenceDate) {
        tooltipContent += `
        <div style="margin-top:8px;padding-top:4px;border-top:1px solid rgba(255,255,255,0.1)">
          <span style="color:#aaa;font-size:10px">${d.referenceDate}</span>
        </div>`;
      }
      
      tip.innerHTML = tooltipContent;
    };

    const hideTooltip = () => {
      const tip = tooltipRef.current;
      if (!tip) return;
      node.style('opacity', 1);
      link.style('opacity', (l: any) => (l.type === 'intra' ? 0.15 : 0.05));
      tip.style.opacity = '0';
    };

    const handleNodeClick = (event: MouseEvent, d: any) => {
      event.stopPropagation();
      setSelectedNode(d);
      
      // Highlight connected nodes for the clicked node
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
        .on('click', function (event, d) { handleNodeClick(event as unknown as MouseEvent, d); })
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
          .x((d: any) => {
            const communityIdx = typeof d.community === 'number' ? d.community : parseInt(d.community, 10);
            const xMap: Record<number, number> = {
              0: dimensions.width * 0.3,
              1: dimensions.width * 0.7,
              2: dimensions.width * 0.5,
              3: dimensions.width * 0.3,
              4: dimensions.width * 0.7,
            };
            return xMap[communityIdx] ?? (dimensions.width / 2);
          })
          .strength(0.05)
      )
      .force(
        'y',
        d3
          .forceY()
          .y((d: any) => {
            const communityIdx = typeof d.community === 'number' ? d.community : parseInt(d.community, 10);
            const yMap: Record<number, number> = {
              0: dimensions.height * 0.35,
              1: dimensions.height * 0.35,
              2: dimensions.height * 0.5,
              3: dimensions.height * 0.65,
              4: dimensions.height * 0.65,
            };
            return yMap[communityIdx] ?? (dimensions.height / 2);
          })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        className="pointer-events-none absolute z-50 rounded-lg border border-white/10 bg-[rgba(20,20,30,0.95)] px-4 py-3 text-sm text-white shadow-2xl backdrop-blur-md opacity-0 max-w-[350px] leading-[1.5]"
      />

      {/* Persistent Detail Panel */}
      {selectedNode && (
        <div className="absolute top-4 right-4 w-96 max-h-[80vh] bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
          <div className="p-4 border-b border-gray-200 bg-white/90">
            <div className="flex justify-between items-start">
              <h2 className="font-bold text-lg text-gray-900 pr-4">{selectedNode.label}</h2>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
            <div className="p-4 space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-blue-600 font-medium">Articles</div>
                  <div className="text-xl font-bold text-blue-800">{selectedNode.articles}</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-green-600 font-medium">Community</div>
                  <div className="text-xl font-bold text-green-800">{selectedNode.community}</div>
                </div>
              </div>

              {/* Theme and Confidence */}
              {(selectedNode.theme || selectedNode.confidence !== undefined) && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedNode.theme && (
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-purple-600 font-medium">Theme</div>
                      <div className="font-bold text-purple-800">{selectedNode.theme}</div>
                    </div>
                  )}
                  {selectedNode.confidence !== undefined && (
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="text-orange-600 font-medium">Confidence</div>
                      <div className="text-xl font-bold text-orange-800">{(selectedNode.confidence * 100).toFixed(1)}%</div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              {selectedNode.description && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 italic leading-relaxed">"{selectedNode.description}"</p>
                </div>
              )}

              {/* Full Insights List */}
              {selectedNode.insights && selectedNode.insights.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Key Insights ({selectedNode.insights.length})</h3>
                  <div className="space-y-3">
                    {selectedNode.insights.map((insight, index) => (
                      <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <div className="text-blue-800 leading-relaxed">{insight}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reference Date */}
              {selectedNode.referenceDate && (
                <div className="text-xs text-gray-500 border-t pt-3">
                  <span className="font-medium">Reference Date:</span> {selectedNode.referenceDate}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
