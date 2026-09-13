/** Subscriber shape from the sp-subscribers blob store. Keyed by lowercased email. */
export interface Subscriber {
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed';
  source: 'site' | 'import' | 'admin';
  createdAt: string;
  updatedAt: string;
  unsubscribedAt?: string;
}

/** Result of a free-text subscriber import. */
export interface ImportSummary {
  added: number;
  existing: number;
  reactivated: number;
  invalid: string[];
}

/** Result of a send, either mode. */
export interface SendTestResult {
  ok: true;
  id: string;
}

export interface SendListResult {
  ok: true;
  sent: number;
  failed: number;
  errors?: string[];
}
