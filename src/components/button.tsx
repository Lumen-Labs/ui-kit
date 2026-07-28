import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

const buttonVariants = cva(
  "relative inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-lumen-button border text-sm font-semibold leading-none tracking-[-0.01em] outline-none transition-[background-color,border-color,color,box-shadow,transform] focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-lumen-focus focus-visible:ring-offset-2 focus-visible:ring-offset-lumen-background active:translate-y-px disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border-lumen-primary bg-lumen-primary text-lumen-on-primary shadow-lumen-button hover:border-lumen-primary-hover hover:bg-lumen-primary-hover active:shadow-lumen-button-pressed aria-pressed:border-lumen-primary-hover aria-pressed:bg-lumen-primary-hover aria-pressed:shadow-lumen-button-pressed",
        secondary:
          "border-lumen-control-border bg-lumen-action-secondary text-lumen-on-action-secondary shadow-lumen-button hover:border-lumen-muted-foreground hover:bg-lumen-action-secondary-hover active:shadow-lumen-button-pressed aria-pressed:border-lumen-primary aria-pressed:bg-lumen-action-secondary-hover aria-pressed:shadow-lumen-button-pressed",
        tertiary:
          "border-lumen-control-border bg-lumen-surface-muted text-lumen-foreground shadow-lumen-button hover:border-lumen-muted-foreground hover:bg-lumen-surface active:shadow-lumen-button-pressed aria-pressed:border-lumen-primary aria-pressed:bg-lumen-surface-muted aria-pressed:shadow-lumen-button-pressed",
        ghost:
          "border-transparent bg-transparent text-lumen-foreground shadow-none hover:border-lumen-control-border hover:bg-lumen-surface-muted aria-pressed:border-lumen-primary aria-pressed:bg-lumen-surface-muted aria-pressed:text-lumen-foreground aria-pressed:shadow-lumen-button-pressed",
        danger:
          "border-lumen-danger bg-lumen-danger text-lumen-on-danger shadow-lumen-button hover:brightness-90 active:shadow-lumen-button-pressed aria-pressed:brightness-90 aria-pressed:shadow-lumen-button-pressed",
      },
      size: {
        small: "h-9 px-3 text-sm [&_svg]:size-4",
        medium: "h-11 px-4 [&_svg]:size-[1.125rem]",
        large: "h-12 px-5 text-base [&_svg]:size-5",
        icon: "size-11 p-0 [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
    ButtonVariantProps {
  disabled?: boolean;
  isFullWidth?: boolean;
  isPending?: boolean;
  pendingLabel?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled = false,
      isFullWidth = false,
      isPending = false,
      pendingLabel = "Working…",
      size,
      type = "button",
      variant,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      data-slot="button"
      data-variant={variant ?? "primary"}
      data-size={size ?? "medium"}
      data-pending={isPending || undefined}
      aria-busy={isPending || undefined}
      disabled={disabled || isPending}
      className={cn(buttonVariants({ variant, size }), isFullWidth && "w-full", className)}
      {...props}
    >
      {isPending ? (
        <>
          <span
            data-slot="button-label"
            aria-hidden="true"
            className="invisible inline-flex items-center gap-2"
          >
            {children}
          </span>
          <span
            className="absolute inset-0 inline-flex items-center justify-center gap-2"
          >
            <span
              data-slot="button-spinner"
              aria-hidden="true"
              className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
            />
            <span data-slot="button-pending-label">{pendingLabel}</span>
          </span>
        </>
      ) : (
        children
      )}
    </button>
  ),
);

Button.displayName = "Button";

export { Button, buttonVariants, type ButtonVariantProps };
