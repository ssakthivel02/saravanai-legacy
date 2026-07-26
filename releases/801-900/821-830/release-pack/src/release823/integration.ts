export const RELEASE_823_INTEGRATION = Object.freeze({
  release: 823,
  capability: "Tool Lease and Scoped Capability Runtime",
  featureFlag: "release_823_enabled",
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
