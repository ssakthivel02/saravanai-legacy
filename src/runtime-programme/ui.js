function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
}

export function renderControlCentre(summary) {
  const waveRows = summary.waves.map((wave) => `
    <tr>
      <td>${wave.number}</td>
      <td>${escapeHtml(wave.title)}</td>
      <td>${escapeHtml(wave.group)}</td>
      <td>${wave.enabled ? 'Enabled' : 'Disabled'}</td>
      <td>${wave.emergencyStopped ? 'Stopped' : 'Released'}</td>
      <td>${wave.operational ? 'Operational' : 'Non-operational'}</td>
    </tr>`).join('');
  const groupCards = summary.groups.map((group) => `
    <article>
      <h2>${escapeHtml(group.label)}</h2>
      <p>Waves ${group.firstWave}–${group.lastWave}</p>
      <dl>
        <div><dt>Total</dt><dd>${group.waveCount}</dd></div>
        <div><dt>Enabled</dt><dd>${group.enabledCount}</dd></div>
        <div><dt>Operational</dt><dd>${group.operationalCount}</dd></div>
      </dl>
    </article>`).join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>SakthiAI Runtime Programme Control Centre</title>
<style>
:root{color-scheme:dark;background:#07111f;color:#e8f0ff;font-family:Inter,ui-sans-serif,system-ui,sans-serif}
body{margin:0;padding:2rem;max-width:1500px;margin-inline:auto}
header{display:flex;justify-content:space-between;gap:2rem;align-items:flex-start;flex-wrap:wrap}
.badge{border:1px solid #4c668c;border-radius:999px;padding:.45rem .8rem;background:#10223a}
.summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:1rem;margin:1.5rem 0}
.summary div,article{background:#0d1c30;border:1px solid #263d5d;border-radius:14px;padding:1rem}
.summary strong{font-size:1.8rem;display:block}
section.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1rem}
dl div{display:flex;justify-content:space-between;border-top:1px solid #263d5d;padding:.45rem 0}
table{border-collapse:collapse;width:100%;font-size:.9rem;margin-top:1.5rem}
th,td{border:1px solid #263d5d;padding:.55rem;text-align:left}
th{position:sticky;top:0;background:#10223a}
.safe{color:#77e6a8}.attention{color:#ffcf70}
small{color:#9db0ca}
</style>
</head>
<body>
<header>
  <div>
    <h1>SakthiAI Runtime Programme 1–50</h1>
    <p>Private-owner, read-only control centre. No values, secrets or submitted evidence are displayed.</p>
  </div>
  <span class="badge ${summary.safety.status === 'safe-by-default' ? 'safe' : 'attention'}">${escapeHtml(summary.safety.status)}</span>
</header>
<div class="summary">
  <div><span>Total waves</span><strong>${summary.totalWaves}</strong></div>
  <div><span>Disabled</span><strong>${summary.state.disabledCount}</strong></div>
  <div><span>Emergency stopped</span><strong>${summary.state.emergencyStoppedCount}</strong></div>
  <div><span>Operational</span><strong>${summary.state.operationalCount}</strong></div>
</div>
<section class="cards">${groupCards}</section>
<h2>Wave state matrix</h2>
<table>
<thead><tr><th>Wave</th><th>Control area</th><th>Programme</th><th>Enable state</th><th>Emergency state</th><th>Runtime state</th></tr></thead>
<tbody>${waveRows}</tbody>
</table>
<p><small>Release ${escapeHtml(summary.release)}. This page performs no external calls, database writes, provider invocation, billing action or deployment action.</small></p>
</body>
</html>`;
}
