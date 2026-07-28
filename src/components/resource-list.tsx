import * as React from "react";

import { cn } from "../lib/cn";

function ResourceList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="resource-list"
      className={cn("divide-y divide-lumen-border border-y border-lumen-border", className)}
      {...props}
    />
  );
}

function ResourceListItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="resource-list-item"
      className={cn("flex flex-col gap-4 py-4 sm:flex-row sm:items-start", className)}
      {...props}
    />
  );
}

function ResourceListContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="resource-list-content" className={cn("min-w-0 flex-1", className)} {...props} />;
}

type ResourceListTitleElement = "h2" | "h3" | "h4" | "h5" | "h6";

interface ResourceListTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: ResourceListTitleElement;
}

function ResourceListTitle({ as: Component = "h3", className, ...props }: ResourceListTitleProps) {
  return (
    <Component
      data-slot="resource-list-title"
      className={cn("text-base font-semibold text-lumen-foreground [&_a]:rounded-sm [&_a]:text-lumen-link [&_a]:underline-offset-4 [&_a:hover]:underline [&_a:focus-visible]:outline-none [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-lumen-focus", className)}
      {...props}
    />
  );
}

function ResourceListDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="resource-list-description" className={cn("mt-1 text-sm text-lumen-muted-foreground", className)} {...props} />;
}

function ResourceListMetadata({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="resource-list-metadata" className={cn("mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-lumen-muted-foreground", className)} {...props} />;
}

function ResourceListMetadataItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="resource-list-metadata-item" className={cn("flex items-center", className)} {...props} />;
}

function ResourceListActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="resource-list-actions" className={cn("flex shrink-0 flex-wrap items-center gap-2 sm:justify-end", className)} {...props} />;
}

export {
  ResourceList,
  ResourceListActions,
  ResourceListContent,
  ResourceListDescription,
  ResourceListItem,
  ResourceListMetadata,
  ResourceListMetadataItem,
  ResourceListTitle,
  type ResourceListTitleProps,
};
