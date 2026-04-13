import React from 'react';
import { cn } from '@/src/lib/utils';

interface ShinyTextProps {
  text: string;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({ text, className }) => {
  return (
    <div className={cn("relative inline-block px-4 py-1 font-bold text-white bg-dz-green rounded-full overflow-hidden", className)}>
      <span className="relative z-10">{text}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shiny_2s_infinite]" />
    </div>
  );
};
