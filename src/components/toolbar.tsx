"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

type ToolbarOrientation = "horizontal" | "vertical";

const toolbarVariants = cva(
  "relative flex min-w-0 rounded-lumen-toolbar border transition-[background-color,border-color,box-shadow] focus-within:border-lumen-primary motion-reduce:transition-none",
  {
    variants: {
      variant: {
        surface: "border-lumen-border bg-lumen-surface shadow-lumen-control",
        subtle: "border-transparent bg-lumen-surface-muted shadow-none",
        plain: "rounded-none border-transparent bg-transparent shadow-none focus-within:border-transparent",
      },
      density: {
        compact: "gap-1 p-1.5",
        comfortable: "gap-2 p-2",
      },
    },
    defaultVariants: {
      variant: "surface",
      density: "comfortable",
    },
  },
);

const toolbarGroupVariants = cva("flex min-w-0 flex-wrap items-center", {
  variants: {
    variant: {
      default: "gap-1",
      segmented: "isolate gap-0 rounded-lumen-button",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const ToolbarContext = React.createContext<ToolbarOrientation>("horizontal");

const toolbarFocusableSelector = [
  "button",
  "a[href]",
  "input",
  "select",
  "textarea",
  "[tabindex]",
].join(",");

function getToolbarItems(toolbar: HTMLDivElement): HTMLElement[] {
  return Array.from(toolbar.querySelectorAll<HTMLElement>(toolbarFocusableSelector)).filter(
    (element) =>
      element.closest('[role="toolbar"]') === toolbar &&
      !element.matches(":disabled") &&
      element.getAttribute("aria-hidden") !== "true" &&
      !element.closest("[hidden], [inert]"),
  );
}

function setToolbarTabStop(toolbar: HTMLDivElement, nextItem?: HTMLElement) {
  const items = getToolbarItems(toolbar);
  if (items.length === 0) return;

  const currentItem = items.find((item) => item.dataset.toolbarTabStop === "true");
  const tabStop = nextItem && items.includes(nextItem) ? nextItem : currentItem ?? items[0];

  for (const item of items) {
    const isTabStop = item === tabStop;
    item.tabIndex = isTabStop ? 0 : -1;
    if (isTabStop) item.dataset.toolbarTabStop = "true";
    else delete item.dataset.toolbarTabStop;
  }
}

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

type ToolbarVariantProps = VariantProps<typeof toolbarVariants>;

export interface ToolbarProps
  extends Omit<React.ComponentProps<"div">, "role">,
    ToolbarVariantProps {
  loop?: boolean;
  orientation?: ToolbarOrientation;
}

const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  (
    {
      children,
      className,
      density,
      loop = true,
      onFocus,
      onKeyDown,
      orientation = "horizontal",
      variant,
      ...props
    },
    forwardedRef,
  ) => {
    const toolbarRef = React.useRef<HTMLDivElement | null>(null);

    const setRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        toolbarRef.current = node;
        assignRef(forwardedRef, node);
        if (node) setToolbarTabStop(node);
      },
      [forwardedRef],
    );

    React.useEffect(() => {
      if (toolbarRef.current) setToolbarTabStop(toolbarRef.current);
    }, [children]);

    const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
      onFocus?.(event);
      if (!event.defaultPrevented && toolbarRef.current) {
        setToolbarTabStop(toolbarRef.current, event.target as HTMLElement);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || !toolbarRef.current) return;

      const items = getToolbarItems(toolbarRef.current);
      const currentIndex = items.indexOf(event.target as HTMLElement);
      if (currentIndex < 0) return;

      const isRtl = window.getComputedStyle(toolbarRef.current).direction === "rtl";
      const previousKey = orientation === "vertical" ? "ArrowUp" : isRtl ? "ArrowRight" : "ArrowLeft";
      const nextKey = orientation === "vertical" ? "ArrowDown" : isRtl ? "ArrowLeft" : "ArrowRight";

      let nextIndex: number | undefined;
      if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = items.length - 1;
      else if (event.key === previousKey) nextIndex = currentIndex - 1;
      else if (event.key === nextKey) nextIndex = currentIndex + 1;

      if (nextIndex === undefined) return;
      if (loop) nextIndex = (nextIndex + items.length) % items.length;
      else nextIndex = Math.max(0, Math.min(items.length - 1, nextIndex));

      event.preventDefault();
      const nextItem = items[nextIndex];
      setToolbarTabStop(toolbarRef.current, nextItem);
      nextItem?.focus();
    };

    return (
      <ToolbarContext.Provider value={orientation}>
        <div
          ref={setRef}
          role="toolbar"
          aria-orientation={orientation === "vertical" ? "vertical" : undefined}
          data-slot="toolbar"
          data-variant={variant ?? "surface"}
          data-density={density ?? "comfortable"}
          data-orientation={orientation}
          className={cn(
            toolbarVariants({ density, variant }),
            orientation === "vertical"
              ? "flex-col items-stretch"
              : "flex-row flex-wrap items-center",
            variant === "plain" && "p-0",
            className,
          )}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {children}
        </div>
      </ToolbarContext.Provider>
    );
  },
);

Toolbar.displayName = "Toolbar";

type ToolbarGroupVariantProps = VariantProps<typeof toolbarGroupVariants>;

export interface ToolbarGroupProps
  extends React.ComponentProps<"div">,
    ToolbarGroupVariantProps {}

function ToolbarGroup({ className, variant, ...props }: ToolbarGroupProps) {
  return (
    <div
      role="group"
      data-slot="toolbar-group"
      data-variant={variant ?? "default"}
      className={cn(toolbarGroupVariants({ variant }), className)}
      {...props}
    />
  );
}

function ToolbarItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="toolbar-item"
      className={cn("flex min-w-0 shrink-0 items-center", className)}
      {...props}
    />
  );
}

function ToolbarLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="toolbar-label"
      className={cn(
        "shrink-0 px-1 text-xs font-semibold uppercase tracking-[0.08em] text-lumen-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export interface ToolbarSeparatorProps extends React.ComponentProps<"span"> {
  orientation?: ToolbarOrientation;
}

function ToolbarSeparator({ className, orientation, ...props }: ToolbarSeparatorProps) {
  const toolbarOrientation = React.useContext(ToolbarContext);
  const resolvedOrientation = orientation ?? (toolbarOrientation === "vertical" ? "horizontal" : "vertical");

  return (
    <span
      role="separator"
      aria-orientation={resolvedOrientation}
      data-slot="toolbar-separator"
      data-orientation={resolvedOrientation}
      className={cn(
        "shrink-0 bg-lumen-border",
        resolvedOrientation === "vertical" ? "mx-1 h-6 w-px" : "my-1 h-px w-full",
        className,
      )}
      {...props}
    />
  );
}

function ToolbarSpacer({ className, ...props }: React.ComponentProps<"span">) {
  const orientation = React.useContext(ToolbarContext);
  return (
    <span
      data-slot="toolbar-spacer"
      aria-hidden="true"
      className={cn(orientation === "vertical" ? "min-h-2 flex-1" : "min-w-2 flex-1", className)}
      {...props}
    />
  );
}

export {
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  ToolbarLabel,
  ToolbarSeparator,
  ToolbarSpacer,
  toolbarGroupVariants,
  toolbarVariants,
  type ToolbarGroupVariantProps,
  type ToolbarOrientation,
  type ToolbarVariantProps,
};
