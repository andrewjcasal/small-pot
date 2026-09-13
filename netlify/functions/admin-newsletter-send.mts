import type { Config, Context } from '@netlify/functions';
import { renderNewsletterHtml, renderNewsletterText } from '../../src/lib/newsletter-template.ts';
import { requireAdmin } from '../lib/auth.mts';
import { chunk, getResendClient, sleep } from '../lib/resend.mts';
import { resolveSiteUrl } from '../lib/site.mts';
import { getNewsletter, listActiveSubscribers, markNewsletterSent, markNewsletterTestSent, recordSend } from '../lib/stores.mts';
import { generateUnsubscribeToken } from '../lib/tokens.mts';

const CHUNK_SIZE = 100;
const CHUNK_PAUSE_MS = 650;

interface SendBody {
  mode?: 'test' | 'list';
  to?: string;
}

export default async (req: Request, context: Context): Promise<Response> => {
  const denied = requireAdmin(req);
  if (denied) return denied;

  // A matched route always carries :id; an empty one can only mean no newsletter
  // matches, so treat it the same as a plain not-found rather than a 400.
  const id = context.params.id;
  if (!id) return Response.json({ error: 'not found' }, { status: 404 });

  let body: SendBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'invalid body' }, { status: 400 });
  }

  const newsletter = await getNewsletter(id);
  if (!newsletter) return Response.json({ error: 'not found' }, { status: 404 });

  const siteUrl = resolveSiteUrl(req);
  const from = process.env.NEWSLETTER_FROM ?? '';
  const replyTo = process.env.NEWSLETTER_REPLY_TO?.trim() || undefined;
  const resend = getResendClient();

  if (body.mode === 'test') {
    const to = (body.to ?? '').trim();
    if (!to) return Response.json({ error: 'missing "to"' }, { status: 400 });

    const unsubscribeUrl = `${siteUrl}/api/unsubscribe?t=test`;
    const html = renderNewsletterHtml(newsletter, { unsubscribeUrl, siteUrl });
    const text = renderNewsletterText(newsletter, { unsubscribeUrl, siteUrl });

    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      ...(replyTo ? { replyTo } : {}),
      subject: `[test] ${newsletter.subject}`,
      html,
      text,
    });
    if (error) return Response.json({ error: error.message }, { status: 502 });

    await markNewsletterTestSent(id, new Date().toISOString());
    return Response.json({ ok: true, id: data?.id });
  }

  if (body.mode === 'list') {
    if (newsletter.status === 'sent') return Response.json({ error: 'already sent' }, { status: 409 });

    const active = await listActiveSubscribers();
    if (active.length === 0) return Response.json({ error: 'no active subscribers' }, { status: 400 });

    const chunks = chunk(active, CHUNK_SIZE);
    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const batch = chunks[i];
      const payloads = await Promise.all(
        batch.map(async (subscriber) => {
          const token = await generateUnsubscribeToken(subscriber.email);
          const unsubscribeUrl = `${siteUrl}/api/unsubscribe?t=${token}`;
          const html = renderNewsletterHtml(newsletter, { unsubscribeUrl, siteUrl });
          const text = renderNewsletterText(newsletter, { unsubscribeUrl, siteUrl });
          return {
            from,
            to: [subscriber.email],
            ...(replyTo ? { replyTo } : {}),
            subject: newsletter.subject,
            html,
            text,
            headers: {
              'List-Unsubscribe': `<${unsubscribeUrl}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
          };
        }),
      );

      try {
        const { data, error } = await resend.batch.send(payloads);
        if (error) {
          failed += batch.length;
          errors.push(error.message);
          await Promise.all(batch.map((s) => recordSend(id, s.email, null, error.message)));
        } else {
          sent += data.data.length;
          // Resend's batch response preserves input order, so zip by index.
          await Promise.all(
            batch.map((s, idx) => recordSend(id, s.email, data.data[idx]?.id ?? null, null)),
          );
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'batch send failed';
        failed += batch.length;
        errors.push(message);
        await Promise.all(batch.map((s) => recordSend(id, s.email, null, message)));
      }

      if (i < chunks.length - 1) await sleep(CHUNK_PAUSE_MS);
    }

    if (sent === 0 && failed > 0) {
      return Response.json({ error: errors.join('; ') || 'send failed' }, { status: 502 });
    }

    const now = new Date().toISOString();
    await markNewsletterSent(id, now, sent);

    return Response.json({ ok: true, sent, failed, ...(errors.length ? { errors } : {}) });
  }

  return Response.json({ error: 'invalid mode' }, { status: 400 });
};

export const config: Config = {
  path: '/api/admin/newsletters/:id/send',
  method: 'POST',
};
