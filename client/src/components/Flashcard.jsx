import React, { useState } from 'react';
import { HiArrowPath, HiLightBulb, HiCheckCircle, HiExclamationTriangle, HiSparkles } from 'react-icons/hi2';
import { soundManager } from '../utils/soundEffects';

/**
 * Modern, gamified 3D Flashcard component with themes, hints, and interactive triage.
 */
export default function Flashcard({
  flashcard,
  isFlipped,
  setIsFlipped,
  cardNumber,
  totalCards,
  theme = 'indigo',
  status = null, // 'mastered' | 'review' | null
  onMarkStatus,
}) {
  const [showHint, setShowHint] = useState(false);
  const { question, answer } = flashcard;

  // Generate a soft hint (first 3 words or concept clue)
  const generateHint = (ans) => {
    if (!ans) return 'Focus on key terms in the question!';
    const words = ans.split(' ');
    if (words.length <= 3) return `Starts with: "${words[0]}..."`;
    return `Starts with: "${words.slice(0, 3).join(' ')}..."`;
  };

  const handleFlip = (e) => {
    // Don't flip if clicking inside hint toggle or action buttons
    if (e.target.closest('.no-flip')) return;
    soundManager.playFlip();
    setIsFlipped(!isFlipped);
  };

  // Theme style configurations
  const themeConfigs = {
    indigo: {
      shadow: 'card-shadow-violet',
      frontBg: 'bg-gradient-to-br from-slate-950 via-violet-950/90 to-purple-950/80',
      backBg: 'bg-gradient-to-br from-violet-950 via-slate-950 to-purple-950',
      badgeFront: 'bg-violet-500/25 text-violet-200 border-violet-400/50',
      badgeBack: 'bg-emerald-500/25 text-emerald-300 border-emerald-400/50',
      accentGlow: 'from-violet-500/30 to-purple-500/0',
      borderFront: 'border-violet-500/40 hover:border-violet-400/80',
      borderBack: 'border-emerald-500/40 hover:border-emerald-400/80',
    },
    cosmic: {
      shadow: 'card-shadow-cosmic',
      frontBg: 'bg-gradient-to-br from-slate-950 via-purple-950/90 to-fuchsia-950/70',
      backBg: 'bg-gradient-to-br from-purple-950 via-slate-950 to-slate-900',
      badgeFront: 'bg-purple-500/25 text-purple-200 border-purple-400/50',
      badgeBack: 'bg-cyan-500/25 text-cyan-300 border-cyan-400/50',
      accentGlow: 'from-purple-500/30 to-fuchsia-500/0',
      borderFront: 'border-purple-500/40 hover:border-purple-400/80',
      borderBack: 'border-cyan-500/40 hover:border-cyan-400/80',
    },
    emerald: {
      shadow: 'card-shadow-emerald',
      frontBg: 'bg-gradient-to-br from-slate-950 via-emerald-950/70 to-teal-950/60',
      backBg: 'bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900',
      badgeFront: 'bg-emerald-500/25 text-emerald-200 border-emerald-400/50',
      badgeBack: 'bg-teal-500/25 text-teal-300 border-teal-400/50',
      accentGlow: 'from-emerald-500/30 to-teal-500/0',
      borderFront: 'border-emerald-500/40 hover:border-emerald-400/80',
      borderBack: 'border-teal-500/40 hover:border-teal-400/80',
    },
    sunset: {
      shadow: 'card-shadow-sunset',
      frontBg: 'bg-gradient-to-br from-slate-950 via-rose-950/70 to-violet-950/60',
      backBg: 'bg-gradient-to-br from-rose-950 via-slate-950 to-purple-950',
      badgeFront: 'bg-rose-500/25 text-rose-200 border-rose-400/50',
      badgeBack: 'bg-amber-500/25 text-amber-300 border-amber-400/50',
      accentGlow: 'from-rose-500/30 to-violet-500/0',
      borderFront: 'border-rose-500/40 hover:border-rose-400/80',
      borderBack: 'border-amber-500/40 hover:border-amber-400/80',
    },
  };

  const currentTheme = themeConfigs[theme] || themeConfigs.indigo;

  return (
    <div
      className="perspective-1000 w-full max-w-2xl mx-auto min-h-[360px] sm:min-h-[400px] cursor-pointer group select-none relative"
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleFlip(e);
        }
      }}
      aria-label="Toggle flashcard answer"
    >
      <div
        className={`relative w-full h-full min-h-[360px] sm:min-h-[400px] rounded-3xl transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''
          }`}
      >
        {/* FRONT SIDE (Question) */}
        <div
          className={`absolute inset-0 w-full h-full ${currentTheme.frontBg} rounded-3xl p-7 sm:p-9 border ${currentTheme.borderFront} ${currentTheme.shadow} backface-hidden flex flex-col justify-between items-center text-center transition-all duration-300 overflow-hidden`}
        >
          {/* Ambient Glow */}
          <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${currentTheme.accentGlow} rounded-full blur-3xl -z-10 pointer-events-none`} />

          {/* Top Bar: Card Badge & Status */}
          <div className="w-full flex items-center justify-between">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold tracking-wider uppercase backdrop-blur-md ${currentTheme.badgeFront}`}>
              <HiSparkles className="w-3.5 h-3.5" />
              <span>Card {cardNumber} of {totalCards}</span>
            </div>

            {status && (
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide border backdrop-blur-md ${status === 'mastered'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
              >
                {status === 'mastered' ? (
                  <>
                    <HiCheckCircle className="w-3.5 h-3.5" /> Mastered 🎯
                  </>
                ) : (
                  <>
                    <HiExclamationTriangle className="w-3.5 h-3.5" /> Review 🔄
                  </>
                )}
              </span>
            )}
          </div>

          {/* Center: Question Text */}
          <div className="my-auto px-2 py-4">
            <p className="text-xl sm:text-2xl font-extrabold text-slate-100 leading-relaxed tracking-tight">
              {question}
            </p>

            {/* Hint Dropdown Toggle */}
            {showHint && (
              <div className="mt-4 p-3 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-xs text-indigo-200 animate-fadeIn no-flip max-w-md mx-auto">
                <span className="font-bold text-indigo-400">💡 Hint: </span>
                {generateHint(answer)}
              </div>
            )}
          </div>

          {/* Bottom Controls: Hint Toggle & Flip Prompt */}
          <div className="w-full flex items-center justify-between pt-2 border-t border-slate-700/40">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowHint(!showHint);
              }}
              className="no-flip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-400 hover:text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all shadow-sm"
              title="Click for a small clue"
            >
              <HiLightBulb className="w-4 h-4" />
              <span>{showHint ? 'Hide Hint' : 'Peek Hint'}</span>
            </button>

            <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 group-hover:text-indigo-300 transition-colors">
              <HiArrowPath className="w-4 h-4 animate-spin-slow text-indigo-400" />
              <span>Click or Space to flip</span>
            </div>
          </div>
        </div>

        {/* BACK SIDE (Answer & Mastery Triage) */}
        <div
          className={`absolute inset-0 w-full h-full ${currentTheme.backBg} rounded-3xl p-7 sm:p-9 border ${currentTheme.borderBack} ${currentTheme.shadow} backface-hidden rotate-y-180 flex flex-col justify-between items-center text-center transition-all duration-300 overflow-hidden`}
        >
          {/* Ambient Glow */}
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-500/20 to-teal-500/0 rounded-full blur-3xl -z-10 pointer-events-none" />

          {/* Top Bar: Answer Badge */}
          <div className="w-full flex items-center justify-between">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold tracking-wider uppercase backdrop-blur-md ${currentTheme.badgeBack}`}>
              <HiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Answer Revealed</span>
            </div>

            <span className="text-xs text-slate-400 font-semibold">
              How did you do?
            </span>
          </div>

          {/* Center: Answer Text */}
          <div className="my-auto px-2 py-4">
            <p className="text-lg sm:text-xl font-semibold text-slate-100 leading-relaxed">
              {answer}
            </p>
          </div>

          {/* Bottom Triage Buttons */}
          <div className="w-full space-y-3 pt-3 border-t border-slate-700/40 no-flip">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkStatus('review');
                }}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-2 ${status === 'review'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
              >
                <HiExclamationTriangle className="w-4 h-4" />
                <span>Needs Review</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkStatus('mastered');
                }}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-2 ${status === 'mastered'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
              >
                <HiCheckCircle className="w-4 h-4" />
                <span>Got It! 🎯</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
              <span>Click card or Space to flip back</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
