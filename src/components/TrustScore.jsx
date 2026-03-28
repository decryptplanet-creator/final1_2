import { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function TrustScoreGauge({ 
  initialScore, 
  finalScore, 
  size = 'md',
  showAnimation = true 
}) {
  const { isDarkMode } = useTheme();
  const [currentScore, setCurrentScore] = useState(initialScore);
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeClasses = {
    sm: { container: 'size-24', text: 'text-xl', subtext: 'text-xs' },
    md: { container: 'size-32', text: 'text-3xl', subtext: 'text-sm' },
    lg: { container: 'size-40', text: 'text-4xl', subtext: 'text-base' }
  };

  const { container, text, subtext } = sizeClasses[size];

  useEffect(() => {
    if (showAnimation && finalScore !== initialScore) {
      setIsAnimating(true);
      const duration = 1500; // 1.5 seconds
      const steps = 30;
      const increment = (finalScore - initialScore) / steps;
      const stepDuration = duration / steps;

      let step = 0;
      const interval = setInterval(() => {
        step++;
        if (step >= steps) {
          setCurrentScore(finalScore);
          setIsAnimating(false);
          clearInterval(interval);
        } else {
          setCurrentScore(Math.round(initialScore + increment * step));
        }
      }, stepDuration);

      return () => clearInterval(interval);
    } else {
      setCurrentScore(finalScore);
    }
  }, [initialScore, finalScore, showAnimation]);

  // Calculate circle properties
  const radius = size === 'sm' ? 40 : size === 'md' ? 56 : 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  // Determine color based on score
  const getColor = (score) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const color = getColor(currentScore);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg 
          className={`${container} -rotate-90 ${isAnimating ? 'animate-pulse' : ''}`}
          viewBox="0 0 160 160"
        >
          {/* Background Circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={isDarkMode ? '#374151' : '#e5e7eb'}
            strokeWidth="12"
            fill="none"
          />
          
          {/* Progress Circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={color}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: showAnimation ? 'stroke-dashoffset 0.5s ease-out, stroke 0.3s ease-out' : 'none'
            }}
          />
        </svg>
        
        {/* Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`${text} font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
            {currentScore}
          </div>
          <div className={`${subtext} ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            / 100
          </div>
        </div>
      </div>
      
      <p className={`mt-2 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Trust Score
      </p>
    </div>
  );
}
/* This file displays a trust score gauge (circular progress UI) with animation to show user reliability or rating.

It is web-based (React frontend component) but can also be used for both web & app (if adapted to mobile UI frameworks). */