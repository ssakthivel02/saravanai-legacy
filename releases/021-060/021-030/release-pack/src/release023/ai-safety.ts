export interface SafetyFinding {
  category: "prompt_injection" | "secret" | "pii" | "unsafe_tool" | "citation_required";
  severity: "low" | "medium" | "high" | "critical";
  evidence: string;
}

const SECRET_PATTERNS = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /(?:api[_-]?key|token|password)\s*[:=]\s*["']?[A-Za-z0-9_\-]{16,}/i,
  /ghp_[A-Za-z0-9]{30,}/,
  /sk-[A-Za-z0-9]{20,}/
];

const INJECTION_PATTERNS = [
  /ignore (?:all |the )?previous instructions/i,
  /reveal (?:your )?(?:system|developer) prompt/i,
  /bypass (?:security|policy|guardrails)/i,
  /act as an unrestricted/i
];

export function inspectPrompt(prompt: string): SafetyFinding[] {
  const findings: SafetyFinding[] = [];
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(prompt)) findings.push({ category: "secret", severity: "critical", evidence: "secret-shaped material detected" });
  }
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(prompt)) findings.push({ category: "prompt_injection", severity: "high", evidence: "instruction-override pattern detected" });
  }
  if (/\b(?:execute|delete|deploy|transfer|purchase)\b/i.test(prompt)) {
    findings.push({ category: "unsafe_tool", severity: "medium", evidence: "action-capable intent requires approval" });
  }
  return findings;
}

export function shouldBlock(findings: SafetyFinding[]): boolean {
  return findings.some(f => f.severity === "critical" || f.category === "prompt_injection");
}
