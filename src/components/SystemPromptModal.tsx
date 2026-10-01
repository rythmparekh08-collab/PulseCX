import React, { useState } from 'react';
import { NOVA_SYSTEM_PROMPT } from '../prompts/novaSystemPrompt';

interface SystemPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemPromptModal: React.FC<SystemPromptModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(NOVA_SYSTEM_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 sm:p-8 text-white shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                Orchestration Layer
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Nova AI Assistant System Prompt
            </h2>
            <p className="text-xs text-slate-400">
              Paste this prompt directly into your backend LLM orchestration layer (LangChain, LlamaIndex, OpenAI Assistant API, or Gemini System Instructions).
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Prompt Body */}
        <div className="flex-1 overflow-y-auto my-4 bg-slate-950 rounded-2xl p-4 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
          {NOVA_SYSTEM_PROMPT}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 shrink-0">
          <div className="text-xs text-slate-400">
            Enforces Empathy First, Strict Scope Boundaries, and Senior Support Escalations.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <span>✓</span>
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <span>📋</span>
                  <span>Copy System Prompt</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs px-4 py-2.5 rounded-xl transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SystemPromptModal;
