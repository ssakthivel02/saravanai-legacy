# Release 536 — Data Integrity and Reconciliation Recovery

    ## Objective

    Validate restored data, transactions, lineage, gaps, conflicts, approvals and residual risk.

    ## Capability class

    `assessment`

    ## Core contract

    - `assessmentId` — `string`
- `tenantId` — `string`
- `subjectId` — `string`
- `owner` — `string`
- `methodologyRef` — `string`
- `score` — `number`
- `findingIds` — `string[]`
- `evidenceRefs` — `string[]`
- `decision` — `'pending' | 'pass' | 'conditional' | 'fail'`

    ## Mandatory controls

    - `owner_accountability_required`
- `evidence_integrity_required`
- `methodology_required`
- `findings_review_required`

    ## Architecture intent

    This release is an additive Enterprise Platform v5 domain contract under
    `releases/501-600/`. Existing SakthiAI identity, tenant, policy, approval,
    evidence, observability and incident controls remain authoritative.

    ## Security, privacy and safety requirements

    - Default deny and least privilege.
    - Server-derived actor and tenant identity.
    - Material actions retain accountable human ownership.
    - Secrets, prompts, uploaded files and personal data are excluded from routine telemetry.
    - Evidence references use integrity hashes, timestamps and review dates.
    - High-stakes, legal or regulatory interpretations require qualified review.
    - Paid-provider activation, billing and autonomous production writes remain disabled.
    - Readiness mappings do not constitute certification or legal advice.

    ## API and data requirements

    - Versioned TypeScript contract, policy evaluator and assessment service.
    - Strict JSON Schema with unknown fields rejected.
    - Tenant-scoped D1 design tables for records and decisions.
    - Read-oriented OpenAPI status endpoint.
    - Separate approved implementation PR for live mutation routes.

    ## Acceptance criteria

    - [ ] Positive and negative contract tests pass.
    - [ ] Cross-tenant access is denied.
    - [ ] Evidence, approval, appeal and rollback controls are enforced where relevant.
    - [ ] Threat, privacy, accessibility, cost and resilience reviews are complete.
    - [ ] Migrations and recovery are rehearsed outside production.
    - [ ] Residual risks have owners, conditions and review dates.
    - [ ] No unsupported certification or compliance claim is made.

    ## Rollback

    Disable the feature flag, stop affected execution, preserve evidence, revert
    the implementation commit, restore verified data where required and validate
    critical user and operational journeys.

    ## Explicitly out of scope

    - Automatic production migration execution.
    - Public registration.
    - Billing, payment collection or Unified Billing.
    - Silent paid-provider enablement.
    - Autonomous production writes.
    - External certification claims.
