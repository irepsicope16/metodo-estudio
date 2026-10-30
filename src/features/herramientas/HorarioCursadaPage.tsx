import { BLOQUES_CURSADA, DIAS_CURSADA, useHorarioCursadaStore } from '@/stores/horarioCursadaStore'
import { Card, CardContent } from '@/components/ui/card'
import { Label, Textarea } from '@/components/ui/input'
import { FadeIn, PageHeader } from '@/components/shared'
import { IlustracionHorarioCursada } from '@/components/shared/IlustracionesHerramientas'
import { IntroHerramienta } from '@/components/shared/IntroHerramienta'

export default function HorarioCursadaPage() {
  const { celdas, notas, setCelda, setNotas } = useHorarioCursadaStore()

  return (
    <FadeIn className="space-y-5">
      <PageHeader title="Horario de cursada" subtitle="Tu horario fijo de materias, siempre a mano — distinto de la Agenda, que es para fechas puntuales." />

      <IntroHerramienta
        clave="horario-cursada"
        queEs="Tu horario fijo de materias, siempre a mano — distinto de la Agenda, que es para fechas puntuales."
        comoSeHace={[
          'Elegí la celda del día y horario que corresponda.',
          'Escribí ahí el nombre de la materia.',
          'Repetí para cada bloque de la semana.',
          'Usá el campo de notas para anotar cambios de horario u otra info.',
        ]}
        ejemplo="Lunes, primer bloque → «Matemática»."
        ilustracion={<IlustracionHorarioCursada />}
      />

      <Card>
        <CardContent className="overflow-x-auto pt-5">
          <table className="w-full min-w-[640px] border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="w-24"></th>
                {DIAS_CURSADA.map((dia) => (
                  <th key={dia} className="pb-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {dia}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BLOQUES_CURSADA.map((bloque, bi) => (
                <tr key={bloque}>
                  <td className="whitespace-nowrap pr-2 text-right text-[11px] font-medium text-faint">{bloque}</td>
                  {DIAS_CURSADA.map((_, di) => (
                    <td key={di}>
                      <input
                        value={celdas[`${di}-${bi}`] ?? ''}
                        onChange={(e) => setCelda(di, bi, e.target.value)}
                        placeholder="—"
                        className="h-9 w-full rounded-lg border bg-surface-2 px-2 text-center text-[12px] placeholder:text-faint focus:border-accent focus:outline-none"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 pt-5">
          <Label>Notas</Label>
          <Textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Cambios de horario, fechas especiales, lo que necesites recordar..."
            rows={4}
          />
        </CardContent>
      </Card>
    </FadeIn>
  )
}
