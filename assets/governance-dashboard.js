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

if (doc) renderGovernanceProgramme();
