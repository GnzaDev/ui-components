import { useMemo, useRef, useState } from "react";
import { GonzaModal, GonzaModalTrigger } from "../GonzaModal";
import { DavoModal } from "../DavoModal";
import {
  Sparkles,
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
  Zap,
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
    engine?: "both" | "gonza" | "davo";
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
      { id: "popover", label: "GonzaPopover", badge: "Dual", engine: "both" },
      { id: "core-primitives", label: "Modal Benchmark", engine: "both" },
    ],
  },
  {
    title: "Navigation & Controls",
    items: [
      { id: "morph-tabs", label: "MorphTabs", badge: "Spring", engine: "gonza" },
      { id: "sortable-list", label: "SortableSpringList", badge: "Drag", engine: "gonza" },
      { id: "command-palette", label: "CommandPalette", engine: "gonza" },
    ],
  },
  {
    title: "Overlays & Drawers",
    items: [
      { id: "side-sheet", label: "SideSheet (Cart)", engine: "gonza" },
      { id: "action-sheet", label: "DavoActionSheet", badge: "GSAP", engine: "davo" },
      { id: "nested-modal", label: "NestedModal", engine: "gonza" },
      { id: "confirm-dialog", label: "ConfirmDialog", engine: "gonza" },
    ],
  },
  {
    title: "Cards & Media",
    items: [
      { id: "expandable-card", label: "GonzaCard (Feed)", engine: "gonza" },
      { id: "project-modal", label: "ProjectCardModal", badge: "GSAP", engine: "davo" },
      { id: "lightbox", label: "FlipLightbox", badge: "Zoom", engine: "davo" },
    ],
  },
  {
    title: "Feedback & Lab",
    items: [
      { id: "floating-action-bar", label: "FloatingActionBar", badge: "Toolbar", engine: "gonza" },
      { id: "toast", label: "FlipToast", engine: "gonza" },
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
  const [gonzaOpen, setGonzaOpen] = useState(false);
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Mobile Top Bar */}
      <div className="mb-6 flex items-center justify-between border-b border-zinc-200/80 pb-4 lg:hidden dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
        >
          {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          <span>Documentation Index</span>
        </button>

        <span className="rounded-md bg-zinc-100 px-2 py-1 text-[11px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
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
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Navigation
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X size={18} />
            </button>
          </div>

          <div className="sticky top-6 space-y-6 max-h-[calc(100vh-3rem)] overflow-y-auto pr-2 custom-scrollbar">
            {/* Search Input */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter components..."
                className="w-full rounded-xl border border-zinc-200/80 bg-zinc-50/80 py-2 pl-8 pr-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-white dark:focus:border-zinc-700"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Navigation Sections */}
            <div className="space-y-5">
              {filteredCategories.map((cat) => (
                <div key={cat.title} className="space-y-1.5">
                  <h4 className="px-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
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
                          className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                            isActive
                              ? "bg-zinc-900 text-white font-semibold shadow-xs dark:bg-white dark:text-zinc-950"
                              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-white"
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-tight ${
                                isActive
                                  ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-950"
                                  : item.engine === "both"
                                  ? "bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300"
                                  : item.engine === "davo"
                                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300"
                                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
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
            <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-semibold text-zinc-900 dark:text-white">
                  Motion 12 + GSAP 3
                </span>
              </div>
              <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Dual-engine primitives built for React 19 and Tailwind CSS v4.
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
              setGonzaOpen={setGonzaOpen}
              setDavoOpen={setDavoOpen}
              davoTriggerRef={davoTriggerRef}
            />
          )}
        </main>
      </div>

      {/* Global Benchmark Modals */}
      <GonzaModal
        open={gonzaOpen}
        onClose={() => setGonzaOpen(false)}
        layoutId="benchmark-gonza-modal"
        title="GonzaModal (Motion Spring)"
        footer={
          <div className="flex justify-end">
            <button
              onClick={() => setGonzaOpen(false)}
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
      </GonzaModal>

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
  setGonzaOpen,
  setDavoOpen,
  davoTriggerRef,
}: {
  doc: ComponentDoc;
  prevDoc: ComponentDoc | null;
  nextDoc: ComponentDoc | null;
  onNavigate: (id: NavItem) => void;
  setGonzaOpen: (open: boolean) => void;
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
              <GonzaModalTrigger
                layoutId="benchmark-gonza-modal"
                onClick={() => setGonzaOpen(true)}
                className="text-xs"
              >
                <span>Trigger GonzaModal</span>
                <ArrowRight size={13} />
              </GonzaModalTrigger>
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
    <div className="space-y-8">
      {/* Breadcrumbs & Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-400">
          <button
            onClick={() => onNavigate("all")}
            className="hover:text-zinc-900 dark:hover:text-white cursor-pointer"
          >
            Components
          </button>
          <span>/</span>
          <span>{doc.category}</span>
          <span>/</span>
          <span className="text-zinc-900 dark:text-white font-bold">{doc.name}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            {doc.name}
          </h1>
          <span
            className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
              doc.engine === "both"
                ? "bg-violet-100 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300"
                : doc.engine === "davo"
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300"
                : "bg-orange-100 text-orange-700 dark:bg-orange-950/80 dark:text-orange-300"
            }`}
          >
            {doc.engineLabel}
          </span>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          {doc.description}
        </p>
      </div>

      {/* Interactive Sandbox Card */}
      <div className="rounded-3xl border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 relative">
        {/* Canvas Toolbar */}
        <div className="flex items-center justify-between border-b border-zinc-200/80 bg-zinc-50/70 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-900/60 rounded-t-3xl">
          <div className="flex items-center rounded-xl border border-zinc-200 bg-white p-0.5 text-xs font-semibold dark:border-zinc-700 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                tab === "preview"
                  ? "bg-zinc-900 text-white shadow-xs dark:bg-white dark:text-zinc-950"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <Eye size={13} />
              <span>Interactive Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("code")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                tab === "code"
                  ? "bg-zinc-900 text-white shadow-xs dark:bg-white dark:text-zinc-950"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <Code2 size={13} />
              <span>React Code</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {tab === "code" && (
              <button
                type="button"
                onClick={copyCode}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
              >
                {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                <span>{copied ? "Copied" : "Copy Code"}</span>
              </button>
            )}
            <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
              React 19 • Tailwind v4
            </span>
          </div>
        </div>

        {/* Canvas Body */}
        {tab === "preview" ? (
          <div className="p-6 sm:p-10 min-h-[460px] flex items-center justify-center bg-zinc-50/40 dark:bg-zinc-950/20 rounded-b-3xl">
            <div className="w-full max-w-2xl">{renderExampleWidget()}</div>
          </div>
        ) : (
          <div className="bg-zinc-950 p-6 overflow-x-auto rounded-b-3xl">
            <pre className="font-mono text-xs leading-relaxed text-zinc-200">
              <code>{doc.code}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Physics Callout */}
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-amber-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
            Animation Mechanics: {doc.physics.concept}
          </h3>
        </div>
        <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          {doc.physics.details}
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-1.5 text-[11px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          <span>Engine Applied:</span>
          <span className="font-mono text-indigo-600 dark:text-indigo-400">
            {doc.physics.engine}
          </span>
        </div>
      </div>

      {/* Props Table */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            Component API & Props
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            TypeScript definitions and default values supported by this primitive.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200/80 bg-zinc-50/70 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Prop</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Default</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800">
                {doc.props.map((p) => (
                  <tr key={p.name} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                    <td className="px-4 py-3 font-mono font-bold text-zinc-900 dark:text-white">
                      {p.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-indigo-600 dark:text-indigo-400">
                      {p.type}
                    </td>
                    <td className="px-4 py-3 font-mono text-zinc-500 dark:text-zinc-400">
                      {p.defaultVal || "—"}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
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
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-900 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <div className="text-left">
              <span className="block text-[10px] uppercase text-zinc-400 font-bold">Previous</span>
              <span>{prevDoc.name}</span>
            </div>
          </button>
        ) : <div />}

        {nextDoc ? (
          <button
            type="button"
            onClick={() => onNavigate(nextDoc.id)}
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-900 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 cursor-pointer text-right"
          >
            <div className="text-right">
              <span className="block text-[10px] uppercase text-zinc-400 font-bold">Next</span>
              <span>{nextDoc.name}</span>
            </div>
            <ArrowRight size={14} />
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
  const [engineFilter, setEngineFilter] = useState<"all" | "both" | "gonza" | "davo">("all");

  const filteredComponents = useMemo(() => {
    if (engineFilter === "all") return COMPONENTS_DATA;
    return COMPONENTS_DATA.filter((c) => c.engine === engineFilter);
  }, [engineFilter]);

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-xs sm:p-10 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3.5 py-1 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            <Sparkles size={13} className="text-orange-500" />
            <span>Production-Ready Animated UI Library</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
            Dual-Engine Interactive UI Primitives
          </h1>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Engineered with <strong>Motion Spring Dynamics</strong> and <strong>GSAP FLIP Matrix Mathematics</strong>. Built natively for React 19, strict TypeScript, and Tailwind CSS v4. Copy-paste ready with zero external UI framework bloat.
          </p>

          {/* Quick Install Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 font-mono text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <Terminal size={14} className="text-zinc-400" />
              <span>pnpm add motion gsap lucide-react</span>
              <button
                type="button"
                onClick={copyInstallCommand}
                className="rounded-md p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-800 dark:hover:bg-zinc-700 dark:hover:text-white cursor-pointer ml-1"
                title="Copy command"
              >
                {copiedCode ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>19 Primitives</span>
              <span>•</span>
              <span>2 Physics Engines</span>
              <span>•</span>
              <span>100% Type-Safe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Engine Comparison */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-orange-200/70 bg-gradient-to-br from-orange-50/40 to-amber-50/20 p-6 dark:border-orange-950/60 dark:bg-orange-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Gonza Engine (Motion 12)
            </span>
            <span className="rounded-lg bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-900/60 dark:text-orange-300">
              Euler-Newton Dynamics
            </span>
          </div>
          <h3 className="mt-2 text-base font-bold text-zinc-900 dark:text-white">
            Physics-Based Springs & Layout Projection
          </h3>
          <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Uses physical parameters (stiffness, damping, mass) and layoutId. Gestures and interruptions preserve momentum naturally without abrupt timeline snapping.
          </p>
        </div>

        <div className="rounded-3xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/40 to-violet-50/20 p-6 dark:border-indigo-950/60 dark:bg-indigo-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Davo Engine (GSAP 3)
            </span>
            <span className="rounded-lg bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
              FLIP Matrix Projection
            </span>
          </div>
          <h3 className="mt-2 text-base font-bold text-zinc-900 dark:text-white">
            FLIP Coordinates & Custom Bezier Easing
          </h3>
          <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            First-Last-Invert-Play matrix mathematics on native HTML5 &lt;dialog&gt;. Calibrated with Davo's signature PRETTY_EASE curves and optical bloom filters.
          </p>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Component Primitives Catalog
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Select any component to inspect its live preview sandbox, props table, and implementation guide.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center rounded-2xl border border-zinc-200 bg-zinc-100/80 p-1 text-xs font-semibold dark:border-zinc-800 dark:bg-zinc-800/80">
            <button
              type="button"
              onClick={() => setEngineFilter("all")}
              className={`rounded-xl px-3 py-1.5 transition-all cursor-pointer ${
                engineFilter === "all"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              All (19)
            </button>
            <button
              type="button"
              onClick={() => setEngineFilter("both")}
              className={`rounded-xl px-3 py-1.5 transition-all cursor-pointer ${
                engineFilter === "both"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Dual-Engine (6)
            </button>
            <button
              type="button"
              onClick={() => setEngineFilter("gonza")}
              className={`rounded-xl px-3 py-1.5 transition-all cursor-pointer ${
                engineFilter === "gonza"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Motion (8)
            </button>
            <button
              type="button"
              onClick={() => setEngineFilter("davo")}
              className={`rounded-xl px-3 py-1.5 transition-all cursor-pointer ${
                engineFilter === "davo"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              GSAP (5)
            </button>
          </div>
        </div>

        {/* Uniform Grid of Cards */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {filteredComponents.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    {item.category}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-tight ${
                      item.engine === "both"
                        ? "bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300"
                        : item.engine === "davo"
                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300"
                        : "bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-bold text-zinc-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.name}
                </h3>
                <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                  {item.shortDesc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                <span className="text-[11px] font-medium text-zinc-400">
                  {item.props.length} configurable props
                </span>
                <button
                  type="button"
                  onClick={() => onSelectComponent(item.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-800 group-hover:bg-zinc-900 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-200 dark:group-hover:bg-white dark:group-hover:text-zinc-950 transition-all cursor-pointer"
                >
                  <span>Docs & Demo</span>
                  <ChevronRight size={13} />
                </button>
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
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          Installation & Architectural Guide
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          How to configure and integrate @gonza/ui-components into your React 19 application.
        </p>
      </div>

      <div className="space-y-3 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-950">
            1
          </span>
          <h3 className="text-base font-bold text-zinc-950 dark:text-white">
            Install Peer Dependencies
          </h3>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          The primitives require Motion 12 for spring physics, GSAP 3 for FLIP bounding math, and Lucide for vector iconography.
        </p>
        <div className="relative mt-2 rounded-2xl bg-zinc-950 p-4 font-mono text-xs text-zinc-300">
          <div className="flex items-center justify-between">
            <code>pnpm add motion gsap lucide-react clsx tailwind-merge</code>
            <button
              onClick={copyInstallCommand}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-white cursor-pointer"
            >
              {copiedCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copiedCode ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-950">
            2
          </span>
          <h3 className="text-base font-bold text-zinc-950 dark:text-white">
            Architecture: Why Dual Engine?
          </h3>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Modern web applications have two distinct animation requirements that cannot be satisfied by one single tool:
        </p>
        <div className="grid gap-4 sm:grid-cols-2 mt-2">
          <div className="rounded-2xl border border-orange-200/70 bg-orange-50/40 p-4 dark:border-orange-900/40 dark:bg-orange-950/20">
            <h4 className="text-xs font-bold text-orange-700 dark:text-orange-300 uppercase">
              Micro-interactions & Continuous State (Motion)
            </h4>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Ideal for tabs, drawers, popovers, and segmented controls where user gestures can interrupt the animation mid-flight.
            </p>
          </div>
          <div className="rounded-2xl border border-indigo-200/70 bg-indigo-50/40 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
            <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase">
              Theatrical & Native Dialogs (GSAP FLIP)
            </h4>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Ideal for full dialogs, zoom lightboxes, and action sheets where HTML5 &lt;dialog&gt; top-layer isolation and precise bezier curves are required.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onExplore}
          className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-6 py-3 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 cursor-pointer shadow-sm"
        >
          <span>Browse All 15 Primitives</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
