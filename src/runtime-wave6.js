import { validateArtifact } from './runtime-v6/artifact.js';
import { buildUnsignedAttestation } from './runtime-v6/attestation.js';
import { json, ownerBoundary, parseBody, runtimeState } from './runtime-v6/core.js';
import { assessDependencies } from './runtime-v6/dependency.js';
import { buildSupplyChainEvidence } from './runtime-v6/evidence.js';
import { validateRiskException } from './runtime-v6/exception.js';
import { evaluateIac } from './runtime-v6/iac.js';
import { assessLicenses } from './runtime-v6/licenses.js';
import { validateProvenance } from './runtime-v6/provenance.js';
import { evaluateReleaseGate } from './runtime-v6/release-gate.js';
import { evaluateRepositoryPolicy } from './runtime-v6/repository.js';
import { inspectSecretMarkers } from './runtime-v6/secrets.js';
import { validateSbom } from './runtime-v6/sbom.js';
import { evaluateWorkflow } from './runtime-v6/workflow.js';

export const RUNTIME_WAVE_6_RELEASE = 'runtime-wave-6.0.0';

export async function handleRuntimeWave6(request, env, url = new URL(request.url)) {
  const requestId = crypto.randomUUID();
  const current = runtimeState(env);

  if (request.method === 'GET' && url.pathname === '/api/v1/runtime/v6/status') {
    return json({
      status: 'ok',
      release: RUNTIME_WAVE_6_RELEASE,
      ...current,
      mode: 'private-owner-devsecops-supply-chain-evaluation-only',
      activation: current.operational ? 'owner-pilot' : 'disabled-or-emergency-stopped'
    }, 200, requestId);
  }

  const boundary = ownerBoundary(request, env);
  if (!boundary.allowed) return json({ error: boundary.code, code: boundary.code, publicRegistration: false }, boundary.status, requestId);
  if (!current.enabled) return json({ error: 'Runtime Wave 6 is installed but disabled.', code: 'RUNTIME_WAVE_6_DISABLED' }, 503, requestId);
  if (current.emergencyStopped) return json({ error: 'Runtime Wave 6 is under emergency stop.', code: 'RUNTIME_WAVE_6_EMERGENCY_STOPPED' }, 503, requestId);
  if (request.method !== 'POST') return json({ error: 'Method not allowed.', code: 'METHOD_NOT_ALLOWED' }, 405, requestId);

  const parsed = await parseBody(request, requestId);
  if (parsed.error) return parsed.error;

  const routes = new Map([
    ['/api/v1/runtime/v6/sbom/validate', () => validateSbom(parsed.body)],
    ['/api/v1/runtime/v6/dependencies/assess', () => assessDependencies(parsed.body)],
    ['/api/v1/runtime/v6/provenance/validate', () => validateProvenance(parsed.body)],
    ['/api/v1/runtime/v6/secrets/inspect', () => inspectSecretMarkers(parsed.body)],
    ['/api/v1/runtime/v6/iac/evaluate', () => evaluateIac(parsed.body)],
    ['/api/v1/runtime/v6/licenses/assess', () => assessLicenses(parsed.body)],
    ['/api/v1/runtime/v6/workflows/evaluate', () => evaluateWorkflow(parsed.body)],
    ['/api/v1/runtime/v6/artifacts/validate', () => validateArtifact(parsed.body)],
    ['/api/v1/runtime/v6/attestations/build', () => buildUnsignedAttestation(parsed.body)],
    ['/api/v1/runtime/v6/repository/evaluate', () => evaluateRepositoryPolicy(parsed.body)],
    ['/api/v1/runtime/v6/exceptions/validate', () => validateRiskException(parsed.body)],
    ['/api/v1/runtime/v6/releases/gate', () => evaluateReleaseGate(parsed.body)],
    ['/api/v1/runtime/v6/evidence/packet', () => buildSupplyChainEvidence(parsed.body)]
  ]);

  const handler = routes.get(url.pathname);
  if (!handler) return json({ error: 'Runtime Wave 6 API route not found.', code: 'RUNTIME_WAVE_6_ROUTE_NOT_FOUND' }, 404, requestId);
  const result = await handler();
  return json({ release: RUNTIME_WAVE_6_RELEASE, result }, result.valid === false ? 422 : 200, requestId);
}
