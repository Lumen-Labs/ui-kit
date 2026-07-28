"use client";

import * as React from "react";

import { Button } from "../components/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/interactive";
import {
  CenterSelectionIcon,
  FitIcon,
  HelpIcon,
  Icon,
  KeyboardIcon,
  ListBulletedIcon,
  MapIcon,
  MaximizeIcon,
  MinimizeIcon,
  MoreVerticalIcon,
  PhysicsIcon,
  RestartIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "../icons";
import { GraphKeyboardHelp } from "./graph-filters";

interface GraphViewportControlsProps {
  canCenter: boolean;
  expanded: boolean;
  layoutPending: boolean;
  legend: React.ReactNode;
  miniMapEnabled: boolean;
  miniMapVisible: boolean;
  physicsEnabled: boolean;
  onCenter: () => void;
  onExpandedChange: (expanded: boolean) => void;
  onFit: () => void;
  onMiniMapVisibleChange: (visible: boolean) => void;
  onPhysicsEnabledChange: (enabled: boolean) => void;
  onReflow: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

function ControlTooltip({ children, label }: { children: React.ReactElement; label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  );
}

function ControlButton({
  icon,
  label,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children" | "size"> & {
  icon: React.ComponentProps<typeof Icon>["source"];
  label: string;
}) {
  return (
    <ControlTooltip label={label}>
      <Button
        {...props}
        size="small"
        variant="secondary"
        className="graph-canvas__control-button"
        aria-label={label}
      >
        <Icon source={icon} />
      </Button>
    </ControlTooltip>
  );
}

export function GraphViewportControls({
  canCenter,
  expanded,
  layoutPending,
  legend,
  miniMapEnabled,
  miniMapVisible,
  physicsEnabled,
  onCenter,
  onExpandedChange,
  onFit,
  onMiniMapVisibleChange,
  onPhysicsEnabledChange,
  onReflow,
  onZoomIn,
  onZoomOut,
}: GraphViewportControlsProps) {
  const [mobilePanel, setMobilePanel] = React.useState<"help" | "legend" | null>(null);

  return (
    <TooltipProvider delayDuration={400}>
      <div className="graph-canvas__rail" role="toolbar" aria-label="Graph viewport controls">
        <div className="graph-canvas__rail-group graph-canvas__rail-group--essential">
          <ControlButton icon={ZoomInIcon} label="Zoom in" onClick={onZoomIn} />
          <ControlButton icon={FitIcon} label="Fit graph" onClick={onFit} />
          <ControlButton icon={ZoomOutIcon} label="Zoom out" onClick={onZoomOut} />
        </div>

        <div className="graph-canvas__rail-group graph-canvas__rail-group--desktop">
          <ControlButton
            icon={PhysicsIcon}
            label={physicsEnabled ? "Pause graph physics" : "Resume graph physics"}
            aria-pressed={physicsEnabled}
            onClick={() => onPhysicsEnabledChange(!physicsEnabled)}
          />
          <ControlButton
            icon={CenterSelectionIcon}
            label="Center selected entity"
            disabled={!canCenter}
            onClick={onCenter}
          />
          <ControlButton
            icon={RestartIcon}
            label="Reflow graph"
            isPending={layoutPending}
            pendingLabel={<span className="sr-only">Laying out graph</span>}
            onClick={onReflow}
          />
        </div>

        <div className="graph-canvas__rail-group graph-canvas__rail-group--desktop">
          {miniMapEnabled ? (
            <ControlButton
              icon={MapIcon}
              label={miniMapVisible ? "Hide minimap" : "Show minimap"}
              aria-pressed={miniMapVisible}
              onClick={() => onMiniMapVisibleChange(!miniMapVisible)}
            />
          ) : null}
          <Popover>
            <ControlTooltip label="Graph legend">
              <PopoverTrigger asChild>
                <Button
                  size="small"
                  variant="secondary"
                  className="graph-canvas__control-button"
                  aria-label="Show graph legend"
                >
                  <Icon source={ListBulletedIcon} />
                </Button>
              </PopoverTrigger>
            </ControlTooltip>
            <PopoverContent side="left" align="start" className="graph-canvas__utility-popover p-0">
              {legend}
            </PopoverContent>
          </Popover>
          <Popover>
            <ControlTooltip label="Keyboard shortcuts">
              <PopoverTrigger asChild>
                <Button
                  size="small"
                  variant="secondary"
                  className="graph-canvas__control-button"
                  aria-label="Show keyboard shortcuts"
                >
                  <Icon source={KeyboardIcon} />
                </Button>
              </PopoverTrigger>
            </ControlTooltip>
            <PopoverContent side="left" align="end" className="graph-canvas__help-popover p-0">
              <GraphKeyboardHelp />
            </PopoverContent>
          </Popover>
          <ControlButton
            data-graph-expand-return="true"
            icon={expanded ? MinimizeIcon : MaximizeIcon}
            label={expanded ? "Exit expanded graph" : "Expand graph"}
            aria-pressed={expanded}
            onClick={() => onExpandedChange(!expanded)}
          />
        </div>

        <div className="graph-canvas__rail-group graph-canvas__rail-group--mobile">
          <DropdownMenu>
            <ControlTooltip label="More graph controls">
              <DropdownMenuTrigger asChild>
                <Button
                  size="small"
                  variant="secondary"
                  className="graph-canvas__control-button"
                  aria-label="More graph controls"
                  data-graph-expand-return="true"
                >
                  <Icon source={MoreVerticalIcon} />
                </Button>
              </DropdownMenuTrigger>
            </ControlTooltip>
            <DropdownMenuContent side="left" align="end" className="graph-canvas__overflow-menu">
              <DropdownMenuLabel>Graph controls</DropdownMenuLabel>
              <DropdownMenuItem disabled={!canCenter} onSelect={onCenter}>
                <Icon source={CenterSelectionIcon} /> Center selection
              </DropdownMenuItem>
              <DropdownMenuItem disabled={layoutPending} onSelect={onReflow}>
                <Icon source={RestartIcon} /> Reflow graph
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onPhysicsEnabledChange(!physicsEnabled)}>
                <Icon source={PhysicsIcon} /> {physicsEnabled ? "Pause physics" : "Resume physics"}
              </DropdownMenuItem>
              {miniMapEnabled ? (
                <DropdownMenuItem onSelect={() => onMiniMapVisibleChange(!miniMapVisible)}>
                  <Icon source={MapIcon} /> {miniMapVisible ? "Hide minimap" : "Show minimap"}
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setMobilePanel("legend")}>
                <Icon source={ListBulletedIcon} /> Legend
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setMobilePanel("help")}>
                <Icon source={HelpIcon} /> Keyboard shortcuts
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onExpandedChange(!expanded)}>
                <Icon source={expanded ? MinimizeIcon : MaximizeIcon} />
                {expanded ? "Exit expanded view" : "Expand graph"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Drawer open={mobilePanel !== null} onOpenChange={(open) => { if (!open) setMobilePanel(null); }}>
        <DrawerContent side="right" className="graph-canvas__utility-drawer">
          <div className="graph-canvas__utility-drawer-header">
            <div>
              <DrawerTitle>{mobilePanel === "legend" ? "Graph legend" : "Keyboard shortcuts"}</DrawerTitle>
              <DrawerDescription>
                {mobilePanel === "legend"
                  ? "Search categories and relationship types or use them as filters."
                  : "Use the canvas without leaving the keyboard."}
              </DrawerDescription>
            </div>
            <DrawerClose asChild><Button size="small" variant="ghost">Close</Button></DrawerClose>
          </div>
          {mobilePanel === "legend" ? legend : <GraphKeyboardHelp />}
        </DrawerContent>
      </Drawer>
    </TooltipProvider>
  );
}
