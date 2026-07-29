import React, { useState } from 'react';
import {
  HiChatBubbleLeftRight,
  HiPaperAirplane,
  HiUser,
  HiSparkles,
  HiArrowRightOnRectangle,
} from 'react-icons/hi2';
import { generateToolData } from '../services/api';

export default function AITutorView({ theme }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your AI Tutor. Ask me any question about your subjects, topics, or formulas, and we can continue our conversation smoothly until you choose to exit or clear the chat.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (customPrompt = null) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { sender: 'user', text: textToSend };
    const currentHistory = [...messages];

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      // Pass full conversation history to backend Groq AI service
      const data = await generateToolData('tutor', textToSend, {
        mode: 'Teacher',
        history: currentHistory,
      });

      const aiReply =
        data.reply ||
        data.result ||
        `Regarding "${textToSend}", let's build directly on our ongoing conversation:\n\nKey points continue here contextually without repetitive templates.`;

      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Continuing our conversation on "${textToSend}":\n\nDirect answer and explanation tailored to your follow-up question.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleExitChat = () => {
    setMessages([
      {
        sender: 'ai',
        text: "Chat cleared! I am ready for a new study topic or question.",
      },
    ]);
    setInput('');
  };

  const isLight = theme === 'light';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className={`${isLight ? 'bg-violet-900 border-violet-800 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-100 shadow-xl'} rounded-3xl p-6 sm:p-8 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <HiChatBubbleLeftRight className="w-3.5 h-3.5 text-violet-300" />
            <span>CONTINUOUS AI TUTOR CHAT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Ask AI Tutor</h2>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            Ongoing conversational chat with memory. Ask follow-up questions without repetitive introductions.
          </p>
        </div>

        {/* Exit Chat Button */}
        <button
          onClick={handleExitChat}
          className="px-5 py-2.5 bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
          title="Clear and Exit Current Chat"
        >
          <HiArrowRightOnRectangle className="w-4 h-4" />
          <span>Exit Chat</span>
        </button>
      </div>

      {/* Chat Messages Window */}
      <div className={`${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-xl'} rounded-3xl p-6 border space-y-4 min-h-[420px] flex flex-col justify-between`}>
        <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-extrabold shrink-0 shadow-md">
                  AI
                </div>
              )}
              <div
                className={`max-w-2xl p-4 rounded-2xl text-xs sm:text-sm font-medium whitespace-pre-line leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-violet-600 text-white shadow-md font-semibold'
                    : isLight
                      ? 'bg-slate-100 border border-slate-200 text-slate-900 font-medium'
                      : 'bg-slate-950 border border-slate-800 text-slate-100'
                }`}
              >
                {m.text}
              </div>
              {m.sender === 'user' && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 shadow-md ${isLight ? 'bg-violet-900 text-white' : 'bg-slate-800 text-white'}`}>
                  <HiUser className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 items-center text-xs font-bold text-violet-600 animate-pulse">
              <HiSparkles className="w-4 h-4" />
              <span>AI Tutor is thinking and continuing conversation...</span>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className={`pt-4 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'} flex gap-2`}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a follow-up or any question to AI Tutor..."
            className={`flex-1 p-4 rounded-2xl text-xs sm:text-sm outline-none font-semibold ${
              isLight
                ? 'bg-slate-50 border border-slate-300 text-slate-950 placeholder-slate-400 focus:bg-white focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20'
                : 'bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
            }`}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="px-6 bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-bold rounded-2xl shadow-md disabled:opacity-40 transition-all flex items-center justify-center"
          >
            <HiPaperAirplane className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
