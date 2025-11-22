import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingActionButton: React.FC = () => {
  return (
    <button className="fixed bottom-8 right-8 group z-50">
      <div className="absolute inset-0 rounded-full bg-blue-500 blur-lg opacity-60 group-hover:opacity-80 transition-opacity animate-pulse"></div>
      <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-2xl border border-white/30 backdrop-blur-xl group-hover:scale-110 transition-transform duration-300 ease-out">
        <MessageCircle className="w-8 h-8 text-white fill-white/20" />
      </div>
    </button>
  );
};