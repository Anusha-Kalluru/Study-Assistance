import React, { useState } from 'react';
import QuizQuestion from './QuizQuestion';
import ProgressBar from './ProgressBar';
import { recordQuizResult } from '../utils/storage';

/**
 * Controller component for the Quiz flow.
 */
export default function Quiz({ quizItems, onQuizComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  if (!quizItems || quizItems.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-900 rounded-[20px] border border-slate-800">
        <p className="text-slate-400 font-medium">No quiz questions available for this topic.</p>
      </div>
    );
  }

  const total = quizItems.length;
  const currentQuestion = quizItems[currentIndex];

  const handleAnswerSubmit = (isCorrect, selectedOption, correctAnswer) => {
    const answerRecord = {
      questionData: currentQuestion,
      selectedOption,
      correctAnswer,
      isCorrect,
    };
    setUserAnswers((prev) => [...prev, answerRecord]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Quiz complete: calculate score & wrong questions
      const finalAnswers = userAnswers;
      const correctCount = finalAnswers.filter((a) => a.isCorrect).length;
      const wrongQuestions = finalAnswers
        .filter((a) => !a.isCorrect)
        .map((a) => a.questionData);

      const scorePercent = Math.round((correctCount / total) * 100);
      recordQuizResult(scorePercent, wrongQuestions);

      onQuizComplete({
        score: correctCount,
        total,
        correctCount,
        wrongCount: total - correctCount,
        wrongQuestions,
      });
    }
  };

  return (
    <div className="space-y-6">
      <ProgressBar current={currentIndex + 1} total={total} />

      <QuizQuestion
        key={currentIndex}
        questionData={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={total}
        onAnswerSubmit={handleAnswerSubmit}
        onNext={handleNextQuestion}
        isLastQuestion={currentIndex === total - 1}
      />
    </div>
  );
}
