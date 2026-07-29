import React from 'react';
import { HiTrophy, HiFire } from 'react-icons/hi2';

/**
 * Segmented progress bar tracking Mastered, Review, and Remaining flashcards in White & Violet styling.
 */
export default function ProgressBar({ current, total, masteredCount = 0, reviewCount = 0 }) {
  const masteredPct = total > 0 ? (masteredCount / total) * 100 : 0;
  const reviewPct = total > 0 ? (reviewCount / total) * 100 : 0;
  const masteredInt = Math.round(masteredPct);

  // Motivational message based on completion %
  const getMotivationalMessage = () => {
    if (masteredInt === 100) return '🎉 Legendary! Deck 100% Mastered!';
    if (masteredInt >= 75) return '🔥 Almost there! Mastery in sight!';
    if (masteredInt >= 50) return '⚡ Halfway there! You are in flow state!';
    if (masteredInt >= 25) return '🚀 Great momentum! Keep going!';
    return '💪 Brain power charging up!';
  };

  return (
    <div className="space-y-2">
      {/* Header Info */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
        <div className="flex items-center gap-2">
          <HiTrophy className="w-4 h-4 text-amber-500" />
          <span className="text-violet-950 font-extrabold">{masteredInt}% Mastered</span>
          <span className="text-slate-500 font-medium">({masteredCount}/{total} cards)</span>
        </div>

        <div className="flex items-center gap-1.5 text-violet-800 font-bold">
          <HiFire className="w-4 h-4 text-amber-500 animate-flame" />
          <span>{getMotivationalMessage()}</span>
        </div>
      </div>

      {/* Multi-Segmented Progress Bar */}
      <div className="w-full bg-violet-100/70 rounded-full h-3 overflow-hidden p-0.5 border border-violet-200/80 flex gap-0.5">
        {/* Mastered Segment */}
        {masteredPct > 0 && (
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${masteredPct}%` }}
            title={`Mastered: ${masteredCount}`}
          />
        )}

        {/* Needs Review Segment */}
        {reviewPct > 0 && (
          <div
            className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${reviewPct}%` }}
            title={`Needs Review: ${reviewCount}`}
          />
        )}

        {/* Remaining Unseen Segment */}
        <div className="flex-1 bg-transparent h-full rounded-full" />
      </div>
    </div>
  );
}
