# SakthiAI Releases 012–020 — Security, Governance and Production Assurance

## Programme objective

This release train prepares SakthiAI for future authenticated owner, team and public operation without enabling public registration, paid providers or unverified compliance claims. Security, privacy, customer protection and evidence are release gates rather than later additions.

## Non-negotiable operating policy

- Free-first routing remains the default.
- Unified Billing and commercial providers remain disabled.
- Public registration remains disabled.
- Browser-local mode must not be described as server authentication.
- Compliance mappings are engineering controls, not legal advice or certification.
- Country-specific legal obligations require qualified local review before launch.
- High-impact actions require human approval and auditable evidence.

## Release 012 — Private identity and session boundary

Deliverables:

- Cloudflare Access/OIDC integration contract, but no forced resource creation.
- Owner identity derivation from verified Access headers.
- Server-side authorisation middleware design.
- Session expiry, step-up authentication and re-authentication rules.
- Break-glass owner procedure with audit requirements.
- Explicit denial of unauthenticated server writes.

Exit criteria:

- Identity cannot be asserted from browser-provided role fields.
- Owner identity is matched server-side against an encrypted environment value or controlled identity store.
- Authentication, authorisation and tenant selection are distinct controls.

## Release 013 — Tenant isolation and data governance

Deliverables:

- Tenant-scoped D1 schema and repository contracts.
- Mandatory tenant ID on all server records.
- Row-access predicates and ownership verification.
- Data classification: Public, Internal, Confidential, Restricted.
- Retention, export, deletion and legal-hold states.
- Regional policy metadata without claiming automatic data residency.

Exit criteria:

- Cross-tenant access tests pass.
- Server writes fail closed when identity or tenant context is absent.
- Public registration remains disabled.

## Release 014 — Editorial verification and publication controls

Deliverables:

- Draft → Verification Failed → Human Review → Approved → Published workflow.
- Evidence, citations, physical-page references and confidence fields.
- Separation of researcher, editor, senior editor and publisher roles.
- Publication audit log and rollback record.
- Human-only publication gate.

Exit criteria:

- No model or agent can publish directly.
- Approval identity, timestamp, evidence and content hash are recorded.

## Release 015 — Agent and tool security

Deliverables:

- Tool registry with least-privilege scopes.
- Read-only, dry-run and write capability classes.
- Approval policies based on impact and environment.
- Idempotency, timeout, retry and rollback contracts.
- Prompt-injection and untrusted-content boundary.
- Tool evidence attached to every execution claim.

Exit criteria:

- DNS, deployment, email and administrative tools cannot execute without elevated approval.
- Tool output is treated as untrusted until validated.

## Release 016 — Prompt, model and retrieval optimisation

Deliverables:

- Versioned prompt registry.
- Stable-prefix caching preparation.
- Structured output schemas and contract tests.
- Retrieval quality metrics and source-quality policy.
- Optional routing benchmark; no RouteLLM activation without evidence.
- Read-scaling ADR; no untested PostgreSQL replication claims.

Exit criteria:

- Prompt changes are versioned and regression tested.
- Optimisation never overrides safety, privacy or evidence requirements.

## Release 017 — Privacy, safety and compliance evidence

Deliverables:

- Control mapping for ISO/IEC 27001, 27701, 42001, NIST CSF, NIST AI RMF and OWASP LLM guidance.
- GDPR principles mapping and EU AI Act classification review checklist.
- DPIA/AI impact assessment templates.
- Risk register, treatment plan, control owner and evidence register.
- Supplier and subprocessors inventory.
- Children, vulnerable users, accessibility and cultural-safety policies.

Exit criteria:

- No certification or legal-conformity claim is displayed.
- Each control has owner, evidence, status and review date.
- Local legal review remains a launch requirement.

## Release 018 — Resilience, incident response and disaster recovery

Deliverables:

- Severity model and incident command roles.
- Security incident, privacy incident and AI-safety incident playbooks.
- Backup inventory, encryption, restore procedure and restore evidence.
- RTO/RPO targets by service tier.
- Dependency degradation and fail-closed behaviour.
- Status communication and post-incident review template.

Exit criteria:

- Restore test is evidenced.
- Security-sensitive routes fail closed.
- Current-information failure cannot fall back to stale memory.

## Release 019 — Customer trust, transparency and regional controls

Deliverables:

- Customer security overview.
- AI transparency notice and model limitations.
- Data-use, retention and deletion explanations.
- Regional policy selection and local-law precedence.
- Accessibility baseline aligned to WCAG 2.2 AA design intent.
- Public-event and celebration safety framework: crowd, emergency access, weather, transport, children, accessibility and regulated hazards.

Exit criteria:

- Users can understand when AI, search, tools and humans were involved.
- Safety guidance directs imminent emergencies to local emergency services.
- Country-specific requirements are not presented as universal law.

## Release 020 — Production certification and launch governance

Deliverables:

- Production readiness scorecard.
- Security, privacy, resilience, accessibility, legal and financial sign-offs.
- Threat-model closure evidence.
- Vulnerability and dependency scan evidence.
- Abuse-case and red-team report.
- Rollback and kill-switch validation.
- Go/conditional-go/no-go decision record.

Exit criteria:

- Public access remains blocked until all mandatory gates pass.
- Exceptions require named owner, expiry date and documented risk acceptance.
- A release cannot self-certify solely from automated tests.

## Governance pillars

1. Identity and access.
2. Privacy and data protection.
3. AI safety and information integrity.
4. Agent and tool security.
5. Customer and tenant security.
6. Operational resilience.
7. Compliance and assurance.
8. Global, community and celebration safety.

## Manual resources intentionally deferred

The following are not enabled by this release train:

- Cloudflare Access application.
- D1 production database.
- R2 evidence bucket.
- AI Search.
- Unified Billing.
- OpenAI, Claude, Gemini or Kimi billing.
- Workers Paid plan.
- Public registration.

They require a separate owner decision, cost review and security validation.
