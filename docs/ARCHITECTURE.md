# Foundation Architecture

## Release 001

```text
Browser / PWA
  ├─ Static HTML application shell
  ├─ Local UI state and task-routing simulation
  ├─ Service worker and offline fallback
  └─ No external AI network calls

GitHub
  ├─ Release branch and pull request
  └─ Quality Gate workflow

Cloudflare Pages
  ├─ Git-triggered build
  ├─ Preview deployment per branch/PR
  ├─ Production deployment from main
  └─ Custom domain + TLS
```

## Target Release 002

```text
Browser / PWA
       │
       ▼
Cloudflare Worker API
(authentication, rate limits, request IDs)
       │
       ▼
Provider adapter service
(server-side secrets only)
       ├─ OpenAI
       ├─ Anthropic
       ├─ Gemini
       └─ Kimi
       │
       ▼
Audit, cost and evidence events
```

## Architectural constraints

- Provider and model identifiers are configuration-driven.
- Browser code never receives provider credentials.
- Write-capable tools require explicit approval.
- A builder model cannot be the sole verifier of its own work.
- Every significant task produces an evidence manifest.
