import * as React from "react";

import { cn } from "../lib/cn";

interface TableProps extends React.ComponentProps<"table"> {
  containerClassName?: string;
  containerProps?: React.ComponentProps<"div">;
}

function Table({ className, containerClassName, containerProps, ...props }: TableProps) {
  const { className: containerPropsClassName, ...scrollAreaProps } = containerProps ?? {};

  return (
    <div
      data-slot="table-container"
      {...scrollAreaProps}
      className={cn("w-full overflow-x-auto", containerClassName, containerPropsClassName)}
    >
      <table
        data-slot="table"
        className={cn("w-full border-collapse text-left text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mb-3 text-left text-sm text-lumen-muted-foreground", className)}
      {...props}
    />
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("border-b border-lumen-border bg-lumen-surface-muted", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody className={cn("divide-y divide-lumen-border", className)} {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn("transition-colors hover:bg-lumen-surface-muted motion-reduce:transition-none", className)}
      {...props}
    />
  );
}

function TableHead({ className, scope = "col", ...props }: React.ComponentProps<"th">) {
  return (
    <th
      scope={scope}
      className={cn(
        "px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-lumen-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td className={cn("px-3 py-3 align-middle", className)} {...props} />;
}

function DescriptionList({ className, ...props }: React.ComponentProps<"dl">) {
  return <dl className={cn("grid gap-x-6 gap-y-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]", className)} {...props} />;
}

function DescriptionTerm({ className, ...props }: React.ComponentProps<"dt">) {
  return <dt className={cn("font-semibold text-lumen-foreground", className)} {...props} />;
}

function DescriptionDetails({ className, ...props }: React.ComponentProps<"dd">) {
  return <dd className={cn("text-lumen-muted-foreground", className)} {...props} />;
}

function List({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="list" className={cn("list-disc space-y-2 pl-5", className)} {...props} />;
}

function ListItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="list-item" className={cn("pl-1", className)} {...props} />;
}

function CodeBlock({ className, ...props }: React.ComponentProps<"pre">) {
  return (
    <pre
      data-slot="code-block"
      className={cn(
        "m-0 overflow-x-auto rounded-lumen-surface border p-4 font-mono text-[0.8125rem] leading-6 outline-none focus-visible:ring-2 focus-visible:ring-lumen-focus/40",
        className,
      )}
      {...props}
    />
  );
}

type CodeTokenTone =
  | "comment"
  | "function"
  | "keyword"
  | "property"
  | "punctuation"
  | "string"
  | "tag";

interface CodeTokenProps extends React.ComponentProps<"span"> {
  tone: CodeTokenTone;
}

function CodeToken({ tone, ...props }: CodeTokenProps) {
  return <span data-slot="code-token" data-tone={tone} {...props} />;
}

function Stat({ className, ...props }: React.ComponentProps<"dl">) {
  return <dl data-slot="stat" className={cn("grid gap-1", className)} {...props} />;
}
function StatLabel({ className, ...props }: React.ComponentProps<"dt">) {
  return <dt className={cn("text-sm text-lumen-muted-foreground", className)} {...props} />;
}
function StatValue({ className, ...props }: React.ComponentProps<"dd">) {
  return <dd className={cn("text-2xl font-semibold text-lumen-foreground", className)} {...props} />;
}

interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt: string;
  fallback: React.ReactNode;
}

function Avatar({ alt, className, fallback, src, ...props }: AvatarProps) {
  return (
    <span
      data-slot="avatar"
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-lumen-surface-muted text-sm font-semibold text-lumen-foreground",
        className,
      )}
      {...props}
    >
      {src ? (
        // The React entrypoint cannot require Next.js; consumers can pass a custom image via fallback when optimization is required.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="size-full object-cover" />
      ) : fallback}
    </span>
  );
}

export {
  Avatar,
  CodeBlock,
  CodeToken,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  List,
  ListItem,
  Stat,
  StatLabel,
  StatValue,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type AvatarProps,
  type CodeTokenProps,
  type CodeTokenTone,
  type TableProps,
};
