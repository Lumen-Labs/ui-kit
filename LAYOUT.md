# Lumen Shell and Layout Guide

Use this guide to compose application headers, side navigation, page headers,
content regions, and responsive page structure from `lumen-ui-kit`.

Lumen separates three layers that are often all called “the header”:

1. The **global header** identifies the product and contains stable global
   navigation or account-level actions.
2. The **application shell** arranges persistent product navigation around the
   main content.
3. The **page header** names the current page and contains page-scoped context
   and actions.

Keeping these layers distinct prevents duplicate navigation, competing titles,
and oversized chrome.

## Choose the smallest shell that fits

| Product structure | Recommended composition | Avoid |
| --- | --- | --- |
| A shallow site with a few top-level destinations | Global header with horizontal primary navigation, then one `main` | Adding an empty or redundant sidebar |
| A focused workflow with no meaningful cross-product navigation | Minimal header, `Container`, and one `main` | Keeping full application chrome around a task that needs concentration |
| A product with several stable areas or nested local navigation | Global header plus `AppShell`, `AppShellSidebar`, and `SideNav` | Forcing deep submenus into a narrow horizontal header |
| A dense workspace, editor, or operations console | Global header plus shell; allow task content to use the available width | Constraining tables or canvases to prose width |
| A content or form page | `Container`, readable content width, `PageHeader`, and `Stack` | Stretching long text across the full viewport |

Header-only navigation works best when its labels fit comfortably and do not
need persistent submenus. Add a sidebar when the hierarchy is deeper or users
need to move repeatedly among related product areas. Do not show both forms of
navigation unless each has a separate global or local responsibility.

## Shell anatomy

Use this order in both the DOM and the visual layout:

1. `SkipLink` targeting the main content.
2. `GlobalHeader`, when the product needs persistent global chrome.
3. `AppShell`.
4. `AppShellSidebar` containing a uniquely labeled `SideNav`, when needed.
5. `AppShellMain` containing orientation, the page header, and page content.
6. An optional footer or contextual rail owned by the application.

Visual reordering must not contradict the DOM order. Screen-reader, keyboard,
and visual users should encounter the same hierarchy when the layout reflows.

### Shell dimensions

Use the shell tokens instead of repeating dimensions in component markup:

| Region | Token | Value |
| --- | --- | --- |
| Global header | `--lumen-layout-header-height` | 56px |
| Persistent sidebar | `--lumen-layout-sidebar-width` | 240px |
| Contextual rail | `--lumen-layout-rail-width` | 272px |
| Compact page inset | `--lumen-layout-page-inset-compact` | 16px |
| Standard page inset | `--lumen-layout-page-inset` | 24px |

These values follow Lumen's 4px rhythm. Controls keep the 6px control radius;
shell regions, table frames, and other structural surfaces remain square.

## Global header

Lumen ships an unbranded, composable global-header family. The consuming
application still owns product identity, route destinations, search behavior,
and account controls.

```tsx
import {
  Avatar,
  GlobalHeader,
  GlobalHeaderActions,
  GlobalHeaderBrand,
  GlobalHeaderInner,
  GlobalHeaderNav,
  GlobalHeaderNavItem,
  GlobalHeaderNavLink,
  GlobalHeaderNavList,
} from "lumen-ui-kit";

export function ProductHeader() {
  return (
    <GlobalHeader sticky>
      <GlobalHeaderInner>
        <GlobalHeaderBrand href="/">Lumen Cloud</GlobalHeaderBrand>
        <GlobalHeaderNav>
          <GlobalHeaderNavList>
            <GlobalHeaderNavItem><GlobalHeaderNavLink href="/workspaces">Workspaces</GlobalHeaderNavLink></GlobalHeaderNavItem>
            <GlobalHeaderNavItem><GlobalHeaderNavLink href="/reports" current>Reports</GlobalHeaderNavLink></GlobalHeaderNavItem>
            <GlobalHeaderNavItem><GlobalHeaderNavLink href="/settings">Settings</GlobalHeaderNavLink></GlobalHeaderNavItem>
          </GlobalHeaderNavList>
        </GlobalHeaderNav>
        <GlobalHeaderActions>
          <Avatar alt="Christian Nonis" fallback="CN" className="size-8" />
        </GlobalHeaderActions>
      </GlobalHeaderInner>
    </GlobalHeader>
  );
}
```

### Header rules

- Put product identity and product-level navigation toward the start; put
  account or system actions toward the end.
- Keep labels short and familiar. A header is not a sitemap.
- Use a link for destinations and a button for menus or local actions.
- Keep the header stable across related routes so users do not need to
  re-orient on every page.
- Prefer `position: sticky` because it remains in document flow. If a fixed
  header is required, reserve its exact block size so content and focus targets
  are never hidden behind it.
- Do not make a header sticky merely because it can be. Persistent chrome
  reduces the usable viewport, especially at zoom and on short screens.
- Below 1024px, remove persistent header navigation from the tab sequence and
  expose the same destinations through `Drawer side="left"`.
- The menu trigger must have a clear accessible name and expose expanded state.
  The drawer must trap focus, close on Escape and destination selection, provide
  a visible close action, and restore focus to its trigger.

## Application shell

`AppShell` switches to a 15rem sidebar and flexible content column at the
`lg` breakpoint. Set `layout="sidebar-rail"` to add a 17rem contextual rail at
`xl`. Below 1024px, hide the persistent sidebar and expose the same destinations
through the existing `Drawer`; do not stack a full navigation region before the
page content. Below 1280px, hide the persistent rail and place its content after
the main task in a compact `Disclosure` titled “Workspace context.”

`AppShell` does not own routing, mobile drawer state, or persistence of a user's
sidebar preference. Keep the shell primitives server-rendered and isolate the
drawer trigger/content in a small Client Component.

```tsx
import {
  AppShell,
  AppShellMain,
  AppShellRail,
  AppShellSidebar,
  AppShellSidebarContent,
  AppShellSidebarFooter,
  AppShellSidebarHeader,
  BackLink,
  Button,
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
  PageContent,
  PageSection,
  PageSectionContent,
  PageSectionDescription,
  PageSectionHeader,
  PageSectionTitle,
  SideNav,
  SideNavGroup,
  SideNavGroupLabel,
  SideNavItem,
  SideNavLink,
  SideNavList,
  SideNavNestedList,
  SkipLink,
  Stack,
} from "lumen-ui-kit";

import { ProductHeader } from "./product-header";

export function WorkspaceSettingsPage() {
  return (
    <>
      <SkipLink href="#main-content">Skip to content</SkipLink>
      <ProductHeader />

      <AppShell layout="sidebar-rail">
        <AppShellSidebar className="hidden lg:flex">
          <AppShellSidebarHeader>Workspace settings</AppShellSidebarHeader>
          <AppShellSidebarContent>
            <SideNav aria-label="Workspace settings">
              <SideNavList>
                <SideNavItem>
                  <SideNavLink href="/settings/general" current>
                    General
                  </SideNavLink>
                </SideNavItem>
                <SideNavGroup>
                  <SideNavGroupLabel>Administration</SideNavGroupLabel>
                  <SideNavNestedList>
                    <SideNavItem>
                      <SideNavLink href="/settings/members" depth={1}>Members</SideNavLink>
                    </SideNavItem>
                    <SideNavItem>
                      <SideNavLink href="/settings/security" depth={1}>Security</SideNavLink>
                    </SideNavItem>
                  </SideNavNestedList>
                </SideNavGroup>
              </SideNavList>
            </SideNav>
          </AppShellSidebarContent>
          <AppShellSidebarFooter>Workspace support</AppShellSidebarFooter>
        </AppShellSidebar>

        <AppShellMain id="main-content" tabIndex={-1}>
          <PageContent size="wide">
            <Stack className="gap-6">
              <BackLink href="/settings">Back to settings</BackLink>

              <PageHeader>
                <PageHeaderContent>
                  <PageHeaderTitle>General settings</PageHeaderTitle>
                  <PageHeaderDescription>
                    Manage workspace identity, region, and reporting defaults.
                  </PageHeaderDescription>
                </PageHeaderContent>
                <PageHeaderActions>
                  <Button variant="secondary">Export</Button>
                  <Button>Save changes</Button>
                </PageHeaderActions>
              </PageHeader>

              <PageSection>
                <PageSectionHeader>
                  <div>
                    <PageSectionTitle>Workspace details</PageSectionTitle>
                    <PageSectionDescription>Values used throughout reports and exports.</PageSectionDescription>
                  </div>
                </PageSectionHeader>
                <PageSectionContent>{/* Settings form */}</PageSectionContent>
              </PageSection>
            </Stack>
          </PageContent>
        </AppShellMain>
        <AppShellRail aria-label="Workspace context">Setup progress</AppShellRail>
      </AppShell>
    </>
  );
}
```

Use `AppShellMain as="div"` only when an ancestor already supplies the page's
single `main` landmark, such as an embedded workbench preview.

## Side navigation

Use `SideNav` for stable local navigation through a product area. It is not a
filter panel, action list, tree browser, or collection of user-created objects.

Use `expression="compact"` for dense application navigation with quiet section
labels, compact four-pixel row corners, indentation without guide lines, and a
restrained current-page surface. Apply it to the complete sidebar and its mobile
drawer copy so the navigation remains consistent across breakpoints. The legacy
`cyber-grid` value remains accepted for compatibility but is no longer the
recommended application-shell treatment.

Use `AppShellSidebarHeader` for stable area identity,
`AppShellSidebarContent` for the navigation landmark, and
`AppShellSidebarFooter` for bounded support or account context. These regions
remain optional; do not add empty chrome merely to fill the composition.

### Information architecture

- Prefer one or two visible levels. Add another level only after validating
  that people can still scan and understand the hierarchy.
- Keep top-level names stable across comparable workspaces and roles.
- Keep link labels short; they may be concise versions of page titles.
- Set `current` on exactly one `SideNavLink` in a navigation list. The component
  exposes `aria-current="page"` and a noncolor current indicator.
- Use `SideNavNestedList` for subordinate destinations and set the matching
  `depth` on its links. Keep nested destinations visible when they aid scanning;
  use a labeled disclosure control when a branch truly needs to collapse.
- Keep nested indentation consistent and align the current link's indicator to
  that depth. In the compact expression, hierarchy comes from spacing, type,
  hover, and selection rather than guide lines or row dividers; do not turn the
  selected destination into a floating card.
- Put contextual row actions in a named menu or popover beside the link, never
  inside the link. Ensure opening and closing the overlay preserves keyboard
  focus and does not change the current destination.
- Group links by user task or product domain, not the company's org chart.
- Do not place unbounded collections such as every report, project, or recent
  object in persistent navigation. Link to an index or drill-down view instead.
- Give every `SideNav` a useful `aria-label`, particularly when breadcrumbs,
  header navigation, or jump links also appear on the page.

### Responsive behavior

At wide widths, keep frequently used navigation visible when that supports the
task. At narrow widths, hide the persistent `AppShellSidebar` and expose the
same navigation through `Drawer side="left"` from a clearly labeled menu
button. Do not maintain two different information architectures.

The mobile drawer must:

- cover rather than compress the page content;
- block background interaction and trap focus while open;
- close on Escape and after a destination is chosen;
- restore focus to its trigger;
- preserve a visible close control and the navigation's accessible label;
- avoid rendering duplicate focusable copies of desktop navigation at the same
  breakpoint.

The drawer is a Client Component boundary; the rest of the shell and route can
remain server-rendered. Keep open state in that small navigation controller,
not in the entire page.

## Links and local navigation

- `Link` defaults to `variant="inline"` for links inside prose. Use
  `variant="standalone"` for independent destinations and `variant="muted"` for
  secondary metadata links.
- `BackLink` and `BackToTop` are standalone semantic anchors. Keep them outside
  button groups and give each its own 44px-high target.
- Stack standalone navigation links vertically on narrow layouts rather than
  squeezing them into a crowded wrapping row.
- `JumpLinks` displays an “On this page” title by default. Change `title` and
  `titleAs` to fit the document outline; do not remove the visible orientation
  label.
- Set `current` on the active `JumpLink`. It exposes
  `aria-current="location"` and a persistent noncolor indicator.

## Page header

`PageHeader` belongs inside the main content region. It is page identity, not
global application navigation.

- Use one `PageHeaderTitle` rendered as the route's `h1`.
- Keep the description brief and useful; do not repeat the title.
- Put page-scoped actions in `PageHeaderActions`. Keep one visually primary
  action in the immediate decision region.
- Actions wrap below the title on narrow screens. Order the DOM so the title
  and description remain first.
- Put breadcrumbs or a back link before the page header, not inside the action
  group.
- Tabs may follow the header when they switch peer views of the same resource.
  Do not use tabs as a substitute for application navigation.
- Avoid sticky page headers by default. If task actions must remain available,
  verify the header does not obscure validation errors, anchors, focused
  controls, or too much content at 200% zoom.
- When embedding the composition beneath an existing page title, set
  `PageHeaderTitle as="h2"` or the appropriate non-skipped level.

## Content width and sections

Use `Container` as a general outer boundary and `PageContent` inside application
shells. Select `size="readable"`, `"standard"`, `"wide"`, or `"full"` based
on the task. Compose titled regions from the `PageSection` family rather than
repeating local wrapper styles.

- Constrain prose, forms, and policy content to a readable measure.
- Let tables, timelines, editors, dashboards, and comparison views grow when
  horizontal space improves the task.
- Use `Stack` for vertical rhythm, `Inline` for wrapping clusters, and `Grid`
  for explicit column relationships.
- `Stack`, `Inline`, and `Grid` accept `gap="none"`, `"xs"`, `"sm"`,
  `"md"`, or `"lg"`. Use `none` for intentionally connected boxes and
  shared-edge grids, not as a shortcut for removing all layout rhythm.
- Begin with one column. Add columns when the available container width and the
  content relationship justify them.
- Prefer container queries for reusable panels whose behavior depends on their
  own width; use media queries for changes to the overall shell.
- Keep primary content before secondary rails in the DOM, even if the visual
  layout places a rail beside it.
- Use a `section` only when it has a useful accessible heading. Use `div` for
  layout grouping that is not a document section.
- Use `aside` only for complementary content that still makes sense when
  separated from the primary content.

Page sections normally use the Lumen spacing rhythm: 16px padding or gaps on
narrow layouts and 24px where the viewport allows. Dense tables may use tighter
internal spacing, but outer page rhythm should remain consistent.

### Contiguous section bands

Use `SectionStack` and the `SectionBand` family when several related product or
feature sections should read as one continuous surface. `SectionStack` owns the
outer boundary, and adjacent bands meet at a single shared divider with no gap.
The absence of space is between sections, not inside them: every band retains
responsive content insets and a clear heading hierarchy.

```tsx
import {
  SectionBand,
  SectionBandContent,
  SectionBandDescription,
  SectionBandEyebrow,
  SectionBandHeader,
  SectionBandTitle,
  SectionStack,
} from "lumen-ui-kit";

export function ProductOverview() {
  return (
    <SectionStack>
      <SectionBand motion="enter">
        <SectionBandHeader>
          <SectionBandEyebrow>01 / 02 · Operations</SectionBandEyebrow>
          <SectionBandTitle>One connected workspace</SectionBandTitle>
          <SectionBandDescription>
            Review activity, investigate exceptions, and publish results.
          </SectionBandDescription>
        </SectionBandHeader>
        <SectionBandContent>{/* Product visual or structured data */}</SectionBandContent>
      </SectionBand>
      <SectionBand tone="muted">
        <SectionBandHeader>
          <SectionBandEyebrow>02 / 02 · Reliability</SectionBandEyebrow>
          <SectionBandTitle>Operational context stays visible</SectionBandTitle>
        </SectionBandHeader>
        <SectionBandContent>{/* Metrics or process steps */}</SectionBandContent>
      </SectionBand>
    </SectionStack>
  );
}
```

- Use `default`, `muted`, and `accent` tones to clarify sequence, not to make a
  decorative stripe pattern.
- Keep one meaningful heading in every `SectionBand`; it renders a semantic
  `section`. Set `SectionBandTitle as` to maintain the page's heading order.
- Put visualizations, metrics, code, or structured content in
  `SectionBandContent`. Do not make the entire band clickable.
- Use `motion="enter"` only when the entrance helps users notice newly added or
  revealed content. It is never required to understand the section.
- Do not place independent cards inside every band. Prefer shared grid lines,
  dividers, and aligned content where the information is related.
- For unrelated page regions or ordinary settings pages, keep using
  `PageSection` with normal vertical rhythm.

### Product motion

Lumen motion is functional and opt-in. Use the 120ms fast duration for direct
control feedback, 180ms standard duration for small state changes, and 320ms
slow duration for a section or panel entering. Use the productive easing for
movement within the page and the enter easing when content appears.

Motion must not delay input, move surrounding layout, loop without purpose, or
carry essential status. Pause or remove ambient animation when it is offscreen,
and test the same flow with `prefers-reduced-motion: reduce`.

## Scrolling, sticky regions, and height

Prefer one document scroll container. Independent sidebar or panel scrolling
is appropriate only when the region is persistent, long, and remains usable at
zoom.

- Account for every sticky or fixed header in `top` offsets.
- Use `min-h-0` and `min-w-0` on grid or flex children that are allowed to
  scroll or shrink.
- Never let a sticky footer or action bar cover the last content or focused
  control; reserve space for it.
- Avoid `100vh` for critical mobile layouts. Dynamic browser chrome can make
  controls unreachable; use modern dynamic viewport units only after testing
  the target browsers.
- Ensure anchor targets and validation summaries are visible below sticky
  chrome, using `scroll-margin` where appropriate.
- Test long navigation labels, long localized titles, browser zoom, short
  landscape viewports, and keyboard focus movement.

## Landmark and keyboard checklist

- [ ] A skip link is the first focusable control when repeated chrome precedes
  the page content.
- [ ] The skip link target exists, accepts programmatic focus when needed, and
  is not obscured by sticky UI.
- [ ] The page has exactly one `main` landmark.
- [ ] Every `nav` has a distinct accessible label when multiple navigation
  landmarks exist.
- [ ] The route has one descriptive `h1`; subsequent headings do not skip
  levels.
- [ ] Current navigation is conveyed with `aria-current` and a visible cue that
  does not rely on color alone.
- [ ] Mobile navigation exposes its expanded state, traps and restores focus,
  closes on Escape, and has a visible close control.
- [ ] DOM order remains logical when columns stack or panels move.
- [ ] Sticky regions do not cover focus indicators, anchor targets, errors, or
  the final page content.
- [ ] The shell reflows without two-dimensional scrolling at 320px and 200%
  zoom, except inside intentionally scrollable data regions.

## Common mistakes

- Treating the global header and page header as one oversized component.
- Showing identical destinations in both horizontal and side navigation.
- Nesting `main` landmarks by using `AppShellMain` inside an existing `main`.
- Making the sidebar collapsible without an accessible trigger or focus
  restoration.
- Reordering panels visually while leaving an incoherent keyboard and reading
  order.
- Filling side navigation with user-generated content that grows without a
  bound.
- Removing internal padding because contiguous sections have no outer gap.
- Using `gap="none"` when adjacent children have no border, background, or
  other structure to explain their relationship.
- Animating every section, number, or divider instead of communicating a state
  change.
- Applying full-width layouts to prose or narrow forms.
- Adding sticky headers, sidebars, and footers until the content viewport is
  unusably small.

## Source basis

This Lumen pattern synthesizes the following official guidance without copying
their component implementations:

- [Atlassian layout](https://atlassian.design/components/navigation-system/layout)
  and [grid](https://atlassian.design/foundations/grid-beta/applying-grid/)
- [Carbon global header and UI shell](https://carbondesignsystem.com/patterns/global-header/)
- [Elastic page template](https://eui.elastic.co/docs/components/templates/page-template/)
  and [page-template guidelines](https://eui.elastic.co/docs/components/templates/page-template/guidelines/)
- [GitLab layout](https://design.gitlab.com/product-foundations/layout/) and
  [navigation sidebar](https://design.gitlab.com/patterns/navigation-sidebar/)
- [PatternFly page guidelines](https://www.patternfly.org/components/page/design-guidelines/)
  and [page accessibility](https://www.patternfly.org/components/page/accessibility/)
- [GOV.UK layout](https://design-system.service.gov.uk/styles/layout/) and
  [service navigation](https://design-system.service.gov.uk/components/service-navigation/)
- [USWDS header](https://designsystem.digital.gov/components/header/),
  [side navigation](https://designsystem.digital.gov/components/side-navigation/),
  and [layout grid](https://designsystem.digital.gov/utilities/layout-grid/)
- [Firecrawl](https://www.firecrawl.dev/) provided visual research for a
  continuous section rhythm, shared grid lines, numbered section framing, and
  functional data/status motion. Lumen's API, styling, and examples are
  original and do not copy Firecrawl assets or implementation code.
