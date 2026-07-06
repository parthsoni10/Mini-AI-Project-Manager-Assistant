import React, { useState } from "react";
import { Sparkles } from "lucide-react";

export default function NoteInput({ onSubmit, isLoading }) {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    try {
      await onSubmit(text);
      setText("");
    } catch (error) {
      console.error("Extraction failed in NoteInput:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
          placeholder="Paste your unstructured meeting notes or daily updates here...&#10;For example:&#10;- Parth needs to finish the login page by July 10. High priority.&#10;- Riya should review the API documentation by end of week.&#10;- Arjun: Complete DB migration by July 8."
          rows={8}
          className="w-full p-4 rounded-2xl glass-input text-slate-100 placeholder-slate-500 font-sans text-base transition-all duration-200 resize-y focus:outline-none"
        />
        <div className="absolute bottom-3 right-4 text-xs text-slate-500 font-mono">
          {text.length} characters
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="glow-btn flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isLoading ? "AI is Extracting Tasks..." : "Extract Tasks with AI"}</span>
        </button>
      </div>
    </form>
  );
}
