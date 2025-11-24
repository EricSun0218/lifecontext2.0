
import React, { useState, Suspense, lazy } from 'react';
import { Sidebar } from './components/Sidebar';
import { FloatingMascotLogo } from './components/AICircleMascot'; 
import { Book } from 'lucide-react';
import { motion } from 'framer-motion';
import { StarField } from './components/StarField';
import { FADE_IN_UP_ITEM } from './constants/animations';

// Lazy load large components for code splitting
const DailyPicks = lazy(() => import('./components/DailyPicks').then(module => ({ default: module.DailyPicks })));
const Insights = lazy(() => import('./components/Insights').then(module => ({ default: module.Insights })));
const Chat = lazy(() => import('./components/Chat').then(module => ({ default: module.Chat })));
const Settings = lazy(() => import('./components/Settings').then(module => ({ default: module.Settings })));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
      <p className="text-white/50 text-sm">Loading...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  // Default to 'insights' as the main landing
  const [activeTab, setActiveTab] = useState('insights');

  return (
    <div className="min-h-screen w-full bg-[#0f0c29] overflow-x-hidden text-slate-200 selection:bg-blue-500/30 font-sans relative">
      
      {/* --- STATIC BACKGROUND LAYERS (No Animation) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        
        {/* 1. Purple/Reddish Glow (Top Left) - Slightly Enhanced */}
        <div className="absolute top-[-15%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-fuchsia-800/20 blur-[120px]"></div>
        
        {/* 2. Blue/Cyan Glow (Top Right) - Dominant Blue */}
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-700/15 blur-[120px]"></div>
        
        {/* 3. Indigo/Dark Blue Glow (Bottom) */}
        <div className="absolute bottom-[-20%] left-[10%] w-[70vw] h-[50vw] rounded-full bg-indigo-900/10 blur-[140px]"></div>
        
        {/* 4. Star Field Animation */}
        <StarField />

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
            {activeTab === 'daily_picks' && (
              <Suspense fallback={<LoadingFallback />}>
                <DailyPicks />
              </Suspense>
            )}
            
            {/* --- CHAT VIEW --- */}
            {activeTab === 'chat' && (
              <Suspense fallback={<LoadingFallback />}>
                <Chat />
              </Suspense>
            )}

            {/* --- INSIGHTS VIEW (Timeline) --- */}
            {activeTab === 'insights' && (
              <Suspense fallback={<LoadingFallback />}>
                <Insights />
              </Suspense>
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
            {activeTab === 'settings' && (
              <Suspense fallback={<LoadingFallback />}>
                <Settings />
              </Suspense>
            )}

          </div>
        </main>
      </div>

      {/* AI Companion Mascot Logo (SVG) - Hidden when on Chat tab to allow local mascot instance */}
      {activeTab !== 'chat' && <FloatingMascotLogo setActiveTab={setActiveTab} />}

    </div>
  );
};

export default App;
