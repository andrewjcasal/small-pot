import { useState } from 'react';
import type { FormEvent } from 'react';
import { Mail } from 'lucide-react';
import './NewsletterSignup.css';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() || undefined, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "that didn't go through. try again in a minute.");
        return;
      }
      setDone(true);
    } catch {
      setError("that didn't go through. try again in a minute.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="newsletter-signup-page">
      <div className="newsletter-signup-container">
        <div className="newsletter-signup-header">
          <img src="/logo.png" alt="small pot logo" className="newsletter-signup-logo" />
          <h1>small pot newsletter</h1>
          <p className="newsletter-signup-tagline">
            new pieces, class dates, and what's on the bench. a few times a year, no more.
          </p>
        </div>

        {done ? (
          <p className="newsletter-signup-success">you're in. talk soon.</p>
        ) : (
          <form className="newsletter-signup-form" onSubmit={handleSubmit}>
            <div className="newsletter-signup-field">
              <label htmlFor="ns-email">email</label>
              <input
                id="ns-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="newsletter-signup-field">
              <label htmlFor="ns-name">first name (optional)</label>
              <input
                id="ns-name"
                type="text"
                autoComplete="given-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="newsletter-signup-honeypot" aria-hidden="true">
              <label htmlFor="ns-website">website</label>
              <input
                id="ns-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            {error && <p className="newsletter-signup-error">{error}</p>}

            <button type="submit" disabled={submitting}>
              <Mail size={14} />
              {submitting ? 'signing up…' : 'sign me up'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
