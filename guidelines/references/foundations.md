# Lumen Foundations

## Visual direction

Lumen is a calm, content-first system for productive application interfaces.

- Use layout and components to support comprehension and task completion.
- Prefer restrained color, generous but purposeful whitespace, and a clear typographic hierarchy.
- Reserve the brand color for primary actions, focus, selection, and meaningful emphasis.
- Use semantic success, warning, and danger colors with accessible foreground pairings.
- Prefer simple geometric icons from Lumen's curated Carbon React source set; keep metaphors, optical sizes, and alignment consistent.
- Avoid decorative imagery, excessive gradients, arbitrary shadows, and uniform card grids that obscure information priority.

## Typography

- Prefer a modern UI face with a `system-ui` fallback.
- Use the token scale as the starting point: 14px secondary body, 16px base body, and 20px lead or compact heading.
- Use semibold for controls and emphasis; keep body copy regular.
- Maintain semantic heading order and one descriptive page heading.
- Constrain line length on text-heavy pages while allowing data-rich layouts to use the available width.

## Spacing and layout

- Use a 4px baseline rhythm and the supplied 4, 8, 16, and 24px spacing tokens.
- Prefer larger gutters on wide layouts and denser, still-touchable spacing on narrow layouts.
- Keep related items closer than unrelated sections.
- Use elevation sparingly to explain layering, not to decorate every surface.
- Use the layout tokens for the 56px global header, 240px persistent sidebar, 272px contextual rail, and 16/24px responsive page insets.
- Let related narrative sections meet at shared one-pixel seams when they form one continuous surface; retain 16/24px responsive internal insets rather than removing all breathing room.

## Motion

- Use motion to explain state, direction, progress, or continuity. Do not animate a region only to make it feel active.
- Use the supplied 120ms fast, 180ms standard, and 320ms slow duration tokens with the productive or enter easing tokens.
- Keep entrance motion short, avoid layout shifts, and never make animation the only indication of status or completion.
- Mark opt-in animated elements with `data-lumen-motion` so the global reduced-motion rule can suppress them.
- Avoid autoplaying decorative loops. If a subdued ambient loop supports a live-data visual, keep equivalent status text visible and stop it for reduced motion.

## Geometry and expression

Lumen defaults to restrained corner radii, soft elevation, and quiet dividers. Some products need a more structural, editorial presence; support it as a deliberate variant rather than redefining the defaults.

- Keep text-like fields and compound toolbar wrappers on a 10px radius, the prompt-composer shell and its Send/Stop action on the dedicated 14px composer radius, ordinary buttons and segmented toolbar edges on the 8px button radius, compact controls on the 6px control radius, overlays on the 8px surface radius, and structural shell/table surfaces square. This measured progression improves form scanability and action affordance without turning every region into a pill or floating rounded card.
- Squared ("enterprise") expression: near-square corners (roughly 1–3px), hairline 1px dividers and grid lines, and hard offset shadows instead of soft blurred elevation. Choose it for dense, data-forward, or marketing-grade surfaces that should read as precise and structural. This is one supported expression, not a replacement for the calm default.
- Keep radius, border, and shadow decisions on semantic radius and elevation tokens so an expression is selected once at the theme layer, not scattered across component markup.
- Do not mix expressions within one surface. A squared shell should not host pill-shaped cards, and a soft product should not drop hard offset shadows onto isolated elements.
- Pair the squared expression with a monospace, uppercase eyebrow or kicker for section framing when it clarifies structure; keep it optional and never the only cue.
- Preserve every accessibility and contrast rule regardless of expression. Geometry never substitutes for a visible label, a focus ring, or a noncolor status cue.

## Token model

The canonical bundle is [`../assets/core.tokens.json`](../assets/core.tokens.json). It contains:

- `color`: brand, text, background, and semantic decisions.
- `typography`: base family, size scale, and weights.
- `spacing`: gutter scale.
- `radius`: 6px compact controls, 8px buttons and raised surfaces, 10px fields and toolbar wrappers, and a 14px compound prompt-composer shell.
- `control.fieldHeight`: 42px for text-like inputs, selects, textareas, and compound input groups; action targets retain their component-specific heights.
- `layout`: shell dimensions and responsive page insets.
- `motion`: functional durations and easing curves.
- `elevation`: card or raised-surface shadow.

Treat tokens as named design decisions and a single source of truth. Consume them through CSS custom properties, Tailwind theme mappings, JavaScript theme objects, or native platform equivalents. Do not place token values directly in component markup when the project can expose a semantic token.

The bundle follows the stable Design Tokens Community Group 2025.10 format with `$schema`, vendor metadata in `$extensions`, nested token groups, and leaf objects containing `$value` and `$type`. Preserve dot-separated conceptual names such as `color.brand.500` and `spacing.md` when generating platform artifacts.

### Palette expressions

- `lumen` is the default palette and continues to support the supplied light and dark appearances.
- `brainapi` is an opt-in, fixed-dark palette: primary `#CFFE25`, secondary `#FFFFFF`, and background `#000000`. Apply it with `data-lumen-palette="brainapi"` on a containing element; use `data-lumen-palette="lumen"` or omit the attribute for the default.
- Brainapi uses a two-level border hierarchy: `#262626` for structural seams and dividers, and `#595959` for interactive control boundaries that must remain distinguishable against black. Keep lime for focus, selection, and active emphasis instead of brightening every border.
- Brainapi's white secondary color is a brand/content color, not a neutral control fill. Secondary actions and segmented toolbar items use the dark action surface `#171717`, move to `#262626` on hover or pressed state, and keep white foreground content.
- Code surfaces are explicitly dark in both palettes and never derive their background by inverting page foreground/background. Brainapi uses a `#050505` code canvas, near-black header surface, subdued gray boundary, and accessible lime/cyan/green/amber syntax roles.
- Marks rendered on the lime primary surface, including checkbox checks and indeterminate bars, use the dark `on-primary` color rather than white.
- Consume primary, secondary, background, foreground, border, focus, and state colors through Lumen's semantic variables. The Brainapi selector remaps those variables so components do not need palette-specific class names.
- Do not infer meaning from the lime accent alone. Preserve text, icon, shape, or position cues, and verify derived state colors against the black surface.

## Integration rules

- Map Lumen values to a project's existing semantic layer before introducing parallel variables.
- Preserve light/dark theme architecture. Derive accessible dark-theme pairings instead of mechanically reusing light-theme values.
- Keep appearance and palette as separate controls: `data-lumen-theme` selects light or dark for Lumen, while Brainapi intentionally enforces its fixed dark color scheme.
- Prefer semantic names such as `--primary`, `--surface`, and `--danger` at component call sites; keep palette values behind the theme layer.
- Avoid a full theme replacement when a focused component or page change is requested.
- Document intentional token overrides and keep them centralized.

## Iconography

- Use `lumen-ui-kit/icons` for common interface symbols. It is a separate entrypoint backed by the optional `@carbon/icons-react` peer; do not import icons through core.
- Render with Lumen's `Icon` adapter at the supplied 16, 20, 24, or 32 optical size. Use semantic `tone` values or inherited current color; never recolor individual SVG paths.
- Icons are decorative by default. Add a `label` only when a standalone icon conveys information; name icon-only controls on the control itself.
- Prefer visible text labels. Never communicate status, severity, or an action with a symbol or color alone.
- Keep interactive targets at least 44 by 44 CSS pixels even when the icon is smaller. Do not make the SVG itself the control.
- Use one familiar metaphor consistently. Keep brand marks, illustrations, and product-specific icon families in separately licensed asset packages.
- Read the package's `ICONS.md` before adding an alias or importing a non-curated source.

## Component usage rules

1. Make components support content; do not use them as decoration.
2. Prefer semantic HTML and native controls for built-in accessibility and platform behavior.
3. Keep content readable without relying on component-specific visuals.
4. Avoid multiple competing components for the same task.
5. Do not hide essential completion information inside disclosures.
6. Reserve alerts for important, time-sensitive messages rather than general notices.
7. Review every component choice for content fit and accessibility; document exceptions.

## Source basis

The visual direction synthesizes Carbon and Elastic EUI. The optional squared expression reflects common editorial and enterprise-dashboard conventions rather than a single upstream system. Firecrawl visual research informed the original contiguous-section, functional-motion, and connected icon-specimen presentation without supplying code or assets. The content-first rules adapt GOV.UK guidance. Icon rules synthesize Carbon's React, size, alignment, and accessibility model with Atlassian's familiar-metaphor guidance, PatternFly's semantic tones, and USWDS guidance to reinforce text. Token structure follows Design Tokens Community Group recommendations, with accessibility considerations informed by USWDS and WCAG. See [attribution.md](attribution.md) for provenance.
