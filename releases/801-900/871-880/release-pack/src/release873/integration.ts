export const RELEASE_873_INTEGRATION = Object.freeze({
  release: 873,
  capability: "Synthetic Data and Privacy Boundary",
  featureFlag: "release_873_enabled",
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
