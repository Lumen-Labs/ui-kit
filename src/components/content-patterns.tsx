import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

function AvatarGroup({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="avatar-group"
      className={cn("flex list-none items-center pl-2", className)}
      {...props}
    />
  );
}

function AvatarGroupItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="avatar-group-item"
      className={cn(
        "-ml-2 flex rounded-full border-2 border-lumen-surface",
        className,
      )}
      {...props}
    />
  );
}

const calloutVariants = cva(
  "grid gap-1 border-l-4 bg-lumen-surface-muted px-4 py-3 text-sm text-lumen-foreground",
  {
    variants: {
      variant: {
        neutral: "border-lumen-border",
        info: "border-lumen-primary",
        warning: "border-lumen-warning",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

interface CalloutProps
  extends Omit<React.ComponentProps<"aside">, "title">,
    VariantProps<typeof calloutVariants> {
  title?: React.ReactNode;
}

function Callout({ children, className, title, variant, ...props }: CalloutProps) {
  return (
    <aside
      data-slot="callout"
      className={cn(calloutVariants({ variant }), className)}
      {...props}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      <div>{children}</div>
    </aside>
  );
}

function SummaryList({ className, ...props }: React.ComponentProps<"dl">) {
  return (
    <dl
      data-slot="summary-list"
      className={cn("divide-y divide-lumen-border", className)}
      {...props}
    />
  );
}

function SummaryRow({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="summary-row"
      className={cn(
        "grid gap-1 py-3 sm:grid-cols-[minmax(8rem,1fr)_minmax(0,2fr)_auto] sm:gap-4",
        className,
      )}
      {...props}
    />
  );
}

function SummaryTerm({ className, ...props }: React.ComponentProps<"dt">) {
  return (
    <dt
      data-slot="summary-term"
      className={cn("text-sm font-semibold text-lumen-foreground", className)}
      {...props}
    />
  );
}

function SummaryDetails({ className, ...props }: React.ComponentProps<"dd">) {
  return (
    <dd
      data-slot="summary-details"
      className={cn("m-0 text-sm text-lumen-muted-foreground", className)}
      {...props}
    />
  );
}

function SummaryActions({ className, ...props }: React.ComponentProps<"dd">) {
  return (
    <dd
      data-slot="summary-actions"
      className={cn("m-0 flex flex-wrap items-start gap-2 text-sm sm:justify-end", className)}
      {...props}
    />
  );
}

function TaskList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="task-list"
      className={cn("list-none divide-y divide-lumen-border", className)}
      {...props}
    />
  );
}

type TaskStatusTone = "neutral" | "primary" | "success" | "danger";

interface TaskListItemProps
  extends Omit<React.ComponentProps<"li">, "title"> {
  href: string;
  title: React.ReactNode;
  hint?: React.ReactNode;
  status: React.ReactNode;
  statusTone?: TaskStatusTone;
  linkProps?: Omit<React.ComponentProps<"a">, "children" | "href">;
}

function TaskListItem({
  className,
  hint,
  href,
  linkProps,
  status,
  statusTone = "neutral",
  title,
  ...props
}: TaskListItemProps) {
  const generatedId = React.useId();
  const hintId = hint ? `${generatedId}-hint` : undefined;
  const statusId = `${generatedId}-status`;
  const describedBy = [hintId, statusId].filter(Boolean).join(" ");

  return (
    <li
      data-slot="task-list-item"
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-3",
        className,
      )}
      {...props}
    >
      <div className="grid min-w-0 gap-1">
        <a
          href={href}
          aria-describedby={describedBy}
          className="w-fit rounded-sm font-semibold text-lumen-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumen-focus"
          {...linkProps}
        >
          {title}
        </a>
        {hint ? (
          <span id={hintId} className="text-sm text-lumen-muted-foreground">
            {hint}
          </span>
        ) : null}
      </div>
      <span
        id={statusId}
        data-status={statusTone}
        className={cn(
          "h-fit rounded-full border border-lumen-border bg-lumen-surface-muted px-2 py-0.5 text-xs font-semibold text-lumen-foreground",
          statusTone === "primary" && "border-lumen-primary text-lumen-primary",
          statusTone === "success" && "border-lumen-success text-lumen-success",
          statusTone === "danger" && "border-lumen-danger text-lumen-danger",
        )}
      >
        {status}
      </span>
    </li>
  );
}

interface TruncateProps extends React.ComponentProps<"span"> {
  lines?: 1 | 2 | 3;
}

function Truncate({ className, lines = 1, ...props }: TruncateProps) {
  return (
    <span
      data-slot="truncate"
      data-lines={lines}
      className={cn(
        "block min-w-0 overflow-hidden",
        lines === 1 && "truncate",
        lines === 2 && "line-clamp-2",
        lines === 3 && "line-clamp-3",
        className,
      )}
      {...props}
    />
  );
}

export {
  AvatarGroup,
  AvatarGroupItem,
  Callout,
  SummaryActions,
  SummaryDetails,
  SummaryList,
  SummaryRow,
  SummaryTerm,
  TaskList,
  TaskListItem,
  Truncate,
  calloutVariants,
  type CalloutProps,
  type TaskListItemProps,
  type TruncateProps,
};
