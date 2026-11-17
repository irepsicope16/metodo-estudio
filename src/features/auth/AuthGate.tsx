import { useState } from 'react'
import { BookOpen, Briefcase, CalendarDays, Eye, EyeOff, GraduationCap, ListChecks, Lock, Sparkles, Timer } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { FadeIn } from '@/components/shared'
import { BrandCover } from '@/branding/Logo'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import type { RolCuenta } from '@/types'

type Modo = 'login' | 'registro' | 'recuperar'

const CARACTERISTICAS = [
  { icon: Sparkles, texto: 'Autoperfil de 56 preguntas cortas, organizadas en 8 áreas — un punto de partida, no un diagnóstico.' },
  { icon: BookOpen, texto: 'Biblioteca con 8 rutas de estudio en 3 niveles de complejidad, explicadas en pocas líneas cada una.' },
  { icon: ListChecks, texto: 'Catálogo de actividades para practicar, no solo leer sobre la técnica.' },
  { icon: Timer, texto: '12 herramientas (cronómetro, fichas de repaso, mapas conceptuales y más) en un solo lugar.' },
  { icon: CalendarDays, texto: 'Agenda y planificadores para organizar entregas, evaluaciones y la semana.' },
]

/** Presentación pública antes del login — para que un/a colega que recibe el link entienda
 *  de qué se trata la app antes de registrarse. No se muestra durante la recuperación de
 *  contraseña, para mantener ese paso corto y enfocado. */
function PresentacionLanding({ onRegistrarse }: { onRegistrarse: () => void }) {
  return (
    <div className="mx-auto w-full max-w-[640px] rounded-2xl bg-gradient-to-br from-surface-2 via-surface to-accent-soft px-6 py-8 text-center shadow-[0_2px_4px_rgba(16,24,32,0.06),0_16px_32px_-12px_rgba(16,24,32,0.18)] sm:px-10">
      <BrandCover className="mx-auto max-w-[200px]" />
      <h1 className="font-display mt-5 text-[26px] font-bold tracking-tight sm:text-[32px]">
        Una plataforma para aprender a estudiar, no solo qué estudiar
      </h1>
      <p className="mx-auto mt-3 max-w-[520px] text-[15.5px] leading-relaxed text-muted-foreground">
        Creada por la Lic. Irene Morbidelli, psicopedagoga. Es un recurso más para el trabajo con estudiantes — vos
        decidís si lo usás, cuándo y con quién. No reemplaza tu criterio profesional.
      </p>

      <div className="mt-6 space-y-2.5 text-left">
        {CARACTERISTICAS.map((c, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border bg-surface p-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
              <c.icon className="h-4.5 w-4.5" />
            </span>
            <p className="text-[14px] leading-relaxed">{c.texto}</p>
          </div>
        ))}
      </div>

      <Button size="lg" className="mt-6 w-full max-w-[320px]" onClick={onRegistrarse}>
        Registrate y empezá
      </Button>
      <p className="mt-2.5 text-[13px] text-faint">¿Ya tenés cuenta? Bajá para ingresar.</p>
    </div>
  )
}

function CampoPassword({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  const [verPassword, setVerPassword] = useState(false)
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input id={id} type={verPassword ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} className="pr-10" />
        <button
          type="button"
          onClick={() => setVerPassword((v) => !v)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-faint hover:text-muted-foreground"
          aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          tabIndex={-1}
        >
          {verPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}

export function AuthGate() {
  const [modo, setModo] = useState<Modo>('login')

  return (
    <div className="flex min-h-screen w-full flex-col items-center overflow-y-auto bg-background p-4 py-10">
      {modo !== 'recuperar' && (
        <div className="mb-8 w-full">
          <PresentacionLanding onRegistrarse={() => setModo('registro')} />
        </div>
      )}
      <div className="w-full max-w-[460px] rounded-2xl bg-gradient-to-br from-surface-2 via-surface to-accent-soft px-6 py-8 shadow-[0_2px_4px_rgba(16,24,32,0.06),0_16px_32px_-12px_rgba(16,24,32,0.18)] sm:px-10">
        <FadeIn className="text-center">
          {modo === 'recuperar' && <BrandCover className="mx-auto max-w-[200px]" />}
          {modo === 'login' && <FormularioLogin onIrARegistro={() => setModo('registro')} onIrARecuperar={() => setModo('recuperar')} />}
          {modo === 'registro' && <FormularioRegistro onIrALogin={() => setModo('login')} />}
          {modo === 'recuperar' && <FormularioRecuperar onIrALogin={() => setModo('login')} />}
        </FadeIn>
      </div>
    </div>
  )
}

function FormularioLogin({ onIrARegistro, onIrARecuperar }: { onIrARegistro: () => void; onIrARecuperar: () => void }) {
  const iniciarSesion = useAuthStore((s) => s.iniciarSesion)
  const error = useAuthStore((s) => s.error)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar() {
    if (!email.trim() || !password) return
    setEnviando(true)
    try {
      await iniciarSesion({ email: email.trim(), password })
    } catch {
      // el error ya queda en el store
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <h1 className="font-display mt-6 text-[21.5px] font-semibold tracking-tight">Ingresar a Método Estudio</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">Entrá con tu cuenta.</p>
      <div className="mt-6 space-y-3 text-left">
        <div>
          <Label htmlFor="login-email">Mail</Label>
          <Input id="login-email" type="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <CampoPassword id="login-password" label="Contraseña" value={password} onChange={setPassword} />
        <div className="text-right">
          <button type="button" onClick={onIrARecuperar} className="text-[13.5px] text-muted-foreground underline">
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        {error && <p className="text-[14px] text-danger">{error}</p>}
        <Button className="w-full" disabled={!email.trim() || !password || enviando} onClick={enviar}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </Button>
      </div>
      <p className="mt-5 text-[14px] text-muted-foreground">
        ¿Todavía no tenés cuenta?{' '}
        <button type="button" onClick={onIrARegistro} className="font-medium text-primary underline">
          Registrate
        </button>
      </p>
    </>
  )
}

function FormularioRecuperar({ onIrALogin }: { onIrALogin: () => void }) {
  const pedirRecuperacion = useAuthStore((s) => s.pedirRecuperacion)
  const error = useAuthStore((s) => s.error)
  const [email, setEmail] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  async function enviar() {
    if (!email.trim()) return
    setEnviando(true)
    try {
      await pedirRecuperacion(email.trim())
      setEnviado(true)
    } catch {
      // el error ya queda en el store
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <>
        <h1 className="font-display mt-6 text-[21.5px] font-semibold tracking-tight">Revisá tu mail</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Te mandamos un link a <strong>{email}</strong> para elegir una contraseña nueva.
        </p>
        <Button className="mt-6 w-full" variant="outline" onClick={onIrALogin}>
          Volver a ingresar
        </Button>
      </>
    )
  }

  return (
    <>
      <h1 className="font-display mt-6 text-[21.5px] font-semibold tracking-tight">Restablecer contraseña</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">Te mandamos un link a tu mail para elegir una nueva.</p>
      <div className="mt-6 space-y-3 text-left">
        <div>
          <Label htmlFor="rec-email">Mail</Label>
          <Input id="rec-email" type="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {error && <p className="text-[14px] text-danger">{error}</p>}
        <Button className="w-full" disabled={!email.trim() || enviando} onClick={enviar}>
          {enviando ? 'Enviando…' : 'Enviar instrucciones'}
        </Button>
      </div>
      <p className="mt-5 text-[14px] text-muted-foreground">
        <button type="button" onClick={onIrALogin} className="font-medium text-primary underline">
          Volver a ingresar
        </button>
      </p>
    </>
  )
}

/** Pantalla que se muestra al volver del link de recuperación de mail, para elegir la contraseña nueva. */
export function NuevaPasswordGate() {
  const actualizarPassword = useAuthStore((s) => s.actualizarPassword)
  const cancelarRecuperacion = useAuthStore((s) => s.cancelarRecuperacion)
  const error = useAuthStore((s) => s.error)
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [enviando, setEnviando] = useState(false)
  const passwordsOk = password.length >= 6 && password === confirmar

  async function enviar() {
    if (!passwordsOk) return
    setEnviando(true)
    try {
      await actualizarPassword(password)
    } catch {
      // el error ya queda en el store
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-y-auto bg-background p-4">
      <div className="w-full max-w-[460px] rounded-2xl bg-gradient-to-br from-surface-2 via-surface to-accent-soft px-6 py-8 shadow-[0_2px_4px_rgba(16,24,32,0.06),0_16px_32px_-12px_rgba(16,24,32,0.18)] sm:px-10">
        <FadeIn className="text-center">
          <BrandCover className="mx-auto max-w-[200px]" />
          <h1 className="font-display mt-6 text-[21.5px] font-semibold tracking-tight">Elegí tu nueva contraseña</h1>
          <div className="mt-6 space-y-3 text-left">
            <CampoPassword id="nueva-password" label="Contraseña nueva (mínimo 6 caracteres)" value={password} onChange={setPassword} />
            <CampoPassword id="nueva-password-confirmar" label="Repetila" value={confirmar} onChange={setConfirmar} />
            {confirmar && !passwordsOk && <p className="text-[13px] text-danger">Las contraseñas no coinciden (o son muy cortas).</p>}
            {error && <p className="text-[14px] text-danger">{error}</p>}
            <Button className="w-full" disabled={!passwordsOk || enviando} onClick={enviar}>
              {enviando ? 'Guardando…' : 'Guardar contraseña'}
            </Button>
            <Button variant="ghost" className="w-full" onClick={cancelarRecuperacion}>
              Cancelar
            </Button>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}

function FormularioRegistro({ onIrALogin }: { onIrALogin: () => void }) {
  const registrarse = useAuthStore((s) => s.registrarse)
  const error = useAuthStore((s) => s.error)
  const [rol, setRol] = useState<RolCuenta | null>(null)
  const [esMenor, setEsMenor] = useState(false)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [listo, setListo] = useState(false)

  const passwordsOk = password.length >= 6 && password === confirmar
  const puedeEnviar = !!rol && nombre.trim() && email.trim() && passwordsOk

  async function enviar() {
    if (!rol || !puedeEnviar) return
    setEnviando(true)
    try {
      await registrarse({ email: email.trim(), password, rol, esMenor, nombre: nombre.trim() })
      setListo(true)
    } catch {
      // el error ya queda en el store
    } finally {
      setEnviando(false)
    }
  }

  if (listo) {
    return (
      <>
        <h1 className="font-display mt-6 text-[21.5px] font-semibold tracking-tight">¡Cuenta creada!</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Revisá tu mail para confirmar la cuenta (si Método Estudio lo pide) y después ingresá con tu mail y
          contraseña.
        </p>
        <Button className="mt-6 w-full" onClick={onIrALogin}>
          Ir a ingresar
        </Button>
      </>
    )
  }

  if (!rol) {
    return (
      <>
        <h1 className="font-display mt-6 text-[21.5px] font-semibold tracking-tight">¿Cómo vas a usar Método Estudio?</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">Elegí una opción para crear tu cuenta.</p>
        <div className="mt-6 space-y-2.5 text-left">
          <button
            type="button"
            onClick={() => setRol('profesional')}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl border bg-surface px-4 py-3.5 text-left transition-colors hover:bg-surface-2"
          >
            <Briefcase className="h-5 w-5 shrink-0 text-primary" />
            <span>
              <span className="block font-medium">Soy profesional</span>
              <span className="block text-[13.5px] text-muted-foreground">Psicopedagogo/a, docente, acompañante</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setRol('estudiante_familia')}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl border bg-surface px-4 py-3.5 text-left transition-colors hover:bg-surface-2"
          >
            <GraduationCap className="h-5 w-5 shrink-0 text-primary" />
            <span>
              <span className="block font-medium">Soy estudiante o familia</span>
              <span className="block text-[13.5px] text-muted-foreground">Uso la app para mí o para quien acompaño</span>
            </span>
          </button>
        </div>
        <p className="mt-5 text-[14px] text-muted-foreground">
          ¿Ya tenés cuenta?{' '}
          <button type="button" onClick={onIrALogin} className="font-medium text-primary underline">
            Ingresá
          </button>
        </p>
      </>
    )
  }

  return (
    <>
      <h1 className="font-display mt-6 text-[21.5px] font-semibold tracking-tight">Creá tu cuenta</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
        {rol === 'profesional' ? 'Como profesional' : 'Como estudiante o familia'}.{' '}
        <button type="button" onClick={() => setRol(null)} className="underline">
          Cambiar
        </button>
      </p>
      <div className="mt-6 space-y-3 text-left">
        {rol === 'estudiante_familia' && (
          <label className="flex items-center gap-2 text-[14.5px]">
            <input type="checkbox" checked={esMenor} onChange={(e) => setEsMenor(e.target.checked)} className="h-4 w-4" />
            Sos menor de edad (vas a registrarte con el mail de un adulto responsable)
          </label>
        )}
        <div>
          <Label htmlFor="reg-nombre">Nombre</Label>
          <Input id="reg-nombre" autoFocus value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="reg-email">{esMenor ? 'Mail de un adulto responsable' : 'Mail'}</Label>
          <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <CampoPassword id="reg-password" label="Contraseña (mínimo 6 caracteres)" value={password} onChange={setPassword} />
        <CampoPassword id="reg-confirmar" label="Repetí la contraseña" value={confirmar} onChange={setConfirmar} />
        {confirmar && !passwordsOk && <p className="text-[13px] text-danger">Las contraseñas no coinciden (o son muy cortas).</p>}
        {error && <p className="text-[14px] text-danger">{error}</p>}
        <Button className="w-full" disabled={!puedeEnviar || enviando} onClick={enviar}>
          {enviando ? 'Creando…' : 'Crear cuenta'}
        </Button>
      </div>
      <p className="mt-5 text-[14px] text-muted-foreground">
        ¿Ya tenés cuenta?{' '}
        <button type="button" onClick={onIrALogin} className="font-medium text-primary underline">
          Ingresá
        </button>
      </p>
    </>
  )
}

/** Pantalla que se muestra cuando el acceso de la cuenta fue cortado manualmente (pago pendiente). */
export function AccesoSuspendidoGate() {
  const cerrarSesion = useAuthStore((s) => s.cerrarSesion)

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-y-auto bg-background p-4">
      <div className="w-full max-w-[460px] rounded-2xl bg-gradient-to-br from-surface-2 via-surface to-accent-soft px-6 py-8 text-center shadow-[0_2px_4px_rgba(16,24,32,0.06),0_16px_32px_-12px_rgba(16,24,32,0.18)] sm:px-10">
        <FadeIn>
          <BrandCover className="mx-auto max-w-[200px]" />
          <div className="mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft">
            <Lock className="h-5 w-5 text-danger" />
          </div>
          <h1 className="font-display mt-4 text-[21.5px] font-semibold tracking-tight">Tu acceso está pausado</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            Contactá a la profesional a cargo para regularizar tu acceso a Método Estudio.
          </p>
          <Button variant="outline" className="mt-6 w-full" onClick={cerrarSesion}>
            Cerrar sesión
          </Button>
        </FadeIn>
      </div>
    </div>
  )
}
