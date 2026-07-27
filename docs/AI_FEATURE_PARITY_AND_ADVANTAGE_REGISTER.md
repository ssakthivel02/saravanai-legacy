# SakthiAI AI Feature Parity and Advantage Register

## Purpose

SakthiAI should learn from market-leading product patterns without copying proprietary code, branding, hidden prompts or protected user interfaces. The goal is a governed, evidence-first bundle that combines useful capabilities while making cost, privacy, provenance and action authority more visible than typical assistants.

## Non-negotiable operating principles

1. **Identity before persistence** — every server-stored record must be bound to a cryptographically verified profile and tenant.
2. **Evidence before current claims** — time-sensitive claims require current sources, source quality scoring and explicit insufficiency handling.
3. **No silent paid fallback** — every paid route remains disabled until the owner explicitly approves the provider, budget and billing impact.
4. **Human approval before external writes** — email, repository, deployment, DNS, financial, identity and production changes require a reviewable action packet.
5. **Local-first where practical** — browser-local artifacts, optional local models and encrypted export reduce provider dependence.
6. **Visible limitations** — SakthiAI must show routing, model, cost class, freshness, citations and unresolved uncertainty.
7. **Accessibility and multilingual parity** — English and Tamil interaction, keyboard navigation, captions/transcripts and readable artifacts are first-class requirements.

## Market capability patterns to implement

| Product pattern | Useful capability | Typical weakness or risk | SakthiAI advantage target |
|---|---|---|---|
| General conversational assistants | Natural multi-turn chat, writing, coding and task assistance | Context can become opaque; current facts may be answered from stale memory | Display route, freshness decision, evidence status, model and cost on every response |
| Deep research systems | Multi-source search, synthesis and citations | Search can be expensive, slow or cite weak sources | Free-first discovery, official-source preference, source-type scoring and refusal when evidence is insufficient |
| Source-grounded notebook systems | Notebook collections, inline citations, study guides, audio summaries and mind maps | Answers are bounded by uploaded sources and can miss outside changes | Provide explicit modes: source-only, source-plus-current-research and contradiction review |
| Multimodal assistants | Voice, image, document and screen understanding | Audio/image privacy and consent can be unclear | Explicit start/stop, visible processing boundary, no auto-submit, no audio retention by default |
| Custom assistants and reusable agents | Repeatable instructions, domain tools and templates | Agents may overreach or take irreversible actions | Signed templates, least-privilege tools, dry-run previews, approval gates and deterministic emergency stops |
| Connector ecosystems | Search across email, files, calendars and repositories | Broad scopes and data leakage risk | Per-connector scopes, purpose limitation, consent receipts, redaction and revocation dashboard |
| Local model runtimes | Private offline chat, coding, embeddings and vision | Hardware limits, model licence variation and difficult updates | Optional local-only Ollama bridge with model allow-list, licence register, health checks and cloud-off mode |
| Enterprise AI gateways | Multi-provider routing, quotas and observability | Provider lock-in and hidden cost escalation | Provider-neutral contracts, free-first routing, explicit budget policies and fail-closed limits |

## SakthiAI delivery backlog

### P0 — Owner Access pilot

- Protect the whole production hostname with Cloudflare Access.
- Use exact owner email only.
- Enable Worker-side JWT verification after edge authentication is proven.
- Verify browser profile isolation.
- Keep public registration and reader/member invitations disabled.

### P0 — Research reliability

- Normalise conversational queries before search.
- Resolve current office-holder questions through structured current-position data.
- Prefer linked official sources and expose whether official verification succeeded.
- Reject private-network URLs obtained from untrusted source metadata.
- Add authoritative-source adapters for priority jurisdictions and organisations.
- Add contradiction detection, freshness windows and source quality grades.

### P0 — Voice interaction quality

- Keep explicit Start and Stop controls.
- Automatically resume browser recognition when the browser pauses while the user still requests listening.
- Never auto-submit a transcript.
- Stop capture when the tab is hidden.
- Add an interview mode with question queue, transcript, rubric and user-controlled recording policy.
- Treat full-duplex speech-to-speech and interruption handling as a separate reviewed feature.

### P1 — Source Notebook and Artifact Studio

- Local source collections and browser-side document parsing where feasible.
- Source-only Q&A with page-level citations.
- Source-plus-current-research comparison mode.
- Study guides, flashcards, FAQs, timelines, mind maps and data tables.
- Word, Excel, PowerPoint, PDF and code-package outputs with evidence manifests.

### P1 — Governed custom assistants

- Reusable ACT/ART task templates.
- Versioned instructions and tool permissions.
- Owner-approved system templates.
- Prompt-injection and secret-exposure checks.
- Simulation and dry-run before any external action.

### P1 — Resume interview workspace

- Local resume upload and parsing.
- Job-description alignment.
- Voice or text mock interview.
- Technical, behavioural and scenario question banks.
- Evidence-based scoring linked to resume claims.
- Improvement plan, model answers and exportable report.
- No biometric inference, emotion scoring or hidden employability decision.

### P2 — Optional Ollama desktop bridge

- Local-only mode by default.
- User-installed desktop companion on `localhost` with explicit pairing.
- No direct public exposure of the Ollama port.
- Model allow-list, checksum and licence metadata.
- Hardware capability check and safe context limits.
- Separate opt-in for Ollama Cloud; never infer that local and cloud usage have the same cost or privacy boundary.

### P2 — Controlled teams

- D1 tenant, user, membership and project ACL schema.
- `owner`, `admin`, `member`, `reader` and `auditor` roles.
- Server-side endpoint enforcement, not only hidden UI controls.
- Shared projects, read-only links scoped to authenticated identities and audit history.
- Invitation expiry, access review and immediate revocation.
- No automatic account creation from an arbitrary Google login.

## Known limitations that must remain visible

- Browser speech recognition can stop or vary by browser and may use a browser-vendor service.
- Browser-local profiles do not provide cross-device synchronisation.
- Free public search connectors are not a complete web index.
- Workers AI and other free tiers have quotas and may become unavailable until reset.
- Local models are limited by device memory, CPU/GPU and each model's licence.
- A feature being represented in a release plan does not prove it is enabled in production.

## Definition of done for a complete AI bundle

A feature is not considered complete until it has:

- an explicit user journey;
- an API/security contract;
- data classification and retention rules;
- threat model and abuse cases;
- accessibility acceptance criteria;
- cost and quota behaviour;
- tests and rollback evidence;
- deployment state reporting;
- owner-visible controls;
- no unsupported certification or safety claim.
