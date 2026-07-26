export const RELEASE_804_INTEGRATION = Object.freeze({
  release: 804,
  capability: "RBAC and ABAC Decision Engine v2",
  featureFlag: "release_804_enabled",
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
