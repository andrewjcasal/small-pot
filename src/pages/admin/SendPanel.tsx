import { useEffect, useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { ApiError, listSubscribers, sendTest, sendToList } from './api';

interface SendPanelProps {
  id: string;
  disabledReason: string;
  showListSend: boolean;
  onSent: () => void;
  onUnauthorized: () => void;
}

const TEST_TO_KEY = 'sp-admin-test-to';

export default function SendPanel({ id, disabledReason, showListSend, onSent, onUnauthorized }: SendPanelProps) {
  const [testTo, setTestTo] = useState(() => {
    try {
      return localStorage.getItem(TEST_TO_KEY) ?? '';
    } catch {
      return '';
    }
  });
  const [testBusy, setTestBusy] = useState(false);
  const [testResult, setTestResult] = useState('');
  const [testError, setTestError] = useState('');

  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [listBusy, setListBusy] = useState(false);
  const [listResult, setListResult] = useState('');
  const [listError, setListError] = useState('');

  useEffect(() => {
    if (!showListSend) return;
    listSubscribers()
      .then(({ active }) => setActiveCount(active))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) onUnauthorized();
      });
  }, [showListSend, onUnauthorized]);

  const handleTestSend = async () => {
    const to = testTo.trim();
    if (!to) return;
    setTestBusy(true);
    setTestError('');
    setTestResult('');
    try {
      await sendTest(id, to);
      try {
        localStorage.setItem(TEST_TO_KEY, to);
      } catch {
        // localStorage may be unavailable; the field just won't remember next time.
      }
      setTestResult(`test sent to ${to}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onUnauthorized();
      setTestError(err instanceof Error ? err.message : 'test send failed');
    } finally {
      setTestBusy(false);
    }
  };

  const handleListSend = async () => {
    setListBusy(true);
    setListError('');
    try {
      const result = await sendToList(id);
      setListResult(`sent to ${result.sent}${result.failed ? `, ${result.failed} failed` : ''}`);
      setConfirming(false);
      onSent();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onUnauthorized();
      setListError(err instanceof Error ? err.message : 'send failed');
    } finally {
      setListBusy(false);
    }
  };

  const listDisabledReason = disabledReason || (activeCount === 0 ? 'no active subscribers' : '');

  return (
    <div className="admin-send-panel">
      <div className="admin-send-row">
        <label htmlFor="admin-test-to">send test</label>
        <div className="admin-send-controls">
          <input
            id="admin-test-to"
            type="email"
            value={testTo}
            placeholder="you@email.com"
            onChange={(e) => setTestTo(e.target.value)}
          />
          <button
            type="button"
            className="admin-btn-ghost"
            onClick={handleTestSend}
            disabled={testBusy || !testTo.trim()}
          >
            {testBusy ? <Loader2 size={14} className="admin-spin" /> : <Send size={14} />}
            send test
          </button>
        </div>
        {testResult && <p className="admin-success">{testResult}</p>}
        {testError && <p className="admin-error">{testError}</p>}
      </div>

      {showListSend && (
        <div className="admin-send-row">
          {confirming ? (
            <div className="admin-confirm">
              <button type="button" className="admin-btn-primary" onClick={handleListSend} disabled={listBusy}>
                {listBusy ? 'sending…' : `yes, send to ${activeCount ?? 0} now`}
              </button>
              <button
                type="button"
                className="admin-btn-ghost"
                onClick={() => setConfirming(false)}
                disabled={listBusy}
              >
                cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="admin-btn-primary"
              onClick={() => setConfirming(true)}
              disabled={Boolean(listDisabledReason) || activeCount === null}
              title={listDisabledReason || undefined}
            >
              <Send size={14} />
              send to {activeCount ?? '…'} subscribers
            </button>
          )}
          {listDisabledReason && <p className="admin-muted">{listDisabledReason}</p>}
          {listResult && <p className="admin-success">{listResult}</p>}
          {listError && <p className="admin-error">{listError}</p>}
        </div>
      )}
    </div>
  );
}
