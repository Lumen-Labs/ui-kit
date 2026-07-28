"use client";

import * as React from "react";

import { cn } from "../lib/cn";
import { Button } from "./button";
import { Input } from "./text-field";

interface ClipboardCopyProps extends Omit<React.ComponentProps<"div">, "onCopy"> {
  value: string;
  label?: string;
  copiedLabel?: string;
  errorLabel?: string;
  onCopy?: (value: string) => void;
}

function ClipboardCopy({
  className,
  copiedLabel = "Copied",
  errorLabel = "Copy failed",
  label = "Copy",
  onCopy,
  value,
  ...props
}: ClipboardCopyProps) {
  const [status, setStatus] = React.useState<"idle" | "copied" | "error">("idle");

  async function copyValue() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(value);
      setStatus("copied");
      onCopy?.(value);
    } catch {
      setStatus("error");
    }
  }

  const actionLabel = status === "copied" ? copiedLabel : label;
  const statusMessage = status === "copied" ? copiedLabel : status === "error" ? errorLabel : "";

  return (
    <div
      data-slot="clipboard-copy"
      className={cn(
        "flex min-w-0 items-stretch rounded-lumen-control border border-lumen-control-border bg-lumen-surface",
        className,
      )}
      {...props}
    >
      <code className="min-w-0 flex-1 overflow-x-auto px-3 py-2 font-mono text-sm text-lumen-foreground">
        {value}
      </code>
      <Button
        size="small"
        variant="ghost"
        className="h-auto rounded-none border-0 border-l border-lumen-border"
        onClick={copyValue}
      >
        {actionLabel}
      </Button>
      <span aria-live="polite" className="sr-only">
        {statusMessage}
      </span>
    </div>
  );
}

interface InlineEditProps
  extends Omit<React.ComponentProps<"div">, "children" | "onSubmit"> {
  label: React.ReactNode;
  value: string;
  onSave: (value: string) => void | Promise<void>;
  validate?: (value: string) => string | undefined;
  emptyValueLabel?: React.ReactNode;
  editLabel?: string;
  saveLabel?: string;
  cancelLabel?: string;
  saveErrorMessage?: string;
  inputProps?: Omit<React.ComponentProps<typeof Input>, "defaultValue" | "id" | "value">;
}

function InlineEdit({
  cancelLabel = "Cancel",
  className,
  editLabel = "Edit",
  emptyValueLabel = "Not set",
  inputProps,
  label,
  onSave,
  saveErrorMessage = "Could not save changes.",
  saveLabel = "Save",
  validate,
  value,
  ...props
}: InlineEditProps) {
  const generatedId = React.useId();
  const inputId = `${generatedId}-input`;
  const errorId = `${generatedId}-error`;
  const [isEditing, setIsEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const [error, setError] = React.useState<string>();
  const [isPending, setIsPending] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const editButtonRef = React.useRef<HTMLButtonElement>(null);
  const hasInteractedRef = React.useRef(false);

  React.useEffect(() => {
    if (isEditing) inputRef.current?.focus();
    else if (hasInteractedRef.current) editButtonRef.current?.focus();
  }, [isEditing]);

  function beginEditing() {
    hasInteractedRef.current = true;
    setDraft(value);
    setError(undefined);
    setIsEditing(true);
  }

  function cancelEditing() {
    if (isPending) return;
    setDraft(value);
    setError(undefined);
    setIsEditing(false);
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validate?.(draft);
    if (validationError) {
      setError(validationError);
      inputRef.current?.focus();
      return;
    }

    try {
      setIsPending(true);
      setError(undefined);
      await onSave(draft);
      setIsEditing(false);
    } catch {
      setError(saveErrorMessage);
      inputRef.current?.focus();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div
      data-slot="inline-edit"
      className={cn("grid gap-2", className)}
      {...props}
    >
      {isEditing ? (
        <form className="grid gap-2" onSubmit={save} aria-busy={isPending || undefined}>
          <label htmlFor={inputId} className="text-sm font-semibold text-lumen-foreground">
            {label}
          </label>
          <Input
            ref={inputRef}
            id={inputId}
            value={draft}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={error ? true : undefined}
            onChange={(event) => setDraft(event.currentTarget.value)}
            {...inputProps}
          />
          {error ? (
            <p id={errorId} role="alert" className="text-sm font-semibold text-lumen-danger">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" size="small" isPending={isPending} pendingLabel="Saving…">
              {saveLabel}
            </Button>
            <Button type="button" size="small" variant="secondary" disabled={isPending} onClick={cancelEditing}>
              {cancelLabel}
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="grid min-w-0 gap-1">
            <span className="text-sm font-semibold text-lumen-foreground">{label}</span>
            <span className="min-w-0 text-sm text-lumen-muted-foreground">
              {value || emptyValueLabel}
            </span>
          </div>
          <Button ref={editButtonRef} size="small" variant="ghost" onClick={beginEditing}>
            {editLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export {
  ClipboardCopy,
  InlineEdit,
  type ClipboardCopyProps,
  type InlineEditProps,
};
