import React from 'react';
import { HiArrowPath, HiCheckCircle, HiXCircle, HiTrophy, HiSparkles } from 'react-icons/hi2';
import { calculatePercentage } from '../utils/helpers';

/**
 * Quiz Results summary view with circular SVG percentage indicator and Retest Wrong Answers action.
 */
export default function Result({ resultData, onRetestWrongAnswers, onRetakeFullQuiz }) {
  const { score, total, correctCount, wrongCount, wrongQuestions = [] } = resultData || {};
  const percentage = calculatePercentage(score, total);

  // SVG Circular Chart calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white/95 rounded-3xl p-6 sm:p-10 border border-violet-200/90 card-shadow-violet text-center space-y-8 max-w-xl mx-auto backdrop-blur-xl">
      {/* Badge & Title (Rearranged Header) */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-violet-100/90 border border-violet-300 text-violet-800 text-xs font-black uppercase tracking-widest shadow-2xs">
          <HiTrophy className="w-4 h-4 text-amber-500" />
          <span>VICTORY DASHBOARD • EXAM READINESS</span>
          <HiSparkles className="w-4 h-4 text-violet-600" />
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {percentage >= 80 ? '🎉 Outstanding Mastery!' : percentage >= 50 ? '👍 Solid Effort! Keep Pushing!' : '💪 Keep Practicing & Level Up!'}
        </h2>
        <p className="text-sm text-slate-600 font-medium">
          Here is your comprehensive study breakdown for this deck session.
        </p>
      </div>

      {/* Circular Progress Meter */}
      <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Background Ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="text-violet-100"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
          />
          {/* Foreground Progress Ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="text-violet-600 transition-all duration-1000 ease-out"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-slate-900">{percentage}%</span>
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600">Accuracy Score</span>
        </div>
      </div>

      {/* Breakdown Statistics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3 shadow-2xs">
          <div className="p-2 bg-emerald-500/15 rounded-xl text-emerald-600">
            <HiCheckCircle className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="block text-2xl font-black text-emerald-950">{correctCount}</span>
            <span className="text-xs text-emerald-800 font-bold">Mastered Correct</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center gap-3 shadow-2xs">
          <div className="p-2 bg-rose-500/15 rounded-xl text-rose-600">
            <HiXCircle className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="block text-2xl font-black text-rose-950">{wrongCount}</span>
            <span className="text-xs text-rose-800 font-bold">Needs Review</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {wrongCount > 0 && (
          <button
            onClick={onRetestWrongAnswers}
            className="flex-1 px-5 py-3.5 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 hover:from-violet-500 hover:to-purple-500 text-white font-black rounded-2xl transition-all shadow-md shadow-violet-600/30 flex items-center justify-center gap-2 text-sm sm:text-base tracking-wide"
          >
            <HiArrowPath className="w-5 h-5" />
            <span>Retest Wrong Answers ({wrongCount})</span>
          </button>
        )}

        <button
          onClick={onRetakeFullQuiz}
          className="flex-1 px-5 py-3.5 bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-900 font-black rounded-2xl transition-all shadow-2xs flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <HiArrowPath className="w-5 h-5 text-violet-600" />
          <span>Retake Entire Quiz</span>
        </button>
      </div>
    </div>
  );
}

