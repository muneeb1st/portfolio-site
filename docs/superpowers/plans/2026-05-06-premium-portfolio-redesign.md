# Premium Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the current portfolio into a premium solo-studio website with a secure Supabase-backed CMS foundation.

**Architecture:** Keep the existing Next.js App Router project, but replace the large page/CSS implementation with focused public components, shared content adapters, a production-safe Supabase schema, and a cleaner admin CMS. Public content renders server-first with fallbacks; admin remains client-side behind Supabase Auth.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Supabase Auth/Database/Storage, `next/image`, CSS-first animation.

---

## File Structure

- Modify `app/page.tsx`: compose the new public landing page from focused sections.
- Modify `app/layout.tsx`: metadata, chatbot mount, and global body setup.
- Modify `app/globals.css`: replace visual system with premium tokens, responsive layout utilities, and motion rules.
- Modify `components/client-only.tsx`: fix `TiltPanel` typing and keep only lightweight client interactions.
- Modify `components/projects-client.tsx`: make project interactions accessible and build-safe.
- Create `components/site/*.tsx`: public section components if `app/page.tsx` becomes too large during implementation.
- Modify `lib/data.ts`: align content adapters with the final schema and keep safe fallbacks.
- Modify `lib/supabase.ts`: validate public env vars without crashing during build.
- Create `supabase/migrations/20260506_premium_cms_schema.sql`: production CMS schema with RLS and storage policies.
- Modify `app/admin/*`: fix build/lint failures and improve content editing screens incrementally.
- Create `docs/admin-guide.md`: explain admin editing, image uploads, and deployment workflow.
- Create `docs/deployment.md`: explain Supabase/Vercel environment setup and verification.

## Task 1: Stabilize The Existing Build

**Files:**
- Modify: `components/client-only.tsx`
- Modify: `components/projects-client.tsx`
- Modify: `app/admin/services/page.tsx`
- Modify: `app/admin/site-settings/page.tsx`
- Modify: `app/admin/skill-stack/page.tsx`
- Remove or ignore: `temp_page.tsx`, `temp_page_old.tsx`

- [ ] Extend `TiltPanel` props with `React.HTMLAttributes<HTMLDivElement>` so click handlers and ARIA attributes are accepted.
- [ ] Replace unescaped quotes and apostrophes in admin text with HTML entities or string interpolation.
- [ ] Remove unused `eslint-disable` comments.
- [ ] Remove binary temporary TSX files from lint scope by deleting them if they are not needed.
- [ ] Run `npm run lint`; expected result: no errors.
- [ ] Run `npm run build`; expected result: production build completes.

## Task 2: Build The Premium Public Visual System

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

- [ ] Replace the current glow-heavy theme with premium tokens: dark base, warm accent, cool support, restrained surfaces, consistent radii, and readable type.
- [ ] Add responsive type styles that do not use viewport-width font scaling directly.
- [ ] Add `prefers-reduced-motion` rules for reveal, ticker, pulse, and hover motion.
- [ ] Add stable section spacing, media frame, button, nav, and form primitives.
- [ ] Add `#chatbot-root` in the layout after page content.
- [ ] Run `npm run build`; expected result: no type or CSS compilation errors.

## Task 3: Recompose The Homepage

**Files:**
- Modify: `app/page.tsx`
- Optionally create: `components/site/header.tsx`
- Optionally create: `components/site/hero.tsx`
- Optionally create: `components/site/work.tsx`
- Optionally create: `components/site/services.tsx`
- Optionally create: `components/site/process.tsx`
- Optionally create: `components/site/about.tsx`
- Optionally create: `components/site/contact.tsx`

- [ ] Keep the homepage server-rendered by default.
- [ ] Rebuild the section order as Header, Hero, Proof, Work, Services, Process, About, Skills, Contact, Footer.
- [ ] Use stronger premium copy from the approved direction while preserving Supabase-editable fields.
- [ ] Replace repetitive glass cards with editorial panels, open bands, and case-study rows.
- [ ] Keep project modal interaction accessible with keyboard and focus-safe close behavior.
- [ ] Run `npm run build`; expected result: public route compiles.

## Task 4: Replace Supabase Prototype Schema With Secure CMS Schema

**Files:**
- Create: `supabase/migrations/20260506_premium_cms_schema.sql`
- Modify: `lib/data.ts`
- Modify: `lib/admin-schema.ts`

- [ ] Define missing tables: `about`, `projects`, `certificates`, `contact_messages`, `skill_categories`, and `admin_profiles`.
- [ ] Add or normalize `site_settings`, `page_sections`, `hero_stats`, `timeline_items`, `service_showcases`, `offer_packages`, and `building_next`.
- [ ] Enable RLS on every table in the public schema.
- [ ] Add public read policies only for published public content.
- [ ] Add public insert policy for `contact_messages`.
- [ ] Add admin manage policies based on `admin_profiles.user_id = auth.uid()`.
- [ ] Add storage bucket setup and admin-only upload policies.
- [ ] Update data adapters to use the final column names and safe fallbacks.
- [ ] Run `npm run build`; expected result: data types and imports compile.

## Task 5: Upgrade The Admin CMS Experience

**Files:**
- Modify: `app/admin/layout.tsx`
- Modify: `app/admin/dashboard/page.tsx`
- Modify: `app/admin/site-settings/page.tsx`
- Modify: `app/admin/projects/page.tsx`
- Modify: `app/admin/services/page.tsx`
- Modify: `app/admin/about/page.tsx`
- Modify: `app/admin/messages/page.tsx`

- [ ] Restyle admin as a clean CMS: lighter density, clearer labels, consistent form controls, and better mobile sidebar behavior.
- [ ] Add visible save states and error blocks instead of relying only on `alert`.
- [ ] Keep admin routes protected by `supabase.auth.getUser()`.
- [ ] Add schema-missing messages that point to the new migration.
- [ ] Ensure project and profile image uploads use the intended storage buckets.
- [ ] Run `npm run lint`; expected result: no admin lint errors.

## Task 6: Documentation And Production Readiness

**Files:**
- Create: `docs/admin-guide.md`
- Create: `docs/deployment.md`
- Modify: `README.md`

- [ ] Document how to log into admin, edit content, add projects, upload images, review messages, and update SEO settings.
- [ ] Document required environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] Document how to apply Supabase migrations and create the first admin profile.
- [ ] Document Vercel deployment steps and post-deploy checks.
- [ ] Run `npm run lint` and `npm run build`; expected result: both pass.

## Self-Review

- Spec coverage: visual redesign, static-first performance, Supabase CMS, admin editing, chatbot readiness, SEO/deployment docs, and production verification are each covered by tasks.
- Placeholder scan: no task depends on an undefined placeholder; external deployment credentials remain explicitly out of local scope.
- Type consistency: content entities match existing app concepts and the planned secure schema.
