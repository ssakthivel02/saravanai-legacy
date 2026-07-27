import './profile-bootstrap.js';
import './voice-input.js';
import './access-readiness.js';
import './access-role-policy.js';

function setText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}

if (globalThis.document) {
  setText('.sidebar-section .eyebrow', 'Owner build 016');
  setText('.sidebar-section .muted.small', 'Free-first owner-first role-policy build. Exact-email owner, member and reader contracts are visible, fail-closed and disabled for team use until server RBAC and shared persistence are validated.');
  setText('.profile-card strong', 'SakthiAI verified workspace');
  setText('.profile-card small', 'Private access · owner-first role policy');
  setText('.footer span:last-child', 'Owner-first role policy and access readiness · v0.16.0');
  setText('#view-roadmap .page-header .tag', 'Role policy visible');
  setText('#view-overview .section-heading h2', 'Owner modules, verified profile isolation, continuous voice, evidence research and fail-closed access roles');
  setText('#view-overview .section-heading > .muted', 'Owner-only pilot first · team profiles disabled');
  setText('#view-overview .capability-card:nth-child(2) h3', 'Owner-first identity policy');
  setText('#view-overview .capability-card:nth-child(2) p', 'SakthiAI now validates exact-email owner, member and reader role configuration and refuses non-owner profiles unless the separate team gate is explicitly enabled later.');
  setText('#view-overview .capability-card:nth-child(2) .tag', '016 fail-closed');
  setText('#view-research .page-header .tag', 'Evidence resolver v0.14');
  setText('#view-research .source-card:nth-child(2) small', 'Wikidata current-office resolution, GDELT and Wikipedia discovery run without commercial search billing.');
  setText('#view-access .page-header .eyebrow', 'Identity, roles and access readiness');
  setText('#view-access .page-header h1', 'Activate one verified owner first; prepare team roles without exposing data.');
  setText('#view-access .owner-security-grid article:nth-child(1) strong', 'Current data mode');
  setText('#view-access .owner-security-grid article:nth-child(1) small', 'Existing local-owner data is preserved. Verified identities receive separate browser data and privacy-lock namespaces.');
  setText('#view-access .owner-security-grid article:nth-child(2) strong', 'Role-policy foundation');
  setText('#view-access .owner-security-grid article:nth-child(2) small', 'Exact owner, member and reader email lists are validated without displaying addresses. Invalid or conflicting assignments fail closed.');
  setText('#view-access .owner-security-grid article:nth-child(3) strong', 'Invitation boundary');
  setText('#view-access .owner-security-grid article:nth-child(3) small', 'Non-owner profiles, reader access and invitation requests remain disabled until D1-backed sharing, endpoint RBAC and server quotas pass validation.');
  setText('#view-roadmap .timeline-item:nth-child(3) .eyebrow', 'Completed foundation');
  setText('#view-roadmap .timeline-item:nth-child(3) h2', 'Projects, profiles, artifacts, approvals, memory, usage, voice, research, readiness and exact role policy');
  setText('#view-roadmap .timeline-item:nth-child(3) p', 'The owner workspace now exposes a safe role matrix and fail-closed configuration status while preserving browser-local isolation and zero-cost operation.');
  setText('#view-roadmap .timeline-item:nth-child(3) b', 'Deployed foundation');
  setText('#view-roadmap .timeline-item:nth-child(4) .eyebrow', 'Controlled next step');
  setText('#view-roadmap .timeline-item:nth-child(4) h2', 'Owner-only Access activation, then server-authorised teams');
  setText('#view-roadmap .timeline-item:nth-child(4) p', 'Protect the whole hostname with the exact owner Gmail policy. Keep team and reader variables absent until D1 tenant persistence, endpoint authorisation and hard quotas are validated.');
  setText('#view-roadmap .timeline-item:nth-child(4) b', 'Manual activation');

  const status = document.getElementById('platformStatus');
  const refreshPlatformRelease = () => {
    if (!status || !/router online/i.test(status.textContent || '') || /0\.16\.0/.test(status.textContent || '')) return;
    status.innerHTML = '<span class="status-dot"></span> Release 0.16.0-role-policy · router online';
  };
  if (status) {
    new MutationObserver(refreshPlatformRelease).observe(status, { childList: true, subtree: true, characterData: true });
    refreshPlatformRelease();
  }
}
