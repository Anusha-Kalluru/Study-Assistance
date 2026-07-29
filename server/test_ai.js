import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

async function testGroqJSON() {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const topic = 'RAG (Retrieval Augmented Generation)';

  const prompt = `System: You are an expert AI professor. Generate highly accurate, deep, comprehensive flashcards and quiz questions for the topic: "${topic}".
Return ONLY valid JSON matching this schema:
{
  "flashcards": [
    { "question": "Deep specific question about ${topic}", "answer": "Detailed precise answer" }
  ],
  "quiz": [
    {
      "question": "Specific question about ${topic}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Exact matching option",
      "explanation": "Detailed explanation"
    }
  ]
}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    response_format: { type: 'json_object' },
  });

  console.log('Result for RAG:\n', completion.choices[0]?.message?.content);
}

testGroqJSON();
