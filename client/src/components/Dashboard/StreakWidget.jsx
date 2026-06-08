import { Flame } from 'lucide-react';

export const StreakWidget = ({ streak }) => {
  const isHot = streak >= 7;
  
  return (
    <div className={`p-6 rounded-xl border flex flex-col items-center justify-center relative overflow-hidden ${isHot ? 'border-orange-500 bg-orange-900 bg-opacity-20' : 'border-[var(--color-muted)] border-opacity-20 bg-[var(--color-card-bg)]'}`}>
      {isHot && (
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          {/* Subtle fire animation overlay would go here */}
          <div className="w-full h-full bg-gradient-to-t from-orange-600 to-transparent"></div>
        </div>
      )}
      
      <div className="relative z-10 text-center">
        <Flame className={`h-12 w-12 mx-auto mb-2 ${isHot ? 'text-orange-500 animate-pulse' : 'text-gray-500'}`} />
        <div className="flex items-baseline justify-center gap-1">
          <span className={`text-4xl font-extrabold ${isHot ? 'text-orange-400' : 'text-white'}`}>{streak}</span>
        </div>
        <span className="text-[var(--color-muted)] text-sm font-medium uppercase tracking-wider mt-1 block">
          Day Streak
        </span>
        
        {isHot && (
          <div className="mt-2 text-xs font-bold text-orange-400 bg-orange-500 bg-opacity-20 px-2 py-1 rounded-full inline-block">
            ON FIRE!
          </div>
        )}
      </div>
    </div>
  );
};

export default StreakWidget;
