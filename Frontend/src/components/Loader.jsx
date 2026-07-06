import React from "react";

export default function Loader({ size = "md", text = "" }) {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className={`rounded-full absolute inset-0 animate-ping opacity-20 bg-indigo-500 ${
          size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-14 h-14' : 'w-24 h-24'
        }`}></div>
        
        {/* Inner rotating ring */}
        <div className={`${sizeClasses[size]} rounded-full border-indigo-500 border-t-transparent animate-spin`}></div>
      </div>
      {text && (
        <p className="text-slate-400 text-sm font-medium animate-pulse tracking-wide text-glow">
          {text}
        </p>
      )}
    </div>
  );
}