-- Care Companion schema
-- Run this once in the Supabase SQL editor for a new project.

-- ----------------------------------------------------------------------------
-- patients
-- ----------------------------------------------------------------------------
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  caretaker_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  pin_hash text not null,
  pin_salt text not null,
  created_at timestamptz not null default now()
);

create index if not exists patients_caretaker_idx
  on public.patients (caretaker_user_id);

-- ----------------------------------------------------------------------------
-- needs
-- ----------------------------------------------------------------------------
create table if not exists public.needs (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  slug text not null,
  label text not null,
  enabled boolean not null default true,
  sort_order int not null default 0,
  unique (patient_id, slug)
);

create index if not exists needs_patient_idx on public.needs (patient_id);

-- ----------------------------------------------------------------------------
-- interactions
-- ----------------------------------------------------------------------------
create table if not exists public.interactions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  kind text not null check (kind in ('patient_request', 'caretaker_question')),
  need_slug text not null,
  response text check (response in ('yes', 'no')),
  created_at timestamptz not null default now()
);

create index if not exists interactions_patient_created_idx
  on public.interactions (patient_id, created_at desc);

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.patients enable row level security;
alter table public.needs enable row level security;
alter table public.interactions enable row level security;

-- patients: caretaker can CRUD their own rows
drop policy if exists "patients are owned by caretaker" on public.patients;
create policy "patients are owned by caretaker"
  on public.patients
  for all
  using (caretaker_user_id = auth.uid())
  with check (caretaker_user_id = auth.uid());

-- needs: caretaker can CRUD rows for patients they own
drop policy if exists "needs follow patient ownership" on public.needs;
create policy "needs follow patient ownership"
  on public.needs
  for all
  using (
    exists (
      select 1 from public.patients p
      where p.id = needs.patient_id
        and p.caretaker_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.patients p
      where p.id = needs.patient_id
        and p.caretaker_user_id = auth.uid()
    )
  );

-- interactions: same pattern
drop policy if exists "interactions follow patient ownership" on public.interactions;
create policy "interactions follow patient ownership"
  on public.interactions
  for all
  using (
    exists (
      select 1 from public.patients p
      where p.id = interactions.patient_id
        and p.caretaker_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.patients p
      where p.id = interactions.patient_id
        and p.caretaker_user_id = auth.uid()
    )
  );

-- Realtime: enable for interactions so the patient and caretaker views can
-- listen for new rows in real time on shared/multi-device setups.
alter publication supabase_realtime add table public.interactions;
