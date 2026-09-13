import type { Config, Context } from '@netlify/functions';
import { createSubscriber, getSubscriber, updateSubscriber } from '../lib/stores.mts';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async (req: Request, _context: Context): Promise<Response> => {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'invalid body' }, { status: 400 });
  }

  // Honeypot: a person never fills this in. Pretend success, store nothing.
  const website = typeof body.website === 'string' ? body.website.trim() : '';
  if (website) return Response.json({ ok: true });

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: 'enter a valid email' }, { status: 400 });
  }
  const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : undefined;

  const existing = await getSubscriber(email);
  const now = new Date().toISOString();

  if (existing) {
    if (existing.status === 'active') {
      return Response.json({ ok: true, already: true });
    }
    await updateSubscriber(email, {
      status: 'active',
      name: name ?? existing.name,
      updatedAt: now,
      unsubscribedAt: null,
    });
    return Response.json({ ok: true });
  }

  await createSubscriber({
    email,
    name,
    status: 'active',
    source: 'site',
    createdAt: now,
    updatedAt: now,
  });
  return Response.json({ ok: true });
};

export const config: Config = {
  path: '/api/subscribe',
  method: 'POST',
};
