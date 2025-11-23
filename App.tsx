
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { FloatingMascotLogo } from './components/AICircleMascot'; 
import { Book } from 'lucide-react';
import { motion } from 'framer-motion';
import { DailyPicks } from './components/DailyPicks';
import { Insights } from './components/Insights';
import { Chat } from './components/Chat';
import { Settings } from './components/Settings';
import { FADE_IN_UP_ITEM } from './constants/animations';

const App: React.FC = () => {
  // Default to 'insights' as the main landing
  const [activeTab, setActiveTab] = useState('insights');

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

            {/* --- DAILY PICKS VIEW --- */}
            {activeTab === 'daily_picks' && <DailyPicks />}
            
            {/* --- CHAT VIEW --- */}
            {activeTab === 'chat' && <Chat />}

            {/* --- INSIGHTS VIEW (Timeline) --- */}
            {activeTab === 'insights' && <Insights />}

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

    </div>
  );
};

export default App;
