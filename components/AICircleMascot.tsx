
import React, { useEffect, useRef, useState } from 'react';

export const FloatingMascotLogo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      // Get mascot center position
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      // Calculate angle
      const angle = Math.atan2(dy, dx);

      // Calculate distance (clamped to max 6px movement so eyes stay on face)
      const maxMove = 6;
      const distance = Math.min(maxMove, Math.hypot(dx, dy) / 15);

      // Calculate new eye coordinates
      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;

      setEyePos({ x: moveX, y: moveY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed bottom-8 right-8 z-50 cursor-pointer group select-none"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div 
        className="
          relative w-24 h-24 
          rounded-full
          transition-transform duration-300 ease-out 
          group-hover:scale-110 group-hover:-translate-y-1
          /* CSS GLOW: GPU accelerated and strictly circular, avoiding SVG box artifacts */
          shadow-[0_0_25px_-5px_rgba(96,165,250,0.6)]
        "
      >
        {/* CLIPPING CONTAINER: Ensures SVG stays perfectly round */ }
        <div className="w-full h-full rounded-full overflow-hidden bg-transparent">
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full block"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* 1. Deep Blue/Indigo Jelly Gradient */}
              <radialGradient id="blueJellyGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#60a5fa" />   {/* Blue 400 Highlight */}
                <stop offset="85%" stopColor="#1e3a8a" />  {/* Blue 900 Body */}
                <stop offset="100%" stopColor="#172554" /> {/* Deep Indigo Edge */}
              </radialGradient>

              {/* 2. Wet Surface Highlight Filter (Smoother) */}
              <filter id="wetBlur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
              </filter>

              {/* 3. Inner Rim Glow Filter (Blue Edge Definition) */}
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

              {/* 4. Eye Glow (Blue Tint) */}
              <filter id="eyeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
                <feFlood floodColor="rgba(191, 219, 254, 0.5)" result="glowColor" />
                <feComposite in="glowColor" in2="blur" operator="in" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              
              {/* 5. Eye Gradient (Cool White) */}
              <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#dbeafe" />
              </linearGradient>
            </defs>

            {/* THE BODY: Blue Jelly Sphere with Rim Light */}
            {/* r=50 fills the overflow-hidden container exactly */}
            <circle cx="50" cy="50" r="50" fill="url(#blueJellyGrad)" filter="url(#rimGlow)" />

            {/* WET HIGHLIGHT: Top-Left Reflection */}
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

            {/* BLUSH SPOTS (Soft Pink/Blue mix) */}
            <ellipse cx="25" cy="55" rx="6" ry="3" fill="#f472b6" opacity="0.2" filter="url(#wetBlur)" />
            <ellipse cx="75" cy="55" rx="6" ry="3" fill="#f472b6" opacity="0.2" filter="url(#wetBlur)" />

            {/* THE EYES: Glowing Vertical Pills - Slightly Top-Left */}
            <g 
              className="eyes transition-transform duration-100 ease-out" 
              style={{ transform: `translate(${eyePos.x}px, ${eyePos.y}px)` }}
            >
              {/* Left Pill */}
              <rect 
                x="29" y="39" width="10" height="20" rx="5" 
                fill="url(#eyeGrad)" 
                filter="url(#eyeGlow)" 
              />
              {/* Right Pill */}
              <rect 
                x="55" y="39" width="10" height="20" rx="5" 
                fill="url(#eyeGrad)" 
                filter="url(#eyeGlow)" 
              />
              
              {/* Tiny Smile (Centered between eyes: Center X = 47) */}
              <path 
                 d="M 42 60 Q 47 63 52 60" 
                 fill="none" 
                 stroke="rgba(255,255,255,0.6)" 
                 strokeWidth="1.5" 
                 strokeLinecap="round"
              />
            </g>
          </svg>
        </div>

        {/* Hover Tooltip */}
        <div className="absolute bottom-full mb-3 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          <span className="px-3 py-1 bg-slate-900/90 backdrop-blur-md rounded-full text-xs text-blue-100 font-medium border border-blue-400/20 shadow-lg">
            AI Companion
          </span>
        </div>
      </div>
    </div>
  );
};
