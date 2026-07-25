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
const budgetSelect = document.getElementById('budgetSelect');
const streamToggle = document.getElementById('streamToggle');
const input = document.getElementById('promptInput');
const count = document.getElementById('characterCount');
const taskForm = document.getElementById('taskForm');
const runButton = document.getElementById('runButton');
const responsePanel = document.getElementById('responsePanel');
const responseBody = document.getElementById('responseBody');
const citationPanel = document.getElementById('citationPanel');
const citationList = document.getElementById('citationList');

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

function getClientId() {
  let id = localStorage.getItem('sakthiai-client-id');
  if (!id) {
    id = crypto.randomUUID().replaceAll('-', '');
    localStorage.setItem('sakthiai-client-id', id);
  }
  return id;
}

function apiHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Sakthi-Client': getClientId()
  };
}

input?.addEventListener('input', () => {
  if (count) count.textContent = `${input.value.length} / 12000`;
});

function setRuntimeState(online, message) {
  if (platformStatus) {
    platformStatus.classList.toggle('online', online);
    platformStatus.classList.toggle('offline', !online);
    platformStatus.innerHTML = `<span class="status-dot"></span> ${message}`;
  }
  if (gatewayLabel) gatewayLabel.textContent = online ? 'Router and research online' : 'Runtime unavailable';
  if (runtimeState) runtimeState.textContent = online ? 'Online' : 'Unavailable';
  if (runtimeValue) runtimeValue.textContent = online ? 'Multi-provider gateway online' : 'Unavailable';
  if (runButton) runButton.disabled = !online;
}

function updateProviderControls(providers = []) {
  for (const chip of document.querySelectorAll('[data-provider]')) {
    const provider = providers.find((item) => item.id === chip.dataset.provider);
    const live = Boolean(provider?.live);
    const selectable = Boolean(provider?.selectable);
    chip.classList.toggle('live', live);
    chip.classList.toggle('pending', !live && selectable);
    chip.classList.toggle('unavailable', !selectable);
    chip.title = live ? 'Live now' : selectable ? 'Available on demand through AI Gateway; billing/model access is checked when used' : 'Unavailable';
  }

  if (providerSelect) {
    for (const option of providerSelect.options) {
      if (option.value === 'auto') continue;
      const provider = providers.find((item) => item.id === option.value);
      option.disabled = !provider?.selectable;
      if (provider) option.textContent = `${provider.name}${provider.costClass === 'premium' ? ' · premium' : ''}`;
    }
  }
}

async function loadRuntimeStatus() {
  try {
    const response = await fetch('/api/v1/status', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    setRuntimeState(Boolean(data.aiRuntime), data.aiRuntime ? `Release ${data.release} · router online` : 'AI binding pending');
    updateProviderControls(data.providers);
  } catch (error) {
    console.error('Runtime status check failed', error);
    setRuntimeState(false, 'AI runtime unavailable');
    updateProviderControls([]);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatMarkdown(text) {
  const escaped = escapeHtml(text || '');
  const lines = escaped.split('\n');
  const html = [];
  let inList = false;
  let inCode = false;
  let code = [];

  function closeList() {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (line.startsWith('```')) {
      closeList();
      if (inCode) {
        html.push(`<pre><code>${code.join('\n')}</code></pre>`);
        code = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      code.push(rawLine);
      continue;
    }

    const bullet = line.match(/^[-*]\s+(.+)/);
    const numbered = line.match(/^\d+[.)]\s+(.+)/);
    if (bullet || numbered) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      const body = (bullet || numbered)[1].replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      html.push(`<li>${body}</li>`);
      continue;
    }

    closeList();
    if (!line) {
      html.push('<br>');
    } else if (line.startsWith('### ')) {
      html.push(`<h4>${line.slice(4)}</h4>`);
    } else if (line.startsWith('## ')) {
      html.push(`<h3>${line.slice(3)}</h3>`);
    } else if (line.startsWith('# ')) {
      html.push(`<h2>${line.slice(2)}</h2>`);
    } else {
      html.push(`<p>${line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`);
    }
  }
  closeList();
  if (inCode) html.push(`<pre><code>${code.join('\n')}</code></pre>`);
  return html.join('');
}

function renderCitations(citations = [], searchedAt = '') {
  if (!citationPanel || !citationList) return;
  citationList.replaceChildren();
  if (!citations.length) {
    citationPanel.hidden = true;
    return;
  }

  for (const citation of citations) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = citation.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `${citation.index}. ${citation.title || citation.url}`;
    item.append(link);
    if (citation.snippet) {
      const snippet = document.createElement('p');
      snippet.textContent = citation.snippet;
      item.append(snippet);
    }
    citationList.append(item);
  }
  const checked = document.getElementById('citationChecked');
  if (checked) checked.textContent = searchedAt ? `Sources checked ${new Date(searchedAt).toLocaleString()}` : 'Live sources';
  citationPanel.hidden = false;
}

function setResponseState({ loading = false, error = false, text = '', append = false } = {}) {
  if (!responsePanel || !responseBody) return;
  responsePanel.hidden = false;
  responseBody.classList.toggle('loading', loading);
  responseBody.classList.toggle('error', error);
  if (append) responseBody.dataset.raw = `${responseBody.dataset.raw || ''}${text}`;
  else responseBody.dataset.raw = text;
  responseBody.innerHTML = formatMarkdown(responseBody.dataset.raw || '');
  responsePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const freshPattern = /\b(today|latest|current|recent|news|now|live|price|weather|chief minister|prime minister|president|ceo|who is|2026)\b|இன்று|தற்போதைய|சமீபத்திய|செய்தி|முதல்வர்|முதலமைச்சர்|பிரதமர்/i;

function updateExecutionPreview() {
  const mode = taskType?.selectedOptions?.[0]?.textContent || 'Automatic';
  const provider = providerSelect?.selectedOptions?.[0]?.textContent || 'Automatic';
  const budget = budgetSelect?.selectedOptions?.[0]?.textContent || 'Balanced';
  const value = input?.value || '';
  const sensitive = /password|secret|credential|private key|api key/i.test(value);
  const fresh = taskType?.value === 'research' || freshPattern.test(value);
  const decisionTitle = document.getElementById('decisionTitle');
  const decisionText = document.getElementById('decisionText');
  const laneValue = document.getElementById('laneValue');
  const verifyValue = document.getElementById('verifyValue');
  const freshnessValue = document.getElementById('freshnessValue');
  if (decisionTitle) decisionTitle.textContent = sensitive ? 'Sensitive data detected' : fresh ? 'Fresh research required' : `${mode} task ready`;
  if (decisionText) decisionText.textContent = sensitive
    ? 'Remove passwords, API keys, private keys and other credentials before submitting.'
    : fresh
      ? 'SakthiAI will use provider-native web search and will not answer from stale model memory.'
      : `The request will run server-side through ${provider} using the ${budget} budget policy.`;
  if (laneValue) laneValue.textContent = fresh ? 'Research gateway' : provider;
  if (verifyValue) verifyValue.textContent = fresh ? 'Live sources and citations' : 'Limitations disclosed';
  if (freshnessValue) freshnessValue.textContent = fresh ? 'Web search required' : 'Model knowledge acceptable';
  if (streamToggle) streamToggle.disabled = fresh;
}

input?.addEventListener('input', updateExecutionPreview);
taskType?.addEventListener('change', updateExecutionPreview);
providerSelect?.addEventListener('change', updateExecutionPreview);
budgetSelect?.addEventListener('change', updateExecutionPreview);

for (const modeLink of document.querySelectorAll('[data-mode-link]')) {
  modeLink.addEventListener('click', () => {
    const mode = modeLink.dataset.modeLink;
    if (taskType && mode) taskType.value = mode;
    updateExecutionPreview();
    setTimeout(() => input?.focus(), 50);
  });
}

function setResponseMeta({ provider = '—', model = '', latencyMs = '—', requestId = '—', route = '', costClass = '' } = {}) {
  document.getElementById('responseProvider').textContent = `Provider: ${provider}`;
  document.getElementById('responseLatency').textContent = `Latency: ${latencyMs === '—' ? '—' : `${latencyMs} ms`}`;
  document.getElementById('responseRequestId').textContent = `Request ID: ${requestId}`;
  const routeEl = document.getElementById('responseRoute');
  const costEl = document.getElementById('responseCost');
  const modelEl = document.getElementById('responseModel');
  if (routeEl) routeEl.textContent = route ? `Route: ${route}` : 'Route: —';
  if (costEl) costEl.textContent = costClass ? `Cost: ${costClass}` : 'Cost: —';
  if (modelEl) modelEl.textContent = model ? `Model: ${model}` : 'Model: —';
}

function extractStreamText(payload) {
  if (!payload || typeof payload !== 'object') return '';
  if (typeof payload.response === 'string') return payload.response;
  if (typeof payload.output_text === 'string') return payload.output_text;
  if (typeof payload.delta?.text === 'string') return payload.delta.text;
  if (typeof payload.choices?.[0]?.delta?.content === 'string') return payload.choices[0].delta.content;
  if (typeof payload.choices?.[0]?.text === 'string') return payload.choices[0].text;
  return '';
}

async function runStreaming(payload) {
  const started = performance.now();
  const response = await fetch('/api/v1/chat/stream', {
    method: 'POST',
    headers: apiHeaders(),
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  setResponseMeta({
    provider: response.headers.get('X-Sakthi-Provider') || 'stream',
    model: response.headers.get('X-Sakthi-Model') || '',
    latencyMs: '—',
    requestId: response.headers.get('X-Request-ID') || '—',
    route: response.headers.get('X-Sakthi-Route') || 'streaming',
    costClass: payload.budget
  });
  setResponseState({ text: '' });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === '[DONE]') continue;
      try {
        const text = extractStreamText(JSON.parse(data));
        if (text) setResponseState({ text, append: true });
      } catch {
        // Ignore provider heartbeat or non-JSON SSE frames.
      }
    }
  }
  const latency = Math.round(performance.now() - started);
  document.getElementById('responseLatency').textContent = `Latency: ${latency} ms`;
  if (!responseBody?.dataset.raw) setResponseState({ text: 'The stream completed without returning text.' });
}

async function runJson(endpoint, payload) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: apiHeaders(),
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed with status ${response.status}`);
  setResponseMeta({
    provider: data.provider || 'workers-ai',
    model: data.model || '',
    latencyMs: data.latencyMs ?? '—',
    requestId: data.requestId || '—',
    route: data.routing?.reason || data.kind || '',
    costClass: data.costClass || ''
  });
  setResponseState({ text: data.answer || 'The model returned no text.' });
  renderCitations(data.citations, data.searchedAt);
}

taskForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const prompt = (input?.value || '').trim();
  if (!prompt) {
    input?.focus();
    return;
  }

  const fresh = taskType?.value === 'research' || freshPattern.test(prompt);
  const payload = {
    prompt,
    mode: taskType?.value || 'automatic',
    provider: providerSelect?.value || 'auto',
    budget: budgetSelect?.value || 'balanced'
  };

  if (runButton) {
    runButton.disabled = true;
    runButton.textContent = fresh ? 'Researching live sources…' : 'Thinking…';
  }
  document.getElementById('responseTitle').textContent = fresh ? 'Live research in progress' : 'Generating response';
  renderCitations([]);
  setResponseState({ loading: true, text: fresh ? 'Searching current sources and preparing cited findings…' : 'SakthiAI is processing your request securely…' });

  try {
    if (fresh) {
      await runJson('/api/v1/research', { ...payload, mode: 'research' });
      document.getElementById('responseTitle').textContent = 'Fresh research completed';
    } else if (streamToggle?.checked) {
      await runStreaming(payload);
      document.getElementById('responseTitle').textContent = 'Streamed response completed';
    } else {
      await runJson('/api/v1/chat', payload);
      document.getElementById('responseTitle').textContent = 'Completed response';
    }
  } catch (error) {
    document.getElementById('responseTitle').textContent = 'Request not completed';
    setResponseMeta({ provider: 'unavailable' });
    setResponseState({ error: true, text: error.message || 'Unable to contact the AI runtime.' });
  } finally {
    responseBody?.classList.remove('loading');
    if (runButton) {
      runButton.disabled = false;
      runButton.textContent = 'Run with SakthiAI';
    }
  }
});

document.getElementById('clearResponse')?.addEventListener('click', () => {
  if (responsePanel) responsePanel.hidden = true;
  if (responseBody) {
    responseBody.textContent = '';
    responseBody.dataset.raw = '';
  }
  renderCitations([]);
  input?.focus();
});

loadRuntimeStatus();
updateExecutionPreview();

if ('serviceWorker' in navigator) {
  addEventListener('load', () => navigator.serviceWorker.register('/service-worker.js').catch(() => {}));
}
