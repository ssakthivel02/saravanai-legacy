export const WAVE2_TOOL_REGISTRY = Object.freeze({
  'runtime.status': {
    category: 'read',
    risk: 'low',
    external: false,
    writes: false,
    humanApproval: false
  },
  'governance.read': {
    category: 'read',
    risk: 'low',
    external: false,
    writes: false,
    humanApproval: false
  },
  'knowledge.search.preview': {
    category: 'preview',
    risk: 'medium',
    external: false,
    writes: false,
    humanApproval: false
  },
  'research.plan.preview': {
    category: 'preview',
    risk: 'medium',
    external: false,
    writes: false,
    humanApproval: true
  }
});

export function getToolDefinition(toolId = '') {
  return WAVE2_TOOL_REGISTRY[toolId] || null;
}

export function assessToolRequest(toolId = '') {
  const definition = getToolDefinition(toolId);
  if (!definition) {
    return {
      allowed: false,
      code: 'TOOL_NOT_ALLOWLISTED',
      executionAllowed: false
    };
  }

  return {
    allowed: true,
    code: 'TOOL_PROPOSAL_ALLOWED',
    definition,
    executionAllowed: false,
    leaseAuthority: 'proposal-only'
  };
}
