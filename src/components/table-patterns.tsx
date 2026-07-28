import * as React from "react";

import { cn } from "../lib/cn";
import { Checkbox } from "./forms";

function TableToolbar({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="table-toolbar" className={cn("grid border border-b-0 border-lumen-border bg-lumen-surface", className)} {...props} />;
}

function TableToolbarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="table-toolbar-header"
      className={cn(
        "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      {...props}
    />
  );
}

interface TableToolbarTitleProps extends React.ComponentProps<"h2"> {
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
}

function TableToolbarTitle({
  as: Component = "h2",
  className,
  ...props
}: TableToolbarTitleProps) {
  return (
    <Component
      data-slot="table-toolbar-title"
      className={cn("font-semibold text-lumen-foreground", className)}
      {...props}
    />
  );
}

function TableToolbarDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="table-toolbar-description"
      className={cn("mt-0.5 text-sm text-lumen-muted-foreground", className)}
      {...props}
    />
  );
}

function TableToolbarFilters({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="table-toolbar-filters"
      className={cn(
        "flex flex-col gap-3 border-t border-lumen-border bg-lumen-surface-muted/45 px-4 py-3 sm:flex-row sm:items-end",
        className,
      )}
      {...props}
    />
  );
}

function TableToolbarContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="table-toolbar-content" className={cn("min-w-0 flex-1", className)} {...props} />;
}

function TableToolbarActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="table-toolbar-actions" className={cn("flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end", className)} {...props} />;
}

interface TableAppliedFiltersProps extends React.ComponentProps<"div"> {
  clearAction?: React.ReactNode;
  label?: React.ReactNode;
}

function TableAppliedFilters({
  children,
  className,
  clearAction,
  label = "Applied filters",
  ...props
}: TableAppliedFiltersProps) {
  if (!children) return null;

  return (
    <div
      data-slot="table-applied-filters"
      className={cn(
        "flex flex-wrap items-center gap-2 border-t border-lumen-border px-4 py-2.5",
        className,
      )}
      {...props}
    >
      <span className="text-xs font-semibold text-lumen-muted-foreground">{label}</span>
      <ul className="flex min-w-0 flex-1 list-none flex-wrap items-center gap-2">{children}</ul>
      {clearAction ? <div className="shrink-0">{clearAction}</div> : null}
    </div>
  );
}

interface TableFilterTagProps extends Omit<React.ComponentProps<"li">, "children" | "value"> {
  label: React.ReactNode;
  onRemove: React.MouseEventHandler<HTMLButtonElement>;
  removeLabel: string;
  value: React.ReactNode;
}

function TableFilterTag({
  className,
  label,
  onRemove,
  removeLabel,
  value,
  ...props
}: TableFilterTagProps) {
  return (
    <li
      data-slot="table-filter-tag"
      className={cn(
        "inline-flex min-h-8 items-center overflow-hidden rounded-lumen-control border border-lumen-control-border bg-lumen-surface text-xs text-lumen-foreground",
        className,
      )}
      {...props}
    >
      <span className="px-2.5">
        <span className="font-semibold">{label}:</span> {value}
      </span>
      <button
        type="button"
        aria-label={removeLabel}
        onClick={onRemove}
        className="grid min-h-8 min-w-8 place-items-center border-l border-lumen-border text-base leading-none text-lumen-muted-foreground outline-none hover:bg-lumen-surface-muted hover:text-lumen-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lumen-focus"
      >
        <span aria-hidden="true">×</span>
      </button>
    </li>
  );
}

interface TableBatchActionsProps extends React.ComponentProps<"div"> {
  selectedCount: number;
  totalCount?: number;
  selectionLabel?: React.ReactNode;
}

function TableBatchActions({ children, className, selectedCount, selectionLabel, totalCount, ...props }: TableBatchActionsProps) {
  if (selectedCount < 1) return null;

  const defaultLabel = totalCount === undefined
    ? `${selectedCount} selected`
    : `${selectedCount} of ${totalCount} selected`;

  return (
    <div data-slot="table-batch-actions" className={cn("flex flex-wrap items-center gap-3 border-l-4 border-lumen-primary bg-lumen-primary/10 px-4 py-2.5 text-lumen-foreground", className)} {...props}>
      <span role="status" aria-live="polite" className="mr-auto text-sm font-semibold">
        {selectionLabel ?? defaultLabel}
      </span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

interface TableSelectionCellProps {
  as?: "td" | "th";
  className?: string;
  inputProps?: Omit<React.ComponentProps<typeof Checkbox>, "aria-label">;
  label: string;
}

function TableSelectionCell({ as: Component = "td", className, inputProps, label }: TableSelectionCellProps) {
  return (
    <Component
      data-slot="table-selection-cell"
      className={cn("w-12 px-3 py-3 text-center align-middle", className)}
      {...(Component === "th" ? { scope: "col" as const } : {})}
    >
      <Checkbox aria-label={label} {...inputProps} />
    </Component>
  );
}

type TableSortDirection = "ascending" | "descending" | "none";

interface TableSortableHeadProps extends Omit<React.ComponentProps<"th">, "aria-sort"> {
  buttonClassName?: string;
  direction?: TableSortDirection;
  onSort?: React.MouseEventHandler<HTMLButtonElement>;
  sortable?: boolean;
}

const headCellClassName =
  "px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-lumen-muted-foreground";

function TableSortGlyph({ direction }: { direction: TableSortDirection }) {
  const common = {
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "size-3.5",
  };

  if (direction === "ascending") {
    return <svg aria-hidden="true" {...common}><path d="M4 9.5l4-4 4 4" /></svg>;
  }
  if (direction === "descending") {
    return <svg aria-hidden="true" {...common}><path d="M4 6.5l4 4 4-4" /></svg>;
  }
  return (
    <svg aria-hidden="true" {...common}>
      <path d="M5 6.5l3-3 3 3" />
      <path d="M5 9.5l3 3 3-3" />
    </svg>
  );
}

function TableSortableHead({ buttonClassName, children, className, direction = "none", onSort, sortable = true, ...props }: TableSortableHeadProps) {
  if (!sortable) {
    return <th scope="col" className={cn(headCellClassName, className)} {...props}>{children}</th>;
  }

  const isActive = direction !== "none";

  return (
    <th scope="col" aria-sort={direction} data-slot="table-sortable-head" className={cn("p-0", className)} {...props}>
      <button
        type="button"
        onClick={onSort}
        data-active={isActive || undefined}
        className={cn(
          "group flex min-h-11 w-full items-center gap-1.5 px-3 py-2 text-left outline-none transition-colors hover:bg-lumen-surface-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lumen-focus data-[active]:text-lumen-foreground motion-reduce:transition-none",
          headCellClassName,
          buttonClassName,
        )}
      >
        <span>{children}</span>
        <span
          aria-hidden="true"
          className={cn(
            "shrink-0 transition-opacity motion-reduce:transition-none",
            isActive ? "text-lumen-primary" : "text-lumen-muted-foreground opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
          )}
        >
          <TableSortGlyph direction={direction} />
        </span>
      </button>
    </th>
  );
}

function TableRowActions({ className, ...props }: React.ComponentProps<"td">) {
  return <td data-slot="table-row-actions" className={cn("px-3 py-2 text-right align-middle", className)} {...props} />;
}

interface TableEmptyStateProps extends Omit<React.ComponentProps<"tr">, "children" | "title"> {
  action?: React.ReactNode;
  colSpan: number;
  description?: React.ReactNode;
  title: React.ReactNode;
}

function TableEmptyState({ action, className, colSpan, description, title, ...props }: TableEmptyStateProps) {
  return (
    <tr data-slot="table-empty-state" className={className} {...props}>
      <td colSpan={colSpan} className="px-4 py-12 text-center">
        <strong className="block text-base text-lumen-foreground">{title}</strong>
        {description ? <p className="mx-auto mt-1 max-w-lg text-sm text-lumen-muted-foreground">{description}</p> : null}
        {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
      </td>
    </tr>
  );
}

interface TablePaginationProps extends React.ComponentProps<"div"> {
  end: number;
  rangeLabel?: React.ReactNode;
  start: number;
  total: number;
}

function TablePagination({ children, className, end, rangeLabel, start, total, ...props }: TablePaginationProps) {
  return (
    <div data-slot="table-pagination" className={cn("flex flex-col gap-3 border border-t-0 border-lumen-border bg-lumen-surface px-3 py-3 sm:flex-row sm:items-center", className)} {...props}>
      <p className="mr-auto text-sm text-lumen-muted-foreground">{rangeLabel ?? `Showing ${start}–${end} of ${total}`}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

function TableSortAnnouncement({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="table-sort-announcement" role="status" aria-live="polite" className={cn("sr-only", className)} {...props} />;
}

export {
  TableAppliedFilters,
  TableBatchActions,
  TableEmptyState,
  TableFilterTag,
  TablePagination,
  TableRowActions,
  TableSelectionCell,
  TableSortAnnouncement,
  TableSortableHead,
  TableToolbar,
  TableToolbarActions,
  TableToolbarContent,
  TableToolbarDescription,
  TableToolbarFilters,
  TableToolbarHeader,
  TableToolbarTitle,
  type TableAppliedFiltersProps,
  type TableBatchActionsProps,
  type TableEmptyStateProps,
  type TableFilterTagProps,
  type TablePaginationProps,
  type TableSelectionCellProps,
  type TableSortableHeadProps,
  type TableSortDirection,
  type TableToolbarTitleProps,
};
