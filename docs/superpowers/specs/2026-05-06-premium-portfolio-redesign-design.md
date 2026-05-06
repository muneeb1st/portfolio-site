# Premium Portfolio Redesign Design

## Decision

Rebuild the portfolio as a premium solo-studio site: founder-led, editorial, restrained, and conversion-focused. The brand should feel like a high-trust digital studio that sells premium websites and practical AI systems, not like a generic developer portfolio.

## Current State

The app is already a Next.js 16, React 19, Tailwind 4, and Supabase project. The public site has animated sections, Supabase-backed content fetches, fallback data, a contact form, and an admin route tree. The admin panel covers many content areas, including about, site settings, projects, services, messages, skills, timeline, roadmap, hero stats, and certificates.

The current build is not production-ready. `npm run lint` fails in multiple admin files and temporary binary-looking TSX files. `npm run build` fails because `TiltPanel` is used with `onClick`, but its props do not accept DOM event handlers. Supabase setup is also incomplete: the migration creates some content tables but does not define all referenced tables, row-level security policies, storage policies, admin roles, or production-safe access rules.

## Product Goal

Create a world-class portfolio and lead-generation site for Muneeb Ur Rehman that presents him as a premium website and AI systems builder. The site must be visually memorable, fast on low-end mobile devices, editable by a non-technical admin, SEO-ready, and structured for a future chatbot widget.

## Visual Direction

Use a dark editorial foundation with warm luxury accents, exact typography, generous whitespace, and a small number of high-quality visual moments. Avoid the current overuse of glass panels, glow effects, large blur fields, and generic tech-dashboard styling. Motion should be cinematic but quiet: reveal timing, cursor-light restraint, tactile hover states, line-draw accents, and progressive case-study reveals.

The visual system should use:

- A dark neutral base, near-white text, warm amber or muted gold accent, and one cool support color used sparingly.
- Editorial typography with a strong display face and highly readable body face through `next/font`.
- Open layouts, bands, rails, and case-study panels instead of repetitive bento grids.
- Fewer, stronger sections with stronger copy hierarchy.
- CSS-first motion and small client components, with `prefers-reduced-motion` support.
- No heavy Three.js or Spline dependency for the first production rebuild.

## Information Architecture

The public site should use one polished landing page first, with content structured so future `/work/[slug]` case studies can be added without refactoring.

Primary sections:

1. Header with brand mark, concise nav, and one CTA.
2. Hero with founder-led positioning, primary CTA, secondary CTA, and a premium visual module.
3. Proof strip with selected stats and service signals.
4. Selected work with case-study cards and project detail modal or future slug path.
5. Services with two core offers: premium websites and AI chatbot systems.
6. Process with a clear client journey from discovery to launch.
7. About with founder story edited for confidence and trust.
8. Skills/proof with restrained technical credibility.
9. Contact with project-type routing and message capture.
10. Footer with SEO-friendly links and future chatbot mount point.

## Admin Experience

Keep a custom Supabase-backed admin panel, but redesign it as a simple CMS rather than a raw CRUD area. It should be usable by non-technical users and should support content editing without touching code.

Admin modules:

- Dashboard: content health, message count, quick edit links.
- Page Sections: edit hero, proof, about, process, contact, and footer copy.
- Projects: add/edit/remove projects, technologies, links, images, featured state, sort order.
- Services: edit service titles, descriptions, deliverables, CTAs, and sort order.
- Skills: edit grouped skills.
- Media: upload profile and project images through Supabase Storage.
- Messages: view/delete contact submissions.
- Settings: SEO title, description, social links, navigation labels, chatbot enabled flag.

## Supabase Architecture

Use Supabase Auth for admin login. Public reads should be allowed only for published content. Writes should be restricted to authenticated admin users. Never expose service role keys in client code.

Minimum schema:

- `site_settings`: global SEO, social, footer, nav, chatbot flags.
- `page_sections`: editable section content keyed by page and section.
- `projects`: portfolio work with slug, status, ordering, images, links, and metadata.
- `services`: service blocks and deliverables.
- `skills`: grouped skills and ordering.
- `contact_messages`: public insert-only message submissions, admin read/delete.
- `admin_profiles`: allowlist of admin users by `auth.users.id`.

Storage buckets:

- `profile-images`
- `project-images`
- `site-media`

Security rules:

- Enable RLS on every public table.
- Public can read published content only.
- Public can insert contact messages only.
- Authenticated admin users can manage content.
- Storage uploads are admin-only.
- Public can read approved public media.

## Performance Strategy

Public pages should be static-first where practical, with server-side Supabase fetching and fast fallbacks. Avoid client-side fetching for content that can render on the server. Use `next/image` for all controlled images and define stable dimensions to prevent layout shift.

Performance rules:

- Keep animation CSS-first and transform/opacity-only where possible.
- Use no heavy animation runtime unless a section clearly needs it.
- Use dynamic imports only for admin-only or optional client features.
- Add `prefers-reduced-motion` behavior.
- Avoid large blur filters and fixed animated backgrounds on low-end screens.
- Keep mobile layout dense, legible, and low-JS.
- Build should pass before visual polish is considered complete.

## Chatbot Readiness

Reserve a `#chatbot-root` mount point in the public layout and include a `chatbot_enabled` flag in settings. Do not build the chatbot now. Structure future integration around a lightweight widget component and an API route or edge function so it can be added without changing page architecture.

## Testing And Verification

Required before completion:

- `npm run lint`
- `npm run build`
- Manual responsive review for desktop, tablet, and low-width mobile.
- Supabase policy review against the intended public/admin access model.
- Confirm contact form insert still works with RLS.
- Confirm admin content updates work after login.

## Scope Boundary

This rebuild will produce a production-ready codebase and documentation. Live domain cutover, Figma handoff, and actual Supabase cloud provisioning depend on account access and deployment credentials. Where external access is unavailable, the repo will include migrations, environment documentation, and deployment instructions.
