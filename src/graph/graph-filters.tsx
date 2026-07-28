"use client";

import * as React from "react";

import { Button } from "../components/button";
import { Checkbox, Legend, SearchInput } from "../components/forms";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/interactive";
import { cn } from "../lib/cn";
import {
  filterGraphFacetOptions,
  type GraphFacetCounts,
} from "./graph-facets";
import type {
  GraphCategoryTone,
  GraphFacets,
  GraphFilterState,
  GraphMatches,
} from "./model";
import { getGraphTone } from "./model";

interface GraphFiltersProps {
  counts: GraphFacetCounts;
  facets: GraphFacets;
  filterState: GraphFilterState;
  matches: GraphMatches;
  onFilterStateChange: (next: GraphFilterState) => void;
}

type GraphFacetKind = "node-label" | "relationship-type";

const facetCopy: Record<GraphFacetKind, {
  clearLabel: string;
  description: string;
  searchLabel: string;
  title: string;
}> = {
  "node-label": {
    clearLabel: "Clear node label filters",
    description: "Match any selected label",
    searchLabel: "Search node labels",
    title: "Node labels",
  },
  "relationship-type": {
    clearLabel: "Clear relationship type filters",
    description: "Match any selected relationship type",
    searchLabel: "Search relationship types",
    title: "Relationship types",
  },
};

function toggleValue(values: readonly string[], value: string): readonly string[] {
  return values.includes(value)
    ? values.filter((candidate) => candidate !== value)
    : [...values, value];
}

export function GraphFacetPanel({
  kind,
  options,
  selected,
  counts,
  onChange,
}: {
  counts?: ReadonlyMap<string, number>;
  kind: GraphFacetKind;
  onChange: (values: readonly string[]) => void;
  options: readonly string[];
  selected: readonly string[];
}) {
  const copy = facetCopy[kind];
  const idPrefix = React.useId().replaceAll(":", "");
  const descriptionId = `${idPrefix}-description`;
  const [query, setQuery] = React.useState("");
  const visibleOptions = React.useMemo(
    () => [...filterGraphFacetOptions(options, query)].sort((left, right) => {
      const selectedOrder = Number(selected.includes(right)) - Number(selected.includes(left));
      return selectedOrder || left.localeCompare(right);
    }),
    [options, query, selected],
  );

  return (
    <div data-slot="graph-facet-panel" data-facet={kind} className="graph-filter__popover-panel">
      <div className="graph-filter__popover-header">
        <div>
          <strong className="graph-filter__popover-title">{copy.title}</strong>
          <p id={descriptionId}>{copy.description}</p>
        </div>
        <span className="graph-filter__selection-summary">
          {selected.length === 0 ? "All values" : `${selected.length} selected`}
        </span>
      </div>

      <SearchInput
        aria-label={copy.searchLabel}
        placeholder="Find a value"
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
        className="graph-filter__facet-search"
      />

      <fieldset className="graph-filter__options" aria-describedby={descriptionId}>
        <Legend className="sr-only">{copy.title}</Legend>
        <div className="graph-filter__options-list">
          {visibleOptions.map((option) => {
            const id = `${idPrefix}-${option.toLocaleLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`;
            const isSelected = selected.includes(option);
            return (
              <label
                key={option}
                htmlFor={id}
                data-selected={isSelected || undefined}
                className="graph-filter__option"
              >
                <Checkbox
                  id={id}
                  checked={isSelected}
                  onChange={() => onChange(toggleValue(selected, option))}
                />
                <span
                  aria-hidden="true"
                  data-tone={kind === "node-label" ? getGraphTone(option) : undefined}
                  className={cn(
                    "graph-filter__option-marker",
                    kind === "relationship-type" &&
                      "graph-filter__option-marker--relationship",
                  )}
                />
                <span className="graph-filter__option-label">{option}</span>
                <span className="graph-filter__option-count" aria-hidden="true">
                  {counts?.get(option) ?? 0}
                </span>
              </label>
            );
          })}
          {visibleOptions.length === 0 ? (
            <div className="graph-filter__no-options" role="status">
              No values match “{query.trim()}”.
            </div>
          ) : null}
        </div>
      </fieldset>

      <div className="graph-filter__popover-footer">
        <span>{selected.length} of {options.length} selected</span>
        <Button
          type="button"
          size="small"
          variant="ghost"
          aria-label={copy.clearLabel}
          disabled={selected.length === 0}
          onClick={() => onChange([])}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

function FacetPopover({
  counts,
  kind,
  options,
  selected,
  onChange,
}: {
  counts: ReadonlyMap<string, number>;
  kind: GraphFacetKind;
  onChange: (values: readonly string[]) => void;
  options: readonly string[];
  selected: readonly string[];
}) {
  const copy = facetCopy[kind];
  const selectionLabel = selected.length === 0 ? "all values" : `${selected.length} selected`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="small"
          variant="secondary"
          className="graph-filter__trigger graph-filter__toolbar-control"
          data-facet={kind}
          data-selected-count={selected.length}
          aria-label={`${copy.title}: ${selectionLabel}`}
        >
          <span>{copy.title}</span>
          <span className="graph-filter__trigger-state" aria-hidden="true">
            {selected.length === 0 ? "All" : selected.length}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="graph-filter__popover p-0">
        <GraphFacetPanel
          counts={counts}
          kind={kind}
          options={options}
          selected={selected}
          onChange={onChange}
        />
      </PopoverContent>
    </Popover>
  );
}

function GraphFilterTag({
  children,
  onRemove,
  removeLabel,
}: {
  children: React.ReactNode;
  onRemove: () => void;
  removeLabel: string;
}) {
  return (
    <li className="graph-filter-tag">
      <span>{children}</span>
      <button type="button" aria-label={removeLabel} onClick={onRemove}>
        <span aria-hidden="true">×</span>
      </button>
    </li>
  );
}

function MobileFacetDrawer({
  counts,
  facets,
  filterState,
  onFilterStateChange,
  children,
}: Pick<GraphFiltersProps, "counts" | "facets" | "filterState" | "onFilterStateChange"> & {
  children: React.ReactNode;
}) {
  return (
    <Drawer>
      {children}
      <DrawerContent side="right" className="graph-filter__drawer">
        <div className="graph-filter__drawer-header">
          <div>
            <DrawerTitle>Graph filters</DrawerTitle>
            <DrawerDescription>Highlight entities that match any selected value in each facet.</DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button size="small" variant="ghost">Done</Button>
          </DrawerClose>
        </div>
        <GraphFacetPanel
          counts={counts.nodeLabels}
          kind="node-label"
          options={facets.nodeLabels}
          selected={filterState.nodeLabels}
          onChange={(nodeLabels) => onFilterStateChange({ ...filterState, nodeLabels })}
        />
        <GraphFacetPanel
          counts={counts.relationshipTypes}
          kind="relationship-type"
          options={facets.relationshipTypes}
          selected={filterState.relationshipTypes}
          onChange={(relationshipTypes) =>
            onFilterStateChange({ ...filterState, relationshipTypes })
          }
        />
      </DrawerContent>
    </Drawer>
  );
}

export function GraphFilters({
  counts,
  facets,
  filterState,
  matches,
  onFilterStateChange,
}: GraphFiltersProps) {
  const activeFilterCount =
    (filterState.query ? 1 : 0) +
    filterState.nodeLabels.length +
    filterState.relationshipTypes.length;
  const clearFilters = () =>
    onFilterStateChange({ query: "", nodeLabels: [], relationshipTypes: [] });
  const resultLabel = `${matches.matchingNodeIds.size} of ${matches.totalNodes} nodes · ${matches.matchingRelationshipIds.size} of ${matches.totalRelationships} relationships`;

  return (
    <div data-slot="graph-filter-region" className="graph-filter-region">
      <div role="toolbar" aria-label="Graph filters" className="graph-filter-toolbar">
        <SearchInput
          aria-label="Search graph"
          placeholder="Search names, labels, types, and properties"
          value={filterState.query}
          onChange={(event) =>
            onFilterStateChange({ ...filterState, query: event.currentTarget.value })
          }
          className="graph-filter__search graph-filter__toolbar-control"
        />
        <div className="graph-filter__desktop-facets">
          <FacetPopover
            counts={counts.nodeLabels}
            kind="node-label"
            options={facets.nodeLabels}
            selected={filterState.nodeLabels}
            onChange={(nodeLabels) => onFilterStateChange({ ...filterState, nodeLabels })}
          />
          <FacetPopover
            counts={counts.relationshipTypes}
            kind="relationship-type"
            options={facets.relationshipTypes}
            selected={filterState.relationshipTypes}
            onChange={(relationshipTypes) =>
              onFilterStateChange({ ...filterState, relationshipTypes })
            }
          />
        </div>
        <MobileFacetDrawer
          counts={counts}
          facets={facets}
          filterState={filterState}
          onFilterStateChange={onFilterStateChange}
        >
          <DrawerTrigger asChild>
            <Button
              size="small"
              variant="secondary"
              className="graph-filter__mobile-trigger graph-filter__toolbar-control"
              aria-label="Open graph filters"
            >
              Filters
              <span className="graph-filter__active-count" aria-hidden="true">{activeFilterCount}</span>
            </Button>
          </DrawerTrigger>
        </MobileFacetDrawer>
        {activeFilterCount > 0 ? (
          <span className="graph-filter__active-summary">{activeFilterCount} active</span>
        ) : null}
        <span role="status" aria-live="polite" className="graph-filter__status">
          {resultLabel}
        </span>
      </div>

      {activeFilterCount > 0 ? (
        <div className="graph-applied-filters">
          <span className="graph-applied-filters__label">Applied filters</span>
          <ul>
            {filterState.query ? (
              <GraphFilterTag
                removeLabel={`Remove search filter ${filterState.query}`}
                onRemove={() => onFilterStateChange({ ...filterState, query: "" })}
              >
                Search: {filterState.query}
              </GraphFilterTag>
            ) : null}
            {filterState.nodeLabels.map((label) => (
              <GraphFilterTag
                key={label}
                removeLabel={`Remove node label filter ${label}`}
                onRemove={() =>
                  onFilterStateChange({
                    ...filterState,
                    nodeLabels: filterState.nodeLabels.filter((value) => value !== label),
                  })
                }
              >
                Label: {label}
              </GraphFilterTag>
            ))}
            {filterState.relationshipTypes.map((type) => (
              <GraphFilterTag
                key={type}
                removeLabel={`Remove relationship type filter ${type}`}
                onRemove={() =>
                  onFilterStateChange({
                    ...filterState,
                    relationshipTypes: filterState.relationshipTypes.filter(
                      (value) => value !== type,
                    ),
                  })
                }
              >
                Relationship: {type}
              </GraphFilterTag>
            ))}
          </ul>
          <span className="graph-applied-filters__mobile-summary">{activeFilterCount} filters applied</span>
          <MobileFacetDrawer
            counts={counts}
            facets={facets}
            filterState={filterState}
            onFilterStateChange={onFilterStateChange}
          >
            <DrawerTrigger asChild>
              <Button
                size="small"
                variant="ghost"
                className="graph-applied-filters__mobile-edit"
                aria-label="Edit graph filters"
              >
                Edit
              </Button>
            </DrawerTrigger>
          </MobileFacetDrawer>
          <Button
            size="small"
            variant="ghost"
            className="graph-applied-filters__clear"
            onClick={clearFilters}
          >
            Clear filters
          </Button>
          <Button
            size="small"
            variant="ghost"
            className="graph-applied-filters__mobile-clear"
            aria-label="Clear graph filters"
            onClick={clearFilters}
          >
            Clear
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function GraphLegend({
  counts,
  labels,
  relationshipTypes,
  selectedLabels,
  selectedRelationshipTypes,
  onLabelsChange,
  onRelationshipTypesChange,
  className,
}: {
  className?: string;
  counts: GraphFacetCounts;
  labels: readonly string[];
  onLabelsChange: (labels: readonly string[]) => void;
  onRelationshipTypesChange: (types: readonly string[]) => void;
  relationshipTypes: readonly string[];
  selectedLabels: readonly string[];
  selectedRelationshipTypes: readonly string[];
}) {
  const [query, setQuery] = React.useState("");
  const visibleLabels = filterGraphFacetOptions(labels, query);
  const visibleTypes = filterGraphFacetOptions(relationshipTypes, query);

  return (
    <div className={cn("graph-legend", className)} aria-label="Graph legend">
      <div className="graph-legend__header">
        <div>
          <strong>Graph legend</strong>
          <span>Filter the visible emphasis by category or relationship.</span>
        </div>
        <SearchInput
          aria-label="Search graph legend"
          placeholder="Find legend values"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
      </div>
      <div className="graph-legend__sections">
        <section aria-labelledby="graph-legend-nodes">
          <h3 id="graph-legend-nodes">Node categories</h3>
          <ul>
            {visibleLabels.map((label) => {
              const tone: GraphCategoryTone = getGraphTone(label);
              return (
                <li key={label}>
                  <button
                    type="button"
                    aria-pressed={selectedLabels.includes(label)}
                    onClick={() => onLabelsChange(toggleValue(selectedLabels, label))}
                  >
                    <span aria-hidden="true" data-tone={tone} className="graph-legend__marker" />
                    <span>{label}</span>
                    <span>{counts.nodeLabels.get(label) ?? 0}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
        <section aria-labelledby="graph-legend-relationships">
          <h3 id="graph-legend-relationships">Relationship types</h3>
          <ul>
            {visibleTypes.map((type) => (
              <li key={type}>
                <button
                  type="button"
                  aria-pressed={selectedRelationshipTypes.includes(type)}
                  onClick={() =>
                    onRelationshipTypesChange(toggleValue(selectedRelationshipTypes, type))
                  }
                >
                  <span aria-hidden="true" className="graph-legend__relationship-marker">→</span>
                  <span>{type}</span>
                  <span>{counts.relationshipTypes.get(type) ?? 0}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
      {visibleLabels.length === 0 && visibleTypes.length === 0 ? (
        <p className="graph-legend__empty" role="status">No legend values match “{query.trim()}”.</p>
      ) : null}
    </div>
  );
}

export function GraphKeyboardHelp() {
  return (
    <div className="graph-keyboard-help">
      <strong>Graph keyboard shortcuts</strong>
      <dl>
        <div><dt>Arrow keys</dt><dd>Move the graph cursor</dd></div>
        <div><dt>Shift + Arrow</dt><dd>Reposition a node</dd></div>
        <div><dt>Enter or Space</dt><dd>Select or expand</dd></div>
        <div><dt>Escape</dt><dd>Clear selection or close a panel</dd></div>
      </dl>
    </div>
  );
}
