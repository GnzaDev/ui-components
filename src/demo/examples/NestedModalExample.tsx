import { useState } from "react";
import { SideSheet } from "../../SideSheet";
import { GonzaModal, GonzaModalTrigger } from "../../GonzaModal";
import { Layers, UserX, AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";

export function NestedModalExample() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [nestedModalOpen, setNestedModalOpen] = useState(false);
  const [revoked, setRevoked] = useState(false);

  const handleRevoke = () => {
    setRevoked(true);
    setTimeout(() => {
      setNestedModalOpen(false);
      setRevoked(false);
      setSheetOpen(false);
    }, 700);
  };

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
          <Layers size={20} />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          Nested Composition
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          SideSheet drawer triggering an overlay modal dialog inside its context hierarchy.
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="rounded-md bg-rose-50 px-2 py-0.5 font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
            SideSheet + GonzaModal
          </span>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200/80 bg-white px-4 text-xs font-semibold text-zinc-900 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80 cursor-pointer"
        >
          <span>Open Member Drawer</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Primary SideSheet */}
      <SideSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Workspace Member Details"
        maxWidth="max-w-xl"
        overlay={
          /* Nested GonzaModal rendered directly into the SideSheet overlay prop with inline={true} */
          <GonzaModal
            open={nestedModalOpen}
            onClose={() => setNestedModalOpen(false)}
            layoutId="nested-revoke-modal"
            inline={true}
            title="Revoke Member Access"
            maxWidth="max-w-md"
            footer={
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNestedModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRevoke}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-red-700 cursor-pointer"
                >
                  {revoked ? (
                    <>
                      <CheckCircle2 size={14} />
                      <span>Revoked</span>
                    </>
                  ) : (
                    <>
                      <UserX size={14} />
                      <span>Confirm Revocation</span>
                    </>
                  )}
                </button>
              </div>
            }
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-3 text-red-700 dark:bg-red-950/50 dark:text-red-300">
                <AlertTriangle size={20} className="shrink-0" />
                <p className="text-xs leading-relaxed">
                  This action will immediately terminate the session and revoke all API keys assigned to <strong>Marcus Vance</strong>.
                </p>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Any automated jobs or webhook secrets created under this user will be placed on hold until reassigned.
              </p>
            </div>
          </GonzaModal>
        }
      >
        <div className="space-y-6">
          {/* Member Card */}
          <div className="flex items-center gap-4 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-800/60">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-lg font-bold text-white shadow-md">
              MV
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Marcus Vance
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                marcus@acmecorp.dev
              </p>
              <span className="mt-1 inline-block rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200">
                DevOps Engineer
              </span>
            </div>
          </div>

          {/* Activity Info */}
          <div className="space-y-2">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Session & Permissions
            </h5>
            <div className="rounded-2xl border border-zinc-100 p-4 dark:border-zinc-800 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Role</span>
                <span className="font-medium text-zinc-900 dark:text-white">Team Member</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Last Active</span>
                <span className="font-medium text-zinc-900 dark:text-white">12 minutes ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Active Sessions</span>
                <span className="font-medium text-zinc-900 dark:text-white">2 devices</span>
              </div>
            </div>
          </div>

          {/* Danger Zone Action */}
          <div className="rounded-2xl border border-red-200/80 bg-red-50/40 p-4 dark:border-red-900/40 dark:bg-red-950/20">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <ShieldAlert size={16} />
              <h5 className="text-xs font-semibold">Danger Zone</h5>
            </div>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              Revoking access will disconnect this member from all enterprise clusters immediately.
            </p>
            <div className="mt-4">
              <GonzaModalTrigger
                layoutId="nested-revoke-modal"
                onClick={() => setNestedModalOpen(true)}
                className="bg-red-600 text-white border-transparent hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-700 text-xs shadow-xs"
              >
                <UserX size={14} />
                <span>Revoke Access...</span>
              </GonzaModalTrigger>
            </div>
          </div>
        </div>
      </SideSheet>
    </div>
  );
}
