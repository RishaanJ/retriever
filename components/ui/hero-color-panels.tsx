"use client";

import { ColorPanels } from "@paper-design/shaders-react";
import * as React from "react";

const MemoizedColorPanels = React.memo(ColorPanels);

type ColorPanelsProps = React.ComponentProps<typeof ColorPanels>;

type HeroColorPanelsVisualProps = {
  className?: string;
  shaderProps?: Partial<ColorPanelsProps>;
};

const rotationariesPanels: Partial<ColorPanelsProps> = {
  width: 960,
  height: 560,
  colors: ["#68323D", "#8B5963", "#D9C2C7", "#FFFFFF"],
  colorBack: "#ffffff00",
  density: 4.6,
  angle1: 0.62,
  angle2: 0.22,
  length: 1.2,
  edges: true,
  blur: 0.35,
  fadeIn: 0.78,
  fadeOut: 0.38,
  gradient: 0.48,
  speed: 0.55,
  scale: 1.05,
  rotation: 168,
};

/**
 * Adapted from Cult UI's MIT-licensed Hero Color Panels visual primitive.
 * Retriever uses its shader layer inside a product search experience.
 */
export function HeroColorPanelsVisual({
  className,
  shaderProps,
}: HeroColorPanelsVisualProps) {
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(media.matches);

    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  return (
    <div className={className} aria-hidden="true">
      <MemoizedColorPanels
        {...rotationariesPanels}
        {...shaderProps}
        speed={reduceMotion ? 0 : (shaderProps?.speed ?? rotationariesPanels.speed)}
        style={{ height: "100%", width: "100%", ...shaderProps?.style }}
      />
    </div>
  );
}
