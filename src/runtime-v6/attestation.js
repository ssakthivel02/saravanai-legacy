import { canonicalJson, clean, sha256 } from './core.js';

export async function buildUnsignedAttestation(input = {}) {
  const subjectName = clean(input.subjectName, 240);
  const subjectDigest = clean(input.subjectDigest, 64).toLowerCase();
  const repository = clean(input.repository, 240);
  const commitSha = clean(input.commitSha, 64).toLowerCase();
  const builder = clean(input.builder, 100);
  const findings = [];
  if (!subjectName) findings.push('subject_name_required');
  if (!/^[a-f0-9]{64}$/.test(subjectDigest)) findings.push('subject_digest_invalid');
  if (!repository) findings.push('repository_required');
  if (!/^[a-f0-9]{40}$/.test(commitSha)) findings.push('commit_sha_invalid');
  if (!builder) findings.push('builder_required');

  const statement = {
    _type: 'https://in-toto.io/Statement/v1',
    subject: [{ name: subjectName, digest: { sha256: subjectDigest } }],
    predicateType: 'https://slsa.dev/provenance/v1',
    predicate: {
      buildDefinition: {
        buildType: 'https://sakthiai.omsaravanabhava.org/build-types/reviewed-metadata/v1',
        externalParameters: { repository, commitSha }
      },
      runDetails: { builder: { id: builder } }
    }
  };

  return {
    valid: findings.length === 0,
    findings,
    attestation: {
      statement,
      statementSha256: await sha256(canonicalJson(statement)),
      signed: false,
      signatureVerified: false,
      published: false,
      persisted: false,
      slsaLevelClaim: null
    }
  };
}
