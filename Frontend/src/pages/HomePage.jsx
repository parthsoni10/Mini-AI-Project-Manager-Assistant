import React from "react";
import { useNavigate } from "react-router-dom";
import NoteInput from "../components/NoteInput";
import { useExtract } from "../context/ExtractContext";
import { ArrowRight, Sparkles, Layers, Calendar, User } from "lucide-react";
import GeminiProgress from "../components/GeminiProgress";

export default function HomePage() {
  const { isLoading, extractedTasks, extractTasks } = useExtract();
  const navigate = useNavigate();

  const handleExtract = (rawText) => {
    return extractTasks(rawText);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "No Deadline";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const priorityColors = {
    High: "bg-rose-500/10 text-rose-400 border-rose-500/25",
    Medium: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    Low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10 px-4">
      {/* Intro Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Powered by AI</span>
        </div>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-100 tracking-tight leading-tight text-glow">
          Turn Meeting Notes into <br />
          <span className="text-gradient">Actionable Tasks</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Paste unstructured transcripts or standup notes. Our AI automatically extracts tasks, assigns owners, predicts deadlines, and gauges priority instantly.
        </p>
      </div>

      {/* Input Form Panel */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative">
        <NoteInput onSubmit={handleExtract} isLoading={isLoading} />
      </div>

      {/* Beautiful Animated AI Loader */}
      {isLoading && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 flex justify-center items-center shadow-[0_15px_40px_rgba(99,102,241,0.15)] border-indigo-500/20 animate-in fade-in zoom-in-95 duration-350">
          <GeminiProgress />
        </div>
      )}

      {/* Results Preview */}
      {!isLoading && extractedTasks.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-350">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-2">
            <div>
              <h2 className="text-xl font-display font-semibold text-slate-100">Extracted Tasks Preview</h2>
              <p className="text-slate-400 text-xs mt-1">Review the tasks extracted from this meeting log</p>
            </div>
            <button
              onClick={() => navigate("/tasks")}
              type="button"
              className="flex items-center space-x-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer group"
            >
              <span>Go to Task Dashboard</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {extractedTasks.map((task) => (
              <div key={task._id} className="glass-panel rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priorityColors[task.priority] || priorityColors.Medium}`}>
                    {task.priority} Priority
                  </span>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
                    Saved to DB
                  </span>
                </div>
                <h3 className="text-slate-200 font-medium text-sm leading-relaxed break-words font-sans">
                  {task.description}
                </h3>
                <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-white/5">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3 text-slate-500" />
                    <span>Owner: <strong className="text-slate-300 font-medium">{task.owner}</strong></span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>Due: <strong className="text-slate-300 font-medium">{formatDate(task.dueDate)}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => navigate("/tasks")}
              type="button"
              className="glow-btn flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-lg cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Go to Main Task Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
