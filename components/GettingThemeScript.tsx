import React from "react";

/**
 * Injects a blocking inline script into <head> that resolves the theme
 * (dark / light) **before** the first paint, preventing a flash of the
 * wrong theme (FOIT).
 *
 * 1. Read the user's persisted preference from localStorage.
 * 2. If no preference is stored, fall back to the OS-level
 *    `prefers-color-scheme` media query.
 * 3. Apply or remove the `dark` class on <html> immediately so Tailwind's
 *    dark-mode variant kicks in before React hydrates.
 *
 * Wrapped in a try/catch so private-browsing or storage-disabled browsers
 * don't throw and block rendering.
 */
const GettingThemeScript = () => {
  return (
    <head>
      <script
        dangerouslySetInnerHTML={{
          __html: `
              try {
                let isDark = false;
                const stored = localStorage.getItem('bosta_drive_theme');
                if (stored === 'dark') isDark = true;
                else if (stored === 'light') isDark = false;
                else isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                
                if (isDark) document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
              } catch (_) {}
            `,
        }}
      />
    </head>
  );
};

export default GettingThemeScript;
