import React, { useState } from 'react';
import { ChatMessage, OracleAnalysisResponse, AgentId } from '../types';
import { MOCK_PRESET_SCENARIOS } from '../data/mockDataHubEcosystem';
import { Atom, ShieldCheck, Send, RefreshCw } from 'lucide-react';
import { useLanguage } from '../i18n';

interface OracleChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onApplyFix: (fix: OracleAnalysisResponse['recommendedFixes'][0]) => void;
  onHighlightUrns: (urns: string[]) => void;
  activeDomain: string;
  selectedAgentId: AgentId | null;
}

export const OracleChat: React.FC<OracleChatProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onApplyFix,
  onHighlightUrns,
}) => {
  const { t } = useLanguage();
  const [inputText, setInputText] = useState<string>('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handlePresetClick = (prompt: string) => {
    if (!isLoading) {
      onSendMessage(prompt);
    }
  };

  return (
    <div className="flex flex-col h-[580px] bg-[#0A0A0C] border border-white/10 rounded-sm shadow-2xl overflow-hidden font-sans">
      
      {/* Header */}
      <div className="bg-[#050506] p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 border border-blue-500 flex items-center justify-center text-[10px] font-mono font-bold text-blue-500 rounded-sm uppercase">
            Or
          </div>
          <div>
            <h3 className="text-xs font-bold font-mono text-white flex items-center gap-2 uppercase tracking-wider">
              <span>{t.oracle.title}</span>
              <span className="text-[9px] font-mono px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-sm tracking-widest">
                GEMINI 3.6 FLASH
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
              {t.oracle.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Preset Scenario Pills */}
      <div className="bg-[#08080A] p-2.5 border-b border-white/10 overflow-x-auto flex items-center gap-2">
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest whitespace-nowrap pl-1">
          {t.oracle.presetScenarios}
        </span>
        {MOCK_PRESET_SCENARIOS.map((scenario, idx) => {
          const presetKeys: Array<keyof typeof t.presets> = ['p1', 'p2', 'p3', 'p4', 'p5'];
          const presetTitle = t.presets[presetKeys[idx % presetKeys.length]] || scenario.title;
          return (
            <button
              key={scenario.id}
              onClick={() => handlePresetClick(scenario.prompt)}
              disabled={isLoading}
              className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider bg-[#050506] hover:bg-white/5 text-slate-300 border border-white/10 rounded-sm whitespace-nowrap transition-colors disabled:opacity-50"
            >
              {presetTitle}
            </button>
          );
        })}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#050506]/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Sender Label */}
            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1 px-1">
              {msg.sender === 'user' ? t.oracle.userLabel : t.oracle.oracleLabel} • {msg.timestamp}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-3xl p-4 rounded-sm border text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white border-blue-500 font-medium'
                  : 'bg-[#0A0A0C] text-slate-200 border-white/10'
              }`}
            >
              <p className="whitespace-pre-wrap">
                {msg.id === 'welcome-1' ? t.welcomeMsg : msg.text}
              </p>

              {/* Structured Oracle Scientific Analysis Rendering */}
              {msg.analysis && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                  
                  {/* Hypothesis */}
                  <div className="bg-[#050506] p-3 rounded-sm border border-blue-500/30">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-400 flex items-center gap-1.5 mb-1">
                      <Atom className="w-3.5 h-3.5" />
                      <span>{t.oracle.hypothesis}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 italic">{msg.analysis.scientificHypothesis}</p>
                  </div>

                  {/* Mathematical Proof */}
                  <div className="bg-[#050506] p-3 rounded-sm border border-white/10 font-mono text-[11px]">
                    <div className="text-[9px] uppercase tracking-widest text-cyan-400 font-bold mb-1">
                      {t.oracle.mathematicalProof}
                    </div>
                    <p className="text-slate-300 text-[10px] leading-relaxed">
                      {msg.analysis.mathematicalProof}
                    </p>
                  </div>

                  {/* Agent Diagnostics */}
                  <div className="space-y-1.5">
                    <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                      {t.oracle.diagnostics} ({msg.analysis.agentDiagnostics.length} {t.oracle.agentsReporting}):
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {msg.analysis.agentDiagnostics.map((diag, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-sm bg-[#050506] border border-white/10 flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                              {diag.agentName}
                            </span>
                            <span
                              className={`text-[8px] px-1.5 py-0.5 rounded-sm font-mono font-bold uppercase tracking-widest ${
                                diag.severity === 'CRITICAL'
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {diag.severity}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-300">{diag.finding}</p>
                          <div className="mt-1 text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
                            Metric: {diag.metricValue}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Affected DataHub URNs */}
                  {msg.analysis.affectedUrns.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold mb-1">
                        {t.oracle.affectedUrns}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {msg.analysis.affectedUrns.map((urn, i) => (
                          <button
                            key={i}
                            onClick={() => onHighlightUrns([urn])}
                            className="px-2 py-0.5 bg-[#050506] hover:bg-white/5 text-blue-400 border border-white/10 rounded-sm text-[9px] font-mono uppercase tracking-wider transition-colors"
                          >
                            {urn.split(':').pop() || urn}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Action Fixes */}
                  {msg.analysis.recommendedFixes.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold mb-1.5">
                        {t.oracle.governanceActions}
                      </div>
                      <div className="space-y-2">
                        {msg.analysis.recommendedFixes.map((fix, i) => (
                          <div
                            key={i}
                            className="p-3 bg-[#050506] border border-blue-500/40 rounded-sm flex items-center justify-between gap-3"
                          >
                            <div>
                              <div className="font-bold text-white text-[11px] uppercase tracking-wider">{fix.title}</div>
                              <p className="text-[10px] text-slate-400">{fix.description}</p>
                            </div>
                            <button
                              onClick={() => onApplyFix(fix)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-sm text-[10px] font-bold font-mono tracking-wider uppercase flex items-center gap-1 shadow transition-all whitespace-nowrap"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>{t.oracle.execute}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-blue-400 bg-[#050506] p-3 rounded-sm border border-white/10 w-fit animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
            <span>{t.oracle.synthesizing}</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleFormSubmit} className="p-3 bg-[#050506] border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.oracle.placeholder}
          disabled={isLoading}
          className="flex-1 bg-[#0A0A0C] text-slate-100 font-mono text-xs px-3.5 py-2.5 rounded-sm border border-white/10 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-[11px] font-mono tracking-wider uppercase rounded-sm flex items-center gap-1.5 shadow transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{t.oracle.simulate}</span>
        </button>
      </form>

    </div>
  );
};

