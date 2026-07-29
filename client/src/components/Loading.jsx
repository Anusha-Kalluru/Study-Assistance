import React, { useState, useEffect } from 'react';
import { HiSparkles } from 'react-icons/hi2';

const LOADING_MESSAGES = [
  'Analyzing your study notes & concepts...',
  'Generating 3D flashcards & answers...',
  'Creating interactive quiz questions...',
  'Polishing gamified student deck...',
  'Almost ready for action...',
];

/**
 * Animated loading indicator component with cycling student messages in Violet styling.
 */
export default function Loading() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white/95 rounded-3xl p-8 sm:p-12 border border-violet-200/90 card-shadow-violet text-center space-y-6 max-w-lg mx-auto backdrop-blur-xl">
      {/* Animated Spinner Icon */}
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-violet-200 animate-ping opacity-30"></div>
        <div className="w-20 h-20 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin flex items-center justify-center shadow-md shadow-violet-500/20">
          <HiSparkles className="w-8 h-8 text-violet-600 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-black text-violet-600 uppercase tracking-widest block">AI POWER DECK GENERATOR</span>
        <h3 className="text-2xl font-black text-slate-900">Crafting Your 3D Study Session</h3>
        <p className="text-sm font-semibold text-violet-900 transition-all duration-300">
          {LOADING_MESSAGES[messageIndex]}
        </p>
      </div>

      <div className="w-48 mx-auto bg-violet-100 h-2 rounded-full overflow-hidden border border-violet-200/60">
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 h-full animate-pulse rounded-full w-3/4"></div>
      </div>
    </div>
  );
}

