create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.about (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Muneeb Ur Rehman',
  tagline text not null default 'Premium websites and practical AI systems for businesses that need to be taken seriously.',
  bio text not null default 'I build polished web experiences and AI-assisted systems with a focus on trust, speed, and conversion.',
  email text,
  profile_image_url text,
  github_url text,
  linkedin_url text,
  twitter_url text,
  updated_at timestamptz not null default now()
);

insert into public.about (name)
select 'Muneeb Ur Rehman'
where not exists (select 1 from public.about);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  hero_title text not null default 'I build premium digital systems for brands that need to be taken seriously.',
  hero_badge text not null default 'Available for selective projects',
  contact_title text not null default 'Have a serious project in mind?',
  contact_subtitle text not null default 'Tell me what you are building, what needs to improve, and what a successful launch should accomplish.',
  footer_text text not null default 'Premium websites and AI systems.',
  ticker_items jsonb not null default '["Premium websites","AI chatbots","Conversion design","Supabase CMS","Fast launches"]',
  seo_title text not null default 'Muneeb Ur Rehman | Premium Websites & AI Systems',
  seo_description text not null default 'Premium solo-studio portfolio for websites, AI chatbot systems, and launch-ready digital experiences.',
  chatbot_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (hero_title)
select 'I build premium digital systems for brands that need to be taken seriously.'
where not exists (select 1 from public.site_settings);

alter table public.site_settings add column if not exists seo_title text not null default 'Muneeb Ur Rehman | Premium Websites & AI Systems';
alter table public.site_settings add column if not exists seo_description text not null default 'Premium solo-studio portfolio for websites, AI chatbot systems, and launch-ready digital experiences.';
alter table public.site_settings add column if not exists chatbot_enabled boolean not null default false;

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_key text not null default 'home',
  section_key text not null,
  label text,
  title text,
  body text,
  cta_label text,
  cta_href text,
  metadata jsonb not null default '{}',
  is_published boolean not null default true,
  order_num int not null default 0,
  updated_at timestamptz not null default now(),
  unique (page_key, section_key)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  description text not null,
  technologies jsonb not null default '[]',
  image_url text,
  demo_url text,
  github_url text,
  featured boolean not null default false,
  status text not null default 'published' check (status in ('draft', 'published')),
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects add column if not exists slug text;
alter table public.projects add column if not exists status text not null default 'published' check (status in ('draft', 'published'));
alter table public.projects add column if not exists "order" int not null default 0;
alter table public.projects add column if not exists created_at timestamptz not null default now();
alter table public.projects add column if not exists updated_at timestamptz not null default now();
create unique index if not exists projects_slug_unique on public.projects (slug) where slug is not null;

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issue_date date,
  credential_url text,
  status text not null default 'published' check (status in ('draft', 'published')),
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.certificates add column if not exists status text not null default 'published' check (status in ('draft', 'published'));
alter table public.certificates add column if not exists "order" int not null default 0;
alter table public.certificates add column if not exists created_at timestamptz not null default now();
alter table public.certificates add column if not exists updated_at timestamptz not null default now();

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  project_type text,
  budget_range text,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.contact_messages add column if not exists project_type text;
alter table public.contact_messages add column if not exists budget_range text;
alter table public.contact_messages add column if not exists status text not null default 'new' check (status in ('new', 'read', 'archived'));

create table if not exists public.hero_stats (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  label text not null,
  order_num int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.timeline_items (
  id uuid primary key default gen_random_uuid(),
  phase text not null,
  description text not null,
  order_num int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  skills jsonb not null default '[]',
  order_num int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_showcases (
  id uuid primary key default gen_random_uuid(),
  eyebrow text not null,
  title text not null,
  summary text not null,
  highlight text not null,
  deliverables jsonb not null default '[]',
  accent text not null default '244, 201, 120',
  tags jsonb not null default '[]',
  order_num int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.offer_packages (
  id uuid primary key default gen_random_uuid(),
  family text not null,
  title text not null,
  pitch text not null,
  best_for text not null,
  timeline text not null,
  deliverables jsonb not null default '[]',
  accent text not null default '244, 201, 120',
  order_num int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.building_next (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tags jsonb not null default '[]',
  accent text not null default '244, 201, 120',
  order_num int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;
alter table public.about enable row level security;
alter table public.site_settings enable row level security;
alter table public.page_sections enable row level security;
alter table public.projects enable row level security;
alter table public.certificates enable row level security;
alter table public.contact_messages enable row level security;
alter table public.hero_stats enable row level security;
alter table public.timeline_items enable row level security;
alter table public.skill_categories enable row level security;
alter table public.service_showcases enable row level security;
alter table public.offer_packages enable row level security;
alter table public.building_next enable row level security;

drop policy if exists "Admins can read own admin profile" on public.admin_profiles;
create policy "Admins can read own admin profile"
on public.admin_profiles
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Public can read about" on public.about;
create policy "Public can read about"
on public.about
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read published page sections" on public.page_sections;
create policy "Public can read published page sections"
on public.page_sections
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
on public.projects
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Public can read published certificates" on public.certificates;
create policy "Public can read published certificates"
on public.certificates
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Public can create contact messages" on public.contact_messages;
create policy "Public can create contact messages"
on public.contact_messages
for insert
to anon, authenticated
with check (
  length(trim(name)) between 1 and 140
  and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  and length(trim(message)) between 1 and 5000
);

drop policy if exists "Public can read hero stats" on public.hero_stats;
create policy "Public can read hero stats"
on public.hero_stats
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read timeline items" on public.timeline_items;
create policy "Public can read timeline items"
on public.timeline_items
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read skill categories" on public.skill_categories;
create policy "Public can read skill categories"
on public.skill_categories
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read service showcases" on public.service_showcases;
create policy "Public can read service showcases"
on public.service_showcases
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read offer packages" on public.offer_packages;
create policy "Public can read offer packages"
on public.offer_packages
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read roadmap" on public.building_next;
create policy "Public can read roadmap"
on public.building_next
for select
to anon, authenticated
using (true);

drop policy if exists "Admins manage about" on public.about;
create policy "Admins manage about"
on public.about
for all
to authenticated
using (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())));

drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings"
on public.site_settings
for all
to authenticated
using (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())));

drop policy if exists "Admins manage page sections" on public.page_sections;
create policy "Admins manage page sections"
on public.page_sections
for all
to authenticated
using (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())));

drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects"
on public.projects
for all
to authenticated
using (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())));

drop policy if exists "Admins manage certificates" on public.certificates;
create policy "Admins manage certificates"
on public.certificates
for all
to authenticated
using (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())));

drop policy if exists "Admins manage contact messages" on public.contact_messages;
create policy "Admins manage contact messages"
on public.contact_messages
for all
to authenticated
using (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())));

drop policy if exists "Admins manage hero stats" on public.hero_stats;
create policy "Admins manage hero stats"
on public.hero_stats
for all
to authenticated
using (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())));

drop policy if exists "Admins manage timeline items" on public.timeline_items;
create policy "Admins manage timeline items"
on public.timeline_items
for all
to authenticated
using (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())));

drop policy if exists "Admins manage skill categories" on public.skill_categories;
create policy "Admins manage skill categories"
on public.skill_categories
for all
to authenticated
using (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())));

drop policy if exists "Admins manage service showcases" on public.service_showcases;
create policy "Admins manage service showcases"
on public.service_showcases
for all
to authenticated
using (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())));

drop policy if exists "Admins manage offer packages" on public.offer_packages;
create policy "Admins manage offer packages"
on public.offer_packages
for all
to authenticated
using (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())));

drop policy if exists "Admins manage roadmap" on public.building_next;
create policy "Admins manage roadmap"
on public.building_next
for all
to authenticated
using (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles where user_id = (select auth.uid())));

insert into storage.buckets (id, name, public)
values
  ('profile-images', 'profile-images', true),
  ('project-images', 'project-images', true),
  ('site-media', 'site-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read portfolio media" on storage.objects;
create policy "Public can read portfolio media"
on storage.objects
for select
to anon, authenticated
using (bucket_id in ('profile-images', 'project-images', 'site-media'));

drop policy if exists "Admins can upload portfolio media" on storage.objects;
create policy "Admins can upload portfolio media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('profile-images', 'project-images', 'site-media')
  and exists (select 1 from public.admin_profiles where user_id = (select auth.uid()))
);

drop policy if exists "Admins can update portfolio media" on storage.objects;
create policy "Admins can update portfolio media"
on storage.objects
for update
to authenticated
using (
  bucket_id in ('profile-images', 'project-images', 'site-media')
  and exists (select 1 from public.admin_profiles where user_id = (select auth.uid()))
)
with check (
  bucket_id in ('profile-images', 'project-images', 'site-media')
  and exists (select 1 from public.admin_profiles where user_id = (select auth.uid()))
);

drop policy if exists "Admins can delete portfolio media" on storage.objects;
create policy "Admins can delete portfolio media"
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('profile-images', 'project-images', 'site-media')
  and exists (select 1 from public.admin_profiles where user_id = (select auth.uid()))
);
