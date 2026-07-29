# AI-Powered Study Assistant 📚✨

A modern, full-stack web application built with **React (Vite)** and **Node.js (Express)** that transforms study notes or topics into interactive **3D-flipping flashcards** and **multiple-choice quizzes** using Google Gemini AI and strict **Zod schema validation**.

Designed with a clean, premium SaaS aesthetic inspired by **Linear**, **Notion**, and **Vercel**.

---

## 🌟 Key Features

- ⚡ **AI-Powered Material Generation**: Converts raw study notes into structured flashcards and quizzes using Google's Gemini API.
- 🛡️ **Strict Zod Schema Validation**: Backend validates AI response payload structure before returning to React. Zero invalid JSON reaching the frontend.
- 🎴 **3D Interactive Flashcards**: Smooth CSS 3D flip animation, pagination, active card counters (`Card 3 / 10`), and linear progress indicators.
- 📝 **Interactive Multiple-Choice Quiz**: One-question-at-a-time quiz flow, instant correct/incorrect feedback, highlighted answers, and detailed explanations.
- 📊 **Results & Performance Analytics**: Circular SVG percentage score indicator, correct/wrong question counters.
- 🔄 **Retest Wrong Answers**: Automatically generates a targeted retry quiz containing only questions answered incorrectly.
- 🚫 **Race Condition Prevention**: Client uses `AbortController` to cancel pending fetch requests if notes are re-submitted rapidly.
- 🎨 **Premium Modern Design**: Soft gradient background (`#fafafa` → `#eef4ff` → `#dfe8ff`), Indigo primary brand accent (`#5B5FEF`), white cards with soft shadows, responsive typography.

---

## 🏗️ Folder Structure

```text
flam_anusha/
├── client/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── src/
│       ├── index.css
│       ├── main.jsx
│       ├── App.jsx
│       ├── pages/
│       │   └── Home.jsx
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── StudyForm.jsx
│       │   ├── Flashcard.jsx
│       │   ├── FlashcardList.jsx
│       │   ├── Quiz.jsx
│       │   ├── QuizQuestion.jsx
│       │   ├── Result.jsx
│       │   ├── Loading.jsx
│       │   ├── ErrorCard.jsx
│       │   ├── EmptyState.jsx
│       │   ├── ProgressBar.jsx
│       │   └── Tabs.jsx
│       ├── services/
│       │   └── api.js
│       └── utils/
│           └── helpers.js
├── server/
│   ├── package.json
│   ├── .env.example
│   ├── .env
│   ├── index.js
│   ├── routes/
│   │   └── generate.js
│   ├── services/
│   │   └── gemini.js
│   └── utils/
│       └── parser.js
└── README.md
```

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS (with custom 3D perspective utility classes)
- **Icons**: React Icons (`react-icons/hi2`, `react-icons/hi`)
- **API Communication**: Native Fetch API with `AbortController`

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **AI SDK**: `@google/genai` (Google Gemini API)
- **Validation**: Zod (`zod`)
- **Utilities**: CORS, Dotenv

---

## 🛠️ Installation & Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Clone & Setup Backend
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file from .env.example
cp .env.example .env
```

Edit `server/.env` to add your Gemini API Key:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```
> *Note*: If `GEMINI_API_KEY` is not set or empty, the backend automatically uses a smart offline fallback generator so you can test all features without interruption.

Start the backend server:
```bash
npm run dev
# Server will run on http://localhost:5000
```

### 2. Setup & Run Frontend
```bash
# In a new terminal window, navigate to client directory
cd client

# Install dependencies
npm install

# Start Vite development server
npm run dev
# App will open at http://localhost:3000
```

---

## 🤖 How AI is Used

1. **User Request**: User inputs notes or a topic into the text area.
2. **System Prompt**: Sent to Gemini API (`gemini-2.5-flash`) with strict instructions to output raw JSON adhering strictly to:
   ```json
   {
     "flashcards": [
       { "question": "...", "answer": "..." }
     ],
     "quiz": [
       { "question": "...", "options": ["...", "..."], "answer": "...", "explanation": "..." }
     ]
   }
   ```
3. **Zod Validation**: `server/utils/parser.js` strips markdown fences and validates payload via `StudyMaterialSchema.safeParse()`.
4. **Error Catching**: If validation fails or malformed output is received, server responds with `422 Unprocessable Entity` or triggers fallback generation.

---

## 💡 Code Design & Interview Considerations

- **Single Responsibility Principle**: Every component (`Flashcard`, `QuizQuestion`, `ProgressBar`, `Tabs`, `Result`) focuses on a single role.
- **Readable & Clean JSX**: Avoided deep nesting, complex prop drilling, or over-engineered custom hooks.
- **Race Condition Prevention**: Implemented `AbortController` in `Home.jsx` to abort pending fetches when user re-submits notes quickly.
- **Accessible UI**: Includes explicit `aria-label`, visible keyboard focus indicators (`focus:ring-2`), and semantic HTML elements.

---

## ⏱️ Time Spent & Limitations

- **Time Spent**: ~3.5 hours total (Architecture design, Zod schema setup, Tailwind 3D flip styling, React component modularization, and error handling).
- **Known Limitations**:
  - Offline mode uses fallback mock questions when no API key is provided.
  - Large study notes (>10,000 characters) are truncated for API rate limit efficiency.

---

## 🔮 Future Improvements

- Save study sets to `localStorage` for offline review.
- Export flashcards as PDF or Anki format.
- Spaced repetition algorithm (e.g. Leitner system) for flashcard scheduling.
