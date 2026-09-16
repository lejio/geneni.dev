"use client";

import { useEffect, useRef } from "react";
import { animate, createDrawable, stagger } from "animejs";

const LINE_CLASS = "landing-line";

export function LandingLines() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const lines = svg.querySelectorAll(`.${LINE_CLASS}`);
    const drawables = createDrawable(lines, 0, 0);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      for (const drawable of drawables) {
        drawable.setAttribute("draw", "0 1");
      }
      return;
    }

    const animation = animate(drawables, {
      draw: ["0 0", "0 1"],
      ease: "inOutQuad",
      duration: 1000,
      delay: stagger(150),
    });

    return () => {
      animation.pause();
      animation.cancel();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full text-foreground opacity-[0.18]"
      aria-hidden="true"
    >
      {/* Horizontal — height split 1:2:1 */}
      <line
        className={LINE_CLASS}
        x1="0"
        y1="25%"
        x2="100%"
        y2="25%"
        pathLength={1}
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="0 1"
        vectorEffect="non-scaling-stroke"
      />
      <line
        className={LINE_CLASS}
        x1="0"
        y1="75%"
        x2="100%"
        y2="75%"
        pathLength={1}
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="0 1"
        vectorEffect="non-scaling-stroke"
      />
      {/* Vertical — width split 2:1:1 */}
      <line
        className={LINE_CLASS}
        x1="50%"
        y1="0"
        x2="50%"
        y2="100%"
        pathLength={1}
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="0 1"
        vectorEffect="non-scaling-stroke"
      />
      <line
        className={LINE_CLASS}
        x1="75%"
        y1="0"
        x2="75%"
        y2="100%"
        pathLength={1}
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="0 1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
