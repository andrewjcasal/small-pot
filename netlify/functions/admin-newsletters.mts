import type { Config, Context } from '@netlify/functions';
import { blankNewsletterContent, type NewsletterContent } from '../../src/lib/newsletter-template.ts';
import { requireAdmin } from '../lib/auth.mts';
import { createNewsletter, listNewsletters } from '../lib/stores.mts';

export default async (req: Request, _context: Context): Promise<Response> => {
  const denied = requireAdmin(req);
  if (denied) return denied;

  if (req.method === 'GET') {
    const newsletters = await listNewsletters();
    return Response.json({ newsletters });
  }

  if (req.method === 'POST') {
    let body: Partial<NewsletterContent>;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'invalid body' }, { status: 400 });
    }
    const content: NewsletterContent = {
      ...blankNewsletterContent(),
      ...body,
      sections: Array.isArray(body.sections) ? body.sections : [],
    };
    const newsletter = await createNewsletter(content);
    return Response.json({ newsletter }, { status: 201 });
  }

  return Response.json({ error: 'method not allowed' }, { status: 405 });
};

export const config: Config = {
  path: '/api/admin/newsletters',
  method: ['GET', 'POST'],
};
