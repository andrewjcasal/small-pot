import type { Config, Context } from '@netlify/functions';
import { requireAdmin } from '../lib/auth.mts';
import { createSubscriber, getSubscriber, listSubscribers, updateSubscriber } from '../lib/stores.mts';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ParsedCandidate {
  email: string;
  name?: string;
}

/**
 * Pulls emails out of free text: comma/space/newline separated, plus an optional
 * "Name <email>" form. Anything that isn't a valid email lands in `invalid`.
 */
function extractCandidates(text: string): { candidates: ParsedCandidate[]; invalid: string[] } {
  const candidates: ParsedCandidate[] = [];
  const invalid: string[] = [];

  const angleRe = /([^<>,\n]*)<([^<>]+)>/g;
  const consumed: Array<[number, number]> = [];
  let match: RegExpExecArray | null;
  while ((match = angleRe.exec(text))) {
    const name = match[1].trim().replace(/^["']|["']$/g, '') || undefined;
    const email = match[2].trim();
    if (EMAIL_RE.test(email)) {
      candidates.push({ email, name });
    } else if (email) {
      invalid.push(email);
    }
    consumed.push([match.index, match.index + match[0].length]);
  }

  let rest = '';
  let cursor = 0;
  for (const [start, end] of consumed) {
    rest += text.slice(cursor, start);
    cursor = end;
  }
  rest += text.slice(cursor);

  const tokens = rest.split(/[\s,;]+/).map((t) => t.trim()).filter(Boolean);
  for (const token of tokens) {
    const cleaned = token.replace(/^["'(]+|["'),.;]+$/g, '');
    if (!cleaned) continue;
    if (EMAIL_RE.test(cleaned)) {
      candidates.push({ email: cleaned });
    } else {
      invalid.push(cleaned);
    }
  }

  return { candidates, invalid };
}

async function importSubscribers(text: string) {
  const { candidates, invalid } = extractCandidates(text);
  let added = 0;
  let existing = 0;
  let reactivated = 0;
  const now = new Date().toISOString();
  const seen = new Set<string>();

  for (const candidate of candidates) {
    const email = candidate.email.toLowerCase();
    if (seen.has(email)) continue;
    seen.add(email);

    const current = await getSubscriber(email);
    if (current) {
      if (current.status === 'unsubscribed') {
        await updateSubscriber(email, {
          status: 'active',
          name: candidate.name ?? current.name,
          updatedAt: now,
          unsubscribedAt: null,
        });
        reactivated++;
      } else {
        existing++;
      }
    } else {
      await createSubscriber({
        email,
        name: candidate.name,
        status: 'active',
        source: 'import',
        createdAt: now,
        updatedAt: now,
      });
      added++;
    }
  }

  return { added, existing, reactivated, invalid };
}

export default async (req: Request, _context: Context): Promise<Response> => {
  const denied = requireAdmin(req);
  if (denied) return denied;

  if (req.method === 'GET') {
    const subscribers = await listSubscribers();
    const active = subscribers.filter((s) => s.status === 'active').length;
    return Response.json({ subscribers, active });
  }

  if (req.method === 'POST') {
    let body: { text?: string };
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'invalid body' }, { status: 400 });
    }
    const text = typeof body.text === 'string' ? body.text : '';
    return Response.json(await importSubscribers(text));
  }

  if (req.method === 'PATCH') {
    let body: { email?: string; status?: string };
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'invalid body' }, { status: 400 });
    }
    const email = (body.email ?? '').trim().toLowerCase();
    const status = body.status;
    if (!email || (status !== 'active' && status !== 'unsubscribed')) {
      return Response.json({ error: 'invalid body' }, { status: 400 });
    }

    const existing = await getSubscriber(email);
    if (!existing) return Response.json({ error: 'not found' }, { status: 404 });

    const now = new Date().toISOString();
    const updated = await updateSubscriber(email, {
      status,
      updatedAt: now,
      unsubscribedAt: status === 'unsubscribed' ? now : null,
    });
    return Response.json({ subscriber: updated });
  }

  return Response.json({ error: 'method not allowed' }, { status: 405 });
};

export const config: Config = {
  path: '/api/admin/subscribers',
  method: ['GET', 'POST', 'PATCH'],
};
