if (globalThis.document) {
  const ownerBuild = document.querySelector('.sidebar-section .eyebrow');
  if (ownerBuild) ownerBuild.textContent = 'Owner build 011';
  const footer = document.querySelector('.footer span:last-child');
  if (footer) footer.textContent = 'Free-first owner security · v0.11.0';
  const roadmapBadge = document.querySelector('#view-roadmap .page-header .tag');
  if (roadmapBadge) roadmapBadge.textContent = 'Owner security';
}
