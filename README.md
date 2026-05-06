# Muneeb Ur Rehman Portfolio

Premium solo-studio portfolio built with Next.js, Tailwind CSS, and Supabase. The public site is designed for high-trust website and AI systems work, with a Supabase-backed admin panel for editing content.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## Supabase

Set these environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Run the latest migration in `supabase/migrations/20260506_premium_cms_schema.sql`, then create an admin Auth user and add it to `public.admin_profiles`.

## Documentation

- Admin usage: `docs/admin-guide.md`
- Deployment: `docs/deployment.md`
- Redesign spec: `docs/superpowers/specs/2026-05-06-premium-portfolio-redesign-design.md`
- Implementation plan: `docs/superpowers/plans/2026-05-06-premium-portfolio-redesign.md`

## Checks

```bash
npm run lint
npm run build
```

## Deploy

Deploy on Vercel or Netlify after setting the Supabase environment variables. Test admin login, content editing, image upload, and the contact form on staging before pointing the live domain.
