const TRUE_VALUES = new Set(['true', '1', 'yes', 'on']);

export const TENANT_STORAGE_RELEASE = 'tenant-persistence-foundation-1.0.0';
export const REQUIRED_SCHEMA_VERSION = '0009';

function enabled(value) {
  return TRUE_VALUES.has(String(value ?? '').trim().toLowerCase());
}

function stopped(value) {
  return String(value ?? 'true').trim().toLowerCase() !== 'false';
}

export function tenantStoragePolicy(env = {}) {
  const bindingPresent = Boolean(env.SAKTHI_DB && typeof env.SAKTHI_DB.prepare === 'function');
  const persistenceEnabled = enabled(env.TENANT_PERSISTENCE_ENABLED);
  const emergencyStopped = stopped(env.TENANT_PERSISTENCE_EMERGENCY_STOP);
  const serverWritesRequested = enabled(env.TENANT_SERVER_WRITES_ENABLED);
  const accessJwtEnforced = enabled(env.ACCESS_JWT_ENFORCEMENT_ENABLED);
  const routeAuthorisationEnabled = enabled(env.ACCESS_ROUTE_AUTHORIZATION_ENABLED);
  const mutationGateEnabled = enabled(env.ACCESS_SERVER_MUTATIONS_ENABLED);
  const schemaVersion = String(env.TENANT_SCHEMA_VERSION || '').trim();
  const schemaReady = schemaVersion === REQUIRED_SCHEMA_VERSION;

  const readsOperational = bindingPresent && persistenceEnabled && !emergencyStopped && schemaReady && accessJwtEnforced && routeAuthorisationEnabled;
  const writesOperational = readsOperational && serverWritesRequested && mutationGateEnabled;
  const valid = !serverWritesRequested || (persistenceEnabled && accessJwtEnforced && routeAuthorisationEnabled && mutationGateEnabled);

  let activation = 'prepared-disabled-by-default';
  if (!bindingPresent) activation = 'blocked-d1-binding-missing';
  else if (persistenceEnabled && emergencyStopped) activation = 'emergency-stopped';
  else if (persistenceEnabled && !schemaReady) activation = 'blocked-schema-version-unverified';
  else if (persistenceEnabled && (!accessJwtEnforced || !routeAuthorisationEnabled)) activation = 'blocked-access-controls-incomplete';
  else if (writesOperational) activation = 'controlled-read-write-pilot';
  else if (readsOperational) activation = 'controlled-read-only-pilot';

  return Object.freeze({
    release: TENANT_STORAGE_RELEASE,
    requiredSchemaVersion: REQUIRED_SCHEMA_VERSION,
    configuredSchemaVersion: schemaVersion || null,
    bindingPresent,
    persistenceEnabled,
    emergencyStopped,
    accessJwtEnforced,
    routeAuthorisationEnabled,
    mutationGateEnabled,
    serverWritesRequested,
    schemaReady,
    readsOperational,
    writesOperational,
    valid,
    migrationAutomaticallyExecuted: false,
    publicRegistration: false,
    paidServicesRequired: false,
    activation
  });
}

export function tenantStorageReadiness(env = {}) {
  const policy = tenantStoragePolicy(env);
  return {
    release: policy.release,
    activation: policy.activation,
    valid: policy.valid,
    bindingPresent: policy.bindingPresent,
    schema: {
      required: policy.requiredSchemaVersion,
      configured: policy.configuredSchemaVersion,
      ready: policy.schemaReady,
      automaticMigration: false
    },
    operations: {
      readsOperational: policy.readsOperational,
      writesOperational: policy.writesOperational,
      serverWritesRequested: policy.serverWritesRequested
    },
    safety: {
      emergencyStopped: policy.emergencyStopped,
      publicRegistration: false,
      paidServicesRequired: false,
      tenantIdsExposed: false,
      emailsPersisted: false
    }
  };
}

export const __test = { enabled, stopped, TRUE_VALUES };