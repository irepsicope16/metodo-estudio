import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Bell, Database, Download, Eye, Moon, Paintbrush, RefreshCcw, Sun, Trash2, Upload, Users } from 'lucide-react'
import { useEstudiantesStore } from '@/stores/estudiantesStore'
import { useUIStore, type Theme } from '@/stores/uiStore'
import { prepareBackup, importBackup, type PreparedBackup } from '@/services/storage/backup'
import { resetAllData, wipeEstudiante } from '@/services/storage/db'
import { pedirPermisoNotificaciones, permisoActual, soportaNotificaciones, type PermisoNotificacion } from '@/lib/recordatorios'
import { toast } from '@/components/ui/toast'
import { FadeIn, IconBadge, PageHeader } from '@/components/shared'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/misc'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)
  const avisosNavegadorActivos = useUIStore((s) => s.avisosNavegadorActivos)
  const setAvisosNavegadorActivos = useUIStore((s) => s.setAvisosNavegadorActivos)
  const qc = useQueryClient()

  const estudiantes = useEstudiantesStore((s) => s.estudiantes)
  const activoId = useEstudiantesStore((s) => s.activoId)
  const activo = estudiantes.find((e) => e.id === activoId)
  const renombrar = useEstudiantesStore((s) => s.renombrar)
  const cambiarDeEstudiante = useEstudiantesStore((s) => s.cambiarDeEstudiante)
  const eliminarEstudiante = useEstudiantesStore((s) => s.eliminar)

  const [nombreEditado, setNombreEditado] = useState(activo?.nombre ?? '')
  const [nombreGuardado, setNombreGuardado] = useState(false)

  const [resetOpen, setResetOpen] = useState(false)
  const [estudianteAEliminar, setEstudianteAEliminar] = useState<{ id: string; nombre: string } | null>(null)
  const importRef = useRef<HTMLInputElement>(null)
  const [backupReady, setBackupReady] = useState<PreparedBackup | null>(null)
  const [backupPreparing, setBackupPreparing] = useState(false)
  const [permiso, setPermiso] = useState<PermisoNotificacion>(permisoActual())

  async function alternarAvisos(activar: boolean) {
    if (!activar) {
      setAvisosNavegadorActivos(false)
      return
    }
    const res = await pedirPermisoNotificaciones()
    setPermiso(res)
    if (res === 'granted') {
      setAvisosNavegadorActivos(true)
    } else {
      setAvisosNavegadorActivos(false)
      toast.error(res === 'denied' ? 'Bloqueaste los avisos del navegador — podés habilitarlos desde el ícono del candado.' : 'Tu navegador no admite avisos.')
    }
  }

  return (
    <FadeIn>
      <PageHeader title="Ajustes" subtitle="Estudiante activo, apariencia y datos de la app." />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBadge icon={Users} tone="primario" /> Estudiante activo
            </CardTitle>
            <CardDescription>
              Varios estudiantes pueden usar la app en este mismo dispositivo, cada uno con su propio espacio —
              nada se mezcla entre ellos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activo && (
              <>
                <Input value={nombreEditado} onChange={(e) => setNombreEditado(e.target.value)} className="max-w-xs" />
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="sm"
                    onClick={() => {
                      if (!nombreEditado.trim()) return
                      renombrar(activo.id, nombreEditado.trim())
                      setNombreGuardado(true)
                      setTimeout(() => setNombreGuardado(false), 1500)
                    }}
                    disabled={!nombreEditado.trim()}
                  >
                    Guardar
                  </Button>
                  {nombreGuardado && <Badge variant="primario">Guardado ✓</Badge>}
                  <Button variant="outline" size="sm" onClick={cambiarDeEstudiante}>
                    <Users /> Cambiar de estudiante
                  </Button>
                </div>
              </>
            )}
            <Button asChild variant="outline" size="sm">
              <Link to="/bienvenida">
                <Eye /> Ver pantalla de bienvenida
              </Link>
            </Button>

            {estudiantes.length > 1 && (
              <div className="mt-2 space-y-1.5 border-t pt-3">
                <p className="text-[12px] font-medium text-muted-foreground">Todos los estudiantes en este dispositivo</p>
                {estudiantes.map((e) => (
                  <div key={e.id} className="flex items-center justify-between gap-2 rounded-lg border bg-surface-2 px-3 py-2">
                    <span className="flex items-center gap-2 text-[13px]">
                      {e.nombre}
                      {e.id === activoId && <Badge variant="primario">Activo</Badge>}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEstudianteAEliminar({ id: e.id, nombre: e.nombre })}
                      aria-label={`Eliminar a ${e.nombre}`}
                    >
                      <Trash2 className="text-danger" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBadge icon={Paintbrush} tone="secundario" /> Apariencia
            </CardTitle>
            <CardDescription>El tema se aplica al instante y queda guardado en este dispositivo.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { value: 'light', label: 'Claro', icon: Sun },
                  { value: 'dark', label: 'Oscuro', icon: Moon },
                  { value: 'system', label: 'Sistema', icon: RefreshCcw },
                ] as { value: Theme; label: string; icon: typeof Sun }[]
              ).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    'flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-4 transition-colors hover:bg-surface-2',
                    theme === opt.value && 'border-primary bg-primary-soft/50',
                  )}
                >
                  <opt.icon className="h-4 w-4" />
                  <span className="text-[12.5px] font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBadge icon={Bell} tone="acento" /> Recordatorios
            </CardTitle>
            <CardDescription>
              Cuando tu racha está en riesgo te avisamos con un cartel dentro de la app apenas la abrís. Como no hay
              servidor ni cuentas, no podemos mandarte avisos con la app cerrada — el aviso del navegador de acá abajo
              solo suena si dejás una pestaña (o la app instalada) abierta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-3 rounded-lg border bg-surface-2 p-3">
              <div>
                <p className="text-[13px] font-medium">Aviso del navegador</p>
                <p className="text-[11.5px] text-muted-foreground">
                  {!soportaNotificaciones()
                    ? 'Tu navegador no admite este tipo de aviso.'
                    : permiso === 'denied'
                      ? 'Bloqueado — habilitalo desde el ícono del candado en la barra de direcciones.'
                      : 'Pide permiso una vez; después avisa cuando la app está abierta.'}
                </p>
              </div>
              <Switch
                checked={avisosNavegadorActivos}
                onCheckedChange={alternarAvisos}
                disabled={!soportaNotificaciones() || permiso === 'denied'}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBadge icon={Database} tone="dorado" /> Datos
            </CardTitle>
            <CardDescription>
              Todo lo que cargás se guarda localmente en este dispositivo, nada se envía a ningún servidor. Exportar
              e importar afecta solo al estudiante activo{activo ? ` (${activo.nombre})` : ''}.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            {backupReady ? (
              <Button size="sm" asChild>
                <a
                  href={backupReady.url}
                  download={backupReady.filename}
                  onClick={() => {
                    toast.success('Copia de seguridad descargada')
                    setTimeout(() => {
                      URL.revokeObjectURL(backupReady.url)
                      setBackupReady(null)
                    }, 0)
                  }}
                >
                  <Download /> Descargar {backupReady.filename}
                </a>
              </Button>
            ) : (
              <Button
                size="sm"
                disabled={backupPreparing}
                onClick={async () => {
                  setBackupPreparing(true)
                  try {
                    setBackupReady(await prepareBackup())
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : 'No se pudo generar la copia de seguridad')
                  } finally {
                    setBackupPreparing(false)
                  }
                }}
              >
                <Download /> {backupPreparing ? 'Preparando…' : 'Exportar copia de seguridad'}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => importRef.current?.click()}>
              <Upload /> Importar copia
            </Button>
            <input
              ref={importRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                e.target.value = ''
                if (!file) return
                const res = await importBackup(file)
                if (res.ok) {
                  await qc.invalidateQueries()
                  toast.success('Copia importada correctamente')
                } else {
                  toast.error(res.error ?? 'No se pudo importar la copia')
                }
              }}
            />
            <Button variant="ghost" size="sm" onClick={() => setResetOpen(true)}>
              <RefreshCcw /> Borrar datos de este estudiante
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Borrar datos del estudiante activo</DialogTitle>
            <DialogDescription>
              Se borrará todo lo cargado de {activo?.nombre ?? 'este estudiante'} (autoperfil, actividades, fichas,
              mapas, diario) — no afecta a otros estudiantes de este dispositivo. Esta acción no puede deshacerse —
              si querés conservarlo, exportá antes una copia de seguridad.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setResetOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                await resetAllData()
                await qc.invalidateQueries()
                setResetOpen(false)
                toast.success('Datos borrados')
              }}
            >
              Borrar todo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!estudianteAEliminar} onOpenChange={(open) => !open && setEstudianteAEliminar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar a {estudianteAEliminar?.nombre}</DialogTitle>
            <DialogDescription>
              Se borra a {estudianteAEliminar?.nombre} de la lista junto con todos sus datos en este dispositivo. Esta
              acción no puede deshacerse — si querés conservarlos, entrá a ese estudiante y exportá antes una copia de
              seguridad.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEstudianteAEliminar(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (!estudianteAEliminar) return
                await wipeEstudiante(estudianteAEliminar.id)
                eliminarEstudiante(estudianteAEliminar.id)
                await qc.invalidateQueries()
                setEstudianteAEliminar(null)
                toast.success('Estudiante eliminado')
              }}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </FadeIn>
  )
}
