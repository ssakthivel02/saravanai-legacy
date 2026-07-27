const LEGACY_DATABASE_NAME = 'sakthiai-owner-platform';
const LEGACY_SCOPE = 'local-owner';
const PROFILE_KEY_PATTERN = /^profile-[a-f0-9]{24}$/;

let contextPromise;

function clean(value, max = 256) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function validProfileKey(value) {
  return PROFILE_KEY_PATTERN.test(clean(value, 64));
}

export function resolveProfileContext(session = {}) {
  const identity = session?.identity && typeof session.identity === 'object' ? session.identity : {};
  const verified = identity.cryptographicallyVerified === true && validProfileKey(identity.profileKey);
  const profileKey = verified ? identity.profileKey : LEGACY_SCOPE;
  return Object.freeze({
    authenticated: identity.authenticated === true,
    cryptographicallyVerified: verified,
    profileKey,
    role: verified ? clean(identity.role, 32) || 'member' : 'local-owner',
    maskedEmail: verified ? clean(identity.maskedEmail, 254) || null : null,
    assurance: verified ? clean(identity.assurance, 256) || 'cloudflare-access-jwt-verified' : 'local-owner-preview',
    databaseName: verified ? `${LEGACY_DATABASE_NAME}-${profileKey}` : LEGACY_DATABASE_NAME,
    storagePrefix: verified ? `sakthiai:${profileKey}:` : '',
    legacyCompatible: !verified,
    crossDeviceSyncEnabled: false,
    serverPersistenceEnabled: false
  });
}

export function scopedStorageKey(context, legacyKey) {
  const key = clean(legacyKey, 256);
  if (!key) throw new Error('A storage key is required.');
  return context?.storagePrefix ? `${context.storagePrefix}${key}` : key;
}

export async function loadProfileContext(fetchImpl = fetch) {
  if (!contextPromise) {
    contextPromise = (async () => {
      try {
        const response = await fetchImpl('/api/v1/platform/session', {
          method: 'GET',
          credentials: 'same-origin',
          cache: 'no-store',
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) return resolveProfileContext();
        return resolveProfileContext(await response.json());
      } catch {
        return resolveProfileContext();
      }
    })();
  }
  return contextPromise;
}

export function resetProfileContextForTests() {
  contextPromise = undefined;
}

export const PROFILE_CONTEXT = {
  legacyDatabaseName: LEGACY_DATABASE_NAME,
  legacyScope: LEGACY_SCOPE
};
