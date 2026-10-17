// Mini-ilustraciones propias (CSS/SVG, sin imágenes externas) para cada
// técnica visual — un ejemplo esquemático, no una copia de ningún material
// de referencia.

const COLORES_JERARQUIA = [
  { color: 'var(--color-mod-organizar)', soft: 'var(--color-mod-organizar-soft)', label: 'Título y palabras clave' },
  { color: 'var(--color-mod-atencion)', soft: 'var(--color-mod-atencion-soft)', label: 'Ideas importantes' },
  { color: 'var(--color-mod-escribir)', soft: 'var(--color-mod-escribir-soft)', label: 'Definiciones' },
  { color: 'var(--color-mod-aprender)', soft: 'var(--color-mod-aprender-soft)', label: 'Ejemplos' },
  { color: 'var(--color-mod-regular)', soft: 'var(--color-mod-regular-soft)', label: 'Fechas' },
] as const

function SubrayadoColores() {
  return (
    <div className="space-y-1.5">
      {COLORES_JERARQUIA.map((c) => (
        <div key={c.label} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c.color }} />
          <span
            className="truncate rounded px-1.5 py-0.5 text-[11px] font-medium"
            style={{ background: c.soft, color: c.color }}
          >
            {c.label}
          </span>
        </div>
      ))}
    </div>
  )
}

function AnotacionesMargen() {
  const notas = [
    { ancho: '85%', nota: 'resumen', color: 'var(--color-mod-organizar)' },
    { ancho: '70%', nota: 'duda', color: 'var(--color-mod-atencion)' },
    { ancho: '92%', nota: 'conexión', color: 'var(--color-mod-escribir)' },
  ]
  return (
    <div className="space-y-2.5">
      {notas.map((n, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="h-1.5 flex-1 rounded-full bg-border-strong" style={{ maxWidth: n.ancho }} />
          <span
            className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold"
            style={{ color: n.color, border: `1px solid ${n.color}` }}
          >
            {n.nota}
          </span>
        </div>
      ))}
    </div>
  )
}

function MapaMental() {
  const ramas = ['Subtema 1', 'Subtema 2', 'Subtema 3']
  return (
    <div className="flex flex-col items-center">
      <span className="rounded-full px-3 py-1 text-[11px] font-semibold text-white" style={{ background: 'var(--color-primary)' }}>
        Tema
      </span>
      <div className="mt-1.5 flex w-full items-start justify-center gap-3">
        {ramas.map((r, i) => (
          <div key={r} className="flex flex-1 flex-col items-center">
            <span className="h-3 w-px bg-border-strong" />
            <span
              className="mt-0.5 w-full truncate rounded px-1.5 py-0.5 text-center text-[10px] font-medium"
              style={{ background: 'var(--color-secondary-soft)', color: 'var(--color-secondary)' }}
            >
              {r}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CuadroComparativo() {
  const columnas = ['A', 'B']
  const filas = ['Criterio 1', 'Criterio 2']
  return (
    <div className="overflow-hidden rounded-lg border text-[10px]">
      <div className="grid grid-cols-3" style={{ background: 'var(--color-accent-soft)' }}>
        <div className="p-1.5" />
        {columnas.map((c) => (
          <div key={c} className="p-1.5 text-center font-semibold" style={{ color: 'var(--color-accent-strong)' }}>
            {c}
          </div>
        ))}
      </div>
      {filas.map((f, i) => (
        <div key={f} className={`grid grid-cols-3 ${i > 0 ? 'border-t' : ''}`}>
          <div className="p-1.5 font-medium text-muted-foreground">{f}</div>
          <div className="border-l p-1.5" />
          <div className="border-l p-1.5" />
        </div>
      ))}
    </div>
  )
}

function LineaTiempo() {
  const puntos = ['2010', '2015', '2020', '2024']
  return (
    <div className="relative mt-3 flex items-center justify-between">
      <div className="absolute left-0 right-0 h-0.5 rounded-full" style={{ background: 'var(--color-mod-regular)' }} />
      {puntos.map((p) => (
        <div key={p} className="relative z-10 flex flex-col items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full border-2" style={{ background: 'var(--surface)', borderColor: 'var(--color-mod-regular)' }} />
          <span className="text-[10px] font-medium text-muted-foreground">{p}</span>
        </div>
      ))}
    </div>
  )
}

function EsquemaLlaves() {
  return (
    <div className="flex items-stretch gap-2 text-[10px]">
      <span className="font-semibold" style={{ color: 'var(--color-mod-aprender)' }}>
        Tema
      </span>
      <div className="flex flex-1 flex-col justify-around gap-1 border-l-2 pl-2" style={{ borderColor: 'var(--color-mod-aprender)' }}>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Subtema 1</span>
          <div className="flex flex-1 gap-1 border-l pl-1.5 text-faint" style={{ borderColor: 'var(--color-border-strong)' }}>
            detalle · detalle
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Subtema 2</span>
          <div className="flex flex-1 gap-1 border-l pl-1.5 text-faint" style={{ borderColor: 'var(--color-border-strong)' }}>
            detalle · detalle
          </div>
        </div>
      </div>
    </div>
  )
}

const PREVIEWS: Record<string, () => React.JSX.Element> = {
  'subrayado-colores': SubrayadoColores,
  'anotaciones-margen': AnotacionesMargen,
  'mapa-mental': MapaMental,
  'cuadro-comparativo': CuadroComparativo,
  'linea-tiempo': LineaTiempo,
  'esquema-llaves': EsquemaLlaves,
}

export function VistaPreviaTecnica({ id }: { id: string }) {
  const Preview = PREVIEWS[id]
  if (!Preview) return null
  return (
    <div className="rounded-lg border bg-surface p-3">
      <Preview />
    </div>
  )
}
