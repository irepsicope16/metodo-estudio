import { Backpack, Cake, FileCheck2, FileText, ListTodo, StickyNote } from 'lucide-react'
import { planificadorPrincipianteHooks } from '@/hooks/queries'
import { DIA_COLOR_VIVO, PlanificadorSemanal, type TipoEventoConfig } from './PlanificadorSemanal'
import type { TipoEvento } from '@/types'

const TIPOS: Partial<Record<TipoEvento, TipoEventoConfig>> = {
  tarea: { label: 'Tarea', icon: ListTodo, color: 'var(--color-mod-regular)' },
  tp: { label: 'TP', icon: FileText, color: 'var(--color-secondary)' },
  evaluacion: { label: 'Evaluación', icon: FileCheck2, color: 'var(--color-danger)' },
  material: { label: 'Material', icon: Backpack, color: 'var(--color-mod-organizar)' },
  cumpleanos: { label: 'Cumpleaños', icon: Cake, color: 'var(--color-mod-aprender)' },
  nota: { label: 'Para no olvidar', icon: StickyNote, color: 'var(--color-primary)' },
}

export default function PlanificadorPrincipiantePage() {
  return (
    <PlanificadorSemanal
      titulo="Planificador — Nivel 1"
      subtitulo="Tareas, TP, evaluaciones, materiales, cumpleaños y notas para no olvidar, con colores bien vivos para los primeros años."
      tipos={TIPOS}
      colorPorDia={DIA_COLOR_VIVO}
      hooks={planificadorPrincipianteHooks}
    />
  )
}
