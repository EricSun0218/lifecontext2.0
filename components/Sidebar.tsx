
import React from 'react';
import { MessageSquare, Settings, Sparkles, Book, Lightbulb } from 'lucide-react';
import { GlassTooltip } from './ui/GlassTooltip';
import { motion } from 'framer-motion';
import { HOVER_ACTION } from '../constants/animations';
import logoImage from '../assets/logo.png';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

// Logo Image Component
const LogoImage: React.FC<{ className?: string }> = ({ className }) => (
  <img 
    src={logoImage} 
    alt="LifeContext Logo" 
    className={className}
  />
);

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'insights', icon: Lightbulb, label: 'Insights' }, // Main Dashboard (Timeline View)
    { id: 'daily_picks', icon: Sparkles, label: 'Daily Picks' }, // Original Home (News Grid)
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'knowledge', icon: Book, label: 'Knowledge Base' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col justify-start items-center w-24 h-screen fixed left-0 top-0 z-50 bg-white/5 backdrop-blur-2xl border-r border-blue-400/15 shadow-[0_0_40px_-10px_rgba(30,58,138,0.2)] py-8">
      {/* Logo - Clean, no box, no rotation */}
      <motion.div 
        className="mb-10 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
      >
        <LogoImage className="w-12 h-12 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
      </motion.div>

      {/* Navigation */}
      <nav className="flex flex-col gap-6 w-full px-4">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <GlassTooltip key={item.id} content={item.label} side="right">
              <motion.button
                onClick={() => setActiveTab(item.id)}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                variants={HOVER_ACTION}
                animate={{ 
                  backgroundColor: isActive ? 'rgba(59,130,246,0.2)' : 'rgba(0,0,0,0)',
                  borderColor: isActive ? 'rgba(96,165,250,0.3)' : 'transparent',
                  boxShadow: isActive ? '0 0 20px rgba(59,130,246,0.2)' : 'none'
                }}
                className={`
                  relative group flex items-center justify-center w-full aspect-square rounded-2xl
                  border border-transparent
                `}
                aria-label={item.label}
              >
                <item.icon 
                  className={`w-6 h-6 transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </motion.button>
            </GlassTooltip>
          );
        })}
      </nav>
    </aside>
  );
};
