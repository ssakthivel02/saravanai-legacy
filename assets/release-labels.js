import './profile-bootstrap.js';
import './voice-input.js';
import './access-readiness.js';
import './access-role-policy.js';
import './access-authorisation.js';

function setText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}

if (globalThis.document) {
  setText('.sidebar-section .eyebrow', 'Owner build 017');
  setText('.sidebar-section .muted.small', 'Free-first endpoint-authorisation build. Exact-email roles, default-deny route classification and safe denial contracts are prepared while production enforcement, shared writes and billing remain disabled.');
  setText('.profile-card strong', 'SakthiAI verified workspace');
  setText('.profile-card small', 'Private access · endpoint policy prepared');
  setText('.footer span:last-child', 'Endpoint authorisation foundation · v0.17.0');
  setText('#view-roadmap .page-header .tag', 'Endpoint policy prepared');
  setText('#view-overview .section-heading h2', 'Owner modules, verified profiles, continuous voice, evidence research, role policy and endpoint authorisation');
  setText('#view-overview .section-heading > .muted', 'Owner-only pilot first · route enforcement and server writes disabled');
  setText('#view-overview .capability-card:nth-child(2) h3', 'Least-privilege endpoint policy');
  setText('#view-overview .capability-card:nth-child(2) p', 'SakthiAI now classifies public, work, owner-only and server-mutation routes and can deny unknown routes after controlled activation.');
  setText('#view-overview .capability-card:nth-child(2) .tag', '017 default-deny ready');
  setText('#view-research .page-header .tag', 'Evidence resolver v0.14');
  setText('#view-research .source-card:nth-child(2) small', 'Wikidata current-office resolution, GDELT and Wikipedia discovery run without commercial search billing.');
  setText('#view-access .page-header .eyebrow', 'Identity, roles and endpoint authorisation');
  setText('#view-access .page-header h1', 'Verify one owner first; enforce every route only after controlled testing.');
  setText('#view-access .owner-security-grid article:nth-child(1) strong', 'Current data mode');
  setText('#view-access .owner-security-grid article:nth-child(1) small', 'Existing local-owner data is preserved. Verified identities receive separate browser data and privacy-lock namespaces.');
  setText('#view-access .owner-security-grid article:nth-child(2) strong', 'Endpoint authorisation foundation');
  setText('#view-access .owner-security-grid article:nth-child(2) small', 'Protected routes require verified internal identity headers when enforcement is activated. Unknown routes fail closed and server mutations have a separate gate.');
  setText('#view-access .owner-security-grid article:nth-child(3) strong', 'Activation boundary');
  setText('#view-access .owner-security-grid article:nth-child(3) small', 'JWT enforcement, endpoint authorisation, team profiles, reader access and server mutations remain separately controlled and disabled in repository defaults.');
  setText('#view-roadmap .timeline-item:nth-child(3) .eyebrow', 'Completed foundation');
  setText('#view-roadmap .timeline-item:nth-child(3) h2', 'Projects, profiles, artifacts, approvals, memory, usage, voice, research, roles and endpoint policy');
  setText('#view-roadmap .timeline-item:nth-child(3) p', 'The owner workspace now exposes safe role and route policy state without enabling public access, shared persistence, server mutation or paid fallback.');
  setText('#view-roadmap .timeline-item:nth-child(3) b', 'Deployed foundation');
  setText('#view-roadmap .timeline-item:nth-child(4) .eyebrow', 'Controlled next step');
  setText('#view-roadmap .timeline-item:nth-child(4) h2', 'Owner-only Access activation, then endpoint enforcement');
  setText('#view-roadmap .timeline-item:nth-child(4) p', 'Protect the whole hostname with the exact owner Gmail policy, verify Worker JWT enforcement, then test endpoint authorisation while keeping server mutations disabled.');
  setText('#view-roadmap .timeline-item:nth-child(4) b', 'Manual activation');

  const status = document.getElementById('platformStatus');
  const refreshPlatformRelease = () => {
    if (!status || !/router online/i.test(status.textContent || '') || /0\.17\.0/.test(status.textContent || '')) return;
    status.innerHTML = '<span class="status-dot"></span> Release 0.17.0-endpoint-authorisation · router online';
  };
  if (status) {
    new MutationObserver(refreshPlatformRelease).observe(status, { childList: true, subtree: true, characterData: true });
    refreshPlatformRelease();
  }
}
