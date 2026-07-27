const TRUE_VALUES = new Set(['true', '1', 'yes', 'on']);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ACCESS_POLICY_RELEASE = 'access-role-policy-foundation-1.0.0';

export const ROLE_CAPABILITIES = Object.freeze({
  owner: Object.freeze({
    workspace: 'full',
    research: 'full',
    projects: 'local-write',
    files: 'owner-gated',
    artifacts: 'local-write',
    approvals: 'decide',
    memory: 'local-write',
    usage: 'manage',
    accessAdministration: 'manual-cloudflare-admin'
  }),
  member: Object.freeze({
    workspace: 'full',
    research: 'full',
    projects: 'isolated-local-write',
    files: 'disabled-until-server-rbac',
    artifacts: 'isolated-local-write',
    approvals: 'request-only',
    memory: 'isolated-local-write',
    usage: 'self-view',
    accessAdministration: 'none'
  }),
  reader: Object.freeze({
    workspace: 'disabled-until-read-only-routes',
    research: 'read-only-planned',
    projects: 'read-only-planned',
    files: 'read-only-planned',
    artifacts: 'read-only-planned',
    approvals: 'none',
    memory: 'none',
    usage: 'self-view-planned',
    accessAdministration: 'none'
  })
});

function enabled(value) {
  return TRUE_VALUES.has(String(value ?? '').trim().toLowerCase());
}

export function normaliseEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase().slice(0, 254) : '';
}

function parseEmailList(value) {
  const emails = new Set();
  let invalidCount = 0;
  for (const raw of String(value ?? '').split(',')) {
    const email = normaliseEmail(raw);
    if (!email) continue;
    if (!EMAIL_PATTERN.test(email)) {
      invalidCount += 1;
      continue;
    }
    emails.add(email);
  }
  return { emails, invalidCount };
}

function cloneCapabilities(role) {
  return { ...(ROLE_CAPABILITIES[role] || {}) };
}

export function compileAccessPolicy(env = {}) {
  const ownerEmail = normaliseEmail(env.OWNER_EMAIL);
  const ownerValid = Boolean(ownerEmail && EMAIL_PATTERN.test(ownerEmail));
  const legacyMembers = parseEmailList(env.ACCESS_ALLOWED_EMAILS);
  const configuredMembers = parseEmailList(env.ACCESS_MEMBER_EMAILS);
  const configuredReaders = parseEmailList(env.ACCESS_READER_EMAILS);

  const memberEmails = new Set([...legacyMembers.emails, ...configuredMembers.emails]);
  const readerEmails = new Set(configuredReaders.emails);
  if (ownerEmail) {
    memberEmails.delete(ownerEmail);
    readerEmails.delete(ownerEmail);
  }

  const roleConflicts = [...memberEmails].filter((email) => readerEmails.has(email));
  for (const email of roleConflicts) {
    memberEmails.delete(email);
    readerEmails.delete(email);
  }

  const invalidEntryCount = legacyMembers.invalidCount + configuredMembers.invalidCount + configuredReaders.invalidCount;
  const teamProfilesEnabled = enabled(env.ACCESS_TEAM_PROFILES_ENABLED);
  const readerProfilesEnabled = teamProfilesEnabled && enabled(env.ACCESS_READER_PROFILES_ENABLED);
  const invitationRequestsConfigured = enabled(env.ACCESS_INVITATIONS_ENABLED);
  const valid = ownerValid && invalidEntryCount === 0 && roleConflicts.length === 0;

  return Object.freeze({
    release: ACCESS_POLICY_RELEASE,
    valid,
    ownerConfigured: ownerValid,
    ownerEmail: ownerValid ? ownerEmail : '',
    memberEmails,
    readerEmails,
    invalidEntryCount,
    roleConflictCount: roleConflicts.length,
    teamProfilesEnabled,
    readerProfilesEnabled,
    invitationRequestsConfigured,
    invitationRequestsActive: false,
    publicRegistration: false,
    serverRoleEnforcementEnabled: false,
    sharedPersistenceEnabled: false,
    exactEmailOnly: true
  });
}

export function resolveConfiguredRole(emailValue, env = {}) {
  const email = normaliseEmail(emailValue);
  const policy = compileAccessPolicy(env);
  if (!policy.valid) return { role: null, code: 'ACCESS_ROLE_POLICY_INVALID', policy };
  if (email === policy.ownerEmail) return { role: 'owner', code: 'ACCESS_ROLE_OWNER', policy };
  if (policy.memberEmails.has(email)) {
    return policy.teamProfilesEnabled
      ? { role: 'member', code: 'ACCESS_ROLE_MEMBER', policy }
      : { role: null, code: 'ACCESS_TEAM_PROFILES_DISABLED', policy };
  }
  if (policy.readerEmails.has(email)) {
    if (!policy.teamProfilesEnabled) return { role: null, code: 'ACCESS_TEAM_PROFILES_DISABLED', policy };
    return policy.readerProfilesEnabled
      ? { role: 'reader', code: 'ACCESS_ROLE_READER', policy }
      : { role: null, code: 'ACCESS_READER_PROFILES_DISABLED', policy };
  }
  return { role: null, code: 'ACCESS_EMAIL_NOT_ALLOWED', policy };
}

export function capabilitiesForRole(role) {
  return cloneCapabilities(role);
}

export function accessPolicySummary(env = {}) {
  const policy = compileAccessPolicy(env);
  return {
    release: policy.release,
    valid: policy.valid,
    exactEmailOnly: policy.exactEmailOnly,
    ownerConfigured: policy.ownerConfigured,
    configuredProfileCounts: {
      owner: policy.ownerConfigured ? 1 : 0,
      member: policy.memberEmails.size,
      reader: policy.readerEmails.size
    },
    activation: {
      ownerProfile: policy.ownerConfigured ? 'configured' : 'blocked-owner-email-missing',
      teamProfilesEnabled: policy.teamProfilesEnabled,
      readerProfilesEnabled: policy.readerProfilesEnabled,
      invitationRequestsConfigured: policy.invitationRequestsConfigured,
      invitationRequestsActive: policy.invitationRequestsActive,
      serverRoleEnforcementEnabled: policy.serverRoleEnforcementEnabled,
      sharedPersistenceEnabled: policy.sharedPersistenceEnabled,
      publicRegistration: policy.publicRegistration
    },
    validation: {
      invalidEntryCount: policy.invalidEntryCount,
      roleConflictCount: policy.roleConflictCount,
      failClosed: true
    },
    roles: {
      owner: { activation: policy.ownerConfigured ? 'owner-pilot-ready' : 'blocked', capabilities: cloneCapabilities('owner') },
      member: { activation: policy.teamProfilesEnabled ? 'configured-private-profile' : 'disabled-by-default', capabilities: cloneCapabilities('member') },
      reader: { activation: policy.readerProfilesEnabled ? 'configured-read-only-profile' : 'disabled-by-default', capabilities: cloneCapabilities('reader') }
    },
    nextGate: policy.teamProfilesEnabled
      ? 'Validate server-side endpoint authorisation, D1 tenant persistence and hard quotas before inviting another identity.'
      : 'Complete and verify the exact-email owner-only Cloudflare Access pilot before enabling any team profile variable.'
  };
}

export const __test = { enabled, parseEmailList };
