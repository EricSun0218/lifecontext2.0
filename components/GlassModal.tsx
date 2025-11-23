
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Zap, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Insight } from '../types';

interface GlassModalProps {
  insight: Insight;
  onClose: () => void;
}

export const GlassModal: React.FC<GlassModalProps> = ({ insight, onClose }) => {
  
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  let typeConfig = {
    badge: 'text-blue-300 bg-blue-400/10 border-blue-400/20',
    icon: Zap
  };

  if (insight.type === 'Critical') {
    typeConfig = { badge: 'text-red-300 bg-red-400/10 border-red-400/20', icon: AlertTriangle };
  } else if (insight.type === 'Warning') {
    typeConfig = { badge: 'text-amber-300 bg-amber-400/10 border-amber-400/20', icon: AlertTriangle };
  } else if (insight.type === 'Action') {
    typeConfig = { badge: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20', icon: ArrowRight };
  } else if (insight.type === 'Analysis') {
    typeConfig = { badge: 'text-blue-300 bg-blue-500/10 border-blue-500/20', icon: Zap };
  }

  const Icon = typeConfig.icon;

  // Animation Variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  // Content variants for staggered fade in/out
  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.1, duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      transition: { duration: 0.15 } // Fast exit to prevent clipping
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
      
      {/* Backdrop */}
      <motion.div 
        className="absolute inset-0 bg-[#0f0c29]/60 backdrop-blur-[4px]"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      />

      {/* Main Modal Card with Shared Layout ID */}
      <motion.div 
        layoutId={insight.id}
        className="relative w-full max-w-[720px] max-h-[85vh] flex flex-col rounded-3xl border border-blue-400/15 border-t-blue-400/30 shadow-[0_0_50px_-12px_rgba(96,165,250,0.25)] overflow-hidden origin-center"
        style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(59,130,246,0.05) 50%, rgba(15,23,42,0.4) 100%)",
            backdropFilter: "blur(24px)",
            willChange: "transform, opacity" // Performance hint
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 1
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Area */}
        <motion.div 
          className="flex-none p-6 border-b border-white/5"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex justify-between items-start mb-4">
             <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${typeConfig.badge} backdrop-blur-md`}>
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {insight.type}
                </span>
             </div>
             
             <button 
               onClick={onClose}
               className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white hover:text-white group"
             >
               <X className="w-4 h-4" />
             </button>
          </div>

          <h2 className="text-2xl font-bold text-white leading-tight mb-3">
            {insight.title}
          </h2>
        </motion.div>

        {/* Scrollable Rich Content */}
        <motion.div 
          className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar scrollbar-thumb-blue-500/20 pb-12"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
           <div className="prose prose-invert max-w-none">
             <ReactMarkdown
               components={{
                 p: ({node, ...props}) => <p className="text-blue-50/90 leading-7 mb-4 font-light" {...props} />,
                 h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mt-6 mb-4" {...props} />,
                 h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-white mt-6 mb-3 border-b border-blue-400/10 pb-2" {...props} />,
                 h3: ({node, ...props}) => <h3 className="text-lg font-medium text-blue-100 mt-5 mb-2" {...props} />,
                 ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-2 text-blue-100/80 marker:text-blue-400" {...props} />,
                 li: ({node, ...props}) => <li className="pl-1" {...props} />,
                 strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
                 blockquote: ({node, ...props}) => (
                   <blockquote className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 my-6 not-italic shadow-inner" {...props} />
                 ),
                 code: ({node, ...props}) => <code className="bg-black/30 rounded-md px-1.5 py-0.5 text-sm font-mono text-blue-200" {...props} />,
               }}
             >
               {insight.markdownContent || insight.content}
             </ReactMarkdown>
           </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
