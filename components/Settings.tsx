
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, Shield, Globe, Plus, X, Minus, Save, Check, Calendar, ChevronDown } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { HOVER_ACTION, HOVER_CARD_GLOW, FAST_CASCADE_CONTAINER, FAST_FADE_UP_ITEM } from '../constants/animations';

interface SettingsFormData {
  tipsInterval: number;
  reportTime: Date;
  skipMode: 'domain' | 'url';
  skipInput: string;
  excludedSites: string[];
  language: string;
}

export const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);

  // Initialize report time to today at 18:00
  const defaultReportTime = new Date();
  defaultReportTime.setHours(18, 0, 0, 0);

  const { control, register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SettingsFormData>({
    defaultValues: {
      tipsInterval: 15,
      reportTime: defaultReportTime,
      skipMode: 'domain',
      skipInput: '',
      excludedSites: ['facebook.com', 'ads.google.com', 'netflix.com'],
      language: i18n.language === 'zh' ? '中文' : 'English'
    }
  });

  const tipsInterval = watch('tipsInterval');
  const skipMode = watch('skipMode');
  const skipInput = watch('skipInput');
  const excludedSites = watch('excludedSites');

  // Handlers
  const adjustTipsInterval = (amount: number) => {
    const currentValue = tipsInterval;
    const newValue = currentValue + amount;
    // Only allow multiples of 15, max 60
    const clampedValue = Math.max(15, Math.min(60, Math.round(newValue / 15) * 15));
    setValue('tipsInterval', clampedValue);
  };

  const handleAddSite = () => {
    if (skipInput.trim() && !excludedSites.includes(skipInput.trim())) {
      setValue('excludedSites', [...excludedSites, skipInput.trim()]);
      setValue('skipInput', '');
    }
  };

  const removeSite = (siteToRemove: string) => {
    setValue('excludedSites', excludedSites.filter(site => site !== siteToRemove));
  };

  const onSubmit = (data: SettingsFormData) => {
    console.log("Saving settings:", data);
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <motion.form
      variants={FAST_CASCADE_CONTAINER}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-2xl mx-auto pb-32"
    >

      {/* --- Header --- */}
      <motion.div
        variants={FAST_FADE_UP_ITEM}
        className="mb-10 text-center md:text-left"
      >
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">System Preferences</h1>
        <p className="text-white/50 text-lg font-light">
          Configure how the AI observes, analyzes, and reports on your digital context.
        </p>
      </motion.div>

      <motion.div
        variants={FAST_CASCADE_CONTAINER}
        className="flex flex-col gap-8"
      >

        {/* --- Section 1: AI Intelligence --- */}
        <SettingSection
          icon={Zap}
          title="AI Intelligence"
          description="Adjust the frequency of context analysis. Lower intervals increase accuracy but use more resources."
        >
          <div className="flex flex-col gap-6">
            {/* Tips Interval */}
            <IntervalControl
              label="Insight Generation Interval"
              value={tipsInterval}
              unit="min"
              onDecrement={() => adjustTipsInterval(-15)}
              onIncrement={() => adjustTipsInterval(15)}
            />
          </div>
        </SettingSection>

        {/* --- Section 2: Daily Digest --- */}
        <SettingSection
          icon={Clock}
          title="Daily Digest Schedule"
          description="Set the time for your daily summary report generation."
        >
          <div className="flex items-center justify-between pt-2 group">
            <span className="text-white/70 font-medium group-hover:text-white transition-colors">Report Time</span>
            <div className="relative">
              <Controller
                control={control}
                name="reportTime"
                render={({ field }) => (
                  <TimePicker value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
          </div>
        </SettingSection>

        {/* --- Section 3: Privacy & Scope --- */}
        <SettingSection
          icon={Shield}
          title="Privacy Exclusion Zone"
          description="Prevent the AI from analyzing content from specific domains or URLs."
        >
          <div className="flex flex-col gap-6">

            {/* Segmented Control */}
            <div className="p-1 bg-black/20 rounded-lg flex relative isolate">
              <motion.div
                className="absolute top-1 bottom-1 bg-blue-500/20 rounded-md shadow-lg border border-blue-400/30 z-[-1]"
                initial={false}
                animate={{
                  left: skipMode === 'domain' ? '4px' : '50%',
                  width: 'calc(50% - 4px)'
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
              <button
                type="button"
                onClick={() => setValue('skipMode', 'domain')}
                className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${skipMode === 'domain' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                Domain Block
              </button>
              <button
                type="button"
                onClick={() => setValue('skipMode', 'url')}
                className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${skipMode === 'url' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                Exact URL
              </button>
            </div>

            {/* Input Field */}
            <div className="relative group">
              <input
                type="text"
                {...register('skipInput')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSite();
                  }
                }}
                placeholder={skipMode === 'domain' ? "e.g., facebook.com" : "e.g., https://site.com/private"}
                className="w-full bg-white/5 border border-blue-400/15 rounded-xl py-3 pl-4 pr-12 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
              />
              <motion.button
                type="button"
                variants={HOVER_ACTION}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={handleAddSite}
                className="absolute right-2 top-2 p-1.5 rounded-lg bg-white/5 hover:bg-blue-500 text-white/40 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Chips List */}
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {excludedSites.map((site) => (
                  <motion.div
                    key={site}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.1)" }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-blue-400/15 group cursor-pointer"
                  >
                    <span className="text-sm text-white/80 font-light">{site}</span>
                    <button type="button" onClick={() => removeSite(site)} className="text-white/20 group-hover:text-red-400 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {excludedSites.length === 0 && (
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
        >
          <div className="relative z-10">
            <Controller
              control={control}
              name="language"
              render={({ field }) => (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="w-full flex items-center justify-between bg-white/5 border border-blue-400/15 rounded-xl py-3 pl-4 pr-4 text-white outline-none focus:border-blue-500/50 cursor-pointer hover:bg-white/10 transition-colors group text-left">
                      <span className="text-white font-medium">{field.value}</span>
                      <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      align="start"
                      sideOffset={8}
                      className="w-[280px] bg-[#0f0c29]/95 backdrop-blur-2xl border border-blue-400/20 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden p-1 z-[100] animate-in fade-in zoom-in-95 duration-200"
                    >
                      {[
                        { label: 'English', value: 'en' },
                        { label: '中文', value: 'zh' }
                      ].map((lang) => (
                        <DropdownMenu.Item
                          key={lang.value}
                          onSelect={() => {
                            field.onChange(lang.label);
                            i18n.changeLanguage(lang.value);
                          }}
                          className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/10 cursor-pointer outline-none transition-colors text-sm text-white/80 hover:text-white data-[highlighted]:bg-white/10"
                        >
                          {lang.label}
                          {field.value === lang.label && <Check className="w-3.5 h-3.5 text-blue-400" />}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              )}
            />
          </div>
        </SettingSection>

      </motion.div>

      {/* --- Floating Save Action --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <motion.button
          type="submit"
          variants={FAST_FADE_UP_ITEM}
          whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 500, damping: 30 } }}
          whileTap={{ scale: 0.95 }}
          className={`
            flex items-center gap-2 px-8 py-3 rounded-full shadow-[0_0_20px_-5px_rgba(0,0,0,0.3)] border backdrop-blur-xl transition-all duration-300
            ${isSaving
              ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300 shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]'
              : 'bg-blue-500/20 border-blue-400/30 text-blue-100 hover:bg-blue-500/30 hover:border-blue-400/50 hover:text-white hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)]'}
          `}
        >
          {isSaving ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          <span className="font-medium">{isSaving ? 'Saved' : 'Save Changes'}</span>
        </motion.button>
      </div>

    </motion.form>
  );
};

// --- Helper Components ---

const SettingSection: React.FC<{ icon: any, title: string, description: string, children: React.ReactNode }> = ({ icon: Icon, title, description, children }) => {
  // Merge variants to support both entry (FAST_FADE_UP_ITEM) and hover (HOVER_CARD_GLOW)
  const variants = {
    ...FAST_FADE_UP_ITEM,
    hover: HOVER_CARD_GLOW.hover,
    tap: HOVER_CARD_GLOW.tap
  };

  return (
    <motion.div
      variants={variants}
      whileHover="hover"
      className="bg-white/5 backdrop-blur-xl border border-blue-400/15 rounded-2xl p-6 md:p-8 transition-colors duration-300"
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
};

// Time Picker Component
interface TimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Extract hours and minutes from the date
  const hours = value.getHours();
  const minutes = value.getMinutes();

  // Format time for display (12-hour format with AM/PM)
  const formatTime = (h: number, m: number) => {
    const hour12 = h % 12 || 12;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const minStr = m.toString().padStart(2, '0');
    return `${hour12}:${minStr} ${ampm}`;
  };

  // Generate time options (15-minute intervals)
  const timeOptions: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      timeOptions.push(`${h}:${m}`); // Store as "H:MM" for parsing
    }
  }

  const handleTimeSelect = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const newDate = new Date(value);
    newDate.setHours(h, m, 0, 0);
    onChange(newDate);
    setIsOpen(false);
  };

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button className="w-32 bg-white/5 border border-blue-400/15 rounded-xl py-2.5 pl-10 pr-4 text-white text-center font-medium outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all cursor-pointer hover:bg-white/10 group/picker relative">
          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-hover/picker:text-blue-400 transition-colors pointer-events-none" />
          <span>{formatTime(hours, minutes)}</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="w-48 bg-[#0f0c29]/95 backdrop-blur-2xl border border-blue-400/20 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden p-1 z-[9999] max-h-[300px] overflow-y-auto custom-scrollbar"
        >
          {timeOptions.map((timeStr) => {
            const [h, m] = timeStr.split(':').map(Number);
            const displayTime = formatTime(h, m);
            const isSelected = hours === h && minutes === m;

            return (
              <DropdownMenu.Item
                key={timeStr}
                onSelect={() => handleTimeSelect(timeStr)}
                className={`
                  flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer outline-none transition-colors text-sm
                  ${isSelected
                    ? 'bg-blue-500/20 text-blue-200'
                    : 'text-white/80 hover:text-white hover:bg-white/10'}
                `}
              >
                <span>{displayTime}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const IntervalControl: React.FC<{ label: string, value: number, unit: string, onIncrement: () => void, onDecrement: () => void }> = ({ label, value, unit, onIncrement: onIncrement, onDecrement }) => (
  <div className="flex items-center justify-between group">
    <span className="text-white/70 font-medium group-hover:text-white transition-colors">{label}</span>
    <div className="flex items-center gap-3 bg-black/20 p-1 rounded-lg border border-white/5">
      <motion.button
        type="button"
        whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        whileTap={{ scale: 0.9 }}
        onClick={onDecrement}
        className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 text-white/60 transition-colors"
      >
        <Minus className="w-4 h-4" />
      </motion.button>
      <div className="w-12 text-center">
        <span className="text-white font-mono font-medium">{value}</span>
        <span className="text-[10px] text-white/40 ml-1">{unit}</span>
      </div>
      <motion.button
        type="button"
        whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        whileTap={{ scale: 0.9 }}
        onClick={onIncrement}
        className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 text-white/60 transition-colors"
      >
        <Plus className="w-4 h-4" />
      </motion.button>
    </div>
  </div>
);
