import { wave3State } from './boundary.js';

export function wave3Observability(env = {}) {
  return {
    release: 'runtime-wave-3.0.0',
    state: wave3State(env),
    controls: {
      sourceRegistrationPreviewOnly: true,
      ingestionQuarantinePreviewOnly: true,
      retrievalPlanOnly: true,
      citationStructureValidationOnly: true,
      contradictionDetectionCandidateOnly: true,
      temporalRulesOnly: true,
      evidenceMetadataOnly: true,
      correctionPlanOnly: true,
      externalFetch: false,
      databaseWrites: false,
      aiExecution: false,
      contentPersistence: false,
      sensitiveContentLogging: false
    },
    routes: [
      '/api/v1/runtime/v3/status',
      '/api/v1/runtime/v3/sources/validate',
      '/api/v1/runtime/v3/ingestion/quarantine-preview',
      '/api/v1/runtime/v3/retrieval/plan',
      '/api/v1/runtime/v3/citations/validate',
      '/api/v1/runtime/v3/contradictions/analyse',
      '/api/v1/runtime/v3/temporal/verify',
      '/api/v1/runtime/v3/evidence/package',
      '/api/v1/runtime/v3/corrections/plan',
      '/api/v1/runtime/v3/observability'
    ]
  };
}
