import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { db } from '@/services/storage/db'
import type { Repository } from '@/services/storage/repository'
import { proximaCajaYFecha } from '@/lib/leitner'
import type {
  ActividadCatalogo,
  ActividadProbada,
  AprendizajeSesion,
  CuadroComparativo,
  DimensionSnapshot,
  EntradaMetacognicion,
  EvaluacionFichas,
  EventoAgenda,
  Ficha,
  LineaTiempoItem,
  MapaConceptual,
  SesionEstudio,
  TextoGuia,
} from '@/types'

// ---------- Autoperfil ----------

export function useResponses() {
  return useQuery({
    queryKey: ['responses'],
    queryFn: () => db.responses.list(),
  })
}

export function useSaveResponse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { versionId: string; itemId: string; valor: 0 | 1 | 2 | 3 | null; existingId?: string }) => {
      const { existingId, ...data } = input
      if (existingId) return db.responses.update(existingId, { ...data, fecha: new Date().toISOString() })
      return db.responses.create({ ...data, fecha: new Date().toISOString() })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['responses'] }),
  })
}

export function useOpenAnswers() {
  return useQuery({
    queryKey: ['openAnswers'],
    queryFn: () => db.openAnswers.list(),
  })
}

export function useSaveOpenAnswer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { preguntaId: string; texto: string; existingId?: string }) => {
      const { existingId, ...data } = input
      if (existingId) return db.openAnswers.update(existingId, data)
      return db.openAnswers.create(data)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['openAnswers'] }),
  })
}

export function useSnapshots() {
  return useQuery({
    queryKey: ['snapshots'],
    queryFn: async () => {
      const rows = await db.snapshots.list()
      return rows.sort((a, b) => a.dimension.localeCompare(b.dimension))
    },
  })
}

export function useSaveSnapshot() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: Omit<DimensionSnapshot, 'id' | 'createdAt' | 'updatedAt'> & { existingId?: string }) => {
      const { existingId, ...data } = input
      if (existingId) return db.snapshots.update(existingId, data)
      return db.snapshots.create(data)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['snapshots'] }),
  })
}

// ---------- Actividades probadas ----------

export function useActividadesProbadas() {
  return useQuery({
    queryKey: ['actividades'],
    queryFn: async () => {
      const rows = await db.actividades.list()
      return rows.sort((a, b) => b.fechaInicio.localeCompare(a.fechaInicio))
    },
  })
}

export function useProbarActividad() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (actividad: ActividadCatalogo) =>
      db.actividades.create({
        actividadId: actividad.id,
        rutaId: actividad.rutaId,
        nivel: actividad.nivel,
        titulo: actividad.titulo,
        descripcion: actividad.descripcion,
        estado: 'en_curso',
        fechaInicio: new Date().toISOString(),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['actividades'] }),
  })
}

export function useActualizarActividad() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...patch }: { id: string } & Partial<ActividadProbada>) => db.actividades.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['actividades'] }),
  })
}

export function useEliminarActividadProbada() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => db.actividades.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['actividades'] }),
  })
}

// ---------- Cronómetro ----------

export function useSesionesEstudio() {
  return useQuery({
    queryKey: ['sesionesEstudio'],
    queryFn: async () => {
      const rows = await db.sesionesEstudio.list()
      return rows.sort((a, b) => b.fecha.localeCompare(a.fecha))
    },
  })
}

export function useRegistrarSesionEstudio() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<SesionEstudio, 'id' | 'createdAt' | 'updatedAt'>) => db.sesionesEstudio.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sesionesEstudio'] }),
  })
}

// ---------- Mapas conceptuales ----------

export function useMapas() {
  return useQuery({
    queryKey: ['mapas'],
    queryFn: async () => {
      const rows = await db.mapas.list()
      return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    },
  })
}

export function useMapa(id?: string) {
  return useQuery({
    queryKey: ['mapa', id],
    queryFn: () => db.mapas.get(id!),
    enabled: !!id,
  })
}

export function useCrearMapa() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (titulo: string) => db.mapas.create({ titulo, nodos: [], conexiones: [] }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mapas'] }),
  })
}

export function useGuardarMapa() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<MapaConceptual> }) => db.mapas.update(id, patch),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['mapas'] })
      qc.invalidateQueries({ queryKey: ['mapa', vars.id] })
    },
  })
}

export function useEliminarMapa() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => db.mapas.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mapas'] }),
  })
}

// ---------- Fichas de repaso ----------

export function useFichas() {
  return useQuery({
    queryKey: ['fichas'],
    queryFn: () => db.fichas.list(),
  })
}

export function useCrearFicha() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { tema: string; pregunta: string; respuesta: string }) =>
      db.fichas.create({ ...data, vecesRepasada: 0, caja: 1, proximoRepaso: new Date().toISOString() }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fichas'] }),
  })
}

/** Crea varias fichas de una vez (ej: pegadas desde una IA externa), todas en el mismo tema. */
export function useCrearFichasEnLote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { tema: string; pares: { pregunta: string; respuesta: string }[] }) => {
      const ahora = new Date().toISOString()
      const filas: Ficha[] = data.pares.map((p) => ({
        id: crypto.randomUUID(),
        tema: data.tema,
        pregunta: p.pregunta,
        respuesta: p.respuesta,
        vecesRepasada: 0,
        caja: 1,
        proximoRepaso: ahora,
        createdAt: ahora,
        updatedAt: ahora,
      }))
      return db.fichas.bulkCreate(filas)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fichas'] }),
  })
}

/** Registra la respuesta de un repaso y reprograma la ficha (caja de Leitner). */
export function useResponderFicha() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, caja, vecesRepasada, laSupo }: { id: string; caja: Ficha['caja']; vecesRepasada: number; laSupo: boolean }) => {
      const { caja: siguienteCaja, proximoRepaso } = proximaCajaYFecha(caja, laSupo)
      return db.fichas.update(id, {
        caja: siguienteCaja,
        proximoRepaso,
        vecesRepasada: vecesRepasada + 1,
        ultimoRepaso: new Date().toISOString(),
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fichas'] }),
  })
}

export function useEliminarFicha() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => db.fichas.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fichas'] }),
  })
}

// ---------- Autoevaluación (modo examen con las fichas de repaso) ----------

export function useEvaluaciones() {
  return useQuery({
    queryKey: ['evaluaciones'],
    queryFn: async () => {
      const rows = await db.evaluaciones.list()
      return rows.sort((a, b) => b.fecha.localeCompare(a.fecha))
    },
  })
}

export function useCrearEvaluacion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<EvaluacionFichas, 'id' | 'createdAt' | 'updatedAt'>) => db.evaluaciones.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['evaluaciones'] }),
  })
}

// ---------- Cuadros comparativos ----------

export function useCuadros() {
  return useQuery({
    queryKey: ['cuadros'],
    queryFn: () => db.cuadrosComparativos.list(),
  })
}

export function useCrearCuadro() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<CuadroComparativo, 'id' | 'createdAt' | 'updatedAt'>) => db.cuadrosComparativos.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cuadros'] }),
  })
}

export function useActualizarCuadro() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...patch }: Partial<CuadroComparativo> & { id: string }) => db.cuadrosComparativos.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cuadros'] }),
  })
}

export function useEliminarCuadro() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => db.cuadrosComparativos.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cuadros'] }),
  })
}

// ---------- Líneas de tiempo ----------

export function useLineasTiempo() {
  return useQuery({
    queryKey: ['lineasTiempo'],
    queryFn: () => db.lineasTiempo.list(),
  })
}

export function useCrearLineaTiempo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<LineaTiempoItem, 'id' | 'createdAt' | 'updatedAt'>) => db.lineasTiempo.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lineasTiempo'] }),
  })
}

export function useActualizarLineaTiempo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...patch }: Partial<LineaTiempoItem> & { id: string }) => db.lineasTiempo.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lineasTiempo'] }),
  })
}

export function useEliminarLineaTiempo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => db.lineasTiempo.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lineasTiempo'] }),
  })
}

// ---------- Diario de metacognición ----------

export function useDiario() {
  return useQuery({
    queryKey: ['diario'],
    queryFn: async () => {
      const rows = await db.diario.list()
      return rows.sort((a, b) => b.fecha.localeCompare(a.fecha))
    },
  })
}

export function useCrearEntradaDiario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<EntradaMetacognicion, 'id' | 'fecha' | 'createdAt' | 'updatedAt'>) =>
      db.diario.create({ ...data, fecha: new Date().toISOString() }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diario'] }),
  })
}

// ---------- Aprendizajes de la sesión ----------

export function useAprendizajesSesion() {
  return useQuery({
    queryKey: ['aprendizajesSesion'],
    queryFn: async () => {
      const rows = await db.aprendizajesSesion.list()
      return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    },
  })
}

export function useCrearAprendizajeSesion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { pregunta: string; respuesta: string }) => db.aprendizajesSesion.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['aprendizajesSesion'] }),
  })
}

export function useRevisarAprendizajeSesion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, estrellas }: { id: string; estrellas: 1 | 2 | 3 | 4 | 5 }) =>
      db.aprendizajesSesion.update(id, { ultimaRevision: { fecha: new Date().toISOString(), estrellas } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['aprendizajesSesion'] }),
  })
}

export function useEliminarAprendizajeSesion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => db.aprendizajesSesion.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['aprendizajesSesion'] }),
  })
}

// ---------- Agenda ----------

export function useEventosAgenda() {
  return useQuery({
    queryKey: ['agenda'],
    queryFn: async () => {
      const rows = await db.agenda.list()
      return rows.sort((a, b) => a.fecha.localeCompare(b.fecha))
    },
  })
}

export function useCrearEvento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<EventoAgenda, 'id' | 'completado' | 'createdAt' | 'updatedAt'>) =>
      db.agenda.create({ ...data, completado: false }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agenda'] }),
  })
}

export function useActualizarEvento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...patch }: { id: string } & Partial<EventoAgenda>) => db.agenda.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agenda'] }),
  })
}

export function useEliminarEvento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => db.agenda.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agenda'] }),
  })
}

// ---------- Planificadores por nivel ----------
// Mismo contrato que la Agenda, pero contra una colección propia por nivel
// (son herramientas separadas, no comparten eventos entre sí).

function crearHooksPlanificador(repo: Repository<EventoAgenda>, queryKey: string) {
  function useEventos() {
    return useQuery({
      queryKey: [queryKey],
      queryFn: async () => {
        const rows = await repo.list()
        return rows.sort((a, b) => a.fecha.localeCompare(b.fecha))
      },
    })
  }
  function useCrear() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (data: Omit<EventoAgenda, 'id' | 'completado' | 'createdAt' | 'updatedAt'>) =>
        repo.create({ ...data, completado: false }),
      onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] }),
    })
  }
  function useActualizar() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: ({ id, ...patch }: { id: string } & Partial<EventoAgenda>) => repo.update(id, patch),
      onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] }),
    })
  }
  function useEliminar() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (id: string) => repo.remove(id),
      onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] }),
    })
  }
  return { useEventos, useCrear, useActualizar, useEliminar }
}

export const planificadorPrincipianteHooks = crearHooksPlanificador(db.planificadorPrincipiante, 'planificador-principiante')
export const planificadorSecundariaHooks = crearHooksPlanificador(db.planificadorSecundaria, 'planificador-secundaria')
export const planificadorSuperiorHooks = crearHooksPlanificador(db.planificadorSuperior, 'planificador-superior')

export function useEliminarEntradaDiario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => db.diario.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diario'] }),
  })
}

// ---------- Guía de textos ----------

export function useTextosGuia() {
  return useQuery({
    queryKey: ['textosGuia'],
    queryFn: () => db.textosGuia.list(),
  })
}

export function useCrearTextoGuia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (titulo: string) => db.textosGuia.create({ titulo, leido: false, subrayado: false, resumido: false }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['textosGuia'] }),
  })
}

export function useActualizarTextoGuia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...patch }: { id: string } & Partial<Pick<TextoGuia, 'leido' | 'subrayado' | 'resumido'>>) =>
      db.textosGuia.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['textosGuia'] }),
  })
}

export function useEliminarTextoGuia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => db.textosGuia.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['textosGuia'] }),
  })
}
