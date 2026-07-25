# Sakthi AI Nexus

Public, team-ready AI operating platform with provider-independent architecture.

## Release 003 — Multi-provider routing, streaming and fresh research

Release 003 upgrades the live Release 002 workspace with:

- Cost-first automatic routing plus explicit provider override
- Sakthi Edge, OpenAI, Claude, Gemini and Kimi model lanes
- Cloudflare AI Gateway integration and gateway-level observability
- Server-Sent Events streaming for normal chat
- Provider-native live web search for current-information questions
- Source/citation extraction with searched-at timestamps
- Stale-answer prevention for news, current office-holders, prices, schedules and other changeable facts
- Economy, balanced and premium budget policies
- Premium-provider fallback for non-current requests
- Secret-shaped prompt blocking, same-origin enforcement and rate limiting
- Request IDs, model, provider, route, latency, cost class and limitations in responses
- PWA cache exclusion for all `/api/*` responses
- No AI credentials stored in browser JavaScript or committed to Git

The default model remains `@cf/meta/llama-3.1-8b-instruct-fast`. Third-party models run on demand through Cloudflare AI Gateway / Unified Billing. Availability depends on model access and sufficient Cloudflare AI credits.

## Freshness policy

SakthiAI detects current-information requests. A question such as "Who is the current chief minister?" or "What is today's news?" is routed to live web research. If web search fails, SakthiAI returns `FRESH_RESEARCH_UNAVAILABLE`; it does not silently answer from stale edge-model memory.

## API routes

- `GET /api/health`
- `GET /api/v1/status`
- `GET /api/v1/models`
- `POST /api/v1/chat`
- `POST /api/v1/chat/stream`
- `POST /api/v1/research`

Example request:

```json
{
  "prompt": "What are today's verified Tamil Nadu government updates?",
  "mode": "research",
  "provider": "auto",
  "budget": "balanced"
}
```

## Local verification

Requirements: Node.js 20 or later.

```bash
npm test
python -m http.server 4173 -d dist
```

Open `http://localhost:4173` for the static UI. Worker API, AI Gateway, third-party models and provider-native web search require Wrangler remote development or a deployed Worker.

## Cloudflare Worker deployment

- Build command: `npm test`
- Deploy command: `npx wrangler deploy`
- Root directory: repository root
- Recommended Node version: `22`
- Static asset directory: `dist`
- Production branch: `main`
- Custom domain: `sakthiai.omsaravanabhava.org`

`wrangler.jsonc` configures the Worker entry point, static assets, API-first routing, Workers AI, AI Gateway model policy, rate limiting, observability and the custom domain.

## Security and cost rules

- Never commit provider keys, Cloudflare tokens, credentials or private user data.
- Do not paste passwords, API keys or private keys into prompts.
- Premium and web-search calls can incur upstream usage charges through Unified Billing.
- Keep Cloudflare billing alerts and AI Gateway logging enabled.
- Write-capable tools remain disabled until identity, RBAC and approval workflows are implemented.

## Roadmap

- Release 004: R2 file/PDF ingestion, OCR and AI Search citations
- Release 005: D1 projects, persistent conversations and usage ledger
- Release 006: secure identity, teams, tenants, RBAC and quotas
- Release 007: document, spreadsheet, slide and code artifact generation
- Release 008: tool execution and human approval workflows
- Release 009: memory, AI Search and knowledge graph
- Release 010: budgets, billing controls and native mobile applications

See [`docs/RELEASE_003_IMPLEMENTATION.md`](docs/RELEASE_003_IMPLEMENTATION.md) for detailed acceptance criteria and rollout boundaries.
