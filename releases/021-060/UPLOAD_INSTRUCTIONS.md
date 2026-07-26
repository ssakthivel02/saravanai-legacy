# Upload instructions

Copy the four extracted pack folders into this exact structure:

```text
releases/021-060/
  021-030/
    README.md
    INTEGRATION_CHECKLIST.md
    MANIFEST.json
    release-pack/
  031-040/
    README.md
    ROADMAP.md
    INTEGRATION_CHECKLIST.md
    MANIFEST.json
    release-pack/
  041-050/
    README.md
    ROADMAP.md
    INTEGRATION_CHECKLIST.md
    MANIFEST.json
    release-pack/
  051-060/
    README.md
    ROADMAP.md
    INTEGRATION_CHECKLIST.md
    MANIFEST.json
    release-pack/
```

Do not place the contents of `release-pack` directly in the repository root.

After copying, GitHub Desktop should show roughly 260 new files. Commit them on branch `feature/releases-021-060-enterprise-programme`, push, and use the existing draft pull request. The pull request updates automatically after every push.
