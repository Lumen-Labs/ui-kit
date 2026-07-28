import * as React from "react";

import { cn } from "../lib/cn";
import { Input } from "./text-field";

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      data-slot="input-group"
      className={cn(
        "flex min-h-[var(--lumen-field-height)] min-w-0 items-stretch [&_[data-slot=input]]:rounded-none [&_[data-slot=input]]:first:rounded-l-lumen-field [&_[data-slot=input]]:last:rounded-r-lumen-field [&>*+*]:-ml-px",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupAddon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-addon"
      className={cn(
        "inline-flex min-h-[var(--lumen-field-height)] shrink-0 items-center border border-lumen-control-border bg-lumen-surface-muted px-3.5 text-[0.8125rem] font-medium text-lumen-muted-foreground first:rounded-l-lumen-field last:rounded-r-lumen-field",
        className,
      )}
      {...props}
    />
  );
}

const ErrorSummary = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    tabIndex={-1}
    data-slot="error-summary"
    className={cn(
      "grid gap-3 rounded-lumen-surface border border-l-4 border-lumen-danger bg-lumen-surface p-4 text-lumen-foreground outline-none focus-visible:ring-2 focus-visible:ring-lumen-focus focus-visible:ring-offset-2 focus-visible:ring-offset-lumen-background",
      className,
    )}
    {...props}
  />
));

ErrorSummary.displayName = "ErrorSummary";

interface ErrorSummaryTitleProps extends React.ComponentProps<"h2"> {
  as?: "h2" | "h3" | "h4";
}

function ErrorSummaryTitle({
  as: Component = "h2",
  className,
  ...props
}: ErrorSummaryTitleProps) {
  return (
    <Component
      data-slot="error-summary-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

function ErrorSummaryList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="error-summary-list"
      className={cn("list-disc space-y-1 pl-5 text-sm", className)}
      {...props}
    />
  );
}

interface ErrorSummaryItemProps extends React.ComponentProps<"li"> {
  href: string;
}

function ErrorSummaryItem({ children, className, href, ...props }: ErrorSummaryItemProps) {
  return (
    <li className={className} {...props}>
      <a
        href={href}
        className="rounded-sm font-semibold text-lumen-danger underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-lumen-focus"
      >
        {children}
      </a>
    </li>
  );
}

interface DateInputValue {
  day?: string | number;
  month?: string | number;
  year?: string | number;
}

interface DateInputProps
  extends Omit<React.ComponentProps<"fieldset">, "defaultValue" | "id"> {
  id: string;
  legend: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  defaultValue?: DateInputValue;
  namePrefix?: string;
  dayLabel?: string;
  monthLabel?: string;
  yearLabel?: string;
  disabled?: boolean;
  required?: boolean;
}

interface DateInputSegmentProps
  extends Omit<React.ComponentProps<typeof Input>, "id" | "name" | "type"> {
  id: string;
  label: string;
  name: string;
  width: "short" | "year";
}

function DateInputSegment({ id, label, name, width, ...props }: DateInputSegmentProps) {
  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="text-xs font-semibold leading-5 text-lumen-foreground">
        {label}
      </label>
      <Input
        id={id}
        name={name}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        pattern="[0-9]*"
        className={cn(width === "short" ? "w-16" : "w-24")}
        {...props}
      />
    </div>
  );
}

function DateInput({
  className,
  dayLabel = "Day",
  defaultValue,
  description,
  disabled,
  error,
  id,
  legend,
  monthLabel = "Month",
  namePrefix = id,
  required,
  yearLabel = "Year",
  ...props
}: DateInputProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ");

  return (
    <fieldset
      aria-describedby={describedBy || undefined}
      className={cn("grid gap-1.5", className)}
      disabled={disabled}
      {...props}
    >
      <legend className="text-[0.8125rem] font-semibold leading-5 tracking-[-0.005em] text-lumen-foreground">{legend}</legend>
      {description ? (
        <p id={descriptionId} className="text-[0.8125rem] leading-5 text-lumen-muted-foreground">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="flex items-start gap-2 text-xs font-semibold leading-5 text-lumen-danger before:mt-[0.45em] before:size-1.5 before:shrink-0 before:rounded-full before:bg-current">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap items-end gap-3 pt-0.5">
        <DateInputSegment
          id={`${id}-day`}
          name={`${namePrefix}.day`}
          label={dayLabel}
          width="short"
          maxLength={2}
          defaultValue={defaultValue?.day}
          aria-invalid={error ? true : undefined}
          required={required}
        />
        <DateInputSegment
          id={`${id}-month`}
          name={`${namePrefix}.month`}
          label={monthLabel}
          width="short"
          maxLength={2}
          defaultValue={defaultValue?.month}
          aria-invalid={error ? true : undefined}
          required={required}
        />
        <DateInputSegment
          id={`${id}-year`}
          name={`${namePrefix}.year`}
          label={yearLabel}
          width="year"
          maxLength={4}
          defaultValue={defaultValue?.year}
          aria-invalid={error ? true : undefined}
          required={required}
        />
      </div>
    </fieldset>
  );
}

export {
  DateInput,
  DateInputSegment,
  ErrorSummary,
  ErrorSummaryItem,
  ErrorSummaryList,
  ErrorSummaryTitle,
  InputGroup,
  InputGroupAddon,
  type DateInputProps,
  type DateInputSegmentProps,
  type DateInputValue,
  type ErrorSummaryItemProps,
  type ErrorSummaryTitleProps,
};
