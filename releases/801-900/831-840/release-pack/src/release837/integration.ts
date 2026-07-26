export const RELEASE_837_INTEGRATION = Object.freeze({
  release: 837,
  capability: "Contradiction and Source Conflict Resolver",
  featureFlag: "release_837_enabled",
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
