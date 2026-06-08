export const XPBar = ({ currentXP, level, title }) => {
  // Logic to determine XP thresholds based on the backend LEVEL_THRESHOLDS
  // 0, 200, 500, 1000, 2000, 3500, 5000, 7500, 10000, 15000
  const thresholds = [0, 200, 500, 1000, 2000, 3500, 5000, 7500, 10000, 15000];
  const currentThreshold = thresholds[level - 1] || 0;
  const nextThreshold = thresholds[level] || thresholds[thresholds.length - 1];
  
  const xpInCurrentLevel = currentXP - currentThreshold;
  const xpNeededForNextLevel = nextThreshold - currentThreshold;
  const progressPercentage = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNextLevel) * 100));

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-3">
        <div>
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Level {level}</div>
          <div className="font-bold text-lg">{title}</div>
        </div>
        <div className="text-right">
          <span className="font-bold text-indigo-400 text-lg">{currentXP.toLocaleString()}</span>
          <span className="text-slate-500 text-sm"> / {nextThreshold.toLocaleString()} XP</span>
        </div>
      </div>
      
      <div className="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden relative">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-full rounded-full transition-all duration-1000 ease-out relative" 
          style={{ width: `${progressPercentage}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden rounded-full">
            <div className="w-[30%] h-full bg-white opacity-20 -skew-x-12 translate-x-[-150%] animate-[shine_3s_infinite]"></div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-slate-500 mt-2">
        <span>Level {level}</span>
        <span>{xpNeededForNextLevel - xpInCurrentLevel} XP to Level {level + 1}</span>
      </div>
    </div>
  );
};

export default XPBar;
