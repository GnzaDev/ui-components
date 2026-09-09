import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(Flip, CustomEase);

export const PRETTY_EASE = "M0,0 C0.305,0.206 0.116,0.567 0.3,0.8 0.394,0.921 0.491,1 1,1";
const EASE = PRETTY_EASE;

export class PrettyModalService {
  open(dialog: HTMLDialogElement, origin: HTMLElement) {
    if (!dialog || !origin) return;

    const randomId = Math.random().toString(16).slice(2);

    dialog.dataset.flipId = randomId;
    origin.dataset.flipId = randomId;

    const originState = Flip.getState(origin);

    if (!dialog.open) {
      dialog.showModal();
    }

    Flip.from(originState, {
      targets: dialog,
      scale: true,
      ease: CustomEase.create("custom", EASE),
      toggleClass: "pretty-modal-opening",
      duration: 0.7,
    });
  }

  close(dialog: HTMLDialogElement, onClosed?: () => void) {
    if (!dialog) {
      onClosed?.();
      return;
    }

    const originId = dialog.dataset.flipId;
    const origin = originId
      ? document.querySelector<HTMLElement>(`[data-flip-id="${originId}"]:not([open])`)
      : null;

    if (!origin) {
      dialog.setAttribute("style", "");
      if (dialog.open) dialog.close();
      onClosed?.();
      return;
    }

    const originState = Flip.getState(origin);

    Flip.to(originState, {
      targets: dialog,
      scale: true,
      ease: CustomEase.create("custom", EASE),
      onComplete: () => {
        dialog.setAttribute("style", "");
        if (dialog.open) dialog.close();
        onClosed?.();
      },
      toggleClass: "pretty-modal-closing",
      duration: 0.7,
    });
  }

  openElement(target: HTMLElement, origin: HTMLElement, onStart?: () => void) {
    if (!target || !origin) return;

    const randomId = Math.random().toString(16).slice(2);
    target.dataset.flipId = randomId;
    origin.dataset.flipId = randomId;

    const originState = Flip.getState(origin);
    onStart?.();

    Flip.from(originState, {
      targets: target,
      scale: true,
      ease: CustomEase.create("custom", EASE),
      toggleClass: "pretty-modal-opening",
      duration: 0.6,
      clearProps: "transform",
    });
  }

  closeElement(target: HTMLElement, origin: HTMLElement | null, onClosed?: () => void) {
    if (!target) {
      onClosed?.();
      return;
    }

    if (!origin) {
      target.setAttribute("style", "");
      onClosed?.();
      return;
    }

    const originState = Flip.getState(origin);

    Flip.to(originState, {
      targets: target,
      scale: true,
      ease: CustomEase.create("custom", EASE),
      onComplete: () => {
        target.setAttribute("style", "");
        onClosed?.();
      },
      toggleClass: "pretty-modal-closing",
      duration: 0.55,
    });
  }
}

export const prettyModalService = new PrettyModalService();
