// ThemeToggle.tsx — React island, cycles white → light → dark
import { useStore } from '@nanostores/react';
import { $theme, cycleTheme, THEME_LABELS, type Theme } from '../stores/theme';
import { useEffect } from 'react';

const THEME_ICONS: Record<Theme, string> = {
  white: '☀️',
  light: '🌤️',
  dark: '🌙',
};

export default function ThemeToggle() {
  const theme = useStore($theme);

  // Sync data-theme attr on <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <button
      onClick={cycleTheme}
      aria-label={`สลับธีม (ปัจจุบัน: ${THEME_LABELS[theme]}) — คลิกเพื่อเปลี่ยน`}
      title={`ธีมปัจจุบัน: ${THEME_LABELS[theme]} — คลิกเพื่อสลับ`}
      className="theme-toggle-btn"
      style={{
        background: 'transparent',
        border: '2px solid var(--border-ui)',   /* was --border → 1.38:1 FAIL; now ≥3:1 ✅ */
        borderRadius: '0.5rem',
        padding: '0.375rem 0.75rem',
        cursor: 'pointer',
        color: 'var(--text-primary)',           /* highest contrast on all themes */
        fontSize: '0.875rem',
        fontFamily: 'var(--font-sans)',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '0.375rem',
        transition: 'border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease',
        lineHeight: 1.4,
      }}
    >
      <span aria-hidden="true">{THEME_ICONS[theme]}</span>
      <span>{THEME_LABELS[theme]}</span>
    </button>
  );
}
