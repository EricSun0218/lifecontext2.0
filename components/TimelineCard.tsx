
import React from 'react';
import { DashboardEntry, Insight } from '../types';
import { 
  FileText, Youtube, Code, Globe, Terminal, Github, MessageSquare, 
  ArrowRight, Zap, AlertTriangle, Book
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TimelineCardProps {
  entry: DashboardEntry;
  isLast: boolean;
  onInsightClick: (insight: Insight) => void;
}

const IconMap: Record<string, any> = {
  FileText, Youtube, Code, Globe, Terminal, Github, MessageSquare, Book
};

export const TimelineCard: React.FC<TimelineCardProps> = ({ entry, isLast, onInsightClick }) => {
  
  return (
    // --- SCROLL REVEAL ANIMATION ---
    // Grid Layout: 300px Context | Gap (Spine) | Fluid Insight
    <motion.div 
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
      className="relative grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 md:gap-12 mb-24 group"
    >
      
      {/* --- THE CENTRAL SPINE (Desktop Only) --- */}
      <div className="hidden md:block absolute left-[300px] ml-6 top-2 bottom-0 w-px bg-blue-400/10 shadow-[0_0_8px_rgba(99,102,241,0.2)]">
          {/* Glowing Dot at Start */}
          <div className="absolute -top-1 -left-[5px] w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)] z-10" />
          {/* Connection Line Gradient */}
          {!isLast && <div className="absolute top-0 bottom-0 w-full bg-gradient-to-b from-blue-400/20 via-blue-400/10 to-transparent" />}
      </div>

      {/* --- LEFT COLUMN: CONTEXT ANCHOR --- */}
      <div className="flex flex-col md:items-end md:text-right sticky top-32 self-start">
          
          {/* Time Display */}
          <div className="mb-6 md:pr-6">
            <span className="text-6xl md:text-7xl font-thin text-blue-100/20 tracking-tighter font-sans select-none">
              {entry.time}
            </span>
          </div>

          {/* Context Card (Metadata Style) */}
          <div className="w-full md:w-[280px] bg-white/5 rounded-2xl p-5 backdrop-blur-sm border border-blue-400/15 transition-all duration-300 hover:bg-white/10 hover:border-blue-400/30 hover:shadow-[0_0_40px_-10px_rgba(96,165,250,0.4)] hover:-translate-y-[2px] shadow-[0_0_20px_rgba(59,130,246,0.05)]">
            <div className="mb-3 opacity-50">
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-blue-200">
                  Source Context
                </span>
            </div>
            
            <h4 className="text-white/90 font-medium text-lg leading-snug mb-4 line-clamp-2">
              {entry.context.title}
            </h4>

            <div className="flex flex-col md:items-end gap-2">
              {entry.context.sources.map((source, idx) => {
                const SourceIcon = IconMap[source.icon] || Globe;
                return (
                  <div key={idx} className="flex items-center gap-2 group/link cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                      <span className="hidden md:inline text-xs text-white group-hover/link:text-blue-200 transition-colors font-light border-b border-transparent group-hover/link:border-blue-400/30 pb-0.5">
                        {source.title}
                      </span>
                      <SourceIcon className="w-3.5 h-3.5 text-white group-hover/link:text-blue-300 transition-colors" />
                      <span className="md:hidden text-xs text-white">{source.title}</span>
                  </div>
                )
              })}
            </div>
          </div>
      </div>

      {/* --- RIGHT COLUMN: INSIGHT DECK --- */}
      <div className="flex flex-col gap-6 mt-2">
          {entry.insights.map((insight) => (
            <InsightCard 
              key={insight.id}
              insight={insight}
              onClick={() => onInsightClick(insight)}
            />
          ))}
      </div>

    </motion.div>
  );
};

// --- Sub-Component: Insight Card (The Trigger) ---

const InsightCard: React.FC<{ insight: Insight; onClick: () => void }> = ({ insight, onClick }) => {
  let typeConfig = {
    badge: 'text-blue-300 bg-blue-400/10 border-blue-400/20',
    icon: Zap
  };

  if (insight.type === 'Critical') {
    typeConfig = { badge: 'text-red-300 bg-red-400/10 border-red-400/20', icon: AlertTriangle };
  } else if (insight.type === 'Warning') {
    typeConfig = { badge: 'text-amber-300 bg-amber-400/10 border-amber-400/20', icon: AlertTriangle };
  } else if (insight.type === 'Action') {
    typeConfig = { badge: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20', icon: ArrowRight };
  } else if (insight.type === 'Analysis') {
    typeConfig = { badge: 'text-blue-300 bg-blue-500/10 border-blue-500/20', icon: Zap };
  }

  const Icon = typeConfig.icon;

  return (
    <motion.div 
      layoutId={insight.id}
      onClick={onClick}
      whileHover={{ scale: 1.01, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`
        w-full max-w-[720px]
        group relative p-8 rounded-3xl backdrop-blur-xl
        bg-white/5 border border-blue-400/15
        cursor-pointer
        flex flex-col gap-4
        shadow-[0_0_20px_rgba(59,130,246,0.05)]
        
        /* --- UNIFIED HOVER EFFECT (Premium Blue-Purple Glow) --- */
        hover:bg-white/10
        hover:shadow-[0_0_40px_-10px_rgba(96,165,250,0.4)]
        hover:border-blue-400/30
      `}
    >
      {/* Header Row */}
      <div className="flex justify-between items-start">
        <motion.div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${typeConfig.badge} backdrop-blur-md`}>
          <Icon className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {insight.type}
          </span>
        </motion.div>
        <span className="text-[10px] font-medium px-3 py-1 rounded-full bg-white/5 text-white/50 group-hover:text-white/70 transition-colors border border-white/5 group-hover:border-blue-400/20">
          {insight.tag}
        </span>
      </div>

      {/* Main Content */}
      <div>
        <motion.h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-blue-50 transition-colors tracking-tight">
            {insight.title}
        </motion.h3>
        
        <motion.p className="text-white/70 text-base leading-relaxed line-clamp-3 group-hover:text-white/80 font-light">
            {insight.content}
        </motion.p>
      </div>

      {/* Footer Action */}
      <div className="mt-2 pt-4 border-t border-blue-400/10 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-all duration-300">
        <span className="text-xs text-white/50 font-medium group-hover:text-blue-300 transition-colors">View Analysis</span>
        <div className="p-2 rounded-full bg-white/5 group-hover:bg-blue-500/20 transition-colors">
           <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-blue-300" />
        </div>
      </div>
    </motion.div>
  );
};
