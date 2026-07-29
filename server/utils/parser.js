import { z } from 'zod';

/**
 * Zod Schema for Flashcards and Quiz Data
 * Ensures AI responses match exact expected structure before returning to React.
 */
const FlashcardSchema = z.object({
  question: z.string().min(1, 'Question must not be empty'),
  answer: z.string().min(1, 'Answer must not be empty'),
});

const QuizItemSchema = z.object({
  question: z.string().min(1, 'Question must not be empty'),
  options: z.array(z.string()).min(2, 'At least 2 options required'),
  answer: z.string().min(1, 'Answer must not be empty'),
  explanation: z.string().optional().default('No explanation provided.'),
});

export const StudyMaterialSchema = z.object({
  flashcards: z.array(FlashcardSchema).min(1, 'At least 1 flashcard required'),
  quiz: z.array(QuizItemSchema).min(1, 'At least 1 quiz question required'),
});

/**
 * Sanitizes AI string output and validates JSON against Zod schema.
 * @param {string} rawText Raw AI response text
 * @returns {object} Validated study material payload
 */
export function parseAndValidateAIResponse(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty response received from AI model');
  }

  // Clean markdown backticks if AI wrapped response in ```json ... ```
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  }

  // Attempt JSON parsing
  let parsedJson;
  try {
    parsedJson = JSON.parse(cleaned);
  } catch (parseError) {
    throw new Error('AI generated malformed JSON text');
  }

  // Validate against Zod schema
  const validationResult = StudyMaterialSchema.safeParse(parsedJson);

  if (!validationResult.success) {
    const issueMessages = validationResult.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`AI response structure validation failed: ${issueMessages}`);
  }

  return validationResult.data;
}
