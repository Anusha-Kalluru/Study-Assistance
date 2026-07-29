import React from 'react';
import { HiOutlineBookOpen, HiSparkles, HiFire } from 'react-icons/hi2';

/**
 * Empty state component displayed before user inputs notes in vibrant Violet styling.
 */
export default function EmptyState() {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-violet-200/90 card-shadow-violet text-center space-y-5 max-w-lg mx-auto">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-violet-600 via-purple-600 to-violet-700 text-white flex items-center justify-center mx-auto border border-violet-300 shadow-lg shadow-violet-600/30">
        <HiOutlineBookOpen className="w-10 h-10 text-violet-100" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-black text-violet-600 uppercase tracking-widest block">STUDY WITH AI LAUNCHPAD</span>
        <h3 className="text-2xl font-black text-slate-900">Ready to Level Up Your Grades? 🚀</h3>
        <p className="text-sm text-slate-600 max-w-sm mx-auto font-medium leading-relaxed">
          Paste any textbook excerpt, lecture note, or click a sample topic above to instantly create your 3D flashcard deck & quiz arena.
        </p>
      </div>

      <div className="pt-3 flex flex-wrap items-center justify-center gap-3 text-xs font-extrabold text-violet-900 border-t border-violet-100">
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100/80 border border-violet-200 text-violet-800">
          <HiSparkles className="w-4 h-4 text-violet-600 animate-spin-slow" /> Powered by Groq AI
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800">
          <HiFire className="w-4 h-4 text-amber-500 animate-flame" /> Gamified Focus Mode
        </span>
      </div>
    </div>
  );
}
