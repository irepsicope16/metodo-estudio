// ------------------------------------------------------------
// Recordatorios: la app no tiene backend, así que no existen avisos push
// reales en segundo plano (eso requeriría un servidor). Lo que sí podemos
// dar, con honestidad: (1) un aviso dentro de la app cuando la racha está
// en riesgo, y (2) opcionalmente una notificación del navegador, que solo
// suena mientras la app sigue abierta en una pestaña o instalada.
// ------------------------------------------------------------

export type PermisoNotificacion = 'default' | 'granted' | 'denied' | 'no-soportado'

export function soportaNotificaciones(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function permisoActual(): PermisoNotificacion {
  if (!soportaNotificaciones()) return 'no-soportado'
  return Notification.permission
}

export async function pedirPermisoNotificaciones(): Promise<PermisoNotificacion> {
  if (!soportaNotificaciones()) return 'no-soportado'
  return Notification.requestPermission()
}

const KEY_ULTIMO_AVISO = 'me:ultimo-aviso-racha'

/** Dispara una notificación del navegador, como máximo una vez por día. */
export function notificarRachaEnRiesgo(racha: number) {
  if (!soportaNotificaciones() || Notification.permission !== 'granted') return
  const hoy = new Date().toISOString().slice(0, 10)
  if (localStorage.getItem(KEY_ULTIMO_AVISO) === hoy) return
  new Notification('Tu racha está en riesgo 🔥', {
    body: `Llevás ${racha} ${racha === 1 ? 'día' : 'días'} seguidos — entrá a Método Estudio y hacé algo hoy para no perderla.`,
    icon: './pwa-192.png',
    tag: 'racha-en-riesgo',
  })
  localStorage.setItem(KEY_ULTIMO_AVISO, hoy)
}
