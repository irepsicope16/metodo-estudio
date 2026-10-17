// ------------------------------------------------------------
// Puntos e insignias simples, derivados de datos que ya se guardan
// (nada nuevo que persistir). Sin ranking ni comparación con nadie:
// es un refuerzo visual del propio progreso, no una competencia.
// ------------------------------------------------------------

export interface Insignia {
  id: string
  titulo: string
  descripcion: string
  conseguida: boolean
}

export interface ResumenGamificacion {
  puntos: number
  insignias: Insignia[]
}

export function calcularGamificacion(input: {
  actividadesCompletadas: number
  rutasDistintasProbadas: number
  racha: number
  sesionesCronometro: number
  fichasCreadas: number
  repasosFichas: number
  mapasCreados: number
  entradasDiario: number
}): ResumenGamificacion {
  const puntos =
    input.actividadesCompletadas * 10 +
    input.sesionesCronometro * 5 +
    input.fichasCreadas * 5 +
    input.repasosFichas * 2 +
    input.mapasCreados * 5 +
    input.entradasDiario * 5 +
    input.racha * 2

  const insignias: Insignia[] = [
    { id: 'primer-paso', titulo: 'Primer paso', descripcion: 'Completar tu primera actividad', conseguida: input.actividadesCompletadas >= 1 },
    { id: 'coleccionista', titulo: 'Coleccionista de técnicas', descripcion: '5 actividades completadas', conseguida: input.actividadesCompletadas >= 5 },
    { id: 'explorador', titulo: 'Explorador', descripcion: 'Probar actividades de 3 rutas distintas', conseguida: input.rutasDistintasProbadas >= 3 },
    { id: 'constante', titulo: 'Constante', descripcion: 'Racha de 3 días seguidos', conseguida: input.racha >= 3 },
    { id: 'en-llamas', titulo: 'En llamas', descripcion: 'Racha de 7 días seguidos', conseguida: input.racha >= 7 },
    { id: 'maratonista', titulo: 'Maratonista', descripcion: '5 sesiones de cronómetro', conseguida: input.sesionesCronometro >= 5 },
    { id: 'memoria-de-hierro', titulo: 'Memoria de hierro', descripcion: 'Repasar fichas 10 veces', conseguida: input.repasosFichas >= 10 },
    { id: 'mapeador', titulo: 'Mapeador', descripcion: 'Crear tu primer mapa conceptual', conseguida: input.mapasCreados >= 1 },
    { id: 'reflexivo', titulo: 'Reflexivo', descripcion: '3 entradas en el diario', conseguida: input.entradasDiario >= 3 },
  ]

  return { puntos, insignias }
}
