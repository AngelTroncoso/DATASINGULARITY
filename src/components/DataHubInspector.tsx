import React, { useState } from 'react';
import { DataHubAssetNode } from '../types';
import { X, Zap, FlaskConical, Activity, Dna, ShieldCheck, Database, GitFork, User, Tag, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n';

interface DataHubInspectorProps {
  asset: DataHubAssetNode | null;
  onClose: () => void;
  onShieldAsset: (asset: DataHubAssetNode) => void;
  onPurgeVestigial: (urn: string) => void;
}

export const DataHubInspector: React.FC<DataHubInspectorProps> = ({
  asset,
  onClose,
  onShieldAsset,
  onPurgeVestigial,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'physics' | 'chemistry' | 'math' | 'genome'>('overview');

  if (!asset) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-[#0A0A0C] border-l border-white/10 shadow-2xl z-50 flex flex-col font-sans text-slate-200 select-none">
      
      {/* Header */}
      <div className="p-4 bg-[#050506] border-b border-white/10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-blue-500 bg-blue-500/10 rounded-sm text-blue-400 font-bold font-mono text-[10px] uppercase flex items-center justify-center">
            {asset.platform.substring(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono px-2 py-0.5 bg-white/5 text-slate-300 border border-white/10 rounded-sm font-bold uppercase tracking-wider">
                {asset.type}
              </span>
              {asset.genome.vestigialStatus && (
                <span className="text-[9px] font-mono px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-sm font-bold uppercase tracking-widest">
                  {t.inspector.vestigialWarning}
                </span>
              )}
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono mt-1">{asset.name}</h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-sm transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-[#050506] border-b border-white/10 px-2 overflow-x-auto text-[11px] font-mono uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-blue-500 text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          {t.inspector.overview}
        </button>
        <button
          onClick={() => setActiveTab('physics')}
          className={`px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'physics'
              ? 'border-blue-500 text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{t.inspector.physics}</span>
        </button>
        <button
          onClick={() => setActiveTab('chemistry')}
          className={`px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'chemistry'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>{t.inspector.chemistry}</span>
        </button>
        <button
          onClick={() => setActiveTab('math')}
          className={`px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'math'
              ? 'border-amber-500 text-amber-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{t.inspector.math}</span>
        </button>
        <button
          onClick={() => setActiveTab('genome')}
          className={`px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'genome'
              ? 'border-pink-500 text-pink-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Dna className="w-3.5 h-3.5" />
          <span>{t.inspector.genome}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div>
              <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{t.inspector.datahubUrn}</label>
              <div className="p-2.5 bg-[#050506] border border-white/10 rounded-sm font-mono text-[10px] text-blue-400 break-all select-all mt-1">
                {asset.urn}
              </div>
            </div>

            <div>
              <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{t.inspector.description}</label>
              <p className="p-3 bg-[#050506] border border-white/10 rounded-sm text-slate-300 text-[11px] leading-relaxed mt-1 font-sans">
                {asset.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#050506] border border-white/10 rounded-sm">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <User className="w-3 h-3" /> {t.inspector.owner}
                </span>
                <span className="font-mono text-slate-200 font-bold text-[11px] mt-0.5 block truncate">
                  {asset.owner}
                </span>
              </div>
              <div className="p-3 bg-[#050506] border border-white/10 rounded-sm">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Database className="w-3 h-3" /> {t.inspector.schemaFields}
                </span>
                <span className="font-mono text-slate-200 font-bold text-[11px] mt-0.5 block">
                  {asset.schemaFieldsCount} {t.inspector.columns}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                <Tag className="w-3 h-3" /> {t.inspector.tags}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {asset.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-[#050506] text-blue-400 border border-white/10 rounded-sm font-mono text-[9px] uppercase tracking-wider"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2">
              <button
                onClick={() => onShieldAsset(asset)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-sm font-bold font-mono text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 shadow transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.inspector.generateShield}</span>
              </button>

              {asset.genome.vestigialStatus && (
                <button
                  onClick={() => onPurgeVestigial(asset.urn)}
                  className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-sm font-bold font-mono text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <X className="w-4 h-4" />
                  <span>{t.inspector.purgeVestigial}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* PHYSICS TAB */}
        {activeTab === 'physics' && (
          <div className="space-y-3 font-mono">
            <div className="p-3 bg-[#050506] border border-blue-500/40 rounded-sm">
              <div className="text-[9px] uppercase tracking-widest text-blue-400 font-bold mb-1">
                Physics Kinetic Vector State
              </div>
              <div className="text-xs font-bold text-white">
                F = ({(asset.physics.momentum / 1000).toFixed(1)} kN)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-[#050506] border border-white/10 rounded-sm">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">Mass (Importance):</span>
                <div className="text-sm font-bold text-slate-200 mt-1">{asset.physics.mass} kg</div>
              </div>
              <div className="p-3 bg-[#050506] border border-white/10 rounded-sm">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">Update Velocity:</span>
                <div className="text-sm font-bold text-slate-200 mt-1">{asset.physics.velocity} ev/s</div>
              </div>
              <div className="p-3 bg-[#050506] border border-white/10 rounded-sm">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">Kinetic Stress:</span>
                <div className="text-sm font-bold text-amber-400 mt-1">{asset.physics.stressLevel}%</div>
              </div>
              <div className="p-3 bg-[#050506] border border-white/10 rounded-sm">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">Blast Radius:</span>
                <div className="text-sm font-bold text-rose-400 mt-1">{asset.physics.blastRadius} nodes</div>
              </div>
            </div>
          </div>
        )}

        {/* CHEMISTRY TAB */}
        {activeTab === 'chemistry' && (
          <div className="space-y-3 font-mono">
            <div className="p-3 bg-[#050506] border border-emerald-500/40 rounded-sm">
              <div className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold mb-1">
                Chemical Formula & Enthalpy
              </div>
              <div className="text-xs font-bold text-white">{asset.chemistry.formula}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-[#050506] border border-white/10 rounded-sm">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">Gibbs ΔG:</span>
                <div className="text-sm font-bold text-emerald-400 mt-1">{asset.chemistry.gibbsFreeEnergyDelta} kJ/mol</div>
              </div>
              <div className="p-3 bg-[#050506] border border-white/10 rounded-sm">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">Bond Strength:</span>
                <div className="text-sm font-bold text-slate-200 mt-1">{asset.chemistry.bondStrength}%</div>
              </div>
              <div className="p-3 bg-[#050506] border border-white/10 rounded-sm">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">Reactivity:</span>
                <div className="text-sm font-bold text-amber-400 mt-1">{asset.chemistry.reactivityIndex}%</div>
              </div>
              <div className="p-3 bg-[#050506] border border-white/10 rounded-sm">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">Toxicity Risk:</span>
                <div className="text-sm font-bold text-rose-400 mt-1">{asset.chemistry.toxicityRisk}</div>
              </div>
            </div>
          </div>
        )}

        {/* MATHEMATICS TAB */}
        {activeTab === 'math' && (
          <div className="space-y-3 font-mono">
            <div className="p-3 bg-[#050506] border border-amber-500/40 rounded-sm">
              <div className="text-[9px] uppercase tracking-widest text-amber-400 font-bold mb-1">
                Shannon Information Entropy H(X)
              </div>
              <div className="text-xs font-bold text-white">
                {asset.math.shannonEntropy} bits (Ambiguity Score)
              </div>
            </div>

            <div className="p-3 bg-[#050506] border border-white/10 rounded-sm space-y-2">
              <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                Monte Carlo Simulation (1,000 Trial Distribution)
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500">Failure Rate:</span>{' '}
                  <span className="font-bold text-rose-400">
                    {asset.math.monteCarloSimulations.failureRatePercentage}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">p95 Latency:</span>{' '}
                  <span className="font-bold text-cyan-400">
                    {asset.math.monteCarloSimulations.p95LatencyMs} ms
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GENOME TAB */}
        {activeTab === 'genome' && (
          <div className="space-y-3 font-mono">
            <div className="p-3 bg-[#050506] border border-pink-500/40 rounded-sm">
              <div className="text-[9px] uppercase tracking-widest text-pink-400 font-bold mb-1">
                Digital Genome DNA Alignment
              </div>
              <div className="text-[11px] font-bold text-slate-200 break-all">
                {asset.genome.dnaSequence}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-[#050506] border border-white/10 rounded-sm">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">Mutation Rate μ:</span>
                <div className="text-sm font-bold text-slate-200 mt-1">{asset.genome.mutationRate}</div>
              </div>
              <div className="p-3 bg-[#050506] border border-white/10 rounded-sm">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">Evolution Gen:</span>
                <div className="text-sm font-bold text-blue-400 mt-1">Gen #{asset.genome.evolutionGeneration}</div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
