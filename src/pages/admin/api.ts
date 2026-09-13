/**
 * Tiny fetch helper for /api/admin/*. Adds the bearer from sessionStorage,
 * throws ApiError on any non-2xx (with the server's own `error` string when
 * there is one), and clears the stored password on a 401 so the caller can
 * drop back to the gate.
 */
import type { Newsletter, NewsletterContent } from '../../lib/newsletter-template';
import type { ImportSummary, SendListResult, SendTestResult, Subscriber } from './types';

const PASSWORD_KEY = 'sp-admin-password';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function getStoredPassword(): string | null {
  try {
    return sessionStorage.getItem(PASSWORD_KEY);
  } catch {
    return null;
  }
}

export function setStoredPassword(password: string): void {
  try {
    sessionStorage.setItem(PASSWORD_KEY, password);
  } catch {
    // sessionStorage may be unavailable (private mode); the gate just asks again.
  }
}

export function clearStoredPassword(): void {
  try {
    sessionStorage.removeItem(PASSWORD_KEY);
  } catch {
    // nothing to clear
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const password = getStoredPassword() ?? '';
  const res = await fetch(path, {
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      Authorization: `Bearer ${password}`,
    },
  });

  if (res.status === 401) {
    clearStoredPassword();
    throw new ApiError('unauthorized', 401);
  }

  if (!res.ok) {
    let message = `request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // non-JSON error body, keep the generic message
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export function ping(): Promise<{ ok: true }> {
  return request('/api/admin/ping');
}

export function listNewsletters(): Promise<{ newsletters: Newsletter[] }> {
  return request('/api/admin/newsletters');
}

export function createNewsletter(content: NewsletterContent): Promise<{ newsletter: Newsletter }> {
  return request('/api/admin/newsletters', { method: 'POST', body: JSON.stringify(content) });
}

export function getNewsletter(id: string): Promise<{ newsletter: Newsletter }> {
  return request(`/api/admin/newsletters/${id}`);
}

export function updateNewsletter(id: string, content: NewsletterContent): Promise<{ newsletter: Newsletter }> {
  return request(`/api/admin/newsletters/${id}`, { method: 'PUT', body: JSON.stringify(content) });
}

export function deleteNewsletter(id: string): Promise<void> {
  return request(`/api/admin/newsletters/${id}`, { method: 'DELETE' });
}

export function sendTest(id: string, to: string): Promise<SendTestResult> {
  return request(`/api/admin/newsletters/${id}/send`, {
    method: 'POST',
    body: JSON.stringify({ mode: 'test', to }),
  });
}

export function sendToList(id: string): Promise<SendListResult> {
  return request(`/api/admin/newsletters/${id}/send`, {
    method: 'POST',
    body: JSON.stringify({ mode: 'list' }),
  });
}

export function listSubscribers(): Promise<{ subscribers: Subscriber[]; active: number }> {
  return request('/api/admin/subscribers');
}

export function addSubscribers(text: string): Promise<ImportSummary> {
  return request('/api/admin/subscribers', { method: 'POST', body: JSON.stringify({ text }) });
}

export function setSubscriberStatus(
  email: string,
  status: Subscriber['status'],
): Promise<{ subscriber: Subscriber }> {
  return request('/api/admin/subscribers', {
    method: 'PATCH',
    body: JSON.stringify({ email, status }),
  });
}

/* ---- image upload ----
   Small PNGs are almost always icons/logos that rely on transparency, so they
   are sent through untouched. Everything else gets capped on its long edge
   and re-encoded as JPEG - a phone photo otherwise arrives at several MB. */

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.85;
const SMALL_PNG_BYTES = 300 * 1024;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('could not read this image'));
    };
    image.src = url;
  });
}

async function prepareImageForUpload(file: File): Promise<File> {
  if (file.type === 'image/png' && file.size < SMALL_PNG_BYTES) return file;

  const image = await loadImage(file);
  const longest = Math.max(image.naturalWidth, image.naturalHeight);
  const scale = longest > MAX_DIMENSION ? MAX_DIMENSION / longest : 1;
  const width = Math.round(image.naturalWidth * scale);
  const height = Math.round(image.naturalHeight * scale);
  if (!width || !height) return file;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY));
  if (!blob) return file;
  const name = file.name.replace(/\.[^./]+$/, '') + '.jpg';
  return new File([blob], name, { type: 'image/jpeg' });
}

export async function uploadImage(file: File): Promise<{ url: string }> {
  const prepared = await prepareImageForUpload(file);
  const password = getStoredPassword() ?? '';
  const form = new FormData();
  form.append('file', prepared);

  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${password}` },
    body: form,
  });

  if (res.status === 401) {
    clearStoredPassword();
    throw new ApiError('unauthorized', 401);
  }

  if (!res.ok) {
    let message = `upload failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // non-JSON error body, keep the generic message
    }
    throw new ApiError(message, res.status);
  }

  return (await res.json()) as { url: string };
}
