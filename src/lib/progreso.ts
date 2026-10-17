import { differenceInCalendarDays, parseISO, startOfDay } from 'date-fns'

/**
 * Racha de días consecutivos de uso, contando desde hoy (o ayer, si todavía
 * no hizo nada hoy) hacia atrás. `fechas` son timestamps ISO de cualquier
 * actividad: sesión de cronómetro, actividad completada, entrada de diario,
 * ficha repasada.
 */
export function calcularRacha(fechas: string[]): number {
  if (fechas.length === 0) return 0
  const dias = new Set(fechas.map((f) => startOfDay(parseISO(f)).getTime()))
  const hoy = startOfDay(new Date())

  let cursor = hoy
  if (!dias.has(cursor.getTime())) {
    const ayer = new Date(cursor)
    ayer.setDate(ayer.getDate() - 1)
    if (!dias.has(ayer.getTime())) return 0
    cursor = ayer
  }

  let racha = 0
  while (dias.has(cursor.getTime())) {
    racha += 1
    const anterior = new Date(cursor)
    anterior.setDate(anterior.getDate() - 1)
    cursor = anterior
  }
  return racha
}

/** Días únicos con actividad en los últimos N días (para el calendario de hábito). */
export function diasActivosRecientes(fechas: string[], n = 28): Set<string> {
  const hoy = startOfDay(new Date())
  const set = new Set<string>()
  for (const f of fechas) {
    const d = startOfDay(parseISO(f))
    if (differenceInCalendarDays(hoy, d) < n) set.add(d.toISOString().slice(0, 10))
  }
  return set
}
