import type { ButtonHTMLAttributes } from 'react';
import './Button.scss';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  className,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const buttonClassName = className
    ? `button button--${variant} ${className}`
    : `button button--${variant}`;

  return <button className={buttonClassName} type={type} {...props} />;
}
