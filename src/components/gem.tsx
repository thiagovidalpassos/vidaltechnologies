// Pedrinha dourada que flutua no fundo, a mesma da landing page.
export function Gem({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      className={`gem pointer-events-none absolute ${className}`}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      <polygon points="50,4 82,18 96,50 84,80 52,96 20,86 4,54 16,20" fill="#c99400" />
      <polygon points="50,4 82,18 60,44 30,30" fill="#ffd54a" />
      <polygon points="82,18 96,50 72,58 60,44" fill="#fbc105" />
      <polygon points="30,30 60,44 72,58 52,74 26,62" fill="#e8ae00" />
      <polygon points="16,20 50,4 30,30 4,54" fill="#fbc105" />
      <polygon points="4,54 26,62 20,86" fill="#a87b00" />
      <polygon points="26,62 52,74 52,96 20,86" fill="#b98900" />
      <polygon points="52,74 72,58 96,50 84,80 52,96" fill="#8e6800" />
    </svg>
  );
}
