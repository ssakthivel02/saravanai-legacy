const doc = globalThis.document;

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function ensureStylesheet() {
  if (!doc || doc.querySelector('link[href="/assets/governance-dashboard.css"]')) return;
  const link = doc.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/assets/governance-dashboard.css';
  doc.head.append(link);
}

function releaseCard(item) {
  return `<article class="governance-release-card"><span>${escapeHtml(item.id)}</span><div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.status)}</small></div><b>${item.publicEnabled ? 'Public' : 'Gated'}</b></article>`;
}

function pillarCard(item) {
  return `<article class="governance-pillar-card"><strong>${escapeHtml(item.title)}</strong><div>${item.controls.map((control) => `<span>${escapeHtml(control)}</span>`).join('')}</div></article>`;
}

function dashboardPriorityCard(item) {
  return `<article class="master-priority-card">
    <span class="master-rank">${escapeHtml(item.rank)}</span>
    <div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.id)} · ${escapeHtml(item.status)}</small></div>
    <b>${escapeHtml(item.lane)}</b>
  </article>`;
}

function dashboardDecisionCard(item) {
  return `<article class="master-decision-card">
    <div class="master-card-heading"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.status)}</span></div>
    <p>${escapeHtml(item.decision)}</p>
    <small>${escapeHtml(item.rationale)}</small>
  </article>`;
}

function radarCard(item) {
  return `<article class="innovation-card">
    <div class="master-card-heading"><strong>${escapeHtml(item.vendor)}</strong><span>${escapeHtml(item.region)}</span></div>
    <h4>${escapeHtml(item.technology)}</h4>
    <p>${escapeHtml(item.whatSakthiAILearns)}</p>
    <div class="innovation-meta"><span>${escapeHtml(item.priority)}</span><span>${escapeHtml(item.lane)}</span><span>${escapeHtml(item.action)}</span></div>
    <details><summary>Risk & evidence</summary><p>${escapeHtml(item.risk)}</p><a href="${escapeHtml(item.source)}" target="_blank" rel="noopener noreferrer">Official/source reference</a><small>Checked ${escapeHtml(item.sourceChecked)}</small></details>
  </article>`;
}

async function renderMasterDashboard() {
  const view = doc?.getElementById('view-governance');
  if (!view || doc.getElementById('sakthiMasterDashboard')) return;
  ensureStylesheet();

  const section = doc.createElement('section');
  section.id = 'sakthiMasterDashboard';
  section.className = 'master-dashboard panel';
  section.innerHTML = '<p class="eyebrow">SakthiAI Master Dashboard</p><h2>Loading design memory and innovation radar…</h2>';
  view.prepend(section);

  try {
    const response = await fetch('/assets/data/master-dashboard.v1.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Master dashboard data failed (${response.status})`);
    const data = await response.json();
    const programme = data.currentProgramme || {};
    const northStar = data.northStar || {};
    const decisions = Array.isArray(data.decisions) ? data.decisions : [];
    const priorities = Array.isArray(data.priorityBuilds) ? data.priorityBuilds : [];
    const radar = Array.isArray(data.innovationRadar) ? data.innovationRadar : [];
    const gates = Array.isArray(data.graduationGates) ? data.graduationGates : [];

    const ownerCount = priorities.filter((item) => item.lane === 'ownerPilot').length;
    const watchCount = radar.filter((item) => item.lane === 'watch').length;
    const adoptCount = radar.filter((item) => item.lane === 'ownerPilot').length;

    section.innerHTML = `
      <div class="panel-heading">
        <div><p class="eyebrow">Canonical design memory · ${escapeHtml(data.updatedAt)}</p><h2>SakthiAI Master Dashboard & Global Innovation Radar</h2></div>
        <span class="tag live">${escapeHtml(programme.programme || 'SAI master')}</span>
      </div>
      <div class="master-trust-banner">
        <strong>${escapeHtml(northStar.goal || 'Build a benchmark-proven AI platform.')}</strong>
        <p>${escapeHtml(northStar.strategy || '')}</p>
      </div>
      <div class="master-metrics">
        <article><span>Owner-pilot priorities</span><strong>${ownerCount}</strong><small>Private first, public only after graduation gates</small></article>
        <article><span>Innovation signals</span><strong>${radar.length}</strong><small>Global technologies under active review</small></article>
        <article><span>Adapt / pilot</span><strong>${adoptCount}</strong><small>High-value ideas selected for SakthiAI evaluation</small></article>
        <article><span>Watch list</span><strong>${watchCount}</strong><small>Promising, but not yet committed</small></article>
      </div>
      <div class="master-boundary-grid">
        <article><span>Programme</span><strong>${escapeHtml(programme.programme || '—')}</strong><small>Issue #${escapeHtml(programme.issue || '—')} · PR #${escapeHtml(programme.pullRequest || '—')}</small></article>
        <article><span>Runtime activation</span><strong>${escapeHtml(programme.runtimeActivation || '—')}</strong><small>Architecture work does not imply production enablement.</small></article>
        <article><span>Conversation capture</span><strong>Distilled only</strong><small>No raw private chat, secrets or sensitive personal data in the public repository.</small></article>
      </div>
      <h3>Top implementation sequence</h3>
      <div class="master-priority-grid">${priorities.map(dashboardPriorityCard).join('')}</div>
      <h3>Decision register</h3>
      <div class="master-decision-grid">${decisions.map(dashboardDecisionCard).join('')}</div>
      <div class="master-radar-heading"><div><h3>Global AI innovation radar</h3><p class="muted">Market signals are inputs to architecture decisions, not a checklist to clone every competitor.</p></div><span>${radar.length} tracked</span></div>
      <div class="innovation-grid">${radar.map(radarCard).join('')}</div>
      <details class="governance-gates master-graduation"><summary>Owner-pilot → public graduation gates</summary><ol>${gates.map((gate) => `<li>${escapeHtml(gate)}</li>`).join('')}</ol></details>
      <div class="owner-callout warning"><strong>Dashboard capture policy</strong><p class="muted">${escapeHtml(data.capturePolicy?.purpose || '')} ${escapeHtml(data.capturePolicy?.captureRule || '')}</p></div>`;
  } catch (error) {
    section.innerHTML = `<p class="eyebrow">SakthiAI Master Dashboard</p><h2>Dashboard data unavailable</h2><p class="muted">${escapeHtml(error.message)}</p>`;
  }
}

async function renderGovernanceProgramme() {
  const view = doc?.getElementById('view-governance');
  if (!view || doc.getElementById('governanceProgramme')) return;
  ensureStylesheet();

  const section = doc.createElement('section');
  section.id = 'governanceProgramme';
  section.className = 'governance-programme panel';
  section.innerHTML = '<p class="eyebrow">Releases 012–020</p><h2>Loading governance programme…</h2>';
  view.append(section);

  try {
    const response = await fetch('/api/v1/governance', { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `Governance API failed (${response.status})`);

    section.innerHTML = `
      <div class="panel-heading"><div><p class="eyebrow">Releases 012–020</p><h2>Security, compliance and customer trust programme</h2></div><span class="tag live">${escapeHtml(data.release)}</span></div>
      <div class="governance-trust-strip">
        <span>Public registration <b>${data.publicRegistration ? 'Enabled' : 'Disabled'}</b></span>
        <span>Commercial providers <b>${data.commercialProvidersEnabled ? 'Enabled' : 'Disabled'}</b></span>
        <span>Certification claims <b>${data.certificationClaims ? 'Active' : 'None'}</b></span>
        <span>Tenant writes <b>${data.serverTenantWritesEnabled ? 'Enabled' : 'Gated'}</b></span>
      </div>
      <h3>Release train</h3>
      <div class="governance-release-grid">${data.releases.map(releaseCard).join('')}</div>
      <h3>Governance pillars</h3>
      <div class="governance-pillar-grid">${data.pillars.map(pillarCard).join('')}</div>
      <div class="owner-callout warning"><strong>Compliance boundary</strong><p class="muted">${escapeHtml(data.disclaimer)}</p></div>
      <details class="governance-gates"><summary>Mandatory production launch gates</summary><ol>${data.hardGates.map((gate) => `<li>${escapeHtml(gate)}</li>`).join('')}</ol></details>`;
  } catch (error) {
    section.innerHTML = `<p class="eyebrow">Releases 012–020</p><h2>Governance programme unavailable</h2><p class="muted">${escapeHtml(error.message)}</p>`;
  }
}

if (doc) {
  renderMasterDashboard();
  renderGovernanceProgramme();
}
