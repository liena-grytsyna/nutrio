import type { HTMLAttributes } from 'react';
import './GlassCard.scss';

type GlassCardProps = HTMLAttributes<HTMLDivElement>;

export function GlassCard({ className, ...props }: GlassCardProps) {
  const cardClassName = ['glass-card', className].filter(Boolean).join(' ');

  return <div className={cardClassName} {...props} />;
}
