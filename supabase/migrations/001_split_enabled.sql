-- Stage 1: split needs.enabled into enabled_patient + enabled_caretaker.
--
-- Run this in the Supabase SQL editor against an existing project that
-- previously ran schema.sql with the single `enabled` column. Idempotent
-- thanks to the `if (not) exists` guards, so safe to run more than once.
--
-- Defaults all rows to enabled for both patient and caretaker. If you want
-- to disable specific needs later, do it from the Settings page in the app.

alter table public.needs
  add column if not exists enabled_patient boolean,
  add column if not exists enabled_caretaker boolean;

-- Enable every need for both flows on every existing row.
update public.needs
  set enabled_patient = true,
      enabled_caretaker = true;

alter table public.needs
  alter column enabled_patient set not null,
  alter column enabled_caretaker set not null,
  alter column enabled_patient set default true,
  alter column enabled_caretaker set default true;

-- Drop the legacy single flag once data has been carried over.
alter table public.needs drop column if exists enabled;
