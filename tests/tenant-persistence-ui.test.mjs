import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveTenantPersistenceView } from '../assets/tenant-persistence.js';

test('shows prepared state while operations are disabled', () => {
  const view = deriveTenantPersistenceView({ persistence: {
    context: { valid: false },
    storage: {
      bindingPresent: false,
      schema: { required: '0009', ready: false, automaticMigration: false },
      operations: { readsOperational: false, writesOperational: false }
    }
  } });
  assert.equal(view.tone, 'planned');
  assert.match(view.title, /prepared/i);
  assert.equal(view.metrics.writes, 'Disabled');
  assert.equal(view.metrics.migration, 'Manual only');
});

test('shows active only for operational metadata reads', () => {
  const view = deriveTenantPersistenceView({ persistence: {
    context: { valid: true },
    storage: {
      bindingPresent: true,
      schema: { configured: '0009', ready: true, automaticMigration: false },
      operations: { readsOperational: true, writesOperational: false }
    }
  } });
  assert.equal(view.tone, 'ready');
  assert.equal(view.metrics.reads, 'Operational');
});