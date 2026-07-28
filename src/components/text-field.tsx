import * as React from "react";

import { cn } from "../lib/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const formControlClassName =
  "flex h-[var(--lumen-field-height)] w-full min-w-0 rounded-lumen-field border border-lumen-control-border bg-lumen-surface px-3.5 py-2 text-[0.9375rem] leading-5 text-lumen-foreground shadow-[var(--lumen-shadow-field)] outline-none transition-[background-color,border-color,box-shadow] placeholder:text-lumen-muted-foreground hover:border-lumen-muted-foreground focus-visible:border-lumen-primary focus-visible:ring-2 focus-visible:ring-lumen-focus/35 disabled:cursor-not-allowed disabled:border-lumen-control-border disabled:bg-lumen-surface-muted disabled:opacity-60 disabled:hover:border-lumen-control-border read-only:border-lumen-control-border read-only:bg-lumen-surface-muted read-only:shadow-none read-only:hover:border-lumen-control-border aria-invalid:border-lumen-danger aria-invalid:ring-2 aria-invalid:ring-lumen-danger/20 motion-reduce:transition-none";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        formControlClassName,
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";

export interface TextFieldProps
  extends Omit<InputProps, "aria-describedby" | "aria-invalid" | "id"> {
  id: string;
  label: React.ReactNode;
  labelMeta?: React.ReactNode;
  sublabel?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      containerClassName,
      description,
      error,
      id,
      inputClassName,
      label,
      labelMeta,
      sublabel,
      ...props
    },
    ref,
  ) => {
    const sublabelId = sublabel ? `${id}-sublabel` : undefined;
    const descriptionId = description ? `${id}-description` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [sublabelId, descriptionId, errorId].filter(Boolean).join(" ");

    return (
      <div data-slot="text-field" className={cn("grid gap-1.5", containerClassName)}>
        <div data-slot="field-label-row" className="flex min-w-0 items-baseline justify-between gap-3">
          <label
            htmlFor={id}
            data-slot="field-label"
            className="text-[0.8125rem] font-semibold leading-5 tracking-[-0.005em] text-lumen-foreground"
          >
            {label}
          </label>
          {labelMeta ? <span data-slot="field-label-meta" className="shrink-0 text-xs font-medium text-lumen-muted-foreground">{labelMeta}</span> : null}
        </div>
        {sublabel ? (
          <p id={sublabelId} data-slot="field-sublabel" className="text-[0.8125rem] leading-5 text-lumen-muted-foreground">
            {sublabel}
          </p>
        ) : null}
        <Input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={inputClassName}
          {...props}
        />
        {description ? (
          <p
            id={descriptionId}
            data-slot="field-description"
            className="text-xs leading-5 text-lumen-muted-foreground"
          >
            {description}
          </p>
        ) : null}
        {error ? (
          <p
            id={errorId}
            role="alert"
            data-slot="field-error"
            className="flex items-start gap-2 text-xs font-semibold leading-5 text-lumen-danger before:mt-[0.45em] before:size-1.5 before:shrink-0 before:rounded-full before:bg-current"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

TextField.displayName = "TextField";

export { Input, TextField };
