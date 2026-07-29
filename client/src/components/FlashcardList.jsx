import React, { useState, useEffect, useCallback } from 'react';
import Flashcard from './Flashcard';
import ProgressBar from './ProgressBar';
import {
  HiChevronLeft,
  HiChevronRight,
  HiArrowPath,
  HiArrowsRightLeft,
  HiClock,
  HiPlay,
  HiPause,
  HiArrowsPointingOut,
  HiXMark,
  HiCommandLine,
  HiSparkles,
  HiCheckCircle,
  HiExclamationTriangle,
  HiFunnel,
} from 'react-icons/hi2';
import { soundManager } from '../utils/soundEffects';
import { triggerConfetti } from '../utils/confetti';
import { recordCardsMastered } from '../utils/storage';

export default function FlashcardList({ flashcards: initialFlashcards }) {
  const [deck, setDeck] = useState(initialFlashcards || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [cardStatuses, setCardStatuses] = useState({});
  const [filter, setFilter] = useState('all');

  const [zenMode, setZenMode] = useState(false);
  const [showHotkeysModal, setShowHotkeysModal] = useState(false);

  const [timerSeconds, setTimerSeconds] = useState(15 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    setDeck(initialFlashcards || []);
    setCurrentIndex(0);
    setCardStatuses({});
  }, [initialFlashcards]);

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex, filter]);

  useEffect(() => {
    let interval = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
      soundManager.playFanfare();
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const filteredCards = deck.filter((_, originalIdx) => {
    const status = cardStatuses[originalIdx];
    if (filter === 'mastered') return status === 'mastered';
    if (filter === 'review') return status === 'review';
    return true;
  });

  const total = filteredCards.length;
  const currentCard = filteredCards[currentIndex];

  const masteredCount = Object.values(cardStatuses).filter((s) => s === 'mastered').length;
  const reviewCount = Object.values(cardStatuses).filter((s) => s === 'review').length;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, total]);

  const handleMarkStatus = useCallback(
    (status) => {
      if (!currentCard) return;
      const originalIdx = deck.findIndex((c) => c === currentCard);
      if (originalIdx === -1) return;

      const newStatuses = { ...cardStatuses, [originalIdx]: status };
      setCardStatuses(newStatuses);

      if (status === 'mastered') {
        soundManager.playMastered();
        triggerConfetti();
        recordCardsMastered(1);

        const newMasteredCount = Object.values(newStatuses).filter((s) => s === 'mastered').length;
        if (newMasteredCount === deck.length) {
          soundManager.playFanfare();
        }
      } else {
        soundManager.playReview();
      }

      if (currentIndex < total - 1) {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
        }, 300);
      }
    },
    [currentCard, deck, cardStatuses, currentIndex, total]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'd') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === '1') {
        e.preventDefault();
        handleMarkStatus('review');
      } else if (e.key === '2') {
        e.preventDefault();
        handleMarkStatus('mastered');
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setZenMode((prev) => !prev);
      } else if (e.key === 'Escape') {
        setZenMode(false);
        setShowHotkeysModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleMarkStatus]);

  const handleShuffle = () => {
    soundManager.playFlip();
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
  };

  const handleResetProgress = () => {
    soundManager.playFlip();
    setCardStatuses({});
    setCurrentIndex(0);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!deck || deck.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* TOP CONTROL BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-violet-950 border border-violet-800 text-violet-300 text-xs font-black uppercase tracking-wider">
            FOCUS SPRINT
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200">
            <HiClock className="w-4 h-4 text-violet-400" />
            <span className="font-mono text-white">{formatTime(timerSeconds)}</span>
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="p-1 hover:bg-slate-800 rounded-md transition-colors text-slate-300"
              title={timerRunning ? 'Pause Timer' : 'Start Focus Timer'}
            >
              {timerRunning ? <HiPause className="w-3.5 h-3.5" /> : <HiPlay className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            onClick={() => setShowHotkeysModal(true)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-bold"
            title="Keyboard Shortcuts"
          >
            <HiCommandLine className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZenMode(true)}
            className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-xs transition-all shadow-md flex items-center gap-1.5"
            title="Full Screen Zen Focus Mode"
          >
            <HiArrowsPointingOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Zen Mode</span>
          </button>
        </div>
      </div>

      {/* FILTER TABS & DECK CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs font-bold">
          <span className="px-2 text-slate-400 flex items-center gap-1">
            <HiFunnel className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: 'all', label: `All (${deck.length})` },
            { id: 'review', label: `Review (${reviewCount})`, icon: HiExclamationTriangle, color: 'text-amber-400' },
            { id: 'mastered', label: `Mastered (${masteredCount})`, icon: HiCheckCircle, color: 'text-emerald-400' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setFilter(f.id);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                filter === f.id
                  ? 'bg-violet-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.icon && <f.icon className={`w-3.5 h-3.5 ${f.color}`} />}
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <HiArrowsRightLeft className="w-3.5 h-3.5 text-violet-400" />
            <span>Shuffle</span>
          </button>

          <button
            onClick={handleResetProgress}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            title="Reset Mastered and Review marks"
          >
            <HiArrowPath className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <ProgressBar
        current={currentIndex + 1}
        total={deck.length}
        masteredCount={masteredCount}
        reviewCount={reviewCount}
      />

      {total > 0 && currentCard ? (
        <div className="py-2">
          <Flashcard
            key={`${currentCard.question}-${currentIndex}`}
            flashcard={currentCard}
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
            cardNumber={currentIndex + 1}
            totalCards={total}
            status={cardStatuses[deck.findIndex((c) => c === currentCard)]}
            onMarkStatus={handleMarkStatus}
          />
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 text-violet-400 flex items-center justify-center mx-auto border border-slate-800">
            <HiSparkles className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-extrabold text-white">No cards in this filter!</h4>
          <p className="text-sm text-slate-400 max-w-sm mx-auto font-medium">
            You haven't marked any cards as "{filter}". Switch back to "All Cards" to keep studying!
          </p>
          <button
            onClick={() => setFilter('all')}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md"
          >
            Show All Cards
          </button>
        </div>
      )}

      {total > 0 && (
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-extrabold rounded-xl transition-all shadow-sm disabled:opacity-40 flex items-center gap-1.5 text-sm"
          >
            <HiChevronLeft className="w-5 h-5 text-violet-400" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
            Card <span className="text-white font-extrabold">{currentIndex + 1}</span> of {total}
          </span>

          <button
            onClick={handleNext}
            disabled={currentIndex === total - 1}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-xl transition-all shadow-md disabled:opacity-40 flex items-center gap-1.5 text-sm"
          >
            <span>Next</span>
            <HiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
