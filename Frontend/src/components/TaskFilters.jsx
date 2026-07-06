import React from "react";
import { Filter } from "lucide-react";

export default function TaskFilters({ filters, onFilterChange, ownersList = [] }) {
  const handleChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center space-x-2 text-slate-300 font-medium">
        <Filter className="w-4.5 h-4.5 text-indigo-400" />
        <span className="text-sm">Filter Tasks:</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
        {/* Status Filter */}
        <div className="flex flex-col space-y-1">
          <select
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-white/5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex flex-col space-y-1">
          <select
            value={filters.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-white/5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Owner Filter */}
        <div className="flex flex-col space-y-1">
          <select
            value={filters.owner}
            onChange={(e) => handleChange("owner", e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-white/5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer min-w-[130px]"
          >
            <option value="All">All Owners</option>
            {ownersList.filter(o => o && o !== "Unassigned").map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
            <option value="Unassigned">Unassigned</option>
          </select>
        </div>
      </div>
    </div>
  );
}
