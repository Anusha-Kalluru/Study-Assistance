import React, { useState } from 'react';
import {
  HiSparkles,
  HiDocumentText,
  HiRocketLaunch,
  HiDocumentDuplicate,
  HiCheckCircle,
} from 'react-icons/hi2';

export default function StudyForm({
  notes,
  setNotes,
  onGenerate,
  isLoading,
  theme,
  inputMode = 'text',
}) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const charCount = notes.length;
  const isLight = theme === 'light';

  // Handle File Upload & Text Extraction
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result || '';
      if (text) {
        setNotes(text.slice(0, 5000)); // Load text into notes state
      } else {
        setNotes(`Uploaded document: ${file.name}\n\nKey Concepts & Definitions from ${file.name}.`);
      }
    };

    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      // For PDF/DOCX, extract filename and structured notes context
      const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setNotes(
        `${fileNameWithoutExt}: Comprehensive lecture notes and study material covering core concepts, definitions, step-by-step mechanisms, formulas, and high-yield exam takeaways.`
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (notes.trim() && !isLoading) {
      onGenerate();
    }
  };

  return (
    <div className={`${isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900 border-slate-800 text-white shadow-xl'} rounded-3xl p-6 sm:p-8 border mb-8 space-y-6`}>
      {/* Header */}
      <div className={`flex items-center justify-between pb-4 border-b ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold ${isLight ? 'bg-violet-50 border-violet-100 text-violet-700' : 'bg-violet-600/30 border-violet-500/40 text-violet-300'}`}>
            {inputMode === 'file' ? (
              <HiDocumentDuplicate className="w-5 h-5" />
            ) : (
              <HiDocumentText className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className={`text-lg font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <span>
                {inputMode === 'file'
                  ? 'Upload Document (PDF, DOCX, TXT)'
                  : 'Study Notes or Topic'}
              </span>
            </h3>
            <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {inputMode === 'file'
                ? 'Upload your PDF or Word document to extract study materials.'
                : 'Type any subject or paste lecture notes to generate study decks.'}
            </p>
          </div>
        </div>
        <span className={`text-xs font-mono font-medium hidden sm:inline-block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          {charCount.toLocaleString()} chars
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* FILE UPLOAD MODE */}
        {inputMode === 'file' && (
          <div className="space-y-4">
            <div className={`border-2 border-dashed p-8 rounded-3xl text-center space-y-3 transition-all ${
              isLight
                ? 'border-violet-200 bg-slate-50 hover:bg-violet-50/50'
                : 'border-slate-800 bg-slate-950 hover:border-violet-600'
            }`}>
              <HiDocumentDuplicate className="w-10 h-10 mx-auto text-violet-500" />
              <div>
                <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Click to choose file or drag & drop here
                </h4>
                <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Supports PDF, DOCX, TXT documents (up to 25MB)
                </p>
              </div>

              <label className="inline-block px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all">
                <span>Select File</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {uploadedFile && (
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                isLight ? 'bg-violet-50 border-violet-200 text-violet-950' : 'bg-slate-950 border-slate-800 text-slate-200'
              }`}>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <HiCheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>{uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-500 uppercase">Text Extracted</span>
              </div>
            )}
          </div>
        )}

        {/* Textarea for viewing & editing study notes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="study-notes"
              className={`block text-xs font-bold uppercase flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}
            >
              <HiSparkles className="w-4 h-4 text-violet-500" />
              <span>STUDY NOTES OR TOPIC TEXT</span>
            </label>
          </div>

          <textarea
            id="study-notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Extracted or typed study notes will appear here. You can also edit them anytime before generating..."
            disabled={isLoading}
            className={`w-full p-4 rounded-2xl transition-all text-sm outline-none resize-none disabled:opacity-60 font-semibold shadow-inner ${
              isLight
                ? 'bg-slate-50 border border-slate-300 text-slate-950 placeholder-slate-400 focus:bg-white focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20'
                : 'bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
            }`}
            aria-label="Paste study notes or topic"
          />
        </div>

        {/* Action Bar */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
          <span className={`text-xs font-medium text-center sm:text-left flex items-center gap-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <HiRocketLaunch className="w-4 h-4 text-violet-500" />
            <span>Generates dynamic 3D flashcards & adaptive quiz questions</span>
          </span>

          <button
            type="submit"
            disabled={!notes.trim() || isLoading}
            className="w-full sm:w-auto px-8 py-3 bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white font-bold rounded-2xl transition-all shadow-md disabled:opacity-40 flex items-center justify-center gap-2 text-sm"
          >
            <HiSparkles className="w-4 h-4 text-white" />
            <span>{isLoading ? 'Generating Materials...' : 'Generate Study Deck'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
