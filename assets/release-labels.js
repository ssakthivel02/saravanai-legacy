import './profile-bootstrap.js';
import './voice-input.js';
import './access-readiness.js';
import './access-role-policy.js';
import './access-authorisation.js';
import './tenant-persistence.js';

function setText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}

if (globalThis.document) {
  setText('.sidebar-section .eyebrow', 'Owner build 018');
  setText('.sidebar-section .muted.small', 'Free-first tenant-persistence foundation. Verified tenant context, encrypted-record contracts, quota and retention controls are prepared while migration, shared reads, server writes and billing remain disabled.');
  setText('.profile-card strong', 'SakthiAI verified workspace');
  setText('.profile-card small', 'Private access · tenant storage prepared');
  setText('.footer span:last-child', 'Tenant persistence foundation · v0.18.0');
  setText('#view-roadmap .page-header .tag', 'Tenant storage prepared');
  setText('#view-overview .section-heading h2', 'Owner modules, verified profiles, voice, evidence research, role policy, endpoint authorisation and tenant storage readiness');
  setText('#view-overview .section-heading > .muted', 'Owner-only pilot first · migration and server operations disabled');
  setText('#view-overview .capability-card:nth-child(2) h3', 'Verified tenant data boundary');
  setText('#view-overview .capability-card:nth-child(2) p', 'SakthiAI now derives a pseudonymous tenant partition from verified identity and validates encrypted record, quota, retention and migration contracts without enabling production storage.');
  setText('#view-overview .capability-card:nth-child(2) .tag', '018 storage ready');
  setText('#view-research .page-header .tag', 'Evidence resolver v0.14');
  setText('#view-research .source-card:nth-child(2) small', 'Wikidata current-office resolution, GDELT and Wikipedia discovery run without commercial search billing.');
  setText('#view-access .page-header .eyebrow', 'Identity, roles, endpoint authorisation and tenant persistence');
  setText('#view-access .page-header h1', 'Verify one owner, enforce every route, then activate storage through controlled gates.');
  setText('#view-access .owner-security-grid article:nth-child(1) strong', 'Current data mode');
  setText('#view-access .owner-security-grid article:nth-child(1) small', 'Browser-local owner data remains primary. Shared tenant persistence is prepared but inactive until every identity, schema and authorisation gate passes.');
  setText('#view-access .owner-security-grid article:nth-child(2) strong', 'Tenant isolation foundation');
  setText('#view-access .owner-security-grid article:nth-child(2) small', 'Tenant identifiers are derived server-side from verified pseudonymous profile context. Browser-supplied tenant identifiers and identity-field persistence are prohibited.');
  setText('#view-access .owner-security-grid article:nth-child(3) strong', 'Migration and write boundary');
  setText('#view-access .owner-security-grid article:nth-child(3) small', 'Migration 0009 is manual. D1 reads, writes, deletion, hard quotas and shared profiles remain separately gated and disabled by default.');
  setText('#view-roadmap .timeline-item:nth-child(3) .eyebrow', 'Completed foundation');
  setText('#view-roadmap .timeline-item:nth-child(3) h2', 'Verified profiles, endpoint policy and tenant-isolated storage design');
  setText('#view-roadmap .timeline-item:nth-child(3) p', 'The owner workspace exposes safe storage readiness without executing migration, persisting identity data, enabling cross-device sharing or activating paid services.');
  setText('#view-roadmap .timeline-item:nth-child(3) b', 'Deployed foundation');
  setText('#view-roadmap .timeline-item:nth-child(4) .eyebrow', 'Controlled next step');
  setText('#view-roadmap .timeline-item:nth-child(4) h2', 'Owner Access pilot, endpoint enforcement and non-production migration rehearsal');
  setText('#view-roadmap .timeline-item:nth-child(4) p', 'Verify the exact owner Gmail policy and Worker JWT, test default-deny endpoint authorisation, then rehearse migration 0009 against a non-production D1 database with backup and rollback evidence.');
  setText('#view-roadmap .timeline-item:nth-child(4) b', 'Manual activation');

  const status = document.getElementById('platformStatus');
  const refreshPlatformRelease = () => {
    if (!status || !/router online/i.test(status.textContent || '') || /0\.18\.0/.test(status.textContent || '')) return;
    status.innerHTML = '<span class="status-dot"></span> Release 0.18.0-tenant-persistence-foundation · router online';
  };
  if (status) {
    new MutationObserver(refreshPlatformRelease).observe(status, { childList: true, subtree: true, characterData: true });
    refreshPlatformRelease();
  }
}