import test from 'node:test';
import assert from 'node:assert/strict';
import { tenantStoragePolicy, tenantStorageReadiness } from '../src/tenant-storage-policy.js';

const db = { prepare() {} };

test('storage is disabled and stopped by default', () => {
  const policy = tenantStoragePolicy({});
  assert.equal(policy.persistenceEnabled, false);
  assert.equal(policy.emergencyStopped, true);
  assert.equal(policy.readsOperational, false);
  assert.equal(policy.writesOperational, false);
});

test('read-only pilot requires complete verified chain and schema', () => {
  const policy = tenantStoragePolicy({
    SAKTHI_DB: db,
    TENANT_PERSISTENCE_ENABLED: 'true',
    TENANT_PERSISTENCE_EMERGENCY_STOP: 'false',
    TENANT_SCHEMA_VERSION: '0009',
    ACCESS_JWT_ENFORCEMENT_ENABLED: 'true',
    ACCESS_ROUTE_AUTHORIZATION_ENABLED: 'true'
  });
  assert.equal(policy.readsOperational, true);
  assert.equal(policy.writesOperational, false);
  assert.equal(tenantStorageReadiness({}).schema.automaticMigration, false);
});

test('writes need every independent gate', () => {
  const base = {
    SAKTHI_DB: db,
    TENANT_PERSISTENCE_ENABLED: 'true',
    TENANT_PERSISTENCE_EMERGENCY_STOP: 'false',
    TENANT_SCHEMA_VERSION: '0009',
    ACCESS_JWT_ENFORCEMENT_ENABLED: 'true',
    ACCESS_ROUTE_AUTHORIZATION_ENABLED: 'true',
    TENANT_SERVER_WRITES_ENABLED: 'true'
  };
  assert.equal(tenantStoragePolicy(base).writesOperational, false);
  assert.equal(tenantStoragePolicy({ ...base, ACCESS_SERVER_MUTATIONS_ENABLED: 'true' }).writesOperational, true);
});