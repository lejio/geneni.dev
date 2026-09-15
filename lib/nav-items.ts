import "server-only";

import { getPayloadClient } from "@/lib/payload";
import type { NavBadge, NavItem } from "@/lib/nav-constants";

export type { NavBadge, NavItem };
export { BADGE_LABELS, BADGE_OPTIONS, defaultNavIndex } from "@/lib/nav-constants";

/** Fallback when the CMS is empty or unreachable. */
export const FALLBACK_NAV_ITEMS: NavItem[] = [
  {
    id: "about",
    title: "About",
    detailTitle: "About",
    description:
      "Who I am, how I got here, and the threads that tie programming, photography, and trading together.",
  },
  {
    id: "blog",
    title: "Blog",
    detailTitle: "Blog",
    description:
      "Notes and essays on code, markets, and making pictures—published as they happen.",
    href: "/blog",
  },
  {
    id: "projects",
    title: "Projects",
    detailTitle: "Projects",
    description:
      "Selected builds and experiments, from side utilities to longer-running systems.",
    badge: "coming-soon",
  },
  {
    id: "photography",
    title: "Photography",
    detailTitle: "Photography",
    description:
      "A quieter gallery of light, place, and whatever the camera caught that day.",
    badge: "coming-soon",
  },
  {
    id: "trading",
    title: "Trading",
    detailTitle: "Trading",
    description:
      "Market notes, process, and the frameworks I use to think about risk and edge.",
    badge: "coming-soon",
  },
  {
    id: "experience",
    title: "Experience",
    detailTitle: "Experience",
    description:
      "Roles, labs, and the work that shaped how I build and ship software.",
    badge: "coming-soon",
  },
  {
    id: "contact",
    title: "Contact",
    detailTitle: "Contact",
    description: "Say hello—email, links, and the best ways to reach me.",
    badge: "coming-soon",
  },
  {
    id: "reading",
    title: "Reading List",
    detailTitle: "Reading List",
    description:
      "Books and papers that stuck: systems, markets, craft, and the odd detour.",
    badge: "coming-soon",
  },
  {
    id: "tools",
    title: "Tools",
    detailTitle: "Tools",
    description:
      "The stack and small utilities I reach for when starting something new.",
    badge: "coming-soon",
  },
  {
    id: "lab",
    title: "Lab",
    detailTitle: "Lab",
    description:
      "Half-finished ideas, prototypes, and sandboxes that might become something.",
    badge: "coming-soon",
  },
  {
    id: "archive",
    title: "Archive",
    detailTitle: "Archive",
    description:
      "Older posts and projects kept for context rather than polish.",
    badge: "coming-soon",
  },
  {
    id: "now",
    title: "Now",
    detailTitle: "Now",
    description:
      "What I am focused on this season—work, practice, and open questions.",
    badge: "coming-soon",
  },
  {
    id: "bookmarks",
    title: "Bookmarks",
    detailTitle: "Bookmarks",
    description:
      "Links worth keeping: essays, docs, and references I return to often.",
    badge: "coming-soon",
  },
  {
    id: "sketches",
    title: "Sketches",
    detailTitle: "Sketches",
    description:
      "Loose visual studies—composition, color, and process without the final frame.",
    badge: "coming-soon",
  },
  {
    id: "notes",
    title: "Field Notes",
    detailTitle: "Field Notes",
    description:
      "Short observations from builds, shoots, and sessions at the desk.",
    badge: "coming-soon",
  },
  {
    id: "colophon",
    title: "Colophon",
    detailTitle: "Colophon",
    description:
      "How this site is made: stack, typography, and the choices behind the layout.",
    badge: "coming-soon",
  },
  {
    id: "music",
    title: "Music",
    detailTitle: "Music",
    description:
      "Playlists and albums that score late nights writing code or editing photos.",
    badge: "coming-soon",
  },
  {
    id: "travel",
    title: "Travel",
    detailTitle: "Travel",
    description:
      "Places I have been and the frames that came home with me.",
    badge: "coming-soon",
  },
  {
    id: "uses",
    title: "Uses",
    detailTitle: "Uses",
    description:
      "Hardware, software, and habits that make up a typical day of work.",
    badge: "coming-soon",
  },
  {
    id: "credits",
    title: "Credits",
    detailTitle: "Credits",
    description:
      "People, libraries, and sources this site leans on—with thanks.",
    badge: "coming-soon",
  },
];

type CmsNavItem = {
  id?: string | null;
  title?: string | null;
  detailTitle?: string | null;
  description: string;
  href?: string | null;
  badge?: NavBadge | null;
};

export async function getNavItems(): Promise<NavItem[]> {
  try {
    const payload = await getPayloadClient();
    const navigation = await payload.findGlobal({
      slug: "navigation",
      depth: 0,
    });

    const items = navigation?.items;
    if (!items?.length) return FALLBACK_NAV_ITEMS;

    return items.map((item: CmsNavItem, index: number) => {
      const title = item.title?.trim() || "";
      const detailTitle = item.detailTitle?.trim() || title;

      return {
        id: item.id || `nav-${index}`,
        title,
        detailTitle,
        description: item.description,
        href: item.href?.trim() || undefined,
        badge: item.badge || undefined,
      };
    });
  } catch {
    return FALLBACK_NAV_ITEMS;
  }
}
