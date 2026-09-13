import type { Newsletter, NewsletterContent } from '../../src/lib/newsletter-template.ts';
import { getSupabaseClient } from './supabase.mts';

/** A newsletter signup. Primary key is the lowercased, trimmed email. */
export interface Subscriber {
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed';
  source: 'site' | 'import' | 'admin';
  createdAt: string;
  updatedAt: string;
  unsubscribedAt?: string;
}

interface SubscriberRow {
  email: string;
  name: string | null;
  status: 'active' | 'unsubscribed';
  source: 'site' | 'import' | 'admin';
  created_at: string;
  updated_at: string;
  unsubscribed_at: string | null;
}

interface NewsletterRow {
  id: string;
  status: 'draft' | 'sent';
  content: NewsletterContent;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
  recipient_count: number | null;
  test_sent_at: string | null;
}

function rowToSubscriber(row: SubscriberRow): Subscriber {
  return {
    email: row.email,
    name: row.name ?? undefined,
    status: row.status,
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    unsubscribedAt: row.unsubscribed_at ?? undefined,
  };
}

function rowToNewsletter(row: NewsletterRow): Newsletter {
  return {
    ...row.content,
    id: row.id,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    sentAt: row.sent_at ?? undefined,
    recipientCount: row.recipient_count ?? undefined,
    testSentAt: row.test_sent_at ?? undefined,
  };
}

function throwOnError(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

// sp_newsletters.id is a Postgres `uuid` column: comparing it against a
// non-UUID string doesn't just return zero rows, it throws "invalid input
// syntax for type uuid" at the database level. Every id-keyed lookup below
// guards on this first so an unknown/malformed id reads as "not found"
// (null, same as a real miss) instead of a 500.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(id: string): boolean {
  return UUID_RE.test(id);
}

// ---------------------------------------------------------------------------
// Newsletters
// ---------------------------------------------------------------------------

export async function listNewsletters(): Promise<Newsletter[]> {
  const { data, error } = await getSupabaseClient()
    .from('sp_newsletters')
    .select('*')
    .order('updated_at', { ascending: false });
  throwOnError(error);
  return ((data as NewsletterRow[] | null) ?? []).map(rowToNewsletter);
}

export async function getNewsletter(id: string): Promise<Newsletter | null> {
  if (!isUuid(id)) return null;
  const { data, error } = await getSupabaseClient()
    .from('sp_newsletters')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  throwOnError(error);
  return data ? rowToNewsletter(data as NewsletterRow) : null;
}

export async function createNewsletter(content: NewsletterContent): Promise<Newsletter> {
  const { data, error } = await getSupabaseClient()
    .from('sp_newsletters')
    .insert({ content })
    .select('*')
    .single();
  throwOnError(error);
  return rowToNewsletter(data as NewsletterRow);
}

/** Replaces the newsletter's content wholesale (the caller merges with the existing content first). */
export async function updateNewsletterContent(id: string, content: NewsletterContent): Promise<Newsletter | null> {
  if (!isUuid(id)) return null;
  const { data, error } = await getSupabaseClient()
    .from('sp_newsletters')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .maybeSingle();
  throwOnError(error);
  return data ? rowToNewsletter(data as NewsletterRow) : null;
}

export async function deleteNewsletter(id: string): Promise<void> {
  if (!isUuid(id)) return;
  const { error } = await getSupabaseClient().from('sp_newsletters').delete().eq('id', id);
  throwOnError(error);
}

export async function markNewsletterTestSent(id: string, testSentAt: string): Promise<Newsletter | null> {
  if (!isUuid(id)) return null;
  const { data, error } = await getSupabaseClient()
    .from('sp_newsletters')
    .update({ test_sent_at: testSentAt })
    .eq('id', id)
    .select('*')
    .maybeSingle();
  throwOnError(error);
  return data ? rowToNewsletter(data as NewsletterRow) : null;
}

export async function markNewsletterSent(
  id: string,
  sentAt: string,
  recipientCount: number,
): Promise<Newsletter | null> {
  if (!isUuid(id)) return null;
  const { data, error } = await getSupabaseClient()
    .from('sp_newsletters')
    .update({ status: 'sent', sent_at: sentAt, recipient_count: recipientCount, updated_at: sentAt })
    .eq('id', id)
    .select('*')
    .maybeSingle();
  throwOnError(error);
  return data ? rowToNewsletter(data as NewsletterRow) : null;
}

/** Strips the system fields off a Newsletter, leaving just the NewsletterContent to merge edits into. */
export function newsletterToContent(newsletter: Newsletter): NewsletterContent {
  const {
    id: _id,
    status: _status,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    sentAt: _sentAt,
    recipientCount: _recipientCount,
    testSentAt: _testSentAt,
    ...content
  } = newsletter;
  return content;
}

// ---------------------------------------------------------------------------
// Subscribers
// ---------------------------------------------------------------------------

export async function listSubscribers(): Promise<Subscriber[]> {
  const { data, error } = await getSupabaseClient()
    .from('sp_subscribers')
    .select('*')
    .order('created_at', { ascending: false });
  throwOnError(error);
  return ((data as SubscriberRow[] | null) ?? []).map(rowToSubscriber);
}

export async function listActiveSubscribers(): Promise<Subscriber[]> {
  const { data, error } = await getSupabaseClient()
    .from('sp_subscribers')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  throwOnError(error);
  return ((data as SubscriberRow[] | null) ?? []).map(rowToSubscriber);
}

export async function getSubscriber(email: string): Promise<Subscriber | null> {
  const { data, error } = await getSupabaseClient()
    .from('sp_subscribers')
    .select('*')
    .eq('email', email)
    .maybeSingle();
  throwOnError(error);
  return data ? rowToSubscriber(data as SubscriberRow) : null;
}

export async function createSubscriber(subscriber: Subscriber): Promise<Subscriber> {
  const { data, error } = await getSupabaseClient()
    .from('sp_subscribers')
    .insert({
      email: subscriber.email,
      name: subscriber.name ?? null,
      status: subscriber.status,
      source: subscriber.source,
      created_at: subscriber.createdAt,
      updated_at: subscriber.updatedAt,
    })
    .select('*')
    .single();
  throwOnError(error);
  return rowToSubscriber(data as SubscriberRow);
}

export interface SubscriberPatch {
  name?: string;
  status?: 'active' | 'unsubscribed';
  updatedAt: string;
  unsubscribedAt?: string | null;
}

/** Updates status/name/unsubscribedAt without touching createdAt. */
export async function updateSubscriber(email: string, patch: SubscriberPatch): Promise<Subscriber | null> {
  const payload: Record<string, unknown> = { updated_at: patch.updatedAt };
  if (patch.name !== undefined) payload.name = patch.name;
  if (patch.status !== undefined) payload.status = patch.status;
  if (patch.unsubscribedAt !== undefined) payload.unsubscribed_at = patch.unsubscribedAt;

  const { data, error } = await getSupabaseClient()
    .from('sp_subscribers')
    .update(payload)
    .eq('email', email)
    .select('*')
    .maybeSingle();
  throwOnError(error);
  return data ? rowToSubscriber(data as SubscriberRow) : null;
}

// ---------------------------------------------------------------------------
// Send log
// ---------------------------------------------------------------------------

/**
 * One row per recipient per list send. Best-effort: a logging failure here
 * must never fail the actual send, so errors are swallowed (and reported to
 * the console) rather than thrown.
 */
export async function recordSend(
  newsletterId: string,
  email: string,
  resendId: string | null,
  errorMessage: string | null,
): Promise<void> {
  const { error } = await getSupabaseClient()
    .from('sp_sends')
    .insert({ newsletter_id: newsletterId, email, resend_id: resendId, error: errorMessage });
  if (error) console.error('recordSend failed', { newsletterId, email, error: error.message });
}
