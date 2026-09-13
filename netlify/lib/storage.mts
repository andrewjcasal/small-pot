import { getSupabaseClient } from './supabase.mts';

const BUCKET = 'sp-newsletter';

/**
 * Uploads to the public sp-newsletter bucket (public read, service-role writes;
 * see the migration) and returns its public URL. Throws with the storage
 * client's own error message on failure, so callers can surface it as-is.
 */
export async function uploadNewsletterImage(path: string, data: ArrayBuffer, contentType: string): Promise<string> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, data, {
    contentType,
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return publicUrl;
}
