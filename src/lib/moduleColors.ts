import type { CSSProperties } from 'react'

// Color por módulo (ruta): un tono distinto por cada una de las 8 rutas,
// para diferenciarlas visualmente en Biblioteca, Recorrido y Actividades.
// Independiente del color de Nivel (que ya usa primario/secundario/acento) —
// por eso 3 rutas reusan esos mismos tokens y las otras 5 usan tonos nuevos.

export interface ModuleColor {
  color: string
  soft: string
}

export const RUTA_COLOR: Record<string, ModuleColor> = {
  organizar: { color: 'var(--color-mod-organizar)', soft: 'var(--color-mod-organizar-soft)' },
  sostener_atencion: { color: 'var(--color-mod-atencion)', soft: 'var(--color-mod-atencion-soft)' },
  comprender: { color: 'var(--color-secondary)', soft: 'var(--color-secondary-soft)' },
  escribir: { color: 'var(--color-mod-escribir)', soft: 'var(--color-mod-escribir-soft)' },
  aprender_recordar: { color: 'var(--color-mod-aprender)', soft: 'var(--color-mod-aprender-soft)' },
  prepararse_evaluar: { color: 'var(--color-accent)', soft: 'var(--color-accent-soft)' },
  regular_persistir: { color: 'var(--color-mod-regular)', soft: 'var(--color-mod-regular-soft)' },
  construir_autonomia: { color: 'var(--color-primary)', soft: 'var(--color-primary-soft)' },
}

// Color por dimensión del autoperfil (A-H): mismos 8 tokens que las rutas,
// reasignados en otro orden — son categorías distintas (dimensiones del
// cuestionario vs. rutas de técnicas), pero comparten paleta para no sumar
// colores nuevos al sistema.
export const DIMENSION_COLOR: Record<string, ModuleColor> = {
  A: { color: 'var(--color-accent)', soft: 'var(--color-accent-soft)' },
  B: { color: 'var(--color-mod-organizar)', soft: 'var(--color-mod-organizar-soft)' },
  C: { color: 'var(--color-mod-atencion)', soft: 'var(--color-mod-atencion-soft)' },
  D: { color: 'var(--color-secondary)', soft: 'var(--color-secondary-soft)' },
  E: { color: 'var(--color-mod-escribir)', soft: 'var(--color-mod-escribir-soft)' },
  F: { color: 'var(--color-mod-aprender)', soft: 'var(--color-mod-aprender-soft)' },
  G: { color: 'var(--color-mod-regular)', soft: 'var(--color-mod-regular-soft)' },
  H: { color: 'var(--color-primary)', soft: 'var(--color-primary-soft)' },
}

/** Estilo listo para aplicar a una ficha/tarjeta: franja superior de color + sombra. El fondo
 * queda el claro de siempre (el de Card) para que el color resalte en vez de mezclarse. */
export function moduleCardStyle(rutaId: string): CSSProperties {
  const c = RUTA_COLOR[rutaId]
  if (!c) return {}
  return {
    borderTopColor: c.color,
    borderTopWidth: 3,
    boxShadow: `0 10px 20px -14px ${c.color}`,
  }
}

/** Igual que moduleCardStyle, pero para dimensiones del autoperfil (A-H). */
export function dimensionCardStyle(dimension: string): CSSProperties {
  const c = DIMENSION_COLOR[dimension]
  if (!c) return {}
  return {
    borderTopColor: c.color,
    borderTopWidth: 3,
    boxShadow: `0 10px 20px -14px ${c.color}`,
  }
}
