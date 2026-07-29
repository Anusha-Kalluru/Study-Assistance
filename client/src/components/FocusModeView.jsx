import React, { useState, useEffect } from 'react';
import {
  HiClock,
  HiPlay,
  HiPause,
  HiArrowPath,
  HiSpeakerWave,
} from 'react-icons/hi2';
import { playAmbientSound, stopAmbientSound, setAmbientVolume } from '../utils/ambientAudio';
import { recordStudyTime } from '../utils/storage';

export default function FocusModeView({ theme }) {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work');
  const [ambientSound, setAmbientSound] = useState('none');
  const [volume, setVolume] = useState(0.5);

  const isLight = theme === 'light';

  useEffect(() => {
    let timer = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      stopAmbientSound();
      if (mode === 'work') {
        recordStudyTime(25 * 60 * 1000); // Add 25 mins to total study time
        alert('25-Minute Focus Session Completed! Study time recorded.');
        setMode('break');
        setSecondsLeft(5 * 60);
      } else {
        alert('Break finished! Ready to focus again?');
        setMode('work');
        setSecondsLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, mode]);

  const handleSoundChange = (newSound) => {
    const nextSound = ambientSound === newSound ? 'none' : newSound;
    setAmbientSound(nextSound);
    if (nextSound === 'none') {
      stopAmbientSound();
    } else {
      playAmbientSound(nextSound, volume);
    }
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    setAmbientVolume(newVol);
  };

  const resetTimer = () => {
    setIsRunning(false);
    stopAmbientSound();
    setSecondsLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className={`${isLight ? 'bg-violet-900 border-violet-800 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-100 shadow-xl'} rounded-3xl p-6 sm:p-8 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <HiClock className="w-3.5 h-3.5 text-violet-300" />
            <span>POMODORO & AMBIENT SOUNDS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Focus Mode</h2>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            Improve concentration with Pomodoro timers & background ambient noise generator.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timer Card */}
        <div className={`${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-900' : 'bg-slate-900 border-slate-800 shadow-xl text-white'} rounded-3xl p-8 border text-center space-y-6 flex flex-col justify-between items-center`}>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setMode('work');
                setSecondsLeft(25 * 60);
                setIsRunning(false);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                mode === 'work' ? 'bg-violet-600 text-white shadow-md' : isLight ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              Focus Work (25m)
            </button>
            <button
              onClick={() => {
                setMode('break');
                setSecondsLeft(5 * 60);
                setIsRunning(false);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                mode === 'break' ? 'bg-emerald-600 text-white shadow-md' : isLight ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              Rest Break (5m)
            </button>
          </div>

          {/* Timer Display */}
          <div className="space-y-2">
            <div className={`text-6xl sm:text-7xl font-extrabold font-mono tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {formatTime(secondsLeft)}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {isRunning ? 'Focus Session Active' : 'Session Paused'}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const nextRunning = !isRunning;
                setIsRunning(nextRunning);
                if (nextRunning && ambientSound !== 'none') {
                  playAmbientSound(ambientSound, volume);
                }
              }}
              className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl shadow-md transition-all flex items-center gap-2 text-sm"
            >
              {isRunning ? <HiPause className="w-4 h-4 text-white" /> : <HiPlay className="w-4 h-4 text-white" />}
              <span>{isRunning ? 'Pause Timer' : 'Start Focus Session'}</span>
            </button>

            <button
              onClick={resetTimer}
              className={`p-3 rounded-2xl border transition-all ${
                isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200' : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border-slate-800'
              }`}
              title="Reset Timer"
            >
              <HiArrowPath className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ambient Sound Player Card */}
        <div className={`${isLight ? 'bg-white border-slate-200 shadow-sm text-slate-900' : 'bg-slate-900 border-slate-800 shadow-xl text-white'} rounded-3xl p-8 border space-y-6 flex flex-col justify-between`}>
          <div className="space-y-2">
            <h3 className={`text-lg font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <HiSpeakerWave className="w-5 h-5 text-violet-500" />
              <span>Background Ambient Generator</span>
            </h3>
            <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              High-fidelity Web Audio noise generator designed to filter out ambient room noise.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'rain', label: 'Soft Rain' },
              { id: 'waves', label: 'Ocean Waves' },
              { id: 'coffee', label: 'Coffee Shop' },
              { id: 'white', label: 'White Noise' },
            ].map((snd) => {
              const isPlaying = ambientSound === snd.id;
              return (
                <button
                  key={snd.id}
                  onClick={() => handleSoundChange(snd.id)}
                  className={`p-4 rounded-2xl border text-left font-bold text-xs transition-all space-y-1 ${
                    isPlaying
                      ? 'bg-violet-600 text-white border-violet-600 shadow-md ring-2 ring-violet-500/30'
                      : isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{snd.label}</span>
                    {isPlaying && <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20">Active</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Volume Slider */}
          <div className={`pt-3 border-t space-y-2 ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
            <div className={`flex justify-between text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <span>Ambient Sound Volume</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-violet-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
