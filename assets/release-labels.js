import './profile-bootstrap.js';

if (globalThis.document) {
  const ownerBuild = document.querySelector('.sidebar-section .eyebrow');
  if (ownerBuild) ownerBuild.textContent = 'Owner build 012';
  const footer = document.querySelector('.footer span:last-child');
  if (footer) footer.textContent = 'Free-first verified profile isolation · v0.12.0';
  const roadmapBadge = document.querySelector('#view-roadmap .page-header .tag');
  if (roadmapBadge) roadmapBadge.textContent = 'Profile isolation ready';
}
