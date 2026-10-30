import { useEffect, useState } from 'react'
import { Briefcase, GraduationCap, ShieldAlert, ShieldX } from 'lucide-react'
import { supabase, MAIL_ADMIN } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import { fechaLarga } from '@/lib/utils'
import type { RolCuenta } from '@/types'

interface FilaPerfil {
  id: string
  email: string
  rol: RolCuenta
  es_menor: boolean
  nombre: string
  acceso_activo: boolean
  created_at: string
}

export default function UsuariosPage() {
  const session = useAuthStore((s) => s.session)
  const [filas, setFilas] = useState<FilaPerfil[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [actualizando, setActualizando] = useState<string | null>(null)

  const esAdmin = session?.user.email === MAIL_ADMIN

  useEffect(() => {
    if (!esAdmin) return
    supabase
      .from('perfiles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setFilas(data as FilaPerfil[])
      })
  }, [esAdmin])

  async function cambiarAcceso(fila: FilaPerfil, activo: boolean) {
    setActualizando(fila.id)
    const { error } = await supabase.from('perfiles').update({ acceso_activo: activo }).eq('id', fila.id)
    setActualizando(null)
    if (error) {
      toast.error('No se pudo actualizar: ' + error.message)
      return
    }
    setFilas((prev) => prev?.map((f) => (f.id === fila.id ? { ...f, acceso_activo: activo } : f)) ?? null)
    toast.success(activo ? `Acceso reactivado para ${fila.nombre}` : `Acceso cortado para ${fila.nombre}`)
  }

  if (!esAdmin) {
    return (
      <FadeIn>
        <EmptyState icon={ShieldAlert} title="No tenés acceso a esta sección" description="Esta pantalla es solo para la administradora de Método Estudio." />
      </FadeIn>
    )
  }

  const profesionales = filas?.filter((f) => f.rol === 'profesional') ?? []
  const estudiantes = filas?.filter((f) => f.rol === 'estudiante_familia') ?? []

  return (
    <FadeIn className="space-y-5">
      <PageHeader
        title="Profesionales y estudiantes"
        subtitle="Quiénes se registraron en Método Estudio. El pago se confirma por fuera de la app — acá podés cortar o reactivar el acceso de quien corresponda."
      />

      {error && <p className="text-[14.5px] text-danger">No se pudo cargar: {error}</p>}

      {filas === null && !error ? (
        <p className="text-[14.5px] text-muted-foreground">Cargando…</p>
      ) : (
        <>
          <Seccion titulo="Profesionales" icon={Briefcase} filas={profesionales} onCambiarAcceso={cambiarAcceso} actualizando={actualizando} />
          <Seccion titulo="Estudiantes y familias" icon={GraduationCap} filas={estudiantes} onCambiarAcceso={cambiarAcceso} actualizando={actualizando} />
        </>
      )}
    </FadeIn>
  )
}

function Seccion({
  titulo,
  icon: Icon,
  filas,
  onCambiarAcceso,
  actualizando,
}: {
  titulo: string
  icon: typeof Briefcase
  filas: FilaPerfil[]
  onCambiarAcceso: (fila: FilaPerfil, activo: boolean) => void
  actualizando: string | null
}) {
  return (
    <div>
      <h2 className="mb-2.5 flex items-center gap-2 text-[16.5px] font-semibold tracking-tight">
        <Icon className="h-4 w-4 text-primary" /> {titulo} ({filas.length})
      </h2>
      {filas.length === 0 ? (
        <p className="text-[14px] text-muted-foreground">Todavía no hay nadie en esta categoría.</p>
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {filas.map((f) => {
            const esElla = f.email === MAIL_ADMIN
            return (
              <Card key={f.id}>
                <CardContent className="space-y-1.5 pt-4 text-[14.5px]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium">{f.nombre}</p>
                      <p className="truncate text-muted-foreground">{f.email}</p>
                    </div>
                    {f.acceso_activo ? (
                      <Badge variant="verde">Al día</Badge>
                    ) : (
                      <Badge variant="danger">Acceso cortado</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {f.es_menor && <Badge variant="secundario">Mail de un adulto (menor)</Badge>}
                    <span className="text-[12.5px] text-faint">Registrado el {fechaLarga(f.created_at)}</span>
                  </div>
                  {!esElla && (
                    <div className="pt-2">
                      {f.acceso_activo ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={actualizando === f.id}
                          onClick={() => onCambiarAcceso(f, false)}
                        >
                          <ShieldX className="h-3.5 w-3.5" /> Cortar acceso
                        </Button>
                      ) : (
                        <Button size="sm" disabled={actualizando === f.id} onClick={() => onCambiarAcceso(f, true)}>
                          Reactivar acceso
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
