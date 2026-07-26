# Release 353 — Marketplace Publisher Onboarding

    ## Objective

    Govern publisher identity, ownership, licensing, safety evidence, support and revocation.

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

    ## Architecture and integration intent

    This release is an additive domain contract. It is reviewed under
    `releases/301-400/` and is not automatically wired into the production Worker.
    Trusted identity, tenant context, policy decisions, approval evidence and request
    correlation must be supplied by existing SakthiAI control services.

    ## Security and privacy requirements

    - Default deny and least privilege.
    - Server-derived tenant and actor identity.
    - No secrets, uploaded content, prompts or personal data in routine telemetry.
    - Evidence references use integrity hashes.
    - Material actions retain a named accountable human.
    - External, regulated or high-stakes claims require qualified review.
    - Paid services and autonomous production writes remain disabled.

    ## API and data

    - Versioned TypeScript contract and policy evaluator.
    - JSON Schema with unknown fields rejected.
    - Tenant-scoped D1 design tables for records and decisions.
    - Read-oriented OpenAPI status endpoint.
    - Separate implementation PR required for live create/update routes.

    ## Acceptance criteria

    - [ ] Contract validation passes for positive and negative cases.
    - [ ] Cross-tenant access is denied.
    - [ ] Evidence and approval requirements are enforced.
    - [ ] Threat, privacy, accessibility and rollback reviews are complete.
    - [ ] Non-production migration and recovery evidence exists.
    - [ ] Residual risks have owners and review dates.
    - [ ] No unsupported certification or compliance claim is made.

    ## Rollback

    Disable the release feature flag, stop affected execution, preserve evidence,
    revert the implementation commit, restore verified data where required and
    validate critical journeys before reopening.

    ## Explicitly out of scope

    - Production migration execution.
    - Automatic paid-provider activation.
    - Billing or payment collection.
    - Public registration.
    - Autonomous production writes.
    - External certification claims.
