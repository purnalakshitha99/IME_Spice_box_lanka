import { Link } from 'react-router-dom'

export function Logo({ className = '', light = false }: { className?: string; light?: boolean }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          light ? 'bg-cream/15' : 'bg-cinnamon'
        }`}
        aria-hidden
      >
        <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none">
          <path
            d="M16 4c-1.2 5-6 8.5-6 14a6 6 0 0012 0c0-5.5-4.8-9-6-14z"
            fill="#C4A35A"
          />
          <path
            d="M10 20c2.5 4 6 5.5 6 5.5s3.5-1.5 6-5.5"
            stroke={light ? '#F7F0E6' : '#1F3D2B'}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <rect x="9" y="24" width="14" height="4" rx="1" fill="#F7F0E6" />
        </svg>
      </span>
      <span className="leading-tight">
        <span
          className={`block font-display text-lg font-semibold tracking-[0.04em] ${
            light ? 'text-cream' : 'text-cinnamon'
          }`}
        >
          SPICEBOX
        </span>
        <span
          className={`block text-[10px] font-medium uppercase tracking-[0.28em] ${
            light ? 'text-gold' : 'text-forest'
          }`}
        >
          Lanka
        </span>
      </span>
    </Link>
  )
}
