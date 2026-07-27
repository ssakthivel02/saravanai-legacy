import { loadProfileContext, scopedStorageKey } from './profile-context.js';

const LOCAL_KEYS = new Set([
  'sakthiai-active-project',
  'sakthiai-latest-response',
  'sakthiai-daily-request-cap',
  'sakthiai-owner-lock-v1'
]);
const SESSION_KEYS = new Set(['sakthiai-owner-unlocked-until']);

function installIndexedDbScope(context) {
  if (!context.cryptographicallyVerified || typeof IDBFactory === 'undefined') return;
  const prototype = IDBFactory.prototype;
  if (prototype.__sakthiaiProfileScoped) return;
  const originalOpen = prototype.open;
  const originalDelete = prototype.deleteDatabase;

  Object.defineProperty(prototype, '__sakthiaiProfileScoped', { value: true });
  prototype.open = function scopedOpen(name, version) {
    const scopedName = name === 'sakthiai-owner-platform' ? context.databaseName : name;
    return version === undefined ? originalOpen.call(this, scopedName) : originalOpen.call(this, scopedName, version);
  };
  prototype.deleteDatabase = function scopedDelete(name) {
    const scopedName = name === 'sakthiai-owner-platform' ? context.databaseName : name;
    return originalDelete.call(this, scopedName);
  };
}

function storageKey(context, storage, key) {
  if (!context.cryptographicallyVerified || typeof key !== 'string') return key;
  if (globalThis.localStorage && storage === globalThis.localStorage && LOCAL_KEYS.has(key)) return scopedStorageKey(context, key);
  if (globalThis.sessionStorage && storage === globalThis.sessionStorage && SESSION_KEYS.has(key)) return scopedStorageKey(context, key);
  return key;
}

function installStorageScope(context) {
  if (!context.cryptographicallyVerified || typeof Storage === 'undefined') return;
  const prototype = Storage.prototype;
  if (prototype.__sakthiaiProfileScoped) return;
  const originalGetItem = prototype.getItem;
  const originalSetItem = prototype.setItem;
  const originalRemoveItem = prototype.removeItem;

  Object.defineProperty(prototype, '__sakthiaiProfileScoped', { value: true });
  prototype.getItem = function scopedGetItem(key) {
    return originalGetItem.call(this, storageKey(context, this, key));
  };
  prototype.setItem = function scopedSetItem(key, value) {
    return originalSetItem.call(this, storageKey(context, this, key), value);
  };
  prototype.removeItem = function scopedRemoveItem(key) {
    return originalRemoveItem.call(this, storageKey(context, this, key));
  };
}

function renderProfileBoundary(context) {
  if (!globalThis.document) return;
  document.documentElement.dataset.profileScope = context.cryptographicallyVerified ? 'verified' : 'legacy-owner';
  const accessGrid = document.querySelector('#view-access .owner-security-grid');
  if (!accessGrid || document.getElementById('authenticatedProfileBoundary')) return;

  const card = document.createElement('article');
  card.id = 'authenticatedProfileBoundary';
  card.innerHTML = context.cryptographicallyVerified
    ? `<strong>Verified profile boundary</strong><small>${context.maskedEmail || 'Verified Access identity'} · ${context.role}. Browser records and privacy-lock keys use an isolated profile namespace on this device.</small>`
    : '<strong>Local owner compatibility</strong><small>The existing owner database is unchanged. Authenticated profile isolation activates only after cryptographically verified Cloudflare Access enforcement.</small>';
  accessGrid.prepend(card);

  globalThis.dispatchEvent(new CustomEvent('sakthiai:profile-context', { detail: context }));
}

const context = await loadProfileContext();
installIndexedDbScope(context);
installStorageScope(context);
renderProfileBoundary(context);

export const activeProfileContext = context;
export const __test = { LOCAL_KEYS, SESSION_KEYS, installIndexedDbScope, installStorageScope, storageKey };
