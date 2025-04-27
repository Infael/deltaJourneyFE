import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

import * as React from "react";

import { cn } from "@/lib/utils";

function ContextMenu({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

const ContextMenuTrigger = ({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) => {
  return <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />;
};

const ContextMenuGroup = ({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Group>) => {
  return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />;
};

const ContextMenuPortal = ({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) => {
  return <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />;
};

const ContextMenuSub = ({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) => {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
};

const ContextMenuRadioGroup = ({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) => {
  return <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />;
};

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "rounded-base bg-main font-base text-main-foreground focus:border-border data-[state=open]:border-border flex cursor-default items-center border-2 border-transparent px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto" />
    </ContextMenuPrimitive.SubTrigger>
  );
}

function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      className={cn(
        "rounded-base border-border bg-main font-base text-main-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-hidden border-2 p-1",
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn(
          "rounded-base border-border bg-main font-base text-main-foreground animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-hidden border-2 p-1 shadow-md",
          className,
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuItem({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      className={cn(
        "rounded-base focus:border-border relative flex cursor-default items-center gap-2 border-2 border-transparent px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(
        "rounded-base font-base text-main-foreground focus:border-border relative flex cursor-default items-center gap-2 border-2 border-transparent py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(
        "rounded-base font-base text-main-foreground focus:border-border relative flex cursor-default items-center gap-2 border-2 border-transparent py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <Circle className="h-2 w-2 fill-current" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "font-base text-main-foreground border-2 border-transparent px-2 py-1.5 text-sm data-[inset]:pl-8",
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-0.5", className)}
      {...props}
    />
  );
}

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn("font-base text-main-foreground ml-auto text-xs tracking-widest", className)} {...props} />
  );
};
ContextMenuShortcut.displayName = "ContextMenuShortcut";

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};
