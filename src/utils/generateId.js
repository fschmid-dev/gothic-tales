/**
 * Generiert eine eindeutige ID.
 * Versucht crypto.randomUUID() zu verwenden, fällt auf Date.now() zurück.
 * @returns {string|number} Die generierte ID.
 */
export function generateId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  } else {
    console.warn(
      'crypto.randomUUID() not available, falling back to Date.now() for ID generation.'
    );
    return Date.now();
  }
}
