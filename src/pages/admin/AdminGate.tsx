import { useState } from 'react';
import type { FormEvent } from 'react';
import { KeyRound } from 'lucide-react';

interface AdminGateProps {
  error: string;
  checking: boolean;
  onSubmit: (password: string) => void;
}

export default function AdminGate({ error, checking, onSubmit }: AdminGateProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = password.trim();
    if (!trimmed || checking) return;
    onSubmit(trimmed);
  };

  return (
    <div className="admin-gate">
      <form className="admin-gate-card" onSubmit={handleSubmit}>
        <KeyRound size={14} className="admin-gate-icon" />
        <h1>small pot admin</h1>
        <label htmlFor="admin-password">password</label>
        <input
          id="admin-password"
          type="password"
          value={password}
          autoFocus
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="admin-error">{error}</p>}
        <button type="submit" className="admin-btn-primary" disabled={checking}>
          {checking ? 'checking…' : 'open'}
        </button>
      </form>
    </div>
  );
}
