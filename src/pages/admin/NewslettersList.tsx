import { useCallback, useEffect, useState } from 'react';
import { Copy, Loader2, Plus, Trash2 } from 'lucide-react';
import type { Newsletter, NewsletterContent } from '../../lib/newsletter-template';
import { blankNewsletterContent } from '../../lib/newsletter-template';
import { ApiError, createNewsletter, deleteNewsletter, listNewsletters } from './api';

interface NewslettersListProps {
  onOpen: (id: string) => void;
  onUnauthorized: () => void;
}

function formatDate(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function contentFrom(n: Newsletter): NewsletterContent {
  return {
    subject: n.subject,
    previewText: n.previewText,
    heroImageUrl: n.heroImageUrl,
    heroImageAlt: n.heroImageAlt,
    title: n.title,
    intro: n.intro,
    sections: n.sections.map((s) => ({
      ...s,
      gallery: s.gallery ? [...s.gallery] : s.gallery,
      columns: s.columns ? s.columns.map((c) => ({ ...c })) : s.columns,
      iconLinks: s.iconLinks ? s.iconLinks.map((l) => ({ ...l })) : s.iconLinks,
    })),
    ctaLabel: n.ctaLabel,
    ctaUrl: n.ctaUrl,
    signoffLine: n.signoffLine,
    signoff: n.signoff,
    signoffSub: n.signoffSub,
    signoffImageUrl: n.signoffImageUrl,
    footerLine1: n.footerLine1,
    footerLine2: n.footerLine2,
  };
}

export default function NewslettersList({ onOpen, onUnauthorized }: NewslettersListProps) {
  const [newsletters, setNewsletters] = useState<Newsletter[] | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const { newsletters: list } = await listNewsletters();
      setNewsletters(list);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onUnauthorized();
      setError(err instanceof Error ? err.message : 'could not load newsletters');
    }
  }, [onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  const handleNew = async () => {
    setBusy(true);
    setError('');
    try {
      const { newsletter } = await createNewsletter(blankNewsletterContent());
      onOpen(newsletter.id);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onUnauthorized();
      setError(err instanceof Error ? err.message : 'could not start a new draft');
    } finally {
      setBusy(false);
    }
  };

  const handleDuplicate = async (n: Newsletter) => {
    setBusy(true);
    setError('');
    try {
      const prefixCopy = (s: string) => (s ? `copy of ${s}` : s);
      const prefixCopyOptional = (s?: string) => (s ? `copy of ${s}` : s);
      const content = {
        ...contentFrom(n),
        subject: prefixCopy(n.subject),
        title: prefixCopyOptional(n.title),
      };
      const { newsletter } = await createNewsletter(content);
      onOpen(newsletter.id);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onUnauthorized();
      setError(err instanceof Error ? err.message : 'could not duplicate this newsletter');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    setBusy(true);
    setError('');
    try {
      await deleteNewsletter(id);
      setNewsletters((prev) => prev?.filter((n) => n.id !== id) ?? prev);
      setConfirmingId(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onUnauthorized();
      setError(err instanceof Error ? err.message : 'could not delete this draft');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="admin-panel">
      <div className="admin-panel-head">
        <h2>newsletters</h2>
        <button type="button" className="admin-btn-primary" onClick={handleNew} disabled={busy}>
          <Plus size={14} />
          new newsletter
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {newsletters === null ? (
        <p className="admin-muted">
          <Loader2 size={14} className="admin-spin" /> loading…
        </p>
      ) : newsletters.length === 0 ? (
        <p className="admin-muted">no newsletters yet. start one above.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>subject / title</th>
                <th>status</th>
                <th>date</th>
                <th>sent to</th>
                <th aria-label="actions" />
              </tr>
            </thead>
            <tbody>
              {newsletters.map((n) => (
                <tr key={n.id}>
                  <td>
                    <div className="admin-list-primary">{n.subject || 'no subject'}</div>
                    <div className="admin-list-secondary">{n.title || 'no title'}</div>
                  </td>
                  <td>
                    <span className={`admin-pill admin-pill-${n.status}`}>{n.status}</span>
                  </td>
                  <td>{formatDate(n.status === 'sent' ? n.sentAt : n.updatedAt)}</td>
                  <td>
                    {n.status === 'sent' ? n.recipientCount ?? 0 : <span className="admin-muted">not yet</span>}
                  </td>
                  <td className="admin-row-actions">
                    <button type="button" className="admin-btn-ghost" onClick={() => onOpen(n.id)}>
                      open
                    </button>
                    <button
                      type="button"
                      className="admin-btn-icon"
                      onClick={() => handleDuplicate(n)}
                      disabled={busy}
                      aria-label={`duplicate ${n.subject || n.title || 'this newsletter'}`}
                      title="duplicate"
                    >
                      <Copy size={14} />
                    </button>
                    {n.status === 'draft' &&
                      (confirmingId === n.id ? (
                        <span className="admin-confirm">
                          <button
                            type="button"
                            className="admin-btn-danger"
                            onClick={() => handleDelete(n.id)}
                            disabled={busy}
                          >
                            yes, delete
                          </button>
                          <button type="button" className="admin-btn-ghost" onClick={() => setConfirmingId(null)}>
                            cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="admin-btn-icon"
                          onClick={() => setConfirmingId(n.id)}
                          aria-label={`delete ${n.subject || n.title || 'this draft'}`}
                          title="delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
