
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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

// --- Data Helpers ---
const getDailySummaryData = (t: any) => ({
  title: t('daily_picks.briefing.title'),
  date: t('insights.today'),
  content: t('daily_picks.briefing.content'),
  stats: [
    { label: t('daily_picks.briefing.stats.focus_score'), value: "88%" },
    { label: t('daily_picks.briefing.stats.reading_time'), value: "2h 15m" },
    { label: t('daily_picks.briefing.stats.new_topics'), value: "3" }
  ]
});

const getTodoList = (t: any) => [
  { id: 1, text: t('daily_picks.todos.item1'), completed: false, tag: "Critical" },
  { id: 2, text: t('daily_picks.todos.item2'), completed: false, tag: "Research" },
  { id: 3, text: t('daily_picks.todos.item3'), completed: true, tag: "Dev" },
  { id: 4, text: t('daily_picks.todos.item4'), completed: false, tag: "Meeting" },
];

const getNewsItems = (t: any) => [
  {
    id: 1,
    title: t('home.news.item1.title'),
    source: "TechCrunch",
    time: "1h ago",
    type: "image",
    category: "Health",
    imgUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
    summary: t('home.news.item1.summary')
  },
  {
    id: 2,
    title: t('home.news.item2.title'),
    source: "Dev.to",
    time: "2h ago",
    type: "text",
    category: "Dev",
    summary: t('home.news.item2.summary')
  },
  {
    id: 3,
    title: t('home.news.item3.title'),
    source: "ArchDaily",
    time: "3h ago",
    type: "image",
    category: "Design",
    imgUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80"
  },
  {
    id: 4,
    title: t('home.news.item4.title'),
    source: "Bloomberg",
    time: "4h ago",
    type: "text",
    category: "Finance",
    summary: t('home.news.item4.summary')
  },
  {
    id: 5,
    title: t('home.news.item5.title'),
    source: "Smashing Mag",
    time: "5h ago",
    type: "image",
    category: "Dev",
    imgUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80"
  },
  {
    id: 6,
    title: t('home.news.item6.title'),
    source: "UX Collective",
    time: "6h ago",
    type: "text",
    category: "Design",
    summary: t('home.news.item6.summary')
  },
  {
    id: 7,
    title: t('home.news.item7.title'),
    source: "BBC Science",
    time: "7h ago",
    type: "image",
    category: "Science",
    imgUrl: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=600&q=80",
    summary: t('home.news.item7.summary')
  },
  {
    id: 8,
    title: t('home.news.item8.title'),
    source: "Reuters",
    time: "8h ago",
    type: "text",
    category: "Business",
    summary: t('home.news.item8.summary')
  },
  {
    id: 9,
    title: t('home.news.item9.title'),
    source: "Wired",
    time: "9h ago",
    type: "image",
    category: "Security",
    imgUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"
  },
  {
    id: 10,
    title: t('home.news.item10.title'),
    source: "Awwwards",
    time: "10h ago",
    type: "text",
    category: "Design",
    summary: t('home.news.item10.summary')
  },
  {
    id: 11,
    title: t('home.news.item11.title'),
    source: "Nature",
    time: "11h ago",
    type: "image",
    category: "Science",
    imgUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80",
    summary: t('home.news.item11.summary')
  },
  {
    id: 12,
    title: t('home.news.item12.title'),
    source: "Vercel Blog",
    time: "12h ago",
    type: "text",
    category: "Dev",
    summary: t('home.news.item12.summary')
  },
  {
    id: 13,
    title: t('home.news.item13.title'),
    source: "Architectural Digest",
    time: "13h ago",
    type: "image",
    category: "Architecture",
    imgUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
  },
  {
    id: 14,
    title: t('home.news.item14.title'),
    source: "Forbes",
    time: "14h ago",
    type: "text",
    category: "Business",
    summary: t('home.news.item14.summary')
  },
  {
    id: 15,
    title: t('home.news.item15.title'),
    source: "Electrek",
    time: "15h ago",
    type: "image",
    category: "Tech",
    imgUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80",
    summary: t('home.news.item15.summary')
  },
  {
    id: 16,
    title: t('home.news.item16.title'),
    source: "Psychology Today",
    time: "16h ago",
    type: "text",
    category: "Health",
    summary: t('home.news.item16.summary')
  },
  {
    id: 17,
    title: t('home.news.item17.title'),
    source: "The Verge",
    time: "17h ago",
    type: "image",
    category: "Tech",
    imgUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"
  },
  {
    id: 18,
    title: t('home.news.item18.title'),
    source: "TS Blog",
    time: "18h ago",
    type: "text",
    category: "Dev",
    summary: t('home.news.item18.summary')
  },
  {
    id: 19,
    title: t('home.news.item19.title'),
    source: "NatGeo",
    time: "19h ago",
    type: "image",
    category: "Science",
    imgUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&q=80"
  },
  {
    id: 20,
    title: t('home.news.item20.title'),
    source: "Sprudge",
    time: "20h ago",
    type: "text",
    category: "Lifestyle",
    summary: t('home.news.item20.summary')
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
  const { t } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sources, setSources] = useState(initialSources);

  const dailySummaryData = useMemo(() => getDailySummaryData(t), [t]);
  const todoList = useMemo(() => getTodoList(t), [t]);
  const newsItems = useMemo(() => getNewsItems(t), [t]);

  const [todos, setTodos] = useState(todoList);

  // Update todos when language changes
  useEffect(() => {
    setTodos(todoList);
  }, [todoList]);

  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);

  // Convert dailySummary to Insight format for modal
  const dailySummaryInsight: Insight = useMemo(() => ({
    id: 'daily-summary',
    type: 'Analysis',
    title: dailySummaryData.title,
    content: dailySummaryData.content,
    tag: dailySummaryData.date,
    markdownContent: `# ${dailySummaryData.title}\n\n**Date:** ${dailySummaryData.date}\n\n${dailySummaryData.content}\n\n## Key Metrics\n\n${dailySummaryData.stats.map(stat => `- **${stat.label}:** ${stat.value}`).join('\n')}`
  }), [dailySummaryData]);

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
          <h2 className="text-blue-400 font-mono text-xs tracking-widest uppercase mb-2">{t('daily_picks.overview')}</h2>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
            {t('daily_picks.title')}
          </h1>
          <p className="text-white/50 text-lg font-light mt-2">
            {t('daily_picks.subtitle')}
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
            <span className="text-white/80 font-medium group-hover:text-white">{t('insights.today')}</span>
            <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
          </motion.button>

          {/* Customize Sources - Icon Only */}
          <GlassTooltip content={t('home.customize_sources')} side="bottom">
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
              <span className="text-xs text-white/50 font-medium group-hover:text-blue-300 transition-colors">{t('daily_picks.view_details')}</span>
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
              <h3 className="text-xl font-bold text-white tracking-tight">{t('daily_picks.todos.title')}</h3>
            </div>
            <span className="text-[10px] font-bold tracking-wider text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              {todos.filter(t => !t.completed).length} {t('daily_picks.todos.pending')}
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
