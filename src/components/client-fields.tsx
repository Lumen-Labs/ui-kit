"use client";

import * as React from "react";

import { cn } from "../lib/cn";
import { InputGroup } from "./form-patterns";
import { Field, FieldDescription, FieldError, FieldLabel, FieldLabelMeta, FieldLabelRow, FieldSublabel, Textarea } from "./forms";
import { Input, type InputProps } from "./text-field";

interface CharacterCountProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "maxLength"> {
  id: string;
  label: React.ReactNode;
  labelMeta?: React.ReactNode;
  sublabel?: React.ReactNode;
  maxLength: number;
  description?: React.ReactNode;
  error?: React.ReactNode;
  containerClassName?: string;
}

const CharacterCount = React.forwardRef<HTMLTextAreaElement, CharacterCountProps>(
  (
    {
      className,
      containerClassName,
      defaultValue,
      description,
      error,
      id,
      label,
      labelMeta,
      maxLength,
      onChange,
      value,
      sublabel,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
      String(defaultValue ?? ""),
    );
    const textValue = value === undefined ? uncontrolledValue : String(value);
    const remaining = maxLength - textValue.length;
    const sublabelId = sublabel ? `${id}-sublabel` : undefined;
    const descriptionId = description ? `${id}-description` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const countId = `${id}-count`;
    const describedBy = [sublabelId, descriptionId, errorId, countId].filter(Boolean).join(" ");
    const countMessage = `${remaining} ${Math.abs(remaining) === 1 ? "character" : "characters"} ${remaining < 0 ? "over limit" : "remaining"}`;

    return (
      <Field data-slot="character-count" className={containerClassName}>
        <FieldLabelRow>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          {labelMeta ? <FieldLabelMeta>{labelMeta}</FieldLabelMeta> : null}
        </FieldLabelRow>
        {sublabel ? <FieldSublabel id={sublabelId}>{sublabel}</FieldSublabel> : null}
        <Textarea
          ref={ref}
          id={id}
          maxLength={maxLength}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={className}
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          onChange={(event) => {
            if (value === undefined) setUncontrolledValue(event.currentTarget.value);
            onChange?.(event);
          }}
          {...props}
        />
        {description ? <FieldDescription id={descriptionId}>{description}</FieldDescription> : null}
        <div className="flex flex-wrap justify-between gap-2 text-xs leading-5">
          {error ? (
            <FieldError id={errorId}>{error}</FieldError>
          ) : <span />}
          <p
            id={countId}
            aria-live="polite"
            className={cn(
              "ml-auto text-lumen-muted-foreground",
              remaining < 0 && "font-semibold text-lumen-danger",
            )}
          >
            {countMessage}
          </p>
        </div>
      </Field>
    );
  },
);

CharacterCount.displayName = "CharacterCount";

interface PasswordFieldProps
  extends Omit<InputProps, "aria-describedby" | "aria-invalid" | "id" | "type"> {
  id: string;
  label: React.ReactNode;
  labelMeta?: React.ReactNode;
  sublabel?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  showLabel?: string;
  hideLabel?: string;
}

const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    {
      containerClassName,
      description,
      error,
      hideLabel = "Hide password",
      id,
      inputClassName,
      label,
      labelMeta,
      showLabel = "Show password",
      sublabel,
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const sublabelId = sublabel ? `${id}-sublabel` : undefined;
    const descriptionId = description ? `${id}-description` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [sublabelId, descriptionId, errorId].filter(Boolean).join(" ");

    return (
      <Field data-slot="password-field" className={containerClassName}>
        <FieldLabelRow>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          {labelMeta ? <FieldLabelMeta>{labelMeta}</FieldLabelMeta> : null}
        </FieldLabelRow>
        {sublabel ? <FieldSublabel id={sublabelId}>{sublabel}</FieldSublabel> : null}
        <InputGroup>
          <Input
            ref={ref}
            id={id}
            type={isVisible ? "text" : "password"}
            aria-describedby={describedBy || undefined}
            aria-invalid={error ? true : undefined}
            className={cn("flex-1", inputClassName)}
            {...props}
          />
          <button
            type="button"
            aria-controls={id}
            aria-pressed={isVisible}
            className="inline-flex min-h-[var(--lumen-field-height)] shrink-0 items-center rounded-r-lumen-field border border-lumen-control-border bg-lumen-surface px-3.5 text-[0.8125rem] font-semibold tracking-[-0.01em] text-lumen-foreground shadow-lumen-button outline-none hover:bg-lumen-surface-muted active:translate-y-px active:shadow-lumen-button-pressed focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-lumen-focus"
            onClick={() => setIsVisible((current) => !current)}
          >
            {isVisible ? hideLabel : showLabel}
          </button>
        </InputGroup>
        {description ? <FieldDescription id={descriptionId}>{description}</FieldDescription> : null}
        {error ? (
          <FieldError id={errorId}>{error}</FieldError>
        ) : null}
      </Field>
    );
  },
);

PasswordField.displayName = "PasswordField";

export {
  CharacterCount,
  PasswordField,
  type CharacterCountProps,
  type PasswordFieldProps,
};
