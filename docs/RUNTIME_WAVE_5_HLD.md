# Runtime Wave 5 High-Level Design

Client → Cloudflare Access owner boundary → enable gate → emergency-stop gate → deterministic SRE evaluator → non-persistent response.

All metrics, health states and incident facts must be supplied by the caller. The runtime performs no external probe or monitoring integration.
