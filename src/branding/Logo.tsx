import { cn } from '@/lib/utils'
import iconMark from '@/assets/branding/icon-mark.png'
import logoFull from '@/assets/branding/logo-full.png'

// ============================================================
// Identidad visual Método Estudio: isotipo "E" (logo original de la
// usuaria, en rojo ladrillo y azul marino). El isotipo chico (sidebar,
// pestaña) es un recorte ajustado de la misma imagen; la portada grande
// (BrandCover) usa el isologo completo con el círculo y el wordmark.
// ============================================================

interface LogoProps {
  className?: string
  /** tamaño en px del isotipo */
  size?: number
}

export function Isotipo({ className, size = 32 }: LogoProps) {
  return (
    <img
      src={iconMark}
      alt="Método Estudio"
      width={size}
      height={size}
      className={cn('shrink-0 rounded-md object-contain', className)}
      style={{ width: size, height: size }}
    />
  )
}

export function LogoHorizontal({ className, size = 30 }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <Isotipo size={size} />
      <div className="flex flex-col leading-none">
        <span className="font-display text-[16px] font-semibold tracking-tight text-foreground">
          Método <span className="text-accent">Estudio</span>
        </span>
        <span className="mt-0.5 text-[10px] font-medium tracking-[0.14em] text-faint uppercase">
          Lic. Irene Morbidelli
        </span>
      </div>
    </div>
  )
}

/** Isologo completo (círculo + "E" + wordmark) para portada y usos grandes. */
export function BrandCover({ className }: { className?: string }) {
  return (
    <div className={cn('select-none', className)}>
      <img
        src={logoFull}
        alt="Método Estudio"
        className="mx-auto w-full max-w-[220px]"
        style={{ filter: 'drop-shadow(0 14px 20px color-mix(in srgb, var(--color-accent) 35%, transparent))' }}
      />
      <p className="mt-3 text-center text-[11.5px] font-bold uppercase tracking-[0.18em] text-accent-strong">
        Conocé · Practicá · Mejorá
      </p>
    </div>
  )
}
