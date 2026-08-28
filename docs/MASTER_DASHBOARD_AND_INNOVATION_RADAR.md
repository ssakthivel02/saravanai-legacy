# SakthiAI Master Dashboard & Innovation Radar

**Baseline:** 2026-08-28  
**Canonical machine-readable data:** `assets/data/master-dashboard.v1.json`

## Purpose

The dashboard is SakthiAI's durable design-memory surface. Important product ideas, decisions, constraints, market signals and implementation priorities discussed during planning should be distilled into structured records so that future work does not depend on remembering a long chat history.

This is **not** a raw conversation archive.

## Capture rule

For each material SakthiAI discussion, preserve only the product-relevant result:

- decision or idea;
- rationale;
- implementation/status impact;
- private-owner versus public boundary;
- evidence/source where external facts drove the decision;
- risks and graduation requirements;
- next action.

Never commit passwords, tokens, private keys, raw private conversations, personal sensitive information or other unnecessary user data to the repository.

## Four lifecycle lanes

### 1. Owner Pilot

Experimental/high-power functionality can be built for the owner before broad public release when all of the following apply:

- exact-owner identity boundary;
- default-deny tool policy;
- feature flag or emergency stop;
- scoped filesystem/browser/connector permissions;
- explicit cost/compute budget;
- rollback/export/recovery path;
- no unsupported public claim.

Examples include computer use, persistent workers, experimental open models, multi-agent swarms and advanced coding automation.

### 2. Public Candidate

An owner-pilot feature becomes a public candidate only after security, privacy, licensing, multi-tenancy, abuse, accessibility, cost, reliability, observability and rollback gates are satisfied.

### 3. Watch

Promising technologies remain visible without creating roadmap debt. A Watch item should contain the reason it matters and the evidence/benchmark that would justify promotion.

### 4. Reject / Defer

Ideas that create excessive lock-in, weak differentiation, unsafe autonomy, poor economics or unsupported marketing claims should remain documented with the rejection reason. This prevents repeatedly rediscovering and reconsidering the same weak idea.

## Strategic rule: architecture before feature count

SakthiAI should not attempt to become “the best” by adding every button seen in every AI product. That approach creates surface area, cost and fragility without a moat.

The high-leverage kernel is:

1. provider/model abstraction and capability negotiation;
2. portable checkpointed TaskState and failover;
3. planner/task-DAG/parallel-agent orchestration;
4. evidence-first research with contradiction detection;
5. secure connector/browser/computer execution hierarchy;
6. projects, branching and user-controlled memory;
7. native editable artifacts and applications;
8. coding execution from repository through test/review/PR;
9. open MCP/A2A/A2UI interoperability;
10. local/self-hosted/edge execution and transparent economics;
11. strong multilingual/Tamil/Indian-language experience;
12. benchmark harness and claim governance.

Once those contracts are stable, new models can be evaluated and inserted without redesigning the whole product.

## Global innovation radar — 2026-08-28

The current radar intentionally spans multiple countries and design philosophies:

- OpenAI — Codex long-running computer/professional workflows, plugins and shareable sites.
- Anthropic — Fable/Opus/Sonnet, Cowork, Code, Research, Artifacts, Skills, Plugins, MCP, memory and computer use.
- Manus — Plan Mode, Projects, Branching, Wide Research, scheduled work, persistent Cloud Computer and local/browser operators.
- Moonshot/Kimi — large dynamic Agent Swarm, long-horizon coding, nested/sub-agents and resumable coding sessions.
- Z.ai/GLM — million-token long-horizon models, coding effort controls, automation, memory, browser/computer use and recovery-oriented desktop agent UX.
- Alibaba/Qwen — open/replaceable multimodal agents capable of screen/mobile perception and tool use.
- Google/Linux Foundation ecosystem — A2A cross-agent interoperability and A2UI safe declarative generative interfaces.
- Sakana AI — collective/model orchestration suggesting that a strong router/ensemble can outperform relying on one model alone for some workloads.
- Mistral — unified work/code/chat agent surfaces, MCP connectors and human-in-loop tool approvals.
- MiniMax — unified multimodal creative generation across text/image/video/audio.
- ByteDance Seed — full-duplex audio-visual interaction and increasingly controllable reference-driven video creation.
- xAI — persistent computer agents and integrated speech-to-speech voice-agent infrastructure.
- Baidu ERNIE — unified multimodal foundation-model architecture.

The machine-readable radar contains the specific source URLs, risk notes and proposed SakthiAI action for each item.

## Required dashboard update behavior

When future chat/research identifies a material SakthiAI improvement:

1. Check whether the idea already exists in the capability register, master dashboard or parity plan.
2. Update the existing canonical item instead of creating a duplicate.
3. Add a new decision/radar item only when it materially changes scope or architecture.
4. Assign `ownerPilot`, `publicCandidate`, `watch` or `reject`.
5. Attach a priority and implementation state.
6. Record current external sources when the decision depends on changing market technology.
7. Keep raw private conversational content outside the public repository.
8. Link implementation work to an issue/PR and preserve objective acceptance gates.

## Public graduation gates

A feature is not public-ready until it has evidence for:

- threat model and abuse cases;
- licensing/IP/model-use rights;
- privacy, data classification and retention;
- tenant isolation and server-side authorization;
- least-privilege secrets/connectors;
- approvals and rollback for consequential actions;
- quota/cost behavior under retry storms and abuse;
- task recovery/restore evidence;
- accessibility and Tamil/English acceptance criteria;
- observability, incident response and emergency stop;
- benchmark/regression evidence supporting advertised claims.

## Relationship to other canonical files

- `docs/AI_FEATURE_PARITY_AND_ADVANTAGE_REGISTER.md` — enduring market-pattern requirements.
- `docs/MANUS_CLAUDE_FABLE_PARITY_MASTER_PLAN_2026-08-28.md` — detailed Manus/Claude competitive analysis and target planes.
- `config/capability-registry.v1.json` — product capability registry.
- `schemas/task-state-v1.schema.json` — provider-neutral resumable task contract.
- `assets/data/master-dashboard.v1.json` — current dashboard decisions, priorities and global innovation radar.

These files should converge on one architecture; they must not become competing roadmaps.
