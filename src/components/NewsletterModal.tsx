import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import posthog from 'posthog-js';
import './NewsletterModal.css';

type Status = 'idle' | 'sending' | 'done' | 'error';

interface Props {
  open: boolean;
  onClose: () => void;
}

/** Newsletter signup. Posts to the subscribe function, which adds to MailerLite. */
export default function NewsletterModal({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setStatus('idle');
      setError('');
      dialog.showModal();
      // Start in the first field; showModal would otherwise focus the close button.
      dialog.querySelector('input')?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          company: form.get('company'),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'something went wrong, please try again');
      setStatus('done');
      posthog.capture('newsletter_subscribed');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'something went wrong, please try again');
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="newsletter-modal"
      aria-labelledby="newsletter-title"
      onClose={onClose}
      // A click on the backdrop lands on the dialog itself, not its content.
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="newsletter-content">
        <button type="button" className="newsletter-close" onClick={onClose} aria-label="close">
          <X aria-hidden="true" />
        </button>

        <h2 id="newsletter-title">small pot newsletter</h2>

        {status === 'done' ? (
          <p className="newsletter-done" role="status">
            thank you, you're on the list!
          </p>
        ) : (
          <>
            <p className="newsletter-intro">new pieces, class dates, and what i'm working on.</p>
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <label>
                <span>first name</span>
                <input name="name" type="text" autoComplete="given-name" maxLength={100} />
              </label>
              <label>
                <span>email</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </label>
              {/* Honeypot, hidden from people. */}
              <input name="company" type="text" tabIndex={-1} autoComplete="off" className="newsletter-hp" aria-hidden="true" />
              {status === 'error' && (
                <p className="newsletter-error" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'signing up...' : 'sign up'}
              </button>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
