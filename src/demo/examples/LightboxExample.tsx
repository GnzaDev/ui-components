import { FlipLightbox, type LightboxImage } from "../../FlipLightbox";
import { Image as ImageIcon } from "lucide-react";

export function LightboxExample() {
  const images: LightboxImage[] = [
    {
      id: "img-1",
      src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
      title: "Abstract Gradient Sphere",
      caption: "Generative 3D fluid rendering with anisotropic reflections.",
      tag: "WebGL",
    },
    {
      id: "img-2",
      src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1000&q=80",
      title: "Iridescent Glass Prism",
      caption: "Chromatic aberration and refraction physics simulation.",
      tag: "Shaders",
    },
    {
      id: "img-3",
      src: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80",
      title: "Minimalist Geometry",
      caption: "High-contrast architectural forms and light interplay.",
      tag: "Design",
    },
  ];

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
          <ImageIcon size={20} />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          FlipLightbox (GSAP Zoom)
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Click any thumbnail to inspect it with cinematic GSAP Flip morphing into full-screen dialog.
        </p>
      </div>

      <div className="mt-6">
        <FlipLightbox images={images} />
      </div>
    </div>
  );
}
