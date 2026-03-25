import React from "react";

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
