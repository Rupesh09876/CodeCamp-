import { Shield, Lock } from 'lucide-react';

export const BadgeCard = ({ name, description, earned, icon: Icon = Shield }) => {
  return (
    <div className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all group ${
      earned
        ? 'border-slate-700 bg-[var(--color-card)] hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-900/10'
        : 'border-dashed border-slate-800 bg-slate-900/50 opacity-50'
    }`}>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 relative ${
        earned ? 'bg-indigo-900/30 text-indigo-400' : 'bg-slate-800 text-slate-600'
      }`}>
        {earned ? <Icon className="h-7 w-7" /> : <Lock className="h-5 w-5" />}
        {earned && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-[var(--color-card)]">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      <h4 className={`font-semibold text-sm mb-0.5 ${earned ? 'text-white' : 'text-slate-500'}`}>{name}</h4>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );
};

export default BadgeCard;
