import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dashboard = JSON.parse(await readFile(new URL('../assets/data/master-dashboard.v1.json', import.meta.url), 'utf8'));
const dashboardUi = await readFile(new URL('../assets/governance-dashboard.js', import.meta.url), 'utf8');

test('master dashboard is public-safe and never stores raw chat', () => {
  assert.equal(dashboard.schemaVersion, '1.0.0');
  assert.equal(dashboard.publicSafe, true);
  assert.equal(dashboard.capturePolicy.rawChatStoredInRepository, false);
  assert.equal(dashboard.capturePolicy.secretsAllowed, false);
  assert.equal(dashboard.capturePolicy.personalSensitiveDataAllowed, false);
});

test('master dashboard preserves private-first public-graduation strategy', () => {
  assert.match(dashboard.northStar.strategy, /Owner\/private experimental capability first/i);
  assert.ok(dashboard.releaseLanes.ownerPilot);
  assert.ok(dashboard.releaseLanes.publicCandidate);
  assert.ok(dashboard.releaseLanes.watch);
  assert.ok(dashboard.releaseLanes.reject);
  assert.ok(dashboard.graduationGates.length >= 10);
});

test('innovation radar is globally diverse and implementation-oriented', () => {
  assert.ok(dashboard.innovationRadar.length >= 10);
  const regions = new Set(dashboard.innovationRadar.map((item) => item.region));
  assert.ok([...regions].some((region) => region.includes('China')));
  assert.ok([...regions].some((region) => region.includes('Japan')));
  assert.ok([...regions].some((region) => region.includes('Europe')));
  assert.ok(dashboard.innovationRadar.every((item) => item.source && item.whatSakthiAILearns && item.risk && item.action));
});

test('dashboard prioritizes durable architecture over feature-count cloning', () => {
  assert.ok(dashboard.decisions.some((item) => item.id === 'DEC-2026-08-28-004'));
  assert.equal(dashboard.priorityBuilds[0].id, 'P0-TASKSTATE');
  assert.ok(dashboard.northStar.moats.includes('checkpointed resumable long-running agents'));
});

test('governance UI renders the master dashboard and innovation radar', () => {
  for (const marker of ['sakthiMasterDashboard', 'master-dashboard.v1.json', 'Global AI innovation radar', 'Owner-pilot → public graduation gates', 'Distilled only']) {
    assert.ok(dashboardUi.includes(marker), `dashboard UI missing marker: ${marker}`);
  }
});
