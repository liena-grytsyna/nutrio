import type { HTMLAttributes } from 'react';
import './GlassCard.scss';

type GlassCardProps = HTMLAttributes<HTMLDivElement>;

export function GlassCard({ className, ...props }: GlassCardProps) {
  const cardClassName = className ? `glass-card ${className}` : 'glass-card';

  return <div className={cardClassName} {...props} />;
}
