/**
 * Public site origin resolution, shared by every function that needs to build an
 * absolute URL (unsubscribe links, the logo, the footer link).
 *
 * Netlify sets `URL` automatically once deployed. `SITE_URL` is an override for
 * local dev or a custom domain; falling back to the incoming request's own origin
 * keeps things working even if neither env var is set.
 */
export function resolveSiteUrl(req: Request): string {
  const configured = process.env.SITE_URL || process.env.URL;
  if (configured) return configured.replace(/\/+$/, '');
  return new URL(req.url).origin;
}
