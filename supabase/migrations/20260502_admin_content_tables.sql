create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  hero_title text default 'I build what most people think takes years to learn.',
  hero_badge text default 'Available for projects',
  contact_title text default 'Got a project in mind? Let''s build it.',
  contact_subtitle text default 'Tell me what you need - a website, a chatbot, or both. I will get back to you with a clear plan and timeline.',
  footer_text text default 'Built with Next.js, Supabase, and a lot of late nights.',
  ticker_items jsonb default '["React","Next.js","TypeScript","Python","Tailwind CSS","Supabase","Node.js","AI Chatbots","Responsive Design","Git & GitHub","AWS","REST APIs"]',
  updated_at timestamptz default now()
);

insert into site_settings (hero_title)
select 'I build what most people think takes years to learn.'
where not exists (select 1 from site_settings);

create table if not exists hero_stats (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  label text not null,
  order_num int default 0,
  created_at timestamptz default now()
);

insert into hero_stats (value, label, order_num)
select value, label, order_num
from (
  values
    ('430+', 'GitHub contributions in the last year', 1),
    ('Self-taught', 'Learned web dev, AI, and deployment independently', 2),
    ('CS Student', 'Computer Science at NFC-IET, Multan, Pakistan', 3)
) as seed(value, label, order_num)
where not exists (select 1 from hero_stats);

create table if not exists timeline_items (
  id uuid primary key default gen_random_uuid(),
  phase text not null,
  description text not null,
  order_num int default 0,
  created_at timestamptz default now()
);

insert into timeline_items (phase, description, order_num)
select phase, description, order_num
from (
  values
    ('Phase 1', 'Started CS at NFC-IET and began learning programming independently - HTML, CSS, Python, JavaScript.', 1),
    ('Phase 2', 'Built first full-stack projects with Next.js and Supabase. Shipped a restaurant site and a student portal.', 2),
    ('Phase 3', 'Deployed AI chatbot systems on AWS. Integrated LLMs with Discord and built custom automation flows.', 3),
    ('Now', 'Building this portfolio and offering web development and AI chatbot services to real clients.', 4)
) as seed(phase, description, order_num)
where not exists (select 1 from timeline_items);

create table if not exists service_showcases (
  id uuid primary key default gen_random_uuid(),
  eyebrow text not null,
  title text not null,
  summary text not null,
  highlight text not null,
  deliverables jsonb default '[]',
  accent text default '247, 178, 77',
  tags jsonb default '[]',
  order_num int default 0,
  created_at timestamptz default now()
);

insert into service_showcases (eyebrow, title, summary, highlight, deliverables, accent, tags, order_num)
select eyebrow, title, summary, highlight, deliverables::jsonb, accent, tags::jsonb, order_num
from (
  values
    (
      'Website Systems',
      'Signature websites that feel like a product launch, not a template.',
      'Custom portfolio, brand, and business sites with cinematic motion, strong hierarchy, sharp copy layout, and conversion-aware journeys.',
      'Perfect for founders, agencies, consultants, personal brands, and modern businesses that need an unforgettable first impression.',
      '["Creative direction","Custom UI build","Lead capture flow","Responsive polish"]',
      '247, 178, 77',
      '["Storytelling","Performance","Premium Branding"]',
      1
    ),
    (
      'Business Chatbots',
      'AI chatbot experiences that answer faster, qualify leads, and save your team time.',
      'Smart chatbot systems for websites and business workflows with branded conversations, lead qualification, FAQ handling, and automation handoffs.',
      'Ideal for clinics, service businesses, local brands, support teams, and companies that want fast customer communication without sounding robotic.',
      '["Conversation flow","Lead routing","Business FAQ logic","Deployment support"]',
      '93, 226, 231',
      '["Lead Qualification","Support Automation","Branded UX"]',
      2
    )
) as seed(eyebrow, title, summary, highlight, deliverables, accent, tags, order_num)
where not exists (select 1 from service_showcases);

create table if not exists offer_packages (
  id uuid primary key default gen_random_uuid(),
  family text not null,
  title text not null,
  pitch text not null,
  best_for text not null,
  timeline text not null,
  deliverables jsonb default '[]',
  accent text default '247, 178, 77',
  order_num int default 0,
  created_at timestamptz default now()
);

insert into offer_packages (family, title, pitch, best_for, timeline, deliverables, accent, order_num)
select family, title, pitch, best_for, timeline, deliverables::jsonb, accent, order_num
from (
  values
    (
      'Web Development',
      'Starter Site',
      'A clean, modern landing page or portfolio site for personal brands, small businesses, or anyone who needs a strong online presence fast.',
      'Best for: founders, freelancers, local businesses',
      'Delivery: 1-2 weeks',
      '["Custom design","Mobile responsive","Contact form","SEO setup"]',
      '247, 178, 77',
      1
    ),
    (
      'Web Development',
      'Full Brand Site',
      'A multi-page website with custom animations, stronger storytelling, and conversion-focused structure for businesses ready to look professional.',
      'Best for: growing businesses, agencies, professionals',
      'Delivery: 2-4 weeks',
      '["Multi-page build","Custom animations","CMS integration","Performance optimized"]',
      '255, 122, 89',
      2
    ),
    (
      'AI Chatbots',
      'Lead Capture Bot',
      'A smart chatbot for your website that greets visitors, answers common questions, collects leads, and routes serious inquiries to you automatically.',
      'Best for: service businesses, clinics, consultants',
      'Delivery: 1-2 weeks',
      '["Custom Q&A flow","Lead capture","Email notifications","Easy deployment"]',
      '93, 226, 231',
      3
    ),
    (
      'AI Chatbots',
      'Support Assistant',
      'An advanced AI chatbot that handles customer support, booking inquiries, and FAQ responses with natural conversation and your brand voice.',
      'Best for: teams, clinics, e-commerce',
      'Delivery: 2-3 weeks',
      '["Knowledge base setup","Booking integration","Multi-channel support","Analytics dashboard"]',
      '126, 166, 255',
      4
    )
) as seed(family, title, pitch, best_for, timeline, deliverables, accent, order_num)
where not exists (select 1 from offer_packages);

create table if not exists building_next (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tags jsonb default '[]',
  accent text default '247, 178, 77',
  order_num int default 0,
  created_at timestamptz default now()
);

insert into building_next (title, description, tags, accent, order_num)
select title, description, tags::jsonb, accent, order_num
from (
  values
    (
      'Real Estate Platform',
      'A property showcase site with interactive maps and agent booking flows.',
      '["Next.js","Maps API","Lead Funnels"]',
      '247, 178, 77',
      1
    ),
    (
      'Healthcare Chatbot',
      'A patient-facing AI assistant for appointment booking and FAQ handling.',
      '["AI/LLM","Healthcare","Booking Logic"]',
      '93, 226, 231',
      2
    ),
    (
      'E-Commerce Assistant',
      'A product recommendation chatbot with cart integration and order tracking.',
      '["E-Commerce","AI Agent","WhatsApp"]',
      '126, 166, 255',
      3
    )
) as seed(title, description, tags, accent, order_num)
where not exists (select 1 from building_next);
