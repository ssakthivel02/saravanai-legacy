import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveTenantLifecycleView } from '../assets/tenant-lifecycle.js';

test('UI reports prepared state without claiming production lifecycle actions', () => {
  const view = deriveTenantLifecycleView({
    lifecycle: {
      rehearsal: { requiredStages: Array(9).fill('stage') },
      backup: { runtimeBackupExecutionEnabled: false },
      restore: { automaticRestoreEnabled: false },
      isolation: { requiredCases: Array(8).fill('case') },
      deletion: { hardDeleteImplemented: false },
      recovery: { operational: false, evidenceComplete: false, emergencyStopped: true }
    }
  });
  assert.equal(view.title, 'Tenant lifecycle assurance is prepared');
  assert.equal(view.metrics.backup, 'Evidence only');
  assert.equal(view.metrics.restore, 'Manual drill only');
  assert.equal(view.metrics.deletion, 'Preview only');
});

test('UI distinguishes complete owner-reviewed assurance without production claims', () => {
  const view = deriveTenantLifecycleView({
    lifecycle: {
      recovery: { operational: true, evidenceComplete: true, emergencyStopped: false },
      backup: {}, restore: {}, isolation: {}, deletion: {}
    }
  });
  assert.equal(view.tone, 'ready');
  assert.match(view.summary, /Production migration, restore, deletion and writes remain prohibited/);
});
