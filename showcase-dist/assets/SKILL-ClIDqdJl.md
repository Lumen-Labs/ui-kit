---
name: lumen-ui-kit
description: Build and review accessible React and Next.js interfaces using the Lumen design system. Use when creating or modifying pages, layouts, components, forms, dialogs, dashboards, navigation, themes, design tokens, or UI audits that should follow Lumen visual direction, component rules, product patterns, and WCAG guidance.
---

# Lumen UI Kit

Apply Lumen as a design-system layer while respecting the target repository's architecture and established component primitives.

## Workflow

1. Inspect the repository before editing.
   - Read local agent instructions, package metadata, styling configuration, global styles, and nearby components.
   - Identify the installed React and Next.js versions, router, component library, icon set, token system, and test commands.
   - When `node_modules/next/dist/docs/` exists, read the relevant bundled Next.js guide before writing framework code. Do not rely on remembered APIs when local documentation is available.
2. Load only the references needed for the task.
   - Always read [foundations.md](references/foundations.md).
   - Read [components.md](references/components.md) for buttons, inputs, cards, or dialogs.
   - Read [product-patterns.md](references/product-patterns.md) for shells, navigation, tables, forms, prompt composers, empty states, or errors.
   - Read [accessibility.md](references/accessibility.md) for implementation and review checks.
   - Read [react-nextjs.md](references/react-nextjs.md) before implementing React or Next.js UI.
   - Read [package-api.md](references/package-api.md) when `lumen-ui-kit` or a local `ui-kit/` package is available.
   - Read [graph.md](references/graph.md) for relationship explorers, service topology, knowledge graphs, or node-and-edge filtering and inspection.
   - Read [automation.md](references/automation.md) only for token pipelines, MCP tools, audits, or releases.
   - Read [attribution.md](references/attribution.md) before redistributing or substantially rewriting the bundled guidance.
3. Integrate rather than replace.
   - Prefer the public `lumen-ui-kit` components and Next.js adapters when the package is available; do not copy their implementation into applications.
   - Map Lumen decisions onto existing semantic CSS variables, Tailwind theme values, CSS Modules, or theme objects.
   - Reuse and extend established primitives such as Radix or shadcn components when they already satisfy the required behavior.
   - Preserve public props and behavior unless the task explicitly authorizes an API change.
4. Implement content-first UI.
   - Use components to clarify tasks and hierarchy, not as decoration.
   - Prefer semantic HTML and native controls. Add ARIA only when native semantics are insufficient.
   - Keep React Server Components as the default in Next.js. Add a client boundary only for browser APIs, event handlers, or interactive state, and keep it as small as practical.
5. Verify the result.
   - Run the repository's focused tests, lint, and type checks.
   - Check narrow and wide layouts, realistic content, light/dark themes when supported, keyboard flow, focus visibility, contrast, reduced motion, loading, empty, error, disabled, and validation states.

## Lumen Invariants

- Treat [core.tokens.json](assets/core.tokens.json) as the canonical portable token bundle. Do not scatter raw values when a semantic project token can represent the decision.
- Keep Lumen as the default palette. When Brainapi is requested, select it at a shared boundary with `data-lumen-palette="brainapi"` and consume the remapped semantic tokens; its fixed-dark contract is primary `#CFFE25`, secondary `#FFFFFF`, and background `#000000`.
- In Brainapi, keep structural borders dark and quiet through `--lumen-color-border`; use `--lumen-color-control-border` only where an idle interactive boundary must remain distinguishable.
- Treat Brainapi white as a brand/content secondary, not a neutral button fill. Use the dark action-secondary tokens for secondary buttons and toolbar items, and use the dark on-primary treatment for marks drawn on lime controls.
- Keep formatted source in semantic `pre`/`code` markup. Use `CodeBlock` and named `CodeToken` syntax roles; both Lumen and Brainapi code canvases are explicitly dark, with Brainapi fixed to its near-black code tokens.
- Maintain calm hierarchy, restrained color, clear typography, and spacing based on the 4px rhythm.
- Use the Lumen layout tokens for the 56px header, 240px sidebar, 272px rail, and 16/24px page insets. Keep text-like fields and toolbar wrappers at a 10px radius, the compound prompt-composer shell and its Send/Stop action at 14px, ordinary buttons and segmented toolbar edges at the 8px button radius, compact controls at the 6px control radius, and structural shell/table surfaces square.
- Below 1024px, compose persistent navigation into the existing focus-managed Drawer; below 1280px, place rail context after the main task in a compact disclosure. Keep table search full width and move labeled attribute filters into a popover below 640px.
- Use noncolor cues for status and validation.
- Preserve visible labels whenever practical; associate labels, help text, and errors programmatically.
- Use native `disabled` behavior for unavailable controls; styling or `pointer-events` alone is insufficient.
- Manage dialog focus, Escape behavior, labeling, and focus restoration with a proven primitive or a complete accessible implementation.
- Avoid hiding essential task information behind disclosure or modal UI.
- Support a squared "enterprise" expression (near-square corners, hairline dividers, hard offset shadows) as a token-level variant; do not redefine the calm defaults to achieve it, and do not mix expressions within one surface.
- Build assistant and chat inputs as the prompt composer recipe from native controls: a bottom-docked, auto-growing field with Enter-to-send/Shift+Enter-newline, a visible named submit-or-stop control, and a secondary control toolbar.
- Keep relationship explorers behind the optional client-only graph entrypoint. Preserve source topology during filtering, keep graph state controlled, use retained vis-network Canvas2D physics plus the packaged Louvain community worker and semantic-zoom budgets for large datasets, and retain pinned dragged positions, keyboard selection, movement, focus, responsive inspection, accessible cluster names, and noncolor category labels.
- Compose graph exploration as a canvas-first workbench: one compact search/facet command bar, searchable counted facets and legend, grouped named viewport actions, responsive filter Drawer/overflow controls, and a non-remounting expanded view that preserves camera, selection, filters, positions, and worker state.
- Record any deliberate exception to the kit with a short rationale in the implementation or review notes.

## Review Output

When reviewing existing UI, report concrete findings by severity, identify the affected component or file, cite the relevant Lumen rule, and recommend the smallest compatible fix. Distinguish verified violations from visual preferences.
