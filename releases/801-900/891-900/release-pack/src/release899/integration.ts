export const RELEASE_899_INTEGRATION = Object.freeze({
  release: 899,
  capability: "Enterprise Platform v8 General Availability Board",
  featureFlag: "release_899_enabled",
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
