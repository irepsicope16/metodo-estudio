import { createClient } from '@supabase/supabase-js'

/**
 * Cliente de Supabase — único lugar del sistema donde la app sale a un
 * servidor propio. Guarda solo la cuenta (mail, rol, si es menor): los
 * datos de estudio (fichas, autoperfil, etc.) siguen 100% locales, como
 * siempre. La "publishable key" está pensada para ir en el código del
 * cliente — no es secreta — siempre que las tablas tengan Row Level
 * Security activado (ver supabase/schema.sql).
 */

const SUPABASE_URL = 'https://txzqivoubmfyqnprehrp.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_kfk_vwaQA3XNTthE_6lOMw_fi7l1hUd'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { flowType: 'pkce' },
})

/** Mail de la única cuenta con acceso al panel de administración. */
export const MAIL_ADMIN = 'irenemorbidelli@gmail.com'
