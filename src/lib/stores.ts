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