import { Backpack, Cake, FileCheck2, FileText, ListTodo, StickyNote, Users } from 'lucide-react'
import { planificadorSecundariaHooks } from '@/hooks/queries'
import { gamaTonal, PlanificadorSemanal, type TipoEventoConfig } from './PlanificadorSemanal'
import type { TipoEvento } from '@/types'

const TIPOS: Partial<Record<TipoEvento, TipoEventoConfig>> = {
  tarea: { label: 'Tarea', icon: ListTodo, color: 'var(--color-mod-regular)' },
  tp: { label: 'TP', icon: FileText, color: 'var(--color-secondary)' },
  evaluacion: { label: 'Evaluación', icon: FileCheck2, color: 'var(--color-danger)' },
  trabajo_grupo: { label: 'Trabajo en grupo', icon: Users, color: 'var(--color-mod-escribir)' },
  material: { label: 'Material', icon: Backpack, color: 'var(--color-mod-organizar)' },
  cumpleanos: { label: 'Cumpleaños', icon: Cake, color: 'var(--color-mod-aprender)' },
  nota: { label: 'Para no olvidar', icon: StickyNote, color: 'var(--color-primary)' },
}

const COLOR_DIA = gamaTonal('var(--color-mod-atencion)')

export default function PlanificadorSecundariaPage() {
  return (
    <PlanificadorSemanal
      titulo="Planificador — Nivel 2"
      subtitulo="TP, evaluaciones, trabajo en grupo, tareas, materiales, cumpleaños y notas para no olvidar."
      tipos={TIPOS}
      colorPorDia={COLOR_DIA}
      hooks={planificadorSecundariaHooks}
    />
  )
}
