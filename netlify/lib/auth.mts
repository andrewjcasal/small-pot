import { timingSafeEqualStr } from './tokens.mts';

/**
 * Checks `Authorization: Bearer <ADMIN_PASSWORD>` with a timing-safe compare.
 * Returns a 401 Response to send back when the check fails, or null when it passes
 *, call sites do `const denied = requireAdmin(req); if (denied) return denied;`.
 */
export function requireAdmin(req: Request): Response | null {
  const header = req.headers.get('authorization') ?? '';
  const match = /^Bearer\s+(.+)$/i.exec(header);
  const provided = match?.[1]?.trim() ?? '';
  const expected = process.env.ADMIN_PASSWORD ?? '';

  if (!expected || !provided || !timingSafeEqualStr(provided, expected)) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }
  return null;
}
