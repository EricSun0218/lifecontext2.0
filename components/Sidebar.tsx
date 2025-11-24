
import React from 'react';
import { MessageSquare, Settings, Sparkles, Book, Lightbulb } from 'lucide-react';
import { GlassTooltip } from './ui/GlassTooltip';
import { motion } from 'framer-motion';
import { HOVER_ACTION } from '../constants/animations';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

// Custom SVG Logo component - Stylized Interlocking Blue Geometric Knot
const LogoSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradBlue" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#60A5FA" />   {/* Blue 400 */}
        <stop offset="100%" stopColor="#2563EB" />  {/* Blue 600 */}
      </linearGradient>
      <linearGradient id="logoGradCyan" x1="100" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#93C5FD" />   {/* Blue 300 */}
        <stop offset="100%" stopColor="#3B82F6" />  {/* Blue 500 */}
      </linearGradient>
      <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    <g filter="url(#softGlow)">
      {/* Shape 1: Top-Right to Bottom-Left (Underneath) */}
      <path 
        d="M 65 25 L 75 25 A 15 15 0 0 1 90 40 L 90 70 A 5 5 0 0 1 85 75 L 60 75 A 15 15 0 0 1 45 60 L 45 45" 
        stroke="url(#logoGradCyan)" 
        strokeWidth="16" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />

      {/* Shape 2: Top-Left to Bottom-Right (Overlapping) */}
      <path 
        d="M 35 75 L 25 75 A 15 15 0 0 1 10 60 L 10 30 A 5 5 0 0 1 15 25 L 40 25 A 15 15 0 0 1 55 40 L 55 55" 
        stroke="url(#logoGradBlue)" 
        strokeWidth="16" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Bridge: Completing the Loop Visually */}
      {/* Connecting Shape 2 end to Shape 1 start area to create the knot loop illusion */}
      <path 
        d="M 55 55 L 55 60 A 15 15 0 0 0 70 75 L 75 75"
        stroke="url(#logoGradBlue)"
        strokeWidth="16"
        strokeLinecap="round"
      />
       {/* Connecting Shape 1 end to Shape 2 start area */}
      <path 
        d="M 45 45 L 45 40 A 15 15 0 0 0 30 25 L 25 25"
        stroke="url(#logoGradCyan)"
        strokeWidth="16"
        strokeLinecap="round"
      />
    </g>
  </svg>
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
        <LogoSVG className="w-12 h-12 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
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
