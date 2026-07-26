# Upload instructions

## Required prerequisite

First complete PR #8 for Releases 021–060. The latest checks must be green, then mark it
ready for review and merge it only after owner approval. Fetch the updated `main` before
starting Releases 061–100.

## Branch

Create:

```text
feature/releases-061-100-enterprise-maturity
```

## Copy boundary

Copy the ZIP's two top-level folders `.github` and `releases` into the repository root.
The final structure must be:

```text
.github/workflows/releases-061-100-validation.yml
releases/061-100/README.md
releases/061-100/PROGRAMME_ROADMAP.md
releases/061-100/061-070/...
releases/061-100/071-080/...
releases/061-100/081-090/...
releases/061-100/091-100/...
```

Do not copy any inner `release-pack` folder over the repository root.
