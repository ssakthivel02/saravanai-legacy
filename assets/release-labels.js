import './profile-bootstrap.js';
import './voice-input.js';

if (globalThis.document) {
  const ownerBuild = document.querySelector('.sidebar-section .eyebrow');
  if (ownerBuild) ownerBuild.textContent = 'Owner build 013';
  const ownerSummary = document.querySelector('.sidebar-section .muted.small');
  if (ownerSummary) ownerSummary.textContent = 'Free-first verified-profile build. Browser voice input, local projects, artifacts, approvals, memory and usage controls are available without public registration.';
  const profileName = document.querySelector('.profile-card strong');
  if (profileName) profileName.textContent = 'SakthiAI verified workspace';
  const profileMode = document.querySelector('.profile-card small');
  if (profileMode) profileMode.textContent = 'Private access · individual profile';
  const footer = document.querySelector('.footer span:last-child');
  if (footer) footer.textContent = 'Verified profiles and voice input · v0.13.0';
  const roadmapBadge = document.querySelector('#view-roadmap .page-header .tag');
  if (roadmapBadge) roadmapBadge.textContent = 'Identity and voice ready';
}
