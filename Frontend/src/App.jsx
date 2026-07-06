import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import BackgroundProgress from "./components/BackgroundProgress";
import HomePage from "./pages/HomePage";
import TaskListPage from "./pages/TaskListPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: "glass-panel text-slate-100 border border-white/10",
          style: {
            background: "rgba(13, 14, 28, 0.95)",
            color: "#f1f5f9",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
          },
          success: {
            iconTheme: {
              primary: "#6366f1",
              secondary: "#fff",
            },
          },
        }}
      />
      
      {/* Floating Background Progress Indicator */}
      <BackgroundProgress />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks" element={<TaskListPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      
      {/* Footer */}
      <footer className="py-6 border-t border-white/5 text-center text-xs text-slate-600 font-medium">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} TaskFlow AI • Direct LLM MERN Implementation</p>
        </div>
      </footer>
    </div>
  );
}
