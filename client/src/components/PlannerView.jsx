import React, { useState } from 'react';
import {
  HiCalendarDays,
  HiSparkles,
  HiAcademicCap,
  HiClock,
  HiBookOpen,
} from 'react-icons/hi2';
import { generateStudyPlan } from '../services/api';

export default function PlannerView({ theme }) {
  const [examDate, setExamDate] = useState('2026-08-24');
  const [hours, setHours] = useState('9');
  const [subject, setSubject] = useState('RAG (Retrieval Augmented Generation)');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isLight = theme === 'light';

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    if (!subject.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      // Calculate days count between today and target exam date
      const targetDate = new Date(examDate);
      const today = new Date();
      const diffTime = targetDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const totalDays = Math.max(1, Math.min(14, diffDays > 0 ? diffDays : 5));

      const schedule = await generateStudyPlan(
        subject.trim(),
        parseInt(hours) || 3,
        totalDays,
        examDate
      );

      // Enhance schedule items with exact formatted dates
      const enhancedSchedule = schedule.map((item, index) => {
        const itemDate = new Date();
        itemDate.setDate(today.getDate() + index);

        const options = { month: 'short', day: 'numeric', weekday: 'short' };
        const dateStr = itemDate.toLocaleDateString('en-US', options);

        return {
          ...item,
          formattedDate: `${dateStr} (Day ${index + 1})`,
        };
      });

      setGeneratedPlan(enhancedSchedule);
    } catch (err) {
      setError(err.message || 'Failed to generate custom study schedule.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`${isLight ? 'bg-violet-900 border-violet-800 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-100 shadow-xl'} rounded-3xl p-6 sm:p-8 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <HiCalendarDays className="w-4 h-4 text-violet-300" />
            <span>AI STUDY PLANNER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Study Schedule Planner</h2>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            AI generates customized daily study timelines based on your target exam date and priority subject.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form Card */}
        <div className={`${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-900' : 'bg-slate-900 border-slate-800 shadow-xl text-white'} rounded-3xl p-6 border space-y-5`}>
          <h3 className={`text-base font-bold flex items-center gap-2 pb-3 border-b ${isLight ? 'border-slate-100 text-slate-900' : 'border-slate-800 text-white'}`}>
            <HiSparkles className="w-4.5 h-4.5 text-violet-500" />
            <span>Schedule Parameters</span>
          </h3>

          <form onSubmit={handleGeneratePlan} className="space-y-4 text-xs font-bold">
            <div className="space-y-1.5">
              <label className={`flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <HiCalendarDays className="w-4 h-4 text-violet-500 shrink-0" />
                <span>TARGET EXAM DATE</span>
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className={`w-full h-11 px-3.5 rounded-xl outline-none font-semibold text-xs sm:text-sm ${
                  isLight
                    ? 'bg-slate-50 border border-slate-300 text-slate-950 focus:bg-white focus:border-violet-600 light-picker'
                    : 'bg-slate-950 border border-slate-800 text-white focus:border-violet-500 dark-picker'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <HiClock className="w-4 h-4 text-violet-500 shrink-0" />
                <span>AVAILABLE STUDY HOURS / DAY</span>
              </label>
              <input
                type="number"
                min="1"
                max="16"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className={`w-full h-11 px-3.5 rounded-xl outline-none font-semibold text-xs sm:text-sm ${
                  isLight
                    ? 'bg-slate-50 border border-slate-300 text-slate-950 focus:bg-white focus:border-violet-600'
                    : 'bg-slate-950 border border-slate-800 text-white focus:border-violet-500'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <HiBookOpen className="w-4 h-4 text-violet-500 shrink-0" />
                <span>PRIORITY SUBJECT / TOPIC</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. RAG, Quantum Computing, Organic Chemistry..."
                className={`w-full h-11 px-3.5 rounded-xl outline-none font-semibold text-xs sm:text-sm truncate ${
                  isLight
                    ? 'bg-slate-50 border border-slate-300 text-slate-950 focus:bg-white focus:border-violet-600'
                    : 'bg-slate-950 border border-slate-800 text-white focus:border-violet-500'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={!subject.trim() || loading}
              className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md disabled:opacity-50 transition-all mt-2"
            >
              {loading ? 'Generating Schedule...' : 'Generate AI Study Plan'}
            </button>
          </form>
        </div>

        {/* Schedule Output */}
        <div className={`lg:col-span-2 ${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-900' : 'bg-slate-900 border-slate-800 shadow-xl text-white'} rounded-3xl p-6 border space-y-4 min-h-[380px] flex flex-col justify-between`}>
          <div>
            <h3 className={`text-base font-bold flex items-center justify-between pb-3 border-b ${isLight ? 'border-slate-100 text-slate-900' : 'border-slate-800 text-white'}`}>
              <div className="flex items-center gap-2">
                <HiAcademicCap className="w-4 h-4 text-violet-500" />
                <span>Generated Daily Study Timeline</span>
              </div>
              {generatedPlan && (
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${isLight ? 'bg-violet-50 text-violet-700 border-violet-200' : 'bg-violet-950 text-violet-300 border-violet-800'}`}>
                  {subject} ({hours} hrs/day)
                </span>
              )}
            </h3>

            {error && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs font-bold mt-3">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-16 text-violet-600 text-xs font-bold animate-pulse space-y-2">
                <HiSparkles className="w-8 h-8 text-violet-600 mx-auto" />
                <p>Analyzing target exam date ({examDate}) and generating customized daily modules for {subject}...</p>
              </div>
            ) : generatedPlan ? (
              <div className="space-y-3 mt-4">
                {generatedPlan.map((p, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                      isLight
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold px-3 py-1 rounded-xl bg-violet-600 text-white shrink-0 shadow-xs">
                        {p.formattedDate || p.day}
                      </span>
                      <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{p.focus}</span>
                    </div>
                    <span className={`font-semibold px-3 py-1 rounded-lg border shrink-0 ${
                      isLight
                        ? 'bg-white text-slate-700 border-slate-200'
                        : 'bg-slate-900 text-violet-300 border-slate-800'
                    }`}>
                      {hours} hrs
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-16 text-xs font-medium space-y-3 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <HiCalendarDays className={`w-12 h-12 mx-auto ${isLight ? 'text-violet-600' : 'text-violet-400'}`} />
                <p>Set your target exam date & priority subject and click "Generate AI Study Plan" to view your customized timeline.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
