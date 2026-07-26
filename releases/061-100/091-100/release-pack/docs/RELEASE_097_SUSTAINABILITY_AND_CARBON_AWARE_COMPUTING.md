# Release 097 — Sustainability and Carbon-Aware Computing

## Objective

Measure estimated workload impact, prefer efficient free-first routes and schedule deferrable work without reducing safety.

## Delivered architecture

- Tenant-scoped `carbon-aware-policies` contract.
- Versioned D1 persistence and immutable event evidence.
- Default-deny validation policy.
- Read-only status API and controlled write boundary.
- Security, privacy, resilience and rollback requirements.

## Control rules

- `measurement_method_required`
- `delay_non_negative`
- `safety_override_always_available`
- `security_never_deferred`
- `cost_and_carbon_do_not_override_safety`

## Acceptance criteria

- [ ] Positive and negative-path tests pass.
- [ ] Cross-tenant access is denied.
- [ ] Secrets and sensitive payloads are excluded from telemetry.
- [ ] D1 migration is tested against a non-production database.
- [ ] Rollback and restore evidence is attached.
- [ ] Required human approvals are recorded.
- [ ] No paid provider, Unified Billing or public registration is enabled.

## Rollout boundary

This release is an additive engineering foundation. It does not activate production writes,
public access, external billing or autonomous high-impact actions.

## Rollback

Disable the release feature flag, stop new writes, revert the integration commit and restore
the last verified D1 backup when needed. Preserve audit, incident and evidence records.
