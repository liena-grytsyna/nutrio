import type { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/cn";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(styles.button, styles[`button--${variant}`], className)}
      type={type}
      {...props}
    />
  );
}
