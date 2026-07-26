import test from 'node:test';
import assert from 'node:assert/strict';
import { validateArtifact } from '../src/runtime-v6/artifact.js';
import { buildUnsignedAttestation } from '../src/runtime-v6/attestation.js';
import { ownerBoundary, runtimeState } from '../src/runtime-v6/core.js';
import { assessDependencies } from '../src/runtime-v6/dependency.js';
import { buildSupplyChainEvidence } from '../src/runtime-v6/evidence.js';
import { validateRiskException } from '../src/runtime-v6/exception.js';
import { evaluateIac } from '../src/runtime-v6/iac.js';
import { assessLicenses } from '../src/runtime-v6/licenses.js';
import { validateProvenance } from '../src/runtime-v6/provenance.js';
import { evaluateReleaseGate } from '../src/runtime-v6/release-gate.js';
import { evaluateRepositoryPolicy } from '../src/runtime-v6/repository.js';
import { inspectSecretMarkers } from '../src/runtime-v6/secrets.js';
import { validateSbom } from '../src/runtime-v6/sbom.js';
import { evaluateWorkflow } from '../src/runtime-v6/workflow.js';
import { handleRuntimeWave6, RUNTIME_WAVE_6_RELEASE } from '../src/runtime-wave6.js';

const headers = {
  'cf-access-authenticated-user-email': 'owner@example.com',
  'cf-access-jwt-assertion': 'verified'
};
const enabled = {
  OWNER_EMAIL: 'owner@example.com',
  RUNTIME_WAVE6_ENABLED: 'true',
  RUNTIME_WAVE6_EMERGENCY_STOP: 'false'
};
const request = (url, init = {}) => new Request(url, { ...init, headers: { ...headers, ...(init.headers || {}) } });

test('release stable', () => assert.equal(RUNTIME_WAVE_6_RELEASE, 'runtime-wave-6.0.0'));
test('defaults disabled and stopped', () => { const s = runtimeState({}); assert.equal(s.enabled, false); assert.equal(s.emergencyStopped, true); assert.equal(s.operational, false); });
test('operational requires both flags', () => assert.equal(runtimeState(enabled).operational, true));
test('all active side effects remain false', () => {
  const s = runtimeState(enabled);
  assert.equal(s.externalScannersEnabled, false);
  assert.equal(s.repositoryWritesEnabled, false);
  assert.equal(s.artifactSigningEnabled, false);
  assert.equal(s.paidSecurityServicesEnabled, false);
});
test('owner boundary requires Access JWT', () => assert.equal(ownerBoundary(new Request('https://x', { headers: { 'cf-access-authenticated-user-email': 'owner@example.com' } }), enabled).allowed, false));

test('CycloneDX SBOM validates', () => {
  const r = validateSbom({ format: 'cyclonedx-json', components: [{ name: 'pkg', version: '1.0.0', type: 'library', purl: 'pkg:npm/pkg@1.0.0' }] });
  assert.equal(r.valid, true);
  assert.equal(r.summary.generated, false);
});
test('SBOM rejects duplicate component', () => assert.equal(validateSbom({ format: 'spdx-json', components: [
  { name: 'a', version: '1', type: 'library' },
  { name: 'A', version: '1', type: 'library' }
] }).valid, false));
test('SBOM rejects invalid PURL', () => assert.equal(validateSbom({ format: 'cyclonedx-json', components: [{ name: 'a', version: '1', type: 'library', purl: 'http://x' }] }).valid, false));

test('critical dependency blocks', () => {
  const r = assessDependencies({ dependencies: [{ name: 'a', version: '1', severity: 'critical', cvss: 9.8 }] });
  assert.equal(r.assessment.decision, 'block');
  assert.equal(r.assessment.externalLookupPerformed, false);
});
test('high dependency with mitigation does not hard block', () => assert.equal(assessDependencies({ dependencies: [{ name: 'a', version: '1', severity: 'high', mitigation: 'isolated' }] }).assessment.blockedCount, 0));
test('known exploited dependency blocks', () => assert.equal(assessDependencies({ dependencies: [{ name: 'a', version: '1', severity: 'medium', knownExploited: true }] }).assessment.blockedCount, 1));

test('provenance validates supplied metadata', () => {
  const r = validateProvenance({
    repository: 'https://github.com/ssakthivel02/sakthiai',
    commitSha: 'a'.repeat(40),
    builder: 'github-actions',
    workflowRef: '.github/workflows/test.yml@refs/heads/main',
    artifactSha256: 'b'.repeat(64),
    branch: 'main'
  });
  assert.equal(r.valid, true);
  assert.equal(r.provenance.attestationCreated, false);
});
test('provenance rejects unverified signature claim', () => assert.equal(validateProvenance({
  repository: 'https://github.com/a/b',
  commitSha: 'a'.repeat(40),
  builder: 'github-actions',
  workflowRef: 'x',
  artifactSha256: 'b'.repeat(64),
  branch: 'main',
  signed: true
}).valid, false));

test('secret marker redacts token', async () => {
  const r = await inspectSecretMarkers({ path: 'config.txt', content: 'Authorization: Bearer abcdefghijklmnopqrstuvwxyz123456' });
  assert.equal(r.valid, true);
  assert.equal(r.inspection.suspectedSecretCount, 1);
  assert.match(r.inspection.redactedPreview, /SECRET_REDACTED/);
});
test('secret inspection does not claim exhaustive scan', async () => assert.equal((await inspectSecretMarkers({ path: 'a.txt', content: 'safe' })).inspection.exhaustiveDetectionClaim, false));
test('private key marker blocks', async () => assert.equal((await inspectSecretMarkers({ path: 'x', content: '-----BEGIN PRIVATE KEY-----' })).inspection.decision, 'block-and-rotate-review'));

test('IaC public database blocks', () => assert.equal(evaluateIac({ resources: [{ id: 'db', type: 'database', public: true, encryptedAtRest: true, backupEnabled: true }] }).assessment.decision, 'block'));
test('IaC public SSH blocks', () => assert.equal(evaluateIac({ resources: [{ id: 'fw', type: 'firewall-rule', source: '0.0.0.0/0', port: 22 }] }).assessment.violationCount, 1));
test('IaC wildcard identity blocks', () => assert.equal(evaluateIac({ resources: [{ id: 'iam', type: 'identity-policy', actions: ['*'] }] }).assessment.violationCount, 1));
test('IaC makes no change', () => assert.equal(evaluateIac({ resources: [{ id: 'q', type: 'queue' }] }).assessment.infrastructureChanged, false));

test('MIT license allowlisted', () => assert.equal(assessLicenses({ components: [{ name: 'a', license: 'MIT' }] }).assessment.reviewRequired, false));
test('AGPL requires review without legal conclusion', () => {
  const r = assessLicenses({ components: [{ name: 'a', license: 'AGPL-3.0' }] });
  assert.equal(r.assessment.reviewRequired, true);
  assert.equal(r.assessment.legalConclusionProvided, false);
});
test('unknown licence requires review', () => assert.equal(assessLicenses({ components: [{ name: 'a', license: 'Custom' }] }).assessment.reviewRequired, true));

test('workflow baseline valid', () => assert.equal(evaluateWorkflow({
  name: 'Validate',
  event: 'pull_request',
  permissions: { contents: 'read' },
  actions: [{ uses: 'actions/checkout@v4' }]
}).valid, true));
test('third-party action must pin SHA', () => assert.equal(evaluateWorkflow({
  name: 'Validate',
  event: 'pull_request',
  permissions: { contents: 'read' },
  actions: [{ uses: 'vendor/tool@v1' }]
}).valid, false));
test('write workflow permission rejected', () => assert.equal(evaluateWorkflow({
  name: 'Deploy',
  event: 'push',
  permissions: { contents: 'write' },
  actions: [{ uses: 'actions/checkout@v4' }]
}).valid, false));
test('pull request secrets rejected', () => assert.equal(evaluateWorkflow({
  name: 'Validate',
  event: 'pull_request',
  permissions: { contents: 'read' },
  actions: [{ uses: 'actions/checkout@v4', secretsInPullRequest: true }]
}).valid, false));

test('artifact metadata valid but no execution', () => {
  const r = validateArtifact({ name: 'release.zip', sha256: 'a'.repeat(64), sizeBytes: 1000 });
  assert.equal(r.valid, true);
  assert.equal(r.artifact.executed, false);
});
test('executable artifact denied', () => assert.equal(validateArtifact({ name: 'release.zip', sha256: 'a'.repeat(64), sizeBytes: 1000, executable: true }).valid, false));
test('unknown artifact extension denied', () => assert.equal(validateArtifact({ name: 'release.exe', sha256: 'a'.repeat(64), sizeBytes: 1000 }).valid, false));

test('unsigned attestation built without claims', async () => {
  const r = await buildUnsignedAttestation({
    subjectName: 'release.zip',
    subjectDigest: 'a'.repeat(64),
    repository: 'https://github.com/a/b',
    commitSha: 'b'.repeat(40),
    builder: 'github-actions'
  });
  assert.equal(r.valid, true);
  assert.equal(r.attestation.signed, false);
  assert.equal(r.attestation.slsaLevelClaim, null);
});
test('attestation rejects bad digest', async () => assert.equal((await buildUnsignedAttestation({
  subjectName: 'a', subjectDigest: 'bad', repository: 'x', commitSha: 'b'.repeat(40), builder: 'x'
})).valid, false));

test('repository baseline passes', () => assert.equal(evaluateRepositoryPolicy({
  defaultBranch: 'main',
  branchProtectionEnabled: true,
  requiredApprovals: 1,
  requiredChecks: ['SakthiAI validation'],
  forcePushAllowed: false,
  deletionAllowed: false,
  dismissStaleReviews: true
}).valid, true));
test('repository force push rejected', () => assert.equal(evaluateRepositoryPolicy({
  defaultBranch: 'main',
  branchProtectionEnabled: true,
  requiredApprovals: 1,
  requiredChecks: ['x'],
  forcePushAllowed: true,
  dismissStaleReviews: true
}).valid, false));
test('repository evaluation makes no changes', () => assert.equal(evaluateRepositoryPolicy({}).policy.repositoryChanged, false));

test('bounded risk exception eligible for review', () => {
  const r = validateRiskException({
    controlId: 'DEP-001',
    rationale: 'Temporary upstream compatibility issue.',
    owner: 'owner@example.com',
    compensatingControls: ['Isolation and monitoring'],
    durationDays: 30
  });
  assert.equal(r.valid, true);
  assert.equal(r.exception.automaticallyApproved, false);
});
test('risk exception over 90 days rejected', () => assert.equal(validateRiskException({
  controlId: 'DEP-001',
  rationale: 'Temporary upstream compatibility issue.',
  owner: 'owner@example.com',
  compensatingControls: ['Isolation'],
  durationDays: 120
}).valid, false));

const fullEvidence = {
  tests: 'pass', secrets: 'pass', dependencies: 'pass', sbom: 'pass',
  provenance: 'pass', iac: 'pass', licenses: 'pass', workflow: 'pass'
};
test('release gate requires human approval', () => {
  const r = evaluateReleaseGate({ releaseId: 'r1', evidence: fullEvidence });
  assert.equal(r.valid, true);
  assert.equal(r.gate.decision, 'eligible-for-human-approval');
  assert.equal(r.gate.humanApprovalRequired, true);
});
test('release gate blocks missing evidence', () => assert.equal(evaluateReleaseGate({ releaseId: 'r1', evidence: { tests: 'pass' } }).valid, false));
test('release gate denies auto merge', () => assert.equal(evaluateReleaseGate({ releaseId: 'r1', evidence: fullEvidence, autoMergeRequested: true }).valid, false));

test('evidence packet hashes payload but does not sign', async () => {
  const r = await buildSupplyChainEvidence({ releaseId: 'r1', controls: [{ id: 'SBOM', result: 'pass' }] });
  assert.equal(r.valid, true);
  assert.equal(r.packet.payloadSha256.length, 64);
  assert.equal(r.packet.signed, false);
  assert.equal(r.packet.certificationClaim, false);
});

test('public status safe while disabled', async () => {
  const response = await handleRuntimeWave6(new Request('https://x/api/v1/runtime/v6/status'), {}, new URL('https://x/api/v1/runtime/v6/status'));
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.operational, false);
  assert.equal(body.externalScannersEnabled, false);
});
test('private route requires Access', async () => {
  const response = await handleRuntimeWave6(new Request('https://x/api/v1/runtime/v6/sbom/validate', { method: 'POST', body: '{}' }), enabled, new URL('https://x/api/v1/runtime/v6/sbom/validate'));
  assert.equal(response.status, 401);
});
test('disabled runtime blocks private route', async () => {
  const r = request('https://x/api/v1/runtime/v6/sbom/validate', { method: 'POST', body: '{}' });
  const response = await handleRuntimeWave6(r, { OWNER_EMAIL: 'owner@example.com' }, new URL(r.url));
  assert.equal((await response.json()).code, 'RUNTIME_WAVE_6_DISABLED');
});
test('emergency stop blocks private route', async () => {
  const r = request('https://x/api/v1/runtime/v6/sbom/validate', { method: 'POST', body: '{}' });
  const response = await handleRuntimeWave6(r, { OWNER_EMAIL: 'owner@example.com', RUNTIME_WAVE6_ENABLED: 'true' }, new URL(r.url));
  assert.equal((await response.json()).code, 'RUNTIME_WAVE_6_EMERGENCY_STOPPED');
});
test('operational owner can evaluate release without side effects', async () => {
  const r = request('https://x/api/v1/runtime/v6/releases/gate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ releaseId: 'r1', evidence: fullEvidence })
  });
  const response = await handleRuntimeWave6(r, enabled, new URL(r.url));
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.result.gate.autoMergeExecuted, false);
  assert.equal(body.result.gate.deploymentExecuted, false);
});
