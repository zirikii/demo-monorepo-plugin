import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** A fake camera viewport — no getUserMedia, no image is ever captured or stored. */
export function CameraViewport({
  shape,
  scanning,
  children,
}: {
  shape: "card" | "face";
  scanning: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gopay-dark">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(0,174,214,0.35),transparent_60%)]" />
      <div
        className={cn(
          "relative mx-auto my-8 grid place-items-center border-2 border-dashed border-white/70",
          shape === "card" ? "aspect-[1.58/1] w-[82%] rounded-2xl" : "aspect-square w-[64%] rounded-full",
        )}
      >
        {scanning ? (
          <span
            className="animate-scan absolute inset-x-4 h-0.5 rounded-full bg-gopay shadow-[0_0_18px_4px_rgba(0,174,214,0.65)]"
            aria-hidden
          />
        ) : null}
        <div className="text-center text-white/80">{children}</div>
      </div>
    </div>
  );
}
