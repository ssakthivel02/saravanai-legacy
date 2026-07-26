# Release 897 — Controlled Tenant Pilot and Exit Criteria

    ## Objective

    Run allowlisted pilots with success, safety, support, rollback and termination criteria.

    ## Capability class

    `plan`

    ## Implementation state

    **Blueprint — disabled by default.**

    ## Contract fields

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
- `tenant_isolation_required`

    ## Worker integration sequence

    1. Resolve request and trace identifiers.
    2. Authenticate the actor or workload.
    3. Resolve trusted tenant context.
    4. Evaluate RBAC, ABAC, purpose, risk and regional policy.
    5. Validate the strict input schema.
    6. Apply rate, quota and free-first budget limits.
    7. Invoke the bounded release service.
    8. Record privacy-safe audit metadata and evidence references.
    9. Return a structured response or correction path.

    ## Acceptance criteria

    - [ ] Contract and schema validation pass.
    - [ ] Cross-tenant access is denied.
    - [ ] Positive, negative, abuse and replay tests pass.
    - [ ] Feature flag defaults to disabled.
    - [ ] Production writes remain disabled unless separately approved.
    - [ ] Threat, privacy, accessibility, cost and resilience reviews pass.
    - [ ] Non-production migration and rollback rehearsal pass.
    - [ ] Evidence and residual risk have accountable owners.

    ## Rollback

    Disable the feature flag, revoke affected credentials or leases, stop execution,
    preserve minimal evidence, revert the implementation commit, restore verified data
    if required and retest critical journeys.

    ## Explicit boundaries

    Public registration, billing, payments, Unified Billing, silent paid-provider
    activation, anonymous writes, autonomous production writes and unsupported
    certification claims remain disabled.
