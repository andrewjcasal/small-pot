import type { Config, Context } from '@netlify/functions';
import type { NewsletterContent } from '../../src/lib/newsletter-template.ts';
import { requireAdmin } from '../lib/auth.mts';
import { deleteNewsletter, getNewsletter, newsletterToContent, updateNewsletterContent } from '../lib/stores.mts';

export default async (req: Request, context: Context): Promise<Response> => {
  const denied = requireAdmin(req);
  if (denied) return denied;

  // A matched route always carries :id; an empty one can only mean no newsletter
  // matches, so treat it the same as a plain not-found rather than a 400.
  const id = context.params.id;
  if (!id) return Response.json({ error: 'not found' }, { status: 404 });

  const existing = await getNewsletter(id);

  if (req.method === 'GET') {
    if (!existing) return Response.json({ error: 'not found' }, { status: 404 });
    return Response.json({ newsletter: existing });
  }

  if (req.method === 'PUT') {
    if (!existing) return Response.json({ error: 'not found' }, { status: 404 });
    if (existing.status === 'sent') return Response.json({ error: 'already sent' }, { status: 409 });
    let body: Partial<NewsletterContent>;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'invalid body' }, { status: 400 });
    }
    // Spread the body's content fields wholesale rather than allowlisting them by
    // name, so this stays correct as NewsletterContent grows fields.
    const mergedContent: NewsletterContent = { ...newsletterToContent(existing), ...body };
    const updated = await updateNewsletterContent(id, mergedContent);
    if (!updated) return Response.json({ error: 'not found' }, { status: 404 });
    return Response.json({ newsletter: updated });
  }

  if (req.method === 'DELETE') {
    if (!existing) return Response.json({ error: 'not found' }, { status: 404 });
    if (existing.status === 'sent') return Response.json({ error: 'already sent' }, { status: 409 });
    await deleteNewsletter(id);
    return new Response(null, { status: 204 });
  }

  return Response.json({ error: 'method not allowed' }, { status: 405 });
};

export const config: Config = {
  path: '/api/admin/newsletters/:id',
  method: ['GET', 'PUT', 'DELETE'],
};
