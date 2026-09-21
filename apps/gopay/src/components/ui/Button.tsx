import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "link";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-gopay text-white hover:bg-gopay-deep",
  secondary: "bg-white text-ink border border-line hover:border-ink/30",
  ghost: "bg-transparent text-ink hover:bg-surface",
  danger: "bg-danger-tint text-danger hover:bg-danger/10",
  link: "bg-transparent text-gopay underline-offset-2 hover:underline px-0",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-[15px]",
  lg: "px-5 py-3.5 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gopay focus-visible:ring-offset-2 disabled:opacity-40";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button type="button" className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  to,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  to: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link to={to} className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </Link>
  );
}
