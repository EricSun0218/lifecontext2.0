import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Sparkles, User, ArrowUp, Bot, Zap, AtSign, FileText, Hash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FADE_IN_UP_ITEM, HOVER_CARD_GLOW, HOVER_ACTION, SPRING_TIGHT } from '../constants/animations';
import { Mascot } from './AICircleMascot';
import { INITIAL_CATEGORIES, KNOWLEDGE_ITEMS } from '../constants/mockData';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

interface ChatFormData {
  message: string;
}

const getSuggestions = (t: any) => [
  { icon: Sparkles, text: t('chat.suggestions.summarize') },
  { icon: Bot, text: t('chat.suggestions.analyze') },
  { icon: ArrowUp, text: t('chat.suggestions.draft') },
  { icon: Zap, text: t('chat.suggestions.connections') },
];

// Flatten categories for mention list
const getAllTags = () => {
  const tags: string[] = [];
  INITIAL_CATEGORIES.forEach(cat => {
    tags.push(cat.name);
    if (cat.children) {
      cat.children.forEach(child => tags.push(child.name));
    }
  });
  return Array.from(new Set(tags)); // Unique
};

interface MentionItem {
  id: string;
  type: 'tag' | 'page';
  label: string;
}

export const Chat: React.FC = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMentions, setSelectedMentions] = useState<MentionItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, setValue, watch, reset, getValues } = useForm<ChatFormData>();
  const inputValue = watch('message', '');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  const onSubmit = async (data: ChatFormData) => {
    if (!data.message.trim() && selectedMentions.length === 0) return;

    // Format content to include mentions if needed, or just send text
    // For this demo, we'll prepend mentions to the content for the "AI" to see
    const mentionText = selectedMentions.map(m => `[${m.type}: ${m.label}]`).join(' ');
    const fullContent = mentionText ? `${mentionText} ${data.message}` : data.message;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: fullContent
    };

    setMessages(prev => [...prev, userMsg]);
    reset();
    setSelectedMentions([]); // Clear mentions
    setIsTyping(true);

    // Mock AI Delay
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "I've analyzed your recent activity. Based on your timeline, it seems you're heavily focused on AI architecture and React performance today. Would you like me to synthesize the key takeaways from the Gemini Tech Talk and the React Blog post?"
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (text: string) => {
    setValue('message', text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
    // Remove last mention on backspace if input is empty
    if (e.key === 'Backspace' && inputValue === '' && selectedMentions.length > 0) {
      setSelectedMentions(prev => prev.slice(0, -1));
    }
  };

  const addMention = (item: MentionItem) => {
    if (!selectedMentions.find(m => m.id === item.id)) {
      setSelectedMentions(prev => [...prev, item]);
    }
  };

  const removeMention = (id: string) => {
    setSelectedMentions(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="w-full h-[calc(100vh-8rem)] relative">

      {messages.length === 0 ? (
        // --- SEARCH ENGINE LAYOUT (Empty State) ---
        <div className="h-full w-full flex flex-col items-center justify-center overflow-hidden">

          {/* CENTERED CONTENT WRAPPER */}
          <div className="z-10 w-full max-w-2xl px-6 flex flex-col items-center transform -translate-y-8">

            {/* 1. Logo & Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10 flex flex-col items-center text-center"
            >
              <div className="mb-6">
                <Mascot className="w-24 h-24" />
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-3 text-white">{t('chat.greeting')}</h1>
              <p className="text-slate-400 text-xl font-light">{t('chat.subtitle')}</p>
            </motion.div>

            {/* 2. THE INPUT BAR (Hero) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.01 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="w-full relative mb-12 group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative bg-white/10 backdrop-blur-xl border border-blue-400/15 rounded-3xl p-2 flex flex-col shadow-2xl transition-all focus-within:bg-white/15 focus-within:border-blue-400/30 min-h-[4rem]"
              >
                {/* Mentions Area */}
                {selectedMentions.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-3 pt-2 pb-1">
                    {selectedMentions.map(mention => (
                      <motion.span
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={mention.id}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/10 border border-white/10 text-xs text-white/90 cursor-pointer hover:bg-white/20 transition-colors"
                        onClick={() => removeMention(mention.id)}
                      >
                        {mention.type === 'tag' ? (
                          <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Hash className="w-2.5 h-2.5 text-blue-300" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <FileText className="w-2.5 h-2.5 text-emerald-300" />
                          </div>
                        )}
                        <span>{mention.label}</span>
                      </motion.span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pl-2 pr-2">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        type="button"
                        className="p-2 rounded-xl transition-colors text-slate-400 hover:text-white hover:bg-white/10 data-[state=open]:text-blue-400 data-[state=open]:bg-blue-400/10 outline-none shrink-0"
                      >
                        <AtSign className="w-5 h-5" />
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        align="start"
                        sideOffset={16}
                        className="w-72 max-h-80 overflow-y-auto custom-scrollbar bg-[#0f0c29]/95 backdrop-blur-2xl border border-blue-400/20 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] p-2 z-50 animate-in fade-in zoom-in-95 duration-200"
                      >
                        <div className="px-3 py-2 text-xs font-bold text-blue-400 uppercase tracking-wider">{t('chat.tags')}</div>
                        {getAllTags().map(tag => (
                          <DropdownMenu.Item
                            key={tag}
                            onSelect={() => addMention({ id: `tag-${tag}`, type: 'tag', label: tag })}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors text-left cursor-pointer outline-none data-[highlighted]:bg-white/10"
                          >
                            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300">
                              <Hash className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm font-medium">{tag}</span>
                          </DropdownMenu.Item>
                        ))}

                        <div className="px-3 py-2 mt-2 text-xs font-bold text-blue-400 uppercase tracking-wider border-t border-white/5 pt-3">{t('chat.pages')}</div>
                        {KNOWLEDGE_ITEMS.map(item => (
                          <DropdownMenu.Item
                            key={item.id}
                            onSelect={() => addMention({ id: item.id, type: 'page', label: t(item.title) })}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors text-left cursor-pointer outline-none data-[highlighted]:bg-white/10"
                          >
                            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                              <FileText className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm font-medium truncate">{t(item.title)}</span>
                          </DropdownMenu.Item>
                        ))}
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>

                  <input
                    type="text"
                    {...register('message')}
                    onKeyDown={handleKeyDown}
                    placeholder={selectedMentions.length > 0 ? t('chat.placeholder_knowledge') : t('chat.placeholder')}
                    className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder-slate-400 h-12 font-light min-w-0"
                    autoFocus
                    autoComplete="off"
                  />

                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                      <Mic className="w-5 h-5" />
                    </button>
                    {(inputValue.trim() || selectedMentions.length > 0) && (
                      <motion.button
                        type="submit"
                        variants={HOVER_ACTION}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg"
                      >
                        <ArrowUp className="w-5 h-5" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>

            {/* 3. Suggestion Cards (Below Input) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
            >
              {getSuggestions(t).map((s, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleSuggestionClick(s.text)}
                  variants={HOVER_CARD_GLOW}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-blue-400/15 backdrop-blur-sm text-left group"
                >
                  <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                    <s.icon className="w-4 h-4 text-blue-300" />
                  </div>
                  <span className="text-white/70 group-hover:text-white text-sm font-medium transition-colors">
                    {s.text}
                  </span>
                </motion.button>
              ))}
            </motion.div>

          </div>
        </div>
      ) : (
        // --- CHAT APP LAYOUT (Active State) ---
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto relative">

          {/* MESSAGE STREAM */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 space-y-8 pb-32">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                variants={FADE_IN_UP_ITEM}
                initial="hidden"
                animate="visible"
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* AI Avatar */}
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 mt-1">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`
                    max-w-[85%] md:max-w-[75%] p-5 rounded-3xl text-base leading-relaxed
                    ${msg.role === 'user'
                    ? 'bg-blue-600/20 border border-blue-500/30 text-blue-50 rounded-br-none backdrop-blur-md shadow-lg'
                    : 'bg-white/5 border border-white/5 text-white/90 rounded-bl-none backdrop-blur-md'}
                  `}>
                  {msg.content}
                </div>

                {/* User Avatar */}
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10 mt-1">
                    <User className="w-4 h-4 text-white/70" />
                  </div>
                )}
              </motion.div>
            ))}

            {/* TYPING INDICATOR */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 justify-start"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 mt-1">
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div className="flex items-center gap-1 p-4 rounded-3xl bg-white/5 border border-white/5 rounded-bl-none backdrop-blur-md">
                  <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* BOTTOM INPUT AREA */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pt-2 bg-gradient-to-t from-[#0f0c29] to-transparent">
            <div className="relative">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative bg-white/10 backdrop-blur-xl border border-blue-400/15 rounded-3xl p-2 flex flex-col shadow-2xl transition-all focus-within:bg-white/15 focus-within:border-blue-400/30 min-h-[4rem]"
              >
                {/* Mentions Area */}
                {selectedMentions.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-3 pt-2 pb-1">
                    {selectedMentions.map(mention => (
                      <motion.span
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={mention.id}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/10 border border-white/10 text-xs text-white/90 cursor-pointer hover:bg-white/20 transition-colors"
                        onClick={() => removeMention(mention.id)}
                      >
                        {mention.type === 'tag' ? (
                          <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Hash className="w-2.5 h-2.5 text-blue-300" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <FileText className="w-2.5 h-2.5 text-emerald-300" />
                          </div>
                        )}
                        <span>{mention.label}</span>
                      </motion.span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pl-2 pr-2">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        type="button"
                        className="p-1 rounded-lg transition-colors text-slate-400 hover:text-white data-[state=open]:text-blue-400 data-[state=open]:bg-blue-400/10 outline-none shrink-0"
                      >
                        <AtSign className="w-6 h-6" />
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        align="start"
                        sideOffset={16}
                        className="w-72 max-h-80 overflow-y-auto custom-scrollbar bg-[#0f0c29]/95 backdrop-blur-2xl border border-blue-400/20 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] p-2 z-50 animate-in fade-in zoom-in-95 duration-200"
                      >
                        <div className="px-3 py-2 text-xs font-bold text-blue-400 uppercase tracking-wider">{t('chat.tags')}</div>
                        {getAllTags().map(tag => (
                          <DropdownMenu.Item
                            key={tag}
                            onSelect={() => addMention({ id: `tag-${tag}`, type: 'tag', label: tag })}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors text-left cursor-pointer outline-none data-[highlighted]:bg-white/10"
                          >
                            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300">
                              <Hash className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm font-medium">{tag}</span>
                          </DropdownMenu.Item>
                        ))}

                        <div className="px-3 py-2 mt-2 text-xs font-bold text-blue-400 uppercase tracking-wider border-t border-white/5 pt-3">{t('chat.pages')}</div>
                        {KNOWLEDGE_ITEMS.map(item => (
                          <DropdownMenu.Item
                            key={item.id}
                            onSelect={() => addMention({ id: item.id, type: 'page', label: t(item.title) })}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors text-left cursor-pointer outline-none data-[highlighted]:bg-white/10"
                          >
                            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                              <FileText className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm font-medium truncate">{t(item.title)}</span>
                          </DropdownMenu.Item>
                        ))}
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>

                  <input
                    type="text"
                    {...register('message')}
                    onKeyDown={handleKeyDown}
                    placeholder={selectedMentions.length > 0 ? t('chat.placeholder_knowledge') : t('chat.placeholder')}
                    className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder-slate-400 h-12 font-light min-w-0"
                    autoFocus
                    autoComplete="off"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <button type="button" className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                      <Mic className="w-5 h-5" />
                    </button>
                    {(inputValue.trim() || selectedMentions.length > 0) && (
                      <motion.button
                        type="submit"
                        variants={HOVER_ACTION}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg"
                      >
                        <ArrowUp className="w-5 h-5" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </form>
            </div>
            <div className="text-center mt-2 mb-1">
              <p className="text-[10px] text-white/20">
                {t('chat.ai_mistakes')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
