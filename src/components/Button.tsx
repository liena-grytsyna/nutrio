import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "../lib/cn";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps =
  | (ButtonHTMLAttributes<HTMLButtonElement> & {
      href?: never;
      variant?: ButtonVariant;
    })
  | (AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
      variant?: ButtonVariant;
    });

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const buttonClassName = cn(styles.button, styles[`button--${variant}`], className);

  if ("href" in props) {
    const { href, ...anchorProps } = props;

    return (
      <a
        className={buttonClassName}
        href={href}
        {...(anchorProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    );
  }

  const { type = "button", ...buttonProps } = props;

  return (
    <button
      className={buttonClassName}
      type={type}
      {...buttonProps}
    />
  );
}
