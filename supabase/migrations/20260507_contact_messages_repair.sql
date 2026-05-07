alter table public.contact_messages enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on public.contact_messages to anon, authenticated;
grant select, delete on public.contact_messages to authenticated;

drop policy if exists "Public can create contact messages" on public.contact_messages;
drop policy if exists "Anyone can submit contact messages" on public.contact_messages;
create policy "Anyone can submit contact messages"
on public.contact_messages
for insert
to anon, authenticated
with check (
  nullif(trim(name), '') is not null
  and nullif(trim(email), '') is not null
  and nullif(trim(message), '') is not null
);

drop policy if exists "Admins manage contact messages" on public.contact_messages;
create policy "Admins manage contact messages"
on public.contact_messages
for all
to authenticated
using (
  exists (
    select 1
    from public.admin_profiles
    where user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.admin_profiles
    where user_id = (select auth.uid())
  )
);
