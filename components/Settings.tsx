
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, Shield, Globe, Plus, X, Minus, Save, Check } from 'lucide-react';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    tipsInterval: 15,
    todoInterval: 30,
    reportHour: '18',
    reportMinute: '00',
    skipMode: 'domain' as 'domain' | 'url',
    skipInput: '',
    excludedSites: ['facebook.com', 'ads.google.com', 'netflix.com'],
    language: 'English'
  });

  const [isSaving, setIsSaving] = useState(false);

  // Handlers
  const adjustInterval = (key: 'tipsInterval' | 'todoInterval', amount: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: Math.max(5, prev[key] + amount)
    }));
  };

  const handleAddSite = () => {
    if (settings.skipInput.trim() && !settings.excludedSites.includes(settings.skipInput.trim())) {
      setSettings(prev => ({
        ...prev,
        excludedSites: [...prev.excludedSites, prev.skipInput.trim()],
        skipInput: ''
      }));
    }
  };

  const removeSite = (siteToRemove: string) => {
    setSettings(prev => ({
      ...prev,
      excludedSites: prev.excludedSites.filter(site => site !== siteToRemove)
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-32">
      
      {/* --- Header --- */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center md:text-left"
      >
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">System Preferences</h1>
        <p className="text-white/50 text-lg font-light">
          Configure how the AI observes, analyzes, and reports on your digital context.
        </p>
      </motion.div>

      <div className="flex flex-col gap-8">

        {/* --- Section 1: AI Intelligence --- */}
        <SettingSection 
          icon={Zap} 
          title="AI Intelligence" 
          description="Adjust the frequency of context analysis. Lower intervals increase accuracy but use more resources."
          delay={0.1}
        >
          <div className="flex flex-col gap-6">
            {/* Tips Interval */}
            <IntervalControl 
              label="Insight Generation Interval"
              value={settings.tipsInterval}
              unit="min"
              onDecrement={() => adjustInterval('tipsInterval', -5)}
              onIncrement={() => adjustInterval('tipsInterval', 5)}
            />
            {/* Separator */}
            <div className="h-px bg-white/5 w-full" />
            {/* Todo Interval */}
            <IntervalControl 
              label="Action Item Extraction"
              value={settings.todoInterval}
              unit="min"
              onDecrement={() => adjustInterval('todoInterval', -5)}
              onIncrement={() => adjustInterval('todoInterval', 5)}
            />
          </div>
        </SettingSection>

        {/* --- Section 2: Daily Digest --- */}
        <SettingSection 
          icon={Clock} 
          title="Daily Digest Schedule" 
          description="Set the time for your daily summary report generation."
          delay={0.2}
        >
          {/* Cleaned up layout to match Section 1 */}
          <div className="flex items-center justify-between pt-2 group">
             <span className="text-white/70 font-medium group-hover:text-white transition-colors">Report Time</span>
             <div className="flex items-center gap-3">
                <TimeInput 
                  value={settings.reportHour} 
                  onChange={(val) => setSettings(s => ({ ...s, reportHour: val }))} 
                  max={23}
                />
                <span className="text-white/40 text-xl font-bold pb-0.5">:</span>
                <TimeInput 
                  value={settings.reportMinute} 
                  onChange={(val) => setSettings(s => ({ ...s, reportMinute: val }))} 
                  max={59}
                />
             </div>
          </div>
        </SettingSection>

        {/* --- Section 3: Privacy & Scope --- */}
        <SettingSection 
          icon={Shield} 
          title="Privacy Exclusion Zone" 
          description="Prevent the AI from analyzing content from specific domains or URLs."
          delay={0.3}
        >
          <div className="flex flex-col gap-6">
            
            {/* Segmented Control */}
            <div className="p-1 bg-black/20 rounded-lg flex relative">
               <div 
                  className="absolute top-1 bottom-1 bg-blue-500/20 rounded-md transition-all duration-300 ease-out shadow-lg border border-blue-400/30"
                  style={{ 
                    left: settings.skipMode === 'domain' ? '4px' : '50%', 
                    width: 'calc(50% - 4px)' 
                  }}
               />
               <button 
                 onClick={() => setSettings(s => ({ ...s, skipMode: 'domain' }))}
                 className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${settings.skipMode === 'domain' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
               >
                 Domain Block
               </button>
               <button 
                 onClick={() => setSettings(s => ({ ...s, skipMode: 'url' }))}
                 className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${settings.skipMode === 'url' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
               >
                 Exact URL
               </button>
            </div>

            {/* Input Field */}
            <div className="relative group">
               <input 
                 type="text" 
                 value={settings.skipInput}
                 onChange={(e) => setSettings(s => ({ ...s, skipInput: e.target.value }))}
                 onKeyDown={(e) => e.key === 'Enter' && handleAddSite()}
                 placeholder={settings.skipMode === 'domain' ? "e.g., facebook.com" : "e.g., https://site.com/private"}
                 className="w-full bg-white/5 border border-blue-400/15 rounded-xl py-3 pl-4 pr-12 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
               />
               <button 
                 onClick={handleAddSite}
                 className="absolute right-2 top-2 p-1.5 rounded-lg bg-white/5 hover:bg-blue-500 text-white/40 hover:text-white transition-all"
               >
                 <Plus className="w-4 h-4" />
               </button>
            </div>

            {/* Chips List */}
            <div className="flex flex-wrap gap-2">
               <AnimatePresence>
                 {settings.excludedSites.map((site) => (
                   <motion.div
                     key={site}
                     initial={{ opacity: 0, scale: 0.8 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.8 }}
                     className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-blue-400/15 group transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(96,165,250,0.4)] hover:border-blue-400/30 hover:-translate-y-1"
                   >
                      <span className="text-sm text-white/80 font-light">{site}</span>
                      <button onClick={() => removeSite(site)} className="text-white/20 group-hover:text-red-400 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                   </motion.div>
                 ))}
               </AnimatePresence>
               {settings.excludedSites.length === 0 && (
                 <span className="text-sm text-white/30 italic">No active exclusions.</span>
               )}
            </div>

          </div>
        </SettingSection>

        {/* --- Section 4: Localization --- */}
        <SettingSection 
          icon={Globe} 
          title="System Language" 
          description="Select the primary language for AI analysis and interface text."
          delay={0.4}
        >
           <div className="relative">
             <select 
               value={settings.language}
               onChange={(e) => setSettings(s => ({ ...s, language: e.target.value }))}
               className="w-full appearance-none bg-white/5 border border-blue-400/15 rounded-xl py-3 pl-4 pr-10 text-white outline-none focus:border-blue-500/50 cursor-pointer hover:bg-white/10 transition-colors"
             >
               <option className="bg-slate-900 text-white">English</option>
               <option className="bg-slate-900 text-white">Spanish</option>
               <option className="bg-slate-900 text-white">Mandarin</option>
               <option className="bg-slate-900 text-white">Japanese</option>
               <option className="bg-slate-900 text-white">German</option>
             </select>
             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Globe className="w-4 h-4 text-white/40" />
             </div>
           </div>
        </SettingSection>

      </div>

      {/* --- Floating Save Action --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            flex items-center gap-2 px-8 py-3 rounded-full shadow-2xl border transition-all duration-300
            ${isSaving 
              ? 'bg-green-500/20 border-green-500/50 text-green-400' 
              : 'bg-blue-600 border-blue-400/30 text-white hover:bg-blue-500'}
          `}
        >
          {isSaving ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          <span className="font-medium">{isSaving ? 'Saved' : 'Save Changes'}</span>
        </motion.button>
      </div>

    </div>
  );
};

// --- Helper Components ---

const SettingSection: React.FC<{ icon: any, title: string, description: string, children: React.ReactNode, delay: number }> = ({ icon: Icon, title, description, children, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="
      bg-white/5 backdrop-blur-xl border border-blue-400/15 rounded-2xl p-6 md:p-8
      transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(96,165,250,0.4)] hover:border-blue-400/30 hover:-translate-y-1
    "
  >
     <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-xl bg-white/5 border border-white/5 shadow-inner">
           <Icon className="w-6 h-6 text-blue-300" />
        </div>
        <div>
           <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
           <p className="text-sm text-white/50 leading-relaxed max-w-md">{description}</p>
        </div>
     </div>
     <div className="pl-0 md:pl-[4.5rem]">
        {children}
     </div>
  </motion.div>
);

const IntervalControl: React.FC<{ label: string, value: number, unit: string, onIncrement: () => void, onDecrement: () => void }> = ({ label, value, unit, onIncrement: onIncrement, onDecrement }) => (
  <div className="flex items-center justify-between group">
     <span className="text-white/70 font-medium group-hover:text-white transition-colors">{label}</span>
     <div className="flex items-center gap-3 bg-black/20 p-1 rounded-lg border border-white/5">
        <button onClick={onDecrement} className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
           <Minus className="w-4 h-4" />
        </button>
        <div className="w-12 text-center">
           <span className="text-white font-mono font-medium">{value}</span>
           <span className="text-[10px] text-white/40 ml-1">{unit}</span>
        </div>
        <button onClick={onIncrement} className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
           <Plus className="w-4 h-4" />
        </button>
     </div>
  </div>
);

const TimeInput: React.FC<{ value: string, onChange: (val: string) => void, max: number }> = ({ value, onChange, max }) => (
  <input 
    type="text"
    maxLength={2}
    value={value}
    onChange={(e) => {
      const val = e.target.value.replace(/\D/g, '');
      if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= max)) {
         onChange(val);
      }
    }}
    onBlur={() => {
       if (value.length === 1) onChange('0' + value);
       if (value === '') onChange('00');
    }}
    className="w-14 h-10 bg-white/5 border border-blue-400/15 rounded-lg text-center text-lg text-white font-normal outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder-white/20"
  />
);
