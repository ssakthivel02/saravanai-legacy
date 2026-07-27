import './profile-bootstrap.js';
import './voice-input.js';

function setText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}

if (globalThis.document) {
  setText('.sidebar-section .eyebrow', 'Owner build 013');
  setText('.sidebar-section .muted.small', 'Free-first verified-profile build. Browser voice input, local projects, artifacts, approvals, memory and usage controls are available without public registration.');
  setText('.profile-card strong', 'SakthiAI verified workspace');
  setText('.profile-card small', 'Private access · individual profile');
  setText('.footer span:last-child', 'Verified profiles and voice input · v0.13.0');
  setText('#view-roadmap .page-header .tag', 'Identity and voice ready');
  setText('#view-overview .section-heading h2', 'Owner modules, verified profile isolation and browser voice input');
  setText('#view-overview .section-heading > .muted', 'Controlled invitations only · public signup disabled');
  setText('#view-overview .capability-card:nth-child(2) h3', 'Verified identity boundary');
  setText('#view-overview .capability-card:nth-child(2) p', 'Cloudflare Access JWT verification and separate browser profile namespaces are implemented; activation remains administrator-controlled.');
  setText('#view-overview .capability-card:nth-child(2) .tag', '012 isolated');
  setText('#view-access .page-header .eyebrow', 'Identity and access');
  setText('#view-access .page-header h1', 'Verified profiles prepared; controlled team access next.');
  setText('#view-access .owner-security-grid article:nth-child(1) strong', 'Current mode');
  setText('#view-access .owner-security-grid article:nth-child(1) small', 'Existing local-owner data is preserved. Verified identities receive separate browser data and privacy-lock namespaces.');
  setText('#view-access .owner-security-grid article:nth-child(2) strong', 'Identity foundation');
  setText('#view-access .owner-security-grid article:nth-child(2) small', 'Cloudflare Access JWT signature, issuer, audience and exact-email checks are implemented with owner and member roles.');
  setText('#view-access .owner-security-grid article:nth-child(3) strong', 'Team launch gate');
  setText('#view-access .owner-security-grid article:nth-child(3) small', 'Configure Google or email OTP, exact-email policies and Access variables before admitting invited users. Cross-device server profiles remain a later gate.');
  setText('#view-roadmap .timeline-item:nth-child(3) .eyebrow', 'Completed foundation');
  setText('#view-roadmap .timeline-item:nth-child(3) h2', 'Projects, profiles, artifacts, approvals, memory, usage and voice input');
  setText('#view-roadmap .timeline-item:nth-child(3) p', 'Functional local-first modules now include cryptographically verified identity readiness and separate browser profile namespaces.');
  setText('#view-roadmap .timeline-item:nth-child(3) b', 'Deployed');
}
