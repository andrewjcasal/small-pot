import type { Config, Context } from '@netlify/functions';
import { escapeHtml } from '../../src/lib/newsletter-template.ts';
import { resolveSiteUrl } from '../lib/site.mts';
import { getSubscriber, updateSubscriber } from '../lib/stores.mts';
import { verifyUnsubscribeToken } from '../lib/tokens.mts';

function page(message: string, siteUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>small pot</title>
<style>
  body { margin:0; padding:0; background-color:#1a1410; color:#e8dcc4; font-family:Georgia,Arial,sans-serif; }
  .wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; box-sizing:border-box; }
  .card { max-width:420px; text-align:center; }
  p { font-size:18px; line-height:1.6; margin:0 0 20px; }
  a { color:#8cc258; text-decoration:underline; }
</style>
</head>
<body>
<div class="wrap"><div class="card">
<p>${escapeHtml(message)}</p>
<a href="${escapeHtml(siteUrl)}">small pot</a>
</div></div>
</body>
</html>`;
}

function htmlResponse(body: string, status: number): Response {
  return new Response(body, { status, headers: { 'content-type': 'text/html; charset=utf-8' } });
}

export default async (req: Request, _context: Context): Promise<Response> => {
  const url = new URL(req.url);
  const token = url.searchParams.get('t') ?? '';
  const isPost = req.method === 'POST';
  const siteUrl = resolveSiteUrl(req);

  if (token === 'test') {
    if (isPost) return new Response(null, { status: 200 });
    return htmlResponse(page('that was a test link, nothing changed.', siteUrl), 200);
  }

  const email = await verifyUnsubscribeToken(token);
  if (!email) {
    if (isPost) return new Response(null, { status: 400 });
    return htmlResponse(page("that link didn't work.", siteUrl), 400);
  }

  const existing = await getSubscriber(email);
  if (existing && existing.status !== 'unsubscribed') {
    const now = new Date().toISOString();
    await updateSubscriber(email, { status: 'unsubscribed', updatedAt: now, unsubscribedAt: now });
  }
  // Unknown email: still show the confirmation, nothing to write.

  if (isPost) return new Response(null, { status: 200 });
  return htmlResponse(page("you're unsubscribed. no more emails from small pot.", siteUrl), 200);
};

export const config: Config = {
  path: '/api/unsubscribe',
  method: ['GET', 'POST'],
};
