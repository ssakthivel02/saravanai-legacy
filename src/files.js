const MAX_FILE_BYTES = 4 * 1024 * 1024;
const INSTANCE_ID = 'sakthiai-evidence';

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.oasis.opendocument.text',
  'application/vnd.oasis.opendocument.spreadsheet',
  'text/csv',
  'text/html',
  'application/xml',
  'text/xml',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'image/bmp'
]);

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

function authorised(request, env) {
  const configured = typeof env.SAKTHI_INGEST_TOKEN === 'string' && env.SAKTHI_INGEST_TOKEN.length >= 24;
  if (!configured) return false;
  const header = request.headers.get('authorization') || '';
  return header === `Bearer ${env.SAKTHI_INGEST_TOKEN}`;
}

function safeName(value = 'document') {
  return String(value)
    .normalize('NFKC')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120) || 'document';
}

function hex(buffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function checksum(buffer) {
  return hex(await crypto.subtle.digest('SHA-256', buffer));
}

function storageReady(env) {
  return Boolean(env.EVIDENCE_BUCKET && typeof env.EVIDENCE_BUCKET.put === 'function');
}

function conversionReady(env) {
  return Boolean(env.AI && typeof env.AI.toMarkdown === 'function');
}

function searchReady(env) {
  return Boolean(env.AI_SEARCH && typeof env.AI_SEARCH.get === 'function');
}

async function readManifest(env, id) {
  const object = await env.EVIDENCE_BUCKET.get(`manifests/${id}.json`);
  if (!object) return null;
  return object.json();
}

async function writeManifest(env, manifest) {
  await env.EVIDENCE_BUCKET.put(`manifests/${manifest.id}.json`, JSON.stringify(manifest), {
    httpMetadata: { contentType: 'application/json; charset=utf-8' },
    customMetadata: { kind: 'sakthiai-evidence-manifest', sourceId: manifest.id }
  });
}

function capabilities(env) {
  return {
    status: 'ok',
    release: '0.4.0-preview',
    configured: {
      privateStorage: storageReady(env),
      markdownConversion: conversionReady(env),
      aiSearch: searchReady(env),
      ingestionSecret: typeof env.SAKTHI_INGEST_TOKEN === 'string' && env.SAKTHI_INGEST_TOKEN.length >= 24
    },
    limits: {
      maxFileBytes: MAX_FILE_BYTES,
      maxFileMiB: 4,
      anonymousUpload: false
    },
    supportedMimeTypes: [...ALLOWED_TYPES],
    requiredBindings: ['EVIDENCE_BUCKET', 'AI_SEARCH', 'SAKTHI_INGEST_TOKEN']
  };
}

async function upload(request, env) {
  if (!storageReady(env)) return json({ error: 'Private evidence storage is not configured.', code: 'FILES_NOT_CONFIGURED' }, 503);
  if (!authorised(request, env)) return json({ error: 'Owner/admin ingestion authorisation is required.', code: 'INGEST_UNAUTHORISED' }, 401);

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'A multipart form containing a file field is required.', code: 'INVALID_MULTIPART' }, 400);
  }

  const file = form.get('file');
  if (!(file instanceof File)) return json({ error: 'The file field is required.', code: 'FILE_REQUIRED' }, 400);
  if (!ALLOWED_TYPES.has(file.type)) return json({ error: `Unsupported file type: ${file.type || 'unknown'}`, code: 'UNSUPPORTED_FILE_TYPE' }, 415);
  if (file.size <= 0 || file.size > MAX_FILE_BYTES) {
    return json({ error: `File must be between 1 byte and ${MAX_FILE_BYTES} bytes.`, code: 'FILE_SIZE_INVALID' }, 413);
  }

  const id = crypto.randomUUID();
  const name = safeName(file.name);
  const key = `sources/${id}/${name}`;
  const buffer = await file.arrayBuffer();
  const sha256 = await checksum(buffer);
  const now = new Date().toISOString();

  await env.EVIDENCE_BUCKET.put(key, buffer, {
    httpMetadata: { contentType: file.type },
    customMetadata: { sourceId: id, originalName: name, sha256 }
  });

  const manifest = {
    id,
    state: 'stored',
    originalName: name,
    mimeType: file.type,
    sizeBytes: file.size,
    sha256,
    sourceKey: key,
    markdownKey: null,
    searchItem: null,
    createdAt: now,
    updatedAt: now
  };
  await writeManifest(env, manifest);

  return json({ status: 'stored', file: manifest }, 201);
}

async function getMetadata(request, env, id) {
  if (!storageReady(env)) return json({ error: 'Private evidence storage is not configured.', code: 'FILES_NOT_CONFIGURED' }, 503);
  if (!authorised(request, env)) return json({ error: 'Owner/admin authorisation is required.', code: 'INGEST_UNAUTHORISED' }, 401);
  const manifest = await readManifest(env, id);
  if (!manifest) return json({ error: 'File was not found.', code: 'FILE_NOT_FOUND' }, 404);
  return json({ status: 'ok', file: manifest });
}

async function remove(request, env, id) {
  if (!storageReady(env)) return json({ error: 'Private evidence storage is not configured.', code: 'FILES_NOT_CONFIGURED' }, 503);
  if (!authorised(request, env)) return json({ error: 'Owner/admin authorisation is required.', code: 'INGEST_UNAUTHORISED' }, 401);
  const manifest = await readManifest(env, id);
  if (!manifest) return json({ error: 'File was not found.', code: 'FILE_NOT_FOUND' }, 404);

  const keys = [manifest.sourceKey, manifest.markdownKey, `manifests/${id}.json`].filter(Boolean);
  await env.EVIDENCE_BUCKET.delete(keys);
  return json({ status: 'deleted', id });
}

function conversionResult(value) {
  const item = Array.isArray(value) ? value[0] : value;
  if (!item) return null;
  if (item.format === 'error') throw new Error(item.error || 'Document conversion failed.');
  return typeof item.data === 'string' ? item.data : typeof item === 'string' ? item : null;
}

async function convert(request, env, id) {
  if (!storageReady(env)) return json({ error: 'Private evidence storage is not configured.', code: 'FILES_NOT_CONFIGURED' }, 503);
  if (!authorised(request, env)) return json({ error: 'Owner/admin authorisation is required.', code: 'INGEST_UNAUTHORISED' }, 401);
  if (!conversionReady(env)) return json({ error: 'Document conversion is not available.', code: 'CONVERSION_NOT_CONFIGURED' }, 503);

  const manifest = await readManifest(env, id);
  if (!manifest) return json({ error: 'File was not found.', code: 'FILE_NOT_FOUND' }, 404);
  const source = await env.EVIDENCE_BUCKET.get(manifest.sourceKey);
  if (!source) return json({ error: 'Source object is missing.', code: 'SOURCE_OBJECT_MISSING' }, 409);

  const blob = new Blob([await source.arrayBuffer()], { type: manifest.mimeType });
  const converted = await env.AI.toMarkdown(
    { name: manifest.originalName, blob },
    { conversionOptions: { output: { format: 'markdown' }, pdf: { metadata: true } } }
  );
  const markdown = conversionResult(converted);
  if (!markdown) return json({ error: 'Conversion produced no Markdown.', code: 'EMPTY_CONVERSION' }, 502);

  const markdownKey = `markdown/${id}.md`;
  await env.EVIDENCE_BUCKET.put(markdownKey, markdown, {
    httpMetadata: { contentType: 'text/markdown; charset=utf-8' },
    customMetadata: { sourceId: id, sha256: manifest.sha256 }
  });

  let searchItem = null;
  let searchError = null;
  if (searchReady(env)) {
    try {
      const instance = env.AI_SEARCH.get(env.AI_SEARCH_INSTANCE || INSTANCE_ID);
      const indexed = await instance.items.uploadAndPoll(`${id}-${manifest.originalName}.md`, markdown);
      searchItem = { name: indexed?.name || `${id}-${manifest.originalName}.md`, status: indexed?.status || 'submitted' };
    } catch (error) {
      searchError = error?.message || 'AI Search indexing failed';
    }
  }

  const updated = {
    ...manifest,
    state: searchItem ? 'indexed' : 'converted',
    markdownKey,
    searchItem,
    searchError,
    updatedAt: new Date().toISOString()
  };
  await writeManifest(env, updated);

  return json({
    status: updated.state,
    file: updated,
    conversion: { characters: markdown.length, format: 'markdown' },
    aiSearchConfigured: searchReady(env)
  });
}

export async function handleFiles(request, env, url) {
  if (request.method === 'GET' && url.pathname === '/api/v1/files/capabilities') return json(capabilities(env));
  if (request.method === 'POST' && url.pathname === '/api/v1/files/upload') return upload(request, env);

  const match = url.pathname.match(/^\/api\/v1\/files\/([0-9a-f-]{36})(?:\/(convert))?$/i);
  if (!match) return json({ error: 'File API route not found.', code: 'FILE_ROUTE_NOT_FOUND' }, 404);
  const [, id, action] = match;

  if (request.method === 'GET' && !action) return getMetadata(request, env, id);
  if (request.method === 'DELETE' && !action) return remove(request, env, id);
  if (request.method === 'POST' && action === 'convert') return convert(request, env, id);
  return json({ error: 'Method is not allowed for this file route.', code: 'METHOD_NOT_ALLOWED' }, 405);
}
