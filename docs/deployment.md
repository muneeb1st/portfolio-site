# Deployment Guide

## Required Environment Variables

Set these in `.env.local` for local development and in Vercel or Netlify for production:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

Never expose the Supabase service role key in the frontend.

## Supabase Setup

1. Create or open the Supabase project.
2. Run `supabase/migrations/20260506_premium_cms_schema.sql` in the SQL editor or through the Supabase CLI.
3. Create an admin user in Supabase Auth.
4. Insert that user into `public.admin_profiles`.
5. Confirm these buckets exist: `profile-images`, `project-images`, and `site-media`.
6. Confirm RLS is enabled on all public tables.

## Local Verification

Run:

```bash
npm install
npm run lint
npm run build
npm run dev
```

Open `http://localhost:3000` and check the homepage. Open `http://localhost:3000/admin` and confirm login works with the admin user.

## Production Deployment

Recommended platform: Vercel.

1. Import the repository.
2. Set the required Supabase environment variables.
3. Use the default Next.js build command: `npm run build`.
4. Deploy to a staging URL first.
5. Test the homepage, contact form, admin login, project editing, and image upload.
6. Move the live domain only after the staging checks pass.

## Post-Deploy Checklist

- Homepage loads without console errors.
- Contact form creates a `contact_messages` row.
- Admin can edit site settings.
- Admin can upload project/profile images.
- Public users cannot read contact messages.
- Public users cannot write content tables.
- Lighthouse scores are checked on staging for Performance, Accessibility, Best Practices, and SEO.
