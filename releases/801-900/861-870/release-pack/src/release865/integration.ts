export const RELEASE_865_INTEGRATION = Object.freeze({
  release: 865,
  capability: "Accessibility Preference and Adaptation Runtime",
  featureFlag: "release_865_enabled",
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
