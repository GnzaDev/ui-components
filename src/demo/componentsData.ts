export interface ComponentProp {
  name: string;
  type: string;
  defaultVal?: string;
  description: string;
}

export type NavItem =
  | "all"
  | "getting-started"
  | "profile-modal"
  | "morph-fab"
  | "popover"
  | "core-primitives"
  | "morph-tabs"
  | "command-palette"
  | "side-sheet"
  | "action-sheet"
  | "nested-modal"
  | "confirm-dialog"
  | "expandable-card"
  | "project-modal"
  | "lightbox"
  | "toast"
  | "playground"
  | "date-picker"
  | "step-dialog"
  | "sortable-list"
  | "floating-action-bar"
  | "family-dialog";


export interface ComponentDoc {
  id: NavItem;
  name: string;
  category: string;
  engine: "sway" | "davo" | "both" | "gonza";
  engineLabel: string;
  badge: string;
  shortDesc: string;
  description: string;
  physics: {
    engine: string;
    concept: string;
    details: string;
  };
  props: ComponentProp[];
  code: string;
}

export const COMPONENTS_DATA: ComponentDoc[] = [
  {
    id: "profile-modal",
    name: "ProfileModal",
    category: "Dual-Engine Primitives",
    engine: "both",
    engineLabel: "Dual Engine (Motion & GSAP)",
    badge: "Spring vs FLIP",
    shortDesc: "Account preferences dialog with real-time switching between Motion spring physics and GSAP Flip.",
    description: "Demonstrates an identical complex form rendered with two different animation philosophies. Switch live between Motion (declarative Euler-Newton spring dynamics) and GSAP Flip (DOM matrix bounding projection).",
    physics: {
      engine: "Motion 12 Spring & GSAP 3 FLIP",
      concept: "Dual-Engine Interoperability",
      details: "Motion preserves velocity and interrupts cleanly with layoutId. GSAP Flip computes First-Last-Invert-Play coordinate delta matrices onto native HTML5 <dialog> elements with PRETTY_EASE curves.",
    },
    props: [
      { name: "open", type: "boolean", defaultVal: "false", description: "Controls whether the modal dialog is mounted and visible." },
      { name: "onClose", type: "() => void", defaultVal: "required", description: "Invoked on backdrop click, escape key, or close button action." },
      { name: "engine", type: "'sway' | 'davo'", defaultVal: "'sway'", description: "Selects whether Motion Spring or GSAP FLIP drives the expansion." },
      { name: "title", type: "string", defaultVal: "undefined", description: "Header title text displayed with standardized typography." },
      { name: "maxWidth", type: "string", defaultVal: "'max-w-lg'", description: "Tailwind max width class for dialog boundary constraining." },
      { name: "footer", type: "ReactNode", defaultVal: "undefined", description: "Optional bottom action container for primary and secondary actions." },
    ],
    code: `import { SwayModal, DavoModal } from "@gonza/ui-components";

// Render with either engine based on user preference:
{engine === "sway" ? (
  <SwayModal
    open={isOpen}
    onClose={() => setIsOpen(false)}
    layoutId="account-dialog"
    title="Account Settings"
  >
    <UserForm />
  </SwayModal>
) : (
  <DavoModal
    open={isOpen}
    onClose={() => setIsOpen(false)}
    triggerRef={buttonRef}
    title="Account Settings"
  >
    <UserForm />
  </DavoModal>
)}`,
  },
  {
    id: "family-dialog",
    name: "FamilyDialog",
    category: "Dual-Engine Primitives",
    engine: "both",
    engineLabel: "View Transition & Motion Spring",
    badge: "Button Morph",
    shortDesc: "Trigger button at the bottom smoothly expands and morphs into the modal's primary action button.",
    description: "Recreates the iconic Family-style confirmation modal using the browser's View Transition API (document.startViewTransition) or Motion's shared layoutId spring projection. The trigger button seamlessly travels and expands into the modal dialog action button.",
    physics: {
      engine: "View Transition API / Motion Spring",
      concept: "Shared Element Morphing & View Transitions",
      details: "In View Transition mode, pairs view-transition-name: family-button and family-label to compute GPU-accelerated boundary interpolation on native dialogs. In Motion mode, projects continuous momentum with layoutId springs (stiffness: 400, damping: 30).",
    },
    props: [
      { name: "open", type: "boolean", defaultVal: "undefined", description: "Controlled open state of the dialog." },
      { name: "onOpenChange", type: "(open: boolean) => void", defaultVal: "undefined", description: "Callback invoked when open state changes." },
      { name: "engine", type: "'view-transition' | 'spring'", defaultVal: "'view-transition'", description: "Strategy: Native View Transition API or Motion layoutId springs." },
      { name: "title", type: "string", defaultVal: "'Confirm'", description: "Header title displayed next to the icon." },
      { name: "description", type: "ReactNode", defaultVal: "'Are you sure...'", description: "Body text or confirmation message." },
      { name: "actionLabel", type: "string", defaultVal: "'Receive'", description: "Action button label that morphs with the trigger button." },
      { name: "cancelLabel", type: "string", defaultVal: "'Cancel'", description: "Secondary dismiss button label." },
      { name: "onConfirm", type: "() => void", defaultVal: "undefined", description: "Callback invoked when primary action button is clicked." },
      { name: "inline", type: "boolean", defaultVal: "false", description: "Confines the dialog within its parent container for showcase/sandboxes." },
    ],
    code: `import { FamilyDialog } from "@gonza/ui-components";

export function Example() {
  return (
    <FamilyDialog
      title="Confirm"
      description="Are you sure you want to receive a load of money?"
      actionLabel="Receive"
      cancelLabel="Cancel"
      engine="view-transition" // or "spring"
      onConfirm={() => console.log("Received!")}
    />
  );
}`,
  },
  {
    id: "morph-fab",
    name: "MorphFab",
    category: "Dual-Engine Primitives",
    engine: "both",
    engineLabel: "Dual Engine (Motion & GSAP)",
    badge: "Corner Expansion",
    shortDesc: "Corner Floating Action Button that blooms from a circular anchor into an expanded quick action menu.",
    description: "Solves scale anisotropic distortion (eliminating the egg-shaped distortion) by morphing dimensional width and height with Davo's signature cubic bezier curve (PRETTY_EASE) or Motion spring dynamics. Unfolds text content smoothly from within the shell with zero pop-in delay.",
    physics: {
      engine: "Motion Spring / GSAP CustomEase",
      concept: "Dimensional Morphing & Parallel Content Flow",
      details: "Replaces transform scale distortion by animating exact box boundaries (56px circle to 288px panel). Cleans up pointer-events on completion and synchronizes child opacity with shell expansion.",
    },
    props: [
      { name: "title", type: "string", defaultVal: "'Actions'", description: "Title displayed in the header of the expanded menu panel." },
      { name: "actions", type: "FabAction[]", defaultVal: "required", description: "Array of action items with id, label, icon, badge, and onClick handlers." },
      { name: "position", type: "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'", defaultVal: "'bottom-right'", description: "Fixed corner placement on the viewport." },
      { name: "engine", type: "'sway' | 'davo'", defaultVal: "'sway'", description: "Switches between Motion spring physics and GSAP cubic bezier expansion." },
      { name: "icon", type: "ReactNode", defaultVal: "<Plus />", description: "Icon rendered inside the closed 56x56 circular trigger state." },
    ],
    code: `import { MorphFab, type FabAction } from "@gonza/ui-components";

const actions: FabAction[] = [
  { id: "chat", label: "Start Discussion", icon: <MessageSquare size={16} />, onClick: () => {} },
  { id: "upload", label: "Upload Assets", badge: "50MB", icon: <Upload size={16} />, onClick: () => {} },
];

<MorphFab
  title="Quick Actions"
  actions={actions}
  position="bottom-right"
  engine="davo" // or 'sway'
/>`,
  },
  {
    id: "popover",
    name: "SwayPopover & DavoPopover",
    category: "Dual-Engine Primitives",
    engine: "both",
    engineLabel: "Dual Engine (Motion & GSAP)",
    badge: "Contextual Floating",
    shortDesc: "Contextual floating popover anchored directly to its trigger button with click-outside dismissal and optical bloom.",
    description: "Lightweight floating popover rendered directly in DOM flow next to its trigger, eliminating top-layer <dialog> clipping. Features optical bloom (blur transition) in Davo mode and snappy spring rebound in Sway mode.",
    physics: {
      engine: "Motion Spring / GSAP CustomEase",
      concept: "Optical Bloom & Anchor Transforms",
      details: "Transform origin automatically aligns to placement (e.g. top-left origin for bottom-right placement) with synchronized scale and blur(10px) to blur(0px) filter interpolation.",
    },
    props: [
      { name: "open", type: "boolean", defaultVal: "false", description: "Controls popover open / closed state." },
      { name: "onClose", type: "() => void", defaultVal: "required", description: "Invoked when clicking outside the popover card or on escape key." },
      { name: "trigger", type: "ReactNode", defaultVal: "required", description: "The anchor element (button, avatar, icon) that toggles the popover." },
      { name: "placement", type: "'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'", defaultVal: "'bottom-right'", description: "Placement position relative to the trigger bounding box." },
      { name: "engine", type: "'sway' | 'davo'", defaultVal: "'sway'", description: "Selects spring physics (Sway) or GSAP optical bloom (Davo)." },
    ],
    code: `import { SwayPopover } from "@gonza/ui-components";

<SwayPopover
  open={open}
  onClose={() => setOpen(false)}
  placement="bottom-right"
  engine="davo"
  trigger={<button onClick={() => setOpen(!open)}>Menu</button>}
>
  <div className="w-56 p-2 space-y-1">
    <button className="w-full text-left px-3 py-2 text-xs">Profile</button>
    <button className="w-full text-left px-3 py-2 text-xs">Settings</button>
  </div>
</SwayPopover>`,
  },
  {
    id: "core-primitives",
    name: "SwayModal vs DavoModal",
    category: "Dual-Engine Primitives",
    engine: "both",
    engineLabel: "Benchmark Comparison",
    badge: "Core Primitives",
    shortDesc: "Foundational centered modal dialog primitives comparing Motion layoutId morphing against HTML5 dialog + GSAP Flip.",
    description: "The foundational building blocks of the library. SwayModal uses Motion's layoutId projection with spring damping, while DavoModal uses the browser's native <dialog> element combined with GSAP Flip.",
    physics: {
      engine: "Motion layoutId vs GSAP Flip",
      concept: "Physical Origin Expansion",
      details: "Both modals expand physically out of the trigger button coordinates, preserving spatial continuity and cognitive context.",
    },
    props: [
      { name: "open", type: "boolean", defaultVal: "false", description: "Controls dialog visibility." },
      { name: "onClose", type: "() => void", defaultVal: "required", description: "Close event callback." },
      { name: "layoutId", type: "string", defaultVal: "undefined", description: "Shared layout identifier for SwayModal spring connection." },
      { name: "triggerRef", type: "RefObject<HTMLElement>", defaultVal: "undefined", description: "DOM trigger reference used by DavoModal GSAP FLIP calculation." },
      { name: "title", type: "string", defaultVal: "undefined", description: "Dialog header text." },
    ],
    code: `import { SwayModal, SwayModalTrigger, DavoModal } from "@gonza/ui-components";

// SwayModal (Motion Spring)
<SwayModalTrigger layoutId="my-dialog" onClick={() => setOpen(true)}>
  Open Dialog
</SwayModalTrigger>
<SwayModal open={open} onClose={() => setOpen(false)} layoutId="my-dialog">
  <p>Modal content</p>
</SwayModal>`,
  },
  {
    id: "morph-tabs",
    name: "MorphTabs",
    category: "Navigation & Controls",
    engine: "sway",
    engineLabel: "Motion Spring",
    badge: "Segmented Control",
    shortDesc: "Segmented tab control with a continuous sliding pill indicator powered by Motion layoutId spring physics.",
    description: "Fluid tab switcher where the active pill indicator smoothly glides across tab items using spring physics. Features fullWidth auto-distribution mode and fit-content mode to prevent text collisions.",
    physics: {
      engine: "Motion 12 Spring Dynamics",
      concept: "Continuous Shared layoutId Projection",
      details: "The active pill indicator uses Motion's layoutId projection (stiffness: 500, damping: 35) to bridge width and position differences seamlessly without manual DOM measuring.",
    },
    props: [
      { name: "tabs", type: "TabItem[]", defaultVal: "required", description: "Array of tab items with id, label, icon, and optional badge count." },
      { name: "activeTab", type: "string", defaultVal: "required", description: "Identifier of the currently selected tab." },
      { name: "onChange", type: "(id: string) => void", defaultVal: "required", description: "Callback invoked when a tab is selected by user click." },
      { name: "fullWidth", type: "boolean", defaultVal: "true", description: "Distributes tab items evenly across the full container width." },
      { name: "layoutIdPrefix", type: "string", defaultVal: "'tabs'", description: "Namespace prefix for Motion layoutId to avoid conflicts with other tabs." },
    ],
    code: `import { MorphTabs, type TabItem } from "@gonza/ui-components";

const tabs: TabItem[] = [
  { id: "overview", label: "Overview", icon: <Activity size={13} /> },
  { id: "team", label: "Team", icon: <Users size={13} />, badge: 8 },
  { id: "security", label: "Security", icon: <Shield size={13} /> },
];

<MorphTabs
  tabs={tabs}
  activeTab={activeTab}
  onChange={setActiveTab}
  fullWidth={true}
/>`,
  },
  {
    id: "command-palette",
    name: "CommandPalette",
    category: "Navigation & Controls",
    engine: "sway",
    engineLabel: "Motion Spring",
    badge: "Spotlight ⌘K",
    shortDesc: "Spotlight command launcher dialog with keyboard shortcut (Cmd+K), fuzzy search, and arrow key navigation.",
    description: "High-productivity spotlight search dialog inspired by macOS Spotlight and Raycast. Features keyboard navigation, category grouping, and fluid enter/exit transitions.",
    physics: {
      engine: "Motion Spring Physics",
      concept: "Keyboard-Driven Spring Physics",
      details: "Active item selection indicator glides smoothly between list items on ArrowUp and ArrowDown key events using micro-spring interpolation.",
    },
    props: [
      { name: "open", type: "boolean", defaultVal: "false", description: "Dialog visibility state." },
      { name: "onClose", type: "() => void", defaultVal: "required", description: "Close callback on escape or backdrop dismissal." },
      { name: "actions", type: "CommandAction[]", defaultVal: "required", description: "List of actions with id, label, icon, category, and shortcut text." },
      { name: "placeholder", type: "string", defaultVal: "'Type a command...'", description: "Input placeholder text." },
    ],
    code: `import { CommandPalette } from "@gonza/ui-components";

<CommandPalette
  open={isOpen}
  onClose={() => setIsOpen(false)}
  actions={[
    { id: "new-file", label: "Create New File", category: "Actions", shortcut: "⌘N" },
    { id: "settings", label: "Open Preferences", category: "Settings", shortcut: "⌘," },
  ]}
/>`,
  },
  {
    id: "side-sheet",
    name: "SideSheet",
    category: "Overlays & Drawers",
    engine: "sway",
    engineLabel: "Motion Spring",
    badge: "Slide-over Drawer",
    shortDesc: "Slide-over drawer sliding smoothly from screen edges with backdrop blur and responsive dimensions.",
    description: "Slide-over drawer for shopping carts, filters, and detail panes. Slides from right, left, top, or bottom with backdrop blur and touch dismiss.",
    physics: {
      engine: "Motion Spring Dynamics",
      concept: "Directional Spring Deceleration",
      details: "Translates along X or Y axis with calibrated spring velocity (stiffness: 320, damping: 32), providing a crisp stopping transition with zero bounce overshoot.",
    },
    props: [
      { name: "open", type: "boolean", defaultVal: "false", description: "Drawer visibility state." },
      { name: "onClose", type: "() => void", defaultVal: "required", description: "Close callback handler." },
      { name: "side", type: "'right' | 'left' | 'top' | 'bottom'", defaultVal: "'right'", description: "Screen border edge from which the drawer slides." },
      { name: "title", type: "string", defaultVal: "undefined", description: "Header title of the drawer." },
      { name: "width", type: "string", defaultVal: "'max-w-md'", description: "Tailwind width class for drawer panel." },
    ],
    code: `import { SideSheet } from "@gonza/ui-components";

<SideSheet
  open={cartOpen}
  onClose={() => setCartOpen(false)}
  side="right"
  title="Shopping Cart"
  width="max-w-md"
>
  <CartItemList />
</SideSheet>`,
  },
  {
    id: "action-sheet",
    name: "DavoActionSheet",
    category: "Overlays & Drawers",
    engine: "davo",
    engineLabel: "GSAP Flip",
    badge: "Mobile Drawer",
    shortDesc: "Mobile-style bottom action sheet morphing upward with GSAP Flip and theatrical bezier deceleration.",
    description: "Bottom sheet drawer designed for mobile and touch interactions. Smoothly morphs from screen bottom with custom GSAP easing.",
    physics: {
      engine: "GSAP CustomEase & FLIP",
      concept: "Theatrical Bezier Deceleration",
      details: "Uses Davo's signature PRETTY_EASE (cubic-bezier(0.16, 1, 0.3, 1)) for an elegant, non-bouncy stop on native HTML5 <dialog>.",
    },
    props: [
      { name: "open", type: "boolean", defaultVal: "false", description: "Controls action sheet visibility." },
      { name: "onClose", type: "() => void", defaultVal: "required", description: "Close callback handler." },
      { name: "title", type: "string", defaultVal: "undefined", description: "Action sheet header prompt." },
      { name: "actions", type: "ActionSheetItem[]", defaultVal: "required", description: "List of actions with id, label, icon, and optional destructive styling." },
    ],
    code: `import { DavoActionSheet } from "@gonza/ui-components";

<DavoActionSheet
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Share Project"
  actions={[
    { id: "copy", label: "Copy Link", icon: <Copy size={16} /> },
    { id: "delete", label: "Delete File", icon: <Trash size={16} />, destructive: true },
  ]}
/>`,
  },
  {
    id: "nested-modal",
    name: "NestedModal Composition",
    category: "Overlays & Drawers",
    engine: "sway",
    engineLabel: "Motion Spring",
    badge: "Layered Overlays",
    shortDesc: "SideSheet combined with SwayModal using inline mode, eliminating z-index traps.",
    description: "Demonstrates advanced overlay composition. A SwayModal opens on top of an active SideSheet using inline={true}, keeping both interactive and free of backdrop conflicts.",
    physics: {
      engine: "Motion Spring Physics",
      concept: "Multi-Tier Overlay Stacking",
      details: "Maintains independent focus traps and esc-key queues across nested dialog tiers without portal z-index collisions.",
    },
    props: [
      { name: "inline", type: "boolean", defaultVal: "false", description: "When true, renders inside parent container rather than viewport root portal." },
      { name: "open", type: "boolean", defaultVal: "false", description: "Controls modal visibility." },
      { name: "onClose", type: "() => void", defaultVal: "required", description: "Close handler for nested dialog." },
    ],
    code: `import { SideSheet, SwayModal, SwayModalTrigger } from "@gonza/ui-components";

<SideSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Checkout Drawer">
  <SwayModalTrigger layoutId="nested-coupon" onClick={() => setModalOpen(true)}>
    Apply Discount Code
  </SwayModalTrigger>

  <SwayModal open={modalOpen} onClose={() => setModalOpen(false)} inline={true} layoutId="nested-coupon">
    <CouponInputForm />
  </SwayModal>
</SideSheet>`,
  },
  {
    id: "confirm-dialog",
    name: "ConfirmDialog",
    category: "Overlays & Drawers",
    engine: "both",
    engineLabel: "Dual Engine (Motion & GSAP)",
    badge: "Destructive Alert",
    shortDesc: "High-urgency alert modal for irreversible actions with loading states and keyboard traps.",
    description: "Modal alert dialog for confirming destructive or irreversible actions. Features focus traps, escape key dismissal, and loading state integration.",
    physics: {
      engine: "Dual Engine (Sway Springs & Davo FLIP)",
      concept: "Proportional Button Origin Morphing",
      details: "In Sway mode, uses Euler-Newton spring interpolation via layoutId. In Davo mode, uses native HTML <dialog> with GSAP Flip PRETTY_EASE 0.7s.",
    },
    props: [
      { name: "open", type: "boolean", defaultVal: "false", description: "Dialog visibility state." },
      { name: "onConfirm", type: "() => void", defaultVal: "required", description: "Callback invoked upon positive confirmation." },
      { name: "onCancel", type: "() => void", defaultVal: "required", description: "Callback invoked on cancellation or dismissal." },
      { name: "title", type: "string", defaultVal: "'Confirm Action'", description: "Alert headline." },
      { name: "message", type: "string", defaultVal: "required", description: "Detailed explanation of consequences." },
      { name: "danger", type: "boolean", defaultVal: "false", description: "Applies high-urgency red destructive treatment to confirmation button." },
    ],
    code: `import { ConfirmDialog } from "@gonza/ui-components";

<ConfirmDialog
  open={alertOpen}
  title="Delete Repository?"
  message="This action cannot be undone. All branches and tags will be permanently deleted."
  danger={true}
  onConfirm={handleDelete}
  onCancel={() => setAlertOpen(false)}
/>`,
  },
  {
    id: "expandable-card",
    name: "SwayCard",
    category: "Cards & Media",
    engine: "sway",
    engineLabel: "Motion Spring",
    badge: "Feed Expansion",
    shortDesc: "Feed article card that seamlessly morphs from a compact preview into a full reading dialog.",
    description: "Expandable feed article card inspired by the iOS App Store. Morphs from a compact card directly into a full-screen article modal with zero layout shifts.",
    physics: {
      engine: "Motion layoutId Projection",
      concept: "Shared Layout Morphing",
      details: "Synchronizes card boundary, image thumbnail, title typography, and content elevation in a single continuous spring interpolation.",
    },
    props: [
      { name: "layoutId", type: "string", defaultVal: "required", description: "Unique shared layout identifier linking compact card to expanded view." },
      { name: "thumbnail", type: "string", defaultVal: "required", description: "URL of the cover media asset." },
      { name: "title", type: "string", defaultVal: "required", description: "Article headline title." },
      { name: "author", type: "string", defaultVal: "undefined", description: "Author attribution string." },
    ],
    code: `import { SwayCard } from "@gonza/ui-components";

<SwayCard
  layoutId="article-42"
  title="The Architecture of Fluid Interactions"
  thumbnail="https://images.unsplash.com/..."
  author="Alex Rivera"
  readTime="5 min read"
>
  <FullArticleMarkdown />
</SwayCard>`,
  },
  {
    id: "project-modal",
    name: "ProjectCardModal",
    category: "Cards & Media",
    engine: "davo",
    engineLabel: "GSAP Flip",
    badge: "GSAP FLIP Morph",
    shortDesc: "Project summary card that expands its physical DOM rectangle directly into a detailed modal dialog.",
    description: "Interactive project card morphing via GSAP Flip. Computes initial bounding box and smoothly transitions into the centered modal dialog.",
    physics: {
      engine: "GSAP Flip Plugin",
      concept: "FLIP Matrix Projection",
      details: "Captures initial element dimensions (getBoundingClientRect), opens target <dialog>, and inverts translation and scale with PRETTY_EASE curves.",
    },
    props: [
      { name: "project", type: "ProjectData", defaultVal: "required", description: "Project record containing title, tags, description, and metrics." },
      { name: "open", type: "boolean", defaultVal: "false", description: "Modal open state." },
      { name: "onClose", type: "() => void", defaultVal: "required", description: "Close callback handler." },
    ],
    code: `import { ProjectCardModal } from "@gonza/ui-components";

<ProjectCardModal
  project={{
    title: "Design System 2.0",
    description: "Multi-brand design token pipeline for edge runtimes.",
    tags: ["TypeScript", "Vite", "Motion"],
  }}
/>`,
  },
  {
    id: "lightbox",
    name: "FlipLightbox",
    category: "Cards & Media",
    engine: "davo",
    engineLabel: "GSAP Flip",
    badge: "Image Gallery Zoom",
    shortDesc: "Zero-letterbox image gallery zooming directly from thumbnail into full-screen dialog with floating glass caption.",
    description: "Cinematic image lightbox that zooms directly from thumbnail position into a high-res dialog with glassmorphism caption bar. No black bars, pure image fitting.",
    physics: {
      engine: "GSAP Flip Matrix Math",
      concept: "Aspect-Ratio Preserved FLIP",
      details: "Scales image maintaining exact aspect ratio, matching pixel coordinates of the source thumbnail without letterboxing.",
    },
    props: [
      { name: "images", type: "LightboxImage[]", defaultVal: "required", description: "Array of images with src, title, caption, and tag." },
      { name: "defaultIndex", type: "number", defaultVal: "0", description: "Initial active image index upon opening." },
    ],
    code: `import { FlipLightbox } from "@gonza/ui-components";

<FlipLightbox
  images={[
    { src: "/photo1.jpg", title: "Abstract Sphere", caption: "3D generative fluid simulation." },
    { src: "/photo2.jpg", title: "Glass Prism", caption: "Refraction physics rendering." },
  ]}
/>`,
  },
  {
    id: "toast",
    name: "FlipToast",
    category: "Feedback & Lab",
    engine: "gonza",
    engineLabel: "Motion Spring",
    badge: "Stacked Notifications",
    shortDesc: "Fluid interactive notifications with spring entrance, auto-dismiss, and stacked layout repositioning.",
    description: "Stacked notification queue. When a toast dismisses, the remaining toasts smoothly collapse into place with physics-based spring animation.",
    physics: {
      engine: "Motion layout Physics",
      concept: "Layout Stack Interpolation",
      details: "Uses Motion's layout prop on list items so remaining notifications automatically slide into their new positions without manual offset math.",
    },
    props: [
      { name: "toasts", type: "ToastItem[]", defaultVal: "required", description: "Queue of active toast items with id, title, message, and type." },
      { name: "dismissToast", type: "(id: string) => void", defaultVal: "required", description: "Callback to remove a toast by its id." },
      { name: "position", type: "'bottom-right' | 'top-right'", defaultVal: "'bottom-right'", description: "Viewport anchor corner." },
    ],
    code: `import { FlipToast, type ToastItem } from "@gonza/ui-components";

<FlipToast
  toasts={toasts}
  onDismiss={dismissToast}
  position="bottom-right"
/>`,
  },
  {
    id: "playground",
    name: "Corner Matrix Lab",
    category: "Feedback & Lab",
    engine: "both",
    engineLabel: "5-Position Matrix",
    badge: "Coordinate Diagnostic",
    shortDesc: "Diagnostic lab testing morphing trajectories from all 4 screen corners and center origin.",
    description: "Testbed for verifying coordinate interpolation across top-left, top-right, center, bottom-left, and bottom-right origins. Compare Motion vs GSAP FLIP diagonal arcs.",
    physics: {
      engine: "Motion Spring & GSAP FLIP",
      concept: "Diagonal Coordinate Interpolation",
      details: "Tests edge cases of delta-X and delta-Y scaling to guarantee smooth trajectories regardless of trigger location.",
    },
    props: [
      { name: "engine", type: "'gonza' | 'davo'", defaultVal: "'gonza'", description: "Selects animation engine under test." },
      { name: "origin", type: "'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'", defaultVal: "'center'", description: "Origin trigger position on screen." },
    ],
    code: `import { InlinePlaygroundExample } from "@gonza/ui-components";

<InlinePlaygroundExample />`,
  },
  {
    id: "date-picker",
    name: "DavoDatePicker",
    category: "Input & Pickers",
    engine: "both",
    engineLabel: "Dual Engine (Motion & GSAP)",
    badge: "Spring vs FLIP",
    shortDesc: "Interactive calendar with directional month slides, date selection, and integrated time picker.",
    description: "Combines a smooth animated calendar grid with optional hour/minute wheel selectors, shortcuts for quick dates, and responsive popover triggering with real-time switching between Motion springs and GSAP Flip.",
    physics: {
      engine: "Motion 11 Spring & GSAP 3 FLIP",
      concept: "Dual-Engine Coordinate Morphing",
      details: "In Sway mode, the calendar pops elastically from the trigger button with Motion springs. In Davo mode, it morphs directly from the button bounding rect into the full calendar grid using GSAP Flip coordinates.",
    },
    props: [
      { name: "value", type: "Date | null", defaultVal: "null", description: "Currently selected Date object." },
      { name: "onChange", type: "(date: Date | null) => void", defaultVal: "undefined", description: "Event callback on date or time selection." },
      { name: "showTime", type: "boolean", defaultVal: "false", description: "Enables integrated hour and minute selection controls." },
      { name: "inline", type: "boolean", defaultVal: "false", description: "Renders calendar directly without popover trigger button." },
      { name: "engine", type: "'sway' | 'davo'", defaultVal: "'sway'", description: "Selects animation engine for popover opening and closing." },
    ],
    code: `import { DavoDatePicker } from "@gonza/ui-components";

<DavoDatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  showTime={true}
  engine="both"
/>`,
  },
  {
    id: "step-dialog",
    name: "MorphingStepDialog",
    category: "Dual-Engine Primitives",
    engine: "both",
    engineLabel: "Dual Engine (Motion & GSAP)",
    badge: "Spring vs FLIP",
    shortDesc: "Multi-step wizard modal with dynamically morphing container dimensions and directional step slides.",
    description: "Solves jarring height and width jumps in multi-step wizard flows. The modal container animates smoothly with Euler-Newton spring dynamics as step contents change, and opens/closes with either Motion springs or GSAP Flip.",
    physics: {
      engine: "Motion 11 Layout & GSAP 3 FLIP",
      concept: "Elastic Box Morphing & FLIP Entry",
      details: "Opens either via GSAP FLIP coordinate projection from a trigger button or via Motion layout spring physics, while internally morphing container dimensions elastically across steps.",
    },
    props: [
      { name: "open", type: "boolean", defaultVal: "required", description: "Controls modal visibility state." },
      { name: "onClose", type: "() => void", defaultVal: "required", description: "Callback triggered when backdrop, close button, or Escape is pressed." },
      { name: "steps", type: "StepItem[]", defaultVal: "required", description: "Array of step definitions containing id, title, description, and content." },
      { name: "engine", type: "'sway' | 'davo'", defaultVal: "'sway'", description: "Selects animation engine (Motion springs vs GSAP FLIP dialog)." },
      { name: "triggerRef", type: "RefObject<HTMLElement>", defaultVal: "undefined", description: "Origin trigger element for GSAP FLIP morphing." },
      { name: "onComplete", type: "() => void", defaultVal: "undefined", description: "Callback fired when the user completes the final step." },
    ],
    code: `import { MorphingStepDialog, type StepItem } from "@gonza/ui-components";

<MorphingStepDialog
  open={open}
  onClose={() => setOpen(false)}
  steps={steps}
  onComplete={() => alert("Wizard completed")}
/>`,
  },
  {
    id: "sortable-list",
    name: "SortableSpringList",
    category: "Navigation & Commands",
    engine: "sway",
    engineLabel: "Motion Reorder Springs",
    badge: "Drag & Drop",
    shortDesc: "Fluid drag-and-drop sortable list where neighboring items gracefully part ways in real-time.",
    description: "Built on Motion's Reorder component with dedicated grip handles, elevation shadows during dragging, and instant FLIP spring positioning for displaced siblings.",
    physics: {
      engine: "Motion 11 Reorder FLIP",
      concept: "Real-Time Momentum Separation",
      details: "Sibling elements dynamically recalculate their vertical translation matrices with spring stiffness 450 to open gap positions as the dragged item moves.",
    },
    props: [
      { name: "items", type: "T[]", defaultVal: "required", description: "Array of sortable objects containing id, title, subtitle, and badge." },
      { name: "onReorder", type: "(newItems: T[]) => void", defaultVal: "required", description: "Callback invoked whenever items change order." },
      { name: "renderItem", type: "(item: T, isDragging: boolean) => ReactNode", defaultVal: "undefined", description: "Optional custom row render function." },
    ],
    code: `import { SortableSpringList } from "@gonza/ui-components";

<SortableSpringList
  items={items}
  onReorder={setItems}
/>`,
  },
  {
    id: "floating-action-bar",
    name: "FloatingActionBar",
    category: "Feedback & Lab",
    engine: "sway",
    engineLabel: "Motion Spring Entrance",
    badge: "Contextual Toolbar",
    shortDesc: "Floating action toolbar appearing elastically when items are selected, inspired by Notion and Figma.",
    description: "Presents a floating pill dock anchored to the bottom or top of the viewport with selection count badge, customizable action buttons, and spring-based entry/exit animations.",
    physics: {
      engine: "Motion 11 Spring Scale",
      concept: "Elastic Bounding Entrance",
      details: "Combines vertical translation with spring scaling (0.92 -> 1.0) and backdrop blur for a responsive floating HUD feel.",
    },
    props: [
      { name: "open", type: "boolean", defaultVal: "required", description: "Controls toolbar presence in viewport." },
      { name: "selectedCount", type: "number", defaultVal: "undefined", description: "Optional badge showing number of currently selected items." },
      { name: "actions", type: "FloatingAction[]", defaultVal: "required", description: "List of action buttons with id, label, icon, onClick, and variant." },
      { name: "position", type: "'bottom' | 'top'", defaultVal: "'bottom'", description: "Screen edge anchor location." },
      { name: "onClear", type: "() => void", defaultVal: "undefined", description: "Callback when the dismiss/clear button is clicked." },
    ],
    code: `import { FloatingActionBar } from "@gonza/ui-components";

<FloatingActionBar
  open={selectedItems.length > 0}
  selectedCount={selectedItems.length}
  actions={actions}
  onClear={() => setSelectedItems([])}
/>`,
  },
];
