
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, Camera, Globe, Ban, Link2, Check, X, Home, Filter, TrendingUp, List, Plus, Mic, Zap, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { GlassTooltip } from './ui/GlassTooltip';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useForm } from 'react-hook-form';
import { HOVER_CARD_GLOW, NOTIFICATION_PANEL, NOTIFICATION_PANEL_CONTAINER, NOTIFICATION_ITEM } from '../constants/animations';
import { Insight } from '../types';
import { GlassModal } from './GlassModal';

// --- REUSABLE MASCOT COMPONENT ---
interface MascotProps {
  className?: string;
  isSleeping?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({ className = "w-12 h-12", isSleeping = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  // Refs to store timer IDs for proper cleanup
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Eye Tracking Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Prevent eye tracking if sleeping or blinking
      if (isSleeping || isBlinking || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angle = Math.atan2(dy, dx);
      const maxMove = 6;
      const distance = Math.min(maxMove, Math.hypot(dx, dy) / 12);

      setEyePos({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isSleeping, isBlinking]);

  // Blink & Sleep State Management
  useEffect(() => {
    // Helper to clear all active timers
    const cleanupTimers = () => {
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      blinkTimerRef.current = null;
      resetTimerRef.current = null;
    };

    if (isSleeping) {
      cleanupTimers();
      setEyePos({ x: 0, y: 0 }); // Reset eyes to center
      setIsBlinking(false);      // Ensure blink state is off so 'closed' is derived solely from isSleeping
      return;
    }

    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 5000;

      blinkTimerRef.current = setTimeout(() => {
        setIsBlinking(true);

        // Schedule eye opening
        resetTimerRef.current = setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink(); // Recursively schedule next blink
        }, 150);
      }, delay);
    };

    scheduleBlink();

    // Cleanup on unmount or when isSleeping changes
    return cleanupTimers;
  }, [isSleeping]);

  const areEyesClosed = isSleeping || isBlinking;
  const transitionConfig = { duration: isSleeping ? 0.3 : 0.1 };

  return (
    <div ref={ref} className={`${className} relative`}>
      <motion.div
        className="w-full h-full rounded-full overflow-hidden"
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full block"
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
            className="eyes"
            style={{ transform: `translate(${eyePos.x}px, ${eyePos.y}px)` }}
          >
            <AnimatePresence mode="wait">
              {!areEyesClosed ? (
                <motion.g
                  key="open"
                  initial={{ opacity: 0, scaleY: 0.8 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0.8 }}
                  transition={transitionConfig}
                >
                  <rect x="29" y="39" width="10" height="20" rx="5" fill="url(#eyeGrad)" filter="url(#eyeGlow)" />
                  <rect x="55" y="39" width="10" height="20" rx="5" fill="url(#eyeGrad)" filter="url(#eyeGlow)" />
                </motion.g>
              ) : (
                <motion.g
                  key="closed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={transitionConfig}
                >
                  <path d="M 29 50 Q 34 53 39 50" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 55 50 Q 60 53 65 50" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                </motion.g>
              )}
            </AnimatePresence>

            <path d="M 42 60 Q 47 63 52 60" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
};


// --- MAIN FLOATING COMPONENT ---

interface FloatingMascotProps {
  setActiveTab?: (tab: string) => void;
}

type NotificationItem = {
  id: string;
  type: 'insight' | 'daily';
  title: string;
  insight?: Insight;
};

export const FloatingMascotLogo: React.FC<FloatingMascotProps> = ({ setActiveTab }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Notification Panel State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Settings State
  const [isCaptureEnabled, setIsCaptureEnabled] = useState(true);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

  // Blocking State
  const [blockedDomains, setBlockedDomains] = useState<string[]>([]);
  const [blockedUrls, setBlockedUrls] = useState<string[]>([]);

  // Load Settings & Blocked Lists
  useEffect(() => {
    const storedCapture = localStorage.getItem('lc_capture_enabled');
    const storedNotify = localStorage.getItem('lc_notify_enabled');

    if (storedCapture !== null) setIsCaptureEnabled(storedCapture === 'true');
    if (storedNotify !== null) setIsNotificationEnabled(storedNotify === 'true');

    try {
      const domains = JSON.parse(localStorage.getItem('lc_blocked_domains') || '[]');
      const urls = JSON.parse(localStorage.getItem('lc_blocked_urls') || '[]');
      setBlockedDomains(domains);
      setBlockedUrls(urls);
    } catch (e) {
      console.error("Failed to load blocked lists", e);
    }
  }, []);

  // Helpers
  const isPageBlocked = () => {
    const domain = window.location.hostname;
    const url = window.location.href;
    return blockedDomains.includes(domain) || blockedUrls.includes(url);
  };

  // Computed Sleep State
  const isSleeping = !isCaptureEnabled || isPageBlocked();

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

  const handleGoHome = () => {
    if (setActiveTab) {
      setActiveTab('insights');
    }
  };

  const handleBlockDomain = () => {
    const domain = window.location.hostname;
    if (!blockedDomains.includes(domain)) {
      const newList = [...blockedDomains, domain];
      setBlockedDomains(newList);
      localStorage.setItem('lc_blocked_domains', JSON.stringify(newList));
    }
  };

  const handleBlockUrl = () => {
    const url = window.location.href;
    if (!blockedUrls.includes(url)) {
      const newList = [...blockedUrls, url];
      setBlockedUrls(newList);
      localStorage.setItem('lc_blocked_urls', JSON.stringify(newList));
    }
  };

  // Generate test notifications (insights + daily)
  const generateTestNotifications = (): NotificationItem[] => {
    const insights: Insight[] = [
      {
        id: `test-${Date.now()}-1`,
        type: 'Analysis',
        title: 'New Pattern Detected in Your Reading',
        content: 'Your recent browsing shows increased interest in AI architecture. This aligns with your current project focus.',
        tag: 'Behavior',
        markdownContent: `# New Pattern Detected in Your Reading

Your recent browsing shows increased interest in AI architecture. This aligns with your current project focus.

## Key Observations

- **Frequency**: 3x increase in AI-related content consumption
- **Topics**: MoE architectures, transformer models, multimodal AI
- **Timing**: Peak engagement between 10 AM - 2 PM

## Recommendations

1. Consider creating a knowledge base entry for AI architecture patterns
2. Schedule dedicated research time during peak hours
3. Connect these insights with your current project timeline`
      },
      {
        id: `test-${Date.now()}-2`,
        type: 'Action',
        title: 'Action Required: Review Pending Items',
        content: 'You have 3 pending action items from yesterday that need attention.',
        tag: 'Productivity',
        markdownContent: `# Action Required: Review Pending Items

You have 3 pending action items from yesterday that need attention.

## Pending Items

1. Review PR #42: Virtualization Fix
2. Research Gemini 2.5 Flash limits
3. Update Tailwind config for dark mode

## Priority

- **High**: PR #42 (Critical bug fix)
- **Medium**: Gemini research (Project planning)
- **Low**: Tailwind config (Enhancement)`
      },
      {
        id: `test-${Date.now()}-3`,
        type: 'Warning',
        title: 'Attention: Unusual Activity Pattern',
        content: 'Your browsing pattern today differs significantly from your usual routine. Consider reviewing your focus areas.',
        tag: 'Behavior',
        markdownContent: `# Attention: Unusual Activity Pattern

Your browsing pattern today differs significantly from your usual routine.

## Changes Detected

- **Time Distribution**: More evening activity than usual
- **Content Type**: Shift from technical to general interest
- **Engagement**: Lower interaction rate with deep technical content

## Possible Causes

- Context switching between multiple projects
- Research phase transition
- External factors affecting focus

## Recommendations

- Review your daily goals
- Consider time-blocking for focused work
- Check if this pattern aligns with your current priorities`
      }
    ];

    return [
      ...insights.map(insight => ({
        id: insight.id,
        type: 'insight' as const,
        title: insight.title,
        insight
      })),
      {
        id: `daily-${Date.now()}`,
        type: 'daily' as const,
        title: 'Daily Summary Ready',
      }
    ];
  };

  const showNotification = (items: NotificationItem[]) => {
    if (!isNotificationEnabled || isSleeping) return;

    // Clear existing timer
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }

    setNotifications(items);

    // Auto close after 15 seconds
    autoCloseTimerRef.current = setTimeout(() => {
      setNotifications([]);
      autoCloseTimerRef.current = null;
    }, 15000);
  };

  const handleTestNotification = () => {
    const testNotifications = generateTestNotifications();
    showNotification(testNotifications);
  };

  const handleNotificationClick = (item: NotificationItem) => {
    // Clear auto-close timer when user interacts
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }

    if (item.type === 'insight' && item.insight) {
      setSelectedInsight(item.insight);
      setNotifications([]);
    } else if (item.type === 'daily') {
      // Navigate to daily page
      if (setActiveTab) {
        setActiveTab('daily_picks');
      }
      setNotifications([]);
    }
  };

  const handleCloseNotification = () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    setNotifications([]);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {!isDialogOpen ? (
          /* --- MASCOT SPHERE & SATELLITE BUTTONS --- */
          <motion.div
            key="mascot-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
            className={`
              fixed bottom-8 right-8 z-50 flex items-end justify-end 
              transition-all duration-300 ease-out
              !border-none !outline-none
              ${isHovered ? 'w-32 h-32 pointer-events-auto' : 'w-12 h-12 pointer-events-none'}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); }}
          >
            {/* --- COMPACT INTERACTION ZONE (Invisible Bridge) --- */}
            <div
              className="absolute bottom-0 right-0 pointer-events-auto transition-all duration-300"
              style={{
                width: isHovered ? '120px' : '48px',
                height: isHovered ? '120px' : '48px',
              }}
            >
              <AnimatePresence>
                {isHovered && (
                  <>
                    {/* 1. MASTER SWITCH (Capture) */}
                    <motion.div
                      initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                      animate={{ opacity: 1, x: -58, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="absolute bottom-2 right-2 z-10"
                    >
                      <DropdownMenu.Root>
                        <GlassTooltip content={isCaptureEnabled ? "Capture On" : "Capture Off"} side="left">
                          <DropdownMenu.Trigger asChild>
                            <button
                              className={`
                                   w-8 h-8 rounded-full flex items-center justify-center 
                                   backdrop-blur-xl transition-all duration-300 shadow-lg relative
                                   !border-none !outline-none
                                   bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white/80
                                   data-[state=open]:bg-white/20 data-[state=open]:text-white
                                 `}
                            >
                              {isCaptureEnabled ? <Camera className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                            </button>
                          </DropdownMenu.Trigger>
                        </GlassTooltip>

                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            side="left"
                            align="end"
                            sideOffset={12}
                            className="
                                 w-48 bg-[#0f0c29]/95 backdrop-blur-2xl border border-blue-400/20 rounded-xl shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)] overflow-hidden p-1 flex flex-col gap-0.5 z-[100]
                                 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=left]:slide-in-from-right-2
                               "
                          >
                            <DropdownMenu.Item
                              onSelect={toggleCapture}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 cursor-pointer outline-none focus:bg-white/10 transition-colors group/item"
                            >
                              <div className={`p-1.5 rounded-md ${isCaptureEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                                {isCaptureEnabled ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-medium text-white">
                                  {isCaptureEnabled ? 'Capture On' : 'Capture Off'}
                                </span>
                              </div>
                            </DropdownMenu.Item>

                            <DropdownMenu.Separator className="h-px bg-white/5 my-0.5 mx-2" />

                            <DropdownMenu.Item
                              onSelect={handleBlockDomain}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer outline-none focus:bg-white/10 transition-colors group/item"
                            >
                              <div className="p-1.5 rounded-md bg-white/5 text-white/50 group-hover/item:bg-blue-500/20 group-hover/item:text-blue-300 transition-colors">
                                <Globe className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-medium text-white/80 group-hover/item:text-white">Block Domain</span>
                                <span className="text-[10px] text-white/30 truncate max-w-[100px]">{window.location.hostname}</span>
                              </div>
                            </DropdownMenu.Item>

                            <DropdownMenu.Item
                              onSelect={handleBlockUrl}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer outline-none focus:bg-white/10 transition-colors group/item"
                            >
                              <div className="p-1.5 rounded-md bg-white/5 text-white/50 group-hover/item:bg-blue-500/20 group-hover/item:text-blue-300 transition-colors">
                                <Link2 className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-medium text-white/80 group-hover/item:text-white">Block Page</span>
                              </div>
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </motion.div>

                    {/* 2. NOTIFICATION TOGGLE */}
                    <motion.div
                      initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                      animate={{ opacity: 1, x: -48, y: -38, scale: 1 }}
                      exit={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.05 }}
                      className="absolute bottom-2 right-2 z-10"
                    >
                      <GlassTooltip content={isNotificationEnabled ? "Mute Notifications" : "Enable Notifications"} side="top">
                        <button
                          onClick={toggleNotification}
                          className={`
                               w-8 h-8 rounded-full flex items-center justify-center 
                               backdrop-blur-xl transition-all duration-300 shadow-lg group/btn relative
                               !border-none !outline-none
                               bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white/80
                             `}
                        >
                          {isNotificationEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                        </button>
                      </GlassTooltip>
                    </motion.div>

                    {/* 3. HOME BUTTON */}
                    <motion.div
                      initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                      animate={{ opacity: 1, x: -20, y: -58, scale: 1 }}
                      exit={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                      className="absolute bottom-2 right-2 z-10"
                    >
                      <GlassTooltip content="Go Home" side="top">
                        <button
                          onClick={handleGoHome}
                          className={`
                               w-8 h-8 rounded-full flex items-center justify-center 
                               backdrop-blur-xl transition-all duration-300 shadow-lg group/btn relative
                               !border-none !outline-none
                               bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white/80
                             `}
                        >
                          <Home className="w-3.5 h-3.5" />
                        </button>
                      </GlassTooltip>
                    </motion.div>

                    {/* 4. TEST NOTIFICATION BUTTON */}
                    <motion.div
                      initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                      animate={{ opacity: 1, x: -20, y: -108, scale: 1 }}
                      exit={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
                      className="absolute bottom-2 right-2 z-10"
                    >
                      <GlassTooltip content="Test Notification" side="top">
                        <button
                          onClick={handleTestNotification}
                          className={`
                               w-8 h-8 rounded-full flex items-center justify-center 
                               backdrop-blur-xl transition-all duration-300 shadow-lg group/btn relative
                               !border-none !outline-none
                               bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white/80
                             `}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      </GlassTooltip>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* --- MASCOT SPHERE --- */}
            <div
              onClick={() => setIsDialogOpen(true)}
              className="
                absolute bottom-0 right-0
                w-12 h-12 pointer-events-auto cursor-pointer
                rounded-full
                transition-transform duration-300 ease-out 
                hover:scale-110 hover:-translate-y-1
                !shadow-[0_0_15px_-3px_rgba(96,165,250,0.6)]
                !border-none !outline-none !bg-transparent
              "
            >
              <Mascot isSleeping={isSleeping} className="w-12 h-12" />
            </div>
          </motion.div>
        ) : (
          /* --- RIGHT FLOATING CHAT CARD MODE --- */
          <RightFloatingChat
            key="floating-chat"
            onClose={() => {
              setIsDialogOpen(false);
              setIsHovered(false); // Reset hover state when dialog closes
            }}
          />
        )}
      </AnimatePresence>

      {/* Notification Panel */}
      <AnimatePresence>
        {notifications.length > 0 && (
          <InsightNotificationPanel
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            onClose={handleCloseNotification}
          />
        )}
      </AnimatePresence>

      {/* Insight Detail Modal */}
      <AnimatePresence>
        {selectedInsight && (
          <GlassModal
            key={selectedInsight.id}
            insight={selectedInsight}
            onClose={() => setSelectedInsight(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// --- RIGHT FLOATING CHAT COMPONENT ---
interface RightFloatingChatProps {
  onClose: () => void;
}

interface FloatingChatFormData {
  query: string;
}

const RightFloatingChat: React.FC<RightFloatingChatProps> = ({ onClose }) => {
  const [useContext, setUseContext] = useState(true);
  const { register, handleSubmit, setValue } = useForm<FloatingChatFormData>();

  // Quick Actions Data
  const quickActions = [
    { icon: Filter, title: "Filter Content", subtitle: "What might I like best here?", prompt: "Filter content based on my preferences" },
    { icon: TrendingUp, title: "Analyze Trends", subtitle: "What are the genre trends?", prompt: "Analyze current trends on this site" },
    { icon: List, title: "Draft Watchlist", subtitle: "Draft a list for this site.", prompt: "Draft a watchlist from this content" }
  ];

  const onSubmit = (data: FloatingChatFormData) => {
    console.log("Floating chat query:", data.query, "Context:", useContext);
    // Implement chat logic here or pass up if needed
    setValue('query', '');
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed top-4 bottom-4 right-4 w-[380px] z-[100] flex flex-col bg-[#0f0c29]/95 backdrop-blur-3xl border border-blue-400/20 shadow-2xl rounded-3xl"
    >
      {/* Header */}
      <div className="flex-none p-6 pt-6 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-bold text-white">LifeContext AI</h2>
            <p className="text-blue-200/50 text-xs font-light">Your intelligent companion</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors -mt-1 -mr-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Container */}
      <div className="flex-1 flex flex-col px-6 pb-6 pt-2 overflow-y-auto custom-scrollbar">
        {/* Quick Actions */}
        <div className="flex flex-col gap-3">
          {quickActions.map((action, i) => (
            <motion.button
              key={i}
              onClick={() => setValue('query', action.prompt)}
              variants={HOVER_CARD_GLOW}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="
                              flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-left group
                            "
            >
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-300 group-hover:text-blue-200 group-hover:bg-blue-500/20 transition-colors">
                <action.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-blue-100">{action.title}</h3>
                <p className="text-xs text-white/50 group-hover:text-white/70 mt-0.5">{action.subtitle}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="flex-1" /> {/* Spacer */}

        {/* Bottom Controls */}
        <div className="mt-6 flex flex-col gap-3">

          {/* Context Toggle Button - Compact Rectangular */}
          <div className="flex justify-start">
            <button
              onClick={() => setUseContext(!useContext)}
              className={`
                            flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300 text-xs font-medium
                            ${useContext
                  ? 'bg-blue-500/10 border-blue-400/40 text-blue-200 shadow-[0_0_10px_-2px_rgba(59,130,246,0.3)]'
                  : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60'}
                          `}
            >
              <Globe className="w-3 h-3" />
              <span>{window.location.hostname || 'localhost'}</span>
              {useContext && <Check className="w-3 h-3 ml-1" />}
            </button>
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-blue-400/20 focus-within:bg-white/10 focus-within:border-blue-400/40 transition-all"
          >
            <button type="button" className="p-3 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors">
              <Plus className="w-5 h-5" />
            </button>
            <input
              type="text"
              {...register('query')}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-white/30 h-10"
            />
            <button type="button" className="p-3 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors">
              <Mic className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  )
}

// --- INSIGHT NOTIFICATION PANEL ---
interface InsightNotificationPanelProps {
  notifications: NotificationItem[];
  onNotificationClick: (item: NotificationItem) => void;
  onClose: () => void;
}

const InsightNotificationPanel: React.FC<InsightNotificationPanelProps> = ({ notifications, onNotificationClick, onClose }) => {
  const getTypeConfig = (item: NotificationItem) => {
    if (item.type === 'daily') {
      return { badge: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20', icon: Sparkles };
    }

    if (!item.insight) {
      return { badge: 'text-blue-300 bg-blue-500/10 border-blue-500/20', icon: Zap };
    }

    switch (item.insight.type) {
      case 'Critical':
        return { badge: 'text-red-300 bg-red-400/10 border-red-400/20', icon: AlertTriangle };
      case 'Warning':
        return { badge: 'text-amber-300 bg-amber-400/10 border-amber-400/20', icon: AlertTriangle };
      case 'Action':
        return { badge: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20', icon: ArrowRight };
      case 'Analysis':
      default:
        return { badge: 'text-blue-300 bg-blue-500/10 border-blue-500/20', icon: Zap };
    }
  };

  return (
    <motion.div
      variants={NOTIFICATION_PANEL}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed bottom-24 right-8 w-[280px] z-[60] flex flex-col bg-white/5 backdrop-blur-xl border border-blue-400/15 rounded-2xl shadow-2xl max-h-[320px] overflow-hidden"
    >
      {/* Header */}
      <div className="flex-none p-2.5 pb-2 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20">
            <Sparkles className="w-3 h-3" />
          </div>
          <h3 className="text-xs font-bold text-white">{notifications.length} New</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Notifications List */}
      <motion.div
        variants={NOTIFICATION_PANEL_CONTAINER}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex-1 overflow-y-auto custom-scrollbar p-2.5 space-y-2"
      >
        {notifications.map((item) => {
          const typeConfig = getTypeConfig(item);
          const Icon = typeConfig.icon;

          return (
            <motion.div
              key={item.id}
              variants={NOTIFICATION_ITEM}
              whileHover={{ scale: 1.02 }}
              onClick={() => onNotificationClick(item)}
              className="
                p-2.5 rounded-xl bg-white/5 border border-white/5 cursor-pointer group
                hover:bg-white/10 hover:border-blue-400/30 transition-all backdrop-blur-sm
              "
            >
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-md border ${typeConfig.badge} flex-shrink-0 backdrop-blur-md`}>
                  <Icon className="w-3 h-3" />
                </div>
                <h4 className="text-xs font-medium text-white/90 group-hover:text-white transition-colors line-clamp-2 flex-1">
                  {item.title}
                </h4>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};
