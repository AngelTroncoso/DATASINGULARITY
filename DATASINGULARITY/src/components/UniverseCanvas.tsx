import React, { useState, useRef, useEffect } from 'react';
import { DataHubAssetNode, AgentId, TimelineOffset } from '../types';
import { Zap, FlaskConical, Activity, Dna, Clock, ShieldCheck, Eye, ZoomIn, ZoomOut, RefreshCw, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../i18n';

interface UniverseCanvasProps {
  assets: DataHubAssetNode[];
  selectedAsset: DataHubAssetNode | null;
  onSelectAsset: (asset: DataHubAssetNode) => void;
  selectedAgentId: AgentId | null;
  timelineOffset: TimelineOffset;
  highlightedUrns: string[];
}

export const UniverseCanvas: React.FC<UniverseCanvasProps> = ({
  assets,
  selectedAsset,
  onSelectAsset,
  selectedAgentId,
  timelineOffset,
  highlightedUrns,
}) => {
  const { t } = useLanguage();
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<DataHubAssetNode | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getNodeColor = (node: DataHubAssetNode) => {
    if (selectedAgentId === 'physics') {
      return node.physics.stressLevel > 80 ? '#F43F5E' : '#3B82F6';
    }
    if (selectedAgentId === 'chemistry') {
      return node.chemistry.toxicityRisk === 'HIGH' || node.chemistry.toxicityRisk === 'CRITICAL'
        ? '#EF4444'
        : '#10B981';
    }
    if (selectedAgentId === 'entropy') {
      return node.math.shannonEntropy > 2.5 ? '#F59E0B' : '#06B6D4';
    }
    if (selectedAgentId === 'genome') {
      return node.genome.vestigialStatus ? '#EC4899' : '#8B5CF6';
    }
    switch (node.type) {
      case 'DATASET':
        return '#2563EB'; // Blue-600
      case 'DATA_JOB':
        return '#10B981'; // Green
      case 'DASHBOARD':
      case 'CHART':
        return '#F59E0B'; // Amber
      case 'ML_MODEL':
        return '#8B5CF6'; // Purple
      default:
        return '#64748B';
    }
  };

  // Helper to map upstream/downstream connections
  const lineConnections = React.useMemo(() => {
    const lines: {
      id: string;
      source: DataHubAssetNode;
      target: DataHubAssetNode;
      isHighlighted: boolean;
      bondType: string;
    }[] = [];

    assets.forEach((sourceNode) => {
      sourceNode.downstreamUrns.forEach((targetUrn) => {
        const targetNode = assets.find((a) => a.urn === targetUrn);
        if (targetNode) {
          const isHighlighted =
            highlightedUrns.includes(sourceNode.urn) && highlightedUrns.includes(targetNode.urn);
          lines.push({
            id: `${sourceNode.urn}->${targetNode.urn}`,
            source: sourceNode,
            target: targetNode,
            isHighlighted,
            bondType: sourceNode.chemistry.formula,
          });
        }
      });
    });

    return lines;
  }, [assets, highlightedUrns]);

  return (
    <div className="relative w-full h-[520px] bg-[#050506] overflow-hidden select-none border-b border-white/10">
      
      {/* View Perspective Overlay Indicator */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 bg-[#0A0A0C]/90 p-2 rounded-sm border border-white/10 shadow-xl">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#050506] rounded-sm text-[10px] font-mono tracking-wider uppercase text-slate-300">
          <Eye className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-bold">
            {t.canvas.perspective}:{' '}
            <span className="text-blue-400">
              {selectedAgentId ? selectedAgentId.toUpperCase() : t.canvas.universe}
            </span>
          </span>
        </div>

        {timelineOffset !== 0 && (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-purple-500/10 border border-purple-500/30 rounded-sm text-[10px] font-mono tracking-wider uppercase text-purple-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.canvas.forecast}: +{timelineOffset}d</span>
          </div>
        )}
      </div>

      {/* Canvas Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-[#0A0A0C]/90 p-1 rounded-sm border border-white/10 shadow-xl">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.2, 2.5))}
          className="p-1.5 hover:bg-white/5 text-slate-300 rounded-sm transition-colors"
          title={t.canvas.zoomIn}
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.4))}
          className="p-1.5 hover:bg-white/5 text-slate-300 rounded-sm transition-colors"
          title={t.canvas.zoomOut}
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="p-1.5 hover:bg-white/5 text-slate-300 rounded-sm transition-colors"
          title={t.canvas.resetView}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main SVG Interactive Graph Canvas */}
      <svg
        ref={svgRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <defs>
          {/* Lineage Arrow Marker */}
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="22"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
          </marker>

          <marker
            id="arrowhead-highlight"
            markerWidth="10"
            markerHeight="7"
            refX="22"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#2563EB" />
          </marker>

          {/* Glow Filters */}
          <filter id="glow-physics" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Geometric Grid Background */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#18181F" strokeWidth="0.75" />
          </pattern>
          <rect x="-1000" y="-1000" width="3000" height="3000" fill="url(#grid)" />

          {/* Render Lineage Connections */}
          {lineConnections.map((conn) => {
            const isHovered =
              hoveredNode?.urn === conn.source.urn || hoveredNode?.urn === conn.target.urn;
            const strokeColor = conn.isHighlighted
              ? '#2563EB'
              : isHovered
              ? '#38BDF8'
              : selectedAgentId === 'chemistry'
              ? '#10B981'
              : '#334155';

            return (
              <g key={conn.id}>
                <line
                  x1={conn.source.x}
                  y1={conn.source.y}
                  x2={conn.target.x}
                  y2={conn.target.y}
                  stroke={strokeColor}
                  strokeWidth={conn.isHighlighted ? 3 : isHovered ? 2.5 : 1.5}
                  strokeDasharray={
                    selectedAgentId === 'chemistry' ? '6,3' : conn.source.genome.vestigialStatus ? '4,4' : 'none'
                  }
                  markerEnd={conn.isHighlighted ? 'url(#arrowhead-highlight)' : 'url(#arrowhead)'}
                  className="transition-all duration-300"
                />

                {/* Chemical Bond Formula Tag on Connection in Chemistry Mode */}
                {selectedAgentId === 'chemistry' && (
                  <text
                    x={(conn.source.x + conn.target.x) / 2}
                    y={(conn.source.y + conn.target.y) / 2 - 8}
                    fill="#10B981"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    Bond: {conn.source.chemistry.bondStrength}%
                  </text>
                )}
              </g>
            );
          })}

          {/* Render Asset Nodes */}
          {assets.map((asset) => {
            const isSelected = selectedAsset?.urn === asset.urn;
            const isHighlighted = highlightedUrns.includes(asset.urn);

            // Physics Force Vector Radius
            const radius = Math.max(16, Math.min(32, asset.physics.mass / 4));
            const nodeColor = getNodeColor(asset);

            return (
              <g
                key={asset.urn}
                transform={`translate(${asset.x}, ${asset.y})`}
                onClick={() => onSelectAsset(asset)}
                onMouseEnter={() => setHoveredNode(asset)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer group"
              >
                {/* Blast Radius Wave Effect */}
                {(isSelected || isHighlighted || (selectedAgentId === 'physics' && asset.physics.stressLevel > 80)) && (
                  <circle
                    r={radius + asset.physics.blastRadius * 1.5}
                    fill={nodeColor}
                    fillOpacity="0.12"
                    stroke={nodeColor}
                    strokeWidth="1"
                    strokeDasharray="4,4"
                    className="animate-pulse"
                  />
                )}

                {/* Physics Kinetic Halos */}
                {selectedAgentId === 'physics' && (
                  <circle
                    r={radius + 8}
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="1.5"
                    strokeOpacity="0.6"
                  />
                )}

                {/* Entropy Heat Glow */}
                {selectedAgentId === 'entropy' && asset.math.shannonEntropy > 2.0 && (
                  <circle
                    r={radius + 10}
                    fill="#F59E0B"
                    fillOpacity="0.25"
                    filter="url(#glow-physics)"
                  />
                )}

                {/* Main Asset Node (Geometric Square or Rounded Circle) */}
                <rect
                  x={-radius}
                  y={-radius}
                  width={radius * 2}
                  height={radius * 2}
                  rx="4"
                  fill={nodeColor}
                  stroke={isSelected ? '#FFFFFF' : isHighlighted ? '#2563EB' : '#0F0F12'}
                  strokeWidth={isSelected ? 3 : 1.5}
                  className="transition-all duration-300 shadow-xl"
                />

                {/* Platform Badge / Icon inside node */}
                <text
                  textAnchor="middle"
                  dy="4"
                  fill="#FFFFFF"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                  className="pointer-events-none uppercase"
                >
                  {asset.platform.substring(0, 3)}
                </text>

                {/* Asset Label */}
                <text
                  x={radius + 8}
                  y="4"
                  fill={isSelected ? '#FFFFFF' : '#CBD5E1'}
                  fontSize="11"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  fontFamily="sans-serif"
                  className="pointer-events-none uppercase tracking-wider"
                >
                  {asset.name}
                </text>

                {/* Subtitle Details according to Selected Perspective */}
                <text
                  x={radius + 8}
                  y="18"
                  fill="#64748B"
                  fontSize="9"
                  fontFamily="monospace"
                  className="pointer-events-none uppercase tracking-wider"
                >
                  {selectedAgentId === 'physics' && `F: ${(asset.physics.momentum / 1000).toFixed(1)}kN | Blast: ${asset.physics.blastRadius}`}
                  {selectedAgentId === 'chemistry' && `ΔG: ${asset.chemistry.gibbsFreeEnergyDelta} kJ/mol`}
                  {selectedAgentId === 'entropy' && `H: ${asset.math.shannonEntropy} bits`}
                  {selectedAgentId === 'genome' && (asset.genome.vestigialStatus ? '⚠️ VESTIGIAL APPENDIX' : asset.genome.dnaSequence.substring(0, 14))}
                  {!selectedAgentId && `${asset.type} • ${asset.owner.split('@')[0]}`}
                </text>

                {/* Vestigial Appendix Warning Icon */}
                {asset.genome.vestigialStatus && (
                  <g transform={`translate(-${radius + 4}, -${radius + 4})`}>
                    <rect width="14" height="14" rx="2" fill="#EC4899" />
                    <text
                      textAnchor="middle"
                      x="7"
                      y="10"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      !
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Hover Info Card */}
      {hoveredNode && (
        <div className="absolute bottom-4 left-4 z-20 bg-[#0A0A0C]/95 p-3.5 rounded-sm border border-white/10 shadow-2xl text-xs font-mono max-w-xs text-slate-200">
          <div className="font-bold text-xs text-blue-400 uppercase tracking-wider flex items-center justify-between">
            <span>{hoveredNode.name}</span>
            <span className="text-[9px] uppercase px-1.5 py-0.5 bg-[#050506] rounded-sm border border-white/10 text-slate-400">
              {hoveredNode.platform}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
            {hoveredNode.description}
          </p>
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/10 text-[9px] tracking-wider uppercase">
            <div>
              <span className="text-slate-500">Mass:</span> {hoveredNode.physics.mass}kg
            </div>
            <div>
              <span className="text-slate-500">Reactivity:</span> {hoveredNode.chemistry.reactivityIndex}%
            </div>
            <div>
              <span className="text-slate-500">Entropy:</span> {hoveredNode.math.shannonEntropy} bits
            </div>
            <div>
              <span className="text-slate-500">Fail Rate:</span> {(hoveredNode.math.bayesianFailureProbability * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
