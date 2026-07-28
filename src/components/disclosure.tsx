import * as React from "react";

import { cn } from "../lib/cn";

function Disclosure({ className, ...props }: React.ComponentProps<"details">) {
  return (
    <details
      data-slot="disclosure"
      className={cn("group rounded-lumen-control border border-lumen-border bg-lumen-surface", className)}
      {...props}
    />
  );
}

function DisclosureTrigger({ className, children, ...props }: React.ComponentProps<"summary">) {
  return (
    <summary
      data-slot="disclosure-trigger"
      className={cn(
        "flex cursor-pointer list-none items-center justify-between gap-4 rounded-lumen-control px-4 py-3 font-semibold outline-none marker:hidden focus-visible:ring-2 focus-visible:ring-lumen-focus focus-visible:ring-offset-2 focus-visible:ring-offset-lumen-background",
        className,
      )}
      {...props}
    >
      {children}
      <span aria-hidden="true" className="text-lg transition-transform group-open:rotate-45 motion-reduce:transition-none">+</span>
    </summary>
  );
}

function DisclosureContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="disclosure-content"
      className={cn("border-t border-lumen-border px-4 py-3 text-sm", className)}
      {...props}
    />
  );
}

export { Disclosure, DisclosureContent, DisclosureTrigger };

export const Accordion = Disclosure;
export const AccordionContent = DisclosureContent;
export const AccordionTrigger = DisclosureTrigger;
