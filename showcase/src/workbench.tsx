import * as React from "react";
import { Laptop, Mobile, Moon, Sun, Tablet } from "@carbon/icons-react";

import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  Alert,
  AppShell,
  AppShellMain,
  AppShellRail,
  AppShellSidebar,
  AppShellSidebarContent,
  AppShellSidebarFooter,
  AppShellSidebarHeader,
  Avatar,
  AvatarGroup,
  AvatarGroupItem,
  BackLink,
  BackToTop,
  Badge,
  Banner,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardGroup,
  CardHeader,
  CardTitle,
  CharacterCount,
  Checkbox,
  ChoiceField,
  ChoiceFieldDescription,
  ChoiceFieldLabel,
  ClipboardCopy,
  CodeBlock,
  CodeToken,
  Callout,
  Container,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  DateInput,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  ErrorSummary,
  ErrorSummaryItem,
  ErrorSummaryList,
  ErrorSummaryTitle,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLabelMeta,
  FieldLabelRow,
  FieldSublabel,
  Fieldset,
  FileInput,
  Grid,
  GlobalHeader,
  GlobalHeaderActions,
  GlobalHeaderBrand,
  GlobalHeaderInner,
  GlobalHeaderNav,
  GlobalHeaderNavItem,
  GlobalHeaderNavLink,
  GlobalHeaderNavList,
  Inline,
  InlineEdit,
  Input,
  InputGroup,
  InputGroupAddon,
  JumpLink,
  JumpLinks,
  Legend,
  Link,
  List,
  ListItem,
  NumberInput,
  Pagination,
  PaginationItem,
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
  PasswordField,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  PromptComposer,
  PromptComposerActions,
  PromptComposerAttachment,
  PromptComposerAttachments,
  PromptComposerControls,
  PromptComposerContextMeter,
  PromptComposerField,
  PromptComposerSubmit,
  PromptComposerToolbar,
  type PromptComposerContextSegment,
  Radio,
  ResourceList,
  ResourceListActions,
  ResourceListContent,
  ResourceListDescription,
  ResourceListItem,
  ResourceListMetadata,
  ResourceListMetadataItem,
  ResourceListTitle,
  SearchInput,
  Select,
  Separator,
  SideNav,
  SideNavGroup,
  SideNavGroupLabel,
  SideNavItem,
  SideNavLink,
  SideNavList,
  SideNavNestedList,
  Skeleton,
  SkipLink,
  Slider,
  Spinner,
  Stack,
  Stat,
  StatLabel,
  StatusIndicator,
  StatValue,
  SummaryActions,
  SummaryDetails,
  SummaryList,
  SummaryRow,
  SummaryTerm,
  Step,
  Steps,
  Switch,
  Table,
  TableAppliedFilters,
  TableBody,
  TableBatchActions,
  TableCaption,
  TableCell,
  TableEmptyState,
  TableFilterTag,
  TableHead,
  TableHeader,
  TablePagination,
  TableRow,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tag,
  TaskList,
  TaskListItem,
  Textarea,
  TextField,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  ToolbarLabel,
  ToolbarSeparator,
  ToolbarSpacer,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Truncate,
  VisuallyHidden,
} from "../../src";
import {
  GraphExplorer,
  type GraphFilterState,
  type GraphNode,
  type GraphRelationship,
  type GraphSelection,
} from "../../src/graph";
import {
  AddIcon,
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BoldIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CloseIcon,
  CodeIcon,
  CopyIcon,
  DownloadIcon,
  EditIcon,
  EmailIcon,
  ErrorFilledIcon,
  ErrorIcon,
  FavoriteIcon,
  FilterIcon,
  HelpIcon,
  HomeIcon,
  Icon,
  InformationFilledIcon,
  InformationIcon,
  ItalicIcon,
  LaunchIcon,
  LinkIcon,
  ListBulletedIcon,
  ListNumberedIcon,
  MenuIcon,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  NotificationIcon,
  QuoteIcon,
  RedoIcon,
  SaveIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
  StrikethroughIcon,
  SuccessIcon,
  TextColorIcon,
  TextFontIcon,
  TrashIcon,
  UnderlineIcon,
  UndoIcon,
  UploadIcon,
  UserIcon,
  ViewIcon,
  ViewOffIcon,
  WarningFilledIcon,
  WarningIcon,
} from "../../src/icons";
import {
  matchesSection,
  showcaseSections,
  showcasedComponentCount,
} from "./catalog";
import { guideDocuments, matchesGuide } from "./guidelines";

const GuidelineViewer = React.lazy(() =>
  import("./guideline-viewer").then((module) => ({ default: module.GuidelineViewer })),
);

type Theme = "light" | "dark";
type Palette = "lumen" | "brainapi";
type Viewport = "desktop" | "tablet" | "mobile";

const paletteOptions = [
  { label: "Lumen", value: "lumen" },
  { label: "Brainapi", value: "brainapi" },
] as const;

const viewportOptions = [
  { icon: Laptop, label: "Desktop", value: "desktop" },
  { icon: Tablet, label: "Tablet", value: "tablet" },
  { icon: Mobile, label: "Mobile", value: "mobile" },
] as const;

interface StoryProps {
  title: string;
  description: string;
  children: React.ReactNode;
  wide?: boolean;
  flush?: boolean;
}

function Story({ children, description, flush = false, title, wide = false }: StoryProps) {
  return (
    <article
      className={[
        "story",
        wide ? "story--wide" : null,
        flush ? "story--flush" : null,
      ].filter(Boolean).join(" ")}
    >
      <div className="story__heading">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="story__preview">{children}</div>
    </article>
  );
}

function FoundationsStories() {
  const colors = [
    ["Primary", "--lumen-color-primary"],
    ["Secondary", "--lumen-color-secondary"],
    ["Secondary action", "--lumen-color-action-secondary"],
    ["Background", "--lumen-color-background"],
    ["Surface", "--lumen-color-surface"],
    ["Surface muted", "--lumen-color-surface-muted"],
    ["Foreground", "--lumen-color-foreground"],
    ["Border", "--lumen-color-border"],
    ["Control border", "--lumen-color-control-border"],
    ["Success", "--lumen-color-success"],
    ["Warning", "--lumen-color-warning"],
    ["Danger", "--lumen-color-danger"],
  ];

  return (
    <>
      <Story title="Semantic color" description="Theme-safe roles used by every component." wide>
        <div className="swatch-grid">
          {colors.map(([label, token]) => (
            <div className="swatch" key={token}>
              <span className="swatch__color" style={{ background: `var(${token})` }} />
              <span className="swatch__label">{label}</span>
              <code>{token}</code>
            </div>
          ))}
        </div>
      </Story>
      <Story title="Typography" description="A compact, product-oriented type hierarchy.">
        <div className="type-ramp">
          <p className="type-ramp__display">Build with clarity</p>
          <p className="type-ramp__title">Operational overview</p>
          <p className="type-ramp__heading">Recent activity</p>
          <p>Body copy remains readable at product density.</p>
          <small>Supporting detail and metadata</small>
        </div>
      </Story>
      <Story title="Shape and elevation" description="Controls and overlays carry a restrained radius; structural cards stay square for an enterprise, non-decorative feel.">
        <div className="foundation-surfaces">
          <span className="foundation-field">Field · 10px</span>
          <span className="foundation-control">Button · 8px</span>
          <span className="foundation-surface">Overlay · 8px</span>
          <span className="foundation-card">Card · squared</span>
        </div>
      </Story>
    </>
  );
}

function IconStories() {
  const icons = [
    ["AddIcon", AddIcon],
    ["AlignCenterIcon", AlignCenterIcon],
    ["AlignLeftIcon", AlignLeftIcon],
    ["AlignRightIcon", AlignRightIcon],
    ["ArrowDownIcon", ArrowDownIcon],
    ["ArrowLeftIcon", ArrowLeftIcon],
    ["ArrowRightIcon", ArrowRightIcon],
    ["ArrowUpIcon", ArrowUpIcon],
    ["BoldIcon", BoldIcon],
    ["CalendarIcon", CalendarIcon],
    ["CheckIcon", CheckIcon],
    ["ChevronDownIcon", ChevronDownIcon],
    ["ChevronLeftIcon", ChevronLeftIcon],
    ["ChevronRightIcon", ChevronRightIcon],
    ["ChevronUpIcon", ChevronUpIcon],
    ["CloseIcon", CloseIcon],
    ["CodeIcon", CodeIcon],
    ["CopyIcon", CopyIcon],
    ["DownloadIcon", DownloadIcon],
    ["EditIcon", EditIcon],
    ["EmailIcon", EmailIcon],
    ["ErrorIcon", ErrorIcon],
    ["ErrorFilledIcon", ErrorFilledIcon],
    ["FavoriteIcon", FavoriteIcon],
    ["FilterIcon", FilterIcon],
    ["HelpIcon", HelpIcon],
    ["HomeIcon", HomeIcon],
    ["InformationIcon", InformationIcon],
    ["InformationFilledIcon", InformationFilledIcon],
    ["ItalicIcon", ItalicIcon],
    ["LaunchIcon", LaunchIcon],
    ["LinkIcon", LinkIcon],
    ["ListBulletedIcon", ListBulletedIcon],
    ["ListNumberedIcon", ListNumberedIcon],
    ["MenuIcon", MenuIcon],
    ["MoreHorizontalIcon", MoreHorizontalIcon],
    ["MoreVerticalIcon", MoreVerticalIcon],
    ["NotificationIcon", NotificationIcon],
    ["QuoteIcon", QuoteIcon],
    ["RedoIcon", RedoIcon],
    ["SaveIcon", SaveIcon],
    ["SearchIcon", SearchIcon],
    ["SettingsIcon", SettingsIcon],
    ["StarIcon", StarIcon],
    ["StrikethroughIcon", StrikethroughIcon],
    ["SuccessIcon", SuccessIcon],
    ["TextColorIcon", TextColorIcon],
    ["TextFontIcon", TextFontIcon],
    ["TrashIcon", TrashIcon],
    ["UnderlineIcon", UnderlineIcon],
    ["UndoIcon", UndoIcon],
    ["UploadIcon", UploadIcon],
    ["UserIcon", UserIcon],
    ["ViewIcon", ViewIcon],
    ["ViewOffIcon", ViewOffIcon],
    ["WarningIcon", WarningIcon],
    ["WarningFilledIcon", WarningFilledIcon],
  ] as const;

  return (
    <>
      <Story title="Curated icon set" description="A connected blueprint of common product symbols linked from the optional Carbon React icon peer." wide flush>
        <div className="icon-library-meta">
          <span aria-hidden="true">[ {icons.length} / {icons.length} ]</span>
          <strong>Interface symbols</strong>
          <span>24 px preview</span>
        </div>
        <ul className="icon-gallery" aria-label="Curated icon library">
          {icons.map(([name, source], index) => {
            const iconIndex = String(index + 1).padStart(2, "0");
            return (
              <li className="icon-sample" data-icon-index={iconIndex} key={name}>
                <span className="icon-sample__meta" aria-hidden="true">
                  <span>[ {iconIndex} ]</span>
                  <span>24</span>
                </span>
                <span className="icon-sample__glyph" aria-hidden="true">
                  <Icon source={source} size={24} />
                </span>
                <code>{name}</code>
              </li>
            );
          })}
        </ul>
      </Story>
      <Story title="Sizes and semantic tones" description="Use an optical source size and Lumen color role rather than scaling or recoloring paths manually.">
        <Stack>
          <Inline aria-label="Icon sizes">
            <Icon source={SettingsIcon} size={16} />
            <Icon source={SettingsIcon} size={20} />
            <Icon source={SettingsIcon} size={24} />
            <Icon source={SettingsIcon} size={32} />
          </Inline>
          <Inline aria-label="Icon tones">
            <Icon source={InformationFilledIcon} tone="primary" size={20} />
            <Icon source={SuccessIcon} tone="success" size={20} />
            <Icon source={WarningFilledIcon} tone="warning" size={20} />
            <Icon source={ErrorFilledIcon} tone="danger" size={20} />
            <Icon source={InformationIcon} tone="muted" size={20} />
          </Inline>
        </Stack>
      </Story>
      <Story title="Accessible icon actions" description="Icons inside named controls stay decorative; standalone informative icons receive a label.">
        <Stack>
          <Inline>
            <Button><Icon source={AddIcon} />Add report</Button>
            <Button size="icon" variant="secondary" aria-label="Search reports">
              <Icon source={SearchIcon} />
            </Button>
          </Inline>
          <Inline>
            <Icon source={WarningFilledIcon} label="Sync needs attention" tone="warning" size={24} />
            <span className="muted-copy">Informative standalone icon</span>
          </Inline>
        </Stack>
      </Story>
    </>
  );
}

const formattingFontFamilies: Record<string, string> = {
  inter: "Inter, system-ui, sans-serif",
  system: "system-ui, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

function ActionStories() {
  const [viewDensity, setViewDensity] = React.useState<"comfortable" | "compact">("comfortable");
  const [fontFamily, setFontFamily] = React.useState("inter");
  const [fontSize, setFontSize] = React.useState("16");
  const [inlineStyles, setInlineStyles] = React.useState({
    bold: true,
    italic: false,
    underline: false,
    strikethrough: false,
  });
  const [alignment, setAlignment] = React.useState<"left" | "center" | "right">("left");
  const [listStyle, setListStyle] = React.useState<"none" | "bulleted" | "numbered">("none");

  const toggleStyle = (key: keyof typeof inlineStyles) =>
    setInlineStyles((current) => ({ ...current, [key]: !current[key] }));

  const previewDecoration =
    [
      inlineStyles.underline ? "underline" : null,
      inlineStyles.strikethrough ? "line-through" : null,
    ]
      .filter(Boolean)
      .join(" ") || "none";

  return (
    <>
      <Story title="Action hierarchy" description="One clear primary action with quieter, task-appropriate alternatives." wide>
        <Inline>
          <Button><Icon source={AddIcon} />Create report</Button>
          <Button variant="secondary"><Icon source={DownloadIcon} />Export</Button>
          <Button variant="tertiary"><Icon source={FilterIcon} />Filter</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="danger"><Icon source={TrashIcon} />Delete report</Button>
          <Button variant="tertiary" aria-pressed="true"><Icon source={FavoriteIcon} />Pinned</Button>
          <Button disabled>Disabled</Button>
          <Button isPending pendingLabel="Saving…">Save changes</Button>
        </Inline>
      </Story>
      <Story title="Sizes" description="Choose by density and target size, not decoration.">
        <Inline>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
          <Button size="icon" variant="secondary" aria-label="Add item">
            <Icon source={AddIcon} />
          </Button>
        </Inline>
      </Story>
      <Story title="Enterprise toolbar" description="A named, arrow-key navigable command surface with grouped state, direct actions, and overflow." wide>
        <Stack>
          <ButtonGroup aria-label="Document actions">
            <Button size="small"><Icon source={SaveIcon} />Publish report</Button>
            <Button size="small" variant="secondary">Preview</Button>
            <Button size="small" variant="ghost">Save draft</Button>
          </ButtonGroup>
          <TooltipProvider>
            <Toolbar aria-labelledby="report-toolbar-label" density="compact">
              <ToolbarLabel id="report-toolbar-label">Report tools</ToolbarLabel>
              <ToolbarGroup aria-label="History">
                <ToolbarItem>
                  <Tooltip>
                    <TooltipTrigger asChild><Button size="small" variant="ghost" aria-label="Undo"><Icon source={UndoIcon} /></Button></TooltipTrigger>
                    <TooltipContent>Undo</TooltipContent>
                  </Tooltip>
                </ToolbarItem>
                <ToolbarItem>
                  <Tooltip>
                    <TooltipTrigger asChild><Button size="small" variant="ghost" aria-label="Redo"><Icon source={RedoIcon} /></Button></TooltipTrigger>
                    <TooltipContent>Redo</TooltipContent>
                  </Tooltip>
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarSeparator />
              <ToolbarGroup aria-label="Row density" variant="segmented">
                <ToolbarItem>
                  <Button
                    size="small"
                    variant="secondary"
                    aria-pressed={viewDensity === "comfortable"}
                    onClick={() => setViewDensity("comfortable")}
                  >
                    Comfortable
                  </Button>
                </ToolbarItem>
                <ToolbarItem>
                  <Button
                    size="small"
                    variant="secondary"
                    aria-pressed={viewDensity === "compact"}
                    onClick={() => setViewDensity("compact")}
                  >
                    Compact
                  </Button>
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarSpacer />
              <ToolbarGroup aria-label="Report actions">
                <ToolbarItem><Button size="small" variant="tertiary"><Icon source={FilterIcon} />Filters <Badge>3</Badge></Button></ToolbarItem>
                <ToolbarItem><Button size="small" variant="secondary"><Icon source={DownloadIcon} />Export</Button></ToolbarItem>
                <ToolbarItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button size="small" variant="ghost" aria-label="More report actions"><Icon source={MoreHorizontalIcon} /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>More actions</DropdownMenuLabel>
                      <DropdownMenuItem>Duplicate report</DropdownMenuItem>
                      <DropdownMenuItem>Move to workspace</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Archive report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </ToolbarItem>
                <ToolbarItem><Button size="small"><Icon source={AddIcon} />New report</Button></ToolbarItem>
              </ToolbarGroup>
            </Toolbar>
          </TooltipProvider>
        </Stack>
      </Story>
      <Story title="Rich text formatting" description="An editor command bar: font family and size, inline styles and alignment as pressed toggles, lists, and insert actions. Every control is arrow-key navigable." wide>
        <Stack>
          <TooltipProvider>
            <Toolbar aria-label="Text formatting" density="compact">
              <ToolbarGroup aria-label="Font">
                <ToolbarItem>
                  <Select
                    aria-label="Font family"
                    value={fontFamily}
                    onChange={(event) => setFontFamily(event.target.value)}
                    variant="ghost"
                    className="h-9 w-36"
                  >
                    <option value="inter">Inter</option>
                    <option value="system">System UI</option>
                    <option value="serif">Georgia</option>
                    <option value="mono">JetBrains Mono</option>
                  </Select>
                </ToolbarItem>
                <ToolbarItem>
                  <Select
                    aria-label="Font size"
                    value={fontSize}
                    onChange={(event) => setFontSize(event.target.value)}
                    variant="ghost"
                    className="h-9 w-20"
                  >
                    <option value="12">12</option>
                    <option value="14">14</option>
                    <option value="16">16</option>
                    <option value="18">18</option>
                    <option value="24">24</option>
                  </Select>
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarSeparator />
              <ToolbarGroup aria-label="Text style" variant="segmented">
                {(
                  [
                    ["bold", "Bold", BoldIcon],
                    ["italic", "Italic", ItalicIcon],
                    ["underline", "Underline", UnderlineIcon],
                    ["strikethrough", "Strikethrough", StrikethroughIcon],
                  ] as const
                ).map(([key, label, source]) => (
                  <ToolbarItem key={key}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="small"
                          variant="secondary"
                          aria-label={label}
                          aria-pressed={inlineStyles[key]}
                          onClick={() => toggleStyle(key)}
                        >
                          <Icon source={source} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{label}</TooltipContent>
                    </Tooltip>
                  </ToolbarItem>
                ))}
              </ToolbarGroup>
              <ToolbarSeparator />
              <ToolbarGroup aria-label="Alignment" variant="segmented">
                {(
                  [
                    ["left", "Align left", AlignLeftIcon],
                    ["center", "Align center", AlignCenterIcon],
                    ["right", "Align right", AlignRightIcon],
                  ] as const
                ).map(([value, label, source]) => (
                  <ToolbarItem key={value}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="small"
                          variant="secondary"
                          aria-label={label}
                          aria-pressed={alignment === value}
                          onClick={() => setAlignment(value)}
                        >
                          <Icon source={source} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{label}</TooltipContent>
                    </Tooltip>
                  </ToolbarItem>
                ))}
              </ToolbarGroup>
              <ToolbarSeparator />
              <ToolbarGroup aria-label="Lists" variant="segmented">
                <ToolbarItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="small"
                        variant="secondary"
                        aria-label="Bulleted list"
                        aria-pressed={listStyle === "bulleted"}
                        onClick={() =>
                          setListStyle((current) => (current === "bulleted" ? "none" : "bulleted"))
                        }
                      >
                        <Icon source={ListBulletedIcon} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Bulleted list</TooltipContent>
                  </Tooltip>
                </ToolbarItem>
                <ToolbarItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="small"
                        variant="secondary"
                        aria-label="Numbered list"
                        aria-pressed={listStyle === "numbered"}
                        onClick={() =>
                          setListStyle((current) => (current === "numbered" ? "none" : "numbered"))
                        }
                      >
                        <Icon source={ListNumberedIcon} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Numbered list</TooltipContent>
                  </Tooltip>
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarSpacer />
              <ToolbarGroup aria-label="Insert">
                <ToolbarItem>
                  <Tooltip>
                    <TooltipTrigger asChild><Button size="small" variant="ghost" aria-label="Insert link"><Icon source={LinkIcon} /></Button></TooltipTrigger>
                    <TooltipContent>Insert link</TooltipContent>
                  </Tooltip>
                </ToolbarItem>
                <ToolbarItem>
                  <Tooltip>
                    <TooltipTrigger asChild><Button size="small" variant="ghost" aria-label="Quote"><Icon source={QuoteIcon} /></Button></TooltipTrigger>
                    <TooltipContent>Quote</TooltipContent>
                  </Tooltip>
                </ToolbarItem>
                <ToolbarItem>
                  <Tooltip>
                    <TooltipTrigger asChild><Button size="small" variant="ghost" aria-label="Code block"><Icon source={CodeIcon} /></Button></TooltipTrigger>
                    <TooltipContent>Code block</TooltipContent>
                  </Tooltip>
                </ToolbarItem>
                <ToolbarItem>
                  <Tooltip>
                    <TooltipTrigger asChild><Button size="small" variant="ghost" aria-label="Text color"><Icon source={TextColorIcon} /></Button></TooltipTrigger>
                    <TooltipContent>Text color</TooltipContent>
                  </Tooltip>
                </ToolbarItem>
              </ToolbarGroup>
            </Toolbar>
          </TooltipProvider>
          <p
            className="border border-lumen-border bg-lumen-surface px-4 py-3 text-lumen-foreground"
            style={{
              fontFamily: formattingFontFamilies[fontFamily],
              fontSize: `${fontSize}px`,
              fontWeight: inlineStyles.bold ? 700 : 400,
              fontStyle: inlineStyles.italic ? "italic" : "normal",
              textDecoration: previewDecoration,
              textAlign: alignment,
            }}
          >
            The quarterly summary previews your live formatting choices.
          </p>
        </Stack>
      </Story>
    </>
  );
}

const assistantContextLibrary = [
  { id: "forecast", label: "Q3 forecast model", hint: "Spreadsheet" },
  { id: "pricing", label: "Pricing v2 doc", hint: "Document" },
  { id: "tickets", label: "Support tickets", hint: "Dataset" },
  { id: "roadmap", label: "Roadmap 2026", hint: "Page" },
];

const assistantContextUsage: PromptComposerContextSegment[] = [
  { id: "system", label: "System prompt", tokens: 3_600, tone: "neutral" },
  { id: "tools", label: "Tool definitions", tokens: 2_200, tone: "warning", hint: "12 tools" },
  { id: "messages", label: "Your messages", tokens: 4_200, tone: "primary" },
  { id: "responses", label: "Assistant responses", tokens: 4_400, tone: "success" },
];

function AssistantStories() {
  const [message, setMessage] = React.useState("");
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [attachments, setAttachments] = React.useState<string[]>([
    "forecast.csv",
    "chart.png",
  ]);
  const [context, setContext] = React.useState<string[]>(["forecast"]);

  const toggleContext = (id: string) =>
    setContext((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  const send = () => {
    if (message.trim().length === 0 && attachments.length === 0) return;
    setMessage("");
    setAttachments([]);
  };

  return (
    <>
      <Story
        title="Prompt composer"
        description="A bottom-docked assistant input: an @-mention context picker, a detailed context-usage popover, attachment previews, an auto-growing field, and a Send control that becomes Stop while streaming. Enter sends; Shift+Enter adds a line."
        wide
      >
        <div className="assistant-composer-demo">
          <div className="assistant-composer-demo__header">
            <div className="assistant-composer-demo__identity">
              <span className="assistant-composer-demo__mark" aria-hidden="true">L</span>
              <span>
                <strong>Lumen Assistant</strong>
                <small><span aria-hidden="true" />Ready for workspace questions</small>
              </span>
            </div>
            <Button
              size="small"
              variant="secondary"
              aria-pressed={isStreaming}
              onClick={() => setIsStreaming((current) => !current)}
            >
              {isStreaming ? "Stop preview" : "Preview streaming"}
            </Button>
          </div>
          <div className="assistant-composer-demo__thread">
            <div className="assistant-composer-demo__welcome">
              <span className="assistant-composer-demo__spark" aria-hidden="true">✦</span>
              <div>
                <strong>What would you like to understand?</strong>
                <p>I can compare forecasts, summarize documents, and trace the data already in context.</p>
              </div>
            </div>
          </div>
          <div className="assistant-composer-demo__dock">
          <div className="assistant-composer-shell">
          <PromptComposer className="assistant-composer">
            {attachments.length > 0 ? (
              <PromptComposerAttachments aria-label="Attached files">
                {attachments.map((name) => (
                  <PromptComposerAttachment
                    key={name}
                    name={name}
                    size="82 KB"
                    media={
                      <span className="assistant-attachment-icon" aria-hidden="true">
                        <Icon source={CopyIcon} />
                      </span>
                    }
                    onRemove={() =>
                      setAttachments((current) => current.filter((item) => item !== name))
                    }
                  />
                ))}
              </PromptComposerAttachments>
            ) : null}
            <PromptComposerField
              id="assistant-message"
              label="Message"
              placeholder="Ask Lumen to analyze this workspace…"
              value={message}
              onChange={(event) => setMessage(event.currentTarget.value)}
              onSubmit={send}
            />
            {context.length > 0 ? (
              <ul className="assistant-context-list" aria-label="Active context">
                {context.map((id) => {
                  const item = assistantContextLibrary.find((entry) => entry.id === id);
                  if (!item) return null;
                  return (
                    <li
                      key={id}
                      className="assistant-context-chip"
                    >
                      <span aria-hidden="true" className="assistant-context-chip__mark">@</span>
                      {item.label}
                      <button
                        type="button"
                        aria-label={`Remove ${item.label}`}
                        onClick={() => toggleContext(id)}
                        className="assistant-context-chip__remove"
                      >
                        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" className="size-3">
                          <path d="M4 4l8 8M12 4l-8 8" />
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
            <PromptComposerToolbar>
              <PromptComposerControls className="assistant-composer-controls">
                <Button size="small" variant="ghost" className="h-10 gap-1.5 px-2.5" aria-pressed="true">
                  <span className="assistant-mode-indicator" aria-hidden="true">✦</span>
                  Agent
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="small" variant="ghost" className="h-10 gap-1.5 px-2.5">
                      <span aria-hidden="true" className="text-base font-semibold leading-none">@</span>
                      {context.length > 0 ? `Context · ${context.length}` : "Add context"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-72 p-0">
                    <div className="border-b border-lumen-border px-3 py-2.5">
                      <p className="text-sm font-semibold text-lumen-foreground">Add context</p>
                      <p className="text-xs text-lumen-muted-foreground">Reference workspace files, docs, and data.</p>
                    </div>
                    <ul className="grid gap-0.5 p-1">
                      {assistantContextLibrary.map((item) => (
                        <li key={item.id}>
                          <label className="flex cursor-pointer items-center gap-2.5 rounded-lumen-control px-2 py-1.5 hover:bg-lumen-surface-muted">
                            <Checkbox
                              checked={context.includes(item.id)}
                              onChange={() => toggleContext(item.id)}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium text-lumen-foreground">{item.label}</span>
                              <span className="block text-xs text-lumen-muted-foreground">{item.hint}</span>
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </PopoverContent>
                </Popover>
                <Select aria-label="Model" defaultValue="pro" variant="ghost" className="assistant-model-select h-10 w-auto min-w-36">
                  <option value="pro">Lumen Pro</option>
                  <option value="fast">Lumen Fast</option>
                </Select>
                <PromptComposerContextMeter
                  className="assistant-context-meter"
                  used={14_400}
                  total={80_000}
                  reserved={8_000}
                  segments={assistantContextUsage}
                />
              </PromptComposerControls>
              <PromptComposerActions>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-11 rounded-full [&_svg]:size-[1.125rem]"
                  aria-label="Add attachment"
                  onClick={() =>
                    setAttachments((current) => [...current, `note-${current.length + 1}.txt`])
                  }
                >
                  <Icon source={AddIcon} />
                </Button>
                <PromptComposerSubmit
                  size="icon"
                  className="size-11 [&_svg]:size-[1.125rem]"
                  isStreaming={isStreaming}
                  disabled={!isStreaming && message.trim().length === 0 && attachments.length === 0}
                  sendIcon={<Icon source={ArrowUpIcon} />}
                  stopIcon={<span className="size-2.5 rounded-[2px] bg-current" aria-hidden="true" />}
                  onClick={send}
                  onStop={() => setIsStreaming(false)}
                />
              </PromptComposerActions>
            </PromptComposerToolbar>
          </PromptComposer>
          <p className="assistant-composer-hint">Enter to send <span aria-hidden="true">·</span> Shift + Enter for a new line</p>
          </div>
          </div>
        </div>
      </Story>
    </>
  );
}

function FormStories() {
  return (
    <>
      <Story title="Text fields" description="Labels, guidance, and errors remain programmatically connected.">
        <Stack>
          <TextField
            id="workbench-email"
            label="Work email"
            labelMeta="Required"
            sublabel="Used for sign-in, alerts, and account recovery."
            description="Use the address your team already recognizes."
            required
            placeholder="name@company.com"
            autoComplete="email"
          />
          <TextField
            id="workbench-project-code"
            label="Project code"
            labelMeta="Required"
            sublabel="A short identifier shown in report URLs."
            defaultValue="LM-"
            error="Enter at least four characters."
            required
          />
          <Field>
            <FieldLabelRow>
              <FieldLabel htmlFor="workbench-plain-input">Plain input primitive</FieldLabel>
              <FieldLabelMeta>Optional</FieldLabelMeta>
            </FieldLabelRow>
            <FieldSublabel>Compose lower-level fields when the layout needs it.</FieldSublabel>
            <Input id="workbench-plain-input" placeholder="Input" />
            <FieldDescription>Persistent help remains visible after a value is entered.</FieldDescription>
          </Field>
        </Stack>
      </Story>
      <Story title="Text and selection" description="Native controls preserve resilient keyboard behavior.">
        <Stack>
          <Field>
            <FieldLabelRow>
              <FieldLabel htmlFor="workbench-summary">Summary</FieldLabel>
              <FieldLabelMeta>Optional</FieldLabelMeta>
            </FieldLabelRow>
            <FieldSublabel>Keep the update concise and useful to reviewers.</FieldSublabel>
            <Textarea id="workbench-summary" placeholder="Add a concise update…" />
            <FieldDescription>Maximum 500 characters.</FieldDescription>
          </Field>
          <Field>
            <FieldLabelRow>
              <FieldLabel htmlFor="workbench-team">Team</FieldLabel>
              <FieldLabelMeta>Required</FieldLabelMeta>
            </FieldLabelRow>
            <FieldSublabel>Routes ownership and review notifications.</FieldSublabel>
            <Select id="workbench-team" defaultValue="design" required>
              <option value="design">Design systems</option>
              <option value="platform">Platform</option>
              <option value="growth">Growth</option>
            </Select>
            <FieldDescription>You can change the owning team later.</FieldDescription>
          </Field>
        </Stack>
      </Story>
      <Story title="Choice controls" description="Visible labels and native input semantics work together.">
        <Stack gap="sm">
          <ChoiceField>
            <Checkbox id="workbench-weekly-digest" aria-describedby="workbench-weekly-digest-description" defaultChecked />
            <span><ChoiceFieldLabel htmlFor="workbench-weekly-digest">Email me a weekly summary</ChoiceFieldLabel><ChoiceFieldDescription id="workbench-weekly-digest-description">Receive a concise activity digest every Monday.</ChoiceFieldDescription></span>
          </ChoiceField>
          <Fieldset>
            <Legend>Report cadence</Legend>
            <FieldSublabel>Choose how often scheduled reports are generated.</FieldSublabel>
            <ChoiceField><Radio id="workbench-cadence-daily" name="cadence" aria-describedby="workbench-cadence-daily-description" defaultChecked /><span><ChoiceFieldLabel htmlFor="workbench-cadence-daily">Daily</ChoiceFieldLabel><ChoiceFieldDescription id="workbench-cadence-daily-description">Generate at 09:00 in the workspace timezone.</ChoiceFieldDescription></span></ChoiceField>
            <ChoiceField><Radio id="workbench-cadence-weekly" name="cadence" aria-describedby="workbench-cadence-weekly-description" /><span><ChoiceFieldLabel htmlFor="workbench-cadence-weekly">Weekly</ChoiceFieldLabel><ChoiceFieldDescription id="workbench-cadence-weekly-description">Generate every Monday morning.</ChoiceFieldDescription></span></ChoiceField>
          </Fieldset>
          <ChoiceField>
            <Switch id="workbench-auto-refresh" aria-describedby="workbench-auto-refresh-description" defaultChecked />
            <span><ChoiceFieldLabel htmlFor="workbench-auto-refresh">Automatic refresh</ChoiceFieldLabel><ChoiceFieldDescription id="workbench-auto-refresh-description">Apply changes immediately when a connected source updates.</ChoiceFieldDescription></span>
          </ChoiceField>
        </Stack>
      </Story>
      <Story title="Specialized inputs" description="Purpose-specific native controls with consistent treatment." wide>
        <div className="form-grid">
          <Field>
            <FieldLabelRow>
              <FieldLabel htmlFor="workbench-search">Search</FieldLabel>
              <FieldLabelMeta>Optional</FieldLabelMeta>
            </FieldLabelRow>
            <SearchInput id="workbench-search" placeholder="Search records" />
          </Field>
          <Field>
            <FieldLabel htmlFor="workbench-number">Seats</FieldLabel>
            <NumberInput id="workbench-number" min={1} defaultValue={12} />
          </Field>
          <Field>
            <FieldLabel htmlFor="workbench-file">Attachment</FieldLabel>
            <FileInput id="workbench-file" />
            <FieldDescription>PDF or CSV up to 10 MB.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="workbench-slider">Confidence</FieldLabel>
            <Slider id="workbench-slider" min={0} max={100} defaultValue={72} />
            <FieldDescription>Current threshold: 72%</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="workbench-url">Webhook URL</FieldLabel>
            <Input id="workbench-url" type="url" placeholder="https://api.example.com/events" />
          </Field>
          <Field>
            <FieldLabel htmlFor="workbench-date">Reporting date</FieldLabel>
            <Input id="workbench-date" type="date" defaultValue="2026-07-25" />
          </Field>
          <Field>
            <FieldLabel htmlFor="workbench-time">Delivery time</FieldLabel>
            <Input id="workbench-time" type="time" defaultValue="09:00" />
          </Field>
          <Field>
            <FieldLabelRow>
              <FieldLabel htmlFor="workbench-color">Series color</FieldLabel>
              <FieldLabelMeta>Optional</FieldLabelMeta>
            </FieldLabelRow>
            <Input id="workbench-color" type="color" defaultValue="#0a66ff" />
          </Field>
        </div>
      </Story>
      <Story title="Guided text entry" description="Live constraints and password visibility remain explicitly labeled.">
        <Stack>
          <CharacterCount
            id="workbench-character-count"
            label="Release summary"
            labelMeta="Optional"
            sublabel="Shown to workspace members in the activity feed."
            description="Describe the customer-facing change."
            maxLength={120}
            defaultValue="Faster report exports"
          />
          <PasswordField
            id="workbench-password"
            label="Workspace password"
            labelMeta="Required"
            sublabel="Protects exports shared outside your organization."
            description="Use at least 12 characters."
            required
            autoComplete="new-password"
          />
        </Stack>
      </Story>
      <Story title="Structured input" description="Related controls share context without hiding native inputs.">
        <Stack>
          <DateInput
            id="workbench-launch-date"
            legend="Launch date"
            description="For example, 31 3 2026"
            defaultValue={{ day: 17, month: 7, year: 2026 }}
          />
          <Field>
            <FieldLabel htmlFor="workbench-domain">Workspace URL</FieldLabel>
            <InputGroup aria-label="Workspace URL">
              <InputGroupAddon>https://</InputGroupAddon>
              <Input id="workbench-domain" defaultValue="lumen.example" />
              <InputGroupAddon>/reports</InputGroupAddon>
            </InputGroup>
          </Field>
        </Stack>
      </Story>
      <Story title="Form actions" description="Clear action hierarchy keeps the raised Lumen button treatment without overpowering the fields.">
        <Stack>
          <p className="text-sm text-lumen-muted-foreground">Save the current workspace settings or leave without applying changes.</p>
          <ButtonGroup>
            <Button>Save changes</Button>
            <Button variant="secondary">Cancel</Button>
            <Button variant="ghost">Reset form</Button>
          </ButtonGroup>
        </Stack>
      </Story>
      <Story title="Error summary" description="Long forms can move focus to one overview that links back to each field." wide>
        <ErrorSummary>
          <ErrorSummaryTitle as="h4">There is a problem</ErrorSummaryTitle>
          <p className="text-sm text-lumen-muted-foreground">Correct these fields before continuing.</p>
          <ErrorSummaryList>
            <ErrorSummaryItem href="#workbench-project-code">Enter a project code with at least four characters</ErrorSummaryItem>
            <ErrorSummaryItem href="#workbench-password">Enter a password with at least 12 characters</ErrorSummaryItem>
          </ErrorSummaryList>
        </ErrorSummary>
      </Story>
    </>
  );
}

function FeedbackStories() {
  return (
    <>
      <Story title="Alerts and banners" description="Meaning is conveyed with text and role, never color alone." wide>
        <Stack>
          <Alert title="Ready to publish">All required checks have passed.</Alert>
          <Alert variant="success" title="Changes saved">Your report is up to date.</Alert>
          <Alert variant="warning" title="Review needed">Two records are missing owners.</Alert>
          <Alert variant="danger" title="Sync failed">Reconnect the data source and try again.</Alert>
          <Banner title="Scheduled maintenance">Exports pause Saturday at 02:00 UTC.</Banner>
        </Stack>
      </Story>
      <Story title="Badges, tags, and status" description="Compact metadata for scanning dense product views.">
        <Stack>
          <Inline>
            <Badge>Draft</Badge>
            <Badge variant="primary">New</Badge>
            <Badge variant="success">Healthy</Badge>
            <Tag variant="warning">Needs review</Tag>
            <Tag variant="danger">Blocked</Tag>
          </Inline>
          <StatusIndicator status="success">API operational</StatusIndicator>
          <StatusIndicator status="warning">Queue delayed</StatusIndicator>
        </Stack>
      </Story>
      <Story title="Progress and loading" description="Motion respects reduced-motion preferences.">
        <Stack>
          <Progress value={68} max={100} aria-label="Import progress: 68 percent" />
          <Inline><Spinner /> <span>Importing 34 records…</span></Inline>
          <div className="skeleton-stack">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </Stack>
      </Story>
      <Story title="Empty state" description="A clear next action without visual clutter." wide>
        <EmptyState title="No reports yet" description="Create a report to start monitoring this workspace.">
          <Button>Create report</Button>
          <Button variant="secondary">View guide</Button>
        </EmptyState>
        <Separator />
      </Story>
    </>
  );
}

function InlineEditDemo() {
  const [projectName, setProjectName] = React.useState("Lumen migration");

  return (
    <InlineEdit
      label="Project name"
      value={projectName}
      onSave={setProjectName}
      validate={(nextValue) => nextValue.trim() ? undefined : "Enter a project name."}
    />
  );
}

const reportRows = [
  { id: "quarterly", name: "Quarterly performance", category: "Finance", owner: "Amira Reed", initials: "AR", status: "Ready", updated: "Today" },
  { id: "retention", name: "Customer retention", category: "Growth", owner: "Luca Neri", initials: "LN", status: "Review", updated: "Yesterday" },
  { id: "operations", name: "Operations overview", category: "Operations", owner: "Dae Lee", initials: "DL", status: "Draft", updated: "12 July" },
  { id: "revenue", name: "Revenue breakdown", category: "Finance", owner: "Mara Bianchi", initials: "MB", status: "Ready", updated: "10 July" },
  { id: "adoption", name: "Feature adoption", category: "Product", owner: "Sofia Marin", initials: "SM", status: "Scheduled", updated: "8 July" },
  { id: "incidents", name: "Incident summary", category: "Reliability", owner: "Tom Fox", initials: "TF", status: "Failed", updated: "5 July" },
] as const;

const reportStatusTone = {
  Ready: "success",
  Review: "warning",
  Failed: "danger",
} as const;

function ComplexTableDemo() {
  const [query, setQuery] = React.useState("");
  const [ownerFilter, setOwnerFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [sortDirection, setSortDirection] = React.useState<"ascending" | "descending">("ascending");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const visibleRows = reportRows
    .filter((row) => {
      const normalizedQuery = query.trim().toLocaleLowerCase();
      const matchesQuery = !normalizedQuery
        || row.name.toLocaleLowerCase().includes(normalizedQuery)
        || row.owner.toLocaleLowerCase().includes(normalizedQuery);
      const matchesOwner = ownerFilter === "all" || row.owner === ownerFilter;
      const matchesStatus = statusFilter === "all" || row.status === statusFilter;
      return matchesQuery && matchesOwner && matchesStatus;
    })
    .slice()
    .sort((left, right) => {
      const result = left.name.localeCompare(right.name);
      return sortDirection === "ascending" ? result : -result;
    });
  const allVisibleSelected = visibleRows.length > 0 && visibleRows.every((row) => selected.includes(row.id));
  const appliedFilterCount = Number(ownerFilter !== "all") + Number(statusFilter !== "all");
  const resultLabel = `${visibleRows.length} of ${reportRows.length} ${visibleRows.length === 1 ? "report" : "reports"}`;

  function clearFilters() {
    setOwnerFilter("all");
    setQuery("");
    setStatusFilter("all");
  }

  function toggleAllVisible() {
    setSelected((current) => allVisibleSelected
      ? current.filter((id) => !visibleRows.some((row) => row.id === id))
      : Array.from(new Set([...current, ...visibleRows.map((row) => row.id)])));
  }

  function toggleRow(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  }

  return (
    <div data-demo="complex-table" className="overflow-hidden border border-lumen-border shadow-lumen-card">
      <TableToolbar className="border-0 border-b border-lumen-border">
        <TableToolbarHeader>
          <div className="min-w-0">
            <TableToolbarTitle as="h4">Workspace reports</TableToolbarTitle>
            <TableToolbarDescription>
              <span role="status" aria-live="polite">{resultLabel}</span> · Updated a few seconds ago
            </TableToolbarDescription>
          </div>
          <TableToolbarActions aria-label="Report table actions">
            <Button size="small"><Icon source={DownloadIcon} /> Export</Button>
          </TableToolbarActions>
        </TableToolbarHeader>
        {selected.length ? (
          <TableBatchActions
            className="border-t border-y-0 border-r-0 border-b-0"
            selectedCount={selected.length}
            totalCount={reportRows.length}
          >
            <Button size="small" variant="secondary">Archive</Button>
            <Button size="small" variant="secondary">Assign owner</Button>
            <Button size="small" variant="ghost" onClick={() => setSelected([])}>Clear selection</Button>
          </TableBatchActions>
        ) : (
          <>
            <TableToolbarFilters>
              <TableToolbarContent>
                <Field className="table-search-field">
                  <FieldLabel htmlFor="report-table-search">Search reports</FieldLabel>
                  <SearchInput
                    id="report-table-search"
                    value={query}
                    onChange={(event) => setQuery(event.currentTarget.value)}
                    placeholder="Search by report or owner"
                  />
                </Field>
              </TableToolbarContent>
              <div className="table-filter-inline" aria-label="Report filters">
                <Field className="table-filter-control">
                  <FieldLabel htmlFor="report-status-filter">Status</FieldLabel>
                  <Select id="report-status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.currentTarget.value)}>
                    <option value="all">All statuses</option>
                    <option value="Ready">Ready</option>
                    <option value="Review">Review</option>
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Failed">Failed</option>
                  </Select>
                </Field>
                <Field className="table-filter-control">
                  <FieldLabel htmlFor="report-owner-filter">Owner</FieldLabel>
                  <Select id="report-owner-filter" value={ownerFilter} onChange={(event) => setOwnerFilter(event.currentTarget.value)}>
                    <option value="all">All owners</option>
                    {reportRows.map((row) => <option key={row.id} value={row.owner}>{row.owner}</option>)}
                  </Select>
                </Field>
              </div>
              <div className="table-filter-mobile">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="small" variant="secondary">
                      <Icon source={FilterIcon} />
                      Filters
                      {appliedFilterCount ? <Badge variant="primary">{appliedFilterCount}</Badge> : null}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="table-filter-popover">
                    <Stack>
                      <div>
                        <strong>Filter reports</strong>
                        <p className="muted-copy">Narrow the current result set.</p>
                      </div>
                      <Field>
                        <FieldLabel htmlFor="report-status-filter-mobile">Status</FieldLabel>
                        <Select id="report-status-filter-mobile" value={statusFilter} onChange={(event) => setStatusFilter(event.currentTarget.value)}>
                          <option value="all">All statuses</option>
                          <option value="Ready">Ready</option>
                          <option value="Review">Review</option>
                          <option value="Draft">Draft</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Failed">Failed</option>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="report-owner-filter-mobile">Owner</FieldLabel>
                        <Select id="report-owner-filter-mobile" value={ownerFilter} onChange={(event) => setOwnerFilter(event.currentTarget.value)}>
                          <option value="all">All owners</option>
                          {reportRows.map((row) => <option key={row.id} value={row.owner}>{row.owner}</option>)}
                        </Select>
                      </Field>
                      <Button size="small" variant="ghost" onClick={clearFilters} disabled={!appliedFilterCount && !query}>Clear filters</Button>
                    </Stack>
                  </PopoverContent>
                </Popover>
              </div>
            </TableToolbarFilters>
            {appliedFilterCount ? (
              <TableAppliedFilters
                clearAction={<Button size="small" variant="ghost" onClick={clearFilters}>Clear filters</Button>}
              >
                {statusFilter !== "all" ? (
                  <TableFilterTag
                    label="Status"
                    value={statusFilter}
                    removeLabel={`Remove status filter ${statusFilter}`}
                    onRemove={() => setStatusFilter("all")}
                  />
                ) : null}
                {ownerFilter !== "all" ? (
                  <TableFilterTag
                    label="Owner"
                    value={ownerFilter}
                    removeLabel={`Remove owner filter ${ownerFilter}`}
                    onRemove={() => setOwnerFilter("all")}
                  />
                ) : null}
              </TableAppliedFilters>
            ) : null}
          </>
        )}
      </TableToolbar>
      <Table containerProps={{ "aria-label": "Scrollable reports table", tabIndex: 0 }}>
        <TableCaption className="sr-only">Workspace reports and their current publishing state</TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableSelectionCell
              as="th"
              label={allVisibleSelected ? "Deselect all visible reports" : "Select all visible reports"}
              inputProps={{ checked: allVisibleSelected, onChange: toggleAllVisible }}
            />
            <TableSortableHead
              direction={sortDirection}
              onSort={() => setSortDirection((current) => current === "ascending" ? "descending" : "ascending")}
            >
              Report
            </TableSortableHead>
            <TableSortableHead sortable={false}>Owner</TableSortableHead>
            <TableSortableHead sortable={false}>Status</TableSortableHead>
            <TableSortableHead sortable={false}>Updated</TableSortableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleRows.length ? visibleRows.map((row) => (
            <TableRow key={row.id} data-selected={selected.includes(row.id) || undefined} className="data-[selected=true]:bg-lumen-primary/5">
              <TableSelectionCell label={`Select ${row.name}`} inputProps={{ checked: selected.includes(row.id), onChange: () => toggleRow(row.id) }} />
              <TableCell>
                <div className="font-semibold text-lumen-foreground">{row.name}</div>
                <div className="text-xs text-lumen-muted-foreground">{row.category}</div>
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-2">
                  <Avatar alt="" fallback={row.initials} className="size-7 text-xs" />
                  <span className="truncate">{row.owner}</span>
                </span>
              </TableCell>
              <TableCell><StatusIndicator status={reportStatusTone[row.status as keyof typeof reportStatusTone] ?? "neutral"}>{row.status}</StatusIndicator></TableCell>
              <TableCell className="whitespace-nowrap text-lumen-muted-foreground">{row.updated}</TableCell>
              <TableRowActions>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" aria-label={`Actions for ${row.name}`}><Icon source={MoreHorizontalIcon} /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end"><DropdownMenuItem>Open</DropdownMenuItem><DropdownMenuItem>Duplicate</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem>Archive</DropdownMenuItem></DropdownMenuContent>
                </DropdownMenu>
              </TableRowActions>
            </TableRow>
          )) : (
            <TableEmptyState colSpan={6} title="No matching reports" description="Clear the search or adjust the filters." action={<Button size="small" variant="secondary" onClick={clearFilters}>Clear filters</Button>} />
          )}
        </TableBody>
      </Table>
      <TableSortAnnouncement>Sorted by report, {sortDirection}.</TableSortAnnouncement>
      <TablePagination className="border-0 border-t border-lumen-border" start={visibleRows.length ? 1 : 0} end={visibleRows.length} total={visibleRows.length}>
        <Button size="small" variant="secondary" disabled>Previous</Button>
        <Button size="small" variant="secondary" disabled>Next</Button>
      </TablePagination>
    </div>
  );
}

function DataStories() {
  return (
    <>
      <Story title="Cards and stats" description="Composable surfaces hold related content and actions." wide>
        <CardGroup columns={2} motion="stagger">
          <Card>
            <CardHeader>
              <CardDescription>Active workspaces</CardDescription>
              <CardTitle>142</CardTitle>
            </CardHeader>
            <CardContent><StatusIndicator status="success">Up 8% this month</StatusIndicator></CardContent>
            <CardFooter><Button size="small" variant="secondary">View workspaces</Button></CardFooter>
          </Card>
          <Card>
            <CardHeader><CardTitle>Usage</CardTitle><CardDescription>Current billing cycle</CardDescription></CardHeader>
            <CardContent>
              <div className="stat-grid">
                <Stat><StatLabel>API calls</StatLabel><StatValue>84.2k</StatValue></Stat>
                <Stat><StatLabel>Storage</StatLabel><StatValue>61%</StatValue></Stat>
              </div>
            </CardContent>
          </Card>
        </CardGroup>
      </Story>
      <Story title="Avatar and details" description="Identity and key-value information remain semantic.">
        <Stack>
          <Inline><Avatar alt="" fallback="LN" /><div><strong>Luca Neri</strong><p className="muted-copy">Workspace owner</p></div></Inline>
          <AvatarGroup aria-label="Project members">
            <AvatarGroupItem><Avatar alt="" fallback="LN" /></AvatarGroupItem>
            <AvatarGroupItem><Avatar alt="" fallback="AR" /></AvatarGroupItem>
            <AvatarGroupItem><Avatar alt="" fallback="MB" /></AvatarGroupItem>
          </AvatarGroup>
          <DescriptionList>
            <DescriptionTerm>Region</DescriptionTerm><DescriptionDetails>Europe West</DescriptionDetails>
            <DescriptionTerm>Plan</DescriptionTerm><DescriptionDetails>Enterprise</DescriptionDetails>
            <DescriptionTerm>Renewal</DescriptionTerm><DescriptionDetails>12 September</DescriptionDetails>
          </DescriptionList>
        </Stack>
      </Story>
      <Story title="Lists and code" description="Structured content and syntax roles remain semantic, readable, and
      -aware." wide>
        <div className="content-specimen">
          <section className="content-list-demo" aria-labelledby="setup-checklist-title">
            <div className="content-list-demo__header">
              <div>
                <p className="eyebrow">Getting started</p>
                <h4 id="setup-checklist-title">Prepare your workspace</h4>
              </div>
              <Badge variant="neutral">3 steps</Badge>
            </div>
            <List className="content-checklist" aria-label="Workspace setup checklist">
              <ListItem>
                <span className="content-checklist__index" aria-hidden="true">01</span>
                <span><strong>Invite the project team</strong><small>Assign owners before work begins.</small></span>
              </ListItem>
              <ListItem>
                <span className="content-checklist__index" aria-hidden="true">02</span>
                <span><strong>Connect a data source</strong><small>Use a read-only credential for the first sync.</small></span>
              </ListItem>
              <ListItem>
                <span className="content-checklist__index" aria-hidden="true">03</span>
                <span><strong>Publish the first report</strong><small>Review permissions before sharing.</small></span>
              </ListItem>
            </List>
          </section>
          <section className="code-example" aria-labelledby="code-example-title">
            <div className="code-example__header">
              <span id="code-example-title">button-example.tsx</span>
              <span>TypeScript · React</span>
            </div>
            <CodeBlock className="code-example__block" aria-label="React button example" tabIndex={0}>
              <code>
                <CodeToken tone="comment">{"// Server Component by default"}</CodeToken>{"\n"}
                <CodeToken tone="keyword">import</CodeToken>{" { "}
                <CodeToken tone="function">Button</CodeToken>{" } "}
                <CodeToken tone="keyword">from</CodeToken>{" "}
                <CodeToken tone="string">{'"lumen-ui-kit"'}</CodeToken>
                <CodeToken tone="punctuation">;</CodeToken>{"\n\n"}
                <CodeToken tone="keyword">export function</CodeToken>{" "}
                <CodeToken tone="function">ContinueAction</CodeToken>
                <CodeToken tone="punctuation">{"() {"}</CodeToken>{"\n  "}
                <CodeToken tone="keyword">return</CodeToken>{" "}
                <CodeToken tone="punctuation">(</CodeToken>{"\n    "}
                <CodeToken tone="tag">{"<Button"}</CodeToken>{" "}
                <CodeToken tone="property">variant</CodeToken>
                <CodeToken tone="punctuation">=</CodeToken>
                <CodeToken tone="string">{'"primary"'}</CodeToken>
                <CodeToken tone="tag">{">"}</CodeToken>{"\n      Continue\n    "}
                <CodeToken tone="tag">{"</Button>"}</CodeToken>{"\n  "}
                <CodeToken tone="punctuation">{");\n}"}</CodeToken>
              </code>
            </CodeBlock>
          </section>
        </div>
      </Story>
      <Story title="Resource list" description="Rich related items keep native list semantics, useful metadata, and always-visible actions." wide>
        <ResourceList aria-label="Recent reports">
          <ResourceListItem aria-labelledby="resource-report-quarterly">
            <ResourceListContent>
              <ResourceListTitle id="resource-report-quarterly" as="h4"><a href="#quarterly">Quarterly performance report</a></ResourceListTitle>
              <ResourceListDescription>Revenue, adoption, and customer-retention trends for the leadership review.</ResourceListDescription>
              <ResourceListMetadata aria-label="Quarterly performance report metadata">
                <ResourceListMetadataItem>Updated today</ResourceListMetadataItem>
                <ResourceListMetadataItem>PDF</ResourceListMetadataItem>
                <ResourceListMetadataItem>12 pages</ResourceListMetadataItem>
              </ResourceListMetadata>
            </ResourceListContent>
            <ResourceListActions aria-label="Quarterly performance report actions"><Button size="small" variant="secondary">Download</Button></ResourceListActions>
          </ResourceListItem>
          <ResourceListItem aria-labelledby="resource-report-retention">
            <ResourceListContent>
              <ResourceListTitle id="resource-report-retention" as="h4"><a href="#retention">Customer retention analysis</a></ResourceListTitle>
              <ResourceListDescription>Cohort movement and renewal risks across enterprise workspaces.</ResourceListDescription>
              <ResourceListMetadata aria-label="Customer retention analysis metadata"><ResourceListMetadataItem>Updated yesterday</ResourceListMetadataItem><ResourceListMetadataItem>Dashboard</ResourceListMetadataItem></ResourceListMetadata>
            </ResourceListContent>
            <ResourceListActions aria-label="Customer retention analysis actions"><Button size="small" variant="secondary">Open</Button></ResourceListActions>
          </ResourceListItem>
        </ResourceList>
      </Story>
      <Story title="Table" description="Headers, caption, status, and horizontal overflow are built in." wide>
        <Table>
          <TableCaption>Recent data source activity</TableCaption>
          <TableHeader><TableRow><TableHead>Source</TableHead><TableHead>Owner</TableHead><TableHead>Status</TableHead><TableHead>Updated</TableHead></TableRow></TableHeader>
          <TableBody>
            <TableRow><TableCell>Product analytics</TableCell><TableCell>M. Rossi</TableCell><TableCell><StatusIndicator status="success">Synced</StatusIndicator></TableCell><TableCell>2 min ago</TableCell></TableRow>
            <TableRow><TableCell>Billing export</TableCell><TableCell>A. Costa</TableCell><TableCell><StatusIndicator status="warning">Delayed</StatusIndicator></TableCell><TableCell>18 min ago</TableCell></TableRow>
            <TableRow><TableCell>Support tickets</TableCell><TableCell>D. Lee</TableCell><TableCell><StatusIndicator>Paused</StatusIndicator></TableCell><TableCell>Yesterday</TableCell></TableRow>
          </TableBody>
        </Table>
      </Story>
      <Story title="Complex table" description="Controlled search, selection, sorting, batch actions, row actions, empty state, announcements, and pagination compose around native table markup." wide>
        <ComplexTableDemo />
      </Story>
      <Story title="Summary and attributes" description="Key details can include clearly separated actions." wide>
        <SummaryList>
          <SummaryRow><SummaryTerm>Owner</SummaryTerm><SummaryDetails>Amira Reed</SummaryDetails><SummaryActions><Link href="#owner">Change</Link></SummaryActions></SummaryRow>
          <SummaryRow><SummaryTerm>Data region</SummaryTerm><SummaryDetails>Europe West</SummaryDetails><SummaryActions><Link href="#region">Change</Link></SummaryActions></SummaryRow>
          <SummaryRow><SummaryTerm>Retention</SummaryTerm><SummaryDetails>90 days</SummaryDetails><SummaryActions><Link href="#retention">Change</Link></SummaryActions></SummaryRow>
        </SummaryList>
      </Story>
      <Story title="Task list" description="Each task link announces its short hint and current status." wide>
        <TaskList>
          <TaskListItem href="#contact" title="Contact details" hint="Add the report owner and escalation contact" status="Completed" statusTone="success" />
          <TaskListItem href="#sources" title="Connect data sources" hint="Choose at least one source" status="In progress" statusTone="primary" />
          <TaskListItem href="#review" title="Review access" status="Not started" />
        </TaskList>
      </Story>
      <Story title="Content utilities" description="Quiet context, safe truncation, copy status, and focused editing." wide>
        <Stack>
          <Callout title="Before publishing" variant="info">Confirm that every data source has an accountable owner.</Callout>
          <Truncate lines={2}>This intentionally long activity description is clamped after two lines while the source content remains available to assistive technology and can be exposed in full where the product needs it.</Truncate>
          <ClipboardCopy value="npm install lumen-ui-kit" />
          <InlineEditDemo />
        </Stack>
      </Story>
    </>
  );
}

const serviceGraphNodes: readonly GraphNode[] = [
  {
    id: "storefront",
    label: "Web storefront",
    labels: ["Application"],
    description: "Customer-facing commerce application.",
    properties: { runtime: "Next.js", region: "eu-west-1", replicas: 8 },
  },
  {
    id: "gateway",
    label: "Commerce gateway",
    labels: ["Gateway"],
    properties: { protocol: "HTTPS", tier: "edge" },
  },
  {
    id: "checkout",
    label: "Checkout API",
    labels: ["Service"],
    description: "Coordinates carts, inventory, payment, and order creation.",
    properties: { runtime: "Node.js 24", owner: "Commerce Platform", critical: true },
  },
  {
    id: "catalog",
    label: "Catalog service",
    labels: ["Service"],
    properties: { runtime: "Go", version: "4.8.1" },
  },
  {
    id: "payments",
    label: "Payments worker",
    labels: ["Worker"],
    properties: { runtime: "Kotlin", queue: "payments.commands", replicas: 12 },
  },
  {
    id: "fraud",
    label: "Fraud scoring",
    labels: ["Service"],
    properties: { model: "risk-v7", latencyTargetMs: 180 },
  },
  {
    id: "orders-db",
    label: "Orders database",
    labels: ["Database"],
    properties: { engine: "PostgreSQL", version: 17, encrypted: true },
  },
  {
    id: "ledger-db",
    label: "Ledger database",
    labels: ["Database"],
    properties: { engine: "PostgreSQL", retention: "7 years" },
  },
  {
    id: "event-bus",
    label: "Commerce events",
    labels: ["Queue"],
    properties: { platform: "Kafka", partitions: 36 },
  },
  {
    id: "notifications",
    label: "Notification worker",
    labels: ["Worker"],
    properties: { channels: ["email", "push", "sms"], replicas: 6 },
  },
  {
    id: "warehouse",
    label: "Analytics warehouse",
    labels: ["Database"],
    properties: { engine: "ClickHouse", freshness: "5 minutes" },
  },
  {
    id: "commerce-team",
    label: "Commerce Platform",
    labels: ["Team"],
    properties: { channel: "#commerce-platform", onCall: true },
  },
  {
    id: "payments-team",
    label: "Payments Engineering",
    labels: ["Team"],
    properties: { channel: "#payments", onCall: true },
  },
  {
    id: "data-team",
    label: "Data Platform",
    labels: ["Team"],
    properties: { channel: "#data-platform", onCall: false },
  },
];

const serviceGraphRelationships: readonly GraphRelationship[] = [
  { id: "r1", source: "storefront", target: "gateway", type: "CALLS", properties: { protocol: "HTTPS" } },
  { id: "r2", source: "gateway", target: "checkout", type: "ROUTES_TO", properties: { path: "/checkout/*" } },
  { id: "r3", source: "checkout", target: "catalog", type: "CALLS", properties: { timeoutMs: 800 } },
  { id: "r4", source: "checkout", target: "fraud", type: "CALLS", properties: { mode: "synchronous" } },
  { id: "r5", source: "checkout", target: "orders-db", type: "WRITES_TO", properties: { role: "primary" } },
  { id: "r6", source: "checkout", target: "event-bus", type: "PUBLISHES_TO", properties: { topic: "orders.created" } },
  { id: "r7", source: "event-bus", target: "payments", type: "DELIVERS_TO", properties: { consumerGroup: "payment-processing" } },
  { id: "r8", source: "payments", target: "ledger-db", type: "WRITES_TO", properties: { consistency: "serializable" } },
  { id: "r9", source: "payments", target: "event-bus", type: "PUBLISHES_TO", properties: { topic: "payments.completed" } },
  { id: "r10", source: "event-bus", target: "notifications", type: "DELIVERS_TO", properties: { consumerGroup: "notifications" } },
  { id: "r11", source: "event-bus", target: "warehouse", type: "STREAMS_TO", properties: { cadence: "continuous" } },
  { id: "r12", source: "commerce-team", target: "storefront", type: "OWNS" },
  { id: "r13", source: "commerce-team", target: "checkout", type: "OWNS" },
  { id: "r14", source: "commerce-team", target: "catalog", type: "OWNS" },
  { id: "r15", source: "payments-team", target: "payments", type: "OWNS" },
  { id: "r16", source: "payments-team", target: "ledger-db", type: "OWNS" },
  { id: "r17", source: "data-team", target: "warehouse", type: "OWNS" },
  { id: "r18", source: "data-team", target: "event-bus", type: "OPERATES" },
];

type GraphDatasetSize = "sample" | "250" | "1000" | "5000";

const denseGraphLabels = ["Service", "Worker", "Database", "Queue", "Gateway", "Team"] as const;
const denseGraphRelationships = ["CALLS", "WRITES_TO", "PUBLISHES_TO", "OWNS", "ROUTES_TO"] as const;

function createDenseServiceGraph(size: number): {
  nodes: readonly GraphNode[];
  relationships: readonly GraphRelationship[];
} {
  const nodes = Array.from({ length: size }, (_, index): GraphNode => {
    const label = denseGraphLabels[index % denseGraphLabels.length] ?? "Service";
    return {
      id: `dense-node-${index}`,
      label: `${label} ${String(index + 1).padStart(4, "0")}`,
      labels: [label],
      description: `Generated ${label.toLocaleLowerCase()} in topology segment ${index % 24}.`,
      properties: {
        owner: `Platform team ${(index % 18) + 1}`,
        region: ["eu-west-1", "us-east-1", "ap-southeast-2"][index % 3] ?? "eu-west-1",
        healthy: index % 17 !== 0,
      },
    };
  });
  const relationships = Array.from({ length: size * 2 }, (_, index): GraphRelationship => {
    const sourceIndex = index % size;
    const targetIndex = (sourceIndex + 1 + ((index * 17) % Math.max(2, size - 1))) % size;
    return {
      id: `dense-relationship-${index}`,
      source: `dense-node-${sourceIndex}`,
      target: `dense-node-${targetIndex}`,
      type: denseGraphRelationships[index % denseGraphRelationships.length] ?? "CALLS",
      properties: { requestsPerMinute: 120 + (index % 4_000) },
    };
  });
  return { nodes, relationships };
}

function RelationshipGraphDemo() {
  const [filterState, setFilterState] = React.useState<GraphFilterState>({
    query: "",
    nodeLabels: [],
    relationshipTypes: [],
  });
  const [selection, setSelection] = React.useState<GraphSelection>(null);
  const [physicsEnabled, setPhysicsEnabled] = React.useState(true);
  const [showData, setShowData] = React.useState(true);
  const [datasetSize, setDatasetSize] = React.useState<GraphDatasetSize>("sample");
  const [positionOverrides, setPositionOverrides] = React.useState<ReadonlyMap<string, { x: number; y: number }>>(
    () => new Map(),
  );
  const graph = React.useMemo(
    () => datasetSize === "sample"
      ? { nodes: serviceGraphNodes, relationships: serviceGraphRelationships }
      : createDenseServiceGraph(Number(datasetSize)),
    [datasetSize],
  );
  const nodes = React.useMemo(
    () => positionOverrides.size === 0
      ? graph.nodes
      : graph.nodes.map((node) => ({
          ...node,
          position: positionOverrides.get(node.id) ?? node.position,
        })),
    [graph.nodes, positionOverrides],
  );
  const datasetLabel = datasetSize === "sample"
    ? "Commerce platform dependency graph"
    : `${Number(datasetSize).toLocaleString()} entity generated service graph`;

  return (
    <div className="graph-story">
      <div className="graph-story__intro">
        <div>
          <p className="eyebrow">Live topology</p>
          <strong>Commerce platform dependencies</strong>
          <p>Search facets, inspect relationships, center a selection, manage the viewport, and expand the workbench without resetting the graph.</p>
          <p className="graph-story__meta">
            {graph.nodes.length.toLocaleString()} entities · {graph.relationships.length.toLocaleString()} relationships · ForceAtlas2 physics {physicsEnabled ? "on" : "paused"} · semantic zoom · keyboard navigation
          </p>
        </div>
        <div className="graph-story__controls">
          <label className="graph-story__dataset">
            <span>Dataset</span>
            <Select
              aria-label="Graph dataset density"
              value={datasetSize}
              onChange={(event) => {
                setDatasetSize(event.currentTarget.value as GraphDatasetSize);
                setPositionOverrides(new Map());
                setFilterState({ query: "", nodeLabels: [], relationshipTypes: [] });
                setSelection(null);
                setPhysicsEnabled(true);
                setShowData(true);
              }}
            >
              <option value="sample">14 entity example</option>
              <option value="250">250 entities</option>
              <option value="1000">1,000 entities</option>
              <option value="5000">5,000 entities</option>
            </Select>
          </label>
          <Button
            size="small"
            variant="secondary"
            onClick={() => {
              setShowData((current) => !current);
              setSelection(null);
            }}
          >
            {showData ? "Show empty state" : "Restore example data"}
          </Button>
        </div>
      </div>
      <GraphExplorer
        data-demo="graph-explorer"
        data-source-node-count={graph.nodes.length}
        ariaLabel={datasetLabel}
        nodes={showData ? nodes : []}
        relationships={showData ? graph.relationships : []}
        filterState={filterState}
        selection={selection}
        physicsEnabled={physicsEnabled}
        onFilterStateChange={setFilterState}
        onSelectionChange={setSelection}
        onPhysicsEnabledChange={setPhysicsEnabled}
        onNodePositionChange={(id, position) =>
          setPositionOverrides((current) => {
            const next = new Map(current);
            next.set(id, position);
            return next;
          })
        }
      />
    </div>
  );
}

function VisualizationStories() {
  return (
    <Story
      title="Relationship graph explorer"
      description="A controlled enterprise graph workbench with compact facets, retained topology, practical viewport tools, adaptive inspection, and semantic zoom."
      wide
      flush
    >
      <RelationshipGraphDemo />
    </Story>
  );
}

function HeaderDrawerNavigation() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="global-header-mobile-trigger" size="icon" variant="ghost" aria-label="Open primary navigation">
          <Icon source={MenuIcon} />
        </Button>
      </DrawerTrigger>
      <DrawerContent side="left" className="w-[min(20rem,calc(100vw-2rem))]">
        <div className="flex items-center justify-between gap-3 border-b border-lumen-border pb-4">
          <DrawerTitle className="font-semibold">Primary navigation</DrawerTitle>
          <DrawerClose asChild>
            <Button size="icon" variant="ghost" aria-label="Close primary navigation"><Icon source={CloseIcon} /></Button>
          </DrawerClose>
        </div>
        <DrawerDescription className="text-sm text-lumen-muted-foreground">
          Move between the main areas of Lumen Operations.
        </DrawerDescription>
        <SideNav aria-label="Primary navigation">
          <SideNavList>
            <SideNavItem><DrawerClose asChild><SideNavLink href="#reports" current>Reports</SideNavLink></DrawerClose></SideNavItem>
            <SideNavItem><DrawerClose asChild><SideNavLink href="#activity">Activity</SideNavLink></DrawerClose></SideNavItem>
            <SideNavItem><DrawerClose asChild><SideNavLink href="#settings">Settings</SideNavLink></DrawerClose></SideNavItem>
          </SideNavList>
        </SideNav>
      </DrawerContent>
    </Drawer>
  );
}

interface WorkspaceNavLinkProps extends React.ComponentProps<typeof SideNavLink> {
  closeOnNavigate?: boolean;
}

function WorkspaceNavLink({ closeOnNavigate = false, ...props }: WorkspaceNavLinkProps) {
  const link = <SideNavLink {...props} />;
  return closeOnNavigate ? <DrawerClose asChild>{link}</DrawerClose> : link;
}

function WorkspaceSwitcher() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Switch workspace"
          data-popover-expression="cyber-grid"
          className="workspace-switcher h-auto w-full justify-start px-2 py-2 text-left"
        >
          <span aria-hidden="true" className="workspace-switcher__mark">L</span>
          <span className="grid min-w-0 flex-1 leading-tight">
            <span className="truncate font-semibold text-lumen-foreground">Lumen Operations</span>
            <span className="truncate text-xs font-normal text-lumen-muted-foreground">Enterprise plan</span>
          </span>
          <Icon source={ChevronDownIcon} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="workspace-cyber-popover w-72 p-0"
        data-lumen-motion="cyber-popover"
        data-popover-expression="cyber-grid"
      >
        <div className="workspace-cyber-popover__header">
          <span>Workspaces</span>
          <span>2 available</span>
        </div>
        <button type="button" className="workspace-popover-row" aria-current="true">
          <span><strong>Lumen Operations</strong><small>Current workspace · 28 members</small></span>
          <Icon source={CheckIcon} />
        </button>
        <button type="button" className="workspace-popover-row">
          <span><strong>Sandbox</strong><small>Development workspace</small></span>
        </button>
        <button type="button" className="workspace-cyber-action">
          <Icon source={SettingsIcon} />
          <span>Manage workspaces</span>
        </button>
      </PopoverContent>
    </Popover>
  );
}

function WorkspaceNavActionRow({
  children,
  closeOnNavigate,
  href,
  label,
}: {
  children: React.ReactNode;
  closeOnNavigate: boolean;
  href: string;
  label: string;
}) {
  return (
    <div className="workspace-nav-action-row">
      <WorkspaceNavLink
        href={href}
        current
        depth={1}
        closeOnNavigate={closeOnNavigate}
        className="workspace-nav-action-row__link"
      >
        {children}
      </WorkspaceNavLink>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="workspace-nav-row-menu"
            aria-label={`Actions for ${label}`}
            data-popover-expression="cyber-grid"
          >
            <Icon source={MoreHorizontalIcon} />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="right"
          className="workspace-cyber-popover w-60 p-0"
          data-lumen-motion="cyber-popover"
        data-popover-expression="cyber-grid"
      >
        <div className="workspace-cyber-popover__header">
            <span>Report actions</span>
            <span>{label}</span>
          </div>
          <button type="button" className="workspace-cyber-action"><Icon source={FavoriteIcon} /><span>Pin report</span></button>
          <button type="button" className="workspace-cyber-action"><Icon source={CopyIcon} /><span>Copy link</span></button>
          <button type="button" className="workspace-cyber-action"><Icon source={LaunchIcon} /><span>Open in new tab</span></button>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function WorkspaceSideNavigation({ closeOnNavigate = false }: { closeOnNavigate?: boolean }) {
  return (
    <SideNav aria-label="Workspace" expression="compact" className="workspace-side-nav">
      <SideNavList>
        <SideNavGroup>
          <SideNavGroupLabel>Core</SideNavGroupLabel>
          <SideNavList>
            <SideNavItem><WorkspaceNavLink href="#overview" closeOnNavigate={closeOnNavigate}><Icon source={HomeIcon} /><span className="truncate">Overview</span></WorkspaceNavLink></SideNavItem>
            <SideNavItem><WorkspaceNavLink href="#members" closeOnNavigate={closeOnNavigate}><Icon source={UserIcon} /><span className="truncate">Members</span></WorkspaceNavLink></SideNavItem>
            <SideNavItem>
              <WorkspaceNavLink href="#notifications" closeOnNavigate={closeOnNavigate}>
                <Icon source={NotificationIcon} /><span className="truncate">Notifications</span><Badge className="ml-auto">3</Badge>
              </WorkspaceNavLink>
            </SideNavItem>
          </SideNavList>
        </SideNavGroup>
        <SideNavGroup>
          <SideNavGroupLabel>Analytics</SideNavGroupLabel>
          <SideNavList>
            <SideNavItem>
              <WorkspaceNavLink href="#reports" closeOnNavigate={closeOnNavigate}><Icon source={ViewIcon} /><span className="truncate">Reports</span><Badge className="ml-auto">12</Badge></WorkspaceNavLink>
              <SideNavNestedList>
                <SideNavItem>
                  <WorkspaceNavActionRow href="#daily-operations" label="Daily operations" closeOnNavigate={closeOnNavigate}>
                    <span className="truncate">Daily operations</span>
                  </WorkspaceNavActionRow>
                </SideNavItem>
                <SideNavItem><WorkspaceNavLink href="#revenue" depth={1} closeOnNavigate={closeOnNavigate}><span className="truncate">Revenue performance</span></WorkspaceNavLink></SideNavItem>
                <SideNavItem><WorkspaceNavLink href="#risk" depth={1} closeOnNavigate={closeOnNavigate}><span className="truncate">Risk exceptions</span><Badge className="ml-auto">4</Badge></WorkspaceNavLink></SideNavItem>
              </SideNavNestedList>
            </SideNavItem>
            <SideNavItem><WorkspaceNavLink href="#search" closeOnNavigate={closeOnNavigate}><Icon source={SearchIcon} /><span className="truncate">Explore</span></WorkspaceNavLink></SideNavItem>
            <SideNavItem><WorkspaceNavLink href="#exports" closeOnNavigate={closeOnNavigate}><Icon source={DownloadIcon} /><span className="truncate">Exports</span></WorkspaceNavLink></SideNavItem>
            <SideNavItem><WorkspaceNavLink href="#settings" closeOnNavigate={closeOnNavigate}><Icon source={SettingsIcon} /><span className="truncate">Workspace settings and governance</span></WorkspaceNavLink></SideNavItem>
          </SideNavList>
        </SideNavGroup>
      </SideNavList>
    </SideNav>
  );
}

function WorkspaceIdentity() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="workspace-identity"
          aria-label="Open account menu"
          data-popover-expression="cyber-grid"
        >
          <Avatar alt="" fallback="CN" className="size-8" />
          <span className="grid min-w-0 flex-1 text-left leading-tight">
            <span className="truncate font-semibold text-lumen-foreground">Christian Nonis</span>
            <span className="truncate text-xs text-lumen-muted-foreground">Workspace admin</span>
          </span>
          <Icon source={ChevronUpIcon} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        className="workspace-cyber-popover w-64 p-0"
        data-lumen-motion="cyber-popover"
        data-popover-expression="cyber-grid"
      >
        <div className="workspace-cyber-popover__header">
          <span>Account</span>
          <span>Workspace admin</span>
        </div>
        <div className="workspace-cyber-popover__subject">
          <strong>Christian Nonis</strong>
          <small>christian@lumen.example · Workspace admin</small>
        </div>
        <button type="button" className="workspace-cyber-action"><Icon source={UserIcon} /><span>Profile and preferences</span></button>
        <button type="button" className="workspace-cyber-action"><Icon source={HelpIcon} /><span>Support center</span></button>
      </PopoverContent>
    </Popover>
  );
}

function WorkspaceContext() {
  return (
    <Stack>
      <div className="grid gap-2">
        <strong>Setup progress</strong>
        <p className="muted-copy">4 of 5 workspace checks complete.</p>
        <Progress value={80} aria-label="Workspace setup" />
      </div>
      <div className="grid gap-2">
        <strong>Recent activity</strong>
        <TaskList>
          <TaskListItem href="#q3" title="Q3 report published" status="Ready" statusTone="success" />
          <TaskListItem href="#sync" title="Salesforce sync running" status="Syncing" statusTone="primary" />
        </TaskList>
      </div>
    </Stack>
  );
}

function NavigationStories() {
  return (
    <>
      <Story title="Breadcrumbs and pagination" description="Landmarks and current location are announced correctly.">
        <Stack>
          <Breadcrumbs><BreadcrumbItem href="#">Home</BreadcrumbItem><BreadcrumbItem href="#">Reports</BreadcrumbItem><BreadcrumbItem current>Q3 review</BreadcrumbItem></Breadcrumbs>
          <Pagination><PaginationItem href="#">1</PaginationItem><PaginationItem href="#" current>2</PaginationItem><PaginationItem href="#">3</PaginationItem></Pagination>
        </Stack>
      </Story>
      <Story title="Process steps" description="Status is explicit and responsive across widths.">
        <Steps><Step status="complete">Details</Step><Step status="current">Review</Step><Step>Publish</Step><Step status="error">Approval</Step></Steps>
      </Story>
      <Story title="Tabs" description="Arrow-key navigation and selection follow the expected tab pattern." wide>
        <Tabs defaultValue="overview">
          <TabsList aria-label="Report sections"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger><TabsTrigger value="settings">Settings</TabsTrigger></TabsList>
          <TabsContent value="overview"><p>Key report metrics and current operational status.</p></TabsContent>
          <TabsContent value="activity"><p>Recent edits, syncs, and publishing events.</p></TabsContent>
          <TabsContent value="settings"><p>Access, schedule, and notification settings.</p></TabsContent>
        </Tabs>
        <SkipLink href="#main-content">Skip to component catalog</SkipLink>
      </Story>
      <Story title="Links and local navigation" description="Navigation stays link-shaped, scannable, and explicit.">
        <Stack>
          <nav className="local-navigation-actions" aria-label="Page utilities">
            <BackLink href="#reports">Back to reports</BackLink>
            <Link href="#documentation" variant="standalone">Documentation</Link>
            <BackToTop href="#top" />
          </nav>
          <JumpLinks title="On this page">
            <JumpLink href="#foundations" current>Foundations</JumpLink>
            <JumpLink href="#forms">Forms</JumpLink>
            <JumpLink href="#overlays">Overlays</JumpLink>
          </JumpLinks>
        </Stack>
      </Story>
      <Story title="Global header" description="Product identity, primary routes, and global actions remain separate from page identity." wide>
        <GlobalHeader className="overflow-hidden border border-lumen-border shadow-lumen-card">
          <GlobalHeaderInner className="max-w-none flex-nowrap">
            <HeaderDrawerNavigation />
            <GlobalHeaderBrand href="#top">
              <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lumen-control bg-lumen-primary text-sm font-bold text-lumen-on-primary shadow-lumen-button">L</span>
              <span className="global-header-brand-copy grid leading-tight">
                <span className="font-semibold">Lumen Operations</span>
                <span className="global-header-brand-subtitle text-xs font-normal text-lumen-muted-foreground">Analytics workspace</span>
              </span>
            </GlobalHeaderBrand>
            <GlobalHeaderNav className="global-header-desktop-nav">
              <GlobalHeaderNavList>
                <GlobalHeaderNavItem><GlobalHeaderNavLink href="#reports" current>Reports</GlobalHeaderNavLink></GlobalHeaderNavItem>
                <GlobalHeaderNavItem><GlobalHeaderNavLink href="#activity">Activity</GlobalHeaderNavLink></GlobalHeaderNavItem>
                <GlobalHeaderNavItem><GlobalHeaderNavLink href="#settings">Settings</GlobalHeaderNavLink></GlobalHeaderNavItem>
              </GlobalHeaderNavList>
            </GlobalHeaderNav>
            <GlobalHeaderActions className="flex-nowrap">
              <SearchInput aria-label="Search workspace" placeholder="Search reports…" className="global-header-search h-9 w-48" />
              <Button className="global-header-help" size="icon" variant="ghost" aria-label="Help"><Icon source={HelpIcon} /></Button>
              <Button className="global-header-notifications" size="icon" variant="ghost" aria-label="Notifications">
                <Icon source={NotificationIcon} />
                <span aria-hidden="true" className="absolute right-2 top-2 size-2 rounded-full bg-lumen-danger ring-2 ring-lumen-surface" />
              </Button>
              <Avatar alt="Christian Nonis" fallback="CN" className="size-9" />
            </GlobalHeaderActions>
          </GlobalHeaderInner>
        </GlobalHeader>
      </Story>
      <Story title="Page header" description="Page identity and actions adapt without competing for hierarchy.">
        <PageHeader>
          <PageHeaderContent>
            <PageHeaderTitle as="h4">Workspace settings</PageHeaderTitle>
            <PageHeaderDescription>Manage members, access, and data retention.</PageHeaderDescription>
          </PageHeaderContent>
          <PageHeaderActions><Button size="small">Invite member</Button><Button size="small" variant="secondary">Export</Button></PageHeaderActions>
        </PageHeader>
      </Story>
      <Story title="Application shell, sidebar, and rail" description="Named shell regions support deep navigation, primary content, and complementary context." wide>
        <AppShell
          data-demo="app-shell"
          data-shell-expression="compact"
          layout="sidebar-rail"
          className="workspace-cyber-shell overflow-hidden border border-lumen-border"
        >
          <div className="app-shell-mobile-bar">
            <Drawer>
              <DrawerTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="Open workspace navigation"><Icon source={MenuIcon} /></Button>
              </DrawerTrigger>
              <DrawerContent side="left" className="workspace-cyber-drawer w-[min(20rem,calc(100vw-2rem))] gap-0 p-0">
                <AppShellSidebarHeader className="workspace-cyber-drawer__header flex items-center justify-between gap-3 p-3">
                  <DrawerTitle className="font-semibold">Workspace navigation</DrawerTitle>
                  <DrawerClose asChild>
                    <Button size="icon" variant="ghost" aria-label="Close workspace navigation"><Icon source={CloseIcon} /></Button>
                  </DrawerClose>
                </AppShellSidebarHeader>
                <DrawerDescription className="sr-only">
                  Navigate Lumen Operations and workspace data.
                </DrawerDescription>
                <div className="workspace-cyber-drawer__switcher"><WorkspaceSwitcher /></div>
                <AppShellSidebarContent className="p-0"><WorkspaceSideNavigation closeOnNavigate /></AppShellSidebarContent>
                <AppShellSidebarFooter className="mt-auto flex items-center gap-0 p-2"><WorkspaceIdentity /></AppShellSidebarFooter>
              </DrawerContent>
            </Drawer>
            <div className="min-w-0">
              <strong className="block truncate">Lumen Operations</strong>
              <span className="block truncate text-xs text-lumen-muted-foreground">Daily operations</span>
            </div>
          </div>
          <AppShellSidebar className="app-shell-desktop-sidebar">
            <AppShellSidebarHeader className="font-normal"><WorkspaceSwitcher /></AppShellSidebarHeader>
            <AppShellSidebarContent><WorkspaceSideNavigation /></AppShellSidebarContent>
            <AppShellSidebarFooter className="flex items-center gap-2.5"><WorkspaceIdentity /></AppShellSidebarFooter>
          </AppShellSidebar>
          <AppShellMain as="div">
            <PageContent size="full">
              <PageHeader>
                <PageHeaderContent>
                  <PageHeaderTitle as="h4">Daily operations</PageHeaderTitle>
                  <PageHeaderDescription>Live reporting health, workspace activity, and operational exceptions.</PageHeaderDescription>
                </PageHeaderContent>
                <PageHeaderActions><Button size="small" variant="secondary"><Icon source={DownloadIcon} />Export</Button><Button size="small"><Icon source={AddIcon} />New report</Button></PageHeaderActions>
              </PageHeader>
              <div className="grid grid-cols-2 border border-lumen-border divide-x divide-lumen-border">
                <div className="grid gap-1 p-4">
                  <span className="text-xs font-medium text-lumen-muted-foreground">Published reports</span>
                  <span className="text-2xl font-semibold text-lumen-foreground">142</span>
                  <StatusIndicator status="success">Up 8% this month</StatusIndicator>
                </div>
                <div className="grid gap-1 p-4">
                  <span className="text-xs font-medium text-lumen-muted-foreground">Active members</span>
                  <span className="text-2xl font-semibold text-lumen-foreground">28</span>
                  <StatusIndicator status="neutral">3 pending invites</StatusIndicator>
                </div>
              </div>
              <Disclosure className="app-shell-mobile-context">
                <DisclosureTrigger>Workspace context</DisclosureTrigger>
                <DisclosureContent><WorkspaceContext /></DisclosureContent>
              </Disclosure>
            </PageContent>
          </AppShellMain>
          <AppShellRail className="app-shell-desktop-rail" aria-label="Workspace context"><WorkspaceContext /></AppShellRail>
        </AppShell>
      </Story>
    </>
  );
}

function OverlayStories() {
  return (
    <>
      <Story title="Dialog and drawer" description="Modal surfaces trap focus, close on Escape, and restore focus.">
        <Inline>
          <Dialog>
            <DialogTrigger asChild><Button>Open dialog</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Publish report?</DialogTitle><DialogDescription>This makes the latest version visible to everyone in the workspace.</DialogDescription></DialogHeader>
              <DialogFooter><DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose><DialogClose asChild><Button>Publish</Button></DialogClose></DialogFooter>
            </DialogContent>
          </Dialog>
          <Drawer>
            <DrawerTrigger asChild><Button variant="secondary">Open drawer</Button></DrawerTrigger>
            <DrawerContent>
              <DrawerTitle className="text-lg font-semibold">Filters</DrawerTitle>
              <DrawerDescription className="text-sm text-lumen-muted-foreground">Narrow the activity shown in this report.</DrawerDescription>
              <TextField id="drawer-owner" label="Owner" placeholder="Search people" />
              <DrawerClose asChild><Button>Apply filters</Button></DrawerClose>
            </DrawerContent>
          </Drawer>
        </Inline>
      </Story>
      <Story title="Menu, popover, and tooltip" description="Anchored interactions preserve focus and keyboard access.">
        <TooltipProvider>
          <Inline>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="secondary">Actions</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="start"><DropdownMenuLabel>Report</DropdownMenuLabel><DropdownMenuItem>Duplicate</DropdownMenuItem><DropdownMenuItem>Export CSV</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem>Archive</DropdownMenuItem></DropdownMenuContent>
            </DropdownMenu>
            <Popover>
              <PopoverTrigger asChild><Button variant="secondary">Details</Button></PopoverTrigger>
              <PopoverContent><strong>Last sync</strong><p className="muted-copy">Today at 14:42 · 1,284 records</p></PopoverContent>
            </Popover>
            <Tooltip>
              <TooltipTrigger asChild><Button size="icon" variant="ghost" aria-label="View keyboard shortcuts"><Icon source={HelpIcon} /></Button></TooltipTrigger>
              <TooltipContent>Keyboard shortcuts</TooltipContent>
            </Tooltip>
          </Inline>
        </TooltipProvider>
      </Story>
    </>
  );
}

function DisclosureStories() {
  return (
    <>
      <Story title="Disclosure" description="Native details semantics provide a resilient baseline.">
        <Disclosure open><DisclosureTrigger>What is a workspace?</DisclosureTrigger><DisclosureContent>A workspace keeps a team’s reports, members, and data sources together.</DisclosureContent></Disclosure>
      </Story>
      <Story title="Accordion alias" description="Use repeated disclosures for short, independent answers.">
        <Stack>
          <Accordion><AccordionTrigger>Can I invite guests?</AccordionTrigger><AccordionContent>Yes, guests can receive limited access to selected reports.</AccordionContent></Accordion>
          <Accordion><AccordionTrigger>How are exports secured?</AccordionTrigger><AccordionContent>Exports inherit workspace permissions and expire automatically.</AccordionContent></Accordion>
        </Stack>
      </Story>
    </>
  );
}

function LayoutStories() {
  return (
    <>
      <Story title="Stack, inline, and grid" description="Small layout primitives create predictable rhythm." wide>
        <Container className="layout-demo-container">
          <Stack>
            <div className="layout-demo-block">Stack item</div>
            <Inline><div className="layout-demo-chip">Inline</div><div className="layout-demo-chip">wraps</div><div className="layout-demo-chip">naturally</div></Inline>
            <Grid gap="none" className="layout-demo-grid"><div className="layout-demo-block">Connected grid</div><div className="layout-demo-block">Shared edge</div><div className="layout-demo-block">No outer gap</div></Grid>
          </Stack>
        </Container>
      </Story>
      <Story title="Visually hidden" description="Accessible names can remain available without visual noise.">
        <p>This sentence includes <VisuallyHidden>important screen reader context</VisuallyHidden>a visually hidden phrase.</p>
      </Story>
      <Story title="Page content and sections" description="Readable content widths and semantic sections preserve hierarchy without ad-hoc wrappers." wide>
        <PageContent size="readable" className="border border-lumen-border bg-lumen-surface p-4 sm:p-6">
          <PageSection>
            <PageSectionHeader>
              <div>
                <PageSectionTitle as="h4">Delivery schedule</PageSectionTitle>
                <PageSectionDescription>Choose when subscribers receive the operations report.</PageSectionDescription>
              </div>
              <PageSectionActions><Button size="small" variant="secondary">Edit schedule</Button></PageSectionActions>
            </PageSectionHeader>
            <PageSectionContent><p>Every Monday at 09:00 · 14 subscribers</p></PageSectionContent>
          </PageSection>
        </PageContent>
      </Story>
      <Story title="Contiguous section bands" description="Shared seams create a continuous product narrative; opt-in motion communicates live activity and respects reduced motion." wide>
        <SectionStack className="section-band-demo">
          <SectionBand motion="enter">
            <SectionBandHeader>
              <SectionBandEyebrow>01 / 03 · Operations</SectionBandEyebrow>
              <SectionBandTitle as="h4">One surface from signal to decision</SectionBandTitle>
              <SectionBandDescription>Connected bands remove decorative gaps while responsive insets keep each idea readable.</SectionBandDescription>
              <div className="section-band-demo__actions">
                <Button size="small">Open workspace</Button>
                <Button size="small" variant="secondary">View activity</Button>
              </div>
            </SectionBandHeader>
            <SectionBandContent>
              <div className="section-band-demo__panel">
                <div className="section-band-demo__panel-header">
                  <span>Ingestion pipeline</span>
                  <StatusIndicator status="success">Live</StatusIndicator>
                </div>
                <div className="section-band-demo__flow" aria-hidden="true">
                  <span>Sources</span><i /><span>Normalize</span><i /><span>Warehouse</span>
                  <b data-lumen-motion />
                </div>
                <p>24 sources synchronized · Last event 8 seconds ago</p>
              </div>
            </SectionBandContent>
          </SectionBand>

          <SectionBand tone="muted" motion="enter">
            <SectionBandHeader>
              <SectionBandEyebrow>02 / 03 · Performance</SectionBandEyebrow>
              <SectionBandTitle as="h4">The important numbers stay in rhythm</SectionBandTitle>
              <SectionBandDescription>Grid lines align related measures without turning every metric into a floating card.</SectionBandDescription>
            </SectionBandHeader>
            <SectionBandContent>
              <dl className="section-band-demo__metrics">
                <div><dt>Availability</dt><dd>99.99%</dd><small>30-day window</small></div>
                <div><dt>Median latency</dt><dd>142 ms</dd><small>−18 ms this week</small></div>
                <div><dt>Events today</dt><dd>1.8M</dd><small>Across 24 sources</small></div>
              </dl>
            </SectionBandContent>
          </SectionBand>

          <SectionBand tone="accent" motion="enter">
            <SectionBandHeader>
              <SectionBandEyebrow>03 / 03 · Automation</SectionBandEyebrow>
              <SectionBandTitle as="h4">Motion confirms progress, never meaning</SectionBandTitle>
              <SectionBandDescription>Status text remains complete when animation is paused or reduced.</SectionBandDescription>
            </SectionBandHeader>
            <SectionBandContent>
              <ol className="section-band-demo__steps">
                <li>
                  <span className="section-band-demo__step-index">1</span>
                  <div><strong>Validate</strong><small>Schema and permissions passed</small></div>
                  <StatusIndicator className="section-band-demo__step-status" status="success">Done</StatusIndicator>
                </li>
                <li>
                  <span className="section-band-demo__step-index">2</span>
                  <div><strong>Transform</strong><small>Preparing 18,420 records</small></div>
                  <StatusIndicator className="section-band-demo__step-status" status="warning">Running</StatusIndicator>
                </li>
                <li>
                  <span className="section-band-demo__step-index">3</span>
                  <div><strong>Publish</strong><small>Starts after transformation</small></div>
                  <StatusIndicator className="section-band-demo__step-status">Queued</StatusIndicator>
                </li>
              </ol>
            </SectionBandContent>
          </SectionBand>
        </SectionStack>
      </Story>
    </>
  );
}

const sectionStories: Record<string, React.ReactNode> = {
  foundations: <FoundationsStories />,
  icons: <IconStories />,
  actions: <ActionStories />,
  assistant: <AssistantStories />,
  forms: <FormStories />,
  feedback: <FeedbackStories />,
  "data-display": <DataStories />,
  visualization: <VisualizationStories />,
  navigation: <NavigationStories />,
  overlays: <OverlayStories />,
  disclosure: <DisclosureStories />,
  layout: <LayoutStories />,
};

export function Workbench() {
  const [palette, setPalette] = React.useState<Palette>("lumen");
  const [query, setQuery] = React.useState("");
  const [theme, setTheme] = React.useState<Theme>("light");
  const [viewport, setViewport] = React.useState<Viewport>("desktop");
  const filteredSections = showcaseSections.filter((section) =>
    matchesSection(section, query),
  );
  const filteredGuides = guideDocuments.filter((guide) =>
    matchesGuide(guide, query),
  );

  React.useEffect(() => {
    document.documentElement.dataset.lumenTheme = theme;
    document.documentElement.dataset.lumenPalette = palette;
  }, [palette, theme]);

  const themeControlLabel = palette === "brainapi"
    ? "Brainapi palette uses a fixed dark appearance"
    : theme === "light"
      ? "Use dark theme"
      : "Use light theme";

  return (
    <div
      className="workbench"
      data-lumen-palette={palette}
      data-lumen-theme={theme}
    >
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Lumen UI Kit workbench home">
          <span className="brand__mark" aria-hidden="true">L</span>
          <span><strong>Lumen UI Kit</strong><small>Component workbench</small></span>
        </a>
        <div className="topbar__controls">
          <div data-slot="preview-toolbar" className="preview-toolbar" role="group" aria-label="Workbench preview controls">
            <span className="preview-toolbar__label" aria-hidden="true">Preview</span>
            <div className="viewport-control" role="group" aria-label="Preview width">
              {viewportOptions.map(({ icon, label, value }) => (
                <button
                  key={value}
                  type="button"
                  aria-label={`Preview at ${value} width`}
                  aria-pressed={viewport === value}
                  onClick={() => setViewport(value)}
                >
                  <Icon source={icon} size={16} />
                  <span className="viewport-control__text">{label}</span>
                </button>
              ))}
            </div>
            <span className="preview-toolbar__separator" aria-hidden="true" />
            <label className="palette-control">
              <span className="palette-control__label">Palette</span>
              <Select
                aria-label="Preview palette"
                className="palette-control__select"
                value={palette}
                variant="ghost"
                onChange={(event) => setPalette(event.target.value as Palette)}
              >
                {paletteOptions.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </label>
            <span className="preview-toolbar__separator" aria-hidden="true" />
            <button
              type="button"
              className="theme-control"
              aria-label={themeControlLabel}
              aria-pressed={theme === "dark"}
              disabled={palette === "brainapi"}
              title={themeControlLabel}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Icon source={theme === "light" ? Moon : Sun} size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="workbench__body" id="top">
        <aside className="sidebar" aria-label="Lumen catalog">
          <div className="sidebar__intro">
            <Badge variant="primary">{showcasedComponentCount} components</Badge>
            <p>Live React components rendered from the package source.</p>
          </div>
          <label className="catalog-search">
            <span>Find a component or guide</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Try “dialog” or “WCAG”" />
          </label>
          <nav aria-label="Component families">
            <ul>
              {filteredSections.map((section) => (
                <li key={section.id}><a href={`#${section.id}`}><span>{section.label}</span><span>{section.components.length}</span></a></li>
              ))}
            </ul>
          </nav>
          {filteredGuides.length ? (
            <nav aria-label="Guidelines">
              <ul>
                <li><a href="#guidelines"><span>Guidelines</span><span>{filteredGuides.length}</span></a></li>
              </ul>
            </nav>
          ) : null}
          <p className="sidebar__meta">React · Tailwind CSS 4 · Next.js ready · Agent-readable Markdown</p>
        </aside>

        <main id="main-content" className="catalog-stage" data-viewport={viewport}>
          <div className="catalog-canvas">
            <section className="catalog-hero" aria-labelledby="catalog-title">
              <p className="eyebrow">Lumen design system</p>
              <h1 id="catalog-title">Build product interfaces with calm precision.</h1>
              <p>Explore responsive, accessible primitives and composed patterns. Search the catalog, switch themes, then test the examples with a keyboard.</p>
            </section>

            {filteredSections.length || filteredGuides.length ? (
              <>
                {filteredSections.map((section) => (
                <section className="component-section" id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
                  <div className="component-section__heading">
                    <div><p className="eyebrow">{section.components.length} components</p><h2 id={`${section.id}-title`}>{section.label}</h2><p>{section.description}</p></div>
                    {section.id === "icons" ? (
                      <div className="icon-section-summary" aria-label="Icon library summary">
                        <span>[ 58 / 58 ]</span>
                        <span>Curated exports</span>
                        <span>Carbon React</span>
                      </div>
                    ) : (
                      <div className="component-pills" aria-label={`Components in ${section.label}`}>{section.components.map((component) => <span key={component}>{component}</span>)}</div>
                    )}
                  </div>
                  <div className="story-grid">{sectionStories[section.id]}</div>
                </section>
                ))}
                {filteredGuides.length ? (
                  <section className="component-section" id="guidelines" aria-labelledby="guidelines-title">
                    <div className="component-section__heading">
                      <div>
                        <p className="eyebrow">{filteredGuides.length} guides</p>
                        <h2 id="guidelines-title">Guidelines</h2>
                        <p>Rendered from the copied Lumen skill Markdown so humans and agents share the same implementation rules.</p>
                      </div>
                      <div className="component-pills" aria-label="Available guidelines">
                        {filteredGuides.map((guide) => <span key={guide.id}>{guide.title}</span>)}
                      </div>
                    </div>
                    <React.Suspense fallback={<p className="muted-copy">Loading guidelines…</p>}>
                      <GuidelineViewer guides={filteredGuides} />
                    </React.Suspense>
                  </section>
                ) : null}
              </>
            ) : (
              <EmptyState title="No components or guides found" description={`Nothing matches “${query}”. Try a broader term.`}>
                <Button variant="secondary" onClick={() => setQuery("")}>Clear search</Button>
              </EmptyState>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
