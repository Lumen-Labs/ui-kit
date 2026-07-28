import * as React from "react";

import { cn } from "../lib/cn";

type LayoutGap = "none" | "xs" | "sm" | "md" | "lg";

interface LayoutPrimitiveProps extends React.ComponentProps<"div"> {
  gap?: LayoutGap;
}

const layoutGaps: Record<LayoutGap, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6", className)} {...props} />;
}

function Stack({ className, gap = "md", ...props }: LayoutPrimitiveProps) {
  return <div data-gap={gap} data-slot="stack" className={cn("flex flex-col", layoutGaps[gap], className)} {...props} />;
}

function Inline({ className, gap, ...props }: LayoutPrimitiveProps) {
  return <div data-gap={gap ?? "default"} data-slot="inline" className={cn("flex flex-wrap items-center", gap ? layoutGaps[gap] : "gap-3", className)} {...props} />;
}

function Grid({ className, gap = "md", ...props }: LayoutPrimitiveProps) {
  return <div data-gap={gap} data-slot="grid" className={cn("grid", layoutGaps[gap], className)} {...props} />;
}

function VisuallyHidden({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("sr-only", className)} {...props} />;
}

export { Container, Grid, Inline, Stack, VisuallyHidden, type LayoutGap, type LayoutPrimitiveProps };
