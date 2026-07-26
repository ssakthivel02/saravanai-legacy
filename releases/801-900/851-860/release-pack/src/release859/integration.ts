export const RELEASE_859_INTEGRATION = Object.freeze({
  release: 859,
  capability: "Trust Incident Disclosure and Correction",
  featureFlag: "release_859_enabled",
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
