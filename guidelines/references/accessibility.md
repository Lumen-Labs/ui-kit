# Lumen Accessibility Requirements

Use WCAG 2.2 AA where practical and never regress below the source kit's WCAG 2.1 AA baseline.

## Perceivable

- Maintain at least 4.5:1 contrast for normal text and 3:1 for large text.
- Maintain at least 3:1 contrast for focus indicators and meaningful non-text UI boundaries.
- Do not communicate status, validation, or selection through color alone.
- Provide useful alternative text for informative images and empty alternative text for decorative images.
- Support zoom, text enlargement, and content reflow without loss of information or controls.

## Operable

- Make every action reachable and usable with a keyboard.
- Preserve a logical tab order; do not use positive `tabIndex` values.
- Provide a visible focus indicator and do not remove outlines without an accessible replacement.
- Ensure targets remain comfortably operable on touch screens.
- Respect `prefers-reduced-motion` and avoid essential meaning that depends on animation.
- Keep animated status, progress, and data-flow visuals supplementary to visible text. Avoid rapid flashes, motion-triggered layout shifts, and essential autoplaying sequences.
- Provide skip navigation when repeated page chrome precedes the main content.

## Understandable

- Use persistent visible labels for form fields whenever practical.
- Keep visual label metadata outside the native `label` unless it is genuinely part of the control name. Reflect required state with the native `required` attribute in addition to visible text.
- Associate sublabels, persistent help, current-value text, character counts, and errors with `aria-describedby`.
- Use native `fieldset` and `legend` for a related radio group. Give every checkbox, radio, and switch a concise visible label.
- Use `role="switch"` only for an immediate binary setting and keep its native checked state synchronized.
- Preserve native form-control behavior in forced-colors mode and verify disabled, read-only, invalid, checked, indeterminate, and focus-visible states.
- State the problem and recovery step in validation messages.
- Keep navigation and component behavior consistent.
- Give every Next.js route a unique descriptive title; route announcements use the document title, then the `h1`, then the URL.

## Robust semantics

- Prefer native `button`, `a`, `input`, `select`, `textarea`, `details`, and `dialog` semantics.
- Use a link for navigation and a button for an action.
- Use ARIA only to supplement correct semantics; keep roles, names, states, and properties synchronized.
- Give icon-only controls an accessible name.
- Use landmarks and semantic headings to expose page structure.

## Dialog checklist

- Give the dialog an accessible name and, when useful, a description.
- Move focus to a meaningful element when it opens.
- Keep focus within a modal dialog while open.
- Close on Escape unless doing so would lose critical data without warning.
- Provide a visible close or cancel control.
- Restore focus to the invoking control or the next logical location after closing.
- Prevent background interaction while modal.

Prefer a mature dialog primitive such as Radix Dialog when the repository already uses one. Verify its configuration rather than assuming the dependency alone guarantees accessibility.

## Responsive navigation checklist

- Give every menu trigger a visible or programmatic name and expose expanded state.
- Remove hidden desktop navigation from the tab order; do not leave two focusable copies of the same destinations.
- Keep focus trapped inside an open navigation drawer, support Escape, provide a visible close action, and restore focus to the trigger.
- Give each navigation landmark a distinct label and expose current page or location with `aria-current` plus a cue that does not rely on color.
- Keep primary content before contextual rails in reading order, including when the rail becomes a post-content disclosure.

## Filtered-table checklist

- Keep every search and filter field visibly labeled.
- Announce result-count changes politely without moving focus.
- Represent applied filters as a semantic list and give every remove control a specific accessible name.
- Provide clear-filter and clear-selection recovery actions.
- When filters produce no results, explain the state and provide an action that restores useful results.
- Keep horizontal scrolling on a uniquely labeled, keyboard-focusable table container; the surrounding page and toolbar must still reflow.

## Relationship-graph checklist

- Give the canvas a domain-specific accessible name and preserve concise names for every focusable node and relationship.
- Keep Tab, Enter/Space selection, Escape clearing, and Shift+Arrow movement available for every rendered node and semantic cluster. Disable deletion and connection shortcuts for the read-only explorer.
- Keep node label and relationship type text visible at usable detail scales. In semantic overview, visual labels may hide only when every cluster/node/relationship retains a meaningful accessible name and the searchable legend and live source counts preserve the category and result context.
- Make clustered entities focusable and describe their member count, matched count, dominant category, and expansion action. Cluster IDs and aggregate relationships are presentational and must not replace controlled domain selection.
- Return selected and keyboard-focused nonmatches to full contrast and announce highlighted counts without moving focus.
- Give filter facets visible labels, represent applied filters as a list, and name every removal action specifically.
- Keep facet-local search separate from controlled graph filtering, announce empty facet searches, and expose source counts without folding them into checkbox names.
- Name every icon-only viewport action and provide concise tooltips; disable Center selection natively when no entity is selected.
- Keep the legend searchable and keyboard-operable with noncolor markers, visible category/type names, counts, and pressed state.
- In expanded view, preserve the mounted canvas, lock background scrolling, exit on Escape, and restore focus to the expand control without clearing graph state.
- Below 768px, move facets into a focus-managed Drawer and secondary viewport tools into a named overflow menu; both close on Escape and restore focus.
- Below the inspector breakpoint, trap focus in the Drawer, close on Escape, expose a visible close action, and restore focus to the selected graph entity.
- Test pan, zoom, Fit, Reflow, dragging, long labels, dense edges, 200% zoom, and 320px reflow without page-level overflow.

## Testing

Automated checks:

- Run the repository's ESLint accessibility rules and component tests.
- Check accessible names, roles, landmark presence, and obvious contrast failures.
- Test focus transitions and dialog behavior in interaction tests where the project supports them.

Manual checks:

- Navigate the complete flow with keyboard only.
- Verify focus is always visible and never trapped unintentionally.
- Test at 200% zoom and a narrow viewport.
- Test responsive shell and filter behavior at 320, 768, 1024, and 1440 CSS pixels.
- Inspect with a screen reader for names, roles, states, errors, and route changes.
- Test reduced motion and high-contrast or low-vision settings when supported.
- Confirm opt-in section entrances settle immediately and ambient data-flow visuals stop when reduced motion is enabled.

Automated tools cannot establish full accessibility conformance; retain the manual pass for meaningful UI changes.

## Source basis

This checklist consolidates WCAG, USWDS, and the component-specific sources recorded in [attribution.md](attribution.md).
