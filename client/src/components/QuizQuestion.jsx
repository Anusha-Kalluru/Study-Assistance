import React, { useState } from 'react';
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiSparkles, HiAcademicCap } from 'react-icons/hi2';

/**
 * Single multiple-choice quiz question component with answer reveal state and vibrant Violet styling.
 */
export default function QuizQuestion({
  questionData,
  questionNumber,
  totalQuestions,
  onAnswerSubmit,
  onNext,
  isLastQuestion,
}) {
  const { question, options, answer, explanation } = questionData;

  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOption && !isSubmitted) {
      setIsSubmitted(true);
      const isCorrect = selectedOption === answer;
      onAnswerSubmit(isCorrect, selectedOption, answer);
    }
  };

  const handleNextClick = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Question Header Box */}
      <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-violet-200/90 card-shadow-violet space-y-6 backdrop-blur-xl">
        {/* Top Header Bar: Rearranged Badge & Status */}
        <div className="flex items-center justify-between text-sm font-semibold pb-3 border-b border-violet-100">
          <div className="inline-flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-violet-100/90 border border-violet-200 text-violet-800 text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
              <HiAcademicCap className="w-4 h-4 text-violet-600" />
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-200/60 hidden sm:inline-block">
              ⚡ +100 PTS FOCUS
            </span>
          </div>

          {isSubmitted && (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${selectedOption === answer
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs'
                  : 'bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs'
                }`}
            >
              {selectedOption === answer ? (
                <>
                  <HiCheckCircle className="w-4 h-4 text-emerald-600" /> Correct! 🎯
                </>
              ) : (
                <>
                  <HiXCircle className="w-4 h-4 text-rose-600" /> Keep Learning 💡
                </>
              )}
            </span>
          )}
        </div>

        {/* Question Text Heading */}
        <div className="space-y-2">
          <span className="text-xs font-black text-violet-600 uppercase tracking-widest block">TEST YOUR UNDERSTANDING</span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
            {question}
          </h3>
        </div>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {options.map((option, index) => {
            const isSelected = selectedOption === option;
            const isCorrectAnswer = option === answer;

            let optionStyle = 'bg-violet-50/40 border-violet-200/80 text-slate-800 hover:bg-violet-100/70 hover:border-violet-300';

            if (isSubmitted) {
              if (isCorrectAnswer) {
                // Highlight correct answer in green
                optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/50 shadow-sm';
              } else if (isSelected && !isCorrectAnswer) {
                // Highlight wrong selection in soft red
                optionStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-bold ring-2 ring-rose-400/50 shadow-sm';
              } else {
                optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
            } else if (isSelected) {
              // Selected option in radiant Violet
              optionStyle = 'bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 border-violet-600 text-white font-extrabold shadow-md shadow-violet-600/30';
            }

            return (
              <button
                key={index}
                type="button"
                disabled={isSubmitted}
                onClick={() => setSelectedOption(option)}
                className={`w-full p-4 rounded-2xl border text-left font-semibold transition-all text-sm sm:text-base flex items-center justify-between gap-3 ${optionStyle}`}
              >
                <span>{option}</span>
                {isSubmitted && isCorrectAnswer && (
                  <HiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isSubmitted && isSelected && !isCorrectAnswer && (
                  <HiXCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Box (Revealed after submit) */}
        {isSubmitted && explanation && (
          <div className="p-4 bg-violet-50/90 border border-violet-200/90 rounded-2xl text-slate-800 text-sm space-y-1.5 shadow-2xs animate-fadeIn">
            <div className="flex items-center gap-1.5 font-black text-violet-900 uppercase tracking-wider text-xs">
              <HiInformationCircle className="w-4 h-4 text-violet-600" />
              <span>Explanation & Key Takeaway</span>
            </div>
            <p className="leading-relaxed pl-5 text-slate-700 font-medium">{explanation}</p>
          </div>
        )}

        {/* Actions Footer */}
        <div className="pt-3 flex items-center justify-between border-t border-violet-100">
          <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
            <HiSparkles className="w-3.5 h-3.5 text-violet-500" /> Select an answer to continue
          </span>

          {!isSubmitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 hover:from-violet-500 hover:to-purple-500 text-white font-black rounded-2xl transition-all shadow-md shadow-violet-600/30 disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base tracking-wide"
            >
              Submit Answer 🚀
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextClick}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 hover:from-violet-500 hover:to-purple-500 text-white font-black rounded-2xl transition-all shadow-md shadow-violet-600/30 text-sm sm:text-base tracking-wide"
            >
              {isLastQuestion ? 'View Results 🏆' : 'Next Question →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

