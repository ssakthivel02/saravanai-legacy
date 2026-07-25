import './release011-hardening.js';

const doc = globalThis.document;
const form = doc?.getElementById('taskForm');
const title = doc?.getElementById('responseTitle');
const body = doc?.getElementById('responseBody');
const panel = doc?.getElementById('responsePanel');
let pending = null;
let lastSignature = '';
let timer = null;

function metaValue(id, prefix) {
  const text = doc?.getElementById(id)?.textContent || '';
  return text.startsWith(prefix) ? text.slice(prefix.length).trim() : text.trim();
}

function citations() {
  return [...(doc?.querySelectorAll('#citationList li') || [])].map((item, index) => ({
    index: index + 1,
    title: item.querySelector('a')?.textContent?.replace(/^\d+\.\s*/, '') || '',
    url: item.querySelector('a')?.href || '',
    snippet: item.querySelector('p')?.textContent || ''
  })).filter((item) => item.url);
}

function capture() {
  if (!pending || !title || !body || panel?.hidden) return;
  const titleText = title.textContent || '';
  const answer = body.dataset.raw || body.textContent || '';
  const completed = /completed/i.test(titleText);
  const failed = /not completed/i.test(titleText);
  if ((!completed && !failed) || !answer || body.classList.contains('loading')) return;
  const signature = `${pending.startedAt}|${titleText}|${answer.length}|${answer.slice(-80)}`;
  if (signature === lastSignature) return;
  lastSignature = signature;

  const detail = {
    ...pending,
    kind: pending.mode === 'research' ? 'research' : 'chat',
    answer: completed ? answer : '',
    error: failed ? answer : '',
    provider: metaValue('responseProvider', 'Provider:'),
    model: metaValue('responseModel', 'Model:'),
    route: metaValue('responseRoute', 'Route:'),
    costClass: metaValue('responseCost', 'Cost:'),
    requestId: metaValue('responseRequestId', 'Request ID:'),
    latencyMs: Number(metaValue('responseLatency', 'Latency:').replace(/\s*ms$/, '')) || 0,
    citations: citations()
  };
  globalThis.dispatchEvent?.(new CustomEvent(completed ? 'sakthiai:task-complete' : 'sakthiai:task-error', { detail }));
  pending = null;
}

form?.addEventListener('submit', () => {
  pending = {
    prompt: doc?.getElementById('promptInput')?.value?.trim() || '',
    mode: doc?.getElementById('taskType')?.value || 'automatic',
    providerRequested: doc?.getElementById('providerSelect')?.value || 'auto',
    budget: doc?.getElementById('budgetSelect')?.value || 'economy',
    startedAt: new Date().toISOString()
  };
  lastSignature = '';
}, { capture: true });

if (panel && globalThis.MutationObserver) {
  const observer = new MutationObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(capture, 250);
  });
  observer.observe(panel, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class', 'hidden'] });
}
