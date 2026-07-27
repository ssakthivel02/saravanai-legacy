import './profile-bootstrap.js';
import './voice-input.js';

function setText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}

if (globalThis.document) {
  setText('.sidebar-section .eyebrow', 'Owner build 014');
  setText('.sidebar-section .muted.small', 'Free-first verified-profile build. Google identity is validated; continuous browser voice, improved current-office research, local projects, artifacts, approvals, memory and usage controls are available without public registration.');
  setText('.profile-card strong', 'SakthiAI verified workspace');
  setText('.profile-card small', 'Private access · individual profile');
  setText('.footer span:last-child', 'Verified identity, continuous voice and evidence resolver · v0.14.0');
  setText('#view-roadmap .page-header .tag', 'Owner Access pilot ready');
  setText('#view-overview .section-heading h2', 'Owner modules, verified profile isolation, continuous voice and evidence-first research');
  setText('#view-overview .section-heading > .muted', 'Controlled invitations only · public signup disabled');
  setText('#view-overview .capability-card:nth-child(2) h3', 'Verified identity boundary');
  setText('#view-overview .capability-card:nth-child(2) p', 'Google identity through Cloudflare Access has been validated. Worker-side JWT verification and separate browser profile namespaces are ready for an exact-email owner pilot.');
  setText('#view-overview .capability-card:nth-child(2) .tag', '014 pilot-ready');
  setText('#view-research .page-header .tag', 'Evidence resolver v0.14');
  setText('#view-research .source-card:nth-child(2) small', 'Wikidata current-office resolution, GDELT and Wikipedia discovery run without commercial search billing.');
  setText('#view-access .page-header .eyebrow', 'Identity and access');
  setText('#view-access .page-header h1', 'Google identity validated; exact-email owner pilot is the next activation gate.');
  setText('#view-access .owner-security-grid article:nth-child(1) strong', 'Current mode');
  setText('#view-access .owner-security-grid article:nth-child(1) small', 'Existing local-owner data is preserved. Verified identities receive separate browser data and privacy-lock namespaces.');
  setText('#view-access .owner-security-grid article:nth-child(2) strong', 'Identity foundation');
  setText('#view-access .owner-security-grid article:nth-child(2) small', 'Cloudflare Access JWT signature, issuer, audience and exact-email checks are implemented. Google identity-provider connectivity is confirmed.');
  setText('#view-access .owner-security-grid article:nth-child(3) strong', 'Owner pilot gate');
  setText('#view-access .owner-security-grid article:nth-child(3) small', 'Create a whole-host Access application for only the owner email, copy its AUD into Worker settings, then enable JWT enforcement. Reader/member invitations remain blocked until server-side roles and shared persistence are implemented.');
  setText('#view-roadmap .timeline-item:nth-child(3) .eyebrow', 'Completed foundation');
  setText('#view-roadmap .timeline-item:nth-child(3) h2', 'Projects, profiles, artifacts, approvals, memory, usage, voice and identity readiness');
  setText('#view-roadmap .timeline-item:nth-child(3) p', 'Functional local-first modules now include cryptographically verified identity readiness, separate browser profile namespaces, continuous start/stop dictation and improved current-office research.');
  setText('#view-roadmap .timeline-item:nth-child(3) b', 'Deployed');
  setText('#view-roadmap .timeline-item:nth-child(4) .eyebrow', 'Controlled next step');
  setText('#view-roadmap .timeline-item:nth-child(4) h2', 'Owner-only Access pilot, then role-enforced teams');
  setText('#view-roadmap .timeline-item:nth-child(4) p', 'Protect the whole hostname with an exact-email Google policy. Add reader/member roles only after D1-backed shared data, server quotas and endpoint authorisation are validated.');
  setText('#view-roadmap .timeline-item:nth-child(4) b', 'Manual activation');

  const status = document.getElementById('platformStatus');
  const refreshPlatformRelease = () => {
    if (!status || !/router online/i.test(status.textContent || '') || /0\.14\.0/.test(status.textContent || '')) return;
    status.innerHTML = '<span class="status-dot"></span> Release 0.14.0-access-research-voice · router online';
  };
  if (status) {
    new MutationObserver(refreshPlatformRelease).observe(status, { childList: true, subtree: true, characterData: true });
    refreshPlatformRelease();
  }
}
