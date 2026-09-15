export type NavItem = {
  id: string;
  title: string;
  description: string;
  href?: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    id: "about",
    title: "About",
    description:
      "Who I am, how I got here, and the threads that tie programming, photography, and trading together.",
  },
  {
    id: "blog",
    title: "Blog",
    description:
      "Notes and essays on code, markets, and making pictures—published as they happen.",
    href: "/blog",
  },
  {
    id: "projects",
    title: "Projects",
    description:
      "Selected builds and experiments, from side utilities to longer-running systems.",
  },
  {
    id: "photography",
    title: "Photography",
    description:
      "A quieter gallery of light, place, and whatever the camera caught that day.",
  },
  {
    id: "trading",
    title: "Trading",
    description:
      "Market notes, process, and the frameworks I use to think about risk and edge.",
  },
  {
    id: "experience",
    title: "Experience",
    description:
      "Roles, labs, and the work that shaped how I build and ship software.",
  },
  {
    id: "contact",
    title: "Contact",
    description:
      "Say hello—email, links, and the best ways to reach me.",
  },
  {
    id: "reading",
    title: "Reading List",
    description:
      "Books and papers that stuck: systems, markets, craft, and the odd detour.",
  },
  {
    id: "tools",
    title: "Tools",
    description:
      "The stack and small utilities I reach for when starting something new.",
  },
  {
    id: "lab",
    title: "Lab",
    description:
      "Half-finished ideas, prototypes, and sandboxes that might become something.",
  },
  {
    id: "archive",
    title: "Archive",
    description:
      "Older posts and projects kept for context rather than polish.",
  },
  {
    id: "now",
    title: "Now",
    description:
      "What I am focused on this season—work, practice, and open questions.",
  },
  {
    id: "bookmarks",
    title: "Bookmarks",
    description:
      "Links worth keeping: essays, docs, and references I return to often.",
  },
  {
    id: "sketches",
    title: "Sketches",
    description:
      "Loose visual studies—composition, color, and process without the final frame.",
  },
  {
    id: "notes",
    title: "Field Notes",
    description:
      "Short observations from builds, shoots, and sessions at the desk.",
  },
  {
    id: "colophon",
    title: "Colophon",
    description:
      "How this site is made: stack, typography, and the choices behind the layout.",
  },
  {
    id: "music",
    title: "Music",
    description:
      "Playlists and albums that score late nights writing code or editing photos.",
  },
  {
    id: "travel",
    title: "Travel",
    description:
      "Places I have been and the frames that came home with me.",
  },
  {
    id: "uses",
    title: "Uses",
    description:
      "Hardware, software, and habits that make up a typical day of work.",
  },
  {
    id: "credits",
    title: "Credits",
    description:
      "People, libraries, and sources this site leans on—with thanks.",
  },
];

export const DEFAULT_NAV_INDEX = NAV_ITEMS.findIndex((item) => item.id === "blog");
