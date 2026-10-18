// Ilustración propia (SVG dibujado a mano, sin imágenes externas) para
// darle calidez al encabezado de Inicio: notebook, laptop, lapicera y café,
// en los mismos tokens de color que el resto de la app.

export function EscritorioEstudio({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 280" fill="none" className={className} aria-hidden="true">
      {/* sombra del escritorio */}
      <ellipse cx="210" cy="246" rx="175" ry="14" fill="var(--color-primary)" opacity="0.08" />

      {/* cuaderno abierto, apoyado detrás */}
      <g transform="translate(44,138) rotate(-8)">
        <rect x="0" y="0" width="150" height="104" rx="10" fill="var(--color-surface)" stroke="var(--color-border-strong)" strokeWidth="2" />
        <line x1="75" y1="6" x2="75" y2="98" stroke="var(--color-border-strong)" strokeWidth="2" />
        {[16, 30, 44, 58, 72, 86].map((y) => (
          <g key={y}>
            <line x1="14" y1={y} x2="68" y2={y} stroke="var(--color-border)" strokeWidth="3" strokeLinecap="round" />
            <line x1="82" y1={y} x2="136" y2={y} stroke="var(--color-border)" strokeWidth="3" strokeLinecap="round" />
          </g>
        ))}
      </g>

      {/* taza de café */}
      <g transform="translate(316,150)">
        <path d="M0 14 h46 v26 a23 23 0 0 1 -46 0 z" fill="var(--color-secondary)" />
        <path d="M44 20 q16 2 16 14 q0 14 -16 14" stroke="var(--color-secondary)" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="23" cy="14" rx="23" ry="5" fill="var(--color-secondary-strong)" />
        <path d="M10 -6 q4 8 -2 12" stroke="var(--color-border-strong)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        <path d="M24 -10 q4 8 -2 12" stroke="var(--color-border-strong)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      </g>

      {/* base de la laptop */}
      <path d="M100 196 L320 196 L336 216 L84 216 Z" fill="var(--color-primary-strong)" />
      <rect x="84" y="214" width="252" height="6" rx="3" fill="var(--color-primary-strong)" />

      {/* pantalla de la laptop */}
      <g transform="translate(118,64)">
        <rect x="0" y="0" width="184" height="134" rx="12" fill="var(--color-primary)" />
        <rect x="10" y="10" width="164" height="114" rx="6" fill="var(--color-surface-2)" />
        {/* mini "contenido" en pantalla, como fichas */}
        <rect x="22" y="24" width="60" height="10" rx="5" fill="var(--color-accent)" />
        <rect x="22" y="42" width="140" height="8" rx="4" fill="var(--color-border-strong)" opacity="0.5" />
        <rect x="22" y="56" width="110" height="8" rx="4" fill="var(--color-border-strong)" opacity="0.5" />
        <rect x="22" y="78" width="66" height="46" rx="6" fill="var(--color-mod-atencion-soft)" stroke="var(--color-mod-atencion)" strokeWidth="2" />
        <rect x="96" y="78" width="66" height="46" rx="6" fill="var(--color-mod-regular-soft)" stroke="var(--color-mod-regular)" strokeWidth="2" />
      </g>

      {/* lapicera, cruzando por delante */}
      <g transform="translate(246,196) rotate(38)">
        <rect x="0" y="0" width="92" height="14" rx="7" fill="var(--color-accent)" />
        <path d="M92 0 L108 7 L92 14 Z" fill="var(--color-accent-strong)" />
        <rect x="10" y="0" width="14" height="14" fill="var(--color-accent-strong)" opacity="0.5" />
      </g>

      {/* chispas decorativas */}
      <circle cx="366" cy="92" r="5" fill="var(--color-mod-aprender)" opacity="0.7" />
      <circle cx="30" cy="92" r="4" fill="var(--color-mod-organizar)" opacity="0.7" />
      <circle cx="380" cy="200" r="3.5" fill="var(--color-mod-escribir)" opacity="0.7" />
    </svg>
  )
}
