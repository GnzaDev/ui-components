import { useState, useRef } from "react";
import {
  MorphingStepDialog,
  MorphingStepDialogTrigger,
} from "../../MorphingStepDialog";
import type { StepItem } from "../../MorphingStepDialog";

import { Layers, ArrowRight, User, Sparkles } from "lucide-react";

export function StepDialogExample() {
  const [open, setOpen] = useState(false);
  const [engine, setEngine] = useState<"sway" | "davo">("sway");
  const [name, setName] = useState("");
  const [plan, setPlan] = useState("pro");
  const triggerRef = useRef<HTMLButtonElement>(null);

  const steps: StepItem[] = [
    {
      id: "account",
      title: "Paso 1: Tu cuenta",
      description: "Ingresá tu nombre para configurar tu nuevo espacio de trabajo.",
      isValid: name.trim().length > 0,
      content: (
        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Nombre de usuario
            </label>
            <div className="relative mt-1.5">
              <User
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                placeholder="ej. Gonzalo Pozzo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 pl-9 pr-3.5 py-2.5 text-xs text-zinc-900 outline-none transition-all focus:border-zinc-900 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:focus:border-white"
              />
            </div>
            {name.trim().length === 0 && (
              <p className="mt-1 text-[11px] text-amber-500">
                * Por favor completá tu nombre para continuar.
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "plan",
      title: "Paso 2: Elegí tu plan",
      description: "Transición horizontal continua sin saltos de layout.",
      content: (
        <div className="space-y-2 pt-2">
          {[
            {
              id: "starter",
              name: "Starter",
              price: "Gratis",
              desc: "1 proyecto, 3 miembros del equipo.",
            },
            {
              id: "pro",
              name: "Pro",
              price: "$29/mes",
              desc: "Proyectos ilimitados, animaciones avanzadas, soporte 24/7.",
            },
            {
              id: "enterprise",
              name: "Enterprise",
              price: "Custom",
              desc: "SLA garantizado, despliegues dedicados y auditoría.",
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
      title: "Paso 3: Confirmación",
      description: "Verificá los detalles antes de crear tu suscripción.",
      content: (
        <div className="space-y-3 pt-2">
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-zinc-500">Usuario:</span>
              <span className="font-bold text-zinc-900 dark:text-white">
                {name || "Sin nombre"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-t border-zinc-200/50 dark:border-zinc-700/50">
              <span className="text-zinc-500">Plan elegido:</span>
              <span className="font-bold uppercase text-teal-600 dark:text-teal-400">
                {plan}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Al finalizar se creará el entorno con las configuraciones seleccionadas.
          </p>
        </div>
      ),
    },
  ];

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

        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
            Dual Engine: {engine === "sway" ? "Sway Springs" : "GSAP FLIP"}
          </span>
          <span>•</span>
          <span>Wizard Flow</span>
        </div>
      </div>

      <div className="mt-6">
        {engine === "sway" ? (
          <MorphingStepDialogTrigger
            layoutId="step-dialog-morph"
            onClick={() => setOpen(true)}
            className="w-full text-xs"
          >
            <Sparkles size={14} />
            <span>Launch Wizard (Sway Springs)</span>
            <ArrowRight size={14} />
          </MorphingStepDialogTrigger>
        ) : (
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200/80 bg-white px-4 text-xs font-semibold text-zinc-900 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80 cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Launch Wizard (GSAP Flip)</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      <MorphingStepDialog
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
        engine={engine}
        triggerRef={triggerRef}
        layoutId={engine === "sway" ? "step-dialog-morph" : undefined}
        onComplete={() => alert(`¡Listo! Espacio configurado para ${name}.`)}
      />
    </div>
  );
}
