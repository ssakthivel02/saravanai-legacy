import './profile-bootstrap.js';
import './voice-input.js';
import './access-readiness.js';
import './access-role-policy.js';
import './access-authorisation.js';
import './tenant-persistence.js';
import './tenant-lifecycle.js';

function setText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}

if (globalThis.document) {
  setText('.sidebar-section .eyebrow', 'Owner build 019');
  setText('.sidebar-section .muted.small', 'Free-first tenant lifecycle assurance. Migration rehearsal, backup, restore, isolation and deletion evidence contracts are prepared while all production storage actions and paid recovery remain disabled.');
  setText('.profile-card strong', 'SakthiAI verified workspace');
  setText('.profile-card small', 'Private access · lifecycle assurance prepared');
  setText('.footer span:last-child', 'Tenant lifecycle assurance · v0.19.0');
  setText('#view-roadmap .page-header .tag', 'Lifecycle evidence prepared');
  setText('#view-overview .section-heading h2', 'Owner workspace, verified profiles, endpoint policy, tenant persistence and lifecycle assurance');
  setText('#view-overview .section-heading > .muted', 'Non-production evidence only · production storage actions prohibited');
  setText('#view-overview .capability-card:nth-child(2) h3', 'Tenant lifecycle evidence boundary');
  setText('#view-overview .capability-card:nth-child(2) p', 'SakthiAI validates migration rehearsal, backup, restore, isolation and deletion evidence without executing migrations, writes, restores or destructive actions.');
  setText('#view-overview .capability-card:nth-child(2) .tag', '019 assurance ready');
  setText('#view-research .page-header .tag', 'Evidence resolver v0.14');
  setText('#view-research .source-card:nth-child(2) small', 'Wikidata current-office resolution, GDELT and Wikipedia discovery run without commercial search billing.');
  setText('#view-access .page-header .eyebrow', 'Identity, endpoint authorisation, tenant persistence and lifecycle assurance');
  setText('#view-access .page-header h1', 'Verify one owner, prove tenant isolation, then review non-production recovery evidence.');
  setText('#view-access .owner-security-grid article:nth-child(1) strong', 'Current data mode');
  setText('#view-access .owner-security-grid article:nth-child(1) small', 'Browser-local owner data remains primary. D1 tenant storage, lifecycle operations and cross-device sharing remain inactive.');
  setText('#view-access .owner-security-grid article:nth-child(2) strong', 'Lifecycle assurance foundation');
  setText('#view-access .owner-security-grid article:nth-child(2) small', 'Nine rehearsal stages, eight isolation cases, backup integrity, restore integrity, legal-hold and deletion evidence are required before owner review.');
  setText('#view-access .owner-security-grid article:nth-child(3) strong', 'Production action boundary');
  setText('#view-access .owner-security-grid article:nth-child(3) small', 'Migrations 0009 and 0010 remain manual. Backup, restore, hard deletion, server writes, public registration and paid recovery remain disabled.');
  setText('#view-roadmap .timeline-item:nth-child(3) .eyebrow', 'Completed foundation');
  setText('#view-roadmap .timeline-item:nth-child(3) h2', 'Verified identity, endpoint policy, tenant storage and lifecycle evidence contracts');
  setText('#view-roadmap .timeline-item:nth-child(3) p', 'The owner workspace now exposes migration, backup, restore, isolation and deletion readiness without claiming that production recovery or persistence is active.');
  setText('#view-roadmap .timeline-item:nth-child(3) b', 'Deployed foundation');
  setText('#view-roadmap .timeline-item:nth-child(4) .eyebrow', 'Controlled next step');
  setText('#view-roadmap .timeline-item:nth-child(4) h2', 'Owner Access pilot and non-production D1 rehearsal');
  setText('#view-roadmap .timeline-item:nth-child(4) p', 'Complete the exact-email owner Access pilot, prove default-deny endpoint authorisation, then execute the documented rehearsal only against a disposable non-production D1 database.');
  setText('#view-roadmap .timeline-item:nth-child(4) b', 'Manual evidence required');

  const status = document.getElementById('platformStatus');
  const refreshPlatformRelease = () => {
    if (!status || !/router online/i.test(status.textContent || '') || /0\.19\.0/.test(status.textContent || '')) return;
    status.innerHTML = '<span class="status-dot"></span> Release 0.19.0-tenant-lifecycle-assurance · router online';
  };
  if (status) {
    new MutationObserver(refreshPlatformRelease).observe(status, { childList: true, subtree: true, characterData: true });
    refreshPlatformRelease();
  }
}
