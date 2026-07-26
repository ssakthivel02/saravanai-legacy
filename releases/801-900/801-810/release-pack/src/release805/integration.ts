export const RELEASE_805_INTEGRATION = Object.freeze({
  release: 805,
  capability: "Privileged Session and Step-Up Control",
  featureFlag: "release_805_enabled",
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
