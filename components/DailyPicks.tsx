
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Clock, ArrowUpRight, ChevronDown, Sparkles, ListTodo, Check, BrainCircuit, ArrowRight } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import { GlassTooltip } from './ui/GlassTooltip';
import { GlassModal } from './GlassModal';
import { Insight } from '../types';
import { 
  HOVER_ACTION, 
  HOVER_CARD_GLOW, 
  MODAL_BACKDROP, 
  MODAL_CONTENT,
  SPRING_TIGHT 
} from '../constants/animations';

// --- Data ---
// Mock Data for Top Cards
const dailySummaryData = {
  title: "Daily Briefing",
  date: "Oct 24, 2025",
  content: "Today's digital footprint suggests a strong focus on frontend architecture and AI integration. Your reading patterns align with the release of Gemini 1.5, indicating a shift towards multimodal model research. Productivity peaked between 10 AM and 2 PM.",
  stats: [
    { label: "Focus Score", value: "88%" },
    { label: "Reading Time", value: "2h 15m" },
    { label: "New Topics", value: "3" }
  ]
};

// Convert dailySummary to Insight format for modal
const dailySummaryInsight: Insight = {
  id: 'daily-summary',
  type: 'Analysis',
  title: dailySummaryData.title,
  content: dailySummaryData.content,
  tag: dailySummaryData.date,
  markdownContent: `# ${dailySummaryData.title}\n\n**Date:** ${dailySummaryData.date}\n\n${dailySummaryData.content}\n\n## Key Metrics\n\n${dailySummaryData.stats.map(stat => `- **${stat.label}:** ${stat.value}`).join('\n')}\n\n## Detailed Analysis\n\nToday's digital footprint reveals a comprehensive engagement with cutting-edge technologies. The focus on frontend architecture suggests a deep dive into modern web development practices, while the alignment with Gemini 1.5 release indicates active research into multimodal AI capabilities.\n\n### Productivity Insights\n\nProductivity peaked between 10 AM and 2 PM, indicating optimal cognitive performance during these hours. This pattern aligns with research on circadian rhythms and peak mental acuity.\n\n### Learning Patterns\n\nThe shift towards multimodal model research reflects an understanding of the evolving AI landscape, where text, image, and audio processing converge to create more sophisticated AI systems.\n\n### Recommendations\n\n1. **Maintain Focus Windows**: Leverage the 10 AM - 2 PM window for complex problem-solving tasks.\n2. **Deep Dive Sessions**: Schedule dedicated time for exploring multimodal AI capabilities.\n3. **Knowledge Integration**: Connect frontend architecture learnings with AI integration patterns.`
};

const todoList = [
  { id: 1, text: "Review PR #42: Virtualization Fix", completed: false, tag: "Critical" },
  { id: 2, text: "Research Gemini 2.5 Flash limits", completed: false, tag: "Research" },
  { id: 3, text: "Update Tailwind config for dark mode", completed: true, tag: "Dev" },
  { id: 4, text: "Schedule team sync", completed: false, tag: "Meeting" },
];

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

export const DailyPicks: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sources, setSources] = useState(initialSources);
  const [todos, setTodos] = useState(todoList);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  
  // Responsive Masonry Logic
  const [columns, setColumns] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
    }
    return 1;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setColumns(3);
      else if (window.innerWidth >= 768) setColumns(2);
      else setColumns(1);
    };
    
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSource = (id: string) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Distribute items into columns for Left-to-Right reading order
  const distributedItems = Array.from({ length: columns }, () => [] as typeof newsItems);
  newsItems.forEach((item, i) => {
    distributedItems[i % columns].push(item);
  });

  return (
    <div className="w-full">
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-blue-400/10 pb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-blue-400 font-mono text-xs tracking-widest uppercase mb-2">Overview</h2>
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Daily Picks
          </h1>
          <p className="text-white/50 text-lg font-light mt-2">
            Curated highlights from your digital network.
          </p>
        </motion.div>

        {/* Controls Container */}
        <div className="mt-6 md:mt-0 flex items-center gap-3">
          
          {/* Date Picker (Matching Insights Style) */}
          <motion.button 
             variants={HOVER_ACTION}
             initial="initial"
             whileHover="hover"
             whileTap="tap"
             className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-blue-400/15 hover:bg-white/10 hover:border-blue-400/30 transition-all cursor-pointer group"
          >
              <span className="text-white/80 font-medium group-hover:text-white">Today, Oct 24</span>
              <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
          </motion.button>

          {/* Customize Sources - Icon Only */}
          <GlassTooltip content="Customize Sources" side="bottom">
            <motion.button 
              onClick={() => setIsSettingsOpen(true)}
              variants={HOVER_ACTION}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-blue-400/15 backdrop-blur-md text-white/70 hover:text-white hover:bg-white/10 transition-colors group"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </motion.button>
          </GlassTooltip>
        </div>
      </div>

      {/* --- PRIORITY SECTION: Summary & Todos --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12"
      >
        {/* Daily Summary Card */}
        <motion.div 
            layoutId="daily-summary"
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            variants={HOVER_CARD_GLOW}
            onClick={() => setSelectedInsight(dailySummaryInsight)}
            className="p-8 rounded-3xl bg-white/5 border border-blue-400/15 backdrop-blur-xl relative overflow-hidden group flex flex-col justify-between cursor-pointer"
        >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20">
                            <BrainCircuit className="w-5 h-5" />
                        </div>
                        <div>
                           <h3 className="text-xl font-bold text-white tracking-tight">{dailySummaryData.title}</h3>
                           <p className="text-xs text-blue-200/50 uppercase tracking-widest font-medium mt-0.5">{dailySummaryData.date}</p>
                        </div>
                    </div>
                </div>
                
                <p className="text-white/70 leading-relaxed mb-8 font-light text-base md:text-lg">
                    {dailySummaryData.content}
                </p>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
                    {dailySummaryData.stats.map((stat, i) => (
                        <div key={i}>
                            <div className="text-2xl font-bold text-white mb-1 group-hover:text-blue-200 transition-colors">{stat.value}</div>
                            <div className="text-[10px] text-blue-300/70 uppercase tracking-wider font-bold">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-4 border-t border-blue-400/10 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-xs text-white/50 font-medium group-hover:text-blue-300 transition-colors">View Details</span>
                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-blue-500/20 transition-colors">
                        <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-blue-300" />
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Todo Card */}
        <motion.div 
            initial="initial"
            whileHover="hover"
            variants={HOVER_CARD_GLOW}
            className="p-8 rounded-3xl bg-white/5 border border-blue-400/15 backdrop-blur-xl flex flex-col h-full relative overflow-hidden group"
        >
             {/* Glow effect */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none opacity-50" />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        <ListTodo className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Action Items</h3>
                </div>
                <span className="text-[10px] font-bold tracking-wider text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    {todos.filter(t => !t.completed).length} PENDING
                </span>
            </div>

            <div className="space-y-3 flex-1 relative z-10">
                {todos.map((todo) => (
                    <div 
                        key={todo.id} 
                        onClick={() => toggleTodo(todo.id)}
                        className={`
                            flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group/item
                            ${todo.completed 
                                ? 'bg-white/5 border-transparent opacity-50' 
                                : 'bg-white/5 border-white/5 hover:border-blue-400/30 hover:bg-white/10'}
                        `}
                    >
                        <div className={`
                            flex-none w-5 h-5 rounded-md border flex items-center justify-center transition-colors
                            ${todo.completed 
                                ? 'bg-emerald-500/20 border-emerald-500/50' 
                                : 'border-white/30 group-hover/item:border-blue-400/50'}
                        `}>
                            {todo.completed && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        
                        <span className={`flex-1 text-sm font-medium transition-colors ${todo.completed ? 'text-white/30 line-through' : 'text-white/80 group-hover/item:text-white'}`}>
                            {todo.text}
                        </span>
                        
                        {!todo.completed && (
                            <span className={`
                                text-[10px] px-2 py-0.5 rounded-md border
                                ${todo.tag === 'Critical' ? 'bg-red-500/10 text-red-300 border-red-500/20' : 
                                  todo.tag === 'Research' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' :
                                  'bg-white/5 text-white/50 border-white/10'}
                            `}>
                                {todo.tag}
                            </span>
                        )}
                    </div>
                ))}
                
                {/* Add New Item Placeholder */}
                <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/10 text-white/30 hover:text-white/50 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer">
                    <div className="w-5 h-5 rounded-md border border-dashed border-current flex items-center justify-center">
                        <ArrowRight className="w-3 h-3" />
                    </div>
                    <span className="text-sm">Add a new task...</span>
                </div>
            </div>
        </motion.div>
      </motion.div>

      {/* --- JS Masonry Grid --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }} // Display all at once
        className="flex gap-6 items-start"
      >
        {distributedItems.map((colItems, colIndex) => (
          <div key={colIndex} className="flex-1 flex flex-col gap-6">
            {colItems.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        ))}
      </motion.div>

      {/* --- Settings Modal --- */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div
              variants={MODAL_BACKDROP}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
            />
            <motion.div
              variants={MODAL_CONTENT}
              initial="hidden"
              animate="visible"
              exit="exit"
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
                               transition={SPRING_TIGHT}
                             />
                          </Switch.Thumb>
                        </Switch.Root>
                     </motion.div>
                   ))}
                 </div>
                 
                 <div className="mt-8">
                   <motion.button 
                     variants={HOVER_ACTION}
                     initial="initial"
                     whileHover="hover"
                     whileTap="tap"
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

      {/* Daily Summary Detail Modal */}
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

const NewsCard: React.FC<{ item: any }> = ({ item }) => {
  return (
    <motion.div 
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      variants={HOVER_CARD_GLOW}
      className="group flex flex-col w-full relative overflow-hidden rounded-3xl backdrop-blur-md border cursor-pointer bg-white/[0.02]"
    >
      
      {/* Image Section */}
      {item.type.includes('image') && (
        <div className="w-full overflow-hidden relative shrink-0">
           <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c29] via-transparent to-transparent opacity-60 z-10" />
           <motion.img 
             src={item.imgUrl} 
             alt={item.title} 
             className="w-full h-auto object-cover"
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
