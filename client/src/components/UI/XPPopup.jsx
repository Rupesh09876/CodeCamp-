import { useEffect, useState } from 'react';

export const XPPopup = ({ amount, onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 right-10 z-50 animate-[slideUpFade_2.5s_ease-out_forwards] pointer-events-none">
      <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white px-6 py-3 rounded-full shadow-lg shadow-[var(--color-primary)]/40 flex items-center gap-2 border border-white/20 font-bold text-xl">
        <span className="text-yellow-300">✨</span>
        +{amount} XP
      </div>
    </div>
  );
};

export default XPPopup;
