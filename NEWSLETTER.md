# Small Pot newsletter

The newsletter is a public signup form (`/newsletter`) plus a password-gated admin
page (`/admin`) for writing, previewing, and sending issues. The frontend renders
everything; the backend is a handful of Netlify Functions (v2). Storage is three
tables (`sp_subscribers`, `sp_newsletters`, `sp_sends`) in Andrew's personal Supabase
project, written only with the service-role key (RLS is on with no policies, so the
anon key can't touch them). Resend does the actual sending.

## Env vars

Set these in Netlify (Site configuration -> Environment variables) and mirror them into
a local `.env` (see `.env.example`, gitignored):

| Var | Purpose |
| --- | --- |
| `RESEND_API_KEY` | A send-only Resend API key. Audiences/Broadcasts/Domains aren't used. |
| `ADMIN_PASSWORD` | The password for `/admin`. Sent as `Authorization: Bearer <password>`. |
| `NEWSLETTER_SECRET` | Random secret (`openssl rand -hex 32`) that signs unsubscribe links. |
| `NEWSLETTER_FROM` | e.g. `Small Pot <news@shopsmallpot.com>`. Must be on a Resend-verified domain to send to anyone but the account owner. |
| `NEWSLETTER_REPLY_TO` | Optional reply-to address. Can be empty. |
| `SITE_URL` | Optional. Only needed locally; Netlify sets `URL` automatically in production. |
| `SUPABASE_URL` | The Supabase project URL (`https://blnzwktmecwgdhmmasxi.supabase.co`). |
| `SUPABASE_SERVICE_ROLE_KEY` | The project's service-role key, from Supabase's API settings. **Never** the anon/publishable key; RLS has no policies on the `sp_*` tables, so only the service-role key can read or write them. |

Before first use, apply `supabase/migrations/20260912234500_newsletter.sql` to that
project. It creates the three `sp_*` tables with RLS on, plus a public storage
bucket, `sp-newsletter`, for newsletter images (public read via a storage policy;
writes go only through `/api/admin/upload` with the service-role key).

## Resend domain verification

`onboarding@resend.dev` only delivers to the Resend account's own email, so before
sending to the subscriber list:

1. In the Resend dashboard, add the sending domain (`shopsmallpot.com`) under Domains.
2. Add the DNS records Resend gives you (SPF/DKIM, usually 2-3 TXT/CNAME records) at
   the domain's registrar or DNS host.
3. Wait for Resend to show the domain as verified (usually minutes, can take longer
   depending on DNS propagation).
4. Set `NEWSLETTER_FROM` to an address on that domain and redeploy.

Until that's done, test sends to the account owner's own email still work.

## Running locally

```
npm install
npx netlify dev --port 8888   # or: npm run dev:netlify
```

This serves the Vite app and the functions together on `http://localhost:8888`, with
`.env` loaded automatically. `npm run dev` (plain Vite) does **not** serve the
functions, so `/api/*` calls will fail under it.

Typecheck the functions on their own (the root `tsc -b` doesn't cover `netlify/**`,
so this is a separate pass):

```
npx tsc --noEmit -p netlify/tsconfig.json
```

## Routing note

`public/_redirects` has an explicit `/api/*  /api/:splat  200` rule ahead of the SPA
catch-all, so `/api/*` requests resolve to their own path rather than the
`/index.html` fallback. (This wasn't the cause of a local quirk we hit, see below ,
but it's the standard, correct guard for API routes sitting next to a SPA fallback,
and it's a no-op change either way.)

Local-dev-only quirk, already handled: `netlify dev` retries a 404'd request as
`.html`, `.htm`, then `/index.html` (mimicking pretty-URL resolution) and can surface
the *last* retry's response to the client instead of the first. For
`/api/admin/newsletters/:id`, that meant a missing/unknown id could come back as a
400 instead of a 404. The functions now treat a route matched without an `:id`
(which can only happen from that dev-only retry chain) as a plain 404, so the
visible behavior is correct regardless. Confirmed via `netlify dev`'s own request
log, not just guessed.

## API

Public:

- `POST /api/subscribe` - `{ email, name?, website? }`. `website` is a honeypot.
- `GET /api/unsubscribe?t=<token>` / `POST /api/unsubscribe?t=<token>` - unsubscribe
  link target (GET shows a confirmation page; POST is the RFC 8058 one-click form).

Admin (all require `Authorization: Bearer <ADMIN_PASSWORD>`):

- `GET /api/admin/ping`
- `GET /api/admin/newsletters` / `POST /api/admin/newsletters`
- `GET /api/admin/newsletters/:id` / `PUT /api/admin/newsletters/:id` / `DELETE /api/admin/newsletters/:id`
- `POST /api/admin/newsletters/:id/send` - `{ mode: 'test', to }` or `{ mode: 'list' }`
- `GET /api/admin/subscribers` / `POST /api/admin/subscribers` (free-text import) /
  `PATCH /api/admin/subscribers` (`{ email, status }`)
- `POST /api/admin/upload` - multipart form, field `file`. jpeg/png/webp/gif only, 5 MB
  max. Returns 201 `{ url }`, the public URL of the uploaded image in the
  `sp-newsletter` bucket.

Shared server code lives in `netlify/lib/`: `auth.mts` (bearer check), `supabase.mts`
(service-role client), `stores.mts` (newsletter/subscriber/send-log queries built on
that client), `storage.mts` (image upload to the `sp-newsletter` bucket), `tokens.mts`
(unsubscribe token sign/verify), `site.mts` (site-origin resolution), `resend.mts`
(Resend client + chunk/sleep helpers).

Every list send also writes one row to `sp_sends` per recipient (the Resend message id
on success, the error text on failure), see that table for a per-issue delivery log.

## Before the first send to the list

1. Verify the sending domain in Resend (above) and point `NEWSLETTER_FROM` at it.
2. Set `ADMIN_PASSWORD` and `NEWSLETTER_SECRET` to random values in Netlify, not
   the placeholders from `.env.example`.
3. Send a `mode: 'test'` issue to yourself first and check it in an actual inbox
   (subject, unsubscribe link, images) before sending to the list.
