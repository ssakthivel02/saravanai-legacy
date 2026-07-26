import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RUNTIME_WAVE_7_RELEASE, RUNTIME_WAVE_8_RELEASE, RUNTIME_WAVE_9_RELEASE,
  RUNTIME_WAVE_10_RELEASE, RUNTIME_WAVE_11_RELEASE,
  handleRuntimeWave7, handleRuntimeWave8, handleRuntimeWave9, handleRuntimeWave10, handleRuntimeWave11,
  __test
} from '../src/runtime-waves7-11.js';

const accessHeaders = {
  'cf-access-authenticated-user-email': 'owner@example.com',
  'cf-access-jwt-assertion': 'verified'
};
const envFor = (wave, overrides = {}) => ({
  OWNER_EMAIL: 'owner@example.com',
  [`RUNTIME_WAVE${wave}_ENABLED`]: 'true',
  [`RUNTIME_WAVE${wave}_EMERGENCY_STOP`]: 'false',
  ...overrides
});
const request = (url, body, headers = {}) => new Request(url, {
  method: 'POST',
  headers: { ...accessHeaders, 'content-type': 'application/json', ...headers },
  body: JSON.stringify(body)
});

test('release identifiers are stable', () => {
  assert.equal(RUNTIME_WAVE_7_RELEASE, 'runtime-wave-7.0.0');
  assert.equal(RUNTIME_WAVE_8_RELEASE, 'runtime-wave-8.0.0');
  assert.equal(RUNTIME_WAVE_9_RELEASE, 'runtime-wave-9.0.0');
  assert.equal(RUNTIME_WAVE_10_RELEASE, 'runtime-wave-10.0.0');
  assert.equal(RUNTIME_WAVE_11_RELEASE, 'runtime-wave-11.0.0');
});
for (const wave of [7,8,9,10,11]) {
  test(`wave ${wave} defaults disabled and stopped`, () => {
    const s = __test.state(wave, {});
    assert.equal(s.enabled, false);
    assert.equal(s.emergencyStopped, true);
    assert.equal(s.operational, false);
    assert.equal(s.productionWritesEnabled, false);
  });
}
test('owner boundary requires Access JWT', () => {
  const req = new Request('https://x', { headers: { 'cf-access-authenticated-user-email': 'owner@example.com' } });
  assert.equal(__test.ownerBoundary(req, envFor(7)).allowed, false);
});
test('owner boundary rejects non-owner', () => {
  const req = new Request('https://x', { headers: { ...accessHeaders, 'cf-access-authenticated-user-email': 'other@example.com' } });
  assert.equal(__test.ownerBoundary(req, envFor(7)).code, 'OWNER_ACCESS_DENIED');
});

test('complete model card validates without registration', () => {
  const r = __test.modelCard({
    name: 'Sakthi Model', version: '1.0.0', owner: 'owner@example.com',
    intendedUse: 'Owner-assisted research and reviewed drafting.',
    prohibitedUses: ['Autonomous high-impact decisions'],
    limitations: ['May produce incorrect statements'],
    evaluationSets: ['safety-v1']
  });
  assert.equal(r.valid, true);
  assert.equal(r.modelCard.registered, false);
});
test('model card requires limitations', () => assert.equal(__test.modelCard({
  name:'x', version:'1', owner:'a@b.com', intendedUse:'A sufficiently long intended use statement.',
  prohibitedUses:['x'], evaluationSets:['x']
}).valid, false));
test('evaluation blocks failed metric', () => {
  const r = __test.evaluationAssurance({ metrics:[{name:'accuracy',score:.7,threshold:.8}],redTeamCompleted:true,safetyReviewCompleted:true });
  assert.equal(r.assessment.decision, 'block');
});
test('evaluation requires red team', () => assert.equal(__test.evaluationAssurance({
  metrics:[{name:'accuracy',score:.9,threshold:.8}],safetyReviewCompleted:true
}).valid, false));
test('model risk tier 4 for autonomous use', () => assert.equal(__test.modelRisk({
  impact:'medium',autonomy:'autonomous',dataSensitivity:'internal'
}).classification.tier,4));
test('model change gate requires all evidence', () => assert.equal(__test.modelChangeGate({
  evidence:{modelCard:'pass'}
}).valid,false));
test('model change gate never deploys', () => assert.equal(__test.modelChangeGate({
  evidence:{modelCard:'pass',evaluation:'pass',redTeam:'pass',privacy:'pass',security:'pass',rollback:'pass'}
}).gate.deployed,false));

test('data classification validates', () => assert.equal(__test.dataClassify({
  fields:[{name:'email',classification:'personal'}]
}).valid,true));
test('data classification rejects unknown class', () => assert.equal(__test.dataClassify({
  fields:[{name:'email',classification:'secretish'}]
}).valid,false));
test('personal retention over two years requires review', () => assert.equal(__test.retentionEvaluate({
  classification:'personal',retentionDays:1000,legalBasis:'contract'
}).valid,false));
test('deletion plan never deletes', () => assert.equal(__test.deletionPlan({
  systems:['crm'],subjectReference:'case-1',approvals:['owner']
}).plan.deletionExecuted,false));
test('residency blocks non-allowlisted target', () => assert.equal(__test.residencyAssess({
  sourceRegion:'GB',targetRegion:'US',allowedRegions:['GB','EU']
}).valid,false));
test('DSAR requires identity verification', () => assert.equal(__test.dsarValidate({
  requestType:'access',scope:['profile']
}).valid,false));
test('DSAR never generates export', () => assert.equal(__test.dsarValidate({
  requestType:'access',identityVerified:true,scope:['profile']
}).request.exportGenerated,false));

test('API contract validates reviewed routes', () => assert.equal(__test.apiContract({
  title:'API',version:'1.0.0',paths:[{route:'/status',method:'GET',auth:'public-status'}]
}).valid,true));
test('API contract rejects invalid auth', () => assert.equal(__test.apiContract({
  title:'API',version:'1.0.0',paths:[{route:'/x',method:'POST',auth:'none'}]
}).valid,false));
test('compatibility detects removed required field', () => assert.equal(__test.compatibilityCheck({
  previous:{required:['id']},proposed:{required:[]}
}).compatibility.breaking,true));
test('anonymous quota constrained', () => assert.equal(__test.quotaEvaluate({
  requestsPerMinute:1000,burst:1000,anonymous:true
}).valid,false));
test('webhook requires HTTPS', () => assert.equal(__test.webhookValidate({
  url:'http://example.com',events:['x'],secretConfigured:true
}).valid,false));
test('webhook rejects metadata endpoint', () => assert.equal(__test.webhookValidate({
  url:'https://169.254.169.254/x',events:['x'],secretConfigured:true
}).valid,false));
test('idempotency required for POST', () => assert.equal(__test.idempotencyCheck({
  method:'POST',ttlSeconds:3600,keyRequired:false
}).valid,false));
test('integration controls never call external systems', () => assert.equal(__test.webhookValidate({
  url:'https://example.com/hook',events:['x'],secretConfigured:true
}).webhook.sent,false));

test('BIA validates service RTO', () => assert.equal(__test.biaAssess({
  services:[{name:'api',impact:'critical',rtoMinutes:30,rpoMinutes:5}]
}).valid,true));
test('BIA requires RTO', () => assert.equal(__test.biaAssess({
  services:[{name:'api',impact:'critical',rtoMinutes:0}]
}).valid,false));
test('recovery plan requires three steps', () => assert.equal(__test.recoveryPlan({
  steps:['one'],owners:['owner'],verification:['check']
}).valid,false));
test('dependency map rejects unknown node', () => assert.equal(__test.dependencyMap({
  nodes:['a'],edges:[{from:'a',to:'b'}]
}).valid,false));
test('tabletop requires two participants', () => assert.equal(__test.tabletopEvaluate({
  scenario:'A sufficiently detailed service outage scenario for testing.',
  participants:['one'],observations:['gap'],actions:['fix']
}).valid,false));
test('continuity gate requires all evidence', () => assert.equal(__test.continuityGate({
  evidence:{bia:'pass'}
}).valid,false));
test('continuity gate denies auto failover', () => assert.equal(__test.continuityGate({
  evidence:{bia:'pass',dependencyMap:'pass',recoveryPlan:'pass',backupReview:'pass',tabletop:'pass',communications:'pass'},
  autoFailoverRequested:true
}).valid,false));
test('resilience plan never executes failover', () => assert.equal(__test.continuityGate({
  evidence:{bia:'pass',dependencyMap:'pass',recoveryPlan:'pass',backupReview:'pass',tabletop:'pass',communications:'pass'}
}).gate.failoverExecuted,false));

test('control pass requires evidence', () => assert.equal(__test.controlsAssess({
  controls:[{id:'SEC-1',status:'pass'}]
}).valid,false));
test('control evidence does not claim certification', () => assert.equal(__test.controlsAssess({
  controls:[{id:'SEC-1',status:'pass',evidence:'test'}]
}).assessment.certificationClaimed,false));
test('trust packet hashes but does not publish', async () => {
  const r = await __test.trustPacket({organisation:'SakthiAI',scope:['runtime'],evidence:[{id:'SEC-1',result:'pass'}]});
  assert.equal(r.valid,true);
  assert.equal(r.packet.sha256.length,64);
  assert.equal(r.packet.published,false);
});
test('readiness weighted score calculated', () => assert.equal(__test.readinessScore({
  dimensions:[{name:'security',score:90,weight:50},{name:'privacy',score:80,weight:50}]
}).readiness.score,85));
test('exception closure remains human-controlled', () => assert.equal(__test.closeException({
  exceptionId:'EX-1',evidence:['fixed'],verifiedBy:'owner@example.com'
}).closure.closed,false));
test('launch gate requires all evidence', () => assert.equal(__test.launchGate({
  evidence:{security:'pass'}
}).valid,false));
test('launch gate denies certification claim', () => assert.equal(__test.launchGate({
  evidence:{security:'pass',privacy:'pass',resilience:'pass',operations:'pass',support:'pass',accessibility:'pass',legalReview:'pass',rollback:'pass'},
  certificationClaimRequested:true
}).valid,false));
test('launch gate never launches', () => assert.equal(__test.launchGate({
  evidence:{security:'pass',privacy:'pass',resilience:'pass',operations:'pass',support:'pass',accessibility:'pass',legalReview:'pass',rollback:'pass'}
}).gate.launchExecuted,false));

const handlers = {7:handleRuntimeWave7,8:handleRuntimeWave8,9:handleRuntimeWave9,10:handleRuntimeWave10,11:handleRuntimeWave11};
for (const wave of [7,8,9,10,11]) {
  test(`wave ${wave} public status is safe`, async () => {
    const url = new URL(`https://x/api/v1/runtime/v${wave}/status`);
    const res = await handlers[wave](new Request(url), {}, url);
    const body = await res.json();
    assert.equal(res.status,200);
    assert.equal(body.enabled,false);
    assert.equal(body.emergencyStopped,true);
    assert.equal(body.operational,false);
  });
  test(`wave ${wave} private route requires Access`, async () => {
    const paths = {7:'model-card/validate',8:'data/classify',9:'contracts/validate',10:'bia/assess',11:'controls/assess'};
    const url = new URL(`https://x/api/v1/runtime/v${wave}/${paths[wave]}`);
    const res = await handlers[wave](new Request(url,{method:'POST',body:'{}'}),envFor(wave),url);
    assert.equal(res.status,401);
  });
  test(`wave ${wave} disabled gate works`, async () => {
    const paths = {7:'model-card/validate',8:'data/classify',9:'contracts/validate',10:'bia/assess',11:'controls/assess'};
    const url = `https://x/api/v1/runtime/v${wave}/${paths[wave]}`;
    const req = request(url,{});
    const res = await handlers[wave](req,{OWNER_EMAIL:'owner@example.com'},new URL(url));
    assert.equal((await res.json()).code,`RUNTIME_WAVE_${wave}_DISABLED`);
  });
  test(`wave ${wave} emergency stop works`, async () => {
    const paths = {7:'model-card/validate',8:'data/classify',9:'contracts/validate',10:'bia/assess',11:'controls/assess'};
    const url = `https://x/api/v1/runtime/v${wave}/${paths[wave]}`;
    const req = request(url,{});
    const res = await handlers[wave](req,envFor(wave,{[`RUNTIME_WAVE${wave}_EMERGENCY_STOP`]:'true'}),new URL(url));
    assert.equal((await res.json()).code,`RUNTIME_WAVE_${wave}_EMERGENCY_STOPPED`);
  });
}
