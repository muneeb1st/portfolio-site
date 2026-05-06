# Admin Guide

## Access

Open `/admin` and sign in with a Supabase Auth user that has a matching row in `public.admin_profiles`.

Create the first admin profile from the Supabase SQL editor after creating the auth user:

```sql
insert into public.admin_profiles (user_id, email)
select id, email
from auth.users
where email = 'you@example.com'
on conflict (user_id) do nothing;
```

## Editing Content

- **Dashboard:** quick overview of projects, certificates, messages, and content setup.
- **Site Settings:** edit hero headline, hero badge, contact copy, footer copy, ticker items, SEO fields, and future chatbot settings.
- **Hero Stats:** manage the proof points under the hero.
- **Timeline:** edit the short founder/story timeline.
- **Projects:** add portfolio projects, technologies, links, featured state, sort order, and project images.
- **Services:** edit service showcases and offer packages.
- **Roadmap:** edit future builds or experiments.
- **Messages:** review and delete contact form submissions.
- **About Me:** edit name, tagline, bio, email, socials, and profile image.
- **Skill Stack:** edit grouped skills shown on the homepage.

## Images

Project images upload to the `project-images` bucket. Profile images upload to the `profile-images` bucket. The production migration makes these buckets publicly readable and admin-writable.

Use compressed WebP, AVIF, or JPG files where possible. For project thumbnails, aim for a 1200 by 760 source image under 300 KB.

## Publishing Workflow

Most content changes apply immediately because the homepage reads from Supabase at request time. If a deployment later changes the site to static regeneration, publish changes and trigger a redeploy or revalidation endpoint.

## Safety Notes

Do not put a Supabase `service_role` key in `.env.local` or any `NEXT_PUBLIC_` variable. The browser should only receive `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
