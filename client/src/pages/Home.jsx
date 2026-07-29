import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardView from '../components/DashboardView';
import AIStudioView from '../components/AIStudioView';
import LibraryView from '../components/LibraryView';
import PlannerView from '../components/PlannerView';
import AITutorView from '../components/AITutorView';
import FocusModeView from '../components/FocusModeView';
import AnalyticsView from '../components/AnalyticsView';
import SettingsView from '../components/SettingsView';
import { getSettings, saveSettings } from '../utils/storage';

const SAMPLE_TOPIC_TEXT =
  'Photosynthesis is the process used by plants to convert light energy into chemical energy. Chlorophyll absorbs sunlight in the chloroplasts. The light-dependent reactions convert solar energy to ATP and NADPH, while the Calvin cycle uses these to fix carbon dioxide into glucose.';

/**
 * AI Study OS Root Container with Theme Switcher Support
 */
export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notes, setNotes] = useState('');
  const [studyData, setStudyData] = useState(null);

  const [settings, setSettings] = useState(getSettings());
  const theme = settings.theme || 'dark';

  const handleThemeChange = (newTheme) => {
    const updated = saveSettings({ theme: newTheme });
    setSettings(updated);
  };

  const handleDifficultyChange = (newDifficulty) => {
    const updated = saveSettings({ difficulty: newDifficulty });
    setSettings(updated);
  };

  const handleQuickLoadSample = () => {
    setNotes(SAMPLE_TOPIC_TEXT);
    setActiveTab('aistudio');
  };

  const handleRetestWrongAnswers = (wrongQuestions) => {
    if (wrongQuestions && wrongQuestions.length > 0) {
      setStudyData({ quiz: wrongQuestions, flashcards: [], isRetest: true });
      setActiveTab('aistudio');
    }
  };

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 ${
        theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />

      {/* Main Content Area */}
      <div
        className={`flex-1 lg:ml-72 min-h-screen p-4 sm:p-8 overflow-y-auto transition-colors duration-300 ${
          theme === 'light'
            ? 'bg-slate-100 text-slate-900'
            : 'bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950/30 text-slate-100'
        }`}
      >
        <div className="max-w-[1200px] mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={setActiveTab}
              onQuickLoadSample={handleQuickLoadSample}
              theme={theme}
            />
          )}

          {activeTab === 'library' && (
            <LibraryView onQuickSelectSample={handleQuickLoadSample} theme={theme} />
          )}

          {activeTab === 'aistudio' && (
            <AIStudioView
              notes={notes}
              setNotes={setNotes}
              studyData={studyData}
              setStudyData={setStudyData}
              theme={theme}
            />
          )}

          {activeTab === 'planner' && <PlannerView theme={theme} />}

          {activeTab === 'tutor' && <AITutorView theme={theme} />}

          {activeTab === 'focus' && <FocusModeView theme={theme} />}

          {activeTab === 'analytics' && (
            <AnalyticsView
              onQuickLoadSample={handleQuickLoadSample}
              onRetestWrongAnswers={handleRetestWrongAnswers}
              theme={theme}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              theme={theme}
              onThemeChange={handleThemeChange}
              difficulty={settings.difficulty}
              onDifficultyChange={handleDifficultyChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
