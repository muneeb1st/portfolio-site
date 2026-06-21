# Portfolio Site DOX

## Purpose

- Own the production portfolio website built with Next.js, React, Tailwind CSS, Supabase, and Vercel.
- Cover public portfolio UX, admin content management, API routes, Supabase data access, documentation, and public assets.

## Ownership

- `app/` contains public routes, admin routes, API routes, global styles, and metadata.
- `components/` contains reusable client/server UI components.
- `lib/` contains Supabase clients, data loading, revalidation helpers, and admin schema helpers.
- `public/` contains static assets served by the app.
- `supabase/` contains database migrations.
- `docs/` contains app documentation and planning records.

## Local Contracts

- Keep portfolio copy honest, specific, and evidence-backed; do not add unsupported client, revenue, ROI, or technical claims.
- Treat recruiter and client scanning as first-class: resume, live demos, source links, and contact paths must stay easy to find.
- Public APIs that mutate server state or privileged behavior must require an appropriate server-side authorization check.
- Client-side admin route checks do not replace server-side or Supabase RLS protections for sensitive data.
- Do not commit generated QA screenshots, Lighthouse reports, temporary Playwright scripts, build output, or dependency folders.

## Work Guidance

- Prefer scoped edits that preserve the current dark editorial visual direction unless a redesign is explicitly approved.
- For UI changes, verify desktop and mobile rendering for the affected flow.
- Keep animations subtle and functional; avoid adding decoration before content proof improves.
- Preserve accessibility basics: visible focus, meaningful accessible names, readable contrast, and keyboard-accessible actions.
- Use concrete project language: problem, role, stack, decision, result/status.

## Verification

- Run `npm run lint` after code changes.
- Run `npm run build` after app, API, metadata, or TypeScript changes.
- For rendered UX changes, run a browser check against the relevant route and at least one mobile viewport.

## Child DOX Index

- No child AGENTS.md files are currently required. Add one only when a subfolder gains durable local rules that differ from this app contract.
