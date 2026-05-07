export function OliveLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Olive tree branch */}
      <path d="M20 60 Q40 50, 60 55 T100 50" stroke="#6B5D3F" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Small branch extending down */}
      <path d="M60 55 Q58 65, 55 75" stroke="#6B5D3F" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Leaves on the branch */}
      <ellipse cx="35" cy="45" rx="8" ry="14" fill="#7A9B3A" opacity="0.9" transform="rotate(-25 35 45)" />
      <ellipse cx="50" cy="48" rx="7" ry="13" fill="#8BAF47" opacity="0.9" transform="rotate(15 50 48)" />
      <ellipse cx="70" cy="52" rx="8" ry="14" fill="#7A9B3A" opacity="0.9" transform="rotate(-30 70 52)" />
      <ellipse cx="85" cy="48" rx="7" ry="12" fill="#8BAF47" opacity="0.9" transform="rotate(20 85 48)" />

      {/* Main olive fruit - hanging from small branch */}
      <ellipse cx="55" cy="80" rx="12" ry="15" fill="#6B7F3A" />
      <ellipse cx="55" cy="80" rx="12" ry="15" fill="url(#oliveGradient)" />

      {/* Highlight on olive */}
      <ellipse cx="52" cy="76" rx="4" ry="5" fill="#9BAF6A" opacity="0.6" />

      {/* Small stem connecting olive to branch */}
      <line x1="55" y1="65" x2="55" y2="75" stroke="#6B5D3F" strokeWidth="1.5" />

      {/* Gradient definition for olive */}
      <defs>
        <radialGradient id="oliveGradient" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#8BAF47" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#5A6B2F" stopOpacity="0.3" />
        </radialGradient>
      </defs>
    </svg>
  )
}
