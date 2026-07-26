# Implementation strategy

After this programme is merged, stop creating additional numbered foundation packs
temporarily. Select a small operational tranche—recommended Releases 801, 802, 804,
811, 815 and 819—and implement it through dedicated production-code pull requests.

Each implementation PR must remain small, integrate with the existing Worker, use
non-production D1 rehearsal, include end-to-end tests and retain disabled-by-default
feature flags until operational acceptance.
