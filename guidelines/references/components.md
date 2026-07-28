# Lumen Component Specifications

## Contents

- [Button](#button)
- [Input](#input)
- [Choice controls](#choice-controls)
- [Toolbar](#toolbar)
- [Card](#card)
- [Dialog](#dialog)

## Button

Use a button to invoke an action or commit a task.

### Anatomy and variants

A button contains a control surface, a text label or accessible icon label, an interactive hit area, and an optional leading or trailing icon. Lumen's default button is 44px high, uses an 8px radius, and keeps compact semibold text with restrained letter spacing. Preserve the supplied raised shadow and pressed inset shadow: depth is a functional action affordance, not decoration.

- Primary: filled treatment for the page or region's main action.
- Secondary: lower-emphasis outline or neutral treatment.
- Text or ghost: low-weight local action.
- Destructive: reserved for actions with destructive consequences.
- Size variants: small, default, and large, mapped to the spacing and typography scale.

Avoid more than one primary action in the same immediate decision region.

Consume secondary button fills through the semantic action-secondary tokens, not the palette's raw secondary color. This distinction keeps Brainapi's neutral buttons and segmented toolbar items dark even though its secondary brand color is white.

### States and behavior

- Default: use the semantic primary background and contrasting foreground.
- Hover: increase affordance without moving surrounding layout.
- Active: communicate press with color or a subtle transform.
- Focus: show a high-contrast focus ring with separation from the control edge.
- Disabled: use native `disabled` or `aria-disabled` with complete event suppression when the control must remain discoverable. Do not rely on opacity or `pointer-events` alone.
- Pending: prevent duplicate submission, retain an understandable label, and expose busy state where needed.

Use a native `button`. If a non-button is unavoidable, reproduce focus, Enter and Space activation, disabled behavior, and semantics—but treat that as an exception.

Relevant tokens: `color.brand.500`, `color.background.surface`, `spacing.gutter.sm`, `spacing.gutter.md`, and `typography.weight.semibold`.

## Input

Use an input to collect short textual or structured values.

### Anatomy

Include a visible label, field, optional label metadata, optional sublabel, persistent helper text, optional error message, and optional functional adornments. Place the label above the input by default. Use `FieldLabelRow` to keep `FieldLabel` and `FieldLabelMeta` visually aligned without adding metadata such as “Optional” to the control's accessible name. Use `FieldSublabel` for short context before the control and `FieldDescription` for persistent guidance after it. Do not use placeholder text for either purpose.

Lumen text-like controls are 42px high, use 14px inline padding, a 15px value size, a 13px semibold label, a 12px helper/error size, a 10px field radius, and the semantic field shadow. Buttons use their own 8px radius while compact controls retain the tighter 6px control radius. Textareas keep the same edge treatment and use a comfortable line height. Selects, file controls, number, search, URL, date, time, color, and password inputs should retain native semantics and platform affordances while sharing this visual shell.

`Select` defaults to the bordered field treatment. Use `variant="ghost"` only in compact toolbars or contextual control groups where surrounding structure already communicates interactivity. The ghost treatment keeps its native arrow and becomes visibly bounded on hover and focus; invalid state restores the danger boundary. Keep a visible label when practical or provide a specific accessible name when the compact context makes the purpose unambiguous.

### Validation and states

- Support idle, focus, filled, invalid, disabled, and read-only states.
- Validate predictable issues near the field with concise, actionable text.
- Do not use red alone; combine semantic color with text and, when helpful, an icon.
- Preserve the entered value after an error.
- Avoid validating incomplete input too aggressively while the user is still typing.

Associate `label` and input using `htmlFor` and `id`. Reference helper and error elements with `aria-describedby`; set `aria-invalid` when invalid. Use `aria-label` only when a visible label would genuinely be redundant and the accessible name remains clear.

Relevant tokens: `color.text.primary`, `color.semantic.danger`, and `spacing.gutter.sm`.

## Choice controls

Use `Checkbox` for independent selections, `Radio` inside `Fieldset` and `Legend` for one choice from a visible set, and `Switch` only for an immediate binary setting. Use `ChoiceField`, `ChoiceFieldLabel`, and `ChoiceFieldDescription` to create a 44px-minimum choice row with a concise accessible name and separately associated description.

- Give every input a stable `id`; point `ChoiceFieldLabel.htmlFor` to it and connect the description with `aria-describedby`.
- Keep checkbox and radio marks at 20px while the composed row provides the larger pointer target.
- Keep the switch state visible in the track position and available programmatically through native checkbox state plus `role="switch"`.
- Use a checkbox, not a switch, when the choice is collected for a later form submission rather than applied immediately.
- Keep descriptions clickable only when doing so cannot trigger an unexpected change; the label itself remains the primary activation text.
- Preserve browser behavior in forced-colors mode and never use color as the only checked or invalid signal.
- Render checkbox and indeterminate marks with the semantic `on-primary` color so the mark remains dark and legible when the checked surface is a light accent such as Brainapi lime.

## Toolbar

Use a toolbar to group actions and compact contextual controls for one task. Give every ARIA toolbar a visible or programmatic name, preserve roving keyboard focus, and keep native buttons, links, and selects inside it.

- Use the 10px toolbar radius for the compound outer wrapper so report, editor, and utility toolbars share one silhouette.
- Use the 8px button radius at the exposed ends of segmented groups; touching interior edges stay square and overlap their one-pixel borders.
- Keep individual compact atoms on the 6px radius only when they are not defining the toolbar's outer edge.
- Do not clip focus rings to force connected corners. Let the group own its outer radius while each interactive item retains a visible focus treatment.
- Prefer `Select variant="ghost"` for compact contextual choices where the surrounding toolbar already communicates the control boundary.

## Card

Use a card for one self-contained content summary, record preview, or small focused form.

### Anatomy and usage

A card may contain a surface, header, body, and action footer.

- Keep one clear information purpose and one primary action.
- Use compact, default, or rich density according to the content—not to create arbitrary visual variety.
- Use `spacing.gutter.md` for the default internal padding and `elevation.card` only when separation from the background is necessary.
- Avoid wrapping every section in a card; hierarchy can come from spacing, headings, borders, and layout.
- Use `CardGroup` when several peer cards form one comparison or workflow. The group owns the outer box, removes gaps, and joins cards with shared one-pixel seams.
- Set `columns` from one to four according to the content. The group collapses to one column on narrow screens; do not force dense card columns at mobile widths.
- Use `motion="enter"` on a standalone `Card` or `motion="stagger"` on `CardGroup` only when newly revealed content benefits from an entrance cue. Do not combine both on the same card, and never make the animation carry state.

When the whole card navigates, use a real link and avoid nested interactive controls. If the card contains several actions, keep the surface noninteractive and expose each action separately. Preserve a logical heading level and focus order. A connected card remains a normal noninteractive surface unless its own content supplies semantic controls.

## Dialog

Use a modal dialog for a short, focused task that temporarily suspends the surrounding context. Do not use it for long workflows, essential information that should remain visible, or content that needs a shareable route.

### Anatomy and behavior

Include a title, optional description, focused content, explicit actions, and a visible close or cancel control.

- Trap focus while modal and block background interaction.
- Move focus to the first meaningful control or a safe static heading when opened.
- Close on Escape unless data-loss handling requires confirmation.
- Restore focus when closed.
- Require an explicit, specifically labeled action for destructive consequences.
- Keep the action order consistent with the target platform and existing product conventions.

Use `aria-labelledby` and `aria-describedby` when implementing directly. Prefer an established accessible primitive already used by the repository. Relevant tokens: `spacing.gutter.lg`, `color.background.surface`, and `elevation.card`.

## Source basis

Button guidance synthesizes Carbon and Elastic EUI. Input and choice guidance adapts Carbon, PatternFly, GitLab Pajamas, and USWDS. Card guidance synthesizes GitLab Pajamas and PatternFly. Dialog guidance adapts GOV.UK and PatternFly. See [attribution.md](attribution.md).
