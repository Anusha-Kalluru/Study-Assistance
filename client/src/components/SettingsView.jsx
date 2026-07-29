import React from 'react';
import {
  HiCog6Tooth,
  HiSun,
  HiMoon,
  HiCheckCircle,
  HiAcademicCap,
} from 'react-icons/hi2';

export default function SettingsView({ theme, onThemeChange, difficulty, onDifficultyChange }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className={`${theme === 'light' ? 'bg-violet-900 text-white border-violet-800' : 'bg-slate-900 text-white border-slate-800'} rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <HiCog6Tooth className="w-3.5 h-3.5 text-violet-300" />
            <span>PREFERENCES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">App Settings</h2>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            Customize Light/Dark themes and AI quiz difficulty levels.
          </p>
        </div>
      </div>

      <div className={`${theme === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'} rounded-3xl p-6 sm:p-8 border shadow-xl space-y-6 max-w-2xl`}>
        {/* Simplified Theme Mode Selector: Light vs Dark */}
        <div className="space-y-3">
          <label className={`block text-xs font-bold uppercase flex items-center gap-2 ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
            <span>Appearance Theme</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            {/* Dark Theme Button */}
            <button
              onClick={() => onThemeChange('dark')}
              className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                theme === 'dark'
                  ? 'border-violet-600 ring-2 ring-violet-500/30 bg-violet-950/40 text-white'
                  : theme === 'light'
                    ? 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <HiMoon className="w-5 h-5 text-violet-400" />
                <div className="text-left">
                  <div className={`text-sm font-extrabold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Dark Theme</div>
                  <span className="text-[11px] font-normal text-slate-400">High contrast dark layout</span>
                </div>
              </div>
              {theme === 'dark' && (
                <HiCheckCircle className="w-5 h-5 text-violet-400" />
              )}
            </button>

            {/* Light Theme Button */}
            <button
              onClick={() => onThemeChange('light')}
              className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                theme === 'light'
                  ? 'border-violet-600 ring-2 ring-violet-500/30 bg-violet-50 text-violet-950 font-extrabold'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <HiSun className="w-5 h-5 text-amber-500" />
                <div className="text-left">
                  <div className={`text-sm font-extrabold ${theme === 'light' ? 'text-slate-950' : 'text-white'}`}>Light Theme</div>
                  <span className={`text-[11px] font-normal ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Clean bright background</span>
                </div>
              </div>
              {theme === 'light' && (
                <HiCheckCircle className="w-5 h-5 text-violet-600" />
              )}
            </button>
          </div>
        </div>

        {/* AI Difficulty Level */}
        <div className={`space-y-3 pt-4 border-t ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
          <label className={`block text-xs font-bold uppercase flex items-center gap-2 ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
            <HiAcademicCap className="w-4 h-4 text-violet-500" />
            <span>AI Quiz Difficulty</span>
          </label>
          <div className="flex gap-2">
            {['easy', 'medium', 'hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => onDifficultyChange(diff)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  difficulty === diff
                    ? 'bg-violet-600 text-white shadow-md'
                    : theme === 'light'
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
