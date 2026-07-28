import * as React from "react";
import type { CarbonIconType } from "@carbon/icons-react";

import { cn } from "../lib/cn";

type IconSize = 16 | 20 | 24 | 32;
type IconTone = "current" | "muted" | "primary" | "success" | "warning" | "danger";

interface IconProps {
  /** A tree-shakeable icon component imported from this entrypoint. */
  source: CarbonIconType;
  /** Adds an accessible image label. Omit when nearby text already names the icon. */
  label?: string;
  /** Carbon icons are optically drawn for these four artboard sizes. */
  size?: IconSize;
  /** Uses Lumen semantic color roles and inherits the current text color by default. */
  tone?: IconTone;
  className?: string;
  id?: string;
}

const iconToneClasses: Record<IconTone, string | undefined> = {
  current: undefined,
  muted: "text-lumen-muted-foreground",
  primary: "text-lumen-primary",
  success: "text-lumen-success",
  warning: "text-lumen-warning",
  danger: "text-lumen-danger",
};

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  (
    {
      className,
      id,
      label,
      size = 16,
      source: Source,
      tone = "current",
    },
    ref,
  ) => {
    const accessibleLabel = label?.trim();
    const isInformative = Boolean(accessibleLabel);

    return (
      <Source
        ref={ref}
        id={id}
        size={size}
        data-slot="icon"
        className={cn(
          "inline-block shrink-0 align-middle",
          iconToneClasses[tone],
          className,
        )}
        aria-hidden={isInformative ? undefined : true}
        aria-label={isInformative ? accessibleLabel : undefined}
        role={isInformative ? "img" : undefined}
        focusable="false"
      />
    );
  },
);

Icon.displayName = "Icon";

export {
  Add as AddIcon,
  TextAlignCenter as AlignCenterIcon,
  TextAlignLeft as AlignLeftIcon,
  TextAlignRight as AlignRightIcon,
  ArrowDown as ArrowDownIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  ArrowUp as ArrowUpIcon,
  TextBold as BoldIcon,
  Calendar as CalendarIcon,
  Checkmark as CheckIcon,
  ChevronDown as ChevronDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ChevronUp as ChevronUpIcon,
  Close as CloseIcon,
  Code as CodeIcon,
  Copy as CopyIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Error as ErrorIcon,
  ErrorFilled as ErrorFilledIcon,
  Favorite as FavoriteIcon,
  Filter as FilterIcon,
  Help as HelpIcon,
  Home as HomeIcon,
  Information as InformationIcon,
  InformationFilled as InformationFilledIcon,
  TextItalic as ItalicIcon,
  Launch as LaunchIcon,
  Link as LinkIcon,
  ListBulleted as ListBulletedIcon,
  ListNumbered as ListNumberedIcon,
  Menu as MenuIcon,
  OverflowMenuHorizontal as MoreHorizontalIcon,
  OverflowMenuVertical as MoreVerticalIcon,
  Notification as NotificationIcon,
  Quotes as QuoteIcon,
  Redo as RedoIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  TextStrikethrough as StrikethroughIcon,
  CheckmarkFilled as SuccessIcon,
  CenterToFit as CenterSelectionIcon,
  FitToScreen as FitIcon,
  Keyboard as KeyboardIcon,
  Map as MapIcon,
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon,
  Movement as PhysicsIcon,
  Restart as RestartIcon,
  TextColor as TextColorIcon,
  TextFont as TextFontIcon,
  TrashCan as TrashIcon,
  TextUnderline as UnderlineIcon,
  Undo as UndoIcon,
  Upload as UploadIcon,
  User as UserIcon,
  View as ViewIcon,
  ViewOff as ViewOffIcon,
  WarningAlt as WarningIcon,
  WarningFilled as WarningFilledIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from "@carbon/icons-react";

export { Icon, type IconProps, type IconSize, type IconTone };
