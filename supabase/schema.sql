-- Método Estudio — tabla de cuentas (profesionales y estudiantes/familias)
-- Pegar y correr esto en Supabase: Project → SQL Editor → New query → Run.
-- Solo guarda la cuenta (mail, rol, si es menor, nombre) — los datos de
-- estudio en sí (fichas, autoperfil, etc.) siguen 100% locales en cada
-- dispositivo, no pasan por acá.

create table public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  rol text not null check (rol in ('profesional', 'estudiante_familia')),
  es_menor boolean not null default false,
  nombre text not null,
  acceso_activo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.perfiles enable row level security;

-- Cada persona puede crear su propia fila al registrarse.
create policy "insertar_propio_perfil"
  on public.perfiles for insert
  with check (auth.uid() = id);

-- Cada persona puede ver su propia fila.
create policy "ver_propio_perfil"
  on public.perfiles for select
  using (auth.uid() = id);

-- Irene (por su mail) puede ver todas las filas, para el panel de admin.
create policy "admin_ve_todos_los_perfiles"
  on public.perfiles for select
  using (auth.jwt() ->> 'email' = 'irenemorbidelli@gmail.com');

-- Irene puede cortar o reactivar el acceso de cualquier cuenta (pago manual).
create policy "admin_actualiza_acceso"
  on public.perfiles for update
  using (auth.jwt() ->> 'email' = 'irenemorbidelli@gmail.com')
  with check (auth.jwt() ->> 'email' = 'irenemorbidelli@gmail.com');
