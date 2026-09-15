export const BADGE_OPTIONS = [
  { label: "Coming soon", value: "coming-soon" },
  { label: "New", value: "new" },
  { label: "Updated", value: "updated" },
  { label: "Beta", value: "beta" },
] as const;

export type NavBadge = (typeof BADGE_OPTIONS)[number]["value"];

export const BADGE_LABELS: Record<NavBadge, string> = {
  "coming-soon": "Coming soon",
  new: "New",
  updated: "Updated",
  beta: "Beta",
};

export type NavItem = {
  id: string;
  /** Label in the left nav list */
  title: string;
  /** Heading above the description in the detail panel */
  detailTitle: string;
  description: string;
  href?: string;
  badge?: NavBadge;
};

export function defaultNavIndex(items: NavItem[]): number {
  const blogIndex = items.findIndex(
    (item) => item.href === "/blog" || item.id === "blog",
  );
  return blogIndex >= 0 ? blogIndex : 0;
}
