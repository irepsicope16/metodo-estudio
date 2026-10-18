import { useState } from 'react'
import { Briefcase, GraduationCap, User } from 'lucide-react'
import { useEstudiantesStore } from '@/stores/estudiantesStore'
import { useRolStore, type Rol } from '@/stores/rolStore'
import { FadeIn } from '@/components/shared'
import { BrandCover } from '@/branding/Logo'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { MENSAJES } from '@/data/mensajes'

/** Paso único por dispositivo: quién lo usa, antes de crear el primer estudiante. */
function SelectorDeRol({ onElegir }: { onElegir: (rol: Rol) => void }) {
  const opciones: { rol: Rol; icon: typeof User; label: string; detalle: string }[] = [
    { rol: 'profesional', icon: Briefcase, label: 'Soy profesional', detalle: 'Psicopedagogo/a, docente, acompañante' },
    { rol: 'familia', icon: GraduationCap, label: 'Soy estudiante o familia', detalle: 'Uso la app para mí o para quien acompaño' },
  ]
  return (
    <FadeIn className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md text-center">
        <BrandCover className="mx-auto max-w-[220px]" />
        <h1 className="font-display mt-6 text-[20px] font-semibold tracking-tight">¿Cómo vas a usar Método Estudio?</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
          Para conocer quién usa la app. No pedimos ningún dato personal.
        </p>
        <div className="mt-6 space-y-2.5 text-left">
          {opciones.map((o) => (
            <button
              key={o.rol}
              type="button"
              onClick={() => onElegir(o.rol)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl border bg-surface px-4 py-3.5 text-left transition-colors hover:bg-surface-2"
            >
              <o.icon className="h-5 w-5 shrink-0 text-primary" />
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{o.label}</span>
                <span className="block text-[12px] text-muted-foreground">{o.detalle}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </FadeIn>
  )
}

/**
 * Pantalla de bienvenida / selector de estudiante: si no hay nadie activo,
 * muestra la lista de estudiantes ya creados para elegir uno, o el formulario
 * para crear el primero. Con `preview`, se usa solo para mostrarla desde
 * Ajustes sin crear ni seleccionar nada de verdad.
 */
export function Bienvenida({ preview = false }: { preview?: boolean }) {
  const estudiantes = useEstudiantesStore((s) => s.estudiantes)
  const crear = useEstudiantesStore((s) => s.crear)
  const seleccionar = useEstudiantesStore((s) => s.seleccionar)
  const rol = useRolStore((s) => s.rol)
  const elegirRol = useRolStore((s) => s.elegirRol)
  const [valor, setValor] = useState('')
  const [agregando, setAgregando] = useState(estudiantes.length === 0)

  function confirmarCrear() {
    if (!valor.trim()) return
    if (!preview) crear(valor.trim())
    setValor('')
    setAgregando(false)
  }

  if (!preview && estudiantes.length === 0 && rol === null) {
    return <SelectorDeRol onElegir={elegirRol} />
  }

  return (
    <FadeIn className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md text-center">
        <BrandCover className="mx-auto max-w-[260px]" />
        <h1 className="font-display mt-6 text-[22px] font-semibold tracking-tight">
          {estudiantes.length === 0 ? 'Descubrí cómo estudiás mejor' : '¿Con quién vas a trabajar ahora?'}
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          Un autoperfil, una biblioteca de técnicas y herramientas para probar qué funciona — cada estudiante
          con su propio espacio, sin mezclar datos entre sí. Todo queda guardado en este dispositivo.
        </p>

        {estudiantes.length > 0 && !agregando && (
          <div className="mt-6 space-y-2 text-left">
            {estudiantes.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => !preview && seleccionar(e.id)}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl border bg-surface px-4 py-3 text-left transition-colors hover:bg-surface-2"
              >
                <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="font-medium">{e.nombre}</span>
              </button>
            ))}
            <Button variant="outline" className="w-full" onClick={() => setAgregando(true)}>
              + Agregar otro estudiante
            </Button>
          </div>
        )}

        {(estudiantes.length === 0 || agregando) && (
          <div className="mt-6 space-y-3 text-left">
            <Label htmlFor="nombre">¿Cómo se llama el estudiante?</Label>
            <Input
              id="nombre"
              autoFocus
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Nombre"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && valor.trim()) confirmarCrear()
              }}
            />
            <Button className="w-full" disabled={!valor.trim()} onClick={confirmarCrear}>
              Empezar
            </Button>
            {estudiantes.length > 0 && (
              <Button variant="ghost" className="w-full" onClick={() => setAgregando(false)}>
                Cancelar
              </Button>
            )}
          </div>
        )}

        <p className="mt-5 text-[12px] text-faint">{MENSAJES.emergencia}</p>
        <p className="mt-3 text-[11px] leading-relaxed text-faint">
          Método Estudio es una herramienta creada por la Lic. Irene Morbidelli (Psicopedagoga).
          <br />
          Prohibida su venta o copia sin autorización. ·{' '}
          <a href="#/privacidad" className="underline hover:text-muted-foreground">
            Privacidad y términos
          </a>
        </p>
      </div>
    </FadeIn>
  )
}
