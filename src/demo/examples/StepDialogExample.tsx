import { useState, useRef } from "react";
import {
  MorphingStepDialog,
  MorphingStepDialogTrigger,
} from "../../MorphingStepDialog";
import type { StepItem } from "../../MorphingStepDialog";

import {
  Layers,
  ArrowRight,
  User,
  Sparkles,
  GitBranch,
  Server,
  Rocket,
  ShieldCheck,
} from "lucide-react";

type WizardScenario = "onboarding" | "deploy";

export function StepDialogExample() {
  const [scenario, setScenario] = useState<WizardScenario>("onboarding");
  const [open, setOpen] = useState(false);
  const [engine, setEngine] = useState<"sway" | "davo">("sway");

  // Onboarding state
  const [name, setName] = useState("");
  const [plan, setPlan] = useState("pro");

  // Deploy pipeline state
  const [branch, setBranch] = useState("main");
  const [environment, setEnvironment] = useState("production");

  const triggerRef = useRef<HTMLButtonElement>(null);

  const onboardingSteps: StepItem[] = [
    {
      id: "account",
      title: "Step 1: Your Account",
      description: "Enter your username to configure your new workspace.",
      isValid: name.trim().length > 0,
      content: (
        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              User Handle
            </label>
            <div className="relative mt-1.5">
              <User
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                placeholder="e.g. Gonzalo Pozzo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 pl-9 pr-3.5 py-2.5 text-xs text-zinc-900 outline-none transition-all focus:border-zinc-900 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:focus:border-white"
              />
            </div>
            {name.trim().length === 0 && (
              <p className="mt-1 text-[11px] text-amber-500">
                * Please enter your name to unlock the next step.
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "plan",
      title: "Step 2: Choose Plan",
      description: "Continuous directional sliding with zero layout shift.",
      content: (
        <div className="space-y-2 pt-2">
          {[
            {
              id: "starter",
              name: "Starter",
              price: "Free",
              desc: "1 project, 3 team members.",
            },
            {
              id: "pro",
              name: "Pro",
              price: "$29/mo",
              desc: "Unlimited projects, advanced springs, 24/7 support.",
            },
            {
              id: "enterprise",
              name: "Enterprise",
              price: "Custom",
              desc: "Dedicated SLA, custom clusters, compliance audits.",
            },
          ].map((p) => (
            <div
              key={p.id}
              onClick={() => setPlan(p.id)}
              className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                plan === p.id
                  ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-800"
                  : "border-zinc-200/80 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900"
              }`}
            >
              <div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white">
                  {p.name}
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {p.desc}
                </div>
              </div>
              <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                {p.price}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "confirm",
      title: "Step 3: Verification",
      description: "Inspect configuration parameters before provisioning.",
      content: (
        <div className="space-y-3 pt-2">
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-zinc-500">Account:</span>
              <span className="font-bold text-zinc-900 dark:text-white">
                {name || "Anonymous"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-t border-zinc-200/50 dark:border-zinc-700/50">
              <span className="text-zinc-500">Selected Plan:</span>
              <span className="font-bold uppercase text-teal-600 dark:text-teal-400">
                {plan}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Clicking complete will provision the container sandbox immediately.
          </p>
        </div>
      ),
    },
  ];

  const deploySteps: StepItem[] = [
    {
      id: "target",
      title: "Step 1: Release Branch",
      description: "Select target git branch and revision hash.",
      content: (
        <div className="space-y-2 pt-2">
          {[
            { id: "main", label: "main (production)", hash: "7f4c9a2" },
            { id: "staging", label: "staging (candidate)", hash: "3e1b8c0" },
            { id: "preview", label: "feature/motion (canary)", hash: "8a02d41" },
          ].map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setBranch(b.id)}
              className={`flex w-full items-center justify-between p-3 rounded-2xl border cursor-pointer text-left transition-all ${
                branch === b.id
                  ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-800"
                  : "border-zinc-200/80 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900"
              }`}
            >
              <span className="flex items-center gap-2.5 text-xs font-semibold text-zinc-900 dark:text-white">
                <GitBranch size={13} className="text-zinc-400" />
                <span>{b.label}</span>
              </span>
              <span className="font-mono text-[11px] text-zinc-400">{b.hash}</span>
            </button>
          ))}
        </div>
      ),
    },
    {
      id: "env",
      title: "Step 2: Destination Cluster",
      description: "Choose deployment zone and compute specs.",
      content: (
        <div className="space-y-2 pt-2">
          {[
            { id: "production", title: "Production (us-east-1)", spec: "8 vCPU • 32 GB RAM" },
            { id: "staging", title: "Staging Sandbox (eu-central-1)", spec: "4 vCPU • 16 GB RAM" },
          ].map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setEnvironment(e.id)}
              className={`flex w-full items-center justify-between p-3 rounded-2xl border cursor-pointer text-left transition-all ${
                environment === e.id
                  ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-800"
                  : "border-zinc-200/80 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900"
              }`}
            >
              <span className="flex items-center gap-2.5 text-xs font-semibold text-zinc-900 dark:text-white">
                <Server size={13} className="text-zinc-400" />
                <span>{e.title}</span>
              </span>
              <span className="font-mono text-[10px] text-zinc-400">{e.spec}</span>
            </button>
          ))}
        </div>
      ),
    },
    {
      id: "summary",
      title: "Step 3: Trigger Deployment",
      description: "Verify security checksums and launch container swap.",
      content: (
        <div className="space-y-3 pt-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
            <div className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck size={14} />
              <span>Pipeline Gate Passed</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-emerald-700/90 dark:text-emerald-300/90">
              Zero vulnerabilities detected in 148 lockfile packages. Ready for zero-downtime rolling update.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50 p-3 text-xs space-y-1 font-mono text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
            <div>Branch: <strong className="text-zinc-900 dark:text-white">{branch}</strong></div>
            <div>Cluster: <strong className="text-zinc-900 dark:text-white">{environment}</strong></div>
          </div>
        </div>
      ),
    },
  ];

  const activeSteps = scenario === "onboarding" ? onboardingSteps : deploySteps;

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="flex items-center justify-between">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Layers size={20} />
          </div>

          {/* Engine Selector Pills */}
          <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100/80 p-1 text-[11px] font-semibold dark:border-zinc-800 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setEngine("sway")}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                engine === "sway"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Motion (Sway)
            </button>
            <button
              type="button"
              onClick={() => setEngine("davo")}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                engine === "davo"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              GSAP Flip
            </button>
          </div>
        </div>

        <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-white">
          MorphingStepDialog
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Multi-step wizard modal with dynamically morphing container dimensions and directional step slides.
        </p>

        {/* Scenario Switcher */}
        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
          <span className="text-xs font-semibold text-zinc-400">Scenario:</span>
          <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100/80 p-0.5 text-xs dark:border-zinc-800 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setScenario("onboarding")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                scenario === "onboarding"
                  ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Onboarding Flow
            </button>
            <button
              type="button"
              onClick={() => setScenario("deploy")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                scenario === "deploy"
                  ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Deploy Pipeline
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {engine === "sway" ? (
          <MorphingStepDialogTrigger
            layoutId={`step-dialog-${scenario}`}
            onClick={() => setOpen(true)}
            className="w-full text-xs"
          >
            {scenario === "onboarding" ? <Sparkles size={14} /> : <Rocket size={14} />}
            <span>Launch {scenario === "onboarding" ? "Onboarding" : "Deploy Pipeline"} (Sway)</span>
            <ArrowRight size={14} />
          </MorphingStepDialogTrigger>
        ) : (
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200/80 bg-white px-4 text-xs font-semibold text-zinc-900 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80 cursor-pointer"
          >
            {scenario === "onboarding" ? <Sparkles size={14} /> : <Rocket size={14} />}
            <span>Launch {scenario === "onboarding" ? "Onboarding" : "Deploy Pipeline"} (Davo)</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      <MorphingStepDialog
        open={open}
        onClose={() => setOpen(false)}
        steps={activeSteps}
        engine={engine}
        triggerRef={triggerRef}
        layoutId={engine === "sway" ? `step-dialog-${scenario}` : undefined}
        onComplete={() => {
          setOpen(false);
          alert(
            scenario === "onboarding"
              ? `Done! Workspace configured for ${name || "Anonymous"}.`
              : `Deploying branch ${branch} to ${environment}!`
          );
        }}
      />
    </div>
  );
}
