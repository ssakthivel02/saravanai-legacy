# Release 003 — Multi-provider Router, Streaming and Fresh Web Research

## Objective

Upgrade SakthiAI from a single edge model into a governed multi-provider platform that can stream responses and use provider-native web search for current-information requests.

## Scope delivered in this release

1. Provider-neutral routing policy with cost, freshness, task mode and user override inputs.
2. Sakthi Edge as the low-cost default model.
3. Premium lanes through Cloudflare AI Gateway and Unified Billing:
   - OpenAI
   - Anthropic Claude
   - Google Gemini
   - Kimi / Workers AI
4. Server-Sent Events streaming endpoint for normal chat.
5. Fresh research endpoint using provider-native web search.
6. Citation extraction and evidence metadata in API responses.
7. Current-information detection. SakthiAI will not silently answer fresh-news questions from an old model without research.
8. Provider health/status output and visible routing decisions.
9. Cost class, request ID, model, provider, latency and limitations in responses.
10. Regression tests for routing, stale-answer prevention and citations.

## API contracts

- `GET /api/health`
- `GET /api/v1/status`
- `GET /api/v1/models`
- `POST /api/v1/chat`
- `POST /api/v1/chat/stream`
- `POST /api/v1/research`

## Routing policy

| Condition | Preferred lane |
|---|---|
| Routine chat, drafting, low-risk tasks | Sakthi Edge |
| Coding or complex reasoning | Premium model when selected and available |
| Current news, office holders, prices, schedules, recent events | Research model with web search |
| Provider failure | Fallback to another allowed provider or explicit unavailable response |
| Sensitive data detected | Reject or require redaction; never send credentials |

## Freshness contract

Questions containing current-information signals such as `today`, `latest`, `current`, `news`, `price`, `weather`, `who is`, `recent`, or a current year are routed to research. If web search is unavailable, the API returns an explicit `FRESH_RESEARCH_UNAVAILABLE` response instead of generating a potentially stale answer.

## Cloudflare configuration

Release 003 uses the existing Workers AI binding and AI Gateway. Third-party calls are made through Cloudflare's AI binding with a gateway identifier. Provider availability depends on Cloudflare Unified Billing / credits and model access in the account.

## Acceptance criteria

- Current-news requests never fall back silently to the non-search edge model.
- Streaming returns `text/event-stream` and terminates cleanly.
- Research responses include access time and source/citation records when the provider returns them.
- Browser code contains no provider API keys.
- `npm test` validates the static build and Worker contracts.
- Existing custom domain and static asset routing remain unchanged.

## Later releases

- Release 004: R2 file/PDF ingestion and AI Search citations.
- Release 005: D1 projects, conversations and usage ledger.
- Release 006: identity, teams and tenant isolation.
- Release 007: document/spreadsheet/slide/code generation.
- Release 008: approval workflows and write-capable tools.
- Release 009: memory, AI Search and knowledge graph.
- Release 010: budgets, billing controls and mobile applications.
