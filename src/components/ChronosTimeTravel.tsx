import React from 'react';
import { TimelineOffset } from '../types';
import { FastForward } from 'lucide-react';
import { useLanguage } from '../i18n';

interface ChronosTimeTravelProps {
  timelineOffset: TimelineOffset;
  onChangeOffset: (offset: TimelineOffset) => void;
  onSimulateFuture: () => void;
  isLoading: boolean;
}

export const ChronosTimeTravel: React.FC<ChronosTimeTravelProps> = ({
  timelineOffset,
  onChangeOffset,
  onSimulateFuture,
  isLoading,
}) => {
  const { t } = useLanguage();

  const offsets: { label: string; offset: TimelineOffset; desc: string }[] = [
    { label: t.chronos.offsets.m180, offset: -180, desc: t.chronos.descriptions.m180 },
    { label: t.chronos.offsets.p0, offset: 0, desc: t.chronos.descriptions.p0 },
    { label: t.chronos.offsets.p30, offset: 30, desc: t.chronos.descriptions.p30 },
    { label: t.chronos.offsets.p90, offset: 90, desc: t.chronos.descriptions.p90 },
    { label: t.chronos.offsets.p365, offset: 365, desc: t.chronos.descriptions.p365 },
  ];

  return (
    <div className="bg-[#0A0A0C] border-b border-white/10 px-6 py-3 text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border border-purple-500 flex items-center justify-center text-[10px] font-mono font-bold text-purple-400 rounded-sm">
            Ch
          </div>
          <div>
            <div className="text-xs font-bold font-mono text-white flex items-center gap-2 tracking-wider uppercase">
              <span>{t.chronos.title}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-sm tracking-widest uppercase">
                Monte Carlo Simulation
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
              {t.chronos.subtitle}
            </p>
          </div>
        </div>

        {/* Timeline Offset Selector */}
        <div className="flex items-center gap-1 bg-[#050506] p-1 rounded-sm border border-white/10 text-[11px] font-mono tracking-wider uppercase">
          {offsets.map((item) => {
            const isSelected = timelineOffset === item.offset;
            return (
              <button
                key={item.offset}
                onClick={() => onChangeOffset(item.offset)}
                title={item.desc}
                className={`px-3 py-1 rounded-sm transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Fast Forward Run Simulation */}
        <button
          onClick={onSimulateFuture}
          disabled={isLoading}
          className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-[11px] rounded-sm flex items-center gap-1.5 shadow transition-all font-mono tracking-wider uppercase whitespace-nowrap"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>{t.chronos.forecastScenario} {timelineOffset >= 0 ? `+${timelineOffset}d` : `${timelineOffset}d`}</span>
        </button>

      </div>
    </div>
  );
};

