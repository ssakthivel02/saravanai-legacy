export const RELEASE_867_INTEGRATION = Object.freeze({
  release: 867,
  capability: "Regional Consent and Notice Orchestration",
  featureFlag: "release_867_enabled",
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
