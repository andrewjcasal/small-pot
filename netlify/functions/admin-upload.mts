import type { Config, Context } from '@netlify/functions';
import { requireAdmin } from '../lib/auth.mts';
import { uploadNewsletterImage } from '../lib/storage.mts';

const ALLOWED_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

const MAX_BYTES = 5 * 1024 * 1024;

export default async (req: Request, _context: Context): Promise<Response> => {
  const denied = requireAdmin(req);
  if (denied) return denied;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return Response.json({ error: 'invalid form data' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return Response.json({ error: 'missing file' }, { status: 400 });
  }

  const ext = ALLOWED_EXTENSIONS[file.type];
  if (!ext) {
    return Response.json({ error: 'unsupported file type' }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return Response.json({ error: 'file too large (5 MB max)' }, { status: 413 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const month = new Date().toISOString().slice(0, 7); // yyyy-mm
  const path = `uploads/${month}/${crypto.randomUUID()}.${ext}`;

  try {
    const url = await uploadNewsletterImage(path, arrayBuffer, file.type);
    return Response.json({ url }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'upload failed';
    return Response.json({ error: message }, { status: 502 });
  }
};

export const config: Config = {
  path: '/api/admin/upload',
  method: 'POST',
};
