import type { Config, Context } from '@netlify/functions';
import { requireAdmin } from '../lib/auth.mts';

export default async (req: Request, _context: Context): Promise<Response> => {
  const denied = requireAdmin(req);
  if (denied) return denied;
  return Response.json({ ok: true });
};

export const config: Config = {
  path: '/api/admin/ping',
  method: 'GET',
};
