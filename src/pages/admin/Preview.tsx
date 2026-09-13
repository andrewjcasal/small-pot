import { useEffect, useMemo, useRef, useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import type { NewsletterContent } from '../../lib/newsletter-template';
import { renderNewsletterHtml } from '../../lib/newsletter-template';

interface PreviewProps {
  content: NewsletterContent;
}

type Width = 'desktop' | 'phone';

/**
 * Why the debounce and the key: setting `srcdoc` on every keystroke queues a
 * navigation per keystroke, and Chrome drops some of them, which left the
 * preview stuck on an early render (a heading showing "c" for "class dates").
 * Waiting until typing pauses, then remounting the iframe with a new key,
 * guarantees a fresh load of the latest HTML. Scroll position is carried over.
 */
const DEBOUNCE_MS = 350;

export default function Preview({ content }: PreviewProps) {
  const [mode, setMode] = useState<Width>('desktop');
  const [settled, setSettled] = useState<NewsletterContent>(content);
  const [version, setVersion] = useState(0);
  const scrollRef = useRef(0);
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const win = frameRef.current?.contentWindow;
      if (win) scrollRef.current = win.scrollY;
      setSettled(content);
      setVersion((v) => v + 1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [content]);

  const srcDoc = useMemo(
    () => renderNewsletterHtml(settled, { unsubscribeUrl: '#', siteUrl: window.location.origin }),
    [settled],
  );

  function restoreScroll() {
    const win = frameRef.current?.contentWindow;
    if (win && scrollRef.current) win.scrollTo(0, scrollRef.current);
  }

  return (
    <div className="admin-preview">
      <div className="admin-preview-toggle" role="group" aria-label="preview width">
        <button
          type="button"
          className={`admin-btn-ghost${mode === 'desktop' ? ' is-active' : ''}`}
          aria-pressed={mode === 'desktop'}
          onClick={() => setMode('desktop')}
        >
          <Monitor size={14} />
          desktop
        </button>
        <button
          type="button"
          className={`admin-btn-ghost${mode === 'phone' ? ' is-active' : ''}`}
          aria-pressed={mode === 'phone'}
          onClick={() => setMode('phone')}
        >
          <Smartphone size={14} />
          phone
        </button>
      </div>
      <div className="admin-preview-frame-wrap">
        <iframe
          key={version}
          ref={frameRef}
          title="newsletter preview"
          srcDoc={srcDoc}
          onLoad={restoreScroll}
          className="admin-preview-frame"
          style={{ width: mode === 'desktop' ? '600px' : '375px' }}
        />
      </div>
    </div>
  );
}
