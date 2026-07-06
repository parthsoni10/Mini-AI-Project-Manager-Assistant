import React, { useState } from "react";
import { Calendar, User, Trash2, Edit2, ChevronDown, ChevronUp } from "lucide-react";

export default function TaskCard({ task, onEdit, onDelete }) {
  const [showSource, setShowSource] = useState(false);

  const priorityColors = {
    High: "bg-rose-500/10 text-rose-400 border-rose-500/25",
    Medium: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    Low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
  };

  const statusColors = {
    Todo: "bg-slate-500/10 text-slate-400 border-slate-500/25",
    "In Progress": "bg-blue-500/10 text-blue-400 border-blue-500/25",
    Done: "bg-emerald-500/15 text-emerald-400 border-emerald-500/35"
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

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Badges row */}
        <div className="flex items-center justify-between">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priorityColors[task.priority] || priorityColors.Medium}`}>
            {task.priority} Priority
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColors[task.status] || statusColors.Todo}`}>
            {task.status}
          </span>
        </div>

        {/* Task description */}
        <h3 className="text-slate-100 font-medium text-base leading-relaxed break-words font-sans">
          {task.description}
        </h3>
      </div>

      <div className="space-y-3 pt-2 border-t border-white/5">
        {/* Details row (Owner & Due Date) */}
        <div className="flex flex-wrap gap-y-2 justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>Owner: <strong className="text-slate-300 font-medium">{task.owner || "Unassigned"}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Due: <strong className="text-slate-300 font-medium">{formatDate(task.dueDate)}</strong></span>
          </div>
        </div>

        {/* Source Text Accordion */}
        {task.sourceText && (
          <div className="text-xs">
            <button
              onClick={() => setShowSource(!showSource)}
              type="button"
              className="flex items-center space-x-1 text-slate-500 hover:text-slate-400 focus:outline-none transition-colors cursor-pointer"
            >
              <span>{showSource ? "Hide AI Source Notes" : "View AI Source Notes"}</span>
              {showSource ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {showSource && (
              <div className="mt-2 p-2.5 rounded-xl bg-slate-950/50 border border-white/5 text-slate-400 italic font-mono text-[11px] leading-normal break-words">
                "{task.sourceText}"
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2 pt-1 border-t border-white/5">
          <button
            onClick={() => onEdit(task)}
            type="button"
            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
            title="Edit Task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            type="button"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
