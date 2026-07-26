export const RELEASE_891_INTEGRATION = Object.freeze({
  release: 891,
  capability: "Enterprise Platform v8 Runtime Capability Map",
  featureFlag: "release_891_enabled",
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
