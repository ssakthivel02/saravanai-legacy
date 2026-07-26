export const RELEASE_826_INTEGRATION = Object.freeze({
  release: 826,
  capability: "Agent Sandbox Network and File Boundary",
  featureFlag: "release_826_enabled",
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
