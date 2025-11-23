
import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { SlidersHorizontal, X, ExternalLink, Clock, ArrowUpRight } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';

// --- Updated Data for Grid Layout (Standardized) ---
const newsItems = [
  { 
    id: 1, 
    title: "The Future of Generative AI in Healthcare", 
    source: "TechCrunch", 
    time: "1h ago", 
    type: "image", 
    category: "Health", 
    imgUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80", 
    summary: "How LLMs are revolutionizing diagnostic processes and personalized treatment plans across major hospital networks." 
  },
  { 
    id: 2, 
    title: "Rust vs Go: Performance Benchmarks 2025", 
    source: "Dev.to", 
    time: "2h ago", 
    type: "text", 
    category: "Dev", 
    summary: "A comprehensive look at memory management, concurrency models, and compilation speeds in the latest versions." 
  },
  { 
    id: 3, 
    title: "Sustainable Architecture: The Vertical Forest", 
    source: "ArchDaily", 
    time: "3h ago", 
    type: "image", 
    category: "Design", 
    imgUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80" 
  },
  { 
    id: 4, 
    title: "Market Watch: Crypto Volatility Spikes", 
    source: "Bloomberg", 
    time: "4h ago", 
    type: "text", 
    category: "Finance", 
    summary: "Bitcoin and Ethereum see double-digit fluctuations as regulatory news impacts investor sentiment globally." 
  },
  { 
    id: 5, 
    title: "CSS Container Queries are finally here", 
    source: "Smashing Mag", 
    time: "5h ago", 
    type: "image", 
    category: "Dev", 
    imgUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80" 
  },
  { 
    id: 6, 
    title: "The Psychology of Dark Mode UX", 
    source: "UX Collective", 
    time: "6h ago", 
    type: "text", 
    category: "Design", 
    summary: "Why dark interfaces reduce strain but require careful contrast calibration for accessibility compliance." 
  },
  { 
    id: 7, 
    title: "SpaceX Starship Launch Successful", 
    source: "BBC Science", 
    time: "7h ago", 
    type: "image", 
    category: "Science", 
    imgUrl: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=600&q=80",
    summary: "The massive rocket achieved orbit for the first time, marking a new era in interplanetary travel capabilities."
  },
  { 
    id: 8, 
    title: "Global Supply Chain Recovery Report", 
    source: "Reuters", 
    time: "8h ago", 
    type: "text", 
    category: "Business", 
    summary: "Shipping costs normalize as port congestion eases across Asia and the West Coast." 
  },
  { 
    id: 9, 
    title: "Cybersecurity Trends: Zero Trust Architecture", 
    source: "Wired", 
    time: "9h ago", 
    type: "image", 
    category: "Security", 
    imgUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80" 
  },
  { 
    id: 10, 
    title: "Minimalism in 2025", 
    source: "Awwwards", 
    time: "10h ago", 
    type: "text", 
    category: "Design", 
    summary: "Less is more." 
  },
  { 
    id: 11, 
    title: "Quantum Computing Breakthrough", 
    source: "Nature", 
    time: "11h ago", 
    type: "image", 
    category: "Science", 
    imgUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80",
    summary: "Researchers stabilize qubits for record durations at room temperature."
  },
  { 
    id: 12, 
    title: "Next.js 15 Released: What's New?", 
    source: "Vercel Blog", 
    time: "12h ago", 
    type: "text", 
    category: "Dev", 
    summary: "Partial Prerendering, stable Server Actions, and Turbopack improvements lead the changelog." 
  },
  { 
    id: 13, 
    title: "The Rise of Biophilic Office Design", 
    source: "Architectural Digest", 
    time: "13h ago", 
    type: "image", 
    category: "Architecture", 
    imgUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" 
  },
  { 
    id: 14, 
    title: "Remote Work Policies in 2025", 
    source: "Forbes", 
    time: "14h ago", 
    type: "text", 
    category: "Business", 
    summary: "Hybrid models stabilize as major tech firms enforce 3-day office mandates." 
  },
  { 
    id: 15, 
    title: "Electric Vehicle Battery Innovations", 
    source: "Electrek", 
    time: "15h ago", 
    type: "image", 
    category: "Tech", 
    imgUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80",
    summary: "Solid-state batteries promise 2x range and 10-minute charging times by 2026."
  },
  { 
    id: 16, 
    title: "Mental Health in the Digital Age", 
    source: "Psychology Today", 
    time: "16h ago", 
    type: "text", 
    category: "Health", 
    summary: "Studies show correlation between notification frequency and anxiety levels in teens." 
  },
  { 
    id: 17, 
    title: "AI Art Ethics Debate Continues", 
    source: "The Verge", 
    time: "17h ago", 
    type: "image", 
    category: "Tech", 
    imgUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" 
  },
  { 
    id: 18, 
    title: "Understanding TypeScript 6.0", 
    source: "TS Blog", 
    time: "18h ago", 
    type: "text", 
    category: "Dev", 
    summary: "New type inference rules make generic constraints even more powerful." 
  },
  { 
    id: 19, 
    title: "Deep Sea Exploration", 
    source: "NatGeo", 
    time: "19h ago", 
    type: "image", 
    category: "Science", 
    imgUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&q=80" 
  },
  { 
    id: 20, 
    title: "Coffee Culture: The Fourth Wave", 
    source: "Sprudge", 
    time: "20h ago", 
    type: "text", 
    category: "Lifestyle", 
    summary: "It's no longer just about the bean origin, but the precise molecular chemistry of the brew water." 
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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
};

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

        <motion.button 
          onClick={() => setIsSettingsOpen(true)}
          whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)", borderColor: "rgba(96, 165, 250, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 md:mt-0 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-blue-400/15 backdrop-blur-md text-white/80 group"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium">Customize Sources</span>
        </motion.button>
      </div>

      {/* --- Masonry Layout (Staggered/Waterfall) --- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
      >
        {newsItems.map((item) => (
          <motion.div
            key={item.id}
            variants={cardVariants}
            className="break-inside-avoid mb-6"
          >
            <NewsCard item={item} />
          </motion.div>
        ))}
      </motion.div>

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
              <div className="bg-[#0f0c29]/90 backdrop-blur-2xl border border-blue-400/15 rounded-3xl p-8 w-full max-w-lg pointer-events-auto shadow-2xl">
                 <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-bold text-white">Manage Sources</h2>
                   <button onClick={() => setIsSettingsOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors">
                     <X className="w-5 h-5" />
                   </button>
                 </div>
                 
                 <div className="space-y-4">
                   {sources.map(source => (
                     <motion.div 
                       key={source.id} 
                       layout
                       className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5"
                     >
                        <span className="text-white font-medium">{source.name}</span>
                        
                        <Switch.Root
                          checked={source.active}
                          onCheckedChange={() => toggleSource(source.id)}
                          className={`
                            w-12 h-7 rounded-full p-1 transition-colors duration-300
                            ${source.active ? 'bg-blue-600' : 'bg-white/10'}
                            border-none outline-none cursor-pointer relative
                          `}
                        >
                          <Switch.Thumb asChild>
                             <motion.div 
                               layout
                               className="block w-5 h-5 bg-white rounded-full shadow-md"
                               animate={{ x: source.active ? 20 : 0 }}
                               transition={{ type: "spring", stiffness: 500, damping: 30 }}
                             />
                          </Switch.Thumb>
                        </Switch.Root>
                     </motion.div>
                   ))}
                 </div>
                 
                 <div className="mt-8">
                   <motion.button 
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={() => setIsSettingsOpen(false)} 
                     className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium"
                   >
                     Done
                   </motion.button>
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
  // Logic to vary image heights for masonry effect
  const imageHeight = item.id % 3 === 0 ? 'h-64' : 'h-48';

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01, boxShadow: "0 0 40px -10px rgba(96,165,250,0.5)", borderColor: "rgba(96, 165, 250, 0.3)" }}
      className="group flex flex-col relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-md border border-blue-400/15 cursor-pointer"
    >
      
      {/* Image Section - Variable Height for Masonry */}
      {item.type.includes('image') && (
        <div className={`${imageHeight} w-full overflow-hidden relative shrink-0`}>
           <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c29] via-transparent to-transparent opacity-60 z-10" />
           <motion.img 
             src={item.imgUrl} 
             alt={item.title} 
             className="w-full h-full object-cover"
             whileHover={{ scale: 1.1 }}
             transition={{ duration: 0.7 }}
           />
           <div className="absolute top-4 left-4 z-20">
             <span className="px-2 py-1 rounded-md bg-blue-500/20 border border-blue-400/20 backdrop-blur-md text-[10px] font-bold text-blue-200 uppercase tracking-wider">
               {item.category}
             </span>
           </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 flex flex-col">
        
        {!item.type.includes('image') && (
           <div className="mb-4">
             <span className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-400/20 text-[10px] font-bold text-blue-300 uppercase tracking-wider">
               {item.category}
             </span>
           </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-3 opacity-60 text-xs text-blue-100">
            <span className="font-medium text-blue-300">{item.source}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{item.time}</span>
            </div>
          </div>

          <h3 className={`font-bold text-white mb-3 leading-tight group-hover:text-blue-200 transition-colors ${item.type === 'text' ? 'text-xl' : 'text-lg'}`}>
            {item.title}
          </h3>

          {item.summary && (
            <p className="text-sm text-blue-100/60 leading-relaxed">
              {item.summary}
            </p>
          )}
        </div>

        {/* Footer / Action */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
           <span className="text-xs font-medium text-blue-300">Read Article</span>
           <ArrowUpRight className="w-4 h-4 text-blue-300 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  )
}
