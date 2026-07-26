export const RELEASE_884_INTEGRATION = Object.freeze({
  release: 884,
  capability: "Cloud Resource Scheduling and Rightsizing",
  featureFlag: "release_884_enabled",
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
