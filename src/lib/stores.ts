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