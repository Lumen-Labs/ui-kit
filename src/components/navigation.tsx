import * as React from "react";

import { cn } from "../lib/cn";

interface BreadcrumbsProps extends React.ComponentProps<"nav"> {
  listClassName?: string;
}

function Breadcrumbs({ children, className, listClassName, ...props }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className} {...props}>
      <ol data-slot="breadcrumbs" className={cn("flex flex-wrap items-center gap-2 text-sm", listClassName)}>{children}</ol>
    </nav>
  );
}

interface BreadcrumbItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  href?: string;
  current?: boolean;
}

function BreadcrumbItem({ children, className, current, href, ...props }: BreadcrumbItemProps) {
  return (
    <li className={cn("flex items-center gap-2", className)} {...props}>
      {href && !current ? <a href={href} className="rounded-sm font-medium text-lumen-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumen-focus">{children}</a> : <span aria-current={current ? "page" : undefined}>{children}</span>}
      {!current ? <span aria-hidden="true">/</span> : null}
    </li>
  );
}

interface PaginationProps extends React.ComponentProps<"nav"> { listClassName?: string; }

function Pagination({ children, className, listClassName, ...props }: PaginationProps) {
  return <nav aria-label="Pagination" className={className} {...props}><ul data-slot="pagination" className={cn("flex flex-wrap items-center gap-1", listClassName)}>{children}</ul></nav>;
}

interface PaginationItemProps extends React.LiHTMLAttributes<HTMLLIElement> { href: string; current?: boolean; }

function PaginationItem({ children, className, current, href, ...props }: PaginationItemProps) {
  return <li className={className} {...props}><a href={href} aria-current={current ? "page" : undefined} className={cn("inline-flex size-10 items-center justify-center rounded-lumen-control border border-transparent text-sm font-semibold outline-none hover:bg-lumen-surface-muted focus-visible:ring-2 focus-visible:ring-lumen-focus", current && "border-lumen-primary bg-lumen-surface-muted")}>{children}</a></li>;
}

function Steps({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol data-slot="steps" className={cn("grid gap-3 sm:grid-flow-col", className)} {...props} />;
}

interface StepProps extends React.LiHTMLAttributes<HTMLLIElement> { status?: "upcoming" | "current" | "complete" | "error"; }

function Step({ className, status = "upcoming", ...props }: StepProps) {
  return <li data-slot="step" data-status={status} aria-current={status === "current" ? "step" : undefined} className={cn("border-l-4 border-lumen-border pl-3 text-sm text-lumen-muted-foreground sm:border-l-0 sm:border-t-4 sm:pl-0 sm:pt-3", status === "current" && "border-lumen-primary font-semibold text-lumen-foreground", status === "complete" && "border-lumen-success text-lumen-foreground", status === "error" && "border-lumen-danger text-lumen-danger", className)} {...props} />;
}

function SkipLink({ className, ...props }: React.ComponentProps<"a">) {
  return <a className={cn("fixed left-3 top-3 z-[100] -translate-y-20 rounded-lumen-control bg-lumen-primary px-4 py-2 font-semibold text-lumen-on-primary outline-none transition-transform focus:translate-y-0 motion-reduce:transition-none", className)} {...props} />;
}

function ButtonGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="group" className={cn("flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center", className)} {...props} />;
}

export {
  BreadcrumbItem,
  Breadcrumbs,
  ButtonGroup,
  Pagination,
  PaginationItem,
  SkipLink,
  Step,
  Steps,
  type BreadcrumbItemProps,
  type BreadcrumbsProps,
  type PaginationItemProps,
  type PaginationProps,
  type StepProps,
};

export {
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  ToolbarLabel,
  ToolbarSeparator,
  ToolbarSpacer,
  type ToolbarGroupProps,
  type ToolbarProps,
  type ToolbarSeparatorProps,
} from "./toolbar";
