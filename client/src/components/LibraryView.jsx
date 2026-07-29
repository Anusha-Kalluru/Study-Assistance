import React, { useState } from 'react';
import {
  HiFolder,
  HiMagnifyingGlass,
  HiBookOpen,
  HiAcademicCap,
  HiTrash,
  HiArchiveBoxXMark,
} from 'react-icons/hi2';
import { getLibraryItems, deleteLibraryItem, clearLibraryItems } from '../utils/storage';

export default function LibraryView({ onQuickSelectSample, theme }) {
  const [items, setItems] = useState(getLibraryItems());
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const isLight = theme === 'light';

  const handleDeleteItem = (id, e) => {
    e.stopPropagation();
    const updated = deleteLibraryItem(id);
    setItems(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all saved study history?')) {
      const updated = clearLibraryItems();
      setItems(updated);
    }
  };

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.subject.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Library Banner */}
      <div className={`${isLight ? 'bg-violet-900 border-violet-800 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-100 shadow-xl'} rounded-3xl p-6 sm:p-8 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <HiFolder className="w-3.5 h-3.5 text-violet-300" />
            <span>MY STUDY LIBRARY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Saved Resources</h2>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            Search, manage, or delete your generated flashcards, quizzes, and study notes history.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2.5 bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
            title="Clear all saved study history"
          >
            <HiArchiveBoxXMark className="w-4 h-4" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Search Bar & Filters */}
      <div className={`${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-xl'} rounded-2xl p-4 border flex flex-col sm:flex-row items-center justify-between gap-4`}>
        <div className="relative w-full sm:w-96">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saved notes or subjects..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold outline-none ${
              isLight
                ? 'bg-slate-50 border border-slate-300 text-slate-950 placeholder-slate-400 focus:bg-white focus:border-violet-600'
                : 'bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-violet-500'
            }`}
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {['all', 'notes', 'deck'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filterType === t
                  ? 'bg-violet-600 text-white shadow-md'
                  : isLight
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`${isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm hover:border-violet-400' : 'bg-slate-900 border-slate-800 text-white shadow-xl hover:border-violet-600'} rounded-2xl p-5 border transition-all space-y-3 flex flex-col justify-between group relative`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${isLight ? 'bg-violet-50 text-violet-700 border-violet-200' : 'bg-slate-950 text-violet-300 border-slate-800'}`}>
                    {item.subject}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-medium ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{item.date}</span>
                    <button
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
                      title="Delete from history"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h4 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.title}</h4>
                <p className={`text-xs font-medium line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{item.summary}</p>
              </div>

              <div className={`pt-3 border-t flex items-center justify-between ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                <div className={`flex items-center gap-3 text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <span className="flex items-center gap-1">
                    <HiBookOpen className="w-3.5 h-3.5 text-violet-600" />
                    {item.flashcardsCount} Cards
                  </span>
                  <span className="flex items-center gap-1">
                    <HiAcademicCap className="w-3.5 h-3.5 text-violet-600" />
                    {item.quizCount} Quiz
                  </span>
                </div>

                <button
                  onClick={onQuickSelectSample}
                  className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Open Deck
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`${isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900 border-slate-800 text-white shadow-xl'} rounded-3xl p-12 text-center border space-y-3`}>
          <HiFolder className={`w-12 h-12 mx-auto ${isLight ? 'text-slate-300' : 'text-slate-700'}`} />
          <h4 className={`font-bold text-lg ${isLight ? 'text-slate-900' : 'text-white'}`}>No Saved Resources Yet</h4>
          <p className={`text-xs max-w-sm mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Generate flashcards, quizzes, or notes in AI Studio to automatically save them to your library.
          </p>
          <button
            onClick={onQuickSelectSample}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Create Your First Study Deck
          </button>
        </div>
      )}
    </div>
  );
}
