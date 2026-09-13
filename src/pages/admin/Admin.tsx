import { useCallback, useState } from 'react';
import { Lock, Mail, Users } from 'lucide-react';
import { clearStoredPassword, getStoredPassword, ping, setStoredPassword } from './api';
import AdminGate from './AdminGate';
import NewslettersList from './NewslettersList';
import NewsletterEditor from './NewsletterEditor';
import SubscribersTab from './SubscribersTab';
import './Admin.css';

type View = 'newsletters' | 'subscribers';

export default function Admin() {
  const [authed, setAuthed] = useState(() => Boolean(getStoredPassword()));
  const [gateError, setGateError] = useState('');
  const [checking, setChecking] = useState(false);
  const [view, setView] = useState<View>('newsletters');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleUnauthorized = useCallback(() => {
    setAuthed(false);
    setEditingId(null);
  }, []);

  const handleGateSubmit = async (password: string) => {
    setChecking(true);
    setGateError('');
    setStoredPassword(password);
    try {
      await ping();
      setAuthed(true);
    } catch {
      clearStoredPassword();
      setGateError('wrong password');
    } finally {
      setChecking(false);
    }
  };

  const handleLock = () => {
    clearStoredPassword();
    setAuthed(false);
    setEditingId(null);
  };

  const openTab = (next: View) => {
    setView(next);
    setEditingId(null);
  };

  if (!authed) {
    return <AdminGate error={gateError} checking={checking} onSubmit={handleGateSubmit} />;
  }

  return (
    <div className="admin-page">
      <header className="admin-topbar">
        <div className="admin-tabs" role="tablist" aria-label="admin section">
          <button
            type="button"
            role="tab"
            aria-selected={view === 'newsletters'}
            className={`admin-tab${view === 'newsletters' ? ' is-active' : ''}`}
            onClick={() => openTab('newsletters')}
          >
            <Mail size={14} />
            newsletters
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'subscribers'}
            className={`admin-tab${view === 'subscribers' ? ' is-active' : ''}`}
            onClick={() => openTab('subscribers')}
          >
            <Users size={14} />
            subscribers
          </button>
        </div>
        <button type="button" className="admin-btn-ghost" onClick={handleLock}>
          <Lock size={14} />
          lock
        </button>
      </header>

      <main className="admin-main">
        {view === 'newsletters' &&
          (editingId ? (
            <NewsletterEditor id={editingId} onBack={() => setEditingId(null)} onUnauthorized={handleUnauthorized} />
          ) : (
            <NewslettersList onOpen={setEditingId} onUnauthorized={handleUnauthorized} />
          ))}
        {view === 'subscribers' && <SubscribersTab onUnauthorized={handleUnauthorized} />}
      </main>
    </div>
  );
}
