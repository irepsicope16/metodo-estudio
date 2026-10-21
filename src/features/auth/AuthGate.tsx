import { useState } from 'react'
import { Briefcase, GraduationCap } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { FadeIn } from '@/components/shared'
import { BrandCover } from '@/branding/Logo'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import type { RolCuenta } from '@/types'

type Modo = 'login' | 'registro'

export function AuthGate() {
  const [modo, setModo] = useState<Modo>('login')

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-y-auto bg-background p-4">
      <div className="w-full max-w-[460px] rounded-2xl bg-gradient-to-br from-surface-2 via-surface to-accent-soft px-6 py-8 shadow-[0_2px_4px_rgba(16,24,32,0.06),0_16px_32px_-12px_rgba(16,24,32,0.18)] sm:px-10">
        <FadeIn className="text-center">
          <BrandCover className="mx-auto max-w-[200px]" />
          {modo === 'login' ? <FormularioLogin onIrARegistro={() => setModo('registro')} /> : <FormularioRegistro onIrALogin={() => setModo('login')} />}
        </FadeIn>
      </div>
    </div>
  )
}

function FormularioLogin({ onIrARegistro }: { onIrARegistro: () => void }) {
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
      <h1 className="font-display mt-6 text-[20px] font-semibold tracking-tight">Ingresar a Método Estudio</h1>
      <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">Entrá con tu cuenta.</p>
      <div className="mt-6 space-y-3 text-left">
        <div>
          <Label htmlFor="login-email">Mail</Label>
          <Input id="login-email" type="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="login-password">Contraseña</Label>
          <Input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && enviar()}
          />
        </div>
        {error && <p className="text-[12.5px] text-danger">{error}</p>}
        <Button className="w-full" disabled={!email.trim() || !password || enviando} onClick={enviar}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </Button>
      </div>
      <p className="mt-5 text-[12.5px] text-muted-foreground">
        ¿Todavía no tenés cuenta?{' '}
        <button type="button" onClick={onIrARegistro} className="font-medium text-primary underline">
          Registrate
        </button>
      </p>
    </>
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
        <h1 className="font-display mt-6 text-[20px] font-semibold tracking-tight">¡Cuenta creada!</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
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
        <h1 className="font-display mt-6 text-[20px] font-semibold tracking-tight">¿Cómo vas a usar Método Estudio?</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">Elegí una opción para crear tu cuenta.</p>
        <div className="mt-6 space-y-2.5 text-left">
          <button
            type="button"
            onClick={() => setRol('profesional')}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl border bg-surface px-4 py-3.5 text-left transition-colors hover:bg-surface-2"
          >
            <Briefcase className="h-5 w-5 shrink-0 text-primary" />
            <span>
              <span className="block font-medium">Soy profesional</span>
              <span className="block text-[12px] text-muted-foreground">Psicopedagogo/a, docente, acompañante</span>
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
              <span className="block text-[12px] text-muted-foreground">Uso la app para mí o para quien acompaño</span>
            </span>
          </button>
        </div>
        <p className="mt-5 text-[12.5px] text-muted-foreground">
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
      <h1 className="font-display mt-6 text-[20px] font-semibold tracking-tight">Creá tu cuenta</h1>
      <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
        {rol === 'profesional' ? 'Como profesional' : 'Como estudiante o familia'}.{' '}
        <button type="button" onClick={() => setRol(null)} className="underline">
          Cambiar
        </button>
      </p>
      <div className="mt-6 space-y-3 text-left">
        {rol === 'estudiante_familia' && (
          <label className="flex items-center gap-2 text-[13px]">
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
        <div>
          <Label htmlFor="reg-password">Contraseña (mínimo 6 caracteres)</Label>
          <Input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="reg-confirmar">Repetí la contraseña</Label>
          <Input id="reg-confirmar" type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />
          {confirmar && !passwordsOk && <p className="mt-1 text-[11.5px] text-danger">Las contraseñas no coinciden (o son muy cortas).</p>}
        </div>
        {error && <p className="text-[12.5px] text-danger">{error}</p>}
        <Button className="w-full" disabled={!puedeEnviar || enviando} onClick={enviar}>
          {enviando ? 'Creando…' : 'Crear cuenta'}
        </Button>
      </div>
      <p className="mt-5 text-[12.5px] text-muted-foreground">
        ¿Ya tenés cuenta?{' '}
        <button type="button" onClick={onIrALogin} className="font-medium text-primary underline">
          Ingresá
        </button>
      </p>
    </>
  )
}
