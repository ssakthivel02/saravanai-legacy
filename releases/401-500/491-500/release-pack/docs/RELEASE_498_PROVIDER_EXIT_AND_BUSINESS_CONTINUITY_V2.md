# Release 498 — Provider Exit and Business Continuity v2

    ## Objective

    Test exports, replacement capacity, credential revocation, supplier exit and continuity.

    ## Capability class

    `plan`

    ## Core contract

    - `planId` — `string`
- `tenantId` — `string`
- `owner` — `string`
- `objective` — `string`
- `dependencyRefs` — `string[]`
- `milestoneIds` — `string[]`
- `evidenceRefs` — `string[]`
- `rollbackOrExitRef` — `string`
- `approvedBy` — `string | undefined`
- `status` — `'draft' | 'approved' | 'active' | 'completed' | 'retired'`

    ## Mandatory controls

    - `owner_accountability_required`
- `evidence_integrity_required`
- `dependencies_required`
- `milestones_required`
- `rollback_or_exit_required`
- `portability_and_revocation_required`

    ## Architecture intent

    This release is an additive enterprise domain contract under
    `releases/401-500/`. It is not automatically connected to production routes.
    Existing SakthiAI identity, tenant, policy, approval, evidence, observability
    and incident controls remain authoritative.

    ## Security, privacy and safety

    - Default deny and least privilege.
    - Server-derived actor and tenant context.
    - Material actions retain accountable human ownership.
    - Secrets, uploaded content, prompts and personal data are excluded from routine logs.
    - Evidence references use integrity hashes and review dates.
    - High-stakes, legal or regulatory interpretations require qualified review.
    - Paid-provider activation, billing and autonomous production writes remain disabled.
    - External readiness mappings do not constitute certification.

    ## API and data requirements

    - Versioned TypeScript contract, policy evaluator and assessment service.
    - Strict JSON Schema with unknown fields rejected.
    - Tenant-scoped D1 design tables for records and decisions.
    - Read-oriented OpenAPI status endpoint.
    - Separate approved implementation PR for live create/update routes.

    ## Acceptance criteria

    - [ ] Positive and negative contract tests pass.
    - [ ] Cross-tenant access is denied.
    - [ ] Evidence, approval and rollback controls are enforced.
    - [ ] Threat, privacy, accessibility, cost and resilience reviews are complete.
    - [ ] Migrations and recovery are rehearsed outside production.
    - [ ] Residual risks have owners, conditions and review dates.
    - [ ] No unsupported certification or compliance claim is made.

    ## Rollback

    Disable the feature flag, stop affected execution, preserve evidence, revert
    the implementation commit, restore verified data where needed and validate
    critical user and operational journeys.

    ## Explicitly out of scope

    - Automatic production migration execution.
    - Public registration.
    - Billing, payment collection or Unified Billing.
    - Silent paid-provider enablement.
    - Autonomous production writes.
    - External certification claims.
