# Release 003.1 — Free-first research correction

This maintenance release removes the assumption that premium third-party models are available merely because the Workers AI binding exists.

## Policy

- Sakthi Edge remains the default chat lane.
- OpenAI, Claude and Gemini remain disabled until explicitly enabled by an administrator.
- Current-information requests use free public-data research connectors first.
- Premium research is optional fallback only when `PREMIUM_PROVIDERS_ENABLED=true`.
- Current questions are never silently answered from stale model memory.

## Free research connectors

The first free lane uses:

- GDELT public news data for recent news and event discovery.
- Wikipedia search for current entity/background discovery.
- Workers AI for synthesis over retrieved source metadata.

These connectors are useful but not equivalent to a complete commercial web index. The response must disclose source limitations.
