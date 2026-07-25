import {
  artifactFileName,
  createCodeZip,
  createDocx,
  createPptx,
  createTextArtifact,
  createXlsx,
  downloadBlob,
  printPdf
} from './artifact-formats.js';

const DB_NAME = 'sakthiai-owner-platform';
const DB_VERSION = 1;
const STORE_NAMES = ['projects', 'messages', 'approvals', 'memories', 'graphNodes', 'graphEdges', 'usage', 'artifacts', 'settings'];
const DEFAULT_PROJECT_ID = 'owner-default';

function now() {
  return new Date().toISOString();
}

function id(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const storeName of STORE_NAMES) {
        if (!db.objectStoreNames.contains(storeName)) db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function transact(storeName, mode, operation) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    let result;
    try {
      result = operation(store);
    } catch (error) {
      db.close();
      reject(error);
      return;
    }
    transaction.oncomplete = () => {
      db.close();
      resolve(result);
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function put(store, value) {
  return transact(store, 'readwrite', (objectStore) => requestResult(objectStore.put(value)));
}

async function get(store, key) {
  return transact(store, 'readonly', (objectStore) => requestResult(objectStore.get(key)));
}

async function all(store) {
  return transact(store, 'readonly', (objectStore) => requestResult(objectStore.getAll()));
}

async function remove(store, key) {
  return transact(store, 'readwrite', (objectStore) => requestResult(objectStore.delete(key)));
}

async function clearStore(store) {
  return transact(store, 'readwrite', (objectStore) => requestResult(objectStore.clear()));
}

async function ensureDefaultProject() {
  const existing = await get('projects', DEFAULT_PROJECT_ID);
  if (!existing) {
    await put('projects', {
      id: DEFAULT_PROJECT_ID,
      name: 'My SakthiAI workspace',
      description: 'Private browser-local owner workspace',
      createdAt: now(),
      updatedAt: now()
    });
  }
  if (!localStorage.getItem('sakthiai-active-project')) localStorage.setItem('sakthiai-active-project', DEFAULT_PROJECT_ID);
}

function activeProjectId() {
  return localStorage.getItem('sakthiai-active-project') || DEFAULT_PROJECT_ID;
}

function setText(idValue, text) {
  const element = document.getElementById(idValue);
  if (element) element.textContent = text;
}

function notice(target, message, error = false) {
  const element = typeof target === 'string' ? document.getElementById(target) : target;
  if (!element) return;
  element.textContent = message;
  element.classList.toggle('error', error);
}

async function renderProjects() {
  const projects = (await all('projects')).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const active = activeProjectId();
  const select = document.getElementById('projectSelect');
  const list = document.getElementById('projectList');
  if (select) {
    select.replaceChildren();
    for (const project of projects) {
      const option = document.createElement('option');
      option.value = project.id;
      option.textContent = project.name;
      option.selected = project.id === active;
      select.append(option);
    }
  }
  if (list) {
    list.innerHTML = projects.map((project) => `<button type="button" class="owner-list-item${project.id === active ? ' active' : ''}" data-project-id="${project.id}"><strong>${escapeHtml(project.name)}</strong><small>${new Date(project.updatedAt).toLocaleString()}</small></button>`).join('');
    list.querySelectorAll('[data-project-id]').forEach((button) => {
      button.addEventListener('click', () => {
        localStorage.setItem('sakthiai-active-project', button.dataset.projectId);
        renderProjects();
        renderMessages();
      });
    });
  }
  const current = projects.find((project) => project.id === active) || projects[0];
  setText('activeProjectName', current?.name || 'No project');
}

async function renderMessages() {
  const projectId = activeProjectId();
  const messages = (await all('messages')).filter((item) => item.projectId === projectId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 30);
  const list = document.getElementById('conversationList');
  if (!list) return;
  list.innerHTML = messages.length ? messages.map((item) => `<article class="history-item"><div><strong>${escapeHtml(item.prompt || item.kind)}</strong><small>${new Date(item.createdAt).toLocaleString()} · ${escapeHtml(item.provider || 'local')}</small></div><p>${escapeHtml((item.answer || item.error || '').slice(0, 420))}</p></article>`).join('') : '<p class="muted">No saved SakthiAI tasks in this project yet.</p>';
}

async function recordUsage(event) {
  const record = {
    id: id('usage'),
    projectId: activeProjectId(),
    createdAt: now(),
    kind: event.kind || 'ai-request',
    status: event.status || 'ok',
    provider: event.provider || 'unknown',
    model: event.model || '',
    costClass: event.costClass || 'free-first',
    promptChars: Number(event.promptChars || 0),
    outputChars: Number(event.outputChars || 0),
    latencyMs: Number(event.latencyMs || 0)
  };
  await put('usage', record);
  await renderUsage();
}

async function saveAiEvent(detail, status = 'ok') {
  const projectId = activeProjectId();
  const record = {
    id: id('message'),
    projectId,
    kind: detail.kind || 'chat',
    prompt: detail.prompt || '',
    answer: detail.answer || '',
    error: detail.error || '',
    mode: detail.mode || 'automatic',
    provider: detail.provider || 'unknown',
    model: detail.model || '',
    citations: detail.citations || [],
    requestId: detail.requestId || '',
    costClass: detail.costClass || 'free-first',
    status,
    createdAt: now()
  };
  await put('messages', record);
  const project = await get('projects', projectId);
  if (project) await put('projects', { ...project, updatedAt: now() });
  if (detail.answer) localStorage.setItem('sakthiai-latest-response', detail.answer);
  await recordUsage({
    kind: detail.kind || 'ai-request',
    status,
    provider: detail.provider,
    model: detail.model,
    costClass: detail.costClass,
    promptChars: detail.prompt?.length || 0,
    outputChars: detail.answer?.length || 0,
    latencyMs: detail.latencyMs
  });
  await renderProjects();
  await renderMessages();
}

async function renderApprovals() {
  const items = (await all('approvals')).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const list = document.getElementById('approvalList');
  if (!list) return;
  list.innerHTML = items.length ? items.map((item) => `<article class="approval-item"><div><span class="status-tag ${item.status}">${escapeHtml(item.status)}</span><strong>${escapeHtml(item.tool)}</strong><small>${escapeHtml(item.impact)}</small></div><p>${escapeHtml(item.action)}</p>${item.status === 'pending' ? `<div class="inline-actions"><button type="button" data-approve="${item.id}" class="button small primary">Approve</button><button type="button" data-reject="${item.id}" class="button small secondary">Reject</button></div>` : ''}</article>`).join('') : '<p class="muted">No approval requests. External write tools remain disabled.</p>';
  list.querySelectorAll('[data-approve]').forEach((button) => button.addEventListener('click', async () => {
    const item = await get('approvals', button.dataset.approve);
    await put('approvals', { ...item, status: 'approved', decidedAt: now(), executionState: 'not-executed-dry-run-only' });
    await recordUsage({ kind: 'approval', status: 'approved', provider: 'local-governance' });
    renderApprovals();
  }));
  list.querySelectorAll('[data-reject]').forEach((button) => button.addEventListener('click', async () => {
    const item = await get('approvals', button.dataset.reject);
    await put('approvals', { ...item, status: 'rejected', decidedAt: now(), executionState: 'blocked' });
    renderApprovals();
  }));
}

async function renderMemories() {
  const memories = (await all('memories')).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const list = document.getElementById('memoryList');
  if (!list) return;
  list.innerHTML = memories.length ? memories.map((item) => `<article class="memory-item"><div><strong>${escapeHtml(item.subject)}</strong><small>${item.expiresAt ? `Expires ${new Date(item.expiresAt).toLocaleDateString()}` : 'No expiry'}</small></div><p>${escapeHtml(item.content)}</p><button class="text-button" type="button" data-forget="${item.id}">Forget</button></article>`).join('') : '<p class="muted">No approved long-term memories. SakthiAI does not save personal memory automatically.</p>';
  list.querySelectorAll('[data-forget]').forEach((button) => button.addEventListener('click', async () => {
    await remove('memories', button.dataset.forget);
    renderMemories();
  }));
}

async function renderGraph() {
  const nodes = await all('graphNodes');
  const edges = await all('graphEdges');
  const container = document.getElementById('graphView');
  const relationSelect = document.getElementById('relatedNode');
  if (relationSelect) {
    relationSelect.innerHTML = '<option value="">No relationship</option>' + nodes.map((node) => `<option value="${node.id}">${escapeHtml(node.label)}</option>`).join('');
  }
  if (!container) return;
  if (!nodes.length) {
    container.innerHTML = '<p class="muted">Add approved entities to build a local knowledge graph.</p>';
    return;
  }
  container.innerHTML = `<div class="graph-node-grid">${nodes.map((node) => `<article class="graph-node"><span>${escapeHtml(node.type)}</span><strong>${escapeHtml(node.label)}</strong><button type="button" class="text-button" data-delete-node="${node.id}">Delete</button></article>`).join('')}</div><div class="graph-edge-list">${edges.map((edge) => {
    const from = nodes.find((node) => node.id === edge.fromId)?.label || edge.fromId;
    const to = nodes.find((node) => node.id === edge.toId)?.label || edge.toId;
    return `<span>${escapeHtml(from)} → ${escapeHtml(edge.relation)} → ${escapeHtml(to)}</span>`;
  }).join('')}</div>`;
  container.querySelectorAll('[data-delete-node]').forEach((button) => button.addEventListener('click', async () => {
    const nodeId = button.dataset.deleteNode;
    await remove('graphNodes', nodeId);
    const currentEdges = await all('graphEdges');
    await Promise.all(currentEdges.filter((edge) => edge.fromId === nodeId || edge.toId === nodeId).map((edge) => remove('graphEdges', edge.id)));
    renderGraph();
  }));
}

async function renderUsage() {
  const items = await all('usage');
  const today = new Date().toISOString().slice(0, 10);
  const daily = items.filter((item) => item.createdAt.startsWith(today));
  const successful = daily.filter((item) => item.status === 'ok' || item.status === 'approved').length;
  const promptChars = daily.reduce((sum, item) => sum + (item.promptChars || 0), 0);
  const outputChars = daily.reduce((sum, item) => sum + (item.outputChars || 0), 0);
  const paid = daily.filter((item) => String(item.costClass).includes('premium')).length;
  setText('usageRequests', String(daily.length));
  setText('usageSuccess', String(successful));
  setText('usageCharacters', (promptChars + outputChars).toLocaleString());
  setText('usagePaidCalls', String(paid));
  const cap = Number(localStorage.getItem('sakthiai-daily-request-cap') || 50);
  const progress = document.getElementById('usageProgress');
  if (progress) progress.value = Math.min(daily.length, cap);
  if (progress) progress.max = Math.max(cap, 1);
  setText('usageCapText', `${daily.length} of ${cap} owner requests today`);
}

async function exportAllOwnerData() {
  const payload = { exportedAt: now(), schemaVersion: 1, data: {} };
  for (const store of STORE_NAMES) payload.data[store] = await all(store);
  downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), `sakthiai-owner-backup-${new Date().toISOString().slice(0, 10)}.json`);
}

async function clearOwnerData() {
  if (!confirm('Delete all browser-local SakthiAI owner projects, conversations, approvals, memory and usage data on this device?')) return;
  for (const store of STORE_NAMES) await clearStore(store);
  localStorage.removeItem('sakthiai-active-project');
  localStorage.removeItem('sakthiai-latest-response');
  await ensureDefaultProject();
  await renderAll();
}

async function loadFileCapabilities() {
  try {
    const response = await fetch('/api/v1/files/capabilities', { cache: 'no-store' });
    const data = await response.json();
    setText('fileStorageState', data.configured?.privateStorage ? 'Ready' : 'Not configured');
    setText('fileConversionState', data.configured?.markdownConversion ? 'Ready' : 'Unavailable');
    setText('fileSearchState', data.configured?.aiSearch ? 'Ready' : 'Not configured');
    setText('fileLimitState', `${data.limits?.maxFileMiB || 4} MiB`);
    const upload = document.getElementById('fileUploadButton');
    if (upload) upload.disabled = !data.configured?.privateStorage;
  } catch (error) {
    notice('fileStatus', `Unable to read file capabilities: ${error.message}`, true);
  }
}

function bindForms() {
  document.getElementById('projectForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const nameInput = document.getElementById('projectName');
    const name = nameInput.value.trim();
    if (!name) return;
    const project = { id: id('project'), name, description: 'Browser-local owner project', createdAt: now(), updatedAt: now() };
    await put('projects', project);
    localStorage.setItem('sakthiai-active-project', project.id);
    nameInput.value = '';
    await renderProjects();
    await renderMessages();
  });

  document.getElementById('projectSelect')?.addEventListener('change', (event) => {
    localStorage.setItem('sakthiai-active-project', event.target.value);
    renderProjects();
    renderMessages();
  });

  document.getElementById('deleteProject')?.addEventListener('click', async () => {
    const projectId = activeProjectId();
    if (projectId === DEFAULT_PROJECT_ID) {
      notice('projectStatus', 'The default owner workspace cannot be deleted.', true);
      return;
    }
    if (!confirm('Delete the selected local project and its conversation history?')) return;
    await remove('projects', projectId);
    const messages = await all('messages');
    await Promise.all(messages.filter((item) => item.projectId === projectId).map((item) => remove('messages', item.id)));
    localStorage.setItem('sakthiai-active-project', DEFAULT_PROJECT_ID);
    await renderProjects();
    await renderMessages();
  });

  document.getElementById('exportProject')?.addEventListener('click', async () => {
    const project = await get('projects', activeProjectId());
    const messages = (await all('messages')).filter((item) => item.projectId === activeProjectId());
    downloadBlob(new Blob([JSON.stringify({ project, messages, exportedAt: now() }, null, 2)], { type: 'application/json' }), `${project?.name || 'sakthiai-project'}.json`);
  });

  document.getElementById('fileForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = document.getElementById('fileOwnerToken')?.value || '';
    const file = document.getElementById('fileInput')?.files?.[0];
    if (!file) return notice('fileStatus', 'Choose a supported file.', true);
    if (!token) return notice('fileStatus', 'Enter the temporary owner ingestion token for this session.', true);
    const form = new FormData();
    form.append('file', file);
    notice('fileStatus', 'Uploading to private evidence storage…');
    try {
      const response = await fetch('/api/v1/files/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Upload failed (${response.status})`);
      document.getElementById('fileId').value = data.file.id;
      notice('fileStatus', `Stored privately. File ID: ${data.file.id}`);
      await recordUsage({ kind: 'file-upload', status: 'ok', provider: 'r2', outputChars: file.size });
    } catch (error) {
      notice('fileStatus', error.message, true);
    }
  });

  document.getElementById('fileConvertButton')?.addEventListener('click', async () => {
    const token = document.getElementById('fileOwnerToken')?.value || '';
    const fileId = document.getElementById('fileId')?.value || '';
    if (!token || !fileId) return notice('fileStatus', 'Upload a file and provide the session token first.', true);
    notice('fileStatus', 'Converting and indexing…');
    try {
      const response = await fetch(`/api/v1/files/${encodeURIComponent(fileId)}/convert`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Conversion failed (${response.status})`);
      notice('fileStatus', `Conversion completed: ${data.status}. ${data.conversion?.characters || 0} Markdown characters.`);
      await recordUsage({ kind: 'file-conversion', status: 'ok', provider: 'workers-ai', outputChars: data.conversion?.characters || 0 });
    } catch (error) {
      notice('fileStatus', error.message, true);
    }
  });

  document.getElementById('useLatestResponse')?.addEventListener('click', () => {
    const latest = localStorage.getItem('sakthiai-latest-response') || '';
    document.getElementById('artifactContent').value = latest;
    if (!latest) notice('artifactStatus', 'No completed SakthiAI response is available on this device.', true);
  });

  document.getElementById('artifactForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('artifactTitle').value.trim() || 'SakthiAI artifact';
    const content = document.getElementById('artifactContent').value;
    const format = document.getElementById('artifactFormat').value;
    try {
      let blob;
      let extension = format;
      if (format === 'docx') blob = createDocx(title, content);
      else if (format === 'xlsx') blob = createXlsx(title, content);
      else if (format === 'pptx') blob = createPptx(title, content);
      else if (format === 'codezip') {
        blob = createCodeZip(title, content);
        extension = 'zip';
      } else if (format === 'pdf') {
        printPdf(title, content);
        notice('artifactStatus', 'Print-ready view opened. Choose “Save as PDF” in the browser print dialog.');
        await recordUsage({ kind: 'artifact-pdf', status: 'ok', provider: 'local-browser', outputChars: content.length });
        return;
      } else blob = createTextArtifact(format, title, content);
      downloadBlob(blob, artifactFileName(title, extension));
      const record = { id: id('artifact'), projectId: activeProjectId(), title, format, sizeBytes: blob.size, createdAt: now(), storage: 'downloaded-local-only' };
      await put('artifacts', record);
      await recordUsage({ kind: `artifact-${format}`, status: 'ok', provider: 'local-browser', outputChars: content.length });
      notice('artifactStatus', `${format.toUpperCase()} generated locally. Review before sharing.`);
    } catch (error) {
      notice('artifactStatus', error.message, true);
    }
  });

  document.getElementById('approvalForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const tool = document.getElementById('approvalTool').value.trim();
    const action = document.getElementById('approvalAction').value.trim();
    const impact = document.getElementById('approvalImpact').value;
    if (!tool || !action) return;
    await put('approvals', { id: id('approval'), tool, action, impact, status: 'pending', executionState: 'dry-run-only', createdAt: now() });
    event.target.reset();
    await renderApprovals();
  });

  document.getElementById('memoryForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const subject = document.getElementById('memorySubject').value.trim();
    const content = document.getElementById('memoryContent').value.trim();
    const expiryDays = Number(document.getElementById('memoryExpiry').value || 0);
    if (!subject || !content) return;
    const expiresAt = expiryDays > 0 ? new Date(Date.now() + expiryDays * 86400000).toISOString() : null;
    await put('memories', { id: id('memory'), subject, content, approvedBy: 'owner-local', expiresAt, createdAt: now(), updatedAt: now() });
    event.target.reset();
    await renderMemories();
  });

  document.getElementById('graphForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const label = document.getElementById('nodeLabel').value.trim();
    const type = document.getElementById('nodeType').value.trim() || 'Entity';
    const related = document.getElementById('relatedNode').value;
    const relation = document.getElementById('relationType').value.trim() || 'related-to';
    if (!label) return;
    const node = { id: id('node'), label, type, createdAt: now(), provenance: 'owner-approved-local-entry' };
    await put('graphNodes', node);
    if (related) await put('graphEdges', { id: id('edge'), fromId: node.id, toId: related, relation, createdAt: now(), provenance: 'owner-approved-local-entry' });
    event.target.reset();
    await renderGraph();
  });

  document.getElementById('saveUsageCap')?.addEventListener('click', () => {
    const value = Math.max(1, Number(document.getElementById('dailyRequestCap').value || 50));
    localStorage.setItem('sakthiai-daily-request-cap', String(value));
    renderUsage();
  });

  document.getElementById('exportOwnerData')?.addEventListener('click', exportAllOwnerData);
  document.getElementById('clearOwnerData')?.addEventListener('click', clearOwnerData);
}

async function renderAll() {
  await renderProjects();
  await renderMessages();
  await renderApprovals();
  await renderMemories();
  await renderGraph();
  await renderUsage();
  await loadFileCapabilities();
}

addEventListener('sakthiai:task-complete', (event) => saveAiEvent(event.detail, 'ok').catch(console.error));
addEventListener('sakthiai:task-error', (event) => saveAiEvent(event.detail, 'error').catch(console.error));

await ensureDefaultProject();
bindForms();
await renderAll();
