const views = [...document.querySelectorAll('[data-view]')];
const links = [...document.querySelectorAll('[data-route]')];
const sidebar = document.getElementById('sidebar');
const menuButton = document.getElementById('menuButton');
const themeButton = document.getElementById('themeButton');
const platformStatus = document.getElementById('platformStatus');
const gatewayLabel = document.getElementById('gatewayLabel');
const runtimeState = document.getElementById('runtimeState');
const runtimeValue = document.getElementById('runtimeValue');
const providerSelect = document.getElementById('providerSelect');
const taskType = document.getElementById('taskType');
const input = document.getElementById('promptInput');
const count = document.getElementById('characterCount');
const taskForm = document.getElementById('taskForm');
const runButton = document.getElementById('runButton');
const responsePanel = document.getElementById('responsePanel');
const responseBody = document.getElementById('responseBody');

function activate(route) {
  const target = views.some((view) => view.dataset.view === route) ? route : 'overview';
  views.forEach((view) => view.classList.toggle('active', view.dataset.view === target));
  links.forEach((link) => link.classList.toggle('active', link.dataset.route === target));
  sidebar?.classList.remove('open');
  document.getElementById('main-content')?.focus({ preventScroll: true });
}

function routeFromHash() {
  activate(location.hash.replace('#', '') || 'overview');
}

addEventListener('hashchange', routeFromHash);
routeFromHash();

menuButton?.addEventListener('click', () => {
  const open = sidebar?.classList.toggle('open') || false;
  menuButton.setAttribute('aria-expanded', String(open));
});

const storedTheme = localStorage.getItem('sakthiai-theme');
if (storedTheme === 'light') document.body.classList.add('light');
themeButton?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('sakthiai-theme', document.body.classList.contains('light') ? 'light' : 'dark');
});

input?.addEventListener('input', () => {
  if (count) count.textContent = `${input.value.length} / 8000`;
});

function setRuntimeState(online, message) {
  if (platformStatus) {
    platformStatus.classList.toggle('online', online);
    platformStatus.classList.toggle('offline', !online);
    platformStatus.innerHTML = `<span class="status-dot"></span> ${message}`;
  }
  if (gatewayLabel) gatewayLabel.textContent = online ? 'AI runtime online' : 'Runtime unavailable';
  if (runtimeState) runtimeState.textContent = online ? 'Online' : 'Unavailable';
  if (runtimeValue) runtimeValue.textContent = online ? 'Workers AI online' : 'Unavailable';
  if (runButton) runButton.disabled = !online;
}

function updateProviderChips(providers = []) {
  for (const chip of document.querySelectorAll('[data-provider]')) {
    const provider = providers.find((item) => item.id === chip.dataset.provider);
    const live = Boolean(provider?.live);
    chip.classList.toggle('live', live);
    chip.classList.toggle('pending', !live);
    chip.title = live ? 'Live' : 'Integration pending';
  }
}

async function loadRuntimeStatus() {
  try {
    const response = await fetch('/api/v1/status', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    setRuntimeState(Boolean(data.aiRuntime), data.aiRuntime ? 'Release 002 · AI online' : 'AI binding pending');
    updateProviderChips(data.providers);
  } catch (error) {
    console.error('Runtime status check failed', error);
    setRuntimeState(false, 'AI runtime unavailable');
    updateProviderChips([]);
  }
}

function setResponseState({ loading = false, error = false, text = '' } = {}) {
  if (!responsePanel || !responseBody) return;
  responsePanel.hidden = false;
  responseBody.classList.toggle('loading', loading);
  responseBody.classList.toggle('error', error);
  responseBody.textContent = text;
  responsePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateExecutionPreview() {
  const mode = taskType?.selectedOptions?.[0]?.textContent || 'Automatic';
  const provider = providerSelect?.selectedOptions?.[0]?.textContent || 'Automatic';
  const sensitive = /password|secret|credential|private key|medical|personal|phone|email/i.test(input?.value || '');
  const decisionTitle = document.getElementById('decisionTitle');
  const decisionText = document.getElementById('decisionText');
  const laneValue = document.getElementById('laneValue');
  const verifyValue = document.getElementById('verifyValue');
  if (decisionTitle) decisionTitle.textContent = sensitive ? 'Sensitive task detected' : `${mode} task ready`;
  if (decisionText) decisionText.textContent = sensitive
    ? 'Do not submit passwords, private keys, confidential credentials or unnecessary personal data. Use redacted content.'
    : `The request will run server-side through ${provider}.`;
  if (laneValue) laneValue.textContent = provider;
  if (verifyValue) verifyValue.textContent = mode === 'Research' ? 'Evidence limitations required' : 'Limitations disclosed';
}

input?.addEventListener('input', updateExecutionPreview);
taskType?.addEventListener('change', updateExecutionPreview);
providerSelect?.addEventListener('change', updateExecutionPreview);

for (const modeLink of document.querySelectorAll('[data-mode-link]')) {
  modeLink.addEventListener('click', () => {
    const mode = modeLink.dataset.modeLink;
    if (taskType && mode) taskType.value = mode;
    setTimeout(() => input?.focus(), 50);
  });
}

taskForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const prompt = (input?.value || '').trim();
  if (!prompt) {
    input?.focus();
    return;
  }

  if (runButton) {
    runButton.disabled = true;
    runButton.textContent = 'Thinking…';
  }
  setResponseState({ loading: true, text: 'SakthiAI is processing your request securely at the edge…' });

  try {
    const response = await fetch('/api/v1/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        mode: taskType?.value || 'automatic',
        provider: providerSelect?.value || 'auto'
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Request failed with status ${response.status}`);

    document.getElementById('responseTitle').textContent = 'Completed response';
    document.getElementById('responseProvider').textContent = `Provider: ${data.provider || 'workers-ai'}`;
    document.getElementById('responseLatency').textContent = `Latency: ${data.latencyMs ?? '—'} ms`;
    document.getElementById('responseRequestId').textContent = `Request ID: ${data.requestId || '—'}`;
    setResponseState({ text: data.answer || 'The model returned no text.' });
  } catch (error) {
    document.getElementById('responseTitle').textContent = 'Request not completed';
    document.getElementById('responseProvider').textContent = 'Provider: unavailable';
    document.getElementById('responseLatency').textContent = 'Latency: —';
    document.getElementById('responseRequestId').textContent = 'Request ID: —';
    setResponseState({ error: true, text: error.message || 'Unable to contact the AI runtime.' });
  } finally {
    if (runButton) {
      runButton.disabled = false;
      runButton.textContent = 'Run with SakthiAI';
    }
  }
});

document.getElementById('clearResponse')?.addEventListener('click', () => {
  if (responsePanel) responsePanel.hidden = true;
  if (responseBody) responseBody.textContent = '';
  input?.focus();
});

loadRuntimeStatus();

if ('serviceWorker' in navigator) {
  addEventListener('load', () => navigator.serviceWorker.register('/service-worker.js').catch(() => {}));
}
