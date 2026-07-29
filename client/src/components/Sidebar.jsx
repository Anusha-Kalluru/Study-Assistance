import React, { useState } from 'react';
import {
  HiHome,
  HiFolder,
  HiSparkles,
  HiCalendarDays,
  HiChatBubbleLeftRight,
  HiClock,
  HiChartBar,
  HiCog6Tooth,
  HiBars3,
  HiXMark,
} from 'react-icons/hi2';

export default function Sidebar({ activeTab, setActiveTab, theme }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HiHome },
    { id: 'library', label: 'My Library', icon: HiFolder },
    { id: 'aistudio', label: 'AI Studio', icon: HiSparkles, badge: 'PRO' },
    { id: 'planner', label: 'Study Planner', icon: HiCalendarDays },
    { id: 'tutor', label: 'AI Tutor Chat', icon: HiChatBubbleLeftRight, badge: 'AI' },
    { id: 'focus', label: 'Focus Mode', icon: HiClock },
    { id: 'analytics', label: 'Analytics', icon: HiChartBar },
    { id: 'settings', label: 'Settings', icon: HiCog6Tooth },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  const isLight = theme === 'light';

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-3 rounded-2xl border shadow-xl backdrop-blur-md focus:outline-none ${
            isLight
              ? 'bg-white/90 text-slate-900 border-slate-200'
              : 'bg-violet-950/90 text-violet-200 border-violet-700/50'
          }`}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <HiXMark className="w-6 h-6" /> : <HiBars3 className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop overlay on mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 p-5 flex flex-col justify-between z-40 transition-all duration-300 ${
          isLight
            ? 'bg-white text-slate-900 border-r border-slate-200 shadow-sm'
            : 'bg-slate-950 text-slate-200 border-r border-violet-900/30'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 pt-2 px-2">
            <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-md font-bold">
              <HiSparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`font-extrabold text-lg tracking-tight leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Study with AI
              </h1>
              <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest block">
                LEARNING PLATFORM
              </span>
            </div>
          </div>

          {/* Navigation Items List */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] pr-1 custom-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-md'
                      : isLight
                        ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        : 'text-slate-300 hover:bg-violet-900/30 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-white'
                          : isLight
                            ? 'text-violet-600'
                            : 'text-violet-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : isLight
                            ? 'bg-violet-100 text-violet-800 border border-violet-200'
                            : 'bg-violet-900/60 text-violet-300 border border-violet-700/50'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Status */}
        <div className={`pt-4 border-t ${isLight ? 'border-slate-200' : 'border-violet-900/40'} text-center space-y-1`}>
          <div className={`text-xs font-semibold flex items-center justify-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-violet-300'}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>AI System Active</span>
          </div>
        </div>
      </aside>
    </>
  );
}
