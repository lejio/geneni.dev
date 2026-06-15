// stores/poppedStore.ts
import { atom } from 'nanostores';

export interface LanguageEntry {
  name: string;
  value: number;
}

export const poppedLanguages = atom<string[]>([]);

export function addPoppedLanguage(name: string) {
  poppedLanguages.set([...new Set([...poppedLanguages.get(), name])]);
}

export const githubLanguages = atom<LanguageEntry[]>([]);

export const isNavOpen = atom<boolean>(false);

export function setIsNavOpen(bool: boolean) {
    isNavOpen.set(bool);
}

export type SiteTheme = "light" | "dark";

const THEME_STORAGE_KEY = "site-theme";

export const siteTheme = atom<SiteTheme>("light");

export function getStoredTheme(): SiteTheme {
  if (typeof window === "undefined") return "light";

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applySiteTheme(theme: SiteTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function setSiteTheme(theme: SiteTheme) {
  siteTheme.set(theme);
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
  applySiteTheme(theme);
}

export function toggleSiteTheme() {
  setSiteTheme(siteTheme.get() === "dark" ? "light" : "dark");
}