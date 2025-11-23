
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TimelineCard } from './components/TimelineCard';
import { FloatingMascotLogo } from './components/AICircleMascot'; // Updated Import
import { DASHBOARD_DATA } from './constants';
import { ChevronDown, Sparkles, Book } from 'lucide-react';
import { Insight } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { GlassModal } from './components/GlassModal';
import { Home } from './components/Home';
import { Chat } from './components/Chat';
import { Settings } from './components/Settings';
import { FADE_IN_UP_ITEM } from './constants/animations';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('timeline'); // Default tab
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);

  return (
    <div className="min-h-screen w-full bg-[#0f0c29] overflow-x-hidden text-slate-200 selection:bg-blue-500/30 font-sans relative">
      
      {/* --- STATIC BACKGROUND LAYERS (No Animation) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        
        {/* 1. Purple Glow (Top Left) - Reduced Opacity (15%) */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-700/15 blur-[120px]"></div>
        
        {/* 2. Blue/Cyan Glow (Top Right) - Increased Opacity (15%) */}
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/15 blur-[100px]"></div>
        
        {/* 3. Pink/Fuchsia Glow (Bottom) - Significantly Reduced (8%) */}
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[40vw] rounded-full bg-fuchsia-900/8 blur-[120px]"></div>
        
        {/* Micro-Noise Overlay (Texture Only) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 md:ml-24 px-6 md:px-12 py-12">
          
          {/* Expanded Center Container */}
          <div className="max-w-7xl mx-auto w-full flex flex-col">

            {/* --- DAILY PICKS VIEW (Was Home) --- */}
            {activeTab === 'home' && <Home />}
            
            {/* --- CHAT VIEW --- */}
            {activeTab === 'chat' && <Chat />}

            {/* --- TIMELINE VIEW (New Home) --- */}
            {activeTab === 'timeline' && (
              <>
                {/* Timeline Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-32 border-b border-blue-400/10 pb-12 animate-fade-in">
                   <div className="max-w-2xl">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                         </div>
                         <span className="text-blue-400/80 font-mono text-xs tracking-widest uppercase">AI-Powered Analysis</span>
                      </div>
                      <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
                        Insight Dashboard
                      </h1>
                      <p className="text-white/50 text-xl font-light leading-relaxed">
                        Translating your raw digital footprint into actionable intelligence.
                      </p>
                   </div>

                   {/* Date Picker */}
                   <button className="mt-8 md:mt-0 flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-blue-400/15 hover:bg-white/10 hover:border-blue-400/30 transition-all cursor-pointer group">
                      <span className="text-white/80 font-medium group-hover:text-white">Today, Oct 24</span>
                      <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                   </button>
                </div>

                {/* Timeline Grid Stream */}
                <div className="w-full">
                  <div className="flex flex-col">
                    {DASHBOARD_DATA.map((entry, index) => (
                      <TimelineCard 
                        key={entry.id} 
                        entry={entry} 
                        isLast={index === DASHBOARD_DATA.length - 1} 
                        onInsightClick={setSelectedInsight}
                      />
                    ))}
                  </div>
                </div>

                {/* End of Stream Indicator */}
                <div className="flex items-center justify-center py-24 opacity-30">
                   <div className="h-1 w-24 rounded-full bg-blue-400/20"></div>
                </div>
              </>
            )}

            {/* --- KNOWLEDGE BASE VIEW (Placeholder) --- */}
            {activeTab === 'knowledge' && (
                <motion.div 
                    variants={FADE_IN_UP_ITEM}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center justify-center h-[60vh] text-center"
                >
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 flex items-center justify-center mb-8 border border-blue-400/20 shadow-[0_0_50px_-10px_rgba(59,130,246,0.1)]">
                        <Book className="w-12 h-12 text-blue-400" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4">Knowledge Base</h2>
                    <p className="text-xl text-white/50 max-w-md font-light">
                        We are currently indexing your neural pathways. This module will be available in the next update.
                    </p>
                    <div className="mt-8 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-xs font-mono text-blue-300">
                        STATUS: CONSTRUCTION_MODE
                    </div>
                </motion.div>
            )}

            {/* --- SETTINGS VIEW --- */}
            {activeTab === 'settings' && <Settings />}

          </div>
        </main>
      </div>

      {/* AI Companion Mascot Logo (SVG) - Hidden when on Chat tab to allow local mascot instance */}
      {activeTab !== 'chat' && <FloatingMascotLogo setActiveTab={setActiveTab} />}

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

    </div>
  );
};

export default App;
