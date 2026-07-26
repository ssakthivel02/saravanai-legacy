# Release 224 — Problem and Root-Cause Management
## Objective
Track recurring failures, hypotheses, causes and corrective actions.
## Controls
- `release_224_owner_required`
- `release_224_evidence_required`
- `release_224_tenant_scope_required`
- `release_224_rollback_required`
## Boundaries
Trusted identity and tenant context, default deny, least privilege, evidence-backed decisions, privacy-safe telemetry, disabled paid activation and separate production approval.
## Acceptance
- [ ] Positive and negative tests pass.
- [ ] Cross-tenant access is denied.
- [ ] Schema and API contracts are versioned.
- [ ] Threat, privacy, cost and rollback reviews are recorded.
- [ ] Residual risks have owners and review dates.
## Rollback
Disable the feature flag, revert the implementation commit, restore verified data if required and preserve audit evidence.
