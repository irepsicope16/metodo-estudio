// ============================================================
// Motor de cálculo de Método Estudio — funciones puras, sin React.
// Calcula el autoperfil por dimensión (§7 del Documento Maestro). La
// versión de autoayuda tiene una sola fuente (autoinforme de la propia
// persona), así que no hay nivel de confianza por convergencia: el
// resultado es siempre orientativo, nunca un diagnóstico.
// ============================================================

import { itemsDeDimension } from '@/data/items'
import type { BandaNecesidad, DimensionId, QuestionnaireResponse } from '@/types'

const COMPLETITUD_MINIMA = 0.7

/**
 * Cálculo del autoperfil por dimensión (§7):
 * - Ítems de recurso se invierten: necesidad = 3 - respuesta.
 * - Ítems de dificultad conservan su valor.
 * - "No aplica" (valor null) queda fuera del denominador.
 * - Solo se calcula el promedio si se respondió al menos el 70% de la dimensión.
 */
export function calcularNecesidadDimension(
  dimension: DimensionId,
  respuestas: QuestionnaireResponse[],
): { promedio: number | null; completitud: number; banda: BandaNecesidad | null } {
  const items = itemsDeDimension(dimension)
  const porItem = new Map(respuestas.map((r) => [r.itemId, r]))

  let respondidos = 0
  let suma = 0
  let contados = 0

  for (const item of items) {
    const r = porItem.get(item.codigo)
    if (!r) continue
    respondidos += 1
    if (r.valor === null) continue // No aplica: fuera del denominador
    const necesidad = item.clave === 'recurso' ? 3 - r.valor : r.valor
    suma += necesidad
    contados += 1
  }

  const completitud = items.length > 0 ? respondidos / items.length : 0
  if (completitud < COMPLETITUD_MINIMA || contados === 0) {
    return { promedio: null, completitud, banda: null }
  }
  const promedio = suma / contados
  return { promedio, completitud, banda: bandaDeNecesidad(promedio) }
}

/** Tabla 15: rangos funcionales iniciales (no baremos). */
export function bandaDeNecesidad(promedio: number): BandaNecesidad {
  if (promedio <= 0.74) return 'baja'
  if (promedio <= 1.49) return 'leve'
  if (promedio <= 2.24) return 'moderada'
  return 'alta'
}

export const ETIQUETA_BANDA: Record<BandaNecesidad, string> = {
  baja: 'Ya tenés recursos acá, no es tu prioridad ahora',
  leve: 'Área para observar, puede sumar una herramienta puntual',
  moderada: 'Área para fortalecer, buen punto de partida',
  alta: 'La que más te conviene trabajar primero',
}
