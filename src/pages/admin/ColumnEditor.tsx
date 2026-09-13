import { Trash2 } from 'lucide-react';
import type { NewsletterColumn } from '../../lib/newsletter-template';
import ImageField from './ImageField';

interface ColumnEditorProps {
  column: NewsletterColumn;
  index: number;
  disabled: boolean;
  onChange: (index: number, patch: Partial<NewsletterColumn>) => void;
  onRemove: (index: number) => void;
  onUnauthorized: () => void;
}

export default function ColumnEditor({ column, index, disabled, onChange, onRemove, onUnauthorized }: ColumnEditorProps) {
  return (
    <div className="admin-column-card">
      <div className="admin-column-list-head">
        <span>block {index + 1}</span>
        <button
          type="button"
          className="admin-btn-icon"
          disabled={disabled}
          onClick={() => onRemove(index)}
          aria-label="remove block"
          title="remove"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <ImageField
        label="icon"
        value={column.iconUrl ?? ''}
        disabled={disabled}
        onChange={(url) => onChange(index, { iconUrl: url })}
        onUnauthorized={onUnauthorized}
      />

      <label>
        heading
        <input
          type="text"
          value={column.heading}
          disabled={disabled}
          onChange={(e) => onChange(index, { heading: e.target.value })}
        />
      </label>

      <label>
        body
        <textarea
          rows={3}
          value={column.body}
          disabled={disabled}
          onChange={(e) => onChange(index, { body: e.target.value })}
        />
      </label>

      <label>
        link url
        <input
          type="text"
          value={column.linkUrl ?? ''}
          disabled={disabled}
          onChange={(e) => onChange(index, { linkUrl: e.target.value })}
        />
      </label>
    </div>
  );
}
