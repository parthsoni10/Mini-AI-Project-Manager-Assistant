import React from "react";
import { Download } from "lucide-react";

export default function ExportButton({ filters }) {
  const handleExport = () => {
    const params = new URLSearchParams();
    if (filters.owner && filters.owner !== "All") {
      params.append("owner", filters.owner);
    }
    if (filters.status && filters.status !== "All") {
      params.append("status", filters.status);
    }
    if (filters.priority && filters.priority !== "All") {
      params.append("priority", filters.priority);
    }

    // Trigger browser download via URL redirect
    window.location.href = `/api/tasks/export/csv?${params.toString()}`;
  };

  return (
    <button
      onClick={handleExport}
      type="button"
      className="flex items-center space-x-1.5 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm cursor-pointer"
    >
      <Download className="w-4 h-4" />
      <span>Export CSV</span>
    </button>
  );
}
