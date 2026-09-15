"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  BADGE_LABELS,
  defaultNavIndex,
  type NavItem,
} from "@/lib/nav-constants";

const SCALE_FALLOFF = 0.9;
const ITEM_HEIGHT = 72;
const ITEM_GAP = 50;
const ITEM_STEP = ITEM_HEIGHT + ITEM_GAP;
const ITEM_FONT_BASE = 1.5;
const ITEM_FONT_GROWTH = 1.5;
const WHEEL_THRESHOLD = 40;

type NavMenuProps = {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
};

function scaleForDistance(distance: number): number {
  return Math.pow(SCALE_FALLOFF, distance);
}

function opacityForDistance(distance: number): number {
  return Math.max(0.28, 1 - distance * 0.18);
}

function badgeLabel(item: NavItem): string | null {
  if (!item.badge) return null;
  return BADGE_LABELS[item.badge];
}

export function NavMenu({ open, onClose, items }: NavMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(() =>
    defaultNavIndex(items),
  );
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const wheelDeltaRef = useRef(0);

  const selected = items[selectedIndex] ?? items[0];

  const moveSelection = useEffectEvent((delta: number) => {
    setSelectedIndex((current) =>
      Math.min(items.length - 1, Math.max(0, current + delta)),
    );
  });

  const activateSelected = useEffectEvent(() => {
    const item = items[selectedIndex];
    if (item?.href) {
      window.location.assign(item.href);
    }
  });

  useEffect(() => {
    setSelectedIndex(defaultNavIndex(items));
  }, [items]);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        moveSelection(event.key === "ArrowDown" ? 1 : -1);
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        activateSelected();
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      wheelDeltaRef.current += event.deltaY;
      if (Math.abs(wheelDeltaRef.current) < WHEEL_THRESHOLD) return;
      moveSelection(wheelDeltaRef.current > 0 ? 1 : -1);
      wheelDeltaRef.current = 0;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
    };
  }, [open, onClose]);

  if (!open || !selected || items.length === 0) return null;

  const listOffset = -selectedIndex * ITEM_STEP;
  const maxFontSize = `${ITEM_FONT_BASE + ITEM_FONT_GROWTH}rem`;
  const selectedBadge = badgeLabel(selected);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-50 flex animate-[nav-fade-in_220ms_ease-out] bg-background text-foreground"
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 z-10 text-sm tracking-wide text-foreground/60 underline-offset-4 hover:text-foreground hover:underline"
      >
        Close
      </button>

      <div className="relative h-full shrink-0 overflow-hidden border-r border-foreground/10">
        <div
          aria-hidden
          className="invisible flex w-max flex-col font-heading tracking-tight"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="whitespace-nowrap px-8"
              style={{ height: 0, fontSize: maxFontSize }}
            >
              {item.title}
            </div>
          ))}
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-x-0 top-1/2 flex flex-col items-start will-change-transform transition-transform duration-300 ease-out"
            style={{
              transform: `translateY(calc(-${ITEM_HEIGHT / 2}px + ${listOffset}px))`,
            }}
          >
            {items.map((item, index) => {
              const distance = Math.abs(index - selectedIndex);
              const scale = scaleForDistance(distance);
              const opacity = opacityForDistance(distance);
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (isSelected && item.href) {
                      window.location.assign(item.href);
                      return;
                    }
                    setSelectedIndex(index);
                  }}
                  className="origin-left whitespace-nowrap px-8 text-left font-heading tracking-tight transition-[transform,opacity,color] duration-300 ease-out"
                  style={{
                    height: ITEM_HEIGHT,
                    marginBottom: ITEM_GAP,
                    fontSize: `${ITEM_FONT_BASE + scale * ITEM_FONT_GROWTH}rem`,
                    transform: `scale(${scale})`,
                    opacity,
                    color: isSelected
                      ? "var(--foreground)"
                      : "color-mix(in srgb, var(--foreground) 55%, transparent)",
                  }}
                  aria-current={isSelected ? "page" : undefined}
                >
                  {item.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative flex h-full min-w-0 flex-1 flex-col justify-center px-12 py-24 md:px-20">
        <div
          key={selected.id}
          className="max-w-xl animate-[nav-detail-in_280ms_ease-out]"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-foreground/45">
            {selectedBadge ?? "Selected"}
          </p>
          <h2 className="font-heading text-2xl tracking-tight md:text-3xl">
            {selected.detailTitle}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/70">
            {selected.description}
          </p>
          {selected.href ? (
            <p className="mt-10">
              <Link
                href={selected.href}
                aria-label={`Open ${selected.detailTitle}`}
                className="inline-flex items-center text-foreground/70 transition-colors hover:text-foreground"
              >
                <ArrowRight size={28} weight="regular" aria-hidden />
              </Link>
            </p>
          ) : (
            <p className="mt-10 text-sm text-foreground/40">Coming soon</p>
          )}
        </div>
      </div>
    </div>
  );
}
