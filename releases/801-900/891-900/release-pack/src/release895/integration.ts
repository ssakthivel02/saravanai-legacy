export const RELEASE_895_INTEGRATION = Object.freeze({
  release: 895,
  capability: "End-to-End Critical Journey Test Programme",
  featureFlag: "release_895_enabled",
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
