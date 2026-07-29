import express from 'express';
import { generateStudyMaterial, generateExtendedToolData, generateStudyPlan } from '../services/groq.js';

const router = express.Router();

/**
 * POST /api/generate
 * Accepts study notes or topic and returns accurate, topic-tailored flashcards and quiz items.
 */
router.post('/generate', async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes || typeof notes !== 'string' || notes.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a topic or paste study notes before generating.',
      });
    }

    const data = await generateStudyMaterial(notes.trim());

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error in /api/generate route:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while generating study material.',
    });
  }
});

/**
 * POST /api/generate/tool
 * Handles specialized requests: summary, mindmap, tutor, roadmap dynamically for the topic
 */
router.post('/generate/tool', async (req, res) => {
  try {
    const { type, notes, options } = req.body;

    if (!notes || typeof notes !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid topic or text.',
      });
    }

    const data = await generateExtendedToolData(type, notes.trim(), options || {});

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error in /api/generate/tool route:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while processing tool request.',
    });
  }
});

/**
 * POST /api/generate/planner
 * Generates custom study plan for any subject and exam date
 */
router.post('/generate/planner', async (req, res) => {
  try {
    const { subject, hours, days, examDate } = req.body;

    if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a subject name.',
      });
    }

    const schedule = await generateStudyPlan(subject.trim(), days || 5, hours || 3, examDate);

    return res.status(200).json({
      success: true,
      schedule,
    });
  } catch (error) {
    console.error('Error in /api/generate/planner route:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while generating study schedule.',
    });
  }
});

export default router;
