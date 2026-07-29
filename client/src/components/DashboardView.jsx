import React, { useState } from 'react';
import {
  HiSparkles,
  HiBookOpen,
  HiClock,
  HiTrophy,
  HiFolderPlus,
  HiCheckCircle,
  HiArrowRight,
  HiChatBubbleLeftRight,
  HiCalendarDays,
} from 'react-icons/hi2';
import { getUserStats, getDailyMissions, toggleMission } from '../utils/storage';

export default function DashboardView({ onNavigate, theme }) {
  const [stats, setStats] = useState(getUserStats());
  const [missions, setMissions] = useState(getDailyMissions());

  const handleToggleMission = (id) => {
    const { updatedMissions } = toggleMission(id);
    setMissions(updatedMissions);
    setStats(getUserStats());
  };

  const isLight = theme === 'light';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className={`${isLight ? 'bg-violet-900 border-violet-800 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-100 shadow-xl'} rounded-3xl p-6 sm:p-8 border relative overflow-hidden`}>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold uppercase tracking-wider">
              <HiSparkles className="w-3.5 h-3.5 text-violet-300" />
              <span>STUDY WITH AI • SCHOLAR DASHBOARD</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back to your workspace
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-xl leading-relaxed">
              Generate 3D flashcards, run knowledge quizzes, build custom study schedules, and ask AI Tutor.
            </p>
          </div>

          <button
            onClick={() => onNavigate('aistudio')}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl shadow-md transition-all flex items-center gap-2 text-sm shrink-0 active:scale-95"
          >
            <HiFolderPlus className="w-4 h-4 text-white" />
            <span>Open AI Studio</span>
            <HiArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Live Stats Row (Starts at 0 by default) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`${isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900 border-slate-800 text-white shadow-xl'} rounded-2xl p-5 border flex items-center gap-4`}>
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold ${isLight ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-950 border-slate-800 text-indigo-400'}`}>
            <HiBookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className={`text-xs font-semibold block uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>CARDS MASTERED</span>
            <span className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{stats.cardsMastered || 0} Cards</span>
          </div>
        </div>

        <div className={`${isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900 border-slate-800 text-white shadow-xl'} rounded-2xl p-5 border flex items-center gap-4`}>
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold ${isLight ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-950 border-slate-800 text-emerald-400'}`}>
            <HiTrophy className="w-5 h-5" />
          </div>
          <div>
            <span className={`text-xs font-semibold block uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>QUIZ ACCURACY</span>
            <span className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{stats.averageAccuracy || 0}% Score</span>
          </div>
        </div>

        <div className={`${isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900 border-slate-800 text-white shadow-xl'} rounded-2xl p-5 border flex items-center gap-4`}>
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold ${isLight ? 'bg-violet-50 border-violet-100 text-violet-600' : 'bg-slate-950 border-slate-800 text-violet-400'}`}>
            <HiClock className="w-5 h-5" />
          </div>
          <div>
            <span className={`text-xs font-semibold block uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>STUDY TIME</span>
            <span className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{(stats.totalStudyTimeMs / 3600000).toFixed(1)} Hours</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="space-y-6">
        {/* Daily Learning Targets Card */}
        <div className={`${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-xl'} rounded-3xl p-6 sm:p-8 border space-y-5`}>
          <div className={`flex items-center justify-between pb-4 border-b ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isLight ? 'bg-violet-100 text-violet-700' : 'bg-violet-600/30 text-violet-300'}`}>
                <HiCheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-lg font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <span>Daily Learning Checklist</span>
                </h3>
                <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Complete daily study goals.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {missions.map((m) => (
              <div
                key={m.id}
                onClick={() => handleToggleMission(m.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  m.completed
                    ? isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                      : 'bg-slate-950/60 border-slate-800 text-slate-500 line-through'
                    : isLight
                      ? 'bg-white border-slate-200 hover:border-violet-300 text-slate-800'
                      : 'bg-slate-950 border-slate-800 hover:border-violet-600 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <HiCheckCircle
                    className={`w-5 h-5 ${m.completed ? 'text-emerald-500' : isLight ? 'text-slate-300' : 'text-slate-600'}`}
                  />
                  <span className="text-xs sm:text-sm font-semibold">{m.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Module Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('tutor')}
            className={`${isLight ? 'bg-white border-slate-200 hover:border-violet-400 text-slate-900 shadow-sm' : 'bg-slate-900 border-slate-800 hover:border-violet-500 text-white shadow-xl'} p-6 rounded-3xl text-left border transition-all space-y-3 group`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? 'bg-violet-50 text-violet-600 border border-violet-100' : 'bg-slate-950 border border-slate-800 text-violet-400'}`}>
              <HiChatBubbleLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`font-bold text-base flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <span>AI Tutor Chat</span>
              </h4>
              <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Ask doubts, request analogies, and get clear step-by-step answers.
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('planner')}
            className={`${isLight ? 'bg-white border-slate-200 hover:border-violet-400 text-slate-900 shadow-sm' : 'bg-slate-900 border-slate-800 hover:border-violet-500 text-white shadow-xl'} p-6 rounded-3xl text-left border transition-all space-y-3 group`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? 'bg-violet-50 text-violet-600 border border-violet-100' : 'bg-slate-950 border border-slate-800 text-violet-400'}`}>
              <HiCalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`font-bold text-base flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <span>Study Schedule Planner</span>
              </h4>
              <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Generate customized daily timelines for any exam or subject.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
