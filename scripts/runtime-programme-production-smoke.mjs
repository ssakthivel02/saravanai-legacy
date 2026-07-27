#!/usr/bin/env node

const DEFAULT_BASE_URL = 'https://sakthiai.omsaravanabhava.org';
const LIVE = process.argv.includes('--live');
const baseArg = process.argv.find((value) => value.startsWith('--base-url='));
const BASE_URL = (baseArg ? baseArg.split('=').slice(1).join('=') : DEFAULT_BASE_URL).replace(/\/$/, '');
const TIMEOUT_MS = 12_000;

export const expectedEndpoints = Object.freeze([
  '/health',
  '/api/v1/runtime/programme/status',
  ...Array.from({ length: 50 }, (_, index) => `/api/v1/runtime/v${index + 1}/status`)
]);

export function buildSmokePlan(baseUrl = DEFAULT_BASE_URL) {
  const normalized = String(baseUrl || DEFAULT_BASE_URL).replace(/\/$/, '');
  return expectedEndpoints.map((path) => ({
    method: 'GET',
    path,
    url: `${normalized}${path}`,
    expectedStatus: 200,
    mutationAllowed: false,
    credentialsRequired: false
  }));
}

export function validateStatusPayload(path, payload) {
  const findings = [];
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { valid: false, findings: ['response_json_object_required'] };
  }
  if (payload.status !== 'ok') findings.push('status_not_ok');
  if (path === '/api/v1/runtime/programme/status') {
    if (payload.totalWaves !== 50) findings.push('programme_total_waves_not_50');
    if (payload.operationalCount !== 0) findings.push('programme_operational_waves_not_zero');
    if (payload.publicRegistration !== false) findings.push('public_registration_not_false');
    if (payload.productionWritesEnabled !== false) findings.push('production_writes_not_false');
    if (payload.billingEnabled !== false) findings.push('billing_not_false');
    if (payload.paidProvidersEnabled !== false) findings.push('paid_providers_not_false');
    if (payload.autonomousActionsEnabled !== false) findings.push('autonomous_actions_not_false');
  }
  const waveMatch = path.match(/\/runtime\/v(\d+)\/status$/);
  if (waveMatch) {
    const wave = Number(waveMatch[1]);
    if (payload.enabled !== false) findings.push(`wave_${wave}_enabled_not_false`);
    if (wave >= 2 && payload.emergencyStopped !== true) findings.push(`wave_${wave}_emergency_stop_not_true`);
    if (payload.operational !== false) findings.push(`wave_${wave}_operational_not_false`);
    if (payload.publicRegistration !== false) findings.push(`wave_${wave}_public_registration_not_false`);
  }
  return { valid: findings.length === 0, findings };
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json', 'User-Agent': 'sakthiai-production-assurance/1.0' },
      redirect: 'error',
      signal: controller.signal
    });
    const text = await response.text();
    let payload;
    try { payload = JSON.parse(text); }
    catch { payload = null; }
    return { status: response.status, payload, contentType: response.headers.get('content-type') || '' };
  } finally {
    clearTimeout(timer);
  }
}

export async function runLiveSmoke(baseUrl = BASE_URL) {
  const plan = buildSmokePlan(baseUrl);
  const results = [];
  for (const check of plan) {
    try {
      const response = await fetchJson(check.url);
      const payloadValidation = validateStatusPayload(check.path, response.payload);
      const findings = [];
      if (response.status !== check.expectedStatus) findings.push(`http_status_${response.status}`);
      if (!response.contentType.toLowerCase().includes('application/json')) findings.push('content_type_not_json');
      findings.push(...payloadValidation.findings);
      results.push({ ...check, passed: findings.length === 0, findings });
    } catch (error) {
      results.push({ ...check, passed: false, findings: [error?.name === 'AbortError' ? 'request_timeout' : 'request_failed'] });
    }
  }
  return {
    generatedAt: new Date().toISOString(),
    baseUrl,
    live: true,
    total: results.length,
    passed: results.filter((item) => item.passed).length,
    failed: results.filter((item) => !item.passed).length,
    safeReadOnly: true,
    results
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (!LIVE) {
    console.log(JSON.stringify({
      generatedAt: new Date().toISOString(),
      live: false,
      safeReadOnly: true,
      note: 'Dry-run only. Add --live to perform read-only production requests.',
      checks: buildSmokePlan(BASE_URL)
    }, null, 2));
    process.exit(0);
  }
  const report = await runLiveSmoke(BASE_URL);
  console.log(JSON.stringify(report, null, 2));
  process.exit(report.failed === 0 ? 0 : 1);
}
