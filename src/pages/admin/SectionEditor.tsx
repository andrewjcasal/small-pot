import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Upload } from 'lucide-react';
import type { NewsletterColumn, NewsletterIconLink, NewsletterSection, SectionKind } from '../../lib/newsletter-template';
import { ApiError, uploadImage } from './api';
import ImageField from './ImageField';
import ColumnEditor from './ColumnEditor';
import IconLinkEditor from './IconLinkEditor';

interface SectionEditorProps {
  section: NewsletterSection;
  index: number;
  count: number;
  disabled: boolean;
  onChange: (index: number, patch: Partial<NewsletterSection>) => void;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onUnauthorized: () => void;
}

const KIND_LABELS: Record<SectionKind, string> = {
  row: 'photo + text row',
  band: 'title band',
  gallery: 'photo grid',
  columns: 'resource columns',
};

const MAX_COLUMNS = 8;
const MAX_ICON_LINKS = 6;

export default function SectionEditor({
  section,
  index,
  count,
  disabled,
  onChange,
  onRemove,
  onMove,
  onUnauthorized,
}: SectionEditorProps) {
  const kind = section.kind ?? 'row';
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryError, setGalleryError] = useState('');

  const handleGalleryFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!files.length) return;
    setGalleryUploading(true);
    setGalleryError('');
    try {
      const uploaded = await Promise.all(files.map((file) => uploadImage(file)));
      onChange(index, { gallery: [...(section.gallery ?? []), ...uploaded.map((r) => r.url)] });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onUnauthorized();
      setGalleryError(err instanceof Error ? err.message : 'upload failed');
    } finally {
      setGalleryUploading(false);
    }
  };

  const columns = section.columns ?? [];

  const updateColumn = (colIndex: number, patch: Partial<NewsletterColumn>) => {
    onChange(index, { columns: columns.map((c, i) => (i === colIndex ? { ...c, ...patch } : c)) });
  };

  const removeColumn = (colIndex: number) => {
    onChange(index, { columns: columns.filter((_, i) => i !== colIndex) });
  };

  const addColumn = () => {
    if (columns.length >= MAX_COLUMNS) return;
    onChange(index, { columns: [...columns, { iconUrl: '', heading: '', body: '', linkUrl: '' }] });
  };

  const iconLinks = section.iconLinks ?? [];

  const updateIconLink = (linkIndex: number, patch: Partial<NewsletterIconLink>) => {
    onChange(index, { iconLinks: iconLinks.map((l, i) => (i === linkIndex ? { ...l, ...patch } : l)) });
  };

  const removeIconLink = (linkIndex: number) => {
    onChange(index, { iconLinks: iconLinks.filter((_, i) => i !== linkIndex) });
  };

  const addIconLink = () => {
    if (iconLinks.length >= MAX_ICON_LINKS) return;
    onChange(index, { iconLinks: [...iconLinks, { iconUrl: '', url: '', alt: '' }] });
  };

  return (
    <div className="admin-section-card">
      <div className="admin-section-head">
        <span className="admin-muted">
          section {index + 1} <span className="admin-kind-label">- {KIND_LABELS[kind]}</span>
        </span>
        <div className="admin-section-controls">
          <button
            type="button"
            className="admin-btn-icon"
            disabled={disabled || index === 0}
            onClick={() => onMove(index, -1)}
            aria-label="move section up"
            title="move up"
          >
            <ChevronUp size={14} />
          </button>
          <button
            type="button"
            className="admin-btn-icon"
            disabled={disabled || index === count - 1}
            onClick={() => onMove(index, 1)}
            aria-label="move section down"
            title="move down"
          >
            <ChevronDown size={14} />
          </button>
          <button
            type="button"
            className="admin-btn-icon"
            disabled={disabled}
            onClick={() => onRemove(index)}
            aria-label="remove section"
            title="remove"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {kind === 'row' && (
        <>
          <label>
            heading
            <input
              type="text"
              value={section.heading ?? ''}
              disabled={disabled}
              onChange={(e) => onChange(index, { heading: e.target.value })}
            />
          </label>

          <label>
            subheading (italic line under the heading)
            <input
              type="text"
              value={section.subheading ?? ''}
              disabled={disabled}
              onChange={(e) => onChange(index, { subheading: e.target.value })}
            />
          </label>

          <label>
            body
            <textarea
              rows={4}
              value={section.body ?? ''}
              disabled={disabled}
              onChange={(e) => onChange(index, { body: e.target.value })}
            />
          </label>

          <ImageField
            label="photo"
            value={section.imageUrl ?? ''}
            disabled={disabled}
            onChange={(url) => onChange(index, { imageUrl: url })}
            onUnauthorized={onUnauthorized}
          />

          <div className="admin-field-row">
            <label>
              photo alt
              <input
                type="text"
                value={section.imageAlt ?? ''}
                disabled={disabled}
                onChange={(e) => onChange(index, { imageAlt: e.target.value })}
              />
            </label>
            <label>
              photo side
              <select
                value={section.imageSide ?? 'auto'}
                disabled={disabled}
                onChange={(e) => onChange(index, { imageSide: e.target.value as NewsletterSection['imageSide'] })}
              >
                <option value="auto">auto (alternate)</option>
                <option value="left">left</option>
                <option value="right">right</option>
              </select>
            </label>
          </div>

          <div className="admin-field-row">
            <label>
              button label
              <input
                type="text"
                value={section.linkLabel ?? ''}
                disabled={disabled}
                onChange={(e) => onChange(index, { linkLabel: e.target.value })}
              />
            </label>
            <label>
              button url
              <input
                type="text"
                value={section.linkUrl ?? ''}
                disabled={disabled}
                onChange={(e) => onChange(index, { linkUrl: e.target.value })}
              />
            </label>
          </div>

          <div className="admin-columns">
            <div className="admin-column-list-head">
              <span>icon links</span>
              <button
                type="button"
                className="admin-btn-ghost"
                disabled={disabled || iconLinks.length >= MAX_ICON_LINKS}
                onClick={addIconLink}
              >
                <Plus size={14} />
                add icon link
              </button>
            </div>
            {iconLinks.map((link, linkIndex) => (
              <IconLinkEditor
                key={linkIndex}
                link={link}
                index={linkIndex}
                disabled={disabled}
                onChange={updateIconLink}
                onRemove={removeIconLink}
                onUnauthorized={onUnauthorized}
              />
            ))}
          </div>
        </>
      )}

      {kind === 'band' && (
        <>
          <label>
            title
            <input
              type="text"
              value={section.heading ?? ''}
              disabled={disabled}
              onChange={(e) => onChange(index, { heading: e.target.value })}
            />
          </label>
          <ImageField
            label="band image (optional, replaces the title text; 1200px wide from canva keeps your lettering and holds up in dark mode)"
            value={section.imageUrl ?? ''}
            disabled={disabled}
            onChange={(url) => onChange(index, { imageUrl: url })}
            onUnauthorized={onUnauthorized}
          />
        </>
      )}

      {kind === 'gallery' && (
        <>
          <label>
            photos, one link per line
            <textarea
              rows={4}
              value={(section.gallery ?? []).join('\n')}
              disabled={disabled}
              onChange={(e) => onChange(index, { gallery: e.target.value.split('\n') })}
            />
          </label>
          <label>
            full-width photos under the grid (landscape shots), one link per line
            <textarea
              rows={2}
              value={(section.galleryWide ?? []).join('\n')}
              disabled={disabled}
              onChange={(e) => onChange(index, { galleryWide: e.target.value.split('\n') })}
            />
          </label>
          <div className="admin-gallery-upload">
            <button
              type="button"
              className="admin-btn-ghost"
              disabled={disabled || galleryUploading}
              onClick={() => galleryInputRef.current?.click()}
            >
              <Upload size={14} />
              {galleryUploading ? 'uploading…' : 'add photos'}
            </button>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleGalleryFiles}
            />
            {galleryError && <span className="admin-error">{galleryError}</span>}
          </div>
        </>
      )}

      {kind === 'columns' && (
        <div className="admin-columns">
          <div className="admin-column-list-head">
            <span>blocks</span>
            <button
              type="button"
              className="admin-btn-ghost"
              disabled={disabled || columns.length >= MAX_COLUMNS}
              onClick={addColumn}
            >
              <Plus size={14} />
              add block
            </button>
          </div>
          {columns.map((column, colIndex) => (
            <ColumnEditor
              key={colIndex}
              column={column}
              index={colIndex}
              disabled={disabled}
              onChange={updateColumn}
              onRemove={removeColumn}
              onUnauthorized={onUnauthorized}
            />
          ))}
        </div>
      )}
    </div>
  );
}
