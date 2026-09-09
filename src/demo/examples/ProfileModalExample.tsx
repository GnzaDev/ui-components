import { useRef, useState } from "react";
import { GonzaModal, GonzaModalTrigger } from "../../GonzaModal";
import { DavoModal } from "../../DavoModal";
import { User, Mail, Bell, Shield, Check, Settings, Sparkles, ArrowRight, Layers } from "lucide-react";

export function ProfileModalExample() {
  const [engine, setEngine] = useState<"gonza" | "davo">("gonza");
  const [gonzaOpen, setGonzaOpen] = useState(false);
  const [davoOpen, setDavoOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const davoTriggerRef = useRef<HTMLButtonElement>(null);

  const [formData, setFormData] = useState({
    name: "Alex Rivera",
    role: "Staff Product Designer",
    email: "alex.rivera@example.com",
    bio: "Building thoughtful interfaces, design systems, and micro-interactions.",
    notifications: true,
    twoFactor: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setGonzaOpen(false);
      setDavoOpen(false);
    }, 800);
  };

  const formContent = (
    <div className="space-y-5">
      {/* Avatar & header info */}
      <div className="flex items-center gap-4 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-800/60">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-lg font-bold text-white shadow-md">
          AR
        </div>
        <div>
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
            {formData.name}
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {formData.role}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <Sparkles size={12} />
            <span>Verified Pro Member • Active Engine: {engine === "gonza" ? "Motion" : "GSAP Flip"}</span>
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Full Name
          </label>
          <div className="relative mt-1.5">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Email Address
          </label>
          <div className="relative mt-1.5 flex items-center">
            <Mail size={14} className="absolute left-3 text-zinc-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Bio
          </label>
          <textarea
            rows={2}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="mt-1.5 w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
        </div>
      </div>

      {/* Preferences toggles */}
      <div className="space-y-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <div className="flex items-center justify-between rounded-xl p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
          <div className="flex items-center gap-2.5">
            <Bell size={16} className="text-zinc-500" />
            <div>
              <span className="block text-xs font-medium text-zinc-900 dark:text-white">
                Email Notifications
              </span>
              <span className="text-[11px] text-zinc-400">
                Receive weekly product updates and digest
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, notifications: !formData.notifications })}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
              formData.notifications ? "bg-zinc-900 dark:bg-white" : "bg-zinc-200 dark:bg-zinc-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out dark:bg-zinc-900 ${
                formData.notifications ? "translate-x-4.5" : "translate-x-0.5"
              } mt-0.5`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
          <div className="flex items-center gap-2.5">
            <Shield size={16} className="text-zinc-500" />
            <div>
              <span className="block text-xs font-medium text-zinc-900 dark:text-white">
                Two-Factor Authentication
              </span>
              <span className="text-[11px] text-zinc-400">
                Extra layer of protection for login actions
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, twoFactor: !formData.twoFactor })}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
              formData.twoFactor ? "bg-zinc-900 dark:bg-white" : "bg-zinc-200 dark:bg-zinc-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out dark:bg-zinc-900 ${
                formData.twoFactor ? "translate-x-4.5" : "translate-x-0.5"
              } mt-0.5`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const formFooter = (
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-400 dark:text-zinc-500">
        Changes apply immediately
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setGonzaOpen(false);
            setDavoOpen(false);
          }}
          className="rounded-xl px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 cursor-pointer"
        >
          {saved ? (
            <>
              <Check size={14} />
              <span>Saved!</span>
            </>
          ) : (
            <span>Save Changes</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="flex items-center justify-between">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <User size={20} />
          </div>

          {/* Engine Switcher */}
          <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100/70 p-0.5 text-[11px] dark:border-zinc-700 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setEngine("gonza")}
              className={`rounded-lg px-2.5 py-1 font-semibold transition-all cursor-pointer ${
                engine === "gonza"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Motion
            </button>
            <button
              type="button"
              onClick={() => setEngine("davo")}
              className={`rounded-lg px-2.5 py-1 font-semibold transition-all cursor-pointer ${
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
          Profile & Settings
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Compare form reactivity with Motion springs vs cinematic GSAP Flip morphing.
        </p>

        <div className="mt-2 text-[11px] font-medium text-zinc-400">
          Selected engine: <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{engine === "gonza" ? "GonzaModal (Motion)" : "DavoModal (GSAP Flip)"}</span>
        </div>
      </div>

      <div className="mt-6">
        {engine === "gonza" ? (
          <GonzaModalTrigger
            layoutId="example-profile-modal"
            onClick={() => setGonzaOpen(true)}
            className="w-full text-xs"
          >
            <Settings size={14} />
            <span>Edit Profile (Motion)</span>
          </GonzaModalTrigger>
        ) : (
          <button
            ref={davoTriggerRef}
            type="button"
            onClick={() => setDavoOpen(true)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200/80 bg-white px-4 text-xs font-semibold text-zinc-900 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80 cursor-pointer"
          >
            <Layers size={14} />
            <span>Edit Profile (GSAP Flip)</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* GonzaModal Instance */}
      <GonzaModal
        open={gonzaOpen}
        onClose={() => setGonzaOpen(false)}
        layoutId="example-profile-modal"
        title="Account Preferences (Motion Spring)"
        maxWidth="max-w-lg"
        footer={formFooter}
      >
        {formContent}
      </GonzaModal>

      {/* DavoModal Instance */}
      <DavoModal
        open={davoOpen}
        onClose={() => setDavoOpen(false)}
        triggerRef={davoTriggerRef}
        title="Account Preferences (GSAP Flip)"
        maxWidth="max-w-lg"
        footer={formFooter}
      >
        {formContent}
      </DavoModal>
    </div>
  );
}
