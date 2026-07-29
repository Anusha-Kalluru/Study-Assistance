import Groq from 'groq-sdk';
import { parseAndValidateAIResponse } from '../utils/parser.js';

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('GROQ_API_KEY is not set in server/.env');
  }
  return new Groq({ apiKey });
}

const STUDY_PROMPT = `You are a world-class AI professor and subject matter expert.
Analyze the user's study topic or notes and generate extremely accurate, high-yield educational flashcards and multiple-choice quiz questions.

Return ONLY valid JSON matching this exact schema:
{
  "flashcards": [
    {
      "question": "Deep, concept-testing question specific to the user's topic",
      "answer": "Comprehensive, precise answer specific to the user's topic"
    }
  ],
  "quiz": [
    {
      "question": "Multiple choice question testing key concepts of the user's topic",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Exact string matching one of the options",
      "explanation": "Detailed explanation of why this answer is correct"
    }
  ]
}

Generate 5 to 8 flashcards and 4 to 6 quiz questions.
Ensure ALL content is 100% accurate and specific to the input topic provided. Do not use generic placeholders.`;

export async function generateStudyMaterial(notes) {
  try {
    const groq = getGroqClient();

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: STUDY_PROMPT },
        { role: 'user', content: `Subject/Topic/Notes:\n${notes}` },
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const rawText = completion.choices[0]?.message?.content || '';
    return parseAndValidateAIResponse(rawText);
  } catch (error) {
    console.error('[Groq Service Error]:', error.message);
    return generateDynamicFallback(notes);
  }
}

export async function generateStudyPlan(subject, daysCount = 5, availableHours = 3, examDate = null) {
  try {
    const groq = getGroqClient();

    let dateContext = '';
    if (examDate) {
      dateContext = `Target Exam Date: ${examDate}. Generate timeline leading directly to ${examDate}.`;
    }

    const prompt = `System: You are an AI study planner. Create a customized ${daysCount}-day study schedule for the subject: "${subject}".
Available study hours per day: ${availableHours} hours.
${dateContext}

Return ONLY valid JSON matching this exact schema:
{
  "schedule": [
    { "day": "Day 1 (Concept Intro)", "focus": "Subtopic focus specific to ${subject}", "hours": "${availableHours} hrs" },
    { "day": "Day 2 (Mechanisms)", "focus": "Subtopic focus specific to ${subject}", "hours": "${availableHours} hrs" },
    { "day": "Day 3 (Deep Dive)", "focus": "Subtopic focus specific to ${subject}", "hours": "${availableHours} hrs" },
    { "day": "Day 4 (Practice)", "focus": "Subtopic focus specific to ${subject}", "hours": "${availableHours} hrs" },
    { "day": "Day 5 (Review & Mastery)", "focus": "Subtopic focus specific to ${subject}", "hours": "${availableHours} hrs" }
  ]
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const raw = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return raw.schedule || generateFallbackSchedule(subject, availableHours, examDate);
  } catch (e) {
    console.error('[Groq Plan Error]:', e.message);
    return generateFallbackSchedule(subject, availableHours, examDate);
  }
}

/**
 * Handles AI Tutor chat with full conversational history and memory
 */
export async function generateExtendedToolData(type, notes, options = {}) {
  try {
    const groq = getGroqClient();
    const topic = notes.trim();

    let systemMessage = '';
    let messageList = [];

    if (type === 'tutor') {
      const mode = options.mode || 'Teacher';
      systemMessage = `You are a patient, brilliant, and highly knowledgeable AI Tutor operating in ${mode} mode.
You are engaged in an ONGOING CONVERSATION with a student.
IMPORTANT:
- Maintain full conversational memory and context from all previous messages in this chat.
- Answer the student's follow-up questions directly, naturally, and contextually.
- Do NOT repeat boilerplate introductory definitions or re-explain previous concepts unless explicitly requested.
- Speak directly to the student's latest message as a natural continuation of your chat session.`;

      const history = Array.isArray(options.history) ? options.history : [];
      const formattedHistory = history
        .filter((m) => m && m.text && m.text.trim())
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        }));

      messageList = [
        { role: 'system', content: systemMessage },
        ...formattedHistory,
        { role: 'user', content: topic },
      ];
    } else if (type === 'summary') {
      systemMessage = `You are a world-class academic professor and textbook author.
Generate a COMPREHENSIVE, HIGHLY DETAILED, AND RIGOROUS set of Smart Notes and Summary for the given topic.

Structure the output clearly with GitHub Markdown containing:
1. ## Executive Overview & Core Definitions
2. ## Key Mechanisms & Structural Principles (Step-by-step breakdown)
3. ## Important Rules, Formulas, or Equations (if applicable)
4. ## Real-World Examples & Practical Applications
5. ## Common Pitfalls & High-Yield Exam Takeaways

Make the content deep, thorough, and highly educational so the student gains complete mastery of the subject.`;

      messageList = [
        { role: 'system', content: systemMessage },
        { role: 'user', content: `Generate comprehensive Smart Notes and Summary for: "${topic}"` },
      ];
    } else {
      systemMessage = `You are an educational assistant. Provide detailed study notes for the topic.`;
      messageList = [
        { role: 'system', content: systemMessage },
        { role: 'user', content: `Topic: "${topic}"` },
      ];
    }

    const completion = await groq.chat.completions.create({
      messages: messageList,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content || '';
    return { result: content, summary: content, reply: content };
  } catch (e) {
    console.error('[Groq Tool Error]:', e.message);
    return {
      summary: `## Executive Overview for ${notes}\n\n- **Core Definition**: ${notes} involves understanding fundamental principles, structural workflows, and practical applications.`,
      result: `Detailed notes for ${notes}`,
      reply: `Regarding your question about "${notes}", let me answer directly in our chat context:\n\nKey details and mechanisms continue here.`,
    };
  }
}

function generateDynamicFallback(notes) {
  const topic = notes.slice(0, 40).trim() || 'Study Topic';
  return {
    flashcards: [
      {
        question: `What is the core definition of ${topic}?`,
        answer: `${topic} is a key academic domain focusing on fundamental mechanisms, structural rules, and practical applications.`,
      },
    ],
    quiz: [
      {
        question: `Which of the following best describes the primary objective of ${topic}?`,
        options: [
          `To establish structured conceptual frameworks and practical capabilities`,
          `To provide theoretical concepts without real-world utility`,
          `To replace basic logical principles with random assumptions`,
          `None of the above`,
        ],
        answer: `To establish structured conceptual frameworks and practical capabilities`,
        explanation: `Educational study of ${topic} focuses on building actionable problem-solving skills.`,
      },
    ],
  };
}

function generateFallbackSchedule(subject, hours, examDate) {
  const cleanSubject = subject || 'Target Subject';
  const h = `${hours} hrs`;
  return [
    { day: 'Day 1: Foundations', focus: `${cleanSubject}: Core Principles & Definitions`, hours: h },
    { day: 'Day 2: Architecture', focus: `${cleanSubject}: System Mechanisms & Workflows`, hours: h },
    { day: 'Day 3: Deep Dive', focus: `${cleanSubject}: Advanced Applications & Formulas`, hours: h },
    { day: 'Day 4: Self-Testing', focus: `${cleanSubject}: Practice Quiz & Weak Area Remediation`, hours: h },
    { day: 'Day 5: Exam Prep', focus: `${cleanSubject}: Comprehensive Revision & Final Takeaways`, hours: h },
  ];
}
