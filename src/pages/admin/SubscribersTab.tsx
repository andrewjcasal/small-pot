import { useCallback, useEffect, useState } from 'react';
import { Loader2, UserCheck, UserX } from 'lucide-react';
import type { Subscriber } from './types';
import { ApiError, addSubscribers, listSubscribers, setSubscriberStatus } from './api';

interface SubscribersTabProps {
  onUnauthorized: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function SubscribersTab({ onUnauthorized }: SubscribersTabProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[] | null>(null);
  const [active, setActive] = useState(0);
  const [error, setError] = useState('');
  const [togglingEmail, setTogglingEmail] = useState<string | null>(null);

  const [importText, setImportText] = useState('');
  const [importBusy, setImportBusy] = useState(false);
  const [importResult, setImportResult] = useState('');
  const [importError, setImportError] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await listSubscribers();
      setSubscribers(data.subscribers);
      setActive(data.active);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onUnauthorized();
      setError(err instanceof Error ? err.message : 'could not load subscribers');
    }
  }, [onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggle = async (subscriber: Subscriber) => {
    const nextStatus = subscriber.status === 'active' ? 'unsubscribed' : 'active';
    setTogglingEmail(subscriber.email);
    setError('');
    try {
      const { subscriber: updated } = await setSubscriberStatus(subscriber.email, nextStatus);
      setSubscribers((prev) => prev?.map((s) => (s.email === updated.email ? updated : s)) ?? prev);
      setActive((prev) => prev + (nextStatus === 'active' ? 1 : -1));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onUnauthorized();
      setError(err instanceof Error ? err.message : 'could not update this subscriber');
    } finally {
      setTogglingEmail(null);
    }
  };

  const handleImport = async () => {
    if (!importText.trim()) return;
    setImportBusy(true);
    setImportError('');
    setImportResult('');
    try {
      const summary = await addSubscribers(importText);
      setImportResult(
        `added ${summary.added}, ${summary.existing} already there, ${summary.reactivated} reactivated` +
          (summary.invalid.length ? `, couldn't read ${summary.invalid.length}` : ''),
      );
      setImportText('');
      load();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onUnauthorized();
      setImportError(err instanceof Error ? err.message : 'import failed');
    } finally {
      setImportBusy(false);
    }
  };

  return (
    <section className="admin-panel">
      <div className="admin-panel-head">
        <h2>subscribers</h2>
        <span className="admin-muted">{active} active</span>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-import">
        <label htmlFor="admin-import-text">add subscribers</label>
        <textarea
          id="admin-import-text"
          rows={3}
          placeholder="paste emails, one per line or separated by commas. name <email> works too."
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
        />
        <div className="admin-import-row">
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleImport}
            disabled={importBusy || !importText.trim()}
          >
            {importBusy ? 'adding…' : 'add subscribers'}
          </button>
          {importResult && <span className="admin-success">{importResult}</span>}
          {importError && <span className="admin-error">{importError}</span>}
        </div>
      </div>

      {subscribers === null ? (
        <p className="admin-muted">
          <Loader2 size={14} className="admin-spin" /> loading…
        </p>
      ) : subscribers.length === 0 ? (
        <p className="admin-muted">no subscribers yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>email</th>
                <th>name</th>
                <th>status</th>
                <th>source</th>
                <th>date</th>
                <th aria-label="actions" />
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.email}>
                  <td>{s.email}</td>
                  <td>{s.name ?? ''}</td>
                  <td>
                    <span className={`admin-pill admin-pill-${s.status}`}>{s.status}</span>
                  </td>
                  <td>{s.source}</td>
                  <td>{formatDate(s.createdAt)}</td>
                  <td className="admin-row-actions">
                    <button
                      type="button"
                      className="admin-btn-ghost"
                      onClick={() => handleToggle(s)}
                      disabled={togglingEmail === s.email}
                    >
                      {s.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                      {s.status === 'active' ? 'unsubscribe' : 'reactivate'}
                    </button>
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
