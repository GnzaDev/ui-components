/**
 * Canonical Animation Tokens for Gonza Engine (Motion) and Davo Engine (GSAP).
 * Refer to ANIMATION_STANDARDS.md for complete architectural rules.
 */

// 🟠 GONZA ENGINE: Calibrated Euler-Newton Spring Configurations
export const GONZA_SPRINGS = {
  /** Modals, Dialogs, Wizards */
  modal: {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  },
  /** Side drawers and slide-overs */
  drawer: {
    type: "spring" as const,
    stiffness: 350,
    damping: 32,
    mass: 1.0,
  },
  /** Floating popovers and dropdowns */
  popover: {
    type: "spring" as const,
    stiffness: 450,
    damping: 28,
    mass: 0.8,
  },
  /** Active indicator pills and segmented tabs */
  tabs: {
    type: "spring" as const,
    stiffness: 500,
    damping: 35,
    mass: 0.7,
  },
  /** Drag-and-drop sortable lists */
  reorder: {
    type: "spring" as const,
    stiffness: 450,
    damping: 35,
    mass: 1.0,
  },
  /** Contextual bottom floating action bar */
  floatingBar: {
    type: "spring" as const,
    stiffness: 450,
    damping: 30,
    mass: 0.8,
  },
} as const;

// Standard border-radius tokens for layoutId morphing
export const GONZA_RADIUS = {
  trigger: 16,
  card: 24,
  modal: 32,
} as const;

// 🟣 DAVO ENGINE: GSAP Flip Constants
export { PRETTY_EASE } from "../DavoModal/pretty-modal";

export const DAVO_TIMINGS = {
  modalOpen: 0.7,
  modalClose: 0.7,
  elementOpen: 0.6,
  elementClose: 0.5,
} as const;
