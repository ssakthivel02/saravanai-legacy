export function deriveRolePolicyView(payload = {}) {
  const policy = payload?.accessPolicy && typeof payload.accessPolicy === 'object' ? payload.accessPolicy : {};
  const activation = policy.activation && typeof policy.activation === 'object' ? policy.activation : {};
  const counts = policy.configuredProfileCounts && typeof policy.configuredProfileCounts === 'object'
    ? policy.configuredProfileCounts
    : { owner: 0, member: 0, reader: 0 };
  const validation = policy.validation && typeof policy.validation === 'object' ? policy.validation : {};
  const current = payload?.currentSession && typeof payload.currentSession === 'object' ? payload.currentSession : {};

  const valid = policy.valid === true;
  const ownerReady = counts.owner === 1;
  const teamEnabled = activation.teamProfilesEnabled === true;
  const readerEnabled = activation.readerProfilesEnabled === true;
  const verified = current.cryptographicallyVerified === true;

  return {
    tone: valid && ownerReady ? 'ready' : 'warning',
    title: valid && ownerReady ? 'Owner-first role policy prepared' : 'Role policy requires correction',
    summary: valid
      ? `Exact-email policy is valid. ${verified ? `The current ${current.role || 'profile'} session is cryptographically verified.` : 'The production owner session is not yet cryptographically verified.'}`
      : 'The role policy is fail-closed because the owner address, configured email entries or role assignments are invalid.',
    metrics: {
      owner: ownerReady ? '1 configured' : 'Missing',
      member: `${Number(counts.member || 0)} configured · ${teamEnabled ? 'profile gate enabled' : 'disabled by default'}`,
      reader: `${Number(counts.reader || 0)} configured · ${readerEnabled ? 'reader gate enabled' : 'disabled by default'}`,
      invitations: activation.invitationRequestsActive ? 'Active' : 'Disabled',
      persistence: activation.sharedPersistenceEnabled ? 'Shared server storage active' : 'Browser-local only',
      validation: `${Number(validation.invalidEntryCount || 0)} invalid · ${Number(validation.roleConflictCount || 0)} conflicts`
    },
    nextGate: typeof policy.nextGate === 'string' && policy.nextGate
      ? policy.nextGate
      : 'Complete the owner-only Access pilot before enabling team profiles.'
  };
}

function ensureStylesheet(documentRef) {
  if (documentRef.querySelector('link[href="/assets/access-role-policy.css"]')) return;
  const link = documentRef.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/assets/access-role-policy.css';
  documentRef.head.append(link);
}

function metric(documentRef, label, value) {
  const item = documentRef.createElement('article');
  item.className = 'access-role-metric';
  const small = documentRef.createElement('span');
  small.textContent = label;
  const strong = documentRef.createElement('strong');
  strong.textContent = value;
  item.append(small, strong);
  return item;
}

function roleCard(documentRef, role, activation, capabilities = {}) {
  const card = documentRef.createElement('article');
  card.className = 'access-role-card';
  const heading = documentRef.createElement('div');
  heading.className = 'access-role-card-heading';
  const title = documentRef.createElement('h3');
  title.textContent = role[0].toUpperCase() + role.slice(1);
  const badge = documentRef.createElement('span');
  badge.textContent = activation || 'disabled';
  heading.append(title, badge);
  const list = documentRef.createElement('dl');
  for (const [name, value] of Object.entries(capabilities)) {
    const row = documentRef.createElement('div');
    const key = documentRef.createElement('dt');
    key.textContent = name.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());
    const result = documentRef.createElement('dd');
    result.textContent = String(value).replaceAll('-', ' ');
    row.append(key, result);
    list.append(row);
  }
  card.append(heading, list);
  return card;
}

async function fetchRolePolicy(fetchImpl) {
  const response = await fetchImpl('/api/v1/platform/access/readiness', {
    method: 'GET',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: { Accept: 'application/json' }
  });
  if (!response.ok) throw new Error(`Access role policy returned ${response.status}`);
  return response.json();
}

function renderRolePolicy(documentRef = globalThis.document, fetchImpl = globalThis.fetch) {
  const accessView = documentRef?.getElementById('view-access');
  const readiness = documentRef?.getElementById('accessReadinessPanel');
  if (!accessView || documentRef.getElementById('accessRolePolicyPanel')) return;
  ensureStylesheet(documentRef);

  const panel = documentRef.createElement('section');
  panel.id = 'accessRolePolicyPanel';
  panel.className = 'panel access-role-policy-panel';
  panel.setAttribute('aria-live', 'polite');
  panel.innerHTML = `
    <div class="panel-heading">
      <div><p class="eyebrow">Owner Build 016</p><h2 id="accessRolePolicyTitle">Checking role policy…</h2></div>
      <span id="accessRolePolicyState" class="tag planned">Fail-closed</span>
    </div>
    <p id="accessRolePolicySummary" class="muted">Reading exact-email role configuration without exposing addresses.</p>
    <div id="accessRolePolicyMetrics" class="access-role-metrics"></div>
    <div id="accessRoleCards" class="access-role-cards"></div>
    <div class="owner-callout warning"><strong>Controlled invitation boundary</strong><p id="accessRolePolicyNext" class="muted">Owner-only activation remains the next manual gate.</p></div>`;

  if (readiness) readiness.after(panel);
  else accessView.querySelector('.page-header')?.after(panel);

  async function refresh() {
    const title = panel.querySelector('#accessRolePolicyTitle');
    const state = panel.querySelector('#accessRolePolicyState');
    const summary = panel.querySelector('#accessRolePolicySummary');
    const metrics = panel.querySelector('#accessRolePolicyMetrics');
    const cards = panel.querySelector('#accessRoleCards');
    const next = panel.querySelector('#accessRolePolicyNext');
    try {
      const payload = await fetchRolePolicy(fetchImpl);
      const view = deriveRolePolicyView(payload);
      panel.dataset.tone = view.tone;
      title.textContent = view.title;
      state.textContent = payload?.accessPolicy?.valid ? 'Policy valid' : 'Blocked';
      state.className = `tag ${payload?.accessPolicy?.valid ? 'live' : 'planned'}`;
      summary.textContent = view.summary;
      metrics.replaceChildren(
        metric(documentRef, 'Owner profile', view.metrics.owner),
        metric(documentRef, 'Member profiles', view.metrics.member),
        metric(documentRef, 'Reader profiles', view.metrics.reader),
        metric(documentRef, 'Invitation requests', view.metrics.invitations),
        metric(documentRef, 'Shared persistence', view.metrics.persistence),
        metric(documentRef, 'Policy validation', view.metrics.validation)
      );
      const roles = payload?.accessPolicy?.roles || {};
      cards.replaceChildren(
        roleCard(documentRef, 'owner', roles.owner?.activation, roles.owner?.capabilities),
        roleCard(documentRef, 'member', roles.member?.activation, roles.member?.capabilities),
        roleCard(documentRef, 'reader', roles.reader?.activation, roles.reader?.capabilities)
      );
      next.textContent = view.nextGate;
    } catch (error) {
      panel.dataset.tone = 'warning';
      title.textContent = 'Role policy status unavailable';
      state.textContent = 'Do not activate';
      state.className = 'tag planned';
      summary.textContent = error?.message || 'The role policy endpoint could not be read.';
      metrics.replaceChildren();
      cards.replaceChildren();
      next.textContent = 'Keep team, reader and invitation variables absent until this endpoint is healthy.';
    }
  }

  refresh();
}

if (globalThis.document) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => renderRolePolicy(), { once: true });
  else renderRolePolicy();
}

export const __test = { ensureStylesheet, fetchRolePolicy, metric, renderRolePolicy, roleCard };
