import React, { useState, useRef, useEffect } from 'react';
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

const SUGGESTIONS = [
  { icon: Sparkles, text: "Summarize today's timeline" },
  { icon: Bot, text: "Analyze my browsing habits" },
  { icon: ArrowUp, text: "Draft a daily report" },
  { icon: Zap, text: "Find connections in my reading" },
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

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
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
    if (!data.message.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: data.message
    };

    setMessages(prev => [...prev, userMsg]);
    reset();
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
  };

  const insertMention = (text: string) => {
    const current = getValues('message') || '';
    setValue('message', current + (current && !current.endsWith(' ') ? ' ' : '') + `@${text} `);
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
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-3 text-white">Hello, Alex</h1>
              <p className="text-slate-400 text-xl font-light">How can I help you analyze your digital footprint?</p>
            </motion.div>

            {/* 2. THE INPUT BAR (Hero) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.01 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="w-full relative mb-12 group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative bg-white/10 backdrop-blur-xl border border-blue-400/15 rounded-2xl p-2 pl-5 pr-3 flex items-center gap-4 shadow-2xl transition-all focus-within:bg-white/15 focus-within:border-blue-400/30 h-16"
              >
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      type="button"
                      className="p-1 rounded-lg transition-colors text-slate-400 hover:text-white data-[state=open]:text-blue-400 data-[state=open]:bg-blue-400/10 outline-none"
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
                      <div className="px-3 py-2 text-xs font-bold text-blue-400 uppercase tracking-wider">Tags</div>
                      {getAllTags().map(tag => (
                        <DropdownMenu.Item
                          key={tag}
                          onSelect={() => insertMention(tag)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors text-left cursor-pointer outline-none data-[highlighted]:bg-white/10"
                        >
                          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300">
                            <Hash className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-sm font-medium">{tag}</span>
                        </DropdownMenu.Item>
                      ))}

                      <div className="px-3 py-2 mt-2 text-xs font-bold text-blue-400 uppercase tracking-wider border-t border-white/5 pt-3">Pages</div>
                      {KNOWLEDGE_ITEMS.map(item => (
                        <DropdownMenu.Item
                          key={item.id}
                          onSelect={() => insertMention(item.title)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors text-left cursor-pointer outline-none data-[highlighted]:bg-white/10"
                        >
                          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-sm font-medium truncate">{item.title}</span>
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>

                <input
                  type="text"
                  {...register('message')}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder-slate-400 h-full font-light"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <button type="button" className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <Mic className="w-5 h-5" />
                  </button>
                  {inputValue.trim() && (
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
              </form>
            </motion.div>

            {/* 3. Suggestion Cards (Below Input) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
            >
              {SUGGESTIONS.map((s, i) => (
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
                className="relative flex items-center gap-2 p-2 rounded-[2rem] bg-white/5 backdrop-blur-2xl border border-blue-400/15 shadow-2xl focus-within:bg-white/10 focus-within:border-blue-400/30 transition-all"
              >

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      type="button"
                      className="p-3 rounded-full transition-colors hover:bg-white/10 text-white/50 hover:text-white data-[state=open]:bg-blue-500/20 data-[state=open]:text-blue-400 outline-none"
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
                      <div className="px-3 py-2 text-xs font-bold text-blue-400 uppercase tracking-wider">Tags</div>
                      {getAllTags().map(tag => (
                        <DropdownMenu.Item
                          key={tag}
                          onSelect={() => insertMention(tag)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors text-left cursor-pointer outline-none data-[highlighted]:bg-white/10"
                        >
                          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300">
                            <Hash className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-sm font-medium">{tag}</span>
                        </DropdownMenu.Item>
                      ))}

                      <div className="px-3 py-2 mt-2 text-xs font-bold text-blue-400 uppercase tracking-wider border-t border-white/5 pt-3">Pages</div>
                      {KNOWLEDGE_ITEMS.map(item => (
                        <DropdownMenu.Item
                          key={item.id}
                          onSelect={() => insertMention(item.title)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors text-left cursor-pointer outline-none data-[highlighted]:bg-white/10"
                        >
                          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-sm font-medium truncate">{item.title}</span>
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>

                <input
                  {...register('message')}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 text-lg px-2 font-light"
                  autoFocus
                />

                <div className="flex items-center gap-1 pr-2">
                  {inputValue.length === 0 ? (
                    <button type="button" className="p-3 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                      <Mic className="w-5 h-5" />
                    </button>
                  ) : (
                    <motion.button
                      type="submit"
                      variants={HOVER_ACTION}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      className="p-3 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    >
                      <ArrowUp className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              </form>
            </div>
            <div className="text-center mt-2 mb-1">
              <p className="text-[10px] text-white/20">
                AI can make mistakes. Check important info.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
