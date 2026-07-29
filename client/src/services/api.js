/**
 * Service module for API communication with Node.js backend.
 */

const API_BASE_URL = '/api';

/**
 * Sends study notes to backend to generate flashcards and quiz.
 */
export async function generateStudyMaterial(notes, signal) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notes }),
      signal,
    });

    const rawText = await response.text();
    let result = {};
    if (rawText && rawText.trim().startsWith('{')) {
      try {
        result = JSON.parse(rawText);
      } catch (e) {}
    }

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to generate study material. Please try again.');
    }

    return result.data;
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('API Service Error:', error);
    throw new Error(error.message || 'Network error occurred while communicating with backend.');
  }
}

/**
 * Sends subject & parameters to backend to generate custom study schedule.
 */
export async function generateStudyPlan(subject, hours = 3, days = 5, examDate = null) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate/planner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject, hours, days, examDate }),
    });

    const rawText = await response.text();
    let result = {};
    if (rawText && rawText.trim().startsWith('{')) {
      try {
        result = JSON.parse(rawText);
      } catch (e) {}
    }

    if (result.success && Array.isArray(result.schedule) && result.schedule.length > 0) {
      return result.schedule;
    }

    // High-yield fallback schedule if server is restarting
    const h = `${hours} hrs`;
    return [
      { day: 'Day 1: Foundations', focus: `${subject}: Core Principles & Definitions`, hours: h },
      { day: 'Day 2: Architecture', focus: `${subject}: System Mechanisms & Workflows`, hours: h },
      { day: 'Day 3: Deep Dive', focus: `${subject}: Advanced Applications & Formulas`, hours: h },
      { day: 'Day 4: Self-Testing', focus: `${subject}: Practice Quiz & Weak Area Remediation`, hours: h },
      { day: 'Day 5: Exam Prep', focus: `${subject}: Comprehensive Revision & Final Takeaways`, hours: h },
    ];
  } catch (error) {
    console.error('API Planner Error:', error);
    const h = `${hours} hrs`;
    return [
      { day: 'Day 1: Foundations', focus: `${subject}: Core Principles & Definitions`, hours: h },
      { day: 'Day 2: Architecture', focus: `${subject}: System Mechanisms & Workflows`, hours: h },
      { day: 'Day 3: Deep Dive', focus: `${subject}: Advanced Applications & Formulas`, hours: h },
      { day: 'Day 4: Self-Testing', focus: `${subject}: Practice Quiz & Weak Area Remediation`, hours: h },
      { day: 'Day 5: Exam Prep', focus: `${subject}: Comprehensive Revision & Final Takeaways`, hours: h },
    ];
  }
}

/**
 * Sends tool request (Summary, Mindmap, Tutor, Roadmap) to backend.
 */
export async function generateToolData(type, notes, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate/tool`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, notes, options }),
    });

    const rawText = await response.text();
    let result = {};
    if (rawText && rawText.trim().startsWith('{')) {
      try {
        result = JSON.parse(rawText);
      } catch (e) {}
    }

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to process tool request.');
    }

    return result.data;
  } catch (error) {
    console.error('API Tool Error:', error);
    throw error;
  }
}
