import React from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Home } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center space-y-6">
      <div className="bg-indigo-600/10 p-5 rounded-3xl border border-indigo-500/20 inline-flex items-center justify-center">
        <Bot className="w-16 h-16 text-indigo-400" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-100 text-glow">404 — Page Not Found</h1>
        <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
          The dashboard URL you visited doesn't exist. Let's get you back to the home page.
        </p>
      </div>
      <button
        onClick={() => navigate("/")}
        type="button"
        className="glow-btn flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer"
      >
        <Home className="w-4 h-4" />
        <span>Go Back Home</span>
      </button>
    </div>
  );
}
