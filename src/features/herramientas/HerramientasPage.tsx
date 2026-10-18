import { Link } from 'react-router-dom'
import { BookOpenCheck, ClipboardCheck, Columns3, Gamepad2, History, ListChecks, NotebookPen, PieChart, Table2, Timer, Workflow } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn, IconBadge, PageHeader } from '@/components/shared'

const HERRAMIENTAS = [
  {
    to: '/herramientas/cronometro',
    icon: Timer,
    tono: 'acento',
    titulo: 'Cronómetro de estudio',
    descripcion: 'Ciclos de estudio y descanso (tipo Pomodoro) o tiempo libre, con aviso al terminar.',
  },
  {
    to: '/herramientas/mapas',
    icon: Workflow,
    tono: 'secundario',
    titulo: 'Mapas conceptuales',
    descripcion: 'Armá y conectá ideas en un lienzo visual para organizar lo que leíste.',
  },
  {
    to: '/herramientas/fichas',
    icon: BookOpenCheck,
    tono: 'dorado',
    titulo: 'Fichas de repaso',
    descripcion: 'Creá tus propias tarjetas pregunta/respuesta y practicá con ellas.',
  },
  {
    to: '/herramientas/evaluacion',
    icon: ClipboardCheck,
    tono: 'acento',
    titulo: 'Autoevaluación',
    descripcion: 'Rendí una evaluación con tus fichas, cronometrada, y mirá tu puntaje.',
  },
  {
    to: '/herramientas/memotest',
    icon: Gamepad2,
    tono: 'dorado',
    titulo: 'Memotest',
    descripcion: 'Emparejá pregunta con respuesta usando tus fichas, contra el reloj.',
  },
  {
    to: '/herramientas/cuadros',
    icon: Columns3,
    tono: 'secundario',
    titulo: 'Cuadros comparativos',
    descripcion: 'Comparar dos o más elementos, criterio por criterio, en una tabla propia.',
  },
  {
    to: '/herramientas/lineas-tiempo',
    icon: History,
    tono: 'primario',
    titulo: 'Líneas de tiempo',
    descripcion: 'Ordená eventos cronológicamente para entender cuándo pasó cada cosa.',
  },
  {
    to: '/herramientas/diario',
    icon: NotebookPen,
    tono: 'primario',
    titulo: 'Diario de metacognición',
    descripcion: 'Después de cada sesión: qué método usaste, qué tan bien te funcionó y qué cambiarías.',
  },
  {
    to: '/herramientas/guia-textos',
    icon: ListChecks,
    tono: 'secundario',
    titulo: 'Guía de textos',
    descripcion: 'Anotá qué estás leyendo y marcá tu avance: leído, subrayado, resumido.',
  },
  {
    to: '/herramientas/horario-cursada',
    icon: Table2,
    tono: 'dorado',
    titulo: 'Horario de cursada',
    descripcion: 'Tu horario fijo de materias, siempre a mano — distinto de la Agenda.',
  },
  {
    to: '/herramientas/distribucion-actividades',
    icon: PieChart,
    tono: 'primario',
    titulo: 'Distribución de actividades',
    descripcion: 'Un gráfico visual de cómo repartís tu día: estudio, descanso, pendientes y recreación.',
  },
] as const

export default function HerramientasPage() {
  return (
    <FadeIn className="space-y-5">
      <PageHeader title="Herramientas" subtitle="Tu caja de herramientas para estudiar mejor." />
      <div className="grid gap-3 sm:grid-cols-2">
        {HERRAMIENTAS.map((h) => (
          <Link key={h.to} to={h.to}>
            <Card className="h-full transition-colors hover:bg-surface-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[15px]">
                  <IconBadge icon={h.icon} tone={h.tono} /> {h.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-[12.5px] text-muted-foreground">{h.descripcion}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </FadeIn>
  )
}
