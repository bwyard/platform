// @breeyard/ui — Svelte 5 component library
// All imports go through this package. Never import from bits-ui directly in apps.

// ── Form primitives ──────────────────────────────────────────────────────────
export { default as Button, buttonVariants } from './Button.svelte';
export type { ButtonVariant, ButtonSize } from './Button.svelte';
export { default as Input } from './Input.svelte';
export { default as Label } from './Label.svelte';
export { default as Textarea } from './Textarea.svelte';
export { default as Checkbox } from './Checkbox.svelte';
export { default as RadioGroup } from './RadioGroup.svelte';
export { default as RadioGroupItem } from './RadioGroupItem.svelte';
export { default as Switch } from './Switch.svelte';

// ── Selection composites ─────────────────────────────────────────────────────
export { default as Select } from './Select.svelte';
export { default as SelectTrigger } from './SelectTrigger.svelte';
export { default as SelectValue } from './SelectValue.svelte';
export { default as SelectContent } from './SelectContent.svelte';
export { default as SelectItem } from './SelectItem.svelte';
export { default as SelectGroup } from './SelectGroup.svelte';
export { default as SelectGroupLabel } from './SelectGroupLabel.svelte';
export { default as Combobox } from './Combobox.svelte';
export { default as ComboboxInput } from './ComboboxInput.svelte';
export { default as ComboboxContent } from './ComboboxContent.svelte';
export { default as ComboboxItem } from './ComboboxItem.svelte';

// ── Display ───────────────────────────────────────────────────────────────────
export { default as Badge, badgeVariants } from './Badge.svelte';
export type { BadgeVariant } from './Badge.svelte';
export { default as StatusBadge } from './StatusBadge.svelte';
export { default as Avatar } from './Avatar.svelte';
export { default as AvatarImage } from './AvatarImage.svelte';
export { default as AvatarFallback } from './AvatarFallback.svelte';
export { default as Card } from './Card.svelte';
export { default as Separator } from './Separator.svelte';
export { default as Progress } from './Progress.svelte';

// ── Feedback ──────────────────────────────────────────────────────────────────
export { default as Spinner } from './Spinner.svelte';
export { default as Alert } from './Alert.svelte';
export { default as EmptyState } from './EmptyState.svelte';

// ── Data display ──────────────────────────────────────────────────────────────
export { default as MetaCard } from './MetaCard.svelte';
export { default as DataTable } from './DataTable.svelte';
export { default as MessageBubble } from './MessageBubble.svelte';

// ── Overlays ──────────────────────────────────────────────────────────────────
export { default as Tooltip } from './Tooltip.svelte';
export { default as TooltipProvider } from './TooltipProvider.svelte';
export { default as TooltipTrigger } from './TooltipTrigger.svelte';
export { default as TooltipContent } from './TooltipContent.svelte';
export { default as Popover } from './Popover.svelte';
export { default as PopoverTrigger } from './PopoverTrigger.svelte';
export { default as PopoverContent } from './PopoverContent.svelte';
export { default as Dialog } from './Dialog.svelte';
export { default as DialogTrigger } from './DialogTrigger.svelte';
export { default as DialogOverlay } from './DialogOverlay.svelte';
export { default as DialogContent } from './DialogContent.svelte';
export { default as DialogHeader } from './DialogHeader.svelte';
export { default as DialogFooter } from './DialogFooter.svelte';
export { default as DialogTitle } from './DialogTitle.svelte';
export { default as DialogDescription } from './DialogDescription.svelte';
export { default as DialogClose } from './DialogClose.svelte';
export { default as Sheet } from './Sheet.svelte';
export { default as SheetTrigger } from './SheetTrigger.svelte';
export { default as SheetContent } from './SheetContent.svelte';
export { default as SheetTitle } from './SheetTitle.svelte';
export { default as SheetDescription } from './SheetDescription.svelte';
export { default as SheetClose } from './SheetClose.svelte';

// ── Navigation / layout ───────────────────────────────────────────────────────
export { default as Tabs } from './Tabs.svelte';
export { default as TabsList } from './TabsList.svelte';
export { default as TabsTrigger } from './TabsTrigger.svelte';
export { default as TabsContent } from './TabsContent.svelte';
export { default as Accordion } from './Accordion.svelte';
export { default as AccordionItem } from './AccordionItem.svelte';
export { default as AccordionTrigger } from './AccordionTrigger.svelte';
export { default as AccordionContent } from './AccordionContent.svelte';
