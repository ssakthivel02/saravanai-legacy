export const RELEASE_817_INTEGRATION = Object.freeze({
  release: 817,
  capability: "AI Request Idempotency and Replay Protection",
  featureFlag: "release_817_enabled",
  defaultEnabled: false,
  requiredMiddleware: [
    "request_context",
    "authentication",
    "tenant_resolution",
    "authorisation",
    "schema_validation",
    "budget_and_rate_limit",
    "audit_metadata"
  ],
  productionMigrationAutomatic: false,
  autonomousProductionWritesEnabled: false,
  killSwitchRequired: true
});
