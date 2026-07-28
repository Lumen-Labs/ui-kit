import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

const alertVariants = cva(
  "grid gap-1 rounded-lumen-surface border border-l-4 bg-lumen-surface p-4 text-sm text-lumen-foreground",
  {
    variants: {
      variant: {
        info: "border-lumen-primary",
        success: "border-lumen-success",
        warning: "border-lumen-warning",
        danger: "border-lumen-danger",
      },
    },
    defaultVariants: { variant: "info" },
  },
);

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof alertVariants> {
  title?: React.ReactNode;
}

function Alert({ children, className, role, title, variant, ...props }: AlertProps) {
  return (
    <div
      role={role ?? (variant === "danger" ? "alert" : "status")}
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      <div>{children}</div>
    </div>
  );
}

const badgeVariants = cva(
  "inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        neutral:
          "border-lumen-border bg-lumen-surface-muted text-lumen-foreground",
        primary:
          "border-lumen-primary bg-lumen-primary text-lumen-on-primary",
        success: "border-lumen-success text-lumen-success",
        warning: "border-lumen-warning text-lumen-warning",
        danger: "border-lumen-danger text-lumen-danger",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

function Progress({ className, ...props }: React.ComponentProps<"progress">) {
  return (
    <progress
      data-slot="progress"
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-lumen-surface-muted accent-lumen-primary",
        className,
      )}
      {...props}
    />
  );
}

interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string;
}

function Spinner({ className, label = "Loading", ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      data-slot="spinner"
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className="size-4 animate-spin rounded-full border-2 border-lumen-border border-t-lumen-primary motion-reduce:animate-none"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-lumen-control bg-lumen-surface-muted motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}

interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
}

function EmptyState({
  children,
  className,
  description,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <section
      data-slot="empty-state"
      className={cn(
        "mx-auto grid max-w-lg justify-items-center gap-3 py-10 text-center",
        className,
      )}
      {...props}
    >
      <h2 className="text-xl font-semibold text-lumen-foreground">{title}</h2>
      {description ? (
        <p className="text-sm text-lumen-muted-foreground">{description}</p>
      ) : null}
      {children ? <div className="mt-2 flex flex-wrap justify-center gap-2">{children}</div> : null}
    </section>
  );
}

function Separator({ className, ...props }: React.ComponentProps<"hr">) {
  return <hr className={cn("border-0 border-t border-lumen-border", className)} {...props} />;
}

interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: "neutral" | "success" | "warning" | "danger";
}

function StatusIndicator({ children, className, status = "neutral", ...props }: StatusIndicatorProps) {
  return <span data-slot="status-indicator" className={cn("inline-flex items-center gap-2 text-sm", className)} {...props}><span aria-hidden="true" className={cn("size-2 rounded-full bg-lumen-muted-foreground", status === "success" && "bg-lumen-success", status === "warning" && "bg-lumen-warning", status === "danger" && "bg-lumen-danger")} />{children}</span>;
}

const Banner = Alert;
const Tag = Badge;

export {
  Alert,
  Badge,
  Banner,
  EmptyState,
  Progress,
  Separator,
  Skeleton,
  Spinner,
  StatusIndicator,
  Tag,
  alertVariants,
  badgeVariants,
  type BadgeProps,
  type EmptyStateProps,
  type StatusIndicatorProps,
};
