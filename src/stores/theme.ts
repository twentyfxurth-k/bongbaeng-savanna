// stores/theme.ts — theme state, 3 modes: white | light | dark
import { persistentAtom } from '@nanostores/persistent';

export type Theme = 'white' | 'light' | 'dark';

export const THEMES: Theme[] = ['white', 'light', 'dark'];

export const $theme = persistentAtom<Theme>('bb-theme', 'dark');

export function cycleTheme(): void {
  const current = $theme.get();
  const idx = THEMES.indexOf(current);
  const next = THEMES[(idx + 1) % THEMES.length];
  $theme.set(next);
}

export const THEME_LABELS: Record<Theme, string> = {
  white: 'White',
  light: 'Light',
  dark: 'Dark',
};
