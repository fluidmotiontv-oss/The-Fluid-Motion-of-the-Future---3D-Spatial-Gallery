import React, { useState, useEffect } from 'react';
import { getDragon9Time, Dragon9Time } from '../utils/dragon9Time';
import { Clock } from 'lucide-react';

export const Dragon9ClockComponent: React.FC = () => {
  const [d9Time, setD9Time] = useState<Dragon9Time>(() => getDragon9Time());

  useEffect(() => {
    const timer = setInterval(() => {
      setD9Time(getDragon9Time());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/60 border border-neutral-800 text-[10px] font-mono text-cyan-400 shadow-inner">
      <Clock className="w-3 h-3 text-cyan-500 animate-pulse" />
      <span className="tracking-widest">
        {d9Time.isIntermission 
          ? <span className="text-amber-400 animate-pulse">{d9Time.formatted}</span>
          : d9Time.formatted
        }
      </span>
    </div>
  );
};
