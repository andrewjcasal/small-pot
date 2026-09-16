import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import type { Newsletter, NewsletterContent, NewsletterSection, SectionKind } from '../../lib/newsletter-template';
import { blankSection } from '../../lib/newsletter-template';
import { ApiError, getNewsletter, updateNewsletter } from './api';
import SectionEditor from './SectionEditor';
import ImageField from './ImageField';
import Preview from './Preview';
import SendPanel from './SendPanel';

interface NewsletterEditorProps {
  id: string;
  onBack: () => void;
  onUnauthorized: () => void;
}

const SECTION_KINDS: { kind: SectionKind; label: string }[] = [
  { kind: 'row', label: 'row' },
  { kind: 'band', label: 'title band' },
  { kind: 'gallery', label: 'photo grid' },
  { kind: 'columns', label: 'resource columns' },
];

function contentFrom(n: Newsletter): NewsletterContent {
  return {
    subject: n.subject,
    previewText: n.previewText ?? '',
    heroImageUrl: n.heroImageUrl ?? '',
    heroImageAlt: n.heroImageAlt ?? '',
    title: n.title ?? '',
    intro: n.intro ?? '',
    sections: n.sections.map((s) => ({
      ...s,
      gallery: s.gallery ? [...s.gallery] : s.gallery, galleryWide: s.galleryWide ? [...s.galleryWide] : s.galleryWide,
      columns: s.columns ? s.columns.map((c) => ({ ...c })) : s.columns,
      iconLinks: s.iconLinks ? s.iconLinks.map((l) => ({ ...l })) : s.iconLinks,
    })),
    ctaLabel: n.ctaLabel ?? '',
    ctaUrl: n.ctaUrl ?? '',
    signoffLine: n.signoffLine ?? '',
    signoff: n.signoff ?? '',
    signoffSub: n.signoffSub ?? '',
    signoffImageUrl: n.signoffImageUrl ?? '',
    footerLine1: n.footerLine1 ?? '',
    footerLine2: n.footerLine2 ?? '',
  };
}

/** Split on newlines, trim, drop blanks - what actually gets persisted. */
function cleanGallery(content: NewsletterContent): NewsletterContent {
  return {
    ...content,
    sections: content.sections.map((s) => ({
      ...s,
      gallery: s.gallery ? s.gallery.map((u) => u.trim()).filter(Boolean) : s.gallery,
      galleryWide: s.galleryWide ? s.galleryWide.map((u) => u.trim()).filter(Boolean) : s.galleryWide,
    })),
  };
}

export default function NewsletterEditor({ id, onBack, onUnauthorized }: NewsletterEditorProps) {
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [content, setContent] = useState<NewsletterContent | null>(null);
  const [dirty, setDirty] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    try {
      const { newsletter: n } = await getNewsletter(id);
      setNewsletter(n);
      setContent(contentFrom(n));
      setDirty(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onUnauthorized();
      setLoadError(err instanceof Error ? err.message : 'could not load this newsletter');
    }
  }, [id, onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  const readOnly = newsletter?.status === 'sent';

  const patchContent = (patch: Partial<NewsletterContent>) => {
    setContent((prev) => (prev ? { ...prev, ...patch } : prev));
    setDirty(true);
  };

  const updateSection = (index: number, patch: Partial<NewsletterSection>) => {
    setContent((prev) => {
      if (!prev) return prev;
      const sections = prev.sections.map((s, i) => (i === index ? { ...s, ...patch } : s));
      return { ...prev, sections };
    });
    setDirty(true);
  };

  const addSection = (kind: SectionKind) => {
    setContent((prev) => (prev ? { ...prev, sections: [...prev.sections, blankSection(kind)] } : prev));
    setDirty(true);
  };

  const removeSection = (index: number) => {
    setContent((prev) => (prev ? { ...prev, sections: prev.sections.filter((_, i) => i !== index) } : prev));
    setDirty(true);
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    setContent((prev) => {
      if (!prev) return prev;
      const target = index + direction;
      if (target < 0 || target >= prev.sections.length) return prev;
      const sections = [...prev.sections];
      [sections[index], sections[target]] = [sections[target], sections[index]];
      return { ...prev, sections };
    });
    setDirty(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!content || readOnly) return;
    setSaving(true);
    setSaveError('');
    try {
      const { newsletter: n } = await updateNewsletter(id, cleanGallery(content));
      setNewsletter(n);
      setContent(contentFrom(n));
      setDirty(false);
      setSaved(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onUnauthorized();
      setSaveError(err instanceof Error ? err.message : 'could not save');
    } finally {
      setSaving(false);
    }
  };

  if (loadError) {
    return (
      <section className="admin-panel">
        <button type="button" className="admin-btn-ghost" onClick={onBack}>
          <ArrowLeft size={14} />
          back
        </button>
        <p className="admin-error">{loadError}</p>
      </section>
    );
  }

  if (!newsletter || !content) {
    return (
      <p className="admin-muted">
        <Loader2 size={14} className="admin-spin" /> loading…
      </p>
    );
  }

  // Lisa's design carries the headline on the hero banner, so title is optional -
  // only the subject line gates sending.
  const sendDisabledReason = dirty ? 'save your changes first' : !content.subject.trim() ? 'add a subject first' : '';

  return (
    <section className="admin-editor">
      <div className="admin-editor-head">
        <button type="button" className="admin-btn-ghost" onClick={onBack}>
          <ArrowLeft size={14} />
          back
        </button>
        <span className={`admin-pill admin-pill-${newsletter.status}`}>{newsletter.status}</span>
        {readOnly && newsletter.sentAt && (
          <span className="admin-muted">
            sent on {new Date(newsletter.sentAt).toLocaleDateString()} to {newsletter.recipientCount ?? 0}. duplicate
            it to send again.
          </span>
        )}
      </div>

      <div className="admin-editor-grid">
        <form className="admin-editor-form" onSubmit={handleSave}>
          <label>
            subject
            <input
              type="text"
              value={content.subject}
              disabled={readOnly}
              onChange={(e) => patchContent({ subject: e.target.value })}
            />
          </label>

          <label>
            preview text
            <input
              type="text"
              value={content.previewText ?? ''}
              disabled={readOnly}
              onChange={(e) => patchContent({ previewText: e.target.value })}
            />
          </label>

          <ImageField
            label="hero banner image"
            value={content.heroImageUrl ?? ''}
            disabled={readOnly}
            onChange={(url) => patchContent({ heroImageUrl: url })}
            onUnauthorized={onUnauthorized}
          />

          <label>
            hero banner alt
            <input
              type="text"
              value={content.heroImageAlt ?? ''}
              disabled={readOnly}
              onChange={(e) => patchContent({ heroImageAlt: e.target.value })}
            />
          </label>

          <label>
            title (optional - the banner usually carries this)
            <input
              type="text"
              value={content.title ?? ''}
              disabled={readOnly}
              onChange={(e) => patchContent({ title: e.target.value })}
            />
          </label>

          <label>
            intro (optional)
            <textarea
              rows={3}
              value={content.intro ?? ''}
              disabled={readOnly}
              onChange={(e) => patchContent({ intro: e.target.value })}
            />
          </label>

          <div className="admin-sections">
            <div className="admin-section-list-head">
              <span>sections</span>
            </div>
            <div className="admin-add-section-row">
              <span className="admin-muted">add:</span>
              {SECTION_KINDS.map(({ kind, label }) => (
                <button
                  key={kind}
                  type="button"
                  className="admin-btn-ghost"
                  onClick={() => addSection(kind)}
                  disabled={readOnly}
                >
                  <Plus size={14} />
                  {label}
                </button>
              ))}
            </div>
            {content.sections.map((section, index) => (
              <SectionEditor
                key={index}
                section={section}
                index={index}
                count={content.sections.length}
                disabled={readOnly}
                onChange={updateSection}
                onRemove={removeSection}
                onMove={moveSection}
                onUnauthorized={onUnauthorized}
              />
            ))}
          </div>

          <div className="admin-field-row">
            <label>
              button label
              <input
                type="text"
                value={content.ctaLabel ?? ''}
                disabled={readOnly}
                onChange={(e) => patchContent({ ctaLabel: e.target.value })}
              />
            </label>
            <label>
              button url
              <input
                type="text"
                value={content.ctaUrl ?? ''}
                disabled={readOnly}
                onChange={(e) => patchContent({ ctaUrl: e.target.value })}
              />
            </label>
          </div>

          <div className="admin-field-row">
            <label>
              sign-off line
              <input
                type="text"
                value={content.signoffLine ?? ''}
                placeholder="made one piece at a time,"
                disabled={readOnly}
                onChange={(e) => patchContent({ signoffLine: e.target.value })}
              />
            </label>
            <label>
              sign-off name
              <input
                type="text"
                value={content.signoff ?? ''}
                disabled={readOnly}
                onChange={(e) => patchContent({ signoff: e.target.value })}
              />
            </label>
          </div>

          <div className="admin-field-row">
            <label>
              sign-off subtitle
              <input
                type="text"
                value={content.signoffSub ?? ''}
                placeholder="instructor & artist"
                disabled={readOnly}
                onChange={(e) => patchContent({ signoffSub: e.target.value })}
              />
            </label>
            <ImageField
              label="sign-off image"
              value={content.signoffImageUrl ?? ''}
              disabled={readOnly}
              onChange={(url) => patchContent({ signoffImageUrl: url })}
              onUnauthorized={onUnauthorized}
            />
          </div>

          <div className="admin-field-row">
            <label>
              footer line 1
              <input
                type="text"
                value={content.footerLine1 ?? ''}
                placeholder="small pot | stained glass"
                disabled={readOnly}
                onChange={(e) => patchContent({ footerLine1: e.target.value })}
              />
            </label>
            <label>
              footer line 2
              <input
                type="text"
                value={content.footerLine2 ?? ''}
                placeholder="lynchburg, virginia"
                disabled={readOnly}
                onChange={(e) => patchContent({ footerLine2: e.target.value })}
              />
            </label>
          </div>

          {!readOnly && (
            <div className="admin-save-row">
              <button type="submit" className="admin-btn-primary" disabled={saving || !dirty}>
                {saving ? 'saving…' : 'save'}
              </button>
              <span className="admin-muted">{dirty ? 'unsaved changes' : saved ? 'saved' : 'no changes yet'}</span>
              {saveError && <span className="admin-error">{saveError}</span>}
            </div>
          )}
        </form>

        <div className="admin-editor-side">
          <Preview content={content} />
          <SendPanel
            id={id}
            disabledReason={sendDisabledReason}
            showListSend={!readOnly}
            onSent={load}
            onUnauthorized={onUnauthorized}
          />
        </div>
      </div>
    </section>
  );
}
