import { Link } from 'react-router-dom'
import { CalendarDays, Compass, ListChecks, Repeat, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn, IconBadge, PageHeader } from '@/components/shared'
import { HERRAMIENTAS } from '@/features/herramientas/HerramientasPage'

const PASOS_EMPEZAR = [
  {
    titulo: 'Respondé tu autoperfil',
    texto: 'En «Mi autoperfil» completá el cuestionario. Al terminar, la app te sugiere con qué ruta de estudio conviene arrancar — esa sugerencia aparece después en Inicio.',
  },
  {
    titulo: 'Mirá la Biblioteca',
    texto: 'Andá a «Biblioteca» y revisá las fichas de esa ruta: qué es cada herramienta, para qué sirve y cómo aplicarla, agrupadas por nivel.',
  },
  {
    titulo: 'Probá actividades',
    texto: 'Elegí una o dos actividades de esa ruta en «Actividades», probalas y marcalas como completadas — ahí armás tu propio ranking de qué te sirve.',
  },
  {
    titulo: 'Cargá tus fechas',
    texto: 'Si ya tenés evaluaciones o entregas concretas, cargalas en «Agenda» desde el principio, así no se te pasan.',
  },
]

const RUTINA = [
  { momento: 'Antes de estudiar', texto: 'Abrí el Cronómetro (Pomodoro o tiempo libre) y arrancalo.' },
  { momento: 'Durante el estudio', texto: 'Usá la herramienta que corresponda: Fichas para repasar, Mapas conceptuales para organizar un tema nuevo, Cuadros comparativos para comparar conceptos, etc.' },
  { momento: 'Después de estudiar', texto: 'Anotá tres líneas en el Diario de metacognición: qué método usaste y qué tan bien te funcionó.' },
  { momento: 'Una vez por semana', texto: 'Mirá «Mi progreso» (racha, minutos, actividades) y revisá la Agenda de la semana que viene.' },
]

export default function GuiaUsoPage() {
  return (
    <FadeIn className="space-y-5">
      <PageHeader
        title="Cómo usar Método Estudio"
        subtitle="Por dónde arrancar, cómo seguir semana a semana, qué hace cada herramienta, y la diferencia entre Agenda y Planificadores."
      />

      <Card className="border-primary/15 bg-primary-soft/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[19px]">
            <IconBadge icon={Compass} tone="primario" size="lg" /> Por dónde empezar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3.5 pt-0">
          {PASOS_EMPEZAR.map((paso, i) => (
            <div key={i} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground">
                {i + 1}
              </span>
              <div>
                <p className="text-[15px] font-semibold">{paso.titulo}</p>
                <p className="mt-0.5 text-[13.5px] leading-relaxed text-muted-foreground">{paso.texto}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-secondary/20 bg-secondary-soft/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[19px]">
            <IconBadge icon={Repeat} tone="secundario" size="lg" /> Cómo continuar — rutina sugerida
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {RUTINA.map((r, i) => (
            <div key={i} className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-[14.5px] font-bold text-secondary-strong">{r.momento}:</span>
              <span className="text-[13.5px] leading-relaxed text-muted-foreground">{r.texto}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-accent/20 bg-accent-soft/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[19px]">
            <IconBadge icon={Sparkles} tone="acento" size="lg" /> Herramientas disponibles
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="mb-3 text-[13px] text-muted-foreground">
            Además de estas, tenés <strong className="text-foreground">Biblioteca</strong> (fichas explicativas de las 8 rutas) y{' '}
            <strong className="text-foreground">Actividades</strong> (el catálogo práctico para ir probando y marcando tu progreso).
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {HERRAMIENTAS.map((h) => (
              <Link
                key={h.to}
                to={h.to}
                className="flex items-start gap-2.5 rounded-xl border bg-surface p-3 transition-colors hover:bg-surface-2"
              >
                <IconBadge icon={h.icon} tone={h.tono} />
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold">{h.titulo}</p>
                  <p className="text-[12px] leading-snug text-muted-foreground">{h.descripcion}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/15 bg-primary-soft/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[19px]">
            <IconBadge icon={CalendarDays} tone="primario" size="lg" /> Agenda vs. Planificadores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3.5 pt-0">
          <p className="text-[13.5px] leading-relaxed">
            Son dos cosas separadas que <strong>no comparten datos entre sí</strong> — conviene tenerlo claro para no cargar lo mismo dos
            veces en lugares distintos.
          </p>
          <div className="rounded-xl border bg-surface p-3.5">
            <Badge variant="primario">Agenda</Badge>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Tu agenda semanal única y general. Ahí van evaluaciones, entregas, materiales, cumpleaños y notas, todo junto, sin importar
              el nivel del estudiante. Tiene también una vista «Agenda anual» (mes a mes) que muestra esos mismos eventos — no son datos
              nuevos, es otra forma de verlos.
            </p>
          </div>
          <div className="rounded-xl border bg-surface p-3.5">
            <Badge variant="secundario">Planificadores</Badge>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Son 3 planificadores semanales separados, uno por nivel educativo (Nivel 1, 2 y 3), cada uno con su propio diseño y
              categorías. Nivel 1 usa colores bien vivos y categorías simples (tarea, TP, evaluación...); Nivel 2 suma «trabajo en
              grupo»; Nivel 3 cambia «evaluación» por «parcial» y «final», pensado para el tramo universitario. Cada nivel guarda sus
              eventos por separado — lo que cargaste en el Nivel 1 no aparece en el Nivel 2 ni en la Agenda.
            </p>
          </div>
          <p className="text-[13px] leading-relaxed">
            <strong>En resumen:</strong> para no duplicar trabajo, conviene elegir una sola como la "real" por estudiante — o la Agenda
            general para todo, o el Planificador del nivel que le corresponde — pero no cargar el mismo evento en las dos, porque no se
            sincronizan.
          </p>
        </CardContent>
      </Card>
    </FadeIn>
  )
}
