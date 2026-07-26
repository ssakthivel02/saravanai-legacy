export const RELEASE_870_INTEGRATION = Object.freeze({
  release: 870,
  capability: "Global Regional and Accessibility Activation Gate",
  featureFlag: "release_870_enabled",
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
