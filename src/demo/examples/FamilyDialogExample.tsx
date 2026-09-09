import { useState } from "react";
import { FamilyDialog, FamilyStepperDialog } from "../../FamilyDialog";
import {
  Sparkles,
  Globe,
  Coins,
  CreditCard,
  Rocket,
  ShieldAlert,
  Zap,
  CheckCircle2,
  ListOrdered,
  SquareCheck,
} from "lucide-react";

type Mode = "single-step" | "stepper";
type ScenarioKey = "receive" | "checkout" | "deploy" | "upgrade" | "delete";

interface ScenarioConfig {
  key: ScenarioKey;
  label: string;
  category: string;
  icon: typeof Coins;
  dialogTitle: string;
  dialogDescription: React.ReactNode;
  actionLabel: string;
  cancelLabel: string;
  triggerLabel: string;
  variant: "mint" | "destructive" | "indigo" | "amber";
  whyItMatters: string;
}

const SCENARIOS: ScenarioConfig[] = [
  {
    key: "receive",
    label: "Crypto / Web3 Wallet",
    category: "Financial / Assets",
    icon: Coins,
    dialogTitle: "Confirm Transfer",
    dialogDescription: "Are you sure you want to receive a load of money into your primary vault?",
    actionLabel: "Receive Funds",
    cancelLabel: "Cancel",
    triggerLabel: "Receive Funds",
    variant: "mint",
    whyItMatters: "Family.co pattern: Keeps user attention anchored on the trigger as it morphs into the confirmation button.",
  },
  {
    key: "checkout",
    label: "1-Click Checkout",
    category: "E-Commerce / Stripe",
    icon: CreditCard,
    dialogTitle: "Authorize Payment",
    dialogDescription: (
      <span>
        Charge <strong className="text-zinc-900 dark:text-white font-semibold">$129.00 USD</strong> to your card ending in <span className="font-mono text-zinc-900 dark:text-white">•••• 4242</span>?
      </span>
    ),
    actionLabel: "Pay $129.00",
    cancelLabel: "Cancel",
    triggerLabel: "Pay $129.00",
    variant: "mint",
    whyItMatters: "Frictionless checkout: Morphing the buy button into the confirmation gate cuts hesitation and drop-offs.",
  },
  {
    key: "deploy",
    label: "Production Release",
    category: "DevOps / CI-CD",
    icon: Rocket,
    dialogTitle: "Deploy to Production",
    dialogDescription: (
      <span>
        Roll out build <span className="font-mono font-medium text-indigo-600 dark:text-indigo-400">#1084 (v2.4.0)</span> to 24 edge clusters with zero-downtime?
      </span>
    ),
    actionLabel: "Deploy Now",
    cancelLabel: "Abort",
    triggerLabel: "Deploy v2.4.0",
    variant: "indigo",
    whyItMatters: "Continuous verification: Prevents accidental double clicks by physically relocating the button during expansion.",
  },
  {
    key: "upgrade",
    label: "Enterprise Upgrade",
    category: "SaaS / B2B",
    icon: Zap,
    dialogTitle: "Confirm Upgrade",
    dialogDescription: (
      <span>
        Upgrade workspace to <strong className="text-zinc-900 dark:text-white font-semibold">Enterprise Tier</strong> ($299/mo) with unlimited seats and audit logs?
      </span>
    ),
    actionLabel: "Upgrade Plan",
    cancelLabel: "Keep Free",
    triggerLabel: "Upgrade to Enterprise",
    variant: "amber",
    whyItMatters: "Organic upgrade path: Expands in-place without jarring redirects or disruptive modal popping.",
  },
  {
    key: "delete",
    label: "Critical Deletion",
    category: "Danger Zone",
    icon: ShieldAlert,
    dialogTitle: "Drop Production DB",
    dialogDescription: (
      <span>
        Permanently delete database <span className="font-mono font-medium text-rose-600 dark:text-rose-400">db-prod-east-01</span>? All 24 tables will be dropped immediately.
      </span>
    ),
    actionLabel: "Delete Database",
    cancelLabel: "Cancel",
    triggerLabel: "Delete Database",
    variant: "destructive",
    whyItMatters: "Fitts' Law friction: The button changes position and bounds, enforcing a deliberate second click.",
  },
];

export function FamilyDialogExample() {
  const [mode, setMode] = useState<Mode>("stepper");
  const [engine, setEngine] = useState<"view-transition" | "spring">("view-transition");
  const [activeScenarioKey, setActiveScenarioKey] = useState<ScenarioKey>("receive");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeScenario = SCENARIOS.find((s) => s.key === activeScenarioKey) || SCENARIOS[0];
  const IconComponent = activeScenario.icon;

  const handleActionConfirm = () => {
    setToastMessage(`✓ "${activeScenario.actionLabel}" executed!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Toolbar: Mode Switch + Engine Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Family-Style Morphing & Shared Elements
            </h3>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              {mode === "stepper" ? "Multi-Step Stepper" : "Single-Step Dialog"}
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {mode === "stepper"
              ? "Multi-step wizard where the trigger, active indicator, selected item badge, and action button all share continuous layout."
              : "Trigger button expands and morphs into the modal's primary confirmation action."}
          </p>
        </div>

        {/* Mode Selector (Single-Step vs Stepper) */}
        <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100/80 p-0.5 text-xs font-semibold dark:border-zinc-800 dark:bg-zinc-800/80">
          <button
            type="button"
            onClick={() => setMode("stepper")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
              mode === "stepper"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <ListOrdered size={13} className="text-emerald-500" />
            <span>Multi-Step Stepper</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("single-step")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
              mode === "single-step"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <SquareCheck size={13} className="text-indigo-500" />
            <span>Single-Step Dialog</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Single Step Scenario Selector */}
      {mode === "single-step" && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mr-1">
              Scenarios:
            </span>
            {SCENARIOS.map((s) => {
              const isSelected = s.key === activeScenarioKey;
              const SIcon = s.icon;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setActiveScenarioKey(s.key)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-zinc-900 text-white shadow-xs dark:bg-white dark:text-zinc-950 font-semibold"
                      : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  <SIcon size={13} className={isSelected ? "text-emerald-400 dark:text-emerald-600" : "text-zinc-400"} />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Engine Toggle for single-step */}
          <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100/80 p-0.5 text-xs font-semibold dark:border-zinc-800 dark:bg-zinc-800/80">
            <button
              type="button"
              onClick={() => setEngine("view-transition")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                engine === "view-transition"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <Globe size={11} className="text-emerald-500" />
              <span>View Transition</span>
            </button>
            <button
              type="button"
              onClick={() => setEngine("spring")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                engine === "spring"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <Sparkles size={11} className="text-indigo-500" />
              <span>Motion Spring</span>
            </button>
          </div>
        </div>
      )}

      {/* CLEAN INTERACTIVE CANVAS */}
      <div className="relative min-h-[480px] w-full rounded-2xl border border-zinc-200/80 bg-zinc-100/40 p-6 flex flex-col justify-between overflow-hidden dark:border-zinc-800 dark:bg-zinc-950/40 shadow-xs">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.05),transparent_70%)]" />

        {/* Canvas Header */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {mode === "stepper"
                ? "Interactive Multi-Step Stepper // 3 Shared Layout Anchors"
                : `${activeScenario.category} // ${activeScenario.label}`}
            </span>
          </div>

          <span className="font-mono text-[11px] text-zinc-400">
            {mode === "stepper"
              ? "Motion Continuous Momentum (layoutId)"
              : `Engine: ${engine === "view-transition" ? "document.startViewTransition" : "layoutId Spring"}`}
          </span>
        </div>

        {/* Center Canvas */}
        <div className="relative flex-1 flex flex-col items-center justify-end pb-4 w-full z-10">
          {mode === "stepper" ? (
            <FamilyStepperDialog
              inline={true}
              triggerLabel="Start 3-Step Transfer"
              onComplete={() => {
                setToastMessage("✓ Multi-step transfer completed with full shared-element flow!");
                setTimeout(() => setToastMessage(null), 3500);
              }}
            />
          ) : (
            <FamilyDialog
              key={`${activeScenarioKey}-${engine}`}
              inline={true}
              engine={engine}
              variant={activeScenario.variant}
              title={activeScenario.dialogTitle}
              icon={<IconComponent size={18} />}
              description={activeScenario.dialogDescription}
              actionLabel={activeScenario.actionLabel}
              cancelLabel={activeScenario.cancelLabel}
              triggerLabel={activeScenario.triggerLabel}
              onConfirm={handleActionConfirm}
            />
          )}
        </div>

        {/* Footer Info Bar */}
        <div className="flex items-center justify-between border-t border-zinc-200/60 dark:border-zinc-800/60 pt-3 z-10 text-[11px] font-mono text-zinc-400">
          <span>
            {mode === "stepper"
              ? "Look at the sliding step pill, the token badge flying to Step 3, and the morphing CTA button."
              : "Click the button at the bottom to watch it morph into the dialog's action button."}
          </span>
          <span className="hidden sm:inline">60 FPS GPU Projection</span>
        </div>

        {/* Action Toast */}
        {toastMessage && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-800 shadow-lg dark:bg-emerald-950/90 dark:text-emerald-200 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
            <CheckCircle2 size={14} className="text-emerald-500 dark:text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* SHARED ELEMENT ARCHITECTURE CARD */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/60 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <span className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300">
            SHARED ELEMENT ANATOMY // 4 CONCURRENT PROJECTION LAYERS
          </span>
          <span className="rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-mono text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400">
            Advanced Composition
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 text-xs">
          <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-3 dark:border-zinc-800/60 dark:bg-zinc-800/40">
            <span className="font-mono text-[10px] uppercase text-emerald-600 dark:text-emerald-400 font-semibold block mb-1">
              01 // Macro Morph
            </span>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
              El botón disparador exterior viaja y se transforma directamente en el botón de acción principal dentro del diálogo.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-3 dark:border-zinc-800/60 dark:bg-zinc-800/40">
            <span className="font-mono text-[10px] uppercase text-indigo-600 dark:text-indigo-400 font-semibold block mb-1">
              02 // Step Indicator
            </span>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
              La píldora del stepper se desplaza horizontalmente con resortes (`layoutId=&quot;stepper-indicator-pill&quot;`) siguiendo el paso activo.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-3 dark:border-zinc-800/60 dark:bg-zinc-800/40">
            <span className="font-mono text-[10px] uppercase text-purple-600 dark:text-purple-400 font-semibold block mb-1">
              03 // Item Flight
            </span>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
              El token elegido en el Paso 1 vuela físicamente hasta la cabecera del Paso 3 de confirmación (`layoutId=&quot;selected-token-icon&quot;`).
            </p>
          </div>

          <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-3 dark:border-zinc-800/60 dark:bg-zinc-800/40">
            <span className="font-mono text-[10px] uppercase text-amber-600 dark:text-amber-400 font-semibold block mb-1">
              04 // Button Evolution
            </span>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
              El botón de acción nunca se destruye: adapta su ancho, texto y estado en cada paso manteniendo continuidad física total.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
