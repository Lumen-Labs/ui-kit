import * as React from "react";

import { cn } from "../lib/cn";

interface GlobalHeaderProps extends React.ComponentProps<"header"> {
  sticky?: boolean;
}

function GlobalHeader({ className, sticky = false, ...props }: GlobalHeaderProps) {
  return (
    <header
      data-slot="global-header"
      data-sticky={sticky || undefined}
      className={cn(
        "z-40 border-b border-lumen-border bg-lumen-surface text-lumen-foreground shadow-lumen-control",
        sticky &&
          "sticky top-0 bg-lumen-surface/80 backdrop-blur-md supports-[backdrop-filter]:bg-lumen-surface/70",
        className,
      )}
      {...props}
    />
  );
}

function GlobalHeaderInner({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="global-header-inner"
      className={cn(
        "mx-auto flex min-h-[var(--lumen-layout-header-height)] w-full max-w-7xl flex-wrap items-center gap-x-3 gap-y-1 px-[var(--lumen-layout-page-inset-compact)] py-1.5 sm:px-[var(--lumen-layout-page-inset)]",
        className,
      )}
      {...props}
    />
  );
}

function GlobalHeaderBrand({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      data-slot="global-header-brand"
      className={cn(
        "inline-flex min-h-11 min-w-0 items-center gap-2.5 rounded-lumen-control font-semibold text-lumen-foreground no-underline outline-none focus-visible:ring-2 focus-visible:ring-lumen-focus focus-visible:ring-offset-2 focus-visible:ring-offset-lumen-surface",
        className,
      )}
      {...props}
    />
  );
}

function GlobalHeaderNav({
  "aria-label": ariaLabel = "Primary navigation",
  className,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label={ariaLabel}
      data-slot="global-header-nav"
      className={cn("order-3 min-w-0 basis-full sm:order-none sm:basis-auto", className)}
      {...props}
    />
  );
}

function GlobalHeaderNavList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="global-header-nav-list"
      className={cn("flex list-none flex-wrap items-center gap-0.5", className)}
      {...props}
    />
  );
}

function GlobalHeaderNavItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="global-header-nav-item" className={cn("min-w-0", className)} {...props} />;
}

interface GlobalHeaderNavLinkProps extends React.ComponentProps<"a"> {
  current?: boolean;
}

function GlobalHeaderNavLink({ className, current, ...props }: GlobalHeaderNavLinkProps) {
  return (
    <a
      aria-current={current ? "page" : undefined}
      data-slot="global-header-nav-link"
      className={cn(
        "inline-flex min-h-11 items-center gap-2 border-b-2 border-transparent px-3 text-sm font-medium text-lumen-muted-foreground no-underline outline-none transition-colors hover:border-lumen-border hover:text-lumen-foreground focus-visible:rounded-lumen-control focus-visible:ring-2 focus-visible:ring-lumen-focus motion-reduce:transition-none",
        current &&
          "border-lumen-primary font-semibold text-lumen-foreground hover:border-lumen-primary hover:text-lumen-foreground",
        className,
      )}
      {...props}
    />
  );
}

function GlobalHeaderActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="global-header-actions"
      className={cn("ml-auto flex flex-wrap items-center justify-end gap-1.5", className)}
      {...props}
    />
  );
}

type LinkVariant = "inline" | "standalone" | "muted";

interface LinkProps extends React.ComponentPropsWithoutRef<"a"> {
  variant?: LinkVariant;
}

const linkVariantClassNames: Record<LinkVariant, string> = {
  inline:
    "font-medium text-lumen-link underline underline-offset-4 hover:decoration-2",
  standalone:
    "inline-flex min-h-11 items-center gap-2 rounded-lumen-control px-2 font-semibold text-lumen-link no-underline hover:bg-lumen-surface-muted",
  muted:
    "font-medium text-lumen-muted-foreground underline decoration-lumen-border underline-offset-4 hover:text-lumen-foreground hover:decoration-current",
};

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant = "inline", ...props }, ref) => (
    <a
      ref={ref}
      data-slot="link"
      data-variant={variant}
      className={cn(
        "rounded-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-lumen-focus focus-visible:ring-offset-2 focus-visible:ring-offset-lumen-background motion-reduce:transition-none",
        linkVariantClassNames[variant],
        className,
      )}
      {...props}
    />
  ),
);

Link.displayName = "Link";

function BackLink({ children, className, ...props }: React.ComponentProps<"a">) {
  return (
    <Link
      data-slot="back-link"
      variant="standalone"
      className={cn("text-sm", className)}
      {...props}
    >
      <span aria-hidden="true">←</span>
      {children}
    </Link>
  );
}

function BackToTop({ children = "Back to top", className, ...props }: React.ComponentProps<"a">) {
  return (
    <Link
      data-slot="back-to-top"
      variant="standalone"
      className={cn("text-sm", className)}
      {...props}
    >
      <span aria-hidden="true">↑</span>
      {children}
    </Link>
  );
}

interface JumpLinksProps extends Omit<React.ComponentProps<"nav">, "title"> {
  listClassName?: string;
  title?: React.ReactNode;
  titleAs?: "h2" | "h3" | "h4" | "h5" | "h6";
}

function JumpLinks({
  "aria-label": ariaLabel,
  children,
  className,
  listClassName,
  title = "On this page",
  titleAs: Title = "h2",
  ...props
}: JumpLinksProps) {
  const titleId = React.useId();

  return (
    <nav
      aria-label={ariaLabel}
      aria-labelledby={ariaLabel ? undefined : titleId}
      data-slot="jump-links"
      className={cn(
        "border-l-2 border-lumen-border bg-lumen-surface px-4 py-3",
        className,
      )}
      {...props}
    >
      <Title id={titleId} className="mb-2 text-sm font-semibold text-lumen-foreground">
        {title}
      </Title>
      <ul className={cn("grid list-none gap-1", listClassName)}>{children}</ul>
    </nav>
  );
}

interface JumpLinkProps extends LinkProps {
  current?: boolean;
}

function JumpLink({ children, className, current, ...props }: JumpLinkProps) {
  return (
    <li>
      <Link
        aria-current={current ? "location" : undefined}
        data-current={current || undefined}
        variant="standalone"
        className={cn(
          "relative min-h-9 w-full px-2 py-1 text-sm font-medium before:absolute before:inset-y-1 before:-left-[1.0625rem] before:w-0.5 before:bg-transparent",
          current && "bg-lumen-primary/10 text-lumen-foreground before:bg-lumen-primary",
          className,
        )}
        {...props}
      >
        {children}
      </Link>
    </li>
  );
}

function PageHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="page-header"
      className={cn(
        "grid gap-4 border-b border-lumen-border pb-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end",
        className,
      )}
      {...props}
    />
  );
}

function PageHeaderContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid gap-2", className)} {...props} />;
}

interface PageHeaderTitleProps extends React.ComponentProps<"h1"> {
  as?: "h1" | "h2" | "h3" | "h4";
}

function PageHeaderTitle({ as: Component = "h1", className, ...props }: PageHeaderTitleProps) {
  return (
    <Component
      data-slot="page-header-title"
      className={cn("text-3xl font-semibold tracking-tight text-lumen-foreground", className)}
      {...props}
    />
  );
}

function PageHeaderDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="page-header-description"
      className={cn("max-w-3xl text-lumen-muted-foreground", className)}
      {...props}
    />
  );
}

function PageHeaderActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-actions"
      className={cn("flex flex-wrap items-center gap-2 sm:justify-end", className)}
      {...props}
    />
  );
}

type SideNavExpression = "default" | "compact" | "cyber-grid";

interface SideNavProps extends React.ComponentProps<"nav"> {
  expression?: SideNavExpression;
}

function SideNav({ className, expression = "default", ...props }: SideNavProps) {
  return (
    <nav
      data-slot="side-nav"
      data-expression={expression}
      className={cn("text-sm", className)}
      {...props}
    />
  );
}

function SideNavList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="side-nav-list"
      className={cn("grid list-none gap-0", className)}
      {...props}
    />
  );
}

function SideNavNestedList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="side-nav-nested-list"
      className={cn(
        "relative ml-5 grid list-none gap-0 pl-3 before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-lumen-border",
        className,
      )}
      {...props}
    />
  );
}

function SideNavItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("min-w-0", className)} {...props} />;
}

interface SideNavLinkProps extends React.ComponentProps<"a"> {
  current?: boolean;
  depth?: 0 | 1 | 2;
}

function SideNavLink({ className, current, depth = 0, ...props }: SideNavLinkProps) {
  return (
    <a
      aria-current={current ? "page" : undefined}
      data-slot="side-nav-link"
      data-current={current || undefined}
      data-depth={depth}
      data-selection-indicator={current ? (depth === 0 ? "row-edge" : "nested-rail") : undefined}
      className={cn(
        "relative flex min-h-10 items-center gap-2.5 rounded-[2px] px-3 py-1.5 font-medium text-lumen-muted-foreground outline-none transition-colors before:pointer-events-none before:absolute before:inset-y-1 before:w-0.5 before:bg-transparent hover:bg-lumen-surface-muted/70 hover:text-lumen-foreground focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-lumen-focus motion-reduce:transition-none [&_svg]:size-4 [&_svg]:shrink-0",
        depth === 0 && "before:left-0",
        depth === 1 && "min-h-9 gap-2 px-2.5 py-1.5 text-[0.8125rem]",
        depth === 2 && "min-h-8 gap-2 px-2 py-1 text-xs",
        depth > 0 && "before:-left-3",
        current &&
          "bg-lumen-primary/10 font-semibold text-lumen-foreground before:bg-lumen-primary hover:bg-lumen-primary/10 hover:text-lumen-foreground",
        className,
      )}
      {...props}
    />
  );
}

function SideNavGroup({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("grid gap-0", className)} {...props} />;
}

function SideNavGroupLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="side-nav-group-label"
      className={cn(
        "px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-lumen-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

interface AppShellProps extends React.ComponentProps<"div"> {
  layout?: "sidebar" | "sidebar-rail";
}

function AppShell({ className, layout = "sidebar", ...props }: AppShellProps) {
  return (
    <div
      data-slot="app-shell"
      data-layout={layout}
      className={cn(
        "grid min-h-0 min-w-0 lg:grid-cols-[var(--lumen-layout-sidebar-width)_minmax(0,1fr)]",
        layout === "sidebar-rail" &&
          "xl:grid-cols-[var(--lumen-layout-sidebar-width)_minmax(0,1fr)_var(--lumen-layout-rail-width)]",
        className,
      )}
      {...props}
    />
  );
}

function AppShellSidebar({ className, ...props }: React.ComponentProps<"aside">) {
  return (
    <aside
      data-slot="app-shell-sidebar"
      className={cn(
        "flex min-w-0 flex-col gap-3 border-b border-lumen-border bg-lumen-surface p-[var(--lumen-layout-page-inset-compact)] lg:row-span-2 lg:border-b-0 lg:border-r xl:row-span-1",
        className,
      )}
      {...props}
    />
  );
}

function AppShellSidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-shell-sidebar-header"
      className={cn("border-b border-lumen-border pb-4 font-semibold", className)}
      {...props}
    />
  );
}

function AppShellSidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-shell-sidebar-content"
      className={cn("min-h-0 min-w-0 flex-1", className)}
      {...props}
    />
  );
}

function AppShellSidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-shell-sidebar-footer"
      className={cn("border-t border-lumen-border pt-4 text-sm", className)}
      {...props}
    />
  );
}

interface AppShellMainProps extends Omit<React.ComponentProps<"main">, "ref"> {
  as?: "main" | "div";
}

function AppShellMain({ as: Component = "main", className, ...props }: AppShellMainProps) {
  return (
    <Component
      data-slot="app-shell-main"
      className={cn(
        "min-w-0 bg-lumen-background p-[var(--lumen-layout-page-inset-compact)] sm:p-[var(--lumen-layout-page-inset)]",
        className,
      )}
      {...props}
    />
  );
}

function AppShellRail({ className, ...props }: React.ComponentProps<"aside">) {
  return (
    <aside
      data-slot="app-shell-rail"
      className={cn(
        "min-w-0 border-t border-lumen-border bg-lumen-surface p-[var(--lumen-layout-page-inset-compact)] lg:col-start-2 xl:col-start-auto xl:border-l xl:border-t-0 xl:p-[var(--lumen-layout-page-inset)]",
        className,
      )}
      {...props}
    />
  );
}

type PageContentSize = "readable" | "standard" | "wide" | "full";

interface PageContentProps extends React.ComponentProps<"div"> {
  size?: PageContentSize;
}

const pageContentSizes: Record<PageContentSize, string> = {
  readable: "max-w-3xl",
  standard: "max-w-5xl",
  wide: "max-w-7xl",
  full: "max-w-none",
};

function PageContent({ className, size = "standard", ...props }: PageContentProps) {
  return (
    <div
      data-slot="page-content"
      data-size={size}
      className={cn("mx-auto grid w-full gap-6", pageContentSizes[size], className)}
      {...props}
    />
  );
}

function PageSection({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="page-section"
      className={cn("grid scroll-mt-20 gap-4", className)}
      {...props}
    />
  );
}

function PageSectionHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-section-header"
      className={cn(
        "grid gap-3 border-b border-lumen-border pb-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end",
        className,
      )}
      {...props}
    />
  );
}

interface PageSectionTitleProps extends React.ComponentProps<"h2"> {
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
}

function PageSectionTitle({
  as: Component = "h2",
  className,
  ...props
}: PageSectionTitleProps) {
  return (
    <Component
      data-slot="page-section-title"
      className={cn("text-xl font-semibold tracking-tight text-lumen-foreground", className)}
      {...props}
    />
  );
}

function PageSectionDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="page-section-description"
      className={cn("mt-1 text-sm text-lumen-muted-foreground", className)}
      {...props}
    />
  );
}

function PageSectionActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-section-actions"
      className={cn("flex flex-wrap items-center gap-2 sm:justify-end", className)}
      {...props}
    />
  );
}

function PageSectionContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="page-section-content" className={cn("min-w-0", className)} {...props} />;
}

type SectionBandTone = "default" | "muted" | "accent";
type SectionBandMotion = "none" | "enter";

interface SectionBandProps extends React.ComponentProps<"section"> {
  motion?: SectionBandMotion;
  tone?: SectionBandTone;
}

const sectionBandTones: Record<SectionBandTone, string> = {
  default: "bg-lumen-surface",
  muted: "bg-lumen-surface-muted",
  accent: "bg-lumen-primary/5",
};

function SectionStack({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="section-stack"
      className={cn(
        "overflow-hidden border border-lumen-border bg-lumen-surface [&>[data-slot=section-band]+[data-slot=section-band]]:border-t [&>[data-slot=section-band]+[data-slot=section-band]]:border-lumen-border",
        className,
      )}
      {...props}
    />
  );
}

function SectionBand({ className, motion = "none", tone = "default", ...props }: SectionBandProps) {
  return (
    <section
      data-lumen-motion={motion === "enter" ? "section-enter" : undefined}
      data-motion={motion === "enter" ? motion : undefined}
      data-slot="section-band"
      data-tone={tone}
      className={cn(
        "grid min-w-0 scroll-mt-20 gap-6 px-[var(--lumen-layout-page-inset-compact)] py-8 sm:px-[var(--lumen-layout-page-inset)] sm:py-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-10 lg:py-12",
        sectionBandTones[tone],
        className,
      )}
      {...props}
    />
  );
}

function SectionBandHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="section-band-header"
      className={cn("grid min-w-0 content-start gap-3", className)}
      {...props}
    />
  );
}

function SectionBandEyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="section-band-eyebrow"
      className={cn(
        "font-mono text-xs font-semibold uppercase tracking-[0.12em] text-lumen-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

interface SectionBandTitleProps extends React.ComponentProps<"h2"> {
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
}

function SectionBandTitle({ as: Component = "h2", className, ...props }: SectionBandTitleProps) {
  return (
    <Component
      data-slot="section-band-title"
      className={cn("max-w-2xl text-2xl font-semibold tracking-tight text-lumen-foreground sm:text-3xl", className)}
      {...props}
    />
  );
}

function SectionBandDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="section-band-description"
      className={cn("max-w-2xl text-lumen-muted-foreground", className)}
      {...props}
    />
  );
}

function SectionBandContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="section-band-content"
      className={cn("grid min-w-0 content-start gap-4", className)}
      {...props}
    />
  );
}

export {
  AppShell,
  AppShellMain,
  AppShellRail,
  AppShellSidebar,
  AppShellSidebarContent,
  AppShellSidebarFooter,
  AppShellSidebarHeader,
  BackLink,
  BackToTop,
  GlobalHeader,
  GlobalHeaderActions,
  GlobalHeaderBrand,
  GlobalHeaderInner,
  GlobalHeaderNav,
  GlobalHeaderNavItem,
  GlobalHeaderNavLink,
  GlobalHeaderNavList,
  JumpLink,
  JumpLinks,
  Link,
  PageContent,
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
  PageSection,
  PageSectionActions,
  PageSectionContent,
  PageSectionDescription,
  PageSectionHeader,
  PageSectionTitle,
  SectionBand,
  SectionBandContent,
  SectionBandDescription,
  SectionBandEyebrow,
  SectionBandHeader,
  SectionBandTitle,
  SectionStack,
  SideNav,
  SideNavGroup,
  SideNavGroupLabel,
  SideNavItem,
  SideNavLink,
  SideNavList,
  SideNavNestedList,
  type AppShellProps,
  type AppShellMainProps,
  type GlobalHeaderNavLinkProps,
  type GlobalHeaderProps,
  type JumpLinkProps,
  type JumpLinksProps,
  type LinkProps,
  type LinkVariant,
  type PageContentProps,
  type PageContentSize,
  type PageHeaderTitleProps,
  type PageSectionTitleProps,
  type SectionBandMotion,
  type SectionBandProps,
  type SectionBandTitleProps,
  type SectionBandTone,
  type SideNavExpression,
  type SideNavLinkProps,
  type SideNavProps,
};
