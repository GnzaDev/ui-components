import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight, ArrowLeft, Check, Coins, ShieldCheck, Zap, Wallet } from "lucide-react";
import { cn } from "../utils/cn";
import { SWAY_SPRINGS } from "../utils/animationTokens";
import { useScrollLock } from "../utils/useScrollLock";

export interface FamilyStepperDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  engine?: "spring" | "view-transition";
  inline?: boolean;
  triggerLabel?: string;
  onComplete?: () => void;
}

interface TokenOption {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  iconBg: string;
  network: string;
}

const TOKENS: TokenOption[] = [
  { id: "usdc", name: "USD Coin", symbol: "USDC", balance: "14,250.00", iconBg: "bg-blue-500", network: "Ethereum" },
  { id: "eth", name: "Ethereum", symbol: "ETH", balance: "4.82", iconBg: "bg-indigo-500", network: "Ethereum" },
  { id: "sol", name: "Solana", symbol: "SOL", balance: "142.50", iconBg: "bg-purple-500", network: "Solana" },
];

export function FamilyStepperDialog({
  open: controlledOpen,
  onOpenChange,
  inline = false,
  triggerLabel = "Start Transfer",
  onComplete,
}: FamilyStepperDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  useScrollLock(isOpen && !inline);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [selectedToken, setSelectedToken] = useState<TokenOption>(TOKENS[0]);
  const [amount, setAmount] = useState("2500");
  const [speed, setSpeed] = useState<"instant" | "standard">("instant");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
    if (!nextOpen) {
      setTimeout(() => {
        setStep(1);
        setIsSuccess(false);
      }, 300);
    }
  };

  const goToStep = (newStep: 1 | 2 | 3) => {
    setDirection(newStep > step ? 1 : -1);
    setStep(newStep);
  };

  const handleNext = () => {
    if (step < 3) {
      setDirection(1);
      setStep((s) => (s + 1) as 1 | 2 | 3);
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        onComplete?.();
        handleOpenChange(false);
      }, 900);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep((s) => (s - 1) as 1 | 2 | 3);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 28 : -28,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -28 : 28,
      opacity: 0,
    }),
  };

  return (
    <div className={cn("w-full flex flex-col items-center justify-center", inline ? "relative min-h-[460px]" : "")}>
      {/* TRIGGER BUTTON: Initial resting state */}
      {!isOpen && (
        <div className="w-full flex items-center justify-center py-6">
          <motion.button
            layoutId="family-stepper-btn"
            type="button"
            onClick={() => handleOpenChange(true)}
            transition={{
              type: "spring",
              stiffness: SWAY_SPRINGS.modal.stiffness,
              damping: SWAY_SPRINGS.modal.damping,
              mass: SWAY_SPRINGS.modal.mass,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex h-12 w-64 sm:w-80 items-center justify-center gap-2 rounded-full bg-emerald-400 px-8 text-sm font-semibold text-emerald-950 shadow-md hover:bg-emerald-300 cursor-pointer"
          >
            <Wallet size={16} className="text-emerald-900" />
            <motion.span
              layoutId="family-stepper-btn-label"
              transition={{
                type: "spring",
                stiffness: SWAY_SPRINGS.modal.stiffness,
                damping: SWAY_SPRINGS.modal.damping,
                mass: SWAY_SPRINGS.modal.mass,
              }}
              className="inline-block tracking-tight font-semibold"
            >
              {triggerLabel}
            </motion.span>
          </motion.button>
        </div>
      )}

      {/* MODAL WITH SHARED ELEMENTS & LOCKED-HEIGHT STEPS */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex items-center justify-center z-50",
              inline
                ? "absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-xs p-4"
                : "fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm p-4"
            )}
            onClick={(e) => {
              if (e.target === e.currentTarget) handleOpenChange(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{
                type: "spring",
                stiffness: SWAY_SPRINGS.modal.stiffness,
                damping: SWAY_SPRINGS.modal.damping,
                mass: SWAY_SPRINGS.modal.mass,
              }}
              className="w-full max-w-[420px] rounded-3xl border border-zinc-200 bg-white p-6 text-zinc-900 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 dark:text-white select-none"
              role="dialog"
              aria-modal="true"
            >
              {/* Header: Title + Close */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <Coins size={17} />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight text-zinc-950 dark:text-white">
                    Transfer Wizard
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X size={17} />
                </button>
              </div>

              {/* SHARED ELEMENT STEPPER TRACK */}
              <div className="mt-4 flex items-center justify-between rounded-xl border border-zinc-200/80 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-800/40">
                {[
                  { num: 1, label: "Asset" },
                  { num: 2, label: "Amount" },
                  { num: 3, label: "Confirm" },
                ].map((s) => {
                  const isActive = step === s.num;
                  const isPast = step > s.num;
                  return (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => goToStep(s.num as 1 | 2 | 3)}
                      className={cn(
                        "relative flex-1 py-1.5 text-center text-xs font-medium transition-colors cursor-pointer z-10",
                        isActive
                          ? "text-zinc-900 dark:text-white font-semibold"
                          : isPast
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                      )}
                    >
                      {/* Shared Layout Pill indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="stepper-indicator-pill"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                          }}
                          className="absolute inset-0 rounded-lg bg-white shadow-xs dark:bg-zinc-700 -z-10"
                        />
                      )}
                      <span>{s.num}. {s.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* FIXED CALIBRATED STEP VIEWPORT (215px exact height across all steps - NO JUMPS) */}
              <div className="mt-5 h-[215px] relative overflow-hidden">
                <AnimatePresence custom={direction} mode="wait">
                  {/* STEP 1: ASSET SELECTION */}
                  {step === 1 && (
                    <motion.div
                      key="step-1"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute inset-0 flex flex-col justify-between"
                    >
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 block">
                        Choose asset to transfer:
                      </span>
                      <div className="space-y-2">
                        {TOKENS.map((token) => {
                          const isSelected = selectedToken.id === token.id;
                          return (
                            <div
                              key={token.id}
                              onClick={() => setSelectedToken(token)}
                              className={cn(
                                "flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer",
                                isSelected
                                  ? "border-emerald-500 bg-emerald-50/40 dark:border-emerald-500/80 dark:bg-emerald-950/20"
                                  : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-800/30 dark:hover:bg-zinc-800/60"
                              )}
                            >
                              <div className="flex items-center gap-2.5">
                                {/* Shared Token Badge */}
                                <motion.div
                                  layoutId={isSelected ? "selected-token-icon" : undefined}
                                  className={cn("h-7 w-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-xs", token.iconBg)}
                                >
                                  {token.symbol.slice(0, 2)}
                                </motion.div>
                                <div>
                                  <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                                    {token.name}
                                  </div>
                                  <div className="text-[10px] text-zinc-400">
                                    {token.network}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200">
                                  {token.balance}
                                </div>
                                <div className="text-[10px] text-zinc-400 uppercase">
                                  {token.symbol}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: AMOUNT & SPEED */}
                  {step === 2 && (
                    <motion.div
                      key="step-2"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute inset-0 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-medium text-zinc-500 dark:text-zinc-400">Transfer Amount</span>
                          <span className="text-zinc-400 font-mono text-[11px]">Balance: {selectedToken.balance}</span>
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-base font-mono font-semibold text-zinc-900 focus:border-zinc-900 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-white dark:focus:border-white"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-zinc-500">
                            {selectedToken.symbol}
                          </span>
                        </div>
                      </div>

                      {/* Speed selector */}
                      <div>
                        <span className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
                          Execution Speed
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setSpeed("instant")}
                            className={cn(
                              "flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer",
                              speed === "instant"
                                ? "border-emerald-500 bg-emerald-50/50 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200 font-semibold"
                                : "border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                            )}
                          >
                            <Zap size={14} className="text-amber-500" />
                            <span>Instant (&lt; 2s)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSpeed("standard")}
                            className={cn(
                              "flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer",
                              speed === "standard"
                                ? "border-emerald-500 bg-emerald-50/50 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200 font-semibold"
                                : "border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                            )}
                          >
                            <ShieldCheck size={14} className="text-blue-500" />
                            <span>Standard (~15s)</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: REVIEW & SHARED ELEMENT ANCHOR */}
                  {step === 3 && (
                    <motion.div
                      key="step-3"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute inset-0 flex flex-col justify-between"
                    >
                      <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-800/40 space-y-3">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-zinc-800">
                          <div className="flex items-center gap-2.5">
                            {/* Shared token icon flown from step 1 */}
                            <motion.div
                              layoutId="selected-token-icon"
                              className={cn("h-7 w-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-xs", selectedToken.iconBg)}
                            >
                              {selectedToken.symbol.slice(0, 2)}
                            </motion.div>
                            <div>
                              <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                                {selectedToken.name}
                              </div>
                              <div className="text-[10px] text-zinc-400">{selectedToken.network}</div>
                            </div>
                          </div>
                          <div className="text-right font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                            {amount} {selectedToken.symbol}
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                            <span>Estimated Fee</span>
                            <span className="font-mono text-zinc-800 dark:text-zinc-200">~$0.42</span>
                          </div>
                          <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                            <span>Processing Time</span>
                            <span className="font-medium capitalize text-zinc-800 dark:text-zinc-200">{speed}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center leading-relaxed">
                        Funds will be deposited to your destination vault upon confirmation.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CONTROLS FOOTER: Pinned completely rock-solid */}
              <div className="mt-6 flex items-center gap-3 pt-2">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="h-11 rounded-full border border-zinc-200 bg-zinc-50 px-4 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenChange(false)}
                    className="h-11 rounded-full border border-zinc-200 bg-zinc-50 px-4 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}

                {/* The Morphing Primary Action Button */}
                <motion.button
                  layoutId="family-stepper-btn"
                  type="button"
                  onClick={handleNext}
                  disabled={isSuccess}
                  transition={{
                    type: "spring",
                    stiffness: SWAY_SPRINGS.modal.stiffness,
                    damping: SWAY_SPRINGS.modal.damping,
                    mass: SWAY_SPRINGS.modal.mass,
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 h-11 rounded-full bg-emerald-400 px-5 text-xs font-semibold text-emerald-950 shadow-sm hover:bg-emerald-300 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  {isSuccess ? (
                    <>
                      <Check size={16} />
                      <span>Transfer Sent!</span>
                    </>
                  ) : (
                    <>
                      <motion.span
                        layoutId="family-stepper-btn-label"
                        transition={{
                          type: "spring",
                          stiffness: SWAY_SPRINGS.modal.stiffness,
                          damping: SWAY_SPRINGS.modal.damping,
                          mass: SWAY_SPRINGS.modal.mass,
                        }}
                        className="inline-block tracking-tight font-semibold"
                      >
                        {step === 1 ? "Next: Set Amount" : step === 2 ? "Review Details" : `Confirm ${amount} ${selectedToken.symbol}`}
                      </motion.span>
                      {step < 3 && <ArrowRight size={13} />}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
