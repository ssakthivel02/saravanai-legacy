export const RELEASE_846_INTEGRATION = Object.freeze({
  release: 846,
  capability: "Notification Preference and Delivery Runtime",
  featureFlag: "release_846_enabled",
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
