import * as React from 'react'
import { motion } from 'framer-motion'
import { Award, Lock, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Insignia } from '@/lib/gamificacion'

export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: {
  title: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-end justify-between gap-3', className)}>
      <div>
        <h1 className="font-display text-[35px] font-bold leading-tight tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1.5 text-[15.5px] leading-relaxed text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center', className)}>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface-2">
        <Icon className="h-5 w-5 text-faint" />
      </div>
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

const STAT_TONE = {
  primario: { wash: 'var(--color-primary-soft)', badge: 'bg-primary text-primary-foreground shadow-[0_5px_12px_-4px_var(--color-primary)]', border: 'border-primary/15' },
  acento: { wash: 'var(--color-accent-soft)', badge: 'bg-accent text-accent-foreground shadow-[0_5px_12px_-4px_var(--color-accent)]', border: 'border-accent/15' },
  secundario: { wash: 'var(--color-secondary-soft)', badge: 'bg-secondary text-secondary-foreground shadow-[0_5px_12px_-4px_var(--color-secondary)]', border: 'border-secondary/15' },
  neutro: { wash: 'var(--color-warning-soft)', badge: 'bg-warning text-white shadow-[0_5px_12px_-4px_var(--color-warning)]', border: 'border-warning/15' },
} as const

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'primario',
}: {
  icon: LucideIcon
  label: string
  value: React.ReactNode
  hint?: string
  tone?: keyof typeof STAT_TONE
}) {
  const t = STAT_TONE[tone]
  return (
    <div
      className={cn('rounded-xl border p-4 shadow-[0_2px_6px_rgba(16,24,32,0.05),0_10px_22px_-12px_rgba(16,24,32,0.14)]', t.border)}
      style={{ background: `linear-gradient(145deg, ${t.wash}, var(--color-surface) 65%)` }}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', t.badge)}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-[12.5px] font-medium">{label}</span>
      </div>
      <div className="mt-2 text-[30px] font-semibold tracking-tight">{value}</div>
      {hint && <p className="mt-0.5 text-[12px] text-faint">{hint}</p>}
    </div>
  )
}

const ICON_BADGE_TONE = {
  primario: 'bg-primary text-primary-foreground',
  acento: 'bg-accent text-accent-foreground',
  secundario: 'bg-secondary text-secondary-foreground',
  dorado: 'bg-warning text-white',
} as const

/** Ícono dentro de un círculo de color — para que los encabezados de tarjeta
 *  se sientan como "stickers" en vez de un ícono gris plano junto al texto. */
export function IconBadge({
  icon: Icon,
  tone = 'primario',
  className,
}: {
  icon: LucideIcon
  tone?: keyof typeof ICON_BADGE_TONE
  className?: string
}) {
  return (
    <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full shadow-sm', ICON_BADGE_TONE[tone], className)}>
      <Icon className="h-3.5 w-3.5" />
    </span>
  )
}

export function FadeIn({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function InsigniasRow({ insignias, className }: { insignias: Insignia[]; className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {insignias.map((i) => (
        <div
          key={i.id}
          title={i.descripcion}
          className={cn(
            'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors',
            i.conseguida ? 'border-accent/40 bg-accent-soft text-accent-strong' : 'border-dashed text-faint',
          )}
        >
          {i.conseguida ? <Award className="h-3.5 w-3.5" /> : <Lock className="h-3 w-3" />}
          {i.titulo}
        </div>
      ))}
    </div>
  )
}

/** Aviso obligatorio (Anexo C del documento maestro): la herramienta orienta, no diagnostica. */
export function AvisoOrientativo({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <p className={cn('rounded-lg border border-dashed bg-surface-2 px-3 py-2 text-[12px] text-muted-foreground', className)}>
      {children ?? 'Esta herramienta orienta la intervención y no reemplaza una evaluación diagnóstica.'}
    </p>
  )
}
