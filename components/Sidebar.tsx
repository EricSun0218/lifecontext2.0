
import React from 'react';
import { Home, MessageSquare, Layers, Settings, Hexagon } from 'lucide-react';
import { GlassTooltip } from './ui/GlassTooltip';
import { motion } from 'framer-motion';
import { HOVER_ACTION, SPRING_TIGHT } from '../constants/animations';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'timeline', icon: Layers, label: 'Timeline' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col justify-between items-center w-24 h-screen fixed left-0 top-0 z-50 bg-white/5 backdrop-blur-2xl border-r border-blue-400/15 shadow-[0_0_40px_-10px_rgba(30,58,138,0.2)] py-8">
      {/* Logo */}
      <motion.div 
        className="mb-8 p-3 bg-blue-500/20 rounded-xl border border-blue-400/30 shadow-inner backdrop-blur-md"
        whileHover={{ scale: 1.1, rotate: 180 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Hexagon className="w-8 h-8 text-blue-100 fill-blue-500/50" />
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

      {/* User Avatar */}
      <div className="mt-auto">
        <motion.div 
          variants={HOVER_ACTION}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-[2px] shadow-lg cursor-pointer"
        >
            <img 
                src="https://picsum.photos/100/100" 
                alt="User" 
                className="w-full h-full rounded-full object-cover border-2 border-white/20"
            />
        </motion.div>
      </div>
    </aside>
  );
};
