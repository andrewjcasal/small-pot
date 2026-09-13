-- Small Pot newsletter: subscribers, issues, and a send log.
-- Lives in Andrew's personal "calendar" Supabase project (blnzwktmecwgdhmmasxi)
-- next to the lyh_* and cass_* tables, so every table is prefixed sp_.
-- Access is service-role only: RLS is on and there are no policies, so the
-- anon/publishable key can neither read nor write these. The Netlify
-- functions use SUPABASE_SERVICE_ROLE_KEY.

create table if not exists public.sp_subscribers (
  email text primary key,
  name text,
  status text not null default 'active' check (status in ('active', 'unsubscribed')),
  source text not null default 'site' check (source in ('site', 'import', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create index if not exists sp_subscribers_status_idx on public.sp_subscribers (status);

create table if not exists public.sp_newsletters (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'draft' check (status in ('draft', 'sent')),
  -- The NewsletterContent JSON from src/lib/newsletter-template.ts
  -- (subject, previewText, title, intro, hero image, sections, cta, sign-off).
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sent_at timestamptz,
  recipient_count integer,
  test_sent_at timestamptz
);

create index if not exists sp_newsletters_updated_at_idx on public.sp_newsletters (updated_at desc);

create table if not exists public.sp_sends (
  id bigint generated always as identity primary key,
  newsletter_id uuid not null references public.sp_newsletters (id) on delete cascade,
  email text not null,
  resend_id text,
  error text,
  created_at timestamptz not null default now()
);

create index if not exists sp_sends_newsletter_id_idx on public.sp_sends (newsletter_id);

alter table public.sp_subscribers enable row level security;
alter table public.sp_newsletters enable row level security;
alter table public.sp_sends enable row level security;

comment on table public.sp_subscribers is 'Small Pot newsletter subscribers (shopsmallpot.com). Written only by the Netlify functions with the service role.';
comment on table public.sp_newsletters is 'Small Pot newsletter issues. content is the NewsletterContent JSON rendered by src/lib/newsletter-template.ts.';
comment on table public.sp_sends is 'One row per recipient per list send, with the Resend message id or the error.';

-- Public image bucket for newsletter photos, icons and banners. Reads are public
-- (that is how inboxes fetch the images); writes happen only through the Netlify
-- upload function with the service role.
insert into storage.buckets (id, name, public)
values ('sp-newsletter', 'sp-newsletter', true)
on conflict (id) do update set public = true;

drop policy if exists "sp-newsletter public read" on storage.objects;
create policy "sp-newsletter public read"
  on storage.objects for select
  using (bucket_id = 'sp-newsletter');
