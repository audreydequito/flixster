// Reusable inline SVG icons. All use `currentColor` so color is controlled
// via CSS; pass `size` to scale (default 20).

export function StarIcon({ size = 16, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...props}>
      <path
        d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.56l-5.9 3.11 1.13-6.57L2.45 9.44l6.6-.96L12 2.5z"
        fill="currentColor"
      />
    </svg>
  );
}

export function HeartIcon({ size = 20, filled = false, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...props}>
      <path
        d="M12 20.7l-1.32-1.18C5.96 15.3 3 12.62 3 9.3 3 6.74 5.01 4.8 7.5 4.8c1.46 0 2.86.67 3.76 1.74L12 7.3l.74-.76C13.64 5.47 15.04 4.8 16.5 4.8 18.99 4.8 21 6.74 21 9.3c0 3.32-2.96 6-7.68 10.22L12 20.7z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EyeIcon({ size = 20, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...props}>
      <path
        d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

export function EyeOffIcon({ size = 20, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M2 9c3.5 4 16.5 4 20 0" />
        <line x1="4" y1="12.5" x2="3" y2="15.5" />
        <line x1="8" y1="14" x2="7.4" y2="17" />
        <line x1="12" y1="14.4" x2="12" y2="17.6" />
        <line x1="16" y1="14" x2="16.6" y2="17" />
        <line x1="20" y1="12.5" x2="21" y2="15.5" />
      </g>
    </svg>
  );
}

export function CloseIcon({ size = 18, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...props}>
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="18" y1="6" x2="6" y2="18" />
      </g>
    </svg>
  );
}

export function MenuIcon({ size = 24, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...props}>
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="20" y2="17" />
      </g>
    </svg>
  );
}

export function SearchIcon({ size = 16, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <line x1="16.5" y1="16.5" x2="21" y2="21" />
      </g>
    </svg>
  );
}

export function FilmIcon({ size = 24, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <line x1="7" y1="4" x2="7" y2="20" />
        <line x1="17" y1="4" x2="17" y2="20" />
        <line x1="3" y1="12" x2="21" y2="12" />
      </g>
    </svg>
  );
}

export function PlayIcon({ size = 16, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...props}>
      <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
  );
}
