import type { ReactNode } from 'react'

/** Ilustraciones esquemáticas propias para cada herramienta — simples, en los
 *  colores de la app, pensadas para estudiantes que necesitan apoyo visual
 *  además del texto. No son fotos ni íconos de stock: son dibujos a medida. */
function Marco({ children, fondo }: { children: ReactNode; fondo: string }) {
  return (
    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl" style={{ background: fondo }}>
      <svg width="60" height="60" viewBox="0 0 64 64" fill="none">
        {children}
      </svg>
    </div>
  )
}

export function IlustracionMapas() {
  return (
    <Marco fondo="var(--color-primary-soft)">
      <line x1="32" y1="18" x2="16" y2="42" stroke="var(--color-border-strong)" strokeWidth="2" />
      <line x1="32" y1="18" x2="48" y2="42" stroke="var(--color-border-strong)" strokeWidth="2" />
      <circle cx="32" cy="14" r="8" fill="var(--color-primary)" />
      <circle cx="14" cy="46" r="7" fill="var(--color-accent)" />
      <circle cx="50" cy="46" r="7" fill="var(--color-secondary)" />
    </Marco>
  )
}

export function IlustracionFichas() {
  return (
    <Marco fondo="var(--color-accent-soft)">
      <rect x="9" y="18" width="34" height="24" rx="4" fill="var(--surface)" stroke="var(--color-accent)" strokeWidth="2" transform="rotate(-8 26 30)" />
      <rect x="21" y="22" width="34" height="24" rx="4" fill="var(--color-accent)" />
      <path d="M31 36l4 4 8-9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Marco>
  )
}

export function IlustracionEvaluacion() {
  return (
    <Marco fondo="var(--color-mod-regular-soft)">
      <rect x="24" y="6" width="16" height="8" rx="2" fill="var(--color-mod-regular)" />
      <rect x="14" y="10" width="36" height="46" rx="4" fill="var(--surface)" stroke="var(--color-mod-regular)" strokeWidth="2" />
      <path d="M20 29l3 3 6-7" stroke="var(--color-mod-regular)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="33" y1="30" x2="44" y2="30" stroke="var(--color-border-strong)" strokeWidth="2" />
      <path d="M20 42l3 3 6-7" stroke="var(--color-mod-regular)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="33" y1="43" x2="44" y2="43" stroke="var(--color-border-strong)" strokeWidth="2" />
    </Marco>
  )
}

export function IlustracionMemotest() {
  return (
    <Marco fondo="var(--color-primary-soft)">
      <rect x="8" y="8" width="20" height="20" rx="3" fill="var(--color-primary)" />
      <rect x="36" y="8" width="20" height="20" rx="3" fill="var(--color-primary)" />
      <rect x="8" y="36" width="20" height="20" rx="3" fill="var(--surface)" stroke="var(--color-mod-regular)" strokeWidth="2" />
      <rect x="36" y="36" width="20" height="20" rx="3" fill="var(--surface)" stroke="var(--color-mod-regular)" strokeWidth="2" />
      <path d="M13 46l2.5 2.5L21 43" stroke="var(--color-mod-regular)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M41 46l2.5 2.5L49 43" stroke="var(--color-mod-regular)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </Marco>
  )
}

export function IlustracionCuadros() {
  return (
    <Marco fondo="var(--color-accent-soft)">
      <rect x="8" y="10" width="48" height="12" rx="2" fill="var(--color-accent)" />
      <rect x="8" y="22" width="48" height="32" rx="2" fill="none" stroke="var(--color-border-strong)" strokeWidth="2" />
      <line x1="29" y1="10" x2="29" y2="54" stroke="var(--color-border-strong)" strokeWidth="2" />
      <line x1="8" y1="38" x2="56" y2="38" stroke="var(--color-border-strong)" strokeWidth="2" />
    </Marco>
  )
}

export function IlustracionLineasTiempo() {
  return (
    <Marco fondo="var(--color-mod-regular-soft)">
      <line x1="8" y1="32" x2="56" y2="32" stroke="var(--color-mod-regular)" strokeWidth="2.5" />
      <circle cx="14" cy="32" r="5" fill="var(--surface)" stroke="var(--color-mod-regular)" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="5" fill="var(--surface)" stroke="var(--color-mod-regular)" strokeWidth="2.5" />
      <circle cx="50" cy="32" r="5" fill="var(--surface)" stroke="var(--color-mod-regular)" strokeWidth="2.5" />
    </Marco>
  )
}

export function IlustracionDiario() {
  return (
    <Marco fondo="var(--color-primary-soft)">
      <rect x="12" y="8" width="36" height="48" rx="4" fill="var(--surface)" stroke="var(--color-primary)" strokeWidth="2" />
      <line x1="19" y1="20" x2="41" y2="20" stroke="var(--color-border-strong)" strokeWidth="2" />
      <line x1="19" y1="28" x2="41" y2="28" stroke="var(--color-border-strong)" strokeWidth="2" />
      <line x1="19" y1="36" x2="33" y2="36" stroke="var(--color-border-strong)" strokeWidth="2" />
      <path d="M30 41l2 4.3 4.7.6-3.4 3.3.8 4.6-4.1-2.2-4.1 2.2.8-4.6-3.4-3.3 4.7-.6z" fill="var(--color-warning)" />
    </Marco>
  )
}

export function IlustracionAprendizajesSesion() {
  return (
    <Marco fondo="var(--color-accent-soft)">
      <path
        d="M10 14h36a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H26l-9 8v-8h-3a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z"
        fill="var(--surface)"
        stroke="var(--color-accent)"
        strokeWidth="2"
      />
      <path d="M28 21l2 4.2 4.6.6-3.3 3.2.8 4.5-4.1-2.1-4.1 2.1.8-4.5-3.3-3.2 4.6-.6z" fill="var(--color-warning)" />
    </Marco>
  )
}

export function IlustracionGuiaTextos() {
  return (
    <Marco fondo="var(--color-secondary-soft)">
      <rect x="14" y="8" width="36" height="48" rx="3" fill="var(--surface)" stroke="var(--color-secondary)" strokeWidth="2" />
      <rect x="20" y="18" width="24" height="6" rx="1.5" fill="var(--color-warning-soft)" />
      <line x1="20" y1="30" x2="44" y2="30" stroke="var(--color-border-strong)" strokeWidth="2" />
      <line x1="20" y1="37" x2="38" y2="37" stroke="var(--color-border-strong)" strokeWidth="2" />
      <path d="M19 47l3.5 3.5L31 42" stroke="var(--color-mod-regular)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Marco>
  )
}

export function IlustracionHorarioCursada() {
  return (
    <Marco fondo="var(--color-primary-soft)">
      <rect x="8" y="10" width="48" height="44" rx="3" fill="none" stroke="var(--color-border-strong)" strokeWidth="2" />
      <line x1="8" y1="22" x2="56" y2="22" stroke="var(--color-border-strong)" strokeWidth="2" />
      <line x1="20" y1="10" x2="20" y2="54" stroke="var(--color-border-strong)" strokeWidth="2" />
      <line x1="32" y1="10" x2="32" y2="54" stroke="var(--color-border-strong)" strokeWidth="2" />
      <line x1="44" y1="10" x2="44" y2="54" stroke="var(--color-border-strong)" strokeWidth="2" />
      <rect x="21" y="30" width="10" height="10" rx="1.5" fill="var(--color-primary)" />
      <rect x="45" y="42" width="10" height="10" rx="1.5" fill="var(--color-accent)" />
    </Marco>
  )
}

export function IlustracionDistribucionActividades() {
  return (
    <Marco fondo="var(--color-accent-soft)">
      <circle cx="32" cy="32" r="22" fill="none" stroke="var(--color-border)" strokeWidth="10" />
      <circle
        cx="32"
        cy="32"
        r="22"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="10"
        strokeDasharray="58 80"
        strokeLinecap="round"
        transform="rotate(-90 32 32)"
      />
      <circle
        cx="32"
        cy="32"
        r="22"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="10"
        strokeDasharray="34 104"
        strokeDashoffset="-58"
        strokeLinecap="round"
        transform="rotate(-90 32 32)"
      />
    </Marco>
  )
}
