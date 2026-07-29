import React from 'react';
import {
  HiTrophy,
  HiBolt,
  HiLockClosed,
  HiCheckCircle,
  HiAcademicCap,
  HiClock,
  HiBookOpen,
} from 'react-icons/hi2';
import { getUserStats } from '../utils/storage';

export default function GamificationView() {
  const stats = getUserStats();

  const badges = [
    { title: 'Speed Demon', desc: 'Answered quiz in fast time', unlocked: stats.xp >= 100, icon: HiBolt },
    { title: 'Perfect Score', desc: 'Scored 100% on a practice quiz', unlocked: stats.xp >= 200, icon: HiTrophy },
    { title: 'Study Streak', desc: 'Studied consecutive days', unlocked: stats.streak >= 1, icon: HiAcademicCap },
    { title: 'Master Reader', desc: 'Mastered Flashcards', unlocked: stats.cardsMastered >= 10, icon: HiBookOpen },
    { title: 'Level 5 Scholar', desc: 'Reach 1,500 total XP', unlocked: stats.xp >= 1500, icon: HiAcademicCap },
    { title: 'Deep Focus', desc: 'Complete Pomodoro sessions', unlocked: stats.totalStudyTimeMs >= 1500000, icon: HiClock },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl text-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <HiTrophy className="w-3.5 h-3.5 text-violet-400" />
            <span>ACHIEVEMENTS & REWARDS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Achievements & Badges</h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Earn XP for studying, unlock achievement badges, and level up your rank.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-5 py-3 rounded-2xl">
          <HiBolt className="w-6 h-6 text-violet-400" />
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">TOTAL XP</span>
            <div className="text-lg font-extrabold text-white">{stats.xp} XP</div>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex justify-between items-center text-xs font-bold text-slate-200">
          <span>Level {stats.level} Scholar</span>
          <span>{stats.xp % 300} / 300 XP to Level {stats.level + 1}</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
          <div
            className="bg-violet-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${(stats.xp % 300) / 3}%` }}
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all flex items-center gap-4 ${
                b.unlocked
                  ? 'bg-slate-900 border-slate-800 shadow-xl'
                  : 'bg-slate-950/60 border-slate-800 opacity-60'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-violet-400 border border-slate-800 flex items-center justify-center shrink-0 font-bold">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <span>{b.title}</span>
                  {b.unlocked ? (
                    <HiCheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <HiLockClosed className="w-4 h-4 text-slate-500" />
                  )}
                </h4>
                <p className="text-xs text-slate-400 font-medium">{b.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
