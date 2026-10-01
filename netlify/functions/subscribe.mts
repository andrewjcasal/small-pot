import type { Config } from '@netlify/functions';

// Adds a newsletter signup to Lisa's MailerLite account. The API key stays
// server-side; MAILERLITE_GROUP_ID tags website signups apart from the
// class sign-in sheet imports.
export default async (req: Request) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'method not allowed' }, { status: 405 });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    console.error('MAILERLITE_API_KEY is not set');
    return Response.json({ error: 'signup is not set up yet' }, { status: 500 });
  }

  let body: { email?: unknown; name?: unknown; company?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'invalid request' }, { status: 400 });
  }

  // Honeypot: people never see this field, bots fill it in.
  if (typeof body.company === 'string' && body.company.trim()) {
    return Response.json({ ok: true });
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return Response.json({ error: 'please enter a valid email' }, { status: 400 });
  }

  const groupId = process.env.MAILERLITE_GROUP_ID;
  const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email,
      ...(name && { fields: { name } }),
      ...(groupId && { groups: [groupId] }),
    }),
  });

  if (res.status === 422) {
    return Response.json({ error: 'please enter a valid email' }, { status: 400 });
  }
  if (!res.ok) {
    console.error('MailerLite error', res.status, await res.text());
    return Response.json({ error: 'something went wrong, please try again' }, { status: 502 });
  }

  return Response.json({ ok: true });
};

export const config: Config = { path: '/api/subscribe' };
