"use client";

import * as React from "react";

import { cn } from "../lib/cn";
import { Button, type ButtonProps } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./interactive";

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

const PromptComposer = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="prompt-composer"
      className={cn(
        "flex flex-col overflow-hidden rounded-lumen-composer border border-lumen-control-border bg-lumen-surface/90 shadow-[var(--lumen-shadow-card)] backdrop-blur-xl backdrop-saturate-150 transition-[background-color,border-color,box-shadow] focus-within:border-lumen-primary focus-within:ring-2 focus-within:ring-lumen-focus/30 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  ),
);

PromptComposer.displayName = "PromptComposer";

interface PromptComposerFieldProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "onSubmit"> {
  id: string;
  label: React.ReactNode;
  showLabel?: boolean;
  description?: React.ReactNode;
  error?: React.ReactNode;
  maxHeight?: number;
  submitOnEnter?: boolean;
  onSubmit?: (value: string) => void;
  containerClassName?: string;
}

const PromptComposerField = React.forwardRef<HTMLTextAreaElement, PromptComposerFieldProps>(
  (
    {
      className,
      containerClassName,
      defaultValue,
      description,
      error,
      id,
      label,
      maxHeight = 200,
      onChange,
      onKeyDown,
      onSubmit,
      rows = 1,
      showLabel = false,
      submitOnEnter = true,
      value,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    forwardedRef,
  ) => {
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
      String(defaultValue ?? ""),
    );
    const currentValue = value === undefined ? uncontrolledValue : String(value);

    const setRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node;
        assignRef(forwardedRef, node);
      },
      [forwardedRef],
    );

    const resize = React.useCallback(() => {
      const element = innerRef.current;
      if (!element) return;
      element.style.height = "auto";
      element.style.height = `${Math.min(element.scrollHeight, maxHeight)}px`;
    }, [maxHeight]);

    React.useEffect(() => {
      resize();
    }, [currentValue, resize]);

    const descriptionId = description ? `${id}-description` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy =
      [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div
        data-slot="prompt-composer-field"
        className={cn("grid gap-1.5 bg-transparent", containerClassName)}
      >
        <label
          htmlFor={id}
          className={cn(
            showLabel
              ? "px-4 pt-3 text-[0.8125rem] font-semibold leading-5 tracking-[-0.005em] text-lumen-foreground"
              : "sr-only",
          )}
        >
          {label}
        </label>
        {description ? (
          <p id={descriptionId} className="px-4 text-xs leading-5 text-lumen-muted-foreground">
            {description}
          </p>
        ) : null}
        <textarea
          ref={setRef}
          id={id}
          rows={rows}
          data-slot="prompt-composer-textarea"
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={cn(
            "min-h-[4.5rem] w-full resize-none bg-transparent px-3.5 pb-2 pt-3 text-[0.9375rem] leading-6 tracking-[-0.005em] text-lumen-foreground outline-none placeholder:text-lumen-muted-foreground disabled:cursor-not-allowed disabled:opacity-60",
            className,
          )}
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          onChange={(event) => {
            if (value === undefined) setUncontrolledValue(event.currentTarget.value);
            resize();
            onChange?.(event);
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (event.defaultPrevented) return;
            if (
              submitOnEnter &&
              event.key === "Enter" &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              onSubmit?.(event.currentTarget.value);
            }
          }}
          {...props}
        />
        {error ? (
          <p
            id={errorId}
            role="alert"
            className="flex items-start gap-2 px-4 pb-3 text-xs font-semibold leading-5 text-lumen-danger before:mt-[0.45em] before:size-1.5 before:shrink-0 before:rounded-full before:bg-current"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

PromptComposerField.displayName = "PromptComposerField";

function PromptComposerAttachments({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="prompt-composer-attachments"
      className={cn(
        "grid grid-cols-1 gap-2 border-b border-lumen-border bg-lumen-surface-muted/50 px-3 py-2.5 sm:grid-cols-2",
        className,
      )}
      {...props}
    />
  );
}

interface PromptComposerAttachmentProps extends React.ComponentProps<"li"> {
  name: string;
  size?: React.ReactNode;
  media?: React.ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
}

function PromptComposerAttachment({
  children,
  className,
  media,
  name,
  onRemove,
  removeLabel,
  size,
  ...props
}: PromptComposerAttachmentProps) {
  return (
    <li
      data-slot="prompt-composer-attachment"
      className={cn(
        "flex min-h-11 max-w-full items-center gap-2 rounded-lumen-button border border-lumen-border bg-lumen-background/55 py-1.5 pl-2 pr-1 text-[0.8125rem] shadow-[var(--lumen-shadow-control)]",
        className,
      )}
      {...props}
    >
      {media}
      <span className="min-w-0 flex-1 truncate font-medium text-lumen-foreground">
        {name}
      </span>
      {size ? (
        <span className="shrink-0 text-xs tabular-nums text-lumen-muted-foreground">{size}</span>
      ) : null}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel ?? `Remove ${name}`}
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-lumen-control text-lumen-muted-foreground outline-none transition-colors hover:bg-lumen-surface-muted hover:text-lumen-foreground focus-visible:ring-2 focus-visible:ring-lumen-focus motion-reduce:transition-none"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            className="size-3.5"
          >
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      ) : null}
      {children}
    </li>
  );
}

function PromptComposerToolbar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="prompt-composer-toolbar"
      className={cn(
        "flex min-h-14 flex-wrap items-center justify-between gap-2 bg-transparent px-2 pb-2 pt-1",
        className,
      )}
      {...props}
    />
  );
}

function PromptComposerControls({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="prompt-composer-controls"
      className={cn(
        "flex min-w-0 w-fit max-w-full basis-full flex-wrap items-center gap-0.5 rounded-lumen-field border border-lumen-border bg-lumen-background/45 p-0.5 shadow-inner sm:basis-auto",
        className,
      )}
      {...props}
    />
  );
}

function PromptComposerActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="prompt-composer-actions"
      className={cn("ml-auto flex shrink-0 items-center gap-1.5", className)}
      {...props}
    />
  );
}

type PromptComposerContextTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger";

interface PromptComposerContextSegment {
  id: string;
  label: React.ReactNode;
  tokens: number;
  tone?: PromptComposerContextTone;
  hint?: React.ReactNode;
}

interface PromptComposerContextDetailsProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  used: number;
  total: number;
  segments: PromptComposerContextSegment[];
  reserved?: number;
  heading?: React.ReactNode;
}

interface PromptComposerContextMeterProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "title" | "type"> {
  used: number;
  total: number;
  segments: PromptComposerContextSegment[];
  reserved?: number;
  heading?: React.ReactNode;
  contentClassName?: string;
  triggerLabel?: string;
}

const contextToneClasses: Record<PromptComposerContextTone, string> = {
  neutral: "bg-lumen-muted-foreground",
  primary: "bg-lumen-primary",
  success: "bg-lumen-success",
  warning: "bg-lumen-warning",
  danger: "bg-lumen-danger",
};

function getContextPercent(used: number, total: number) {
  if (!Number.isFinite(used) || !Number.isFinite(total) || total <= 0) return 0;
  return Math.round(Math.max(0, Math.min(100, (used / total) * 100)));
}

function formatContextTokens(value: number) {
  const tokens = Math.max(0, Number.isFinite(value) ? value : 0);
  if (tokens >= 1_000_000) {
    const amount = tokens / 1_000_000;
    return `${Number.isInteger(amount) ? amount.toFixed(0) : amount.toFixed(1)}M`;
  }
  if (tokens >= 1_000) {
    const amount = tokens / 1_000;
    return `${Number.isInteger(amount) ? amount.toFixed(0) : amount.toFixed(1)}k`;
  }
  return `${Math.round(tokens)}`;
}

function PromptComposerContextRing({ percent, size }: { percent: number; size: number }) {
  const strokeWidth = size >= 40 ? 4 : 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const tone = percent >= 90 ? "text-lumen-danger" : percent >= 70 ? "text-lumen-warning" : "text-lumen-primary";

  return (
    <svg
      data-slot="prompt-composer-context-ring"
      aria-hidden="true"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("shrink-0 -rotate-90", tone)}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className="stroke-lumen-border"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - percent / 100)}
        className="transition-[stroke-dashoffset] motion-reduce:transition-none"
      />
    </svg>
  );
}

function PromptComposerContextDetails({
  className,
  heading = "Context window",
  reserved,
  segments,
  total,
  used,
  ...props
}: PromptComposerContextDetailsProps) {
  const percent = getContextPercent(used, total);
  const free = Math.max(0, total - used);

  return (
    <div
      data-slot="prompt-composer-context-details"
      className={cn("text-lumen-foreground", className)}
      {...props}
    >
      <div className="flex items-center gap-3 border-b border-lumen-border p-3.5">
        <PromptComposerContextRing percent={percent} size={44} />
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-[-0.01em]">{percent}% of context used</p>
          <p className="mt-0.5 text-xs tabular-nums text-lumen-muted-foreground">
            {formatContextTokens(used)} of {formatContextTokens(total)} tokens
          </p>
        </div>
      </div>

      <div className="p-3.5">
        <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-lumen-muted-foreground">
          {heading}
        </p>
        <div
          aria-hidden="true"
          className="flex h-2 w-full overflow-hidden rounded-full bg-lumen-surface-muted"
        >
          {segments.map((segment) => {
            const width = total > 0 ? Math.max(0, Math.min(100, (segment.tokens / total) * 100)) : 0;
            return segment.tokens > 0 ? (
              <span
                key={segment.id}
                className={contextToneClasses[segment.tone ?? "neutral"]}
                style={{ width: `${width}%` }}
              />
            ) : null;
          })}
        </div>

        <ul aria-label="Context usage breakdown" className="mt-3 grid gap-2">
          {segments.map((segment) => (
            <li key={segment.id} className="flex min-w-0 items-center gap-2 text-xs">
              <span
                aria-hidden="true"
                className={cn("size-2 shrink-0 rounded-full", contextToneClasses[segment.tone ?? "neutral"])}
              />
              <span className="min-w-0 flex-1 truncate text-lumen-foreground">
                {segment.label}
                {segment.hint ? (
                  <span className="ml-1 text-lumen-muted-foreground">({segment.hint})</span>
                ) : null}
              </span>
              <span className="shrink-0 tabular-nums text-lumen-muted-foreground">
                {formatContextTokens(segment.tokens)}
              </span>
            </li>
          ))}
          <li className="flex min-w-0 items-center gap-2 text-xs">
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-lumen-border" />
            <span className="min-w-0 flex-1 text-lumen-muted-foreground">Free</span>
            <span className="shrink-0 tabular-nums text-lumen-muted-foreground">
              {formatContextTokens(free)}
            </span>
          </li>
        </ul>
      </div>

      {reserved !== undefined ? (
        <p className="border-t border-lumen-border px-3.5 py-2.5 text-[0.6875rem] leading-4 text-lumen-muted-foreground">
          {formatContextTokens(reserved)} tokens reserved for output
        </p>
      ) : null}
    </div>
  );
}

function PromptComposerContextMeter({
  className,
  contentClassName,
  heading,
  reserved,
  segments,
  total,
  triggerLabel,
  used,
  ...props
}: PromptComposerContextMeterProps) {
  const percent = getContextPercent(used, total);
  const accessibleLabel = triggerLabel ?? `Context usage: ${percent} percent`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-slot="prompt-composer-context-trigger"
          aria-label={accessibleLabel}
          title={`${formatContextTokens(used)} of ${formatContextTokens(total)} tokens`}
          className={cn(
            "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lumen-control px-2 text-xs font-semibold tabular-nums text-lumen-muted-foreground outline-none transition-[background-color,color,box-shadow] hover:bg-lumen-surface-muted hover:text-lumen-foreground focus-visible:ring-2 focus-visible:ring-lumen-focus disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none",
            className,
          )}
          {...props}
        >
          <PromptComposerContextRing percent={percent} size={18} />
          <span>{percent}% context</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className={cn("w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden p-0", contentClassName)}
      >
        <PromptComposerContextDetails
          used={used}
          total={total}
          reserved={reserved}
          segments={segments}
          heading={heading}
        />
      </PopoverContent>
    </Popover>
  );
}

interface PromptComposerSubmitProps extends Omit<ButtonProps, "children"> {
  isStreaming?: boolean;
  onStop?: () => void;
  sendLabel?: string;
  stopLabel?: string;
  sendIcon?: React.ReactNode;
  stopIcon?: React.ReactNode;
}

const PromptComposerSubmit = React.forwardRef<HTMLButtonElement, PromptComposerSubmitProps>(
  (
    {
      className,
      isStreaming = false,
      onClick,
      onStop,
      sendIcon,
      sendLabel = "Send",
      stopIcon,
      stopLabel = "Stop",
      size,
      variant,
      ...props
    },
    ref,
  ) => {
    const label = isStreaming ? stopLabel : sendLabel;
    const icon = isStreaming ? stopIcon : sendIcon;

    return (
      <Button
        ref={ref}
        type="button"
        data-slot="prompt-composer-submit"
        data-streaming={isStreaming || undefined}
        variant={variant ?? (isStreaming ? "secondary" : "primary")}
        size={size}
        aria-label={icon ? label : undefined}
        onClick={(event) => {
          if (isStreaming) onStop?.();
          else onClick?.(event);
        }}
        className={cn(size === "icon" && "rounded-lumen-composer", className)}
        {...props}
      >
        {icon ?? label}
      </Button>
    );
  },
);

PromptComposerSubmit.displayName = "PromptComposerSubmit";

export {
  PromptComposer,
  PromptComposerActions,
  PromptComposerAttachment,
  PromptComposerAttachments,
  PromptComposerControls,
  PromptComposerContextDetails,
  PromptComposerContextMeter,
  PromptComposerField,
  PromptComposerSubmit,
  PromptComposerToolbar,
  type PromptComposerAttachmentProps,
  type PromptComposerContextDetailsProps,
  type PromptComposerContextMeterProps,
  type PromptComposerContextSegment,
  type PromptComposerContextTone,
  type PromptComposerFieldProps,
  type PromptComposerSubmitProps,
};
