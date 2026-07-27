export function deriveAccessReadiness(session = {}, release = {}) {
  const identity = session?.identity && typeof session.identity === 'object' ? session.identity : {};
  const verified = identity.cryptographicallyVerified === true;
  const enforcement = identity.enforcementEnabled === true || release?.activation?.accessJwtEnforcementEnabled === true;
  const role = typeof identity.role === 'string' && identity.role ? identity.role : verified ? 'member' : 'local-owner';

  if (verified) {
    return {
      state: role === 'owner' ? 'verified-owner' : 'verified-user',
      tone: 'ready',
      title: role === 'owner' ? 'Owner login verified' : 'Authenticated profile verified',
      summary: `${identity.maskedEmail || 'Cloudflare Access identity'} · ${role}. Worker-side JWT verification and browser profile isolation are active.`,
      nextAction: role === 'owner'
        ? 'Keep reader and member invitations disabled until server-side roles and shared persistence are implemented.'
        : 'This profile must remain within the permissions assigned by the owner.'
    };
  }

  if (enforcement) {
    return {
      state: 'authentication-required',
      tone: 'warning',
      title: 'Cloudflare Access is active',
      summary: 'This browser does not currently have a cryptographically verified SakthiAI profile.',
      nextAction: 'Sign in with the exact approved Google account. If access was just configured, verify the Access AUD and Worker secrets.'
    };
  }

  return {
    state: 'activation-pending',
    tone: 'planned',
    title: 'Owner Access activation pending',
    summary: 'The Google identity connection and SakthiAI JWT verification code are prepared, but production enforcement remains deliberately disabled.',
    nextAction: 'Create the whole-host exact-email Access application, test one allowed and one denied account, then enable Worker JWT enforcement.'
  };
}

export function platformReleaseLabel(release = {}) {
  const version = typeof release.platformRelease === 'string' ? release.platformRelease : 'release unavailable';
  const build = Number.isInteger(release.ownerBuild) ? `Owner Build ${release.ownerBuild}` : 'Owner build unavailable';
  return `${build} · ${version}`;
}

function ensureStylesheet(documentRef) {
  if (documentRef.querySelector('link[href="/assets/access-readiness.css"]')) return;
  const link = documentRef.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/assets/access-readiness.css';
  documentRef.head.append(link);
}

function createMetric(documentRef, label, value, status = '') {
  const article = documentRef.createElement('article');
  article.className = 'access-readiness-metric';
  const heading = documentRef.createElement('span');
  heading.textContent = label;
  const strong = documentRef.createElement('strong');
  strong.textContent = value;
  if (status) strong.dataset.status = status;
  article.append(heading, strong);
  return article;
}

async function fetchJson(fetchImpl, path) {
  const response = await fetchImpl(path, {
    method: 'GET',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: { Accept: 'application/json' }
  });
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.json();
}

export async function loadAccessReadiness(fetchImpl = fetch) {
  const [release, session] = await Promise.all([
    fetchJson(fetchImpl, '/api/v1/platform/release'),
    fetchJson(fetchImpl, '/api/v1/platform/session')
  ]);
  return { release, session, readiness: deriveAccessReadiness(session, release) };
}

function renderAccessReadiness(documentRef = globalThis.document, fetchImpl = globalThis.fetch) {
  const view = documentRef?.getElementById('view-access');
  const pageHeader = view?.querySelector('.page-header');
  if (!view || !pageHeader || documentRef.getElementById('accessReadinessPanel')) return;
  ensureStylesheet(documentRef);

  const panel = documentRef.createElement('section');
  panel.id = 'accessReadinessPanel';
  panel.className = 'panel access-readiness-panel';
  panel.setAttribute('aria-live', 'polite');

  const header = documentRef.createElement('div');
  header.className = 'panel-heading';
  const headingBlock = documentRef.createElement('div');
  const eyebrow = documentRef.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = 'Live access and release contract';
  const title = documentRef.createElement('h2');
  title.textContent = 'Checking owner access…';
  headingBlock.append(eyebrow, title);
  const refresh = documentRef.createElement('button');
  refresh.type = 'button';
  refresh.className = 'button secondary small';
  refresh.textContent = 'Refresh status';
  header.append(headingBlock, refresh);

  const summary = documentRef.createElement('p');
  summary.className = 'muted access-readiness-summary';
  summary.textContent = 'Reading the server-side session and release state.';
  const metrics = documentRef.createElement('div');
  metrics.className = 'access-readiness-metrics';
  const next = documentRef.createElement('div');
  next.className = 'owner-callout access-readiness-next';
  const nextStrong = documentRef.createElement('strong');
  nextStrong.textContent = 'Next controlled action';
  const nextText = documentRef.createElement('p');
  nextText.className = 'muted';
  nextText.textContent = 'Waiting for status…';
  next.append(nextStrong, nextText);
  panel.append(header, summary, metrics, next);
  pageHeader.after(panel);

  async function refreshState() {
    refresh.disabled = true;
    title.textContent = 'Checking owner access…';
    summary.textContent = 'Reading the server-side session and release state.';
    metrics.replaceChildren();
    try {
      const { release, session, readiness } = await loadAccessReadiness(fetchImpl);
      panel.dataset.tone = readiness.tone;
      title.textContent = readiness.title;
      summary.textContent = readiness.summary;
      const activation = release.activation || {};
      const usage = release.usagePolicy || {};
      metrics.append(
        createMetric(documentRef, 'Release', platformReleaseLabel(release), 'current'),
        createMetric(documentRef, 'JWT enforcement', activation.accessJwtEnforcementEnabled ? 'Enabled' : 'Manual activation pending', activation.accessJwtEnforcementEnabled ? 'ready' : 'planned'),
        createMetric(documentRef, 'Current role', session?.identity?.role || 'Local owner preview', session?.identity?.cryptographicallyVerified ? 'ready' : 'planned'),
        createMetric(documentRef, 'Reader/member access', activation.readerProfilesEnabled || activation.memberInvitationsEnabled ? 'Enabled' : 'Blocked until server RBAC', 'blocked'),
        createMetric(documentRef, 'Question limit', usage.serverHardQuotaEnabled ? 'Server enforced' : `${usage.browserSoftCapDefault || 50} local soft cap`, usage.serverHardQuotaEnabled ? 'ready' : 'planned'),
        createMetric(documentRef, 'Paid fallback', usage.paidFallbackEnabled ? 'Enabled' : 'Disabled', usage.paidFallbackEnabled ? 'warning' : 'ready')
      );
      nextText.textContent = readiness.nextAction;
    } catch (error) {
      panel.dataset.tone = 'warning';
      title.textContent = 'Access status unavailable';
      summary.textContent = 'SakthiAI could not read the live session and release contract.';
      metrics.append(createMetric(documentRef, 'Error', error?.message || 'Unknown status error', 'warning'));
      nextText.textContent = 'Do not change production access settings until the platform session endpoint is reachable.';
    } finally {
      refresh.disabled = false;
    }
  }

  refresh.addEventListener('click', refreshState);
  refreshState();
}

if (globalThis.document) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => renderAccessReadiness(), { once: true });
  else renderAccessReadiness();
}

export const __test = { createMetric, ensureStylesheet, renderAccessReadiness };
