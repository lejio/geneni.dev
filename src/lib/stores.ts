import { atom } from 'nanostores';

export type NavItem = {
  name: string;
  href: string;
  color: string;
};

export const currHover = atom<NavItem | null>(null);