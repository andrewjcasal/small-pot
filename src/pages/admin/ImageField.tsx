import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Upload } from 'lucide-react';
import { ApiError, uploadImage } from './api';

interface ImageFieldProps {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (url: string) => void;
  onUnauthorized: () => void;
}

/** A url text field plus an "upload" button that fills it in. Used for every
 * image field: hero, row photo, column icon, sign-off image. */
export default function ImageField({ label, value, disabled, onChange, onUnauthorized }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const { url } = await uploadImage(file);
      onChange(url);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onUnauthorized();
      setError(err instanceof Error ? err.message : 'upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <label>
      {label}
      <div className="admin-image-field">
        <input type="text" value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
        <button
          type="button"
          className="admin-btn-ghost"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={14} />
          {uploading ? 'uploading…' : 'upload'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </div>
      {error && <span className="admin-error">{error}</span>}
    </label>
  );
}
