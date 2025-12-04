
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TimelineCard } from './TimelineCard';
import { getDashboardData } from '../constants';
import { ChevronDown, Sparkles } from 'lucide-react';
import { Insight } from '../types';
import { AnimatePresence } from 'framer-motion';
import { GlassModal } from './GlassModal';

export const Insights: React.FC = () => {
  const { t } = useTranslation();
  const dashboardData = useMemo(() => getDashboardData(t), [t]);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);

  return (
    <>
      {/* Timeline Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 border-b border-blue-400/10 pb-12 animate-fade-in">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-blue-400/80 font-mono text-xs tracking-widest uppercase">{t('insights.ai_powered')}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight mb-6">
            {t('insights.dashboard')}
          </h1>
          <p className="text-white/50 text-xl font-light leading-relaxed">
            {t('insights.subtitle')}
          </p>
        </div>

        {/* Date Picker */}
        <button className="mt-8 md:mt-0 flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-blue-400/15 hover:bg-white/10 hover:border-blue-400/30 transition-all cursor-pointer group">
          <span className="text-white/80 font-medium group-hover:text-white">{t('insights.today')}</span>
          <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* Timeline Stream */}
      <div className="relative ml-4 md:ml-12 space-y-12 pb-24">
        {dashboardData.map((entry, index) => (
          <TimelineCard
            key={entry.id}
            entry={entry}
            isLast={index === dashboardData.length - 1}
            onInsightClick={setSelectedInsight}
          />
        ))}
      </div>

      {/* End of Stream Indicator */}
      <div className="flex items-center justify-center py-24 opacity-30">
        <div className="h-1 w-24 rounded-full bg-blue-400/20"></div>
      </div>

      {/* Immersive Detail Modal Layer */}
      <AnimatePresence>
        {selectedInsight && (
          <GlassModal
            key={selectedInsight.id}
            insight={selectedInsight}
            onClose={() => setSelectedInsight(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
