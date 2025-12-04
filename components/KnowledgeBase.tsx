
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Plus, List, ArrowUpDown, ChevronRight, ChevronDown,
    Folder, FileText, Video, Image as ImageIcon, MoreHorizontal,
    Globe, Youtube, Mic, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { HOVER_ACTION, HOVER_CARD_GLOW, FADE_IN_UP_ITEM } from '../constants/animations';
import { INITIAL_CATEGORIES, KNOWLEDGE_ITEMS, Category, KnowledgeItem } from '../constants/mockData';

export const KnowledgeBase: React.FC = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState(INITIAL_CATEGORIES);
    const [searchQuery, setSearchQuery] = useState('');
    // Initialize based on screen width if available
    const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth >= 768 : true
    );
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth < 768 : false
    );

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleCategory = (id: string) => {
        setCategories(prev => prev.map(cat => {
            if (cat.id === id) return { ...cat, isOpen: !cat.isOpen };
            return cat;
        }));
    };

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)]">
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b border-blue-400/10 pb-6 shrink-0">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-blue-400 font-mono text-xs tracking-widest uppercase mb-2">{t('knowledge.library')}</h2>
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                        {t('knowledge.title')}
                    </h1>
                    <p className="text-white/50 text-lg font-light mt-2">
                        {t('knowledge.subtitle')}
                    </p>
                </motion.div>

                {/* Header Toolbar */}
                <div className="mt-6 md:mt-0 flex items-center gap-3">
                    <button className="p-2.5 rounded-xl bg-white/5 border border-blue-400/15 text-blue-200 hover:text-white hover:bg-white/10 transition-all shadow-[0_0_15px_-5px_rgba(59,130,246,0.2)]">
                        <Search className="w-5 h-5" />
                    </button>
                    <button className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-blue-400/15 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium">
                        <List className="w-4 h-4" />
                        <span>{t('knowledge.list')}</span>
                    </button>
                    <button className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-blue-400/15 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium">
                        <span>{t('knowledge.order_by')}</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] transition-all text-sm font-medium">
                        <Plus className="w-4 h-4" />
                        <span className="hidden md:inline">{t('knowledge.add_content')}</span>
                        <span className="md:hidden">Add</span>
                    </button>
                </div>
            </div>

            {/* --- SPLIT VIEW CONTENT --- */}
            <div className="flex flex-1 gap-0 md:gap-3 relative min-h-0">
                {/* --- MOBILE BACKDROP --- */}
                <AnimatePresence>
                    {isMobile && isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden"
                        />
                    )}
                </AnimatePresence>

                {/* --- LEFT SIDEBAR (Categories) --- */}
                <motion.aside
                    initial={false}
                    animate={{
                        width: isSidebarOpen ? 256 : 0,
                        opacity: isSidebarOpen ? 1 : 0,
                        marginRight: (isSidebarOpen || isMobile) ? 0 : -32,
                        x: isMobile && !isSidebarOpen ? -256 : 0
                    }}
                    transition={{ duration: isMobile ? 0.3 : 0, ease: "easeInOut" }}
                    className={`
                        flex-shrink-0 flex flex-col gap-4 overflow-hidden
                        ${isMobile ? 'absolute left-0 top-0 bottom-0 z-30 bg-[#0f0c29] border-r border-blue-400/20 shadow-2xl' : ''}
                    `}
                >
                    <div className="flex items-center justify-between mb-2 px-2 min-w-[240px] pt-4 md:pt-0">
                        <div className="flex gap-2">
                            <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                                <List className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                                <ArrowUpDown className="w-4 h-4" />
                            </button>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                        >
                            <ChevronsLeft className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-1 min-w-[240px]">
                        {categories.map(category => (
                            <div key={category.id} className="flex flex-col">
                                <button
                                    onClick={() => toggleCategory(category.id)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-colors group text-sm font-medium"
                                >
                                    {category.isOpen ? (
                                        <ChevronDown className="w-3.5 h-3.5 text-white/40 group-hover:text-white/60" />
                                    ) : (
                                        <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white/60" />
                                    )}
                                    <span>{t(category.name)}</span>
                                </button>

                                {category.isOpen && category.children && (
                                    <div className="ml-4 pl-2 border-l border-white/5 space-y-0.5 mt-1">
                                        {category.children.map(child => (
                                            <button
                                                key={child.id}
                                                className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors text-sm text-left"
                                            >
                                                {/* Icon based on name or default */}
                                                <Folder className="w-3.5 h-3.5 text-blue-400/60" />
                                                <span className="truncate">{t(child.name)}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-colors group text-sm font-medium mt-4">
                            <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white/60" />
                            <span className="italic opacity-70">{t('knowledge.untagged')}</span>
                        </button>
                    </div>
                </motion.aside>

                {/* Expand Button (Visible when sidebar is closed) */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                        opacity: !isSidebarOpen ? 1 : 0,
                        x: !isSidebarOpen ? 0 : -20,
                        pointerEvents: !isSidebarOpen ? 'auto' : 'none'
                    }}
                    className="absolute left-0 top-0 z-10"
                >
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <ChevronsRight className="w-4 h-4" />
                    </button>
                </motion.div>

                {/* --- MAIN CONTENT --- */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Content Area */}
                    <div className={`flex-1 overflow-y-auto custom-scrollbar px-4 md:px-6 pb-6 pt-1.5 ${!isSidebarOpen ? '!pl-11' : ''}`}>

                        {/* Date Group */}
                        <div className="mb-8">
                            <h3 className="text-white/50 font-mono text-sm mb-4 pl-1">Fri Nov 28 2025</h3>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                                {/* First Item - Large Preview (Text) */}
                                <KnowledgeCard item={KNOWLEDGE_ITEMS[0]} />
                            </div>
                        </div>

                        {/* Date Group */}
                        <div className="mb-12">
                            <h3 className="text-white/50 font-mono text-sm mb-4 pl-1">Fri Nov 21 2025</h3>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                                {KNOWLEDGE_ITEMS.slice(1).map(item => (
                                    <KnowledgeCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Sub-Component: Knowledge Card ---
const KnowledgeCard: React.FC<{ item: KnowledgeItem }> = ({ item }) => {
    const { t } = useTranslation();
    return (
        <motion.div
            variants={HOVER_CARD_GLOW}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="group flex flex-col w-full relative overflow-hidden rounded-3xl backdrop-blur-md border cursor-pointer bg-white/[0.02]"
        >
            {/* Thumbnail / Preview */}
            <div className="aspect-video w-full bg-black/20 relative overflow-hidden shrink-0">
                {item.thumbnail ? (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c29] via-transparent to-transparent opacity-60 z-10" />
                        <motion.img
                            src={item.thumbnail}
                            alt={t(item.title)}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.7 }}
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-white/0">
                        {item.type === 'text' && <FileText className="w-12 h-12 text-white/10 group-hover:text-white/20 transition-colors" />}
                        {item.type === 'video' && <Video className="w-12 h-12 text-white/10 group-hover:text-white/20 transition-colors" />}
                        {item.type === 'image' && <ImageIcon className="w-12 h-12 text-white/10 group-hover:text-white/20 transition-colors" />}
                    </div>
                )}

                {/* Type Icon Overlay */}
                <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-white/70 z-20">
                    {item.type === 'text' && <FileText className="w-3.5 h-3.5" />}
                    {item.type === 'video' && <Youtube className="w-3.5 h-3.5" />}
                    {item.type === 'image' && <ImageIcon className="w-3.5 h-3.5" />}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <h4 className="text-white font-medium leading-snug mb-2 line-clamp-2 group-hover:text-blue-200 transition-colors">
                    {t(item.title)}
                </h4>
                <p className="text-white/50 text-xs leading-relaxed line-clamp-3 mb-4 flex-1">
                    {t(item.description)}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                        {item.tags?.map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] text-white/60">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Source Icon (Optional) */}
                    {item.source && (
                        <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">
                            {item.source}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
