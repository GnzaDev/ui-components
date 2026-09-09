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
  FamilyDialogExample,
} from "./examples";
import {
  COMPONENTS_DATA,
  type ComponentDoc,
  type NavItem,
} from "./componentsData";
import { useScrollLock } from "../utils/useScrollLock";

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
      { id: "all", label: "Component Catalog", badge: "20" },
      { id: "getting-started", label: "Installation & Guide" },
    ],
  },
  {
    title: "Dual-Engine Primitives",
    items: [
      { id: "family-dialog", label: "FamilyDialog", badge: "Morph", engine: "both" },
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

  useScrollLock(mobileMenuOpen);

  // Quick modals for Core Primitives Benchmark
  const [swayOpen, setSwayOpen] = useState(false);
  const [davoOpen, setDavoOpen] = useState(false);
  const davoTriggerRef = useRef<HTMLButtonElement>(null);

  const copyInstallCommand = () => {
    navigator.clipboard.writeText("pnpm add github:GnzaDev/ui-components motion gsap lucide-react clsx tailwind-merge");
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
    <div className="w-full">
      {/* Mobile Top Bar */}
      <div className="flex items-center justify-between border-b border-zinc-200/80 px-6 py-3 lg:hidden dark:border-zinc-800">
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

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Grid: Fixed Sidebar on Desktop + Content */}
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 bg-white/95 p-6 backdrop-blur-xl transition-transform dark:bg-zinc-950/95 lg:fixed lg:top-14 lg:bottom-0 lg:left-0 lg:z-20 lg:w-64 lg:border-r lg:border-zinc-200/80 lg:bg-zinc-50/40 lg:p-0 lg:shadow-none lg:transition-none lg:backdrop-blur-none lg:dark:border-zinc-800/80 lg:dark:bg-zinc-950/40 ${
            mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="mb-4 flex items-center justify-between p-6 pb-0 lg:hidden">
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

          <div className="h-full overflow-y-auto p-6 space-y-6">
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
            <div className="space-y-2">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="font-mono text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                    Sway UI • by Gonza
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Librería y motor Sway creados por Gonza. Primitivas con Motion 12 y GSAP 3.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200/80 bg-white p-3 text-[11px] dark:border-zinc-800 dark:bg-zinc-900/40">
                <span className="font-mono text-[10px] uppercase font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
                  Inspiración y Referencia
                </span>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Modales con estilo FLIP inspirados en{" "}
                  <a
                    href="https://github.com/srdavo/pretty-modal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-zinc-900 dark:text-zinc-200 underline hover:text-zinc-950 dark:hover:text-white"
                  >
                    pretty-modal
                  </a>{" "}
                  por{" "}
                  <a
                    href="https://github.com/srdavo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-zinc-900 dark:text-zinc-200 underline hover:text-zinc-950 dark:hover:text-white"
                  >
                    srdavo
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="min-w-0 flex-1 lg:pl-64">
          <div className="px-6 py-6 lg:px-10 lg:py-8 pb-16">
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
          </div>

          {/* Page Footer with open-source credits and attribution */}
          <ShowcaseFooter />
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
          <div className="flex items-center justify-between w-full">
            <a
              href="https://github.com/srdavo/pretty-modal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white underline"
            >
              Source: srdavo/pretty-modal ↗
            </a>
            <button
              onClick={() => setDavoOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Close
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            This modal uses the native HTML5 &lt;dialog&gt; top-layer element combined with GSAP Flip matrix math and theatrical PRETTY_EASE curves.
          </p>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
            Source code and modal animation from{" "}
            <a
              href="https://github.com/srdavo/pretty-modal"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono font-medium text-zinc-900 dark:text-zinc-100 underline"
            >
              srdavo/pretty-modal
            </a>{" "}
            by{" "}
            <a
              href="https://github.com/srdavo"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-900 dark:text-zinc-100 underline"
            >
              srdavo
            </a>.
          </div>
        </div>
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
      case "family-dialog":
        return <FamilyDialogExample />;
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

        {doc.id === "family-dialog" ? (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-indigo-200/70 bg-indigo-50/50 px-3.5 py-2 text-xs text-indigo-950 dark:border-indigo-900/40 dark:bg-indigo-950/20 dark:text-indigo-200">
            <span className="font-mono text-[10px] uppercase font-semibold text-indigo-600 dark:text-indigo-400">
              Inspiración de Diseño
            </span>
            <span className="text-indigo-300 dark:text-indigo-700">•</span>
            <span>
              Patrón interactivo de morphing inspirado en la app{" "}
              <a
                href="https://family.co"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-indigo-900 dark:text-indigo-100 underline hover:text-indigo-950 dark:hover:text-white"
              >
                Family (family.co)
              </a>{" "}
              y popularizado por{" "}
              <a
                href="https://animations.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-indigo-900 dark:text-indigo-100 underline hover:text-indigo-950 dark:hover:text-white"
              >
                Emil Kowalski (animations.dev)
              </a>
              . Utiliza View Transition API o resortes Motion (no utiliza el motor de Davo).
            </span>
          </div>
        ) : (doc.engine === "davo" || doc.engine === "both") ? (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200/80 bg-zinc-50/80 px-3.5 py-2 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
            <span className="font-mono text-[10px] uppercase font-semibold text-zinc-500 dark:text-zinc-400">
              Source Attribution
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span>
              Modal architecture &amp; FLIP animation based on{" "}
              <a
                href="https://github.com/srdavo/pretty-modal"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-zinc-900 dark:text-zinc-200 underline hover:text-zinc-950 dark:hover:text-white"
              >
                pretty-modal
              </a>{" "}
              by{" "}
              <a
                href="https://github.com/srdavo"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-zinc-900 dark:text-zinc-200 underline hover:text-zinc-950 dark:hover:text-white"
              >
                srdavo
              </a>
            </span>
          </div>
        ) : null}
      </div>

      {/* Interactive Sandbox Card */}
      <div className={`rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 ${tab === "code" ? "overflow-hidden" : ""}`}>
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
              <span>BY GONZA</span>
              <span>•</span>
              <span>SWAY ENGINE</span>
              <span>•</span>
              <span>20 PRIMITIVES</span>
              <span>•</span>
              <span>REACT 19</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              Sway UI Component System
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Creado y desarrollado por <span className="text-zinc-900 dark:text-zinc-100 font-semibold">Gonza</span> con el motor <span className="text-zinc-900 dark:text-zinc-100 font-medium">Sway (Motion)</span> para dinámicas de resortes. Se incluyen también variantes de modales inspiradas en el estilo de <a href="https://github.com/srdavo/pretty-modal" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-900 dark:hover:text-white">srdavo</a> a modo de ejemplos interactivos para comparar y evaluar directamente las diferencias de física y comportamiento entre ambos enfoques.
            </p>
          </div>

          {/* Quick Install */}
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 font-mono text-xs text-zinc-700 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <Terminal size={13} className="text-zinc-400" />
            <span className="truncate max-w-[280px] sm:max-w-none">pnpm add github:GnzaDev/ui-components motion gsap</span>
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
              CORE ENGINE // SWAY (BY GONZA)
            </span>
            <span className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-mono text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400">
              Motion 12
            </span>
          </div>
          <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
            Euler-Newton Spring Dynamics (Sway)
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Motor propio desarrollado por Gonza con Motion 12. Momentum continuo y proyección declarativa con <code className="text-zinc-700 dark:text-zinc-300">layoutId</code>. Interrupciones y gestos fluidos sin timeline snapping.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
              FLIP ENGINE // INSPIRACIÓN Y REFERENCIA
            </span>
            <span className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-mono text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400">
              GSAP 3 FLIP
            </span>
          </div>
          <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
            FLIP Matrix Projection & Native &lt;dialog&gt;
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Variante modal adaptada por Gonza con GSAP FLIP y curvas <code className="text-zinc-700 dark:text-zinc-300">PRETTY_EASE</code>, tomando como referencia técnica e inspiración visual el trabajo de srdavo.
          </p>
          <div className="mt-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">
              Inspiración y referencia:{" "}
              <a
                href="https://github.com/srdavo/pretty-modal"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-zinc-800 dark:text-zinc-200 underline decoration-zinc-300 dark:decoration-zinc-700 hover:text-zinc-950 dark:hover:text-white"
              >
                pretty-modal
              </a>{" "}
              por{" "}
              <a
                href="https://github.com/srdavo"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-zinc-800 dark:text-zinc-200 underline hover:text-zinc-950 dark:hover:text-white"
              >
                srdavo
              </a>
            </span>
            <a
              href="https://github.com/srdavo/pretty-modal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              GitHub ↗
            </a>
          </div>
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
              All (20)
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
              Dual-Engine (7)
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
                  {item.engine === "both" ? "Dual" : item.engine === "davo" ? "Davo (GSAP)" : "Sway (Motion)"}
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
  onExplore,
}: {
  copyInstallCommand: () => void;
  copiedCode: boolean;
  onExplore: () => void;
}) {
  const [packageManager, setPackageManager] = useState<"pnpm" | "npm" | "yarn" | "bun">("pnpm");
  const [tailwindVersion, setTailwindVersion] = useState<"v4" | "v3">("v4");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 1500);
  };

  const installCommands: Record<string, string> = {
    pnpm: "pnpm add github:GnzaDev/ui-components motion gsap lucide-react clsx tailwind-merge",
    npm: "npm install github:GnzaDev/ui-components motion gsap lucide-react clsx tailwind-merge",
    yarn: "yarn add github:GnzaDev/ui-components motion gsap lucide-react clsx tailwind-merge",
    bun: "bun add github:GnzaDev/ui-components motion gsap lucide-react clsx tailwind-merge",
  };

  const tailwindConfigs: Record<string, string> = {
    v4: `@import "tailwindcss";\n@source "../node_modules/@gonza/ui-components";`,
    v3: `// tailwind.config.js\nmodule.exports = {\n  content: [\n    "./index.html",\n    "./src/**/*.{js,ts,jsx,tsx}",\n    "./node_modules/@gonza/ui-components/**/*.{js,ts,jsx,tsx}",\n  ],\n};`,
  };

  const quickstartExample = `import { useState, useRef } from "react";
import { SwayModal, SwayModalTrigger, DavoModal } from "@gonza/ui-components";
import "@gonza/ui-components/styles.css";

export function ExampleApp() {
  const [swayOpen, setSwayOpen] = useState(false);
  const [davoOpen, setDavoOpen] = useState(false);
  const davoTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex gap-4 p-8">
      {/* 1. Modal con Sway Engine (Motion springs) */}
      <SwayModalTrigger layoutId="demo-modal" onClick={() => setSwayOpen(true)}>
        Abrir Sway Modal
      </SwayModalTrigger>
      <SwayModal open={swayOpen} onClose={() => setSwayOpen(false)} layoutId="demo-modal" title="Sway Modal">
        <p>Animado con físicas de resortes continuas (Sway Engine).</p>
      </SwayModal>

      {/* 2. Modal con Davo Engine (GSAP FLIP) */}
      <button ref={davoTriggerRef} onClick={() => setDavoOpen(true)}>
        Abrir Davo Modal
      </button>
      <DavoModal open={davoOpen} onClose={() => setDavoOpen(false)} triggerRef={davoTriggerRef} title="Davo Modal">
        <p>Animado con proyección matricial en top-layer <dialog>.</p>
      </DavoModal>
    </div>
  );
}`;

  return (
    <div className="space-y-6 w-full max-w-4xl">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span>GUÍA TÉCNICA</span>
          <span>•</span>
          <span>REACT 19</span>
          <span>•</span>
          <span>TAILWIND CSS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          Guía de Instalación e Integración
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Paso a paso para instalar <strong className="text-zinc-900 dark:text-zinc-100">@gonza/ui-components</strong> directamente desde GitHub en cualquier proyecto React.
        </p>
      </div>

      {/* STEP 1: Package installation */}
      <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-900 text-[11px] font-mono font-medium text-white dark:bg-white dark:text-zinc-950">
              01
            </span>
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
              Instalar librería y dependencias peer
            </h3>
          </div>

          {/* Package Manager Selector Tabs */}
          <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100/80 p-0.5 text-xs dark:border-zinc-800 dark:bg-zinc-800">
            {(["pnpm", "npm", "yarn", "bun"] as const).map((pm) => (
              <button
                key={pm}
                type="button"
                onClick={() => setPackageManager(pm)}
                className={`rounded-md px-2.5 py-0.5 font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                  packageManager === pm
                    ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                {pm}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Instala el paquete directamente desde GitHub junto con Motion 12, GSAP 3 y Lucide React:
        </p>

        <div className="rounded-xl bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300">
          <div className="flex items-center justify-between gap-2">
            <code className="truncate">{installCommands[packageManager]}</code>
            <button
              onClick={() => copyText(installCommands[packageManager], "pm")}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white cursor-pointer shrink-0"
              title="Copiar comando"
            >
              {copiedSection === "pm" ? (
                <Check size={12} className="text-emerald-400" />
              ) : (
                <Copy size={12} />
              )}
              <span>{copiedSection === "pm" ? "Copiado" : "Copiar"}</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 leading-relaxed">
          💡 <strong>¿Cómo funciona?</strong> No requiere que la librería esté publicada en npm. Tu gestor de paquetes clona el repositorio y ejecuta el ciclo <code className="font-mono text-zinc-700 dark:text-zinc-300">prepare</code>, compilando los bundles ESM y definiciones de TypeScript en tu máquina.
        </div>

        {/* Callout: Para instalar el modal de Davo usar su repo */}
        <div className="rounded-xl border border-amber-200/70 bg-amber-50/50 p-3.5 text-xs text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-semibold text-xs flex items-center gap-1.5">
              <span>📦</span>
              <span>¿Querés usar o instalar únicamente el modal original de Davo?</span>
            </span>
            <a
              href="https://github.com/srdavo/pretty-modal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono underline hover:text-amber-800 dark:hover:text-amber-100 shrink-0"
            >
              srdavo/pretty-modal ↗
            </a>
          </div>
          <p className="text-[11px] text-amber-900/80 dark:text-amber-300/80 leading-relaxed mb-2">
            Si lo que buscás es usar e instalar el modal original e independiente creado por Davo (sin la suite Sway UI), podés clonar o agregar directamente su repositorio oficial:
          </p>
          <div className="flex items-center justify-between rounded-lg bg-zinc-950 p-2.5 font-mono text-[11px] text-zinc-200">
            <code className="truncate">pnpm add github:srdavo/pretty-modal</code>
            <button
              onClick={() => copyText("pnpm add github:srdavo/pretty-modal", "davo-repo")}
              className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white cursor-pointer ml-2 shrink-0"
              title="Copiar comando de Davo"
            >
              {copiedSection === "davo-repo" ? (
                <Check size={11} className="text-emerald-400" />
              ) : (
                <Copy size={11} />
              )}
              <span>{copiedSection === "davo-repo" ? "Copiado" : "Copiar"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* STEP 2: Stylesheet import */}
      <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-900 text-[11px] font-mono font-medium text-white dark:bg-white dark:text-zinc-950">
            02
          </span>
          <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
            Importar la hoja de estilos de animación
          </h3>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          En el punto de entrada de tu aplicación (<code className="font-mono text-zinc-700 dark:text-zinc-300">main.tsx</code>, <code className="font-mono text-zinc-700 dark:text-zinc-300">App.tsx</code> o <code className="font-mono text-zinc-700 dark:text-zinc-300">layout.tsx</code> en Next.js), importa los estilos compilados:
        </p>

        <div className="rounded-xl bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300">
          <div className="flex items-center justify-between">
            <code>import &quot;@gonza/ui-components/styles.css&quot;;</code>
            <button
              onClick={() => copyText('import "@gonza/ui-components/styles.css";', "css")}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white cursor-pointer"
              title="Copiar importación"
            >
              {copiedSection === "css" ? (
                <Check size={12} className="text-emerald-400" />
              ) : (
                <Copy size={12} />
              )}
              <span>{copiedSection === "css" ? "Copiado" : "Copiar"}</span>
            </button>
          </div>
        </div>

        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Este archivo incluye los keyframes de desenfoque óptico, estilos del backdrop para <code className="font-mono text-zinc-700 dark:text-zinc-300">&lt;dialog&gt;</code> nativo y las transiciones FLIP.
        </p>
      </div>

      {/* STEP 3: Tailwind Setup */}
      <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-900 text-[11px] font-mono font-medium text-white dark:bg-white dark:text-zinc-950">
              03
            </span>
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
              Configurar Tailwind CSS
            </h3>
          </div>

          <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100/80 p-0.5 text-xs dark:border-zinc-800 dark:bg-zinc-800">
            {(["v4", "v3"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setTailwindVersion(v)}
                className={`rounded-md px-2.5 py-0.5 font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                  tailwindVersion === v
                    ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                Tailwind {v}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Para que Tailwind procese las clases utilitarias de la librería en tu proyecto:
        </p>

        <div className="rounded-xl bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300">
          <div className="flex items-start justify-between">
            <pre className="overflow-x-auto leading-relaxed">
              <code>{tailwindConfigs[tailwindVersion]}</code>
            </pre>
            <button
              onClick={() => copyText(tailwindConfigs[tailwindVersion], "tailwind")}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white cursor-pointer shrink-0 ml-2"
              title="Copiar configuración"
            >
              {copiedSection === "tailwind" ? (
                <Check size={12} className="text-emerald-400" />
              ) : (
                <Copy size={12} />
              )}
              <span>{copiedSection === "tailwind" ? "Copiado" : "Copiar"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* STEP 4: Dual Engine Architecture */}
      <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-900 text-[11px] font-mono font-medium text-white dark:bg-white dark:text-zinc-950">
            04
          </span>
          <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
            Estrategia de Motores: Sway vs Davo
          </h3>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          La librería ofrece dos motores de animación que podés usar según el tipo de componente:
        </p>
        <div className="grid gap-3 sm:grid-cols-2 mt-2">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
            <h4 className="text-xs font-mono font-semibold text-zinc-900 dark:text-white uppercase">
              Motor Sway (por Gonza) • 100% Motion
            </h4>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Físicas elásticas continuas construidas al 100% con Motion 12 (cero GSAP). Ideal para tabs, drawers, popovers y modales reactivos donde el usuario puede interrumpir la animación en vuelo.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
            <h4 className="text-xs font-mono font-semibold text-zinc-900 dark:text-white uppercase">
              Motor Davo (Inspiración FLIP)
            </h4>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Aislamiento en top-layer con elemento nativo &lt;dialog&gt; y proyección matricial GSAP FLIP. Inspirado en el repositorio público <a href="https://github.com/srdavo/pretty-modal" target="_blank" rel="noopener noreferrer" className="font-mono text-zinc-800 dark:text-zinc-200 underline hover:text-zinc-950 dark:hover:text-white">pretty-modal</a> de <a href="https://github.com/srdavo" target="_blank" rel="noopener noreferrer" className="font-semibold text-zinc-800 dark:text-zinc-200 underline hover:text-zinc-950 dark:hover:text-white">srdavo</a>.
            </p>
            <p className="mt-2.5 text-[11px] text-zinc-600 dark:text-zinc-400 border-t border-zinc-200/60 dark:border-zinc-700/50 pt-2 leading-relaxed">
              Para instalar únicamente el modal original de Davo, utilizá su repo oficial: <code className="font-mono text-[10px] bg-zinc-200/70 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-800 dark:text-zinc-200">github:srdavo/pretty-modal</code>.
            </p>
          </div>
        </div>
      </div>

      {/* STEP 5: Quickstart code snippet */}
      <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-900 text-[11px] font-mono font-medium text-white dark:bg-white dark:text-zinc-950">
              05
            </span>
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
              Ejemplo de Inicio Rápido (Quickstart)
            </h3>
          </div>

          <button
            onClick={() => copyText(quickstartExample, "example")}
            className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
            title="Copiar código de ejemplo"
          >
            {copiedSection === "example" ? (
              <Check size={12} className="text-emerald-500" />
            ) : (
              <Copy size={12} />
            )}
            <span>{copiedSection === "example" ? "Copiado" : "Copiar código"}</span>
          </button>
        </div>

        <div className="rounded-xl bg-zinc-950 p-4 font-mono text-xs text-zinc-200 overflow-x-auto">
          <pre className="leading-relaxed">
            <code>{quickstartExample}</code>
          </pre>
        </div>
      </div>

      {/* Explore catalog button */}
      <div className="pt-2">
        <button
          onClick={onExplore}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 cursor-pointer shadow-xs transition-colors"
        >
          <span>Explorar los 20 componentes en el catálogo</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// SHOWCASE FOOTER & OPEN-SOURCE ATTRIBUTION
// ============================================================================
function ShowcaseFooter() {
  return (
    <footer className="mt-12 border-t border-zinc-200/80 bg-white/70 px-6 py-10 dark:border-zinc-800/80 dark:bg-zinc-950/60 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Column 1: Library Info & Author */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-zinc-900 dark:bg-white" />
              <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Sway UI
              </span>
              <span className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400">
                Creado por Gonza
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Librería de componentes y animaciones creada y desarrollada por <strong>Gonza</strong>. Impulsada por el motor propio <strong>Sway (Motion)</strong> para dinámicas elásticas y físicas de resortes continuas.
            </p>
            <p className="font-mono text-[11px] text-zinc-400">
              React 19 • Tailwind CSS • Motion 12
            </p>
          </div>

          {/* Column 2: Inspiration & Reference */}
          <div className="space-y-2 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
            <span className="font-mono text-[10px] uppercase font-semibold text-zinc-600 dark:text-zinc-300 block">
              Inspiración y Referencia // Davo
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Gonza implementó y modificó los modales con resortes y componentes de Motion. Se da crédito especial a{" "}
              <a
                href="https://github.com/srdavo"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-zinc-900 underline dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white"
              >
                srdavo (David)
              </a>{" "}
              por la inspiración en su estilo visual y por usar su repositorio público{" "}
              <a
                href="https://github.com/srdavo/pretty-modal"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-zinc-900 underline dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white"
              >
                pretty-modal
              </a>{" "}
              como referencia técnica para los diálogos con matriz FLIP. Dichos componentes se presentan aquí como ejemplos interactivos para contrastar y apreciar en vivo las diferencias con el motor Sway.
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed pt-1.5 border-t border-zinc-200/60 dark:border-zinc-800/60">
              Sway es de autoría de Gonza. Este proyecto utiliza la referencia pública bajo licencia MIT con fines comparativos y educativos, sin relación institucional ni patrocinio privado.
            </p>
          </div>

          {/* Column 3: Direct Links */}
          <div className="space-y-3">
            <span className="font-mono text-[10px] uppercase font-semibold text-zinc-400 block">
              Enlaces &amp; Referencias
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://github.com/srdavo/pretty-modal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  <span className="font-mono text-[11px] text-zinc-400">↗</span>
                  <span>pretty-modal en GitHub (Referencia e Inspiración)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/srdavo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  <span className="font-mono text-[11px] text-zinc-400">↗</span>
                  <span>Perfil de srdavo en GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href="https://motion.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  <span className="font-mono text-[11px] text-zinc-400">↗</span>
                  <span>Motion 12 (Sway Spring Engine)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://gsap.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  <span className="font-mono text-[11px] text-zinc-400">↗</span>
                  <span>GSAP 3 FLIP &amp; CustomEase</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-zinc-200/80 pt-6 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <p>© {new Date().getFullYear()} Sway UI • Creado y desarrollado por Gonza</p>
          <p className="font-mono text-[11px] text-zinc-400">
            Referencia e inspiración modal: pretty-modal © 2026 srdavo (MIT)
          </p>
        </div>
      </div>
    </footer>
  );
}
