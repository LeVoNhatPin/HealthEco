import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  intensity?: number;
  blur?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  hoverEffect?: boolean;
}

export function GlassCard({ 
  children, 
  className, 
  intensity = 0.1, 
  blur = 'lg', 
  hoverEffect = false,
  ...props 
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl shadow-lg',
        hoverEffect && 'hover:bg-white/20 transition-all duration-300',
        className
      )}
      style={{ 
        backgroundColor: `rgba(255, 255, 255, ${intensity})`,
        backdropFilter: `blur(${blur === 'sm' ? '4px' : blur === 'md' ? '8px' : blur === 'lg' ? '12px' : blur === 'xl' ? '16px' : blur === '2xl' ? '24px' : '32px'})`
      }}
      {...props}
    >
      {children}
    </div>
  );
}