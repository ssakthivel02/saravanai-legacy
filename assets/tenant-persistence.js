export function deriveTenantPersistenceView(payload = {}) {
  const state = payload?.persistence && typeof payload.persistence === 'object' ? payload.persistence : {};
  const storage = state.storage && typeof state.storage === 'object' ? state.storage : {};
  const operations = storage.operations && typeof storage.operations === 'object' ? storage.operations : {};
  const schema = storage.schema && typeof storage.schema === 'object' ? storage.schema : {};
  const context = state.context && typeof state.context === 'object' ? state.context : {};
  const active = operations.readsOperational === true;

  return {
    tone: active ? 'ready' : 'planned',
    title: active ? 'Verified tenant persistence is active' : 'Tenant persistence foundation is prepared',
    summary: active
      ? 'D1-backed tenant metadata reads are operating behind verified identity and endpoint authorisation.'
      : 'The tenant schema, context, quota and retention contracts are implemented, but migration and server operations remain disabled.',
    metrics: {
      identity: context.valid ? 'Verified tenant context' : 'Owner pilot required',
      binding: storage.bindingPresent ? 'D1 present' : 'D1 not configured',
      schema: schema.ready ? `Version ${schema.configured}` : `Required ${schema.required || '0009'}`,
      reads: operations.readsOperational ? 'Operational' : 'Disabled',
      writes: operations.writesOperational ? 'Operational' : 'Disabled',
      migration: schema.automaticMigration ? 'Automatic' : 'Manual only'
    },
    nextGate: state.nextGate || 'Keep migration and writes disabled until the complete access chain is verified.'
  };
}

function ensureStylesheet(documentRef) {
  if (documentRef.querySelector('link[href="/assets/tenant-persistence.css"]')) return;
  const link = documentRef.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/assets/tenant-persistence.css';
  documentRef.head.append(link);
}

function metric(documentRef, label, value) {
  const article = documentRef.createElement('article');
  article.className = 'tenant-persistence-metric';
  const span = documentRef.createElement('span');
  span.textContent = label;
  const strong = documentRef.createElement('strong');
  strong.textContent = value;
  article.append(span, strong);
  return article;
}

async function fetchPersistence(fetchImpl) {
  const response = await fetchImpl('/api/v1/platform/storage/readiness', {
    method: 'GET', credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'application/json' }
  });
  if (!response.ok) throw new Error(`Tenant persistence status returned ${response.status}`);
  return response.json();
}

export function renderTenantPersistence(documentRef = globalThis.document, fetchImpl = globalThis.fetch) {
  const view = documentRef?.getElementById('view-access');
  if (!view || documentRef.getElementById('tenantPersistencePanel')) return;
  ensureStylesheet(documentRef);

  const panel = documentRef.createElement('section');
  panel.id = 'tenantPersistencePanel';
  panel.className = 'panel tenant-persistence-panel';
  panel.setAttribute('aria-live', 'polite');
  panel.innerHTML = `
    <div class="panel-heading">
      <div><p class="eyebrow">Owner Build 018</p><h2 id="tenantPersistenceTitle">Checking tenant persistence…</h2></div>
      <span id="tenantPersistenceState" class="tag planned">Prepared</span>
    </div>
    <p id="tenantPersistenceSummary" class="muted">Reading the safe storage readiness contract.</p>
    <div id="tenantPersistenceMetrics" class="tenant-persistence-metrics"></div>
    <div class="owner-callout warning"><strong>Migration boundary</strong><p id="tenantPersistenceNext" class="muted">Migration 0009 is manual and remains unexecuted.</p></div>`;

  const authorisation = documentRef.getElementById('accessAuthorisationPanel');
  if (authorisation) authorisation.after(panel);
  else view.querySelector('.page-header')?.after(panel);

  async function refresh() {
    const title = panel.querySelector('#tenantPersistenceTitle');
    const badge = panel.querySelector('#tenantPersistenceState');
    const summary = panel.querySelector('#tenantPersistenceSummary');
    const metrics = panel.querySelector('#tenantPersistenceMetrics');
    const next = panel.querySelector('#tenantPersistenceNext');
    try {
      const payload = await fetchPersistence(fetchImpl);
      const derived = deriveTenantPersistenceView(payload);
      panel.dataset.tone = derived.tone;
      title.textContent = derived.title;
      badge.textContent = payload?.persistence?.storage?.operations?.readsOperational ? 'Active' : 'Prepared · disabled';
      badge.className = `tag ${payload?.persistence?.storage?.operations?.readsOperational ? 'live' : 'planned'}`;
      summary.textContent = derived.summary;
      metrics.replaceChildren(
        metric(documentRef, 'Tenant identity', derived.metrics.identity),
        metric(documentRef, 'D1 binding', derived.metrics.binding),
        metric(documentRef, 'Schema', derived.metrics.schema),
        metric(documentRef, 'Metadata reads', derived.metrics.reads),
        metric(documentRef, 'Server writes', derived.metrics.writes),
        metric(documentRef, 'Migration mode', derived.metrics.migration)
      );
      next.textContent = derived.nextGate;
    } catch (error) {
      panel.dataset.tone = 'warning';
      title.textContent = 'Tenant persistence status unavailable';
      badge.textContent = 'Unavailable';
      summary.textContent = error?.message || 'Storage readiness could not be loaded.';
      metrics.replaceChildren();
      next.textContent = 'Do not execute migration 0009 or enable tenant operations until this endpoint and CI are healthy.';
    }
  }

  refresh();
}

if (globalThis.document) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => renderTenantPersistence(), { once: true });
  else renderTenantPersistence();
}

export const __test = { ensureStylesheet, fetchPersistence, metric };