import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Bot, Layers, Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="glass-panel sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 cursor-pointer group">
            <div className="bg-indigo-600/20 p-2 rounded-xl border border-indigo-500/30 flex items-center justify-center group-hover:border-indigo-400/50 transition-colors">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-gradient text-glow">
              TaskFlow AI
            </span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                }`
              }
              title="Extract Tasks"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Extract</span>
            </NavLink>
            
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                }`
              }
              title="Task Dashboard"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Tasks</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
