/**
 * LocalStorage persistence layer for AI Study OS.
 * Manages user library, analytics, focus history, and theme settings.
 */

const STORAGE_KEYS = {
  USER_STATS: 'study_os_user_stats',
  LIBRARY: 'study_os_library',
  MISSIONS: 'study_os_daily_missions',
  SETTINGS: 'study_os_settings',
  ANALYTICS: 'study_os_analytics',
};

// Initial default user state (starts at 0 as requested)
const DEFAULT_STATS = {
  totalStudyTimeMs: 0,
  cardsMastered: 0,
  quizzesCompleted: 0,
  averageAccuracy: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

const DEFAULT_SETTINGS = {
  theme: 'dark', // 'dark' or 'light'
  fontSize: 'medium',
  learningStyle: 'visual',
  difficulty: 'medium',
};

const DEFAULT_MISSIONS = [
  { id: 'm1', text: 'Generate 1 Study Deck or Summary', completed: false, category: 'study' },
  { id: 'm2', text: 'Master 10 Flashcards in Study Session', completed: false, category: 'flashcards' },
  { id: 'm3', text: 'Score 80%+ on a Knowledge Quiz', completed: false, category: 'quiz' },
  { id: 'm4', text: 'Complete a 25-min Focus Pomodoro Session', completed: false, category: 'focus' },
];

/**
 * Gets saved stats or returns defaults
 */
export function getUserStats() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_STATS);
    return data ? { ...DEFAULT_STATS, ...JSON.parse(data) } : DEFAULT_STATS;
  } catch (e) {
    return DEFAULT_STATS;
  }
}

/**
 * Updates stats in LocalStorage
 */
export function saveUserStats(newStats) {
  const updated = { ...getUserStats(), ...newStats };
  try {
    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(updated));
  } catch (e) {}
  autoCheckMissions();
  return updated;
}

/**
 * Record mastered flashcards
 */
export function recordCardsMastered(count = 1) {
  const current = getUserStats();
  const updated = {
    ...current,
    cardsMastered: (current.cardsMastered || 0) + count,
  };
  saveUserStats(updated);
  autoCheckMissions();
  return updated;
}

/**
 * Record quiz completion & accuracy
 */
export function recordQuizResult(scorePercent, wrongQuestions = []) {
  const current = getUserStats();
  const totalQuizzes = (current.quizzesCompleted || 0) + 1;
  const currentAvg = current.averageAccuracy || 0;
  const newAvg = Math.round((currentAvg * (totalQuizzes - 1) + scorePercent) / totalQuizzes);

  const updated = {
    ...current,
    quizzesCompleted: totalQuizzes,
    averageAccuracy: newAvg,
    lastQuizScore: scorePercent,
    lastWrongQuestions: wrongQuestions,
  };
  saveUserStats(updated);
  autoCheckMissions();
  return updated;
}

/**
 * Gets saved wrong questions from user's recent quiz session
 */
export function getLastWrongQuestions() {
  const stats = getUserStats();
  return stats.lastWrongQuestions || [];
}

/**
 * Clears saved wrong questions from user stats
 */
export function clearLastWrongQuestions() {
  const stats = getUserStats();
  const updated = { ...stats, lastWrongQuestions: [] };
  saveUserStats(updated);
  return updated;
}

/**
 * Record study time from focus sessions (in ms)
 */
export function recordStudyTime(additionalMs) {
  const current = getUserStats();
  const updated = {
    ...current,
    totalStudyTimeMs: (current.totalStudyTimeMs || 0) + additionalMs,
  };
  saveUserStats(updated);
  autoCheckMissions();
  return updated;
}

/**
 * Gets user library items (automatically filtering out legacy Web URL items)
 */
export function getLibraryItems() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LIBRARY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    
    // Purge any legacy items associated with Web URL or URL imports
    const cleaned = parsed.filter((item) => {
      const title = (item.title || '').toLowerCase();
      const subject = (item.subject || '').toLowerCase();
      const type = (item.type || '').toLowerCase();
      return (
        !title.includes('web article') &&
        !title.includes('http:') &&
        !title.includes('https:') &&
        !subject.includes('http') &&
        type !== 'url'
      );
    });

    if (cleaned.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(cleaned));
    }

    return cleaned;
  } catch (e) {
    return [];
  }
}

/**
 * Adds an item to user library
 */
export function saveToLibrary(item) {
  const items = getLibraryItems();
  const newItem = {
    id: 'item_' + Date.now(),
    createdAt: new Date().toISOString(),
    ...item,
  };
  const updated = [newItem, ...items];
  try {
    localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(updated));
  } catch (e) {}
  autoCheckMissions();
  return updated;
}

/**
 * Deletes a single item from user library history by ID
 */
export function deleteLibraryItem(id) {
  const items = getLibraryItems();
  const updated = items.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(updated));
  } catch (e) {}
  return updated;
}

/**
 * Clears all items in user library history
 */
export function clearLibraryItems() {
  try {
    localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify([]));
  } catch (e) {}
  return [];
}

/**
 * Automatically checks and updates daily learning checklist missions based on user usage
 */
export function autoCheckMissions() {
  const stats = getUserStats();
  const library = getLibraryItems();
  const missions = getRawMissions();

  let modified = false;

  const updated = missions.map((m) => {
    let completed = m.completed;

    if (m.id === 'm1') {
      if (library.length > 0) completed = true;
    } else if (m.id === 'm2') {
      if (stats.cardsMastered >= 10 || (stats.cardsMastered > 0 && library.length > 0)) completed = true;
    } else if (m.id === 'm3') {
      if (stats.lastQuizScore >= 80 || stats.quizzesCompleted > 0) completed = true;
    } else if (m.id === 'm4') {
      if (stats.totalStudyTimeMs >= 15 * 60 * 1000) completed = true;
    }

    if (completed !== m.completed) modified = true;
    return { ...m, completed };
  });

  if (modified) {
    try {
      localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(updated));
    } catch (e) {}
  }
  return updated;
}

function getRawMissions() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MISSIONS);
    return data ? JSON.parse(data) : DEFAULT_MISSIONS;
  } catch (e) {
    return DEFAULT_MISSIONS;
  }
}

/**
 * Gets daily missions state (automatically updated based on user usage)
 */
export function getDailyMissions() {
  return autoCheckMissions();
}

/**
 * Toggle mission completion status
 */
export function toggleMission(missionId) {
  const missions = getDailyMissions();
  const updated = missions.map((m) => {
    if (m.id === missionId) {
      return { ...m, completed: !m.completed };
    }
    return m;
  });

  try {
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(updated));
  } catch (e) {}
  return { updatedMissions: updated };
}

/**
 * Gets user settings
 */
export function getSettings() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Updates settings
 */
export function saveSettings(newSettings) {
  const updated = { ...getSettings(), ...newSettings };
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  } catch (e) {}
  return updated;
}
