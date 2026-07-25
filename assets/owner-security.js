const DB_NAME = 'sakthiai-owner-platform';
const DB_VERSION = 1;
const STORE_NAMES = ['projects', 'messages', 'approvals', 'memories', 'graphNodes', 'graphEdges', 'usage', 'artifacts', 'settings'];
const LOCK_CONFIG_KEY = 'sakthiai-owner-lock-v1';
const UNLOCK_UNTIL_KEY = 'sakthiai-owner-unlocked-until';
const IDLE_TIMEOUT_MS = 10 * 60 * 1000;
const PBKDF2_ITERATIONS = 250000;

const encoder = new TextEncoder();

function bytesToBase64(bytes) {
  if (typeof btoa === 'function') {
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  }
  return Buffer.from(bytes).toString('base64');
}

function base64ToBytes(value) {
  if (typeof atob === 'function') {
    const binary = atob(value);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  }
  return new Uint8Array(Buffer.from(value, 'base64'));
}

async function importPassphrase(passphrase) {
  return crypto.subtle.importKey('raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveBits', 'deriveKey']);
}

async function deriveVerifierBytes(passphrase, salt, iterations = PBKDF2_ITERATIONS) {
  const material = await importPassphrase(passphrase);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, material, 256);
  return new Uint8Array(bits);
}

async function deriveEncryptionKey(passphrase, salt, iterations = PBKDF2_ITERATIONS) {
  const material = await importPassphrase(passphrase);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function equalBytes(left, right) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) mismatch |= left[index] ^ right[index];
  return mismatch === 0;
}

export async function createOwnerLockVerifier(passphrase, salt = crypto.getRandomValues(new Uint8Array(16))) {
  if (typeof passphrase !== 'string' || passphrase.length < 12) throw new Error('Use an owner passphrase of at least 12 characters.');
  const verifier = await deriveVerifierBytes(passphrase, salt);
  return {
    version: 1,
    algorithm: 'PBKDF2-SHA-256',
    iterations: PBKDF2_ITERATIONS,
    salt: bytesToBase64(salt),
    verifier: bytesToBase64(verifier),
    createdAt: new Date().toISOString()
  };
}

export async function verifyOwnerPassphrase(passphrase, configuration) {
  if (!configuration?.salt || !configuration?.verifier) return false;
  const derived = await deriveVerifierBytes(passphrase, base64ToBytes(configuration.salt), configuration.iterations || PBKDF2_ITERATIONS);
  return equalBytes(derived, base64ToBytes(configuration.verifier));
}

export async function encryptOwnerBackup(payload, passphrase) {
  if (typeof passphrase !== 'string' || passphrase.length < 12) throw new Error('Use an export passphrase of at least 12 characters.');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveEncryptionKey(passphrase, salt);
  const plaintext = encoder.encode(JSON.stringify(payload));
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext));
  return {
    format: 'sakthiai-encrypted-backup-v1',
    cipher: 'AES-256-GCM',
    kdf: 'PBKDF2-SHA-256',
    iterations: PBKDF2_ITERATIONS,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(ciphertext),
    createdAt: new Date().toISOString()
  };
}

export async function decryptOwnerBackup(envelope, passphrase) {
  if (envelope?.format !== 'sakthiai-encrypted-backup-v1') throw new Error('Unsupported SakthiAI backup format.');
  const key = await deriveEncryptionKey(passphrase, base64ToBytes(envelope.salt), envelope.iterations || PBKDF2_ITERATIONS);
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(envelope.iv) },
    key,
    base64ToBytes(envelope.ciphertext)
  );
  return JSON.parse(new TextDecoder().decode(plaintext));
}

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function readStore(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const request = transaction.objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

function clearStore(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const request = transaction.objectStore(storeName).clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function collectOwnerData() {
  const db = await openDb();
  try {
    const data = {};
    for (const storeName of STORE_NAMES) data[storeName] = await readStore(db, storeName);
    return { exportedAt: new Date().toISOString(), schemaVersion: 2, security: 'encrypted-export', data };
  } finally {
    db.close();
  }
}

async function collectProjectData(projectId) {
  const db = await openDb();
  try {
    const projects = await readStore(db, 'projects');
    const messages = await readStore(db, 'messages');
    return {
      exportedAt: new Date().toISOString(),
      schemaVersion: 2,
      security: 'encrypted-export',
      project: projects.find((project) => project.id === projectId) || null,
      messages: messages.filter((message) => message.projectId === projectId)
    };
  } finally {
    db.close();
  }
}

function downloadJson(value, filename) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function lockConfiguration() {
  try {
    return JSON.parse(localStorage.getItem(LOCK_CONFIG_KEY) || 'null');
  } catch {
    return null;
  }
}

function isUnlocked() {
  return Number(sessionStorage.getItem(UNLOCK_UNTIL_KEY) || 0) > Date.now();
}

function setUnlocked() {
  sessionStorage.setItem(UNLOCK_UNTIL_KEY, String(Date.now() + IDLE_TIMEOUT_MS));
}

function clearUnlocked() {
  sessionStorage.removeItem(UNLOCK_UNTIL_KEY);
}

function ensureSecurityStylesheet() {
  if (document.querySelector('link[href="/assets/owner-security.css"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/assets/owner-security.css';
  document.head.append(link);
}

function sensitiveSections() {
  return ['projects', 'files', 'artifacts', 'approvals', 'memory', 'usage']
    .map((name) => document.getElementById(`view-${name}`))
    .filter(Boolean);
}

function applyLockState() {
  const locked = !isUnlocked();
  document.body.classList.toggle('owner-data-locked', locked);
  for (const section of sensitiveSections()) {
    section.classList.toggle('owner-locked', locked);
    let notice = section.querySelector(':scope > .owner-lock-notice');
    if (!notice) {
      notice = document.createElement('div');
      notice.className = 'owner-lock-notice panel';
      notice.innerHTML = '<strong>Owner data is locked</strong><span>Open Owner & Access and unlock this browser session to view or change local owner data.</span>';
      section.querySelector('.page-header')?.after(notice);
    }
    notice.hidden = !locked;
    for (const child of [...section.children]) {
      if (child === notice || child.classList.contains('page-header')) continue;
      child.inert = locked;
      child.setAttribute('aria-hidden', String(locked));
    }
  }
  for (const id of ['exportOwnerData', 'clearOwnerData', 'exportProject', 'deleteProject']) {
    const button = document.getElementById(id);
    if (button) button.disabled = locked;
  }
  const status = document.getElementById('ownerLockStatus');
  if (status) status.textContent = locked ? 'Locked' : 'Unlocked for 10 minutes of inactivity';
  const lockButton = document.getElementById('lockOwnerSession');
  if (lockButton) lockButton.disabled = locked;
}

function setLockPanelMode() {
  const configured = Boolean(lockConfiguration());
  const action = document.getElementById('ownerLockAction');
  const confirmationRow = document.getElementById('ownerPassphraseConfirmRow');
  const label = document.getElementById('ownerPassphraseLabel');
  if (action) action.textContent = configured ? 'Unlock owner session' : 'Create owner lock';
  if (confirmationRow) confirmationRow.hidden = configured;
  if (label) label.textContent = configured ? 'Owner passphrase' : 'Create owner passphrase';
}

function injectLockPanel() {
  const grid = document.querySelector('#view-access .owner-grid');
  if (!grid || document.getElementById('ownerPrivacyPanel')) return;
  const panel = document.createElement('article');
  panel.id = 'ownerPrivacyPanel';
  panel.className = 'panel owner-stack owner-lock-panel';
  panel.innerHTML = `
    <p class="eyebrow">Release 011 security</p>
    <h2>Owner privacy lock</h2>
    <p class="muted">Protects browser-local projects from casual access on this device. It is not a substitute for Cloudflare Access or OIDC.</p>
    <div class="owner-lock-state"><span>Session state</span><strong id="ownerLockStatus">Locked</strong></div>
    <label id="ownerPassphraseLabel" for="ownerPassphrase">Owner passphrase</label>
    <input id="ownerPassphrase" type="password" minlength="12" autocomplete="current-password" placeholder="At least 12 characters">
    <div id="ownerPassphraseConfirmRow"><label for="ownerPassphraseConfirm">Confirm passphrase</label><input id="ownerPassphraseConfirm" type="password" minlength="12" autocomplete="new-password"></div>
    <div class="inline-actions"><button id="ownerLockAction" class="button primary" type="button">Unlock owner session</button><button id="lockOwnerSession" class="button secondary" type="button">Lock now</button></div>
    <p id="ownerLockMessage" class="owner-status"></p>
    <div class="owner-callout warning"><strong>Encrypted export only</strong><p class="muted">Project and full-owner backups are encrypted locally with AES-256-GCM. The export passphrase is never stored or transmitted.</p></div>`;
  grid.prepend(panel);
  setLockPanelMode();

  document.getElementById('ownerLockAction')?.addEventListener('click', async () => {
    const passphraseInput = document.getElementById('ownerPassphrase');
    const confirmationInput = document.getElementById('ownerPassphraseConfirm');
    const message = document.getElementById('ownerLockMessage');
    const passphrase = passphraseInput?.value || '';
    try {
      const configuration = lockConfiguration();
      if (!configuration) {
        if (passphrase !== (confirmationInput?.value || '')) throw new Error('Passphrase confirmation does not match.');
        const verifier = await createOwnerLockVerifier(passphrase);
        localStorage.setItem(LOCK_CONFIG_KEY, JSON.stringify(verifier));
      } else if (!(await verifyOwnerPassphrase(passphrase, configuration))) {
        throw new Error('Incorrect owner passphrase.');
      }
      setUnlocked();
      if (message) message.textContent = 'Owner session unlocked. It will lock automatically after inactivity.';
      if (passphraseInput) passphraseInput.value = '';
      if (confirmationInput) confirmationInput.value = '';
      setLockPanelMode();
      applyLockState();
    } catch (error) {
      if (message) message.textContent = error.message;
    }
  });

  document.getElementById('lockOwnerSession')?.addEventListener('click', () => {
    clearUnlocked();
    applyLockState();
  });
}

async function requireVerifiedPassphrase(message) {
  if (!isUnlocked()) throw new Error('Unlock the owner session first.');
  const passphrase = window.prompt(message);
  if (!passphrase) throw new Error('Export cancelled.');
  const valid = await verifyOwnerPassphrase(passphrase, lockConfiguration());
  if (!valid) throw new Error('Incorrect owner passphrase.');
  return passphrase;
}

async function encryptedOwnerExport() {
  const passphrase = await requireVerifiedPassphrase('Enter the owner passphrase to encrypt this full backup.');
  const envelope = await encryptOwnerBackup(await collectOwnerData(), passphrase);
  downloadJson(envelope, `sakthiai-owner-backup-${new Date().toISOString().slice(0, 10)}.sakthiai.enc.json`);
}

async function encryptedProjectExport() {
  const passphrase = await requireVerifiedPassphrase('Enter the owner passphrase to encrypt this project backup.');
  const projectId = localStorage.getItem('sakthiai-active-project') || 'owner-default';
  const payload = await collectProjectData(projectId);
  const envelope = await encryptOwnerBackup(payload, passphrase);
  const safeName = String(payload.project?.name || 'sakthiai-project').replace(/[^A-Za-z0-9._-]+/g, '-').slice(0, 80);
  downloadJson(envelope, `${safeName}.sakthiai.enc.json`);
}

async function secureClearOwnerData() {
  await requireVerifiedPassphrase('Enter the owner passphrase to authorise deletion.');
  const phrase = window.prompt('Type DELETE LOCAL DATA to permanently remove browser-local SakthiAI owner data.');
  if (phrase !== 'DELETE LOCAL DATA') throw new Error('Deletion cancelled because the confirmation phrase did not match.');
  const db = await openDb();
  try {
    for (const storeName of STORE_NAMES) await clearStore(db, storeName);
  } finally {
    db.close();
  }
  localStorage.removeItem('sakthiai-active-project');
  localStorage.removeItem('sakthiai-latest-response');
  clearUnlocked();
  location.reload();
}

function interceptSensitiveActions() {
  document.addEventListener('click', async (event) => {
    const button = event.target.closest?.('#exportOwnerData, #exportProject, #clearOwnerData');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const message = document.getElementById('ownerLockMessage');
    try {
      if (button.id === 'exportOwnerData') await encryptedOwnerExport();
      if (button.id === 'exportProject') await encryptedProjectExport();
      if (button.id === 'clearOwnerData') await secureClearOwnerData();
      if (message && button.id !== 'clearOwnerData') message.textContent = 'Encrypted backup created locally.';
    } catch (error) {
      if (message) message.textContent = error.message;
      if (!isUnlocked()) location.hash = '#access';
    }
  }, true);
}

function enforceFreeOnlyUi() {
  const kimi = document.querySelector('#providerSelect option[value="kimi"]');
  if (kimi) {
    kimi.disabled = true;
    kimi.textContent = 'Kimi · disabled by owner policy';
  }
  const premium = document.querySelector('#budgetSelect option[value="premium"]');
  if (premium) {
    premium.disabled = true;
    premium.textContent = 'Premium · disabled by owner policy';
  }
  const token = document.getElementById('fileOwnerToken');
  if (token) token.autocomplete = 'new-password';
  addEventListener('pagehide', () => {
    if (token) token.value = '';
  });
}

function initialiseOwnerSecurity() {
  ensureSecurityStylesheet();
  document.body.classList.add('owner-data-locked');
  injectLockPanel();
  interceptSensitiveActions();
  enforceFreeOnlyUi();
  applyLockState();

  for (const eventName of ['pointerdown', 'keydown', 'touchstart']) {
    addEventListener(eventName, () => {
      if (isUnlocked()) setUnlocked();
    }, { passive: true });
  }
  setInterval(() => {
    if (!isUnlocked()) applyLockState();
  }, 30000);
}

if (globalThis.document) initialiseOwnerSecurity();
