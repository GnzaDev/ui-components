import { useMemo, useRef, useState } from "react";
import { SwayModal, SwayModalTrigger } from "../SwayModal";
import { DavoModal } from "../DavoModal";
import {
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Terminal,
  Search,
  Menu,
  X,
  Code2,
  Eye,
  ChevronRight,
} from "lucide-react";
import {
  ProfileModalExample,
  ProjectCardModalExample,
  CartSideSheetExample,
  NestedModalExample,
  ConfirmDialogExample,
  InlinePlaygroundExample,
  ExpandableCardExample,
  ActionSheetExample,
  PopoverExample,
  CommandPaletteExample,
  MorphTabsExample,
  MorphFabExample,
  ToastExample,
  LightboxExample,
  DatePickerExample,
  StepDialogExample,
  SortableListExample,
  FloatingActionBarExample,
} from "./examples";
import {
  COMPONENTS_DATA,
  type ComponentDoc,
  type NavItem,
} from "./componentsData";

interface SidebarCategory {
  title: string;
  items: {
    id: NavItem;
    label: string;
    badge?: string;
    engine?: "both" | "sway" | "davo" | "gonza";
  }[];
}

const CATEGORIES: SidebarCategory[] = [
  {
    title: "Overview",
    items: [
      { id: "all", label: "Component Catalog", badge: "19" },
      { id: "getting-started", label: "Installation & Guide" },
    ],
  },
  {
    title: "Dual-Engine Primitives",
    items: [
      { id: "profile-modal", label: "ProfileModal", badge: "Switch", engine: "both" },
      { id: "step-dialog", label: "MorphingStepDialog", badge: "Dual", engine: "both" },
      { id: "date-picker", label: "DavoDatePicker", badge: "Dual", engine: "both" },
      { id: "morph-fab", label: "MorphFab", badge: "Dual", engine: "both" },
      { id: "popover", label: "SwayPopover", badge: "Dual", engine: "both" },
      { id: "core-primitives", label: "Modal Benchmark", engine: "both" },
    ],
  },
  {
    title: "Navigation & Controls",
    items: [
      { id: "morph-tabs", label: "MorphTabs", badge: "Spring", engine: "sway" },
      { id: "sortable-list", label: "SortableSpringList", badge: "Drag", engine: "sway" },
      { id: "command-palette", label: "CommandPalette", engine: "sway" },
    ],
  },
  {
    title: "Overlays & Drawers",
    items: [
      { id: "side-sheet", label: "SideSheet (Cart)", engine: "sway" },
      { id: "action-sheet", label: "DavoActionSheet", badge: "GSAP", engine: "davo" },
      { id: "nested-modal", label: "NestedModal", engine: "sway" },
      { id: "confirm-dialog", label: "ConfirmDialog", engine: "both" },
    ],
  },
  {
    title: "Cards & Media",
    items: [
      { id: "expandable-card", label: "SwayCard (Feed)", engine: "sway" },
      { id: "project-modal", label: "ProjectCardModal", badge: "GSAP", engine: "davo" },
      { id: "lightbox", label: "FlipLightbox", badge: "Zoom", engine: "davo" },
    ],
  },
  {
    title: "Feedback & Lab",
    items: [
      { id: "floating-action-bar", label: "FloatingActionBar", badge: "Toolbar", engine: "sway" },
      { id: "toast", label: "FlipToast", engine: "sway" },
      { id: "playground", label: "Corner Matrix Lab", badge: "5-Pos", engine: "both" },
    ],
  },
];

export function ShowcaseDemo() {
  const [selectedNav, setSelectedNav] = useState<NavItem>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Quick modals for Core Primitives Benchmark
  const [swayOpen, setSwayOpen] = useState(false);
  const [davoOpen, setDavoOpen] = useState(false);
  const davoTriggerRef = useRef<HTMLButtonElement>(null);

  const copyInstallCommand = () => {
    navigator.clipboard.writeText("pnpm add motion gsap lucide-react clsx tailwind-merge");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1500);
  };

  const selectItem = (id: NavItem) => {
    setSelectedNav(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter navigation items by search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return CATEGORIES;
    const q = searchQuery.toLowerCase();
    return CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (it) => it.label.toLowerCase().includes(q) || cat.title.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [searchQuery]);

  // Current selected component metadata
  const currentDoc = useMemo(() => {
    return COMPONENTS_DATA.find((c) => c.id === selectedNav);
  }, [selectedNav]);

  // Next and previous components for footer pagination
  const { prevDoc, nextDoc } = useMemo(() => {
    const idx = COMPONENTS_DATA.findIndex((c) => c.id === selectedNav);
    if (idx === -1) return { prevDoc: null, nextDoc: null };
    return {
      prevDoc: idx > 0 ? COMPONENTS_DATA[idx - 1] : null,
      nextDoc: idx < COMPONENTS_DATA.length - 1 ? COMPONENTS_DATA[idx + 1] : null,
    };
  }, [selectedNav]);

  return (
    <div className="w-full px-6 py-6 lg:px-8">
      {/* Mobile Top Bar */}
      <div className="mb-6 flex items-center justify-between border-b border-zinc-200/80 pb-4 lg:hidden dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-white cursor-pointer"
        >
          {mobileMenuOpen ? <X size={14} /> : <Menu size={14} />}
          <span>Index</span>
        </button>

        <span className="font-mono text-[11px] text-zinc-400">
          v1.0.0
        </span>
      </div>

      {/* Main Grid: Sidebar + Content */}
      <div className="flex gap-8 items-start">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 bg-white/95 p-6 backdrop-blur-xl transition-transform lg:static lg:block lg:w-64 lg:shrink-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none dark:bg-zinc-950/95 lg:dark:bg-transparent ${
            mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Navigation
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="sticky top-20 space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto pr-3">
            {/* Search Input */}
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search primitives..."
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-1.5 pl-8 pr-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:border-zinc-700"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Navigation Sections */}
            <div className="space-y-5">
              {filteredCategories.map((cat) => (
                <div key={cat.title} className="space-y-1">
                  <h4 className="px-2 text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    {cat.title}
                  </h4>
                  <div className="space-y-0.5">
                    {cat.items.map((item) => {
                      const isActive = selectedNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => selectItem(item.id)}
                          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                            isActive
                              ? "bg-zinc-900 text-white font-medium shadow-xs dark:bg-white dark:text-zinc-950"
                              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-white"
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`rounded border px-1.5 py-0.2 font-mono text-[9px] tracking-tight ${
                                isActive
                                  ? "border-transparent bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-950"
                                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Meta */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                  Motion 12 • GSAP 3
                </span>
              </div>
              <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                React 19 native primitives with strict TypeScript contracts.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 pb-16">
          {/* VIEW 1: CATALOG OVERVIEW */}
          {selectedNav === "all" && (
            <CatalogOverview
              onSelectComponent={selectItem}
              copyInstallCommand={copyInstallCommand}
              copiedCode={copiedCode}
            />
          )}

          {/* VIEW 2: GETTING STARTED */}
          {selectedNav === "getting-started" && (
            <GettingStartedView
              copyInstallCommand={copyInstallCommand}
              copiedCode={copiedCode}
              onExplore={() => selectItem("all")}
            />
          )}

          {/* VIEW 3: DEDICATED COMPONENT DOC PAGE */}
          {selectedNav !== "all" && selectedNav !== "getting-started" && currentDoc && (
            <ComponentDocPage
              doc={currentDoc}
              prevDoc={prevDoc}
              nextDoc={nextDoc}
              onNavigate={selectItem}
              setSwayOpen={setSwayOpen}
              setDavoOpen={setDavoOpen}
              davoTriggerRef={davoTriggerRef}
            />
          )}
        </main>
      </div>

      {/* Global Benchmark Modals */}
      <SwayModal
        open={swayOpen}
        onClose={() => setSwayOpen(false)}
        layoutId="benchmark-sway-modal"
        title="SwayModal (Motion Spring)"
        footer={
          <div className="flex justify-end">
            <button
              onClick={() => setSwayOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Close
            </button>
          </div>
        }
      >
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          This modal physically blooms from the trigger button using Motion layoutId projection with calibrated spring dynamics (stiffness: 400, damping: 30).
        </p>
      </SwayModal>

      <DavoModal
        open={davoOpen}
        onClose={() => setDavoOpen(false)}
        triggerRef={davoTriggerRef}
        title="DavoModal (GSAP Flip)"
        footer={
          <div className="flex justify-end">
            <button
              onClick={() => setDavoOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Close
            </button>
          </div>
        }
      >
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          This modal uses the native HTML5 &lt;dialog&gt; top-layer element combined with GSAP Flip matrix math and theatrical PRETTY_EASE curves.
        </p>
      </DavoModal>
    </div>
  );
}

// ============================================================================
// COMPONENT DOC PAGE
// ============================================================================
function ComponentDocPage({
  doc,
  prevDoc,
  nextDoc,
  onNavigate,
  setSwayOpen,
  setDavoOpen,
  davoTriggerRef,
}: {
  doc: ComponentDoc;
  prevDoc: ComponentDoc | null;
  nextDoc: ComponentDoc | null;
  onNavigate: (id: NavItem) => void;
  setSwayOpen: (open: boolean) => void;
  setDavoOpen: (open: boolean) => void;
  davoTriggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(doc.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const renderExampleWidget = () => {
    switch (doc.id) {
      case "profile-modal":
        return <ProfileModalExample />;
      case "morph-fab":
        return <MorphFabExample />;
      case "popover":
        return <PopoverExample />;
      case "core-primitives":
        return (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <p className="text-xs text-zinc-500 max-w-sm text-center">
              Trigger both foundational dialog implementations side by side to compare spring physics against GSAP FLIP.
            </p>
            <div className="flex gap-4">
              <SwayModalTrigger
                layoutId="benchmark-sway-modal"
                onClick={() => setSwayOpen(true)}
                className="text-xs"
              >
                <span>Trigger SwayModal</span>
                <ArrowRight size={13} />
              </SwayModalTrigger>
              <button
                ref={davoTriggerRef}
                type="button"
                onClick={() => setDavoOpen(true)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-zinc-200/80 bg-white px-4 text-xs font-semibold text-zinc-900 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80 cursor-pointer"
              >
                <span>Trigger DavoModal</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        );
      case "morph-tabs":
        return <MorphTabsExample />;
      case "command-palette":
        return <CommandPaletteExample />;
      case "side-sheet":
        return <CartSideSheetExample />;
      case "action-sheet":
        return <ActionSheetExample />;
      case "nested-modal":
        return <NestedModalExample />;
      case "confirm-dialog":
        return <ConfirmDialogExample />;
      case "expandable-card":
        return <ExpandableCardExample />;
      case "project-modal":
        return <ProjectCardModalExample />;
      case "lightbox":
        return <LightboxExample />;
      case "toast":
        return <ToastExample />;
      case "playground":
        return <InlinePlaygroundExample />;
      case "date-picker":
        return <DatePickerExample />;
      case "step-dialog":
        return <StepDialogExample />;
      case "sortable-list":
        return <SortableListExample />;
      case "floating-action-bar":
        return <FloatingActionBarExample />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Title */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <button
            onClick={() => onNavigate("all")}
            className="hover:text-zinc-900 dark:hover:text-white cursor-pointer"
          >
            COMPONENTS
          </button>
          <span>/</span>
          <span>{doc.category.toUpperCase()}</span>
          <span>/</span>
          <span className="text-zinc-900 dark:text-white font-medium">{doc.name}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            {doc.name}
          </h1>
          <span className="rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
            {doc.engineLabel}
          </span>
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {doc.description}
        </p>
      </div>

      {/* Interactive Sandbox Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
        {/* Canvas Toolbar */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50/50 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100/80 p-0.5 text-xs dark:border-zinc-800 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                tab === "preview"
                  ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <Eye size={13} />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("code")}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                tab === "code"
                  ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <Code2 size={13} />
              <span>Code</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {tab === "code" && (
              <button
                type="button"
                onClick={copyCode}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
              >
                {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            )}
            <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
              React 19 • Tailwind v4
            </span>
          </div>
        </div>

        {/* Canvas Body */}
        {tab === "preview" ? (
          <div className="p-6 sm:p-10 min-h-[440px] flex items-center justify-center bg-zinc-50/30 dark:bg-zinc-950/30">
            <div className="w-full flex items-center justify-center">{renderExampleWidget()}</div>
          </div>
        ) : (
          <div className="bg-zinc-950 p-6 overflow-x-auto">
            <pre className="font-mono text-xs leading-relaxed text-zinc-200">
              <code>{doc.code}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Physics Spec Card */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50/40 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400">
            PHYSICS SPEC // {doc.physics.concept}
          </span>
          <span className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400">
            {doc.physics.engine}
          </span>
        </div>
        <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {doc.physics.details}
        </p>
      </div>

      {/* Props Table */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Component API
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            TypeScript definitions and default values.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400 font-mono text-[11px]">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Prop</th>
                  <th className="px-4 py-2.5 font-medium">Type</th>
                  <th className="px-4 py-2.5 font-medium">Default</th>
                  <th className="px-4 py-2.5 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {doc.props.map((p) => (
                  <tr key={p.name} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
                    <td className="px-4 py-2.5 font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                      {p.name}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-zinc-600 dark:text-zinc-400">
                      {p.type}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-zinc-400">
                      {p.defaultVal || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-300">
                      {p.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-zinc-200/80 pt-6 dark:border-zinc-800">
        {prevDoc ? (
          <button
            type="button"
            onClick={() => onNavigate(prevDoc.id)}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-medium text-zinc-900 shadow-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <ArrowLeft size={13} />
            <div className="text-left">
              <span className="block text-[9px] uppercase font-mono text-zinc-400">Previous</span>
              <span>{prevDoc.name}</span>
            </div>
          </button>
        ) : <div />}

        {nextDoc ? (
          <button
            type="button"
            onClick={() => onNavigate(nextDoc.id)}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-medium text-zinc-900 shadow-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 cursor-pointer text-right"
          >
            <div className="text-right">
              <span className="block text-[9px] uppercase font-mono text-zinc-400">Next</span>
              <span>{nextDoc.name}</span>
            </div>
            <ArrowRight size={13} />
          </button>
        ) : <div />}
      </div>
    </div>
  );
}

// ============================================================================
// CATALOG OVERVIEW VIEW
// ============================================================================
function CatalogOverview({
  onSelectComponent,
  copyInstallCommand,
  copiedCode,
}: {
  onSelectComponent: (id: NavItem) => void;
  copyInstallCommand: () => void;
  copiedCode: boolean;
}) {
  const [engineFilter, setEngineFilter] = useState<"all" | "both" | "sway" | "davo">("all");

  const filteredComponents = useMemo(() => {
    if (engineFilter === "all") return COMPONENTS_DATA;
    if (engineFilter === "sway") return COMPONENTS_DATA.filter((c) => c.engine === "sway" || c.engine === "gonza");
    return COMPONENTS_DATA.filter((c) => c.engine === engineFilter);
  }, [engineFilter]);

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="space-y-4 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span>CATALOG</span>
              <span>•</span>
              <span>19 PRIMITIVES</span>
              <span>•</span>
              <span>REACT 19</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              Dual-Engine Component System
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Precision UI primitives powered by <span className="text-zinc-900 dark:text-zinc-100 font-medium">Sway (Motion)</span> for spring dynamics and <span className="text-zinc-900 dark:text-zinc-100 font-medium">Davo (GSAP FLIP)</span> for matrix projections.
            </p>
          </div>

          {/* Quick Install */}
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 font-mono text-xs text-zinc-700 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <Terminal size={13} className="text-zinc-400" />
            <span>pnpm add motion gsap lucide-react</span>
            <button
              type="button"
              onClick={copyInstallCommand}
              className="rounded p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer ml-1"
              title="Copy install command"
            >
              {copiedCode ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
            </button>
          </div>
        </div>
      </div>

      {/* Engine Specs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
              ENGINE 01 // SWAY
            </span>
            <span className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-mono text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400">
              Motion 12
            </span>
          </div>
          <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
            Euler-Newton Spring Dynamics
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Continuous momentum physics and declarative <code className="text-zinc-700 dark:text-zinc-300">layoutId</code> projection. Gestures and mid-flight interruptions preserve velocity naturally without timeline snapping.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
              ENGINE 02 // DAVO
            </span>
            <span className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-mono text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400">
              GSAP 3 FLIP
            </span>
          </div>
          <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
            FLIP Matrix Projection & Native &lt;dialog&gt;
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Top-layer isolation with First-Last-Invert-Play coordinate transforms, calibrated with Davo&apos;s signature <code className="text-zinc-700 dark:text-zinc-300">PRETTY_EASE</code> curves and optical bloom.
          </p>
        </div>
      </div>

      {/* Catalog Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/80 pb-3 dark:border-zinc-800">
          <span className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider">
            Components ({filteredComponents.length})
          </span>

          {/* Segmented Filter */}
          <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100/80 p-0.5 text-xs dark:border-zinc-800 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => setEngineFilter("all")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                engineFilter === "all"
                  ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              All (19)
            </button>
            <button
              type="button"
              onClick={() => setEngineFilter("both")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                engineFilter === "both"
                  ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Dual-Engine (6)
            </button>
            <button
              type="button"
              onClick={() => setEngineFilter("sway")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                engineFilter === "sway"
                  ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Sway (8)
            </button>
            <button
              type="button"
              onClick={() => setEngineFilter("davo")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                engineFilter === "davo"
                  ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Davo (5)
            </button>
          </div>
        </div>

        {/* Component Cards Grid */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 min-[1900px]:grid-cols-5">
          {filteredComponents.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectComponent(item.id)}
              className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-600 cursor-pointer"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                    {item.category}
                  </span>
                  <span className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[9px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-zinc-950 group-hover:text-zinc-900 dark:text-white dark:group-hover:text-zinc-100 flex items-center justify-between">
                  <span>{item.name}</span>
                  <ChevronRight size={14} className="text-zinc-300 group-hover:text-zinc-700 dark:text-zinc-600 dark:group-hover:text-zinc-300 transition-transform group-hover:translate-x-0.5" />
                </h3>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {item.shortDesc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>{item.props.length} props</span>
                <span className="uppercase text-[10px]">
                  {item.engine === "both" ? "Dual" : item.engine === "davo" ? "GSAP" : "Motion"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// GETTING STARTED VIEW
// ============================================================================
function GettingStartedView({
  copyInstallCommand,
  copiedCode,
  onExplore,
}: {
  copyInstallCommand: () => void;
  copiedCode: boolean;
  onExplore: () => void;
}) {
  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          Installation & Architectural Guide
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          How to integrate @gonza/ui-components into your React 19 application.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-900 text-[11px] font-mono font-medium text-white dark:bg-white dark:text-zinc-950">
            01
          </span>
          <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
            Peer Dependencies
          </h3>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Motion 12 for spring physics, GSAP 3 for FLIP bounding math, and Lucide for iconography.
        </p>
        <div className="rounded-xl bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300">
          <div className="flex items-center justify-between">
            <code>pnpm add motion gsap lucide-react clsx tailwind-merge</code>
            <button
              onClick={copyInstallCommand}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white cursor-pointer"
            >
              {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copiedCode ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-900 text-[11px] font-mono font-medium text-white dark:bg-white dark:text-zinc-950">
            02
          </span>
          <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
            Dual-Engine Strategy
          </h3>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Modern web applications require two complementary animation models:
        </p>
        <div className="grid gap-3 sm:grid-cols-2 mt-2">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
            <h4 className="text-xs font-mono font-semibold text-zinc-900 dark:text-white uppercase">
              Micro-interactions (Sway)
            </h4>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Ideal for tabs, drawers, popovers, and controls where user gestures can interrupt animation mid-flight.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
            <h4 className="text-xs font-mono font-semibold text-zinc-900 dark:text-white uppercase">
              Theatrical Dialogs (Davo)
            </h4>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Ideal for dialogs, zoom lightboxes, and action sheets where native HTML5 &lt;dialog&gt; top-layer isolation is required.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onExplore}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 cursor-pointer shadow-xs transition-colors"
        >
          <span>Browse All 19 Primitives</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
