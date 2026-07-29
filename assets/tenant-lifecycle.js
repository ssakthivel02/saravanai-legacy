export function deriveTenantLifecycleView(payload = {}) {
  const lifecycle = payload?.lifecycle && typeof payload.lifecycle === 'object' ? payload.lifecycle : {};
  const recovery = lifecycle.recovery && typeof lifecycle.recovery === 'object' ? lifecycle.recovery : {};
  const active = recovery.operational === true;
  const evidenceComplete = recovery.evidenceComplete === true;

  return {
    tone: active ? 'ready' : evidenceComplete ? 'warning' : 'planned',
    title: active ? 'Tenant lifecycle assurance is owner-reviewed' : 'Tenant lifecycle assurance is prepared',
    summary: active
      ? 'The non-production rehearsal evidence set is complete. Production migration, restore, deletion and writes remain prohibited.'
      : 'Migration rehearsal, backup, restore, isolation and deletion evidence contracts are implemented but remain disabled and non-production-only.',
    metrics: {
      rehearsal: lifecycle.rehearsal?.requiredStageCount || lifecycle.rehearsal?.requiredStages?.length || 0,
      backup: lifecycle.backup?.runtimeBackupExecutionEnabled ? 'Runtime enabled' : 'Evidence only',
      restore: lifecycle.restore?.automaticRestoreEnabled ? 'Automatic' : 'Manual drill only',
      isolation: lifecycle.isolation?.requiredCases?.length || 0,
      deletion: lifecycle.deletion?.hardDeleteImplemented ? 'Implemented' : 'Preview only',
      emergencyStop: recovery.emergencyStopped ? 'Active' : 'Released'
    },
    nextGate: lifecycle.nextGate || 'Complete non-production lifecycle evidence before considering any storage operation.'
  };
}

function ensureStylesheet(documentRef) {
  if (documentRef.querySelector('link[href="/assets/tenant-lifecycle.css"]')) return;
  const link = documentRef.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/assets/tenant-lifecycle.css';
  documentRef.head.append(link);
}

function metric(documentRef, label, value) {
  const article = documentRef.createElement('article');
  article.className = 'tenant-lifecycle-metric';
  const span = documentRef.createElement('span');
  span.textContent = label;
  const strong = documentRef.createElement('strong');
  strong.textContent = String(value);
  article.append(span, strong);
  return article;
}

async function fetchLifecycle(fetchImpl) {
  const response = await fetchImpl('/api/v1/platform/storage/lifecycle', {
    method: 'GET', credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'application/json' }
  });
  if (!response.ok) throw new Error(`Tenant lifecycle status returned ${response.status}`);
  return response.json();
}

export function renderTenantLifecycle(documentRef = globalThis.document, fetchImpl = globalThis.fetch) {
  const view = documentRef?.getElementById('view-access');
  if (!view || documentRef.getElementById('tenantLifecyclePanel')) return;
  ensureStylesheet(documentRef);

  const panel = documentRef.createElement('section');
  panel.id = 'tenantLifecyclePanel';
  panel.className = 'panel tenant-lifecycle-panel';
  panel.setAttribute('aria-live', 'polite');
  panel.innerHTML = `
    <div class="panel-heading">
      <div><p class="eyebrow">Owner Build 019</p><h2 id="tenantLifecycleTitle">Checking tenant lifecycle assurance…</h2></div>
      <span id="tenantLifecycleState" class="tag planned">Prepared</span>
    </div>
    <p id="tenantLifecycleSummary" class="muted">Reading migration, backup, restore, isolation and deletion readiness.</p>
    <div id="tenantLifecycleMetrics" class="tenant-lifecycle-metrics"></div>
    <div class="owner-callout warning"><strong>Production boundary</strong><p id="tenantLifecycleNext" class="muted">No migration, restore or deletion is executed by this release.</p></div>`;

  const persistence = documentRef.getElementById('tenantPersistencePanel');
  if (persistence) persistence.after(panel);
  else view.querySelector('.page-header')?.after(panel);

  async function refresh() {
    const title = panel.querySelector('#tenantLifecycleTitle');
    const badge = panel.querySelector('#tenantLifecycleState');
    const summary = panel.querySelector('#tenantLifecycleSummary');
    const metrics = panel.querySelector('#tenantLifecycleMetrics');
    const next = panel.querySelector('#tenantLifecycleNext');
    try {
      const payload = await fetchLifecycle(fetchImpl);
      const derived = deriveTenantLifecycleView(payload);
      panel.dataset.tone = derived.tone;
      title.textContent = derived.title;
      badge.textContent = payload?.lifecycle?.recovery?.operational ? 'Reviewed' : 'Prepared · disabled';
      badge.className = `tag ${payload?.lifecycle?.recovery?.operational ? 'live' : 'planned'}`;
      summary.textContent = derived.summary;
      metrics.replaceChildren(
        metric(documentRef, 'Rehearsal stages', derived.metrics.rehearsal),
        metric(documentRef, 'Backup mode', derived.metrics.backup),
        metric(documentRef, 'Restore mode', derived.metrics.restore),
        metric(documentRef, 'Isolation cases', derived.metrics.isolation),
        metric(documentRef, 'Deletion mode', derived.metrics.deletion),
        metric(documentRef, 'Emergency stop', derived.metrics.emergencyStop)
      );
      next.textContent = derived.nextGate;
    } catch (error) {
      panel.dataset.tone = 'warning';
      title.textContent = 'Tenant lifecycle status unavailable';
      badge.textContent = 'Unavailable';
      summary.textContent = error?.message || 'Lifecycle readiness could not be loaded.';
      metrics.replaceChildren();
      next.textContent = 'Do not execute migration 0009 or enable tenant operations until this endpoint and Build 019 CI are healthy.';
    }
  }

  refresh();
}

if (globalThis.document) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => renderTenantLifecycle(), { once: true });
  else renderTenantLifecycle();
}

export const __test = { ensureStylesheet, fetchLifecycle, metric };
