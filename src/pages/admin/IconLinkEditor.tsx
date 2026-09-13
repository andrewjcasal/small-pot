import { Trash2 } from 'lucide-react';
import type { NewsletterIconLink } from '../../lib/newsletter-template';
import ImageField from './ImageField';

interface IconLinkEditorProps {
  link: NewsletterIconLink;
  index: number;
  disabled: boolean;
  onChange: (index: number, patch: Partial<NewsletterIconLink>) => void;
  onRemove: (index: number) => void;
  onUnauthorized: () => void;
}

export default function IconLinkEditor({ link, index, disabled, onChange, onRemove, onUnauthorized }: IconLinkEditorProps) {
  return (
    <div className="admin-column-card">
      <div className="admin-column-list-head">
        <span>icon {index + 1}</span>
        <button
          type="button"
          className="admin-btn-icon"
          disabled={disabled}
          onClick={() => onRemove(index)}
          aria-label="remove icon link"
          title="remove"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <ImageField
        label="icon"
        value={link.iconUrl}
        disabled={disabled}
        onChange={(url) => onChange(index, { iconUrl: url })}
        onUnauthorized={onUnauthorized}
      />

      <label>
        link url
        <input
          type="text"
          value={link.url}
          disabled={disabled}
          onChange={(e) => onChange(index, { url: e.target.value })}
        />
      </label>

      <label>
        alt text
        <input
          type="text"
          value={link.alt ?? ''}
          disabled={disabled}
          onChange={(e) => onChange(index, { alt: e.target.value })}
        />
      </label>
    </div>
  );
}
