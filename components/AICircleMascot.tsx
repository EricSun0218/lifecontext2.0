
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, Camera, Globe, Ban, Link2, Check, X } from 'lucide-react';

export const FloatingMascotLogo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Settings State
  const [isCaptureEnabled, setIsCaptureEnabled] = useState(true);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  
  // Persist settings
  useEffect(() => {
    const storedCapture = localStorage.getItem('lc_capture_enabled');
    const storedNotify = localStorage.getItem('lc_notify_enabled');
    if (storedCapture !== null) setIsCaptureEnabled(storedCapture === 'true');
    if (storedNotify !== null) setIsNotificationEnabled(storedNotify === 'true');
  }, []);

  const toggleCapture = () => {
    const newState = !isCaptureEnabled;
    setIsCaptureEnabled(newState);
    localStorage.setItem('lc_capture_enabled', String(newState));
  };

  const toggleNotification = () => {
    const newState = !isNotificationEnabled;
    setIsNotificationEnabled(newState);
    localStorage.setItem('lc_notify_enabled', String(newState));
  };

  const handleBlockDomain = () => {
    // Logic to block current domain would go here
    console.log(`Blocking domain: ${window.location.hostname}`);
  };

  const handleBlockUrl = () => {
    // Logic to block current URL would go here
    console.log(`Blocking URL: ${window.location.href}`);
  };

  // Eye Tracking Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angle = Math.atan2(dy, dx);
      const maxMove = 6;
      const distance = Math.min(maxMove, Math.hypot(dx, dy) / 15);

      setEyePos({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-8 right-8 z-50 flex flex-col items-end justify-end pointer-events-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setActiveMenu(null); }}
    >
      {/* --- SATELLITE BUTTONS CONTAINER --- */}
      <div className="absolute inset-0 pointer-events-auto">
         <AnimatePresence>
            {isHovered && (
              <>
                {/* 1. NOTIFICATION TOGGLE (Left) */}
                <motion.div
                   initial={{ opacity: 0, x: 20, scale: 0.8 }}
                   animate={{ opacity: 1, x: -60, scale: 1 }} // Position to left
                   exit={{ opacity: 0, x: 20, scale: 0.8 }}
                   transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.05 }}
                   className="absolute bottom-1 right-1"
                >
                   <button
                     onClick={toggleNotification}
                     className={`
                       w-10 h-10 rounded-full flex items-center justify-center 
                       backdrop-blur-xl border transition-all duration-300 shadow-lg group/btn relative
                       ${isNotificationEnabled 
                         ? 'bg-blue-500/20 border-blue-400/30 text-blue-200 hover:bg-blue-500/30' 
                         : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60'}
                     `}
                   >
                     {isNotificationEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                     
                     {/* Tooltip */}
                     <span className="absolute right-full mr-2 px-2 py-1 bg-slate-900/90 border border-white/10 text-[10px] text-white rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                       {isNotificationEnabled ? 'Notifications On' : 'Notifications Off'}
                     </span>
                   </button>
                </motion.div>

                {/* 2. CAPTURE CONTROL (Top) */}
                <motion.div
                   initial={{ opacity: 0, y: 20, scale: 0.8 }}
                   animate={{ opacity: 1, y: -60, scale: 1 }} // Position to top
                   exit={{ opacity: 0, y: 20, scale: 0.8 }}
                   transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                   className="absolute bottom-1 right-1"
                   onMouseEnter={() => setActiveMenu('capture')}
                   onMouseLeave={() => setActiveMenu(null)}
                >
                   <button
                     className={`
                       w-10 h-10 rounded-full flex items-center justify-center 
                       backdrop-blur-xl border transition-all duration-300 shadow-lg relative
                       ${isCaptureEnabled 
                         ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/30' 
                         : 'bg-red-500/10 border-red-400/20 text-red-300 hover:bg-red-500/20'}
                     `}
                   >
                     {isCaptureEnabled ? <Camera className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                   </button>

                   {/* --- CAPTURE MENU (Dropdown) --- */}
                   <AnimatePresence>
                     {activeMenu === 'capture' && (
                       <motion.div
                         initial={{ opacity: 0, y: 10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: 5, scale: 0.95 }}
                         className="absolute bottom-full mb-3 right-0 w-48 bg-[#0f0c29]/95 backdrop-blur-2xl border border-blue-400/20 rounded-xl shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)] overflow-hidden p-1 flex flex-col gap-0.5 z-[60]"
                       >
                          {/* Item 1: Toggle Master Switch */}
                          <div 
                             onClick={toggleCapture}
                             className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 cursor-pointer group/item transition-colors"
                          >
                             <div className={`p-1.5 rounded-md ${isCaptureEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                               {isCaptureEnabled ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                             </div>
                             <div className="flex flex-col">
                               <span className="text-xs font-medium text-white">
                                 {isCaptureEnabled ? 'Capture On' : 'Capture Off'}
                               </span>
                               <span className="text-[10px] text-white/40">Master switch</span>
                             </div>
                          </div>

                          <div className="h-px bg-white/5 my-0.5 mx-2" />

                          {/* Item 2: Block Domain */}
                          <div 
                             onClick={handleBlockDomain}
                             className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer group/item transition-colors"
                          >
                             <div className="p-1.5 rounded-md bg-white/5 text-white/50 group-hover/item:bg-blue-500/20 group-hover/item:text-blue-300 transition-colors">
                               <Globe className="w-3.5 h-3.5" />
                             </div>
                             <div className="flex flex-col">
                               <span className="text-xs font-medium text-white/80 group-hover/item:text-white">Block Domain</span>
                               <span className="text-[10px] text-white/30 truncate max-w-[100px]">{window.location.hostname}</span>
                             </div>
                          </div>

                          {/* Item 3: Block URL */}
                          <div 
                             onClick={handleBlockUrl}
                             className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer group/item transition-colors"
                          >
                             <div className="p-1.5 rounded-md bg-white/5 text-white/50 group-hover/item:bg-blue-500/20 group-hover/item:text-blue-300 transition-colors">
                               <Link2 className="w-3.5 h-3.5" />
                             </div>
                             <div className="flex flex-col">
                               <span className="text-xs font-medium text-white/80 group-hover/item:text-white">Block Page</span>
                               <span className="text-[10px] text-white/30">Specific URL</span>
                             </div>
                          </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </motion.div>
              </>
            )}
         </AnimatePresence>
      </div>

      {/* --- MASCOT SPHERE --- */}
      <div 
        className="
          relative w-12 h-12 pointer-events-auto
          rounded-full
          transition-transform duration-300 ease-out 
          hover:scale-110 hover:-translate-y-1
          !shadow-[0_0_15px_-3px_rgba(96,165,250,0.6)]
        "
      >
        {/* CLIPPING CONTAINER */ }
        <div className="w-full h-full rounded-full overflow-hidden !bg-transparent !border-none !outline-none !shadow-none !p-0 !m-0">
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full block !border-none !outline-none"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <radialGradient id="blueJellyGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="85%" stopColor="#1e3a8a" />
                <stop offset="100%" stopColor="#172554" />
              </radialGradient>

              <filter id="wetBlur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
              </filter>

              <filter id="rimGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feMorphology operator="erode" radius="1.5" in="SourceAlpha" result="eroded" />
                <feComposite operator="out" in="SourceAlpha" in2="eroded" result="outline" />
                <feGaussianBlur in="outline" stdDeviation="1.5" result="blurredOutline" />
                <feFlood floodColor="rgba(147, 197, 253, 0.4)" result="glowColor" />
                <feComposite operator="in" in="glowColor" in2="blurredOutline" result="finalGlow" />
                <feMerge>
                  <feMergeNode in="SourceGraphic" />
                  <feMergeNode in="finalGlow" />
                </feMerge>
              </filter>

              <filter id="eyeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
                <feFlood floodColor="rgba(191, 219, 254, 0.5)" result="glowColor" />
                <feComposite in="glowColor" in2="blur" operator="in" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              
              <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#dbeafe" />
              </linearGradient>
            </defs>

            <circle cx="50" cy="50" r="50" fill="url(#blueJellyGrad)" filter="url(#rimGlow)" />

            <path 
              d="M 25 25 Q 50 15 75 25" 
              fill="none" 
              stroke="white" 
              strokeWidth="3" 
              strokeLinecap="round" 
              opacity="0.25" 
              filter="url(#wetBlur)" 
            />
            <ellipse cx="35" cy="30" rx="18" ry="10" fill="white" opacity="0.15" transform="rotate(-20 35 30)" filter="url(#wetBlur)" />

            <ellipse cx="25" cy="55" rx="6" ry="3" fill="#f472b6" opacity="0.2" filter="url(#wetBlur)" />
            <ellipse cx="75" cy="55" rx="6" ry="3" fill="#f472b6" opacity="0.2" filter="url(#wetBlur)" />

            <g 
              className="eyes transition-transform duration-100 ease-out" 
              style={{ transform: `translate(${eyePos.x}px, ${eyePos.y}px)` }}
            >
              <rect x="29" y="39" width="10" height="20" rx="5" fill="url(#eyeGrad)" filter="url(#eyeGlow)" />
              <rect x="55" y="39" width="10" height="20" rx="5" fill="url(#eyeGrad)" filter="url(#eyeGlow)" />
              <path d="M 42 60 Q 47 63 52 60" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
