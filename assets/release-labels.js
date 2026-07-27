import './profile-bootstrap.js';
import './voice-input.js';
import './access-readiness.js';

function setText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}

if (globalThis.document) {
  setText('.sidebar-section .eyebrow', 'Owner build 015');
  setText('.sidebar-section .muted.small', 'Free-first access-readiness build. Live owner session, release, role, reader-access and quota status are visible alongside continuous browser voice, evidence-first research and local owner modules.');
  setText('.profile-card strong', 'SakthiAI verified workspace');
  setText('.profile-card small', 'Private access · live readiness status');
  setText('.footer span:last-child', 'Access readiness and unified release contract · v0.15.0');
  setText('#view-roadmap .page-header .tag', 'Access readiness visible');
  setText('#view-overview .section-heading h2', 'Owner modules, verified profile isolation, continuous voice, evidence research and live access readiness');
  setText('#view-overview .section-heading > .muted', 'Controlled invitations only · public signup disabled');
  setText('#view-overview .capability-card:nth-child(2) h3', 'Live identity boundary');
  setText('#view-overview .capability-card:nth-child(2) p', 'SakthiAI now reports the current JWT enforcement, profile role, release and invitation boundary directly from server contracts.');
  setText('#view-overview .capability-card:nth-child(2) .tag', '015 observable');
  setText('#view-research .page-header .tag', 'Evidence resolver v0.14');
  setText('#view-research .source-card:nth-child(2) small', 'Wikidata current-office resolution, GDELT and Wikipedia discovery run without commercial search billing.');
  setText('#view-access .page-header .eyebrow', 'Identity, access and release readiness');
  setText('#view-access .page-header h1', 'See exactly what is active before changing production login.');
  setText('#view-access .owner-security-grid article:nth-child(1) strong', 'Current data mode');
  setText('#view-access .owner-security-grid article:nth-child(1) small', 'Existing local-owner data is preserved. Verified identities receive separate browser data and privacy-lock namespaces.');
  setText('#view-access .owner-security-grid article:nth-child(2) strong', 'Identity foundation');
  setText('#view-access .owner-security-grid article:nth-child(2) small', 'Cloudflare Access JWT signature, issuer, audience and exact-email checks are implemented. The new live panel reports whether enforcement is actually active.');
  setText('#view-access .owner-security-grid article:nth-child(3) strong', 'Invitation boundary');
  setText('#view-access .owner-security-grid article:nth-child(3) small', 'Reader and member invitations remain disabled until D1-backed sharing and server-side RBAC are validated.');
  setText('#view-roadmap .timeline-item:nth-child(3) .eyebrow', 'Completed foundation');
  setText('#view-roadmap .timeline-item:nth-child(3) h2', 'Projects, profiles, artifacts, approvals, memory, usage, voice, research and readiness observability');
  setText('#view-roadmap .timeline-item:nth-child(3) p', 'The owner workspace now reports a unified platform release plus live authentication, profile, invitation and quota state without activating public access or billing.');
  setText('#view-roadmap .timeline-item:nth-child(3) b', 'Deployed foundation');
  setText('#view-roadmap .timeline-item:nth-child(4) .eyebrow', 'Controlled next step');
  setText('#view-roadmap .timeline-item:nth-child(4) h2', 'Owner-only Access activation, then server-enforced sharing');
  setText('#view-roadmap .timeline-item:nth-child(4) p', 'Protect the whole hostname with an exact-email Google policy. Add reader/member roles only after D1-backed shared data, server quotas and endpoint authorisation are validated.');
  setText('#view-roadmap .timeline-item:nth-child(4) b', 'Manual activation');

  const status = document.getElementById('platformStatus');
  const refreshPlatformRelease = () => {
    if (!status || !/router online/i.test(status.textContent || '') || /0\.15\.0/.test(status.textContent || '')) return;
    status.innerHTML = '<span class="status-dot"></span> Release 0.15.0-access-readiness · router online';
  };
  if (status) {
    new MutationObserver(refreshPlatformRelease).observe(status, { childList: true, subtree: true, characterData: true });
    refreshPlatformRelease();
  }
}
