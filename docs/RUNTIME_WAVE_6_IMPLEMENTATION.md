# Runtime Wave 6 Implementation

Runtime Wave 6 adds disabled-by-default, private-owner DevSecOps and software-supply-chain evaluation controls:

- SBOM structure and completeness review
- Caller-supplied dependency risk assessment
- Build provenance validation
- Bounded secret-marker inspection and redaction
- Infrastructure-as-code policy evaluation
- Licence disposition review
- GitHub Actions workflow policy assessment
- Artifact integrity metadata validation
- Unsigned in-toto/SLSA-shaped attestation construction
- Repository protection baseline evaluation
- Time-bounded risk-exception validation
- Human-approved release evidence gate
- Supply-chain evidence packet hashing

The runtime performs no external scans, package installation, artifact download, signing, repository write, branch-protection change, merge, deployment or database write.
