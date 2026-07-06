import React, { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, Circle, Loader2 } from "lucide-react";

export default function GeminiProgress() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "Connecting to AI Engine...", duration: 2000 },
    { label: "AI is parsing your text and resolving relative dates...", duration: 2500 },
    { label: "Creating meeting history entry in MongoDB Atlas...", duration: 2000 },
    { label: "Validating schema configurations with Zod...", duration: 1500 },
    { label: "Structuring tasks and finalizing database insertions...", duration: 2000 }
  ];

  useEffect(() => {
    let timer;
    const runAnimation = (stepIndex) => {
      if (stepIndex >= steps.length) return;
      timer = setTimeout(() => {
        setCurrentStep(stepIndex + 1);
        runAnimation(stepIndex + 1);
      }, steps[stepIndex].duration);
    };

    runAnimation(0);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Calculate overall percentage
  const percentage = Math.min(((currentStep + 0.5) / steps.length) * 100, 95);

  return (
    <div className="w-full space-y-6">
      {/* AI Pulse Circle */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="relative p-5 bg-indigo-500/10 border border-indigo-500/30 rounded-full animate-pulse shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <Sparkles className="w-8 h-8 text-indigo-400 animate-spin duration-10000" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-slate-100 tracking-wide text-glow">
            AI Extraction Pipeline
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Please wait while we structure your meeting log</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950/80 rounded-full h-2 overflow-hidden border border-white/5 relative">
        <div 
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Stages Checklist */}
      <div className="space-y-3 pt-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div 
              key={index} 
              className={`flex items-start space-x-3 p-3 rounded-2xl border transition-all duration-300 ${
                isActive 
                  ? "bg-indigo-500/5 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.05)]" 
                  : isCompleted 
                  ? "bg-emerald-500/5 border-emerald-500/15" 
                  : "bg-transparent border-transparent opacity-40"
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <div className="space-y-0.5">
                <p className={`text-xs font-semibold tracking-wide ${
                  isActive ? "text-indigo-300" : isCompleted ? "text-emerald-400/90" : "text-slate-500"
                }`}>
                  Stage {index + 1}: {isCompleted ? "Success" : isActive ? "Processing..." : "Pending"}
                </p>
                <p className={`text-[13px] leading-snug ${
                  isActive ? "text-slate-200 font-medium" : isCompleted ? "text-slate-400" : "text-slate-600"
                }`}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
