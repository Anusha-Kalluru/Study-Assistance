import React from 'react';
import { HiSparkles, HiBolt, HiAcademicCap, HiTrophy } from 'react-icons/hi2';

/**
 * Top hero header component for Study with AI.
 */
export default function Header() {
  return (
    <header className="text-center pt-4 pb-4 space-y-4">
      {/* Top Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-600/10 border border-violet-400/30 text-violet-800 text-xs font-bold tracking-wide shadow-xs backdrop-blur-md">
        <HiSparkles className="w-4 h-4 text-violet-600" />
        <span>STUDY WITH AI PLATFORM</span>
      </div>

      {/* Main Headings */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Study with AI
        </h1>
        <p className="text-xl sm:text-2xl font-bold text-violet-700 tracking-tight">
          Supercharge Your Learning & Master Any Topic
        </p>
      </div>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
        Transform lecture notes, PDFs, and topics into interactive 3D flashcards, AI quizzes, mind maps, and structured study roadmaps.
      </p>

      {/* Feature Pills */}
      <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-700">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <HiBolt className="w-4 h-4 text-violet-600" />
          <span>Interactive 3D Cards</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <HiAcademicCap className="w-4 h-4 text-violet-600" />
          <span>Adaptive AI Quizzes</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <HiTrophy className="w-4 h-4 text-violet-600" />
          <span>Exam Readiness Score</span>
        </div>
      </div>
    </header>
  );
}
