import { addDays, startOfDay } from 'date-fns'
import type { CajaLeitner, Ficha } from '@/types'

/** Días hasta el próximo repaso según la caja en la que cae la ficha (sistema Leitner). */
const INTERVALO_DIAS: Record<CajaLeitner, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 7,
  5: 14,
}

export function proximaCajaYFecha(cajaActual: CajaLeitner, laSupo: boolean): { caja: CajaLeitner; proximoRepaso: string } {
  const caja = (laSupo ? Math.min(cajaActual + 1, 5) : 1) as CajaLeitner
  const proximoRepaso = addDays(startOfDay(new Date()), INTERVALO_DIAS[caja]).toISOString()
  return { caja, proximoRepaso }
}

export function estaParaHoy(ficha: Pick<Ficha, 'proximoRepaso'>): boolean {
  return startOfDay(new Date(ficha.proximoRepaso)).getTime() <= startOfDay(new Date()).getTime()
}

export function etiquetaCaja(caja: CajaLeitner): string {
  return ['Recién vista', 'Caja 2', 'Caja 3', 'Caja 4', 'Bien afianzada'][caja - 1]
}
