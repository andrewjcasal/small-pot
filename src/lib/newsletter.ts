// Remembers a signup on this browser so the links page stops popping the form up.
const SUBSCRIBED_KEY = 'sp-newsletter-subscribed';

export function hasSubscribed() {
  try {
    return localStorage.getItem(SUBSCRIBED_KEY) === '1';
  } catch {
    return false;
  }
}

export function markSubscribed() {
  try {
    localStorage.setItem(SUBSCRIBED_KEY, '1');
  } catch {
    // Private mode or blocked storage: the popup just shows again next visit.
  }
}
