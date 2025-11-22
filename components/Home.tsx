
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ExternalLink, Clock, ArrowUpRight } from 'lucide-react';

// --- Updated Data for Masonry Layout (Height Variety) ---
const newsItems = [
  { 
    id: 1, 
    title: "The Complete Guide to Apple Vision Pro Development", 
    source: "The Verge", 
    time: "2h ago", 
    type: "image-tall", 
    category: "Tech", 
    imgUrl: "https://images.unsplash.com/photo-1625314868143-20293ee9160b?w=600&q=80", 
    summary: "A deep dive into spatial computing concepts, SwiftUI updates, and best practices for creating immersive experiences on visionOS." 
  },
  { 
    id: 2, 
    title: "React Server Components become stable", 
    source: "React Blog", 
    time: "4h ago", 
    type: "text", 
    category: "Dev", 
    summary: "RSCs are now recommended for all new framework adoptions. Learn how this shifts the paradigm of frontend data fetching." 
  },
  { 
    id: 3, 
    title: "SpaceX Starship successfully reaches orbit", 
    source: "BBC News", 
    time: "5h ago", 
    type: "image", 
    category: "Science", 
    imgUrl: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&q=80" 
  },
  { 
    id: 5, 
    title: "Global Economic Outlook: Inflation cools but risks remain", 
    source: "Bloomberg", 
    time: "8h ago", 
    type: "text", 
    category: "Finance", 
    summary: "Central banks signal a pause in rate hikes as supply chains normalize, though geopolitical tensions continue to cast a shadow over long-term growth projections across major markets. Analysts predict a soft landing but warn of volatility." 
  }
];

const initialSources = [
  { id: 'tech', name: 'Technology', active: true },
  { id: 'design', name: 'Design', active: true },
  { id: 'finance', name: 'Finance', active: false },
  { id: 'science', name: 'Science', active: true },
  { id: 'health', name: 'Health', active: true },
  { id: 'security', name: 'Security', active: true },
];

export const Home: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sources, setSources] = useState(initialSources);

  const toggleSource = (id: string) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  return (
    <div className="w-full">
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-blue-400/10 pb-8">
        <div>
          <h2 className="text-blue-400 font-mono text-xs tracking-widest uppercase mb-2">Overview</h2>
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Good Morning, Alex
          </h1>
          <p className="text-white/50 text-lg font-light mt-2">
            Here's what's happening in your network today.
          </p>
        </div>

        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="mt-6 md:mt-0 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-blue-400/15 hover:border-blue-400/30 backdrop-blur-md transition-all text-white/80 hover:text-white group"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium">Customize Sources</span>
        </button>
      </div>

      {/* --- Masonry Layout (Staggered) --- */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {newsItems.map((item, index) => (
          <motion.div
            key={item.id}
            className="break-inside-avoid mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.05, 0.5), duration: 0.5 }}
          >
            <NewsCard item={item} />
          </motion.div>
        ))}
      </div>

      {/* --- Settings Modal --- */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-3xl border border-blue-400/15 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto">
                <div className="p-6 border-b border-blue-400/10 flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-white">Manage Sources</h3>
                  <button 
                    onClick={() => setIsSettingsOpen(false)}
                    className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {sources.map(source => (
                    <div key={source.id} className="flex items-center justify-between group">
                      <span className="text-white/80 font-medium text-lg group-hover:text-white transition-colors">
                        {source.name}
                      </span>
                      <button 
                        onClick={() => toggleSource(source.id)}
                        className={`
                          relative w-14 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30
                          ${source.active ? 'bg-blue-600' : 'bg-white/10'}
                        `}
                      >
                        <div 
                          className={`
                            w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-spring
                            ${source.active ? 'translate-x-6' : 'translate-x-0'}
                          `} 
                        />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 bg-white/5 border-t border-blue-400/10 text-center">
                  <p className="text-xs text-white/30">Changes are saved automatically.</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const NewsCard: React.FC<{ item: any }> = ({ item }) => {
  // Variable height for image to create staggered look
  const imageHeight = item.type === 'image-tall' ? 'h-64' : 'h-48';

  return (
    <div className="group relative w-full bg-white/5 hover:bg-white/10 border border-blue-400/15 backdrop-blur-xl rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(96,165,250,0.4)] hover:border-blue-400/30 hover:-translate-y-1">
      
      {/* Image Container */}
      {(item.type === 'image' || item.type === 'image-tall') && item.imgUrl && (
        <div className={`relative w-full ${imageHeight} shrink-0`}>
          <img 
            src={item.imgUrl} 
            alt={item.title} 
            className="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40" />
          <div className="absolute top-4 right-4 p-2 bg-black/30 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/10">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
      
      <div className="p-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-wider text-blue-300">
            {item.category}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold text-white leading-snug group-hover:text-blue-100 transition-colors">
          {item.title}
        </h3>

        {/* Summary */}
        {item.summary && (
          <p className="text-white/70 text-sm leading-relaxed line-clamp-4">
            {item.summary}
          </p>
        )}
        
        <div className="flex items-center gap-3 mt-4 pt-2 text-white/50 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-400/30" />
            <span>{item.source}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span>{item.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
