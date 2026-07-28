# React and Next.js Implementation

## Establish local truth

Before coding, inspect `package.json`, local agent instructions, the router structure, styling configuration, existing primitives, and representative neighboring components. If the installed Next.js package includes `node_modules/next/dist/docs/`, read the relevant App Router, CSS, image, font, accessibility, or API guide. Installed documentation overrides remembered conventions.

Do not force a repository onto the exact Pipeer stack. Lumen supports current React and Next.js applications whether they use Tailwind, CSS Modules, global CSS variables, shadcn/Radix, or another established component layer.

When `lumen-ui-kit` or a local `ui-kit/` package exists, read [package-api.md](package-api.md) and use its public entrypoints before introducing application-local copies.

## Component boundaries

- Keep pages, layouts, and noninteractive composition as Server Components by default.
- Keep `GlobalHeader`, `AppShell`, side-navigation markup, page structure, and native table markup server-renderable. Introduce a small Client Component only for the Radix navigation drawer, filter popover state, controlled filtering/selection, or other browser interaction.
- Keep `SectionStack` and the `SectionBand` family server-rendered. Their optional entrance motion is CSS-only and does not justify a Client Component.
- Add `'use client'` only where browser APIs, event handlers, client hooks, or interactive state require it.
- Place the boundary around the smallest coherent interactive subtree.
- Pass serializable data from Server Components to Client Components.
- Treat `lumen-ui-kit/graph` as a deliberate Client Component boundary. Fetch, authorize, and bound graph records on the server, then pass serializable nodes and relationships into a small controlled explorer wrapper. The packaged graph worker is created only by this boundary and receives compact topology rather than application property payloads.
- Do not move data fetching or static composition to the client merely to style it.
- Compose existing primitives instead of duplicating focus management, portals, positioning, or keyboard behavior.

## Styling and tokens

### CSS variables and Tailwind

Map Lumen palette values into the project's semantic variables, then expose those variables through the existing Tailwind theme when applicable. Component markup should use semantic utilities such as `bg-primary`, `text-foreground`, or `border-input`, not repeated raw hex values.

With Tailwind CSS 4, follow the repository's CSS-first theme setup and installed Next.js guidance. Do not add a legacy Tailwind configuration file unless the project already uses one or the task explicitly requires it.

### CSS Modules or CSS-in-JS

Use locally scoped classes and reference centralized custom properties or theme values. Confirm that a CSS-in-JS library supports the repository's Server Component model before adopting it.

### Existing design systems

When shadcn, Radix, or another library is present:

- Preserve its accessible behavior and public API.
- Adjust semantic theme variables and variants before forking implementation internals.
- Keep `data-*` state selectors used by the primitive.
- Use the repository's established icon library and sizing conventions.

## React behavior

- Prefer controlled state only when the parent must own the value; avoid unnecessary state mirroring.
- Keep interactive state local to the smallest owner.
- Use stable keys derived from data.
- Preserve native form submission and validation semantics unless product requirements need custom behavior.
- Expose pending state without changing control width or losing the accessible label.
- Avoid effects for calculations that can occur during render.

## Next.js page quality

- Give each route a unique descriptive metadata title and a meaningful `h1` so route announcements are useful.
- Use `next/link` for internal navigation and buttons for mutations or local actions.
- Use the framework's current image and font APIs according to installed documentation.
- Prevent hydration mismatches by keeping browser-only values out of the server render or handling them after hydration in a deliberately isolated client component.
- Preserve loading, error, and not-found conventions already established by the router.

## Responsive implementation

- Start with the narrow layout and add space as the viewport grows.
- Test approximately 320px, 768px, 1024px, and a wide desktop size, plus any repository-specific breakpoints.
- Use logical properties when they improve right-to-left behavior.
- Test real long labels, errors, localized text, empty content, and dense data.
- Avoid viewport-height traps on mobile; account for dynamic browser chrome when using full-height layouts.
- At the shell level, switch persistent navigation to an off-canvas drawer below 1024px and persistent contextual rails to a post-content disclosure below 1280px. Do not duplicate focusable navigation at a breakpoint.
- For complex tables, switch labeled inline attribute filters to a popover below 640px while keeping search full width and the native table inside its own labeled overflow container.
- For contiguous section bands, keep shared outer seams while changing the inner composition from two columns to one. Never remove internal insets merely to achieve an edge-to-edge rhythm.
- Let `GraphExplorer` respond to its own container: it joins the inspector at 1024px and uses a Drawer below that width. Test this behavior inside constrained dashboards and workbench previews, not only against the browser viewport.
- For low-thousands graphs, test overview, compact, and detail zoom independently. Confirm the worker asset resolves under the application's deployed base path, source counts remain stable, rendered counts stay within configured budgets, and hidden visual labels retain accessible names.

## Verification

Run the target repository's focused tests, linter, type checker, and build as appropriate. For interactive UI, verify in a real browser when browser tooling is available:

- No runtime, hydration, or accessibility console errors.
- Keyboard order and focus restoration are correct.
- Dialog portals and overlays layer correctly.
- Narrow and wide layouts do not clip or overflow.
- Reduced-motion settings suppress nonessential transitions.
- Server/client boundaries remain intentional.

When reporting completion, name the checks actually run and any manual checks that remain.
