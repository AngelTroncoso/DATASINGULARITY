import React from 'react';
import { AgentInfo } from '../types';
import { X, Sparkles, Zap, FlaskConical, Activity, Dna, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AgentDetailsModalProps {
  agent: AgentInfo | null;
  onClose: () => void;
  onTriggerAgentAnalysis: (agentId: AgentInfo['id']) => void;
}

export const AgentDetailsModal: React.FC<AgentDetailsModalProps> = ({
  agent,
  onClose,
  onTriggerAgentAnalysis,
}) => {
  if (!agent) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0A0A0C] border border-white/10 rounded-sm max-w-lg w-full p-6 shadow-2xl relative font-sans text-slate-200 space-y-4 select-none">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-sm transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 border border-white/10 bg-[#050506] rounded-sm flex items-center justify-center"
            style={{ color: agent.color }}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-slate-500">
              Scientific Agent Profile
            </span>
            <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">{agent.name}</h2>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-[#050506] p-3 rounded-sm border border-white/10 font-sans">
          {agent.description}
        </p>

        {/* Formula Box */}
        <div className="p-3 bg-[#050506] border border-white/10 rounded-sm space-y-1">
          <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-blue-400">
            Mathematical & Scientific Equation Model:
          </div>
          <div className="text-xs font-mono text-cyan-400 font-bold break-all bg-[#0A0A0C] p-2 rounded-sm border border-white/10">
            {agent.equation}
          </div>
        </div>

        {/* Key Metric & Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-[#050506] border border-white/10 rounded-sm">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{agent.keyMetricName}</span>
            <div className="text-base font-mono font-bold text-white mt-1" style={{ color: agent.color }}>
              {agent.keyMetricValue}
            </div>
          </div>

          <div className="p-3 bg-[#050506] border border-white/10 rounded-sm">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Agent Status</span>
            <div className="text-xs font-mono font-bold text-white mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{agent.status}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            onTriggerAgentAnalysis(agent.id);
            onClose();
          }}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs uppercase tracking-wider rounded-sm shadow transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Execute Scan with {agent.name}</span>
        </button>

      </div>
    </div>
  );
};
