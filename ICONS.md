# Lumen Icons

Lumen links a focused set of common interface symbols from Carbon's React icon
package through a separate, optional entrypoint. The main component entrypoint
does not import the icon package.

## Install and import

```bash
npm install lumen-ui-kit @carbon/icons-react
```

```tsx
import { Button } from "lumen-ui-kit";
import { AddIcon, Icon, SearchIcon } from "lumen-ui-kit/icons";

export function ReportActions() {
  return (
    <div className="flex items-center gap-2">
      <Button>
        <Icon source={AddIcon} />
        Add report
      </Button>
      <Button size="icon" variant="secondary" aria-label="Search reports">
        <Icon source={SearchIcon} />
      </Button>
    </div>
  );
}
```

`@carbon/icons-react` is an optional peer dependency. Install it only when the
application imports `lumen-ui-kit/icons`. The entrypoint is compatible with
React Server Components and does not declare a client boundary.

## Accessibility contract

- Icons are decorative by default: `Icon` sets `aria-hidden="true"` and
  `focusable="false"` so a nearby text label or the containing control supplies
  the accessible name.
- Give an informative standalone icon a concise `label`. This changes it to an
  image with an accessible name.
- Give an icon-only `Button` or link its own `aria-label`; do not label both the
  control and its child icon.
- Do not communicate status, severity, or a required action with a symbol or
  color alone. Pair it with visible text where practical.
- Keep interactive targets at least 44 by 44 CSS pixels even when the optical
  icon is 16 or 20 pixels.

```tsx
import { Icon, WarningFilledIcon } from "lumen-ui-kit/icons";

export function SyncStatus() {
  return (
    <p className="flex items-center gap-2">
      <Icon
        source={WarningFilledIcon}
        label="Sync needs attention"
        tone="warning"
        size={20}
      />
      Check two unresolved sync errors
    </p>
  );
}
```

## Size and color

Use a source's optical size rather than transforming an arbitrary SVG. `Icon`
accepts Carbon's standard `16`, `20`, `24`, and `32` sizes. Use `tone` values
`current`, `muted`, `primary`, `success`, `warning`, or `danger`; do not set a
path `fill` or hardcode a product color. The default `current` tone follows the
surrounding text.

Choose one familiar metaphor for each action throughout a product. Align icons
and labels as a unit, keep symbols monochrome unless meaning requires a semantic
tone, and prefer text labels wherever space allows.

## Curated exports

The entrypoint exports `Icon` plus these source aliases:

```text
AddIcon              AlignCenterIcon      AlignLeftIcon
AlignRightIcon       ArrowDownIcon        ArrowLeftIcon
ArrowRightIcon       ArrowUpIcon          BoldIcon
CalendarIcon         CenterSelectionIcon  CheckIcon
FitIcon              KeyboardIcon        MapIcon
ChevronLeftIcon      ChevronRightIcon     ChevronUpIcon
CloseIcon            CodeIcon             CopyIcon
DownloadIcon         EditIcon             EmailIcon
ErrorIcon            ErrorFilledIcon      FavoriteIcon
FilterIcon           HelpIcon             HomeIcon
InformationIcon      InformationFilledIcon ItalicIcon
LaunchIcon           LinkIcon             ListBulletedIcon
ListNumberedIcon     MenuIcon             MoreHorizontalIcon
MaximizeIcon         MinimizeIcon         MoreVerticalIcon
NotificationIcon     PhysicsIcon          QuoteIcon
RedoIcon             RestartIcon          SaveIcon
SearchIcon
SettingsIcon         StarIcon             StrikethroughIcon
SuccessIcon          TextColorIcon        TextFontIcon
TrashIcon            UnderlineIcon        UndoIcon
UploadIcon           UserIcon             ViewIcon
ViewOffIcon          WarningIcon          WarningFilledIcon
ZoomInIcon           ZoomOutIcon
```

The set includes a rich-text formatting family—`BoldIcon`, `ItalicIcon`,
`UnderlineIcon`, `StrikethroughIcon`, `AlignLeftIcon`, `AlignCenterIcon`,
`AlignRightIcon`, `ListBulletedIcon`, `ListNumberedIcon`, `QuoteIcon`,
`CodeIcon`, `TextColorIcon`, and `TextFontIcon`—for editor and composer
toolbars.

`IconProps`, `IconSize`, and `IconTone` are exported as TypeScript types. Named
imports remain tree-shakeable with bundlers that honor package side-effect
metadata.

## Extending the set

For a broadly useful metaphor, add a stable Lumen alias to the icon entrypoint,
document it here, and add an accessibility/render test. For a product-specific
symbol, import the Carbon source in the application and pass it to `Icon`; do
not expand Lumen's public API for one feature. Keep brand marks and illustrations
in a separately licensed asset package.

## Source and license boundary

The adapter follows Carbon's React package, standard sizes, alignment guidance,
and accessibility model. Atlassian informed familiar metaphors and preference
for text labels; PatternFly informed semantic tones; USWDS informed reinforcing
text and hiding decorative symbols.

- [Carbon React icon code](https://carbondesignsystem.com/elements/icons/code/)
- [Carbon icon usage](https://carbondesignsystem.com/elements/icons/usage/)
- [Atlassian iconography](https://atlassian.design/foundations/iconography/)
- [PatternFly iconography](https://www.patternfly.org/foundations-and-styles/iconography/)
- [USWDS icon guidance](https://designsystem.digital.gov/components/icon/)

`@carbon/icons-react` is distributed from Carbon's
[Apache-2.0-licensed repository](https://github.com/carbon-design-system/carbon).
Lumen imports that peer package and does not copy its SVG files or brand assets.
Preserve applicable upstream notices when distributing an application or
package that includes those icons.
