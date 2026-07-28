import * as React from "react";

import { cn } from "../lib/cn";

type CardMotion = "none" | "enter";
type CardGroupMotion = "none" | "stagger";
type CardGroupColumns = 1 | 2 | 3 | 4;

interface CardProps extends React.ComponentProps<"div"> {
  motion?: CardMotion;
}

interface CardGroupProps extends React.ComponentProps<"div"> {
  columns?: CardGroupColumns;
  motion?: CardGroupMotion;
}

const cardGroupColumns: Record<CardGroupColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

function Card({ className, motion = "none", ...props }: CardProps) {
  return (
    <div
      data-lumen-motion={motion === "enter" ? "card-enter" : undefined}
      data-motion={motion === "enter" ? motion : undefined}
      data-slot="card"
      className={cn(
        "flex flex-col gap-4 rounded-none border border-lumen-border bg-lumen-surface py-5 text-lumen-foreground shadow-lumen-card",
        className,
      )}
      {...props}
    />
  );
}

function CardGroup({ className, columns = 3, motion = "none", ...props }: CardGroupProps) {
  return (
    <div
      data-columns={columns}
      data-lumen-motion={motion === "stagger" ? "card-stagger" : undefined}
      data-slot="card-group"
      className={cn(
        "grid min-w-0 gap-0 overflow-hidden border-l border-t border-lumen-border bg-lumen-surface [&>[data-slot=card]]:rounded-none [&>[data-slot=card]]:border-0 [&>[data-slot=card]]:border-r [&>[data-slot=card]]:border-b [&>[data-slot=card]]:border-lumen-border [&>[data-slot=card]]:shadow-none",
        cardGroupColumns[columns],
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("grid gap-1.5 px-5", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-lg font-semibold leading-tight", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-lumen-muted-foreground", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-5", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-3 px-5", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardGroup,
  CardHeader,
  CardTitle,
  type CardGroupColumns,
  type CardGroupMotion,
  type CardGroupProps,
  type CardMotion,
  type CardProps,
};
