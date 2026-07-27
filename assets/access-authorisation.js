export function deriveAuthorisationView(payload = {}) {
  const state = payload?.authorisation && typeof payload.authorisation === 'object' ? payload.authorisation : {};
  const catalogue = state.catalogue && typeof state.catalogue === 'object' ? state.catalogue : {};
  const audit = state.auditContract && typeof state.auditContract === 'object' ? state.auditContract : {};
  const session = payload?.currentSession && typeof payload.currentSession === 'object' ? payload.currentSession : {};
  const active = state.endpointAuthorisationEnabled === true;
  const verified = session.cryptographicallyVerified === true;

  return {
    tone: active ? (verified ? 'ready' : 'warning') : 'planned',
    title: active ? 'Endpoint authorisation is active' : 'Endpoint authorisation is prepared',
    summary: active
      ? `Default-deny route enforcement is active for the verified ${session.role || 'profile'} session.`
      : 'The route catalogue, role checks and safe denial contract are implemented, but production enforcement remains disabled.',
    metrics: {
      routes: `${Number(catalogue.routeCount || 0)} classified`,
      ownerOnly: `${Number(catalogue.ownerOnlyRouteCount || 0)} owner-only`,
      defaultDecision: catalogue.defaultDecision || 'deny-unclassified-when-enabled',
      serverMutations: state.serverMutationsEnabled ? 'Enabled' : 'Disabled',
      audit: audit.persistenceEnabled ? 'Persisted' : 'Metadata contract only',
      currentRole: session.role || 'local-owner'
    },
    nextGate: state.nextGate || 'Complete the verified owner-only Access pilot before activating endpoint authorisation.'
  };
}

function ensureStylesheet(documentRef) {
  if (documentRef.querySelector('link[href="/assets/access-authorisation.css"]')) return;
  const link = documentRef.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/assets/access-authorisation.css';
  documentRef.head.append(link);
}

function metric(documentRef, label, value) {
  const article = documentRef.createElement('article');
  article.className = 'access-authorisation-metric';
  const span = documentRef.createElement('span');
  span.textContent = label;
  const strong = documentRef.createElement('strong');
  strong.textContent = value;
  article.append(span, strong);
  return article;
}

async function fetchAuthorisation(fetchImpl) {
  const response = await fetchImpl('/api/v1/platform/access/authorisation', {
    method: 'GET',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: { Accept: 'application/json' }
  });
  if (!response.ok) throw new Error(`Authorisation status returned ${response.status}`);
  return response.json();
}

export function renderAuthorisation(documentRef = globalThis.document, fetchImpl = globalThis.fetch) {
  const accessView = documentRef?.getElementById('view-access');
  if (!accessView || documentRef.getElementById('accessAuthorisationPanel')) return;
  ensureStylesheet(documentRef);

  const panel = documentRef.createElement('section');
  panel.id = 'accessAuthorisationPanel';
  panel.className = 'panel access-authorisation-panel';
  panel.setAttribute('aria-live', 'polite');
  panel.innerHTML = `
    <div class="panel-heading">
      <div><p class="eyebrow">Owner Build 017</p><h2 id="accessAuthorisationTitle">Checking endpoint authorisation…</h2></div>
      <span id="accessAuthorisationState" class="tag planned">Prepared</span>
    </div>
    <p id="accessAuthorisationSummary" class="muted">Reading the server-side route catalogue and activation state.</p>
    <div id="accessAuthorisationMetrics" class="access-authorisation-metrics"></div>
    <div class="owner-callout warning"><strong>Production activation boundary</strong><p id="accessAuthorisationNext" class="muted">Owner-only Cloudflare Access verification remains first.</p></div>`;

  const rolePanel = documentRef.getElementById('accessRolePolicyPanel');
  if (rolePanel) rolePanel.after(panel);
  else accessView.querySelector('.page-header')?.after(panel);

  async function refresh() {
    const title = panel.querySelector('#accessAuthorisationTitle');
    const badge = panel.querySelector('#accessAuthorisationState');
    const summary = panel.querySelector('#accessAuthorisationSummary');
    const metrics = panel.querySelector('#accessAuthorisationMetrics');
    const next = panel.querySelector('#accessAuthorisationNext');
    try {
      const payload = await fetchAuthorisation(fetchImpl);
      const view = deriveAuthorisationView(payload);
      panel.dataset.tone = view.tone;
      title.textContent = view.title;
      badge.textContent = payload?.authorisation?.endpointAuthorisationEnabled ? 'Active' : 'Prepared · disabled';
      badge.className = `tag ${payload?.authorisation?.endpointAuthorisationEnabled ? 'live' : 'planned'}`;
      summary.textContent = view.summary;
      metrics.replaceChildren(
        metric(documentRef, 'Route catalogue', view.metrics.routes),
        metric(documentRef, 'Owner-only routes', view.metrics.ownerOnly),
        metric(documentRef, 'Default decision', view.metrics.defaultDecision),
        metric(documentRef, 'Server mutations', view.metrics.serverMutations),
        metric(documentRef, 'Audit contract', view.metrics.audit),
        metric(documentRef, 'Current role', view.metrics.currentRole)
      );
      next.textContent = view.nextGate;
    } catch (error) {
      panel.dataset.tone = 'warning';
      title.textContent = 'Endpoint authorisation status unavailable';
      badge.textContent = 'Unavailable';
      summary.textContent = error?.message || 'The authorisation contract could not be loaded.';
      metrics.replaceChildren();
      next.textContent = 'Do not activate route enforcement until this endpoint and all Build 017 checks are healthy.';
    }
  }

  refresh();
}

if (globalThis.document) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => renderAuthorisation(), { once: true });
  else renderAuthorisation();
}

export const __test = { ensureStylesheet, fetchAuthorisation, metric };
