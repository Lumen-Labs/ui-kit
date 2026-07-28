import * as React from "react";

import { cn } from "../lib/cn";
import { formControlClassName, Input, type InputProps } from "./text-field";

const controlClassName = formControlClassName;

export type SelectVariant = "default" | "ghost";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: SelectVariant;
}

const selectVariantClassNames: Record<SelectVariant, string> = {
  default: "",
  ghost:
    "border-transparent bg-transparent shadow-none hover:border-lumen-control-border hover:bg-lumen-surface-muted/70 focus-visible:border-lumen-primary focus-visible:bg-lumen-surface focus-visible:shadow-[var(--lumen-shadow-field)] disabled:border-transparent disabled:bg-transparent disabled:shadow-none disabled:hover:border-transparent aria-invalid:border-lumen-danger",
};

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 4, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    data-slot="textarea"
    className={cn(controlClassName, "min-h-28 resize-y py-3 leading-6", className)}
    {...props}
  />
));

Textarea.displayName = "Textarea";

const Select = React.forwardRef<
  HTMLSelectElement,
  SelectProps
>(({ className, variant = "default", ...props }, ref) => (
  <select
    ref={ref}
    data-slot="select"
    data-variant={variant}
    className={cn(
      controlClassName,
      "appearance-none bg-[position:right_0.875rem_center] bg-no-repeat py-0 pr-11",
      selectVariantClassNames[variant],
      className,
    )}
    {...props}
  />
));

Select.displayName = "Select";

const Checkbox = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="checkbox"
    data-slot="checkbox"
    className={cn(
      "size-5 shrink-0 appearance-none rounded-lumen-control border border-lumen-control-border bg-lumen-surface shadow-[var(--lumen-shadow-field)] outline-none transition-[background-color,border-color,box-shadow] checked:border-lumen-primary checked:bg-lumen-primary hover:border-lumen-muted-foreground focus-visible:ring-2 focus-visible:ring-lumen-focus focus-visible:ring-offset-2 focus-visible:ring-offset-lumen-background disabled:cursor-not-allowed disabled:bg-lumen-surface-muted disabled:opacity-60 motion-reduce:transition-none",
      className,
    )}
    {...props}
  />
));

Checkbox.displayName = "Checkbox";

const Radio = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="radio"
    data-slot="radio"
    className={cn(
      "size-5 shrink-0 appearance-none rounded-full border border-lumen-control-border bg-lumen-surface shadow-[var(--lumen-shadow-field)] outline-none transition-[background-color,border-color,box-shadow] checked:border-lumen-primary checked:bg-lumen-primary hover:border-lumen-muted-foreground focus-visible:ring-2 focus-visible:ring-lumen-focus focus-visible:ring-offset-2 focus-visible:ring-offset-lumen-background disabled:cursor-not-allowed disabled:bg-lumen-surface-muted disabled:opacity-60 motion-reduce:transition-none",
      className,
    )}
    {...props}
  />
));

Radio.displayName = "Radio";

const Switch = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "role" | "type">
>(({ className, ...props }, ref) => (
  <span
    data-slot="switch"
    className={cn(
      "relative inline-flex h-11 w-12 shrink-0 cursor-pointer items-center has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60",
      className,
    )}
  >
    <input
      ref={ref}
      type="checkbox"
      role="switch"
      className="peer absolute inset-0 z-10 cursor-pointer opacity-0 disabled:cursor-not-allowed"
      {...props}
    />
    <span
      aria-hidden="true"
      data-slot="switch-track"
      className="absolute inset-x-0 top-2 h-7 rounded-full border border-lumen-control-border bg-lumen-surface-muted shadow-inner transition-[background-color,border-color,box-shadow] peer-checked:border-lumen-primary peer-checked:bg-lumen-primary peer-focus-visible:ring-2 peer-focus-visible:ring-lumen-focus peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-lumen-background motion-reduce:transition-none"
    />
    <span
      aria-hidden="true"
      data-slot="switch-thumb"
      className="absolute left-0.5 top-2.5 size-6 rounded-full border border-lumen-control-border bg-lumen-surface shadow-lumen-button transition-transform peer-checked:translate-x-5 peer-checked:border-lumen-primary motion-reduce:transition-none"
    />
  </span>
));

Switch.displayName = "Switch";

const NumberInput = React.forwardRef<HTMLInputElement, Omit<InputProps, "type">>((props, ref) => <Input ref={ref} type="number" {...props} />);
NumberInput.displayName = "NumberInput";

const SearchInput = React.forwardRef<HTMLInputElement, Omit<InputProps, "type">>((props, ref) => <Input ref={ref} type="search" {...props} />);
SearchInput.displayName = "SearchInput";

const FileInput = React.forwardRef<HTMLInputElement, Omit<InputProps, "type">>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      type="file"
      className={cn(
        "cursor-pointer p-1 leading-8 file:mr-3 file:h-8 file:align-middle file:rounded-lumen-button file:border file:border-lumen-control-border file:bg-lumen-surface-muted file:px-3 file:py-0 file:text-[0.8125rem] file:font-semibold file:leading-5 file:text-lumen-foreground file:shadow-lumen-button hover:file:bg-lumen-surface disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  ),
);
FileInput.displayName = "FileInput";

const Slider = React.forwardRef<HTMLInputElement, Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">>(({ className, ...props }, ref) => <input ref={ref} type="range" data-slot="slider" className={cn("h-11 w-full cursor-pointer appearance-none bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-lumen-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60", className)} {...props} />);
Slider.displayName = "Slider";

function Field({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="field" className={cn("grid gap-1.5", className)} {...props} />; }
function FieldLabelRow({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="field-label-row" className={cn("flex min-w-0 items-baseline justify-between gap-3", className)} {...props} />; }
function FieldLabel({ className, ...props }: React.ComponentProps<"label">) { return <label data-slot="field-label" className={cn("min-w-0 text-[0.8125rem] font-semibold leading-5 tracking-[-0.005em] text-lumen-foreground", className)} {...props} />; }
function FieldLabelMeta({ className, ...props }: React.ComponentProps<"span">) { return <span data-slot="field-label-meta" className={cn("shrink-0 text-xs font-medium tracking-normal text-lumen-muted-foreground", className)} {...props} />; }
function FieldSublabel({ className, ...props }: React.ComponentProps<"p">) { return <p data-slot="field-sublabel" className={cn("text-[0.8125rem] leading-5 text-lumen-muted-foreground", className)} {...props} />; }
function FieldDescription({ className, ...props }: React.ComponentProps<"p">) { return <p data-slot="field-description" className={cn("text-xs leading-5 text-lumen-muted-foreground", className)} {...props} />; }
function FieldError({ className, ...props }: React.ComponentProps<"p">) { return <p role="alert" data-slot="field-error" className={cn("flex items-start gap-2 text-xs font-semibold leading-5 text-lumen-danger before:mt-[0.45em] before:size-1.5 before:shrink-0 before:rounded-full before:bg-current", className)} {...props} />; }

function ChoiceField({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="choice-field" className={cn("grid min-h-11 grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 py-1.5 has-[:disabled]:opacity-60", className)} {...props} />; }
function ChoiceFieldLabel({ className, ...props }: React.ComponentProps<"label">) { return <label data-slot="choice-field-label" className={cn("block cursor-pointer text-sm font-semibold leading-5 tracking-[-0.005em] text-lumen-foreground", className)} {...props} />; }
function ChoiceFieldDescription({ className, ...props }: React.ComponentProps<"span">) { return <span data-slot="choice-field-description" className={cn("mt-0.5 block text-xs leading-5 text-lumen-muted-foreground", className)} {...props} />; }

function Fieldset({ className, ...props }: React.ComponentProps<"fieldset">) {
  return <fieldset data-slot="fieldset" className={cn("grid min-w-0 gap-1.5", className)} {...props} />;
}

function Legend({ className, ...props }: React.ComponentProps<"legend">) {
  return (
    <legend
      data-slot="legend"
      className={cn("mb-0.5 text-[0.8125rem] font-semibold leading-5 tracking-[-0.005em] text-lumen-foreground", className)}
      {...props}
    />
  );
}

export { Checkbox, ChoiceField, ChoiceFieldDescription, ChoiceFieldLabel, Field, FieldDescription, FieldError, FieldLabel, FieldLabelMeta, FieldLabelRow, FieldSublabel, Fieldset, FileInput, Legend, NumberInput, Radio, SearchInput, Select, Slider, Switch, Textarea };
