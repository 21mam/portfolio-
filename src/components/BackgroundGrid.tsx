import { useEffect, useState } from 'react';
import DotGrid from './DotGrid';

type Theme = 'light' | 'dark';

const palettes: Record<Theme, { baseColor: string; activeColor: string; opacity: number; glow: number }> = {
  light: {
    baseColor: '#b9b0cc',
    activeColor: '#6d4aff',
    opacity: 0.52,
    glow: 0.3,
  },
  dark: {
    baseColor: '#3a3446',
    activeColor: '#ffffff',
    opacity: 0.78,
    glow: 0.5,
  },
};

/**
 * Fixed, full-viewport WebGL dot grid. React is used only for this island so
 * the rest of the site stays static HTML. The palette follows the active theme.
 */
export default function BackgroundGrid() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    setSupported(Boolean(gl));
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  }, []);

  useEffect(() => {
    const update = () => {
      setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    window.addEventListener('themechange', update);

    return () => {
      observer.disconnect();
      window.removeEventListener('themechange', update);
    };
  }, []);

  if (supported === null) {
    return <div className="bg-grid" aria-hidden="true" />;
  }

  if (!supported) {
    return <div className="bg-grid bg-grid--fallback" aria-hidden="true" />;
  }

  const palette = palettes[theme];

  return (
    <div className="bg-grid" aria-hidden="true">
      <DotGrid
        baseColor={palette.baseColor}
        activeColor={palette.activeColor}
        shape="circle"
        dotSize={4}
        gap={22}
        proximity={140}
        strength={0.9}
        bounce={0.55}
        tension={0.35}
        returnDuration={0.9}
        shockRadius={300}
        shockStrength={4}
        swell={0.7}
        stretch={0.4}
        glow={palette.glow}
        fade={0.35}
        opacity={palette.opacity}
        intro
      />
    </div>
  );
}