# Release 082 — Regional Data Controls

## Objective

Enforce regional storage, processing and transfer policies with explicit exceptions and legal review requirements.

## Delivered architecture

- Tenant-scoped `regional-data-policies` contract.
- Versioned D1 persistence and immutable event evidence.
- Default-deny validation policy.
- Read-only status API and controlled write boundary.
- Security, privacy, resilience and rollback requirements.

## Control rules

- `region_required`
- `storage_region_required`
- `processing_region_required`
- `cross_region_transfer_mechanism_required`
- `legal_review_for_exception`

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
