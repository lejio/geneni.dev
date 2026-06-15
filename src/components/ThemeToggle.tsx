import { useEffect } from "react";
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import { useStore } from "@nanostores/react";
import {
  getStoredTheme,
  setSiteTheme,
  siteTheme,
  toggleSiteTheme,
} from "../lib/stores";

export default function ThemeToggle() {
  const theme = useStore(siteTheme);

  useEffect(() => {
    setSiteTheme(getStoredTheme());
  }, []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleSiteTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 transition-colors duration-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
    >
      {isDark ? <IoMdSunny size={20} /> : <IoMdMoon size={20} />}
    </button>
  );
}
