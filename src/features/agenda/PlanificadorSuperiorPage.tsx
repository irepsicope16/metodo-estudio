import { Backpack, BookOpenCheck, Cake, FileText, GraduationCap, StickyNote } from 'lucide-react'
import { planificadorSuperiorHooks } from '@/hooks/queries'
import { gamaTonal, PlanificadorSemanal, type TipoEventoConfig } from './PlanificadorSemanal'
import type { TipoEvento } from '@/types'

const TIPOS: Partial<Record<TipoEvento, TipoEventoConfig>> = {
  tp: { label: 'TP', icon: FileText, color: 'var(--color-secondary)' },
  parcial: { label: 'Parcial', icon: BookOpenCheck, color: 'var(--color-warning)' },
  final: { label: 'Final', icon: GraduationCap, color: 'var(--color-danger)' },
  material: { label: 'Material', icon: Backpack, color: 'var(--color-mod-organizar)' },
  cumpleanos: { label: 'Cumpleaños', icon: Cake, color: 'var(--color-mod-aprender)' },
  nota: { label: 'Para no olvidar', icon: StickyNote, color: 'var(--color-primary)' },
}

const COLOR_DIA = gamaTonal('var(--color-dia-mar-strong)')

export default function PlanificadorSuperiorPage() {
  return (
    <PlanificadorSemanal
      titulo="Planificador — Nivel 3"
      subtitulo="TP, parciales, finales, materiales, cumpleaños y notas para no olvidar — para el tramo universitario."
      tipos={TIPOS}
      colorPorDia={COLOR_DIA}
      hooks={planificadorSuperiorHooks}
    />
  )
}
