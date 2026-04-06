"use client";

import React, { useEffect, useState, useRef } from "react";

const ProcessingModal = ({ message = "Processing Request", isSubmitting= true }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const intervalRef = useRef(null);

  const steps = [
    "Validating data",
    "Creating user",
    "Processing payment",
    "Finalizing setup",
  ];

  useEffect(() => {
    if (!isSubmitting) {
      setProgress(0);
      setCurrentStep(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Reset when starting submission
    setProgress(0);
    setCurrentStep(0);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1.5; // smoother increment

        if (next >= 100) {
          clearInterval(intervalRef.current);
          return 100;
        }

        // Update step based on progress
        const newStep = Math.min(
          Math.floor((next / 100) * steps.length),
          steps.length - 1
        );
        setCurrentStep(newStep);

        return next;
      });
    }, 80); // Slightly faster and smoother

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSubmitting, steps.length]);

  if (!isSubmitting) return null;

  // Circle calculations
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl px-8 py-8 w-[340px] flex flex-col items-center border border-gray-100 dark:border-gray-800">
        
        {/* Circular Progress */}
        <div className="relative mb-6">
          <svg width="100" height="100" className="-rotate-90">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="7"
              fill="transparent"
              className="dark:stroke-gray-700"
            />

            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#2563eb"
              strokeWidth="7"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-150 ease-linear"
            />
          </svg>

          {/* Center Percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.floor(progress)}%
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-6">
          {message}
        </h3>

        {/* Steps */}
        <div className="w-full space-y-3 mb-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 text-sm transition-all duration-200 ${
                index === currentStep
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : index < currentStep
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all ${
                  index === currentStep
                    ? "bg-blue-600 dark:bg-blue-400 scale-125"
                    : index < currentStep
                    ? "bg-emerald-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
              <span>{step}</span>
            </div>
          ))}
        </div>

        {/* Footer Warning */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Please don’t close this tab or refresh the page
        </p>
      </div>
    </div>
  );
};

export default ProcessingModal;