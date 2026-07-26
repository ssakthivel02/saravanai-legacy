# Release 813 — Free-First Model Routing Runtime

    ## Objective

    Route to approved free or local options first while enforcing quality, privacy, availability and hard budget stops.

    ## Capability class

    `runtime`

    ## Implementation state

    **Blueprint — disabled by default.**

    ## Contract fields

    - `executionId` — `string`
- `tenantId` — `string`
- `actorSubject` — `string`
- `purpose` — `string`
- `idempotencyKey` — `string`
- `maximumSteps` — `number`
- `approvalId` — `string | undefined`
- `dryRun` — `boolean`
- `productionWriteAllowed` — `false`
- `killSwitchAvailable` — `true`
- `status` — `'planned' | 'running' | 'completed' | 'failed' | 'cancelled'`

    ## Mandatory controls

    - `owner_accountability_required`
- `evidence_integrity_required`
- `idempotency_required`
- `kill_switch_required`
- `production_write_forbidden`

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
