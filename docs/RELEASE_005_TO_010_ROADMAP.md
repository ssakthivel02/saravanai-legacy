# SakthiAI Releases 005–010 — free-first owner implementation

## Delivery position

The first working target is a private single-owner platform on a trusted device. Public registration, paid providers, automatic external writes and native mobile clients remain disabled until the relevant security, persistence, abuse and cost controls are operational.

## Release 005 — Projects, conversations and usage ledger

Implemented in owner preview:

- IndexedDB-backed local projects and task history.
- Automatic capture of completed and failed SakthiAI tasks.
- Project selection, export and deletion.
- Local usage ledger with prompt/output characters, provider, model, latency and cost class.
- Optional D1 schema prepared in `migrations/0001_owner_platform.sql`.

Still required for public/team use:

- D1 binding, migrations, retention jobs and server-side export/deletion APIs.

## Release 006 — Identity, teams, tenants and RBAC

Implemented in owner preview:

- Honest `local-owner-preview` session state.
- Cloudflare Access header detection in the platform API.
- Prepared tenant, user, membership and audit schema.
- Roles defined as owner, admin, member, viewer and auditor.

Still required for public/team use:

- Access/OIDC application, verified JWT validation, secure sessions, invitations and server-side role enforcement.

## Release 007 — Artifact Studio

Implemented without paid providers:

- Browser-local DOCX, XLSX and PPTX package generation.
- Browser print/save workflow for Unicode-capable PDF output.
- Markdown, HTML, CSV, JSON and code ZIP generation.
- Local artifact ledger and review-required notices.

Future enhancement:

- Private R2 artifact storage, server-generated complex layouts, templates and signed download expiry.

## Release 008 — Tools and approvals

Implemented in safe preview:

- Local approval queue.
- Approve/reject decisions.
- Impact classification.
- Explicit `dry-run-only` and `not-executed` states.

Not enabled:

- Email, GitHub, deployment, DNS or administrative writes. These require authenticated server-side tool adapters, idempotency, audit and rollback.

## Release 009 — Memory and knowledge graph

Implemented in owner preview:

- Owner-approved memories only.
- Optional expiry and deletion.
- Local entity and relationship graph.
- Provenance marker on every manually approved node, edge and memory.

Still required for public/team use:

- Server persistence, semantic retrieval, embedding policy, tenant isolation and evidence-linked provenance.

## Release 010 — Cost controls and mobile-client API

Implemented in owner preview:

- Free-first routing and `PREMIUM_PROVIDERS_ENABLED=false`.
- Local daily soft request cap and usage summary.
- Paid-call detection in the local ledger.
- Installable PWA as the current mobile client.
- `/api/v1/mobile/config` and `/api/v1/platform/capabilities` contracts.

Still required before native apps:

- Server-enforced quotas, exact provider usage ingestion, authentication, stable persistence and final API compatibility tests.

## Resource and charge policy

- Premium providers remain disabled.
- D1 is optional and can be activated within the Workers Free plan limits.
- R2 is optional for private files and can be activated within its monthly free tier.
- Workers AI uses its daily free allocation; exceeding the free-plan allocation causes requests to fail rather than automatically upgrading the account.
- No resource should be activated merely to make a feature appear complete.

## Public launch gate

The private owner preview must not be described as a secure public multi-tenant service. Public launch requires authentication, D1 persistence, tenant/RBAC enforcement, abuse controls, legal documents, audited deletion/export, server-side quotas and production validation.
