"use client";

import { useState } from "react";
import { NavMenu } from "@/components/NavMenu";
import type { NavItem } from "@/lib/nav-constants";

type HomeNavProps = {
  items: NavItem[];
};

export function HomeNav({ items }: HomeNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        className="underline underline-offset-4 hover:text-foreground/80"
      >
        Read the blog
      </button>
      <NavMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={items}
      />
    </>
  );
}
