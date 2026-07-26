export const RELEASE_882_INTEGRATION = Object.freeze({
  release: 882,
  capability: "Tenant Quota and Fair-Use Runtime",
  featureFlag: "release_882_enabled",
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
