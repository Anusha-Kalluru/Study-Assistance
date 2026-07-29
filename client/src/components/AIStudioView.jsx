import React, { useState } from 'react';
import {
  HiSparkles,
  HiDocumentText,
  HiBookOpen,
  HiAcademicCap,
  HiDocumentDuplicate,
} from 'react-icons/hi2';
import StudyForm from './StudyForm';
import FlashcardList from './FlashcardList';
import Quiz from './Quiz';
import Result from './Result';
import Loading from './Loading';
import ErrorCard from './ErrorCard';
import { generateStudyMaterial, generateToolData } from '../services/api';
import { saveToLibrary } from '../utils/storage';

export default function AIStudioView({
  notes,
  setNotes,
  studyData,
  setStudyData,
  onQuizComplete,
  theme,
}) {
  const [activeSubTab, setActiveSubTab] = useState('deck');
  const [inputMode, setInputMode] = useState('text');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeQuizItems, setActiveQuizItems] = useState(studyData?.quiz || []);
  const [quizResult, setQuizResult] = useState(null);
  const [quizKey, setQuizKey] = useState(0);

  const [summaryOutput, setSummaryOutput] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);

  React.useEffect(() => {
    if (studyData?.quiz) {
      setActiveQuizItems(studyData.quiz);
      setQuizResult(null);
      setQuizKey((prev) => prev + 1);
      if (studyData.isRetest) {
        setActiveSubTab('quiz');
      }
    }
  }, [studyData]);

  const isLight = theme === 'light';

  const handleGenerate = async () => {
    const inputTopic = notes.trim();
    if (!inputTopic || loading) return;

    setLoading(true);
    setError(null);

    try {
      // Call backend API for dynamic AI generation of flashcards & quiz
      const data = await generateStudyMaterial(inputTopic);
      setStudyData(data);
      setActiveQuizItems(data.quiz || []);
      setQuizResult(null);
      setQuizKey((prev) => prev + 1);

      // Save item to user library
      saveToLibrary({
        title: inputTopic.slice(0, 35) + (inputTopic.length > 35 ? '...' : ''),
        type: 'deck',
        subject: inputTopic.split(' ')[0] || 'General Study',
        flashcardsCount: data.flashcards?.length || 0,
        quizCount: data.quiz?.length || 0,
      });

      // Call backend for comprehensive Smart Notes & Summary
      setSummaryLoading(true);
      try {
        const summaryData = await generateToolData('summary', inputTopic);
        setSummaryOutput(summaryData.summary || summaryData.result || '');
      } catch (e) {
        setSummaryOutput(
          `## Executive Overview for ${inputTopic}\n\n` +
          `- **Core Concept**: ${inputTopic} involves understanding fundamental principles, structural workflows, and key applications.\n` +
          `- **Mechanisms**: Step-by-step breakdown of key processes.\n` +
          `- **High-Yield Takeaways**: Review flashcards and quiz questions to solidify long-term memory.`
        );
      } finally {
        setSummaryLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate study material.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Studio Header */}
      <div className={`${isLight ? 'bg-violet-900 border-violet-800 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-100 shadow-xl'} rounded-3xl p-6 sm:p-8 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <HiSparkles className="w-3.5 h-3.5 text-violet-300" />
            <span>AI CREATION STUDIO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Generate Material for Any Subject
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            Type any topic or paste notes to generate accurate 3D Flashcards, Adaptive Quizzes, and Smart Notes.
          </p>
        </div>
      </div>

      {/* Input Mode Selector: Only Paste Notes / Topic and Upload PDF / DOCX */}
      <div className={`flex flex-wrap gap-2 p-1.5 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
        <button
          onClick={() => setInputMode('text')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            inputMode === 'text'
              ? 'bg-violet-600 text-white shadow-md'
              : isLight
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <HiDocumentText className="w-4 h-4" />
          <span>Paste Notes / Topic</span>
        </button>

        <button
          onClick={() => setInputMode('file')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            inputMode === 'file'
              ? 'bg-violet-600 text-white shadow-md'
              : isLight
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <HiDocumentDuplicate className="w-4 h-4" />
          <span>Upload PDF / DOCX</span>
        </button>
      </div>

      {/* Main Study Form */}
      <StudyForm
        notes={notes}
        setNotes={setNotes}
        onGenerate={handleGenerate}
        isLoading={loading}
        theme={theme}
        inputMode={inputMode}
      />

      {/* Results Output Section */}
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorCard message={error} onRetry={handleGenerate} />
      ) : studyData ? (
        <div className={`${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-xl'} rounded-3xl p-6 sm:p-8 border space-y-6`}>
          {/* Tool Navigation Tabs */}
          <div className={`flex flex-wrap gap-2 pb-4 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <button
              onClick={() => setActiveSubTab('deck')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSubTab === 'deck'
                  ? 'bg-violet-600 text-white shadow-md'
                  : isLight
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <HiBookOpen className="w-4 h-4" />
              <span>3D Flashcards ({studyData.flashcards?.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('quiz')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSubTab === 'quiz'
                  ? 'bg-violet-600 text-white shadow-md'
                  : isLight
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <HiAcademicCap className="w-4 h-4" />
              <span>Quiz Arena ({activeQuizItems?.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('summary')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSubTab === 'summary'
                  ? 'bg-violet-600 text-white shadow-md'
                  : isLight
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <HiDocumentText className="w-4 h-4" />
              <span>Smart Notes & Summary</span>
            </button>
          </div>

          {/* Sub-tab views */}
          <div>
            {activeSubTab === 'deck' && (
              <FlashcardList flashcards={studyData.flashcards} theme={theme} />
            )}

            {activeSubTab === 'quiz' && (
              quizResult ? (
                <Result
                  resultData={quizResult}
                  onRetestWrongAnswers={() => {
                    setActiveQuizItems(quizResult.wrongQuestions);
                    setQuizResult(null);
                    setQuizKey((k) => k + 1);
                  }}
                  onRetakeFullQuiz={() => {
                    setActiveQuizItems(studyData.quiz);
                    setQuizResult(null);
                    setQuizKey((k) => k + 1);
                  }}
                />
              ) : (
                <Quiz
                  key={quizKey}
                  quizItems={activeQuizItems}
                  onQuizComplete={(res) => {
                    setQuizResult(res);
                    if (onQuizComplete) onQuizComplete(res);
                  }}
                />
              )
            )}

            {activeSubTab === 'summary' && (
              <div className={`space-y-4 p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                <div className={`pb-3 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                  <h4 className={`font-extrabold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>Comprehensive Smart Notes & Summary</h4>
                  <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Detailed academic breakdown including core definitions, mechanisms, and key exam takeaways.
                  </p>
                </div>

                {summaryLoading ? (
                  <div className="py-8 text-center text-violet-600 text-xs font-bold animate-pulse space-y-2">
                    <HiSparkles className="w-6 h-6 text-violet-600 mx-auto" />
                    <p>Generating detailed Smart Notes & Summary...</p>
                  </div>
                ) : (
                  <div className={`text-xs sm:text-sm whitespace-pre-line leading-relaxed font-normal ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    {summaryOutput}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
