import React from "react";
import { useExtract } from "../context/ExtractContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Loader2 } from "lucide-react";

export default function BackgroundProgress() {
  const { isLoading } = useExtract();
  const location = useLocation();
  const navigate = useNavigate();

  // Only show if loading, and not on the Home extraction page (where the big checklist is visible)
  if (!isLoading || location.pathname === "/") return null;

  return (
    <button
      onClick={() => navigate("/")}
      type="button"
      className="fixed bottom-6 right-6 z-40 glass-panel hover:border-indigo-500/50 hover:bg-[#121426] rounded-2xl p-4 flex items-center space-x-3 cursor-pointer shadow-[0_12px_40px_rgba(99,102,241,0.25)] border border-indigo-500/20 animate-pulse text-left transition-all duration-300"
    >
      <div className="bg-indigo-600/20 p-2.5 rounded-xl border border-indigo-500/30 flex items-center justify-center">
        <Sparkles className="w-4.5 h-4.5 text-indigo-400 animate-spin duration-5000" />
      </div>
      <div>
        <p className="text-xs font-bold text-indigo-300 flex items-center space-x-1.5">
          <span>AI Task Extraction</span>
          <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">Processing notes in background...</p>
      </div>
    </button>
  );
}
