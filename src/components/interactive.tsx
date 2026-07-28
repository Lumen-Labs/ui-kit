"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "../lib/cn";

const Tabs = TabsPrimitive.Root;
const TabsList = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) => <TabsPrimitive.List className={cn("inline-flex gap-1 border-b border-lumen-border", className)} {...props} />;
const TabsTrigger = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) => <TabsPrimitive.Trigger className={cn("border-b-2 border-transparent px-3 py-2 text-sm font-semibold text-lumen-muted-foreground outline-none hover:text-lumen-foreground focus-visible:ring-2 focus-visible:ring-lumen-focus data-[state=active]:border-lumen-primary data-[state=active]:text-lumen-foreground", className)} {...props} />;
const TabsContent = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) => <TabsPrimitive.Content className={cn("py-4 outline-none focus-visible:ring-2 focus-visible:ring-lumen-focus", className)} {...props} />;

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
function PopoverContent({ className, sideOffset = 8, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return <PopoverPrimitive.Portal><PopoverPrimitive.Content sideOffset={sideOffset} className={cn("z-50 max-w-sm rounded-lumen-surface border border-lumen-border bg-lumen-surface p-4 text-sm text-lumen-foreground shadow-lumen-card outline-none", className)} {...props} /></PopoverPrimitive.Portal>;
}

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
function TooltipContent({ className, sideOffset = 6, ...props }: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return <TooltipPrimitive.Portal><TooltipPrimitive.Content sideOffset={sideOffset} className={cn("z-50 max-w-xs rounded-lumen-control bg-lumen-foreground px-3 py-1.5 text-xs text-lumen-background shadow-lumen-card", className)} {...props} /></TooltipPrimitive.Portal>;
}

const DropdownMenu = DropdownPrimitive.Root;
const DropdownMenuTrigger = DropdownPrimitive.Trigger;
function DropdownMenuContent({ className, sideOffset = 6, ...props }: React.ComponentProps<typeof DropdownPrimitive.Content>) {
  return <DropdownPrimitive.Portal><DropdownPrimitive.Content sideOffset={sideOffset} className={cn("z-50 min-w-44 rounded-lumen-surface border border-lumen-border bg-lumen-surface p-1 text-sm text-lumen-foreground shadow-lumen-card", className)} {...props} /></DropdownPrimitive.Portal>;
}
const DropdownMenuItem = ({ className, ...props }: React.ComponentProps<typeof DropdownPrimitive.Item>) => <DropdownPrimitive.Item className={cn("flex cursor-default select-none items-center rounded-lumen-control px-3 py-2 outline-none focus:bg-lumen-surface-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)} {...props} />;
const DropdownMenuLabel = ({ className, ...props }: React.ComponentProps<typeof DropdownPrimitive.Label>) => <DropdownPrimitive.Label className={cn("px-3 py-2 text-xs font-semibold text-lumen-muted-foreground", className)} {...props} />;
const DropdownMenuSeparator = ({ className, ...props }: React.ComponentProps<typeof DropdownPrimitive.Separator>) => <DropdownPrimitive.Separator className={cn("my-1 h-px bg-lumen-border", className)} {...props} />;

const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;
const DrawerTitle = DialogPrimitive.Title;
const DrawerDescription = DialogPrimitive.Description;
interface DrawerContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> { side?: "left" | "right"; }
function DrawerContent({ children, className, side = "right", ...props }: DrawerContentProps) {
  return <DialogPrimitive.Portal><DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" /><DialogPrimitive.Content className={cn("fixed inset-y-0 z-50 flex w-[min(28rem,calc(100vw-2rem))] flex-col gap-4 overflow-y-auto border-lumen-border bg-lumen-surface p-5 text-lumen-foreground shadow-lumen-card outline-none", side === "right" ? "right-0 border-l" : "left-0 border-r", className)} {...props}>{children}</DialogPrimitive.Content></DialogPrimitive.Portal>;
}

export { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Popover, PopoverContent, PopoverTrigger, Tabs, TabsContent, TabsList, TabsTrigger, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, type DrawerContentProps };
