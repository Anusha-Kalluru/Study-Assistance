import React from 'react';
import { HiHome, HiRocketLaunch, HiBookOpen, HiAcademicCap } from 'react-icons/hi2';

/**
 * Responsive 4-Step Workflow Navigation Header
 */
export default function Tabs({ activeTab, setActiveTab, flashcardsCount, quizCount }) {
  const steps = [
    { id: 'dashboard', stepNum: 1, label: 'Dashboard', icon: HiHome },
    { id: 'today', stepNum: 2, label: "Today's Target", icon: HiRocketLaunch },
    { id: 'learning', stepNum: 3, label: 'Continue Learning', count: flashcardsCount, icon: HiBookOpen },
    { id: 'session', stepNum: 4, label: 'Study Session', icon: HiAcademicCap },
  ];

  return (
    <div className="w-full space-y-3">
      {/* Top Stepper Bar Container */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-md">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = activeTab === step.id;

          return (
            <button
              key={step.id}
              onClick={() => setActiveTab(step.id)}
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl font-bold text-xs transition-all duration-200 text-center ${
                isActive
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
              role="tab"
              aria-selected={isActive}
            >
              {/* Step indicator pill */}
              <div className="flex items-center gap-1 mb-1">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Step {step.stepNum}
                </span>
                {step.count !== undefined && step.count > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {step.count}
                  </span>
                )}
              </div>

              {/* Icon & Label */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <Icon className="w-4 h-4 text-violet-300" />
                <span className="truncate font-bold">{step.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
