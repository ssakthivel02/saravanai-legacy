# Release 002 — Live Server-Side AI

## Objective

Promote Sakthi AI Nexus from a static foundation preview to a functional public beta while preserving server-side security, cost control and evidence-first product language.

## Delivered

- Public and team-ready workspace language
- Live Cloudflare Workers AI binding
- `POST /api/v1/chat` inference endpoint
- Runtime and model status endpoints
- Automatic, research, document, coding and website task modes
- Same-origin API enforcement
- 8,000-character prompt cap and 32 KiB request cap
- Cloudflare Rate Limiting binding: 10 chat requests per minute per client network address and location
- Request ID, selected provider, model and latency disclosure
- PWA cache exclusion for all API routes
- Unit/contract tests and GitHub Actions validation

## Explicit limitations

Release 002 does not claim:

- live web search;
- uploaded-file processing;
- persistent personal or team memory;
- user identity and tenant isolation;
- OpenAI, Claude, Gemini or Kimi production routing;
- streaming responses;
- email, deployment or administrative action execution.

These capabilities require controlled later releases with authentication, encrypted secrets, provider policies, budgets, audit events and regression evidence.

## Acceptance criteria

1. `npm test` passes.
2. Cloudflare deploy reads static assets only from `dist`.
3. `GET /api/v1/status` returns `release: 0.2.0` and `aiRuntime: true`.
4. A same-origin `POST /api/v1/chat` returns a non-empty model response and request ID.
5. Cross-origin chat requests return HTTP 403.
6. Requests over the configured rate limit return HTTP 429.
7. The public UI contains no private/owner-only product positioning.
8. No provider API credential exists in browser assets or repository files.

## Rollback

Redeploy the last known-good Release 001 version from Cloudflare Deployments or revert the Release 002 merge commit. The custom domain and static asset directory remain unchanged.
