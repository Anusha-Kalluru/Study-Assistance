import React from 'react';
import { HiExclamationTriangle, HiArrowPath } from 'react-icons/hi2';

/**
 * Friendly error display card with soft red background, violet accents, and retry button.
 */
export default function ErrorCard({ message, onRetry }) {
  return (
    <div className="bg-rose-50/95 rounded-3xl p-6 sm:p-8 border border-rose-200 card-shadow-violet text-center space-y-4 max-w-lg mx-auto backdrop-blur-xl">
      <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 shadow-sm">
        <HiExclamationTriangle className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-black text-rose-950">Generation Interrupted</h3>
        <p className="text-sm text-rose-800 font-medium">
          {message || 'Something went wrong while generating study material. Please try again.'}
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-black rounded-2xl transition-all shadow-md shadow-violet-600/30 flex items-center justify-center gap-2 mx-auto text-sm"
        >
          <HiArrowPath className="w-4 h-4" />
          <span>Try Again 🚀</span>
        </button>
      )}
    </div>
  );
}

