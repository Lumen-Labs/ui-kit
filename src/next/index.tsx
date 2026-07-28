import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { buttonVariants, type ButtonVariantProps } from "../components/button";
import { cn } from "../lib/cn";

const nextLinkVariants = cva(
  "rounded-sm font-medium underline decoration-1 underline-offset-4 outline-none transition-colors hover:decoration-2 focus-visible:ring-2 focus-visible:ring-lumen-focus focus-visible:ring-offset-2 focus-visible:ring-offset-lumen-background motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: "text-lumen-link",
        muted:
          "text-lumen-muted-foreground hover:text-lumen-foreground focus-visible:text-lumen-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface NextLinkProps
  extends Omit<React.ComponentProps<typeof Link>, "className">,
    VariantProps<typeof nextLinkVariants> {
  className?: string;
}

function NextLink({ className, variant, ...props }: NextLinkProps) {
  return (
    <Link
      data-slot="next-link"
      className={cn(nextLinkVariants({ variant }), className)}
      {...props}
    />
  );
}

export interface NextLinkButtonProps
  extends Omit<React.ComponentProps<typeof Link>, "className">,
    ButtonVariantProps {
  className?: string;
}

function NextLinkButton({
  className,
  size,
  variant,
  ...props
}: NextLinkButtonProps) {
  return (
    <Link
      data-slot="next-link-button"
      className={cn(buttonVariants({ size, variant }), className)}
      {...props}
    />
  );
}

export { NextLink, NextLinkButton, nextLinkVariants };
