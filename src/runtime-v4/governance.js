import { clean } from './core.js';
const LEVELS = new Set(['public', 'internal', 'confidential', 'restricted']);
const CATEGORIES = new Set(['general', 'personal-data', 'credentials', 'financial', 'health', 'children', 'religious-cultural']);
const FORMATS = new Set(['json', 'csv', 'pdf-summary']);
const SCOPES = new Set(['audit-metadata', 'workspace-metadata', 'evidence-index']);
const RECORDS = new Set(['audit-metadata', 'workspace-metadata', 'evidence-index', 'access-review']);

export function validateClassification(input = {}) {
  const level = clean(input.level, 50).toLowerCase();
  const categories = Array.isArray(input.categories) ? input.categories.slice(0, 8).map((v) => clean(v, 80).toLowerCase()) : [];
  const findings = [];
  if (!LEVELS.has(level)) findings.push('classification_level_not_allowlisted');
  if (!categories.length) findings.push('category_required');
  if (categories.some((c) => !CATEGORIES.has(c))) findings.push('category_not_allowlisted');
  let minimum = 'internal';
  if (categories.some((c) => ['credentials', 'health', 'children'].includes(c))) minimum = 'restricted';
  else if (categories.some((c) => ['personal-data', 'financial', 'religious-cultural'].includes(c))) minimum = 'confidential';
  const rank = { public: 0, internal: 1, confidential: 2, restricted: 3 };
  if (rank[level] < rank[minimum]) findings.push('classification_below_required_minimum');
  return { valid: findings.length === 0, findings, classification: { requested: level, minimum, categories: [...new Set(categories)], applied: false } };
}

export function validateExport(input = {}) {
  const format = clean(input.format, 40).toLowerCase();
  const scope = clean(input.scope, 80).toLowerCase();
  const reason = clean(input.reason, 500);
  const findings = [];
  if (!FORMATS.has(format)) findings.push('format_not_allowlisted');
  if (!SCOPES.has(scope)) findings.push('scope_not_allowlisted');
  if (!reason) findings.push('reason_required');
  if (input.includeContent === true) findings.push('content_export_denied');
  if (input.execute === true) findings.push('export_execution_denied');
  return { valid: findings.length === 0, findings, request: { format, scope, reason, metadataOnly: true, exportGenerated: false, humanApprovalRequired: true } };
}

export function validateRetention(input = {}) {
  const recordType = clean(input.recordType, 80).toLowerCase();
  const days = Number(input.days || 0);
  const findings = [];
  if (!RECORDS.has(recordType)) findings.push('record_type_not_allowlisted');
  if (!Number.isInteger(days) || days < 30 || days > 2555) findings.push('retention_days_out_of_range');
  if (input.deleteNow === true) findings.push('immediate_deletion_denied');
  return { valid: findings.length === 0, findings, policy: { recordType, days, legalHold: input.legalHold === true, applied: false, deletionScheduled: false } };
}
