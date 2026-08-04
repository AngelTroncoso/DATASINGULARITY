import React from 'react';
import { AgentInfo, AgentId } from '../types';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../i18n';

interface AgentDeckProps {
  agents: AgentInfo[];
  selectedAgentId: AgentId | null;
  onSelectAgent: (agentId: AgentId | null) => void;
  onOpenAgentDetails: (agent: AgentInfo) => void;
}

const getAgentCode = (id: AgentId): string => {
  switch (id) {
    case 'physics':
      return 'Ph';
    case 'chemistry':
      return 'Ch';
    case 'entropy':
      return 'En';
    case 'genome':
      return 'Gn';
    case 'chronos':
      return 'Ch';
    case 'guardian':
      return 'Gu';
    case 'oracle':
    default:
      return 'Or';
  }
};

export const AgentDeck: React.FC<AgentDeckProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
  onOpenAgentDetails,
}) => {
  const { t } = useLanguage();

  const getStatusBadge = (status: AgentInfo['status']) => {
    switch (status) {
      case 'CRITICAL':
        return <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-sm">{t.agentDeck.status.CRITICAL}</span>;
      case 'WARNING':
        return <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-sm">{t.agentDeck.status.WARNING}</span>;
      case 'ANALYZING':
        return <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-sm animate-pulse">{t.agentDeck.status.ANALYZING}</span>;
      case 'OPTIMAL':
      default:
        return <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-sm">{t.agentDeck.status.OPTIMAL}</span>;
    }
  };

  return (
    <div className="bg-[#08080A] border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            <h2 className="text-[11px] font-mono text-blue-500 uppercase tracking-[0.2em] font-bold">
              {t.agentDeck.networkTitle}
            </h2>
          </div>
          {selectedAgentId && (
            <button
              onClick={() => onSelectAgent(null)}
              className="text-[10px] text-blue-400 hover:text-blue-300 font-mono tracking-widest uppercase underline"
            >
              {t.agentDeck.resetFilter}
            </button>
          )}
        </div>

        {/* Geometric Grid of Agent Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {agents.map((agent) => {
            const isSelected = selectedAgentId === agent.id;
            const code = getAgentCode(agent.id);
            return (
              <div
                key={agent.id}
                onClick={() => onSelectAgent(isSelected ? null : agent.id)}
                className={`group relative p-4 rounded-sm border transition-colors cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500'
                    : 'bg-[#0A0A0C] hover:bg-white/5 border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {/* Geometric Square Badge */}
                    <div
                      className="w-6 h-6 border flex items-center justify-center text-[10px] font-mono font-bold rounded-sm uppercase"
                      style={{ borderColor: agent.color, color: agent.color }}
                    >
                      {code}
                    </div>
                    {getStatusBadge(agent.status)}
                  </div>

                  <h3 className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-blue-400 transition-colors">
                    {agent.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-1 mb-2">
                    {agent.title}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 mt-2">
                  <div className="text-[9px] text-slate-500 uppercase font-mono tracking-wider">
                    {agent.keyMetricName}
                  </div>
                  <div className="text-xs font-mono font-bold mt-0.5" style={{ color: agent.color }}>
                    {agent.keyMetricValue}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAgentDetails(agent);
                    }}
                    className="mt-2 text-[9px] text-blue-400 hover:text-blue-300 font-mono tracking-wider uppercase flex items-center gap-0.5"
                  >
                    <span>{t.agentDeck.inspectProof}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

