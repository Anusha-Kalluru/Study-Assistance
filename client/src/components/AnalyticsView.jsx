import React from 'react';
import { HiChartBar, HiArrowPath, HiExclamationTriangle, HiCheckCircle } from 'react-icons/hi2';
import { getUserStats, getLastWrongQuestions } from '../utils/storage';

export default function AnalyticsView({ onQuickLoadSample, onRetestWrongAnswers, theme }) {
  const stats = getUserStats();
  const wrongQuestions = getLastWrongQuestions();
  const isLight = theme === 'light';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className={`${isLight ? 'bg-violet-900 border-violet-800 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-100 shadow-xl'} rounded-3xl p-6 sm:p-8 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <HiChartBar className="w-3.5 h-3.5 text-violet-300" />
            <span>PROGRESS & WEAK TOPIC ANALYZER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Study Analytics</h2>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            Monitor topic accuracy rates, study time, and AI weak area diagnostics based on your live usage.
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900 border-slate-800 text-white shadow-xl'} rounded-2xl p-5 border space-y-1`}>
          <span className={`text-xs font-semibold uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>STUDY TIME</span>
          <div className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{(stats.totalStudyTimeMs / 3600000).toFixed(1)} Hours</div>
          <span className="text-[11px] font-semibold text-emerald-600">Recorded from focus sessions</span>
        </div>

        <div className={`${isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900 border-slate-800 text-white shadow-xl'} rounded-2xl p-5 border space-y-1`}>
          <span className={`text-xs font-semibold uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>QUIZ ACCURACY</span>
          <div className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{stats.averageAccuracy || 0}%</div>
          <span className="text-[11px] font-semibold text-emerald-600">Knowledge recall accuracy</span>
        </div>

        <div className={`${isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900 border-slate-800 text-white shadow-xl'} rounded-2xl p-5 border space-y-1`}>
          <span className={`text-xs font-semibold uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>CARDS MASTERED</span>
          <div className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{stats.cardsMastered || 0} Cards</div>
          <span className="text-[11px] font-semibold text-violet-600">Mastered cards count</span>
        </div>

        <div className={`${isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900 border-slate-800 text-white shadow-xl'} rounded-2xl p-5 border space-y-1`}>
          <span className={`text-xs font-semibold uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>QUIZZES TAKEN</span>
          <div className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{stats.quizzesCompleted || 0} Quizzes</div>
          <span className="text-[11px] font-semibold text-emerald-600">Completed quiz count</span>
        </div>
      </div>

      {/* Retest Wrong Answers Section */}
      <div className={`${isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900 border-slate-800 text-white shadow-xl'} rounded-3xl p-6 sm:p-8 border space-y-6`}>
        <div className={`flex items-center justify-between pb-4 border-b ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${wrongQuestions.length > 0 ? (isLight ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-amber-950/60 border-amber-800 text-amber-400') : (isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-emerald-950/60 border-emerald-800 text-emerald-400')}`}>
              {wrongQuestions.length > 0 ? <HiExclamationTriangle className="w-5 h-5" /> : <HiCheckCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <span>Retest Wrong Answers</span>
              </h3>
              <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {wrongQuestions.length > 0
                  ? `${wrongQuestions.length} question(s) answered incorrectly in recent quizzes ready for re-testing.`
                  : 'No wrong answers pending review. Take a quiz to test your knowledge!'}
              </p>
            </div>
          </div>

          {wrongQuestions.length > 0 && onRetestWrongAnswers && (
            <button
              onClick={() => onRetestWrongAnswers(wrongQuestions)}
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 hover:from-violet-500 hover:to-purple-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
            >
              <HiArrowPath className="w-4 h-4" />
              <span>Retest Wrong Answers ({wrongQuestions.length})</span>
            </button>
          )}
        </div>

        {wrongQuestions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wrongQuestions.map((q, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border space-y-3 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Question {idx + 1}</span>
                  <span className="text-[11px] font-bold text-amber-600 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">Needs Retest</span>
                </div>
                <p className={`text-xs font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  {q.question}
                </p>
                {q.explanation && (
                  <p className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'} italic`}>
                    💡 {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
