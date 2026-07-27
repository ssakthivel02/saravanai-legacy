export const RUNTIME_WAVES_31_50 = Object.freeze({
  "31": {
    "slug": "zero-trust-architecture",
    "title": "Zero-Trust Architecture Assurance",
    "mode": "private-owner-zero-trust-assurance-only",
    "controls": ["identity-verification", "device-posture", "network-segmentation", "least-privilege", "continuous-evaluation", "session-protection", "break-glass", "telemetry"],
    "gate": ["identity", "device", "network", "privilege", "session", "telemetry", "rollback"],
    "description": "Assesses caller-supplied zero-trust architecture and control evidence without changing identity, network, device, session or access policies."
  },
  "32": {
    "slug": "cryptography-secrets",
    "title": "Cryptography, Secrets and Key Lifecycle",
    "mode": "private-owner-cryptography-lifecycle-assurance-only",
    "controls": ["inventory", "algorithm-policy", "key-generation", "storage", "rotation", "revocation", "recovery", "crypto-agility"],
    "gate": ["inventory", "algorithmPolicy", "keyLifecycle", "storage", "rotation", "revocation", "recovery", "cryptoAgility"],
    "description": "Assesses cryptographic and secret-management metadata without generating keys, reading secrets, rotating credentials or changing vault configuration."
  },
  "33": {
    "slug": "api-security-abuse",
    "title": "API Security and Abuse Resistance",
    "mode": "private-owner-api-security-assurance-only",
    "controls": ["authentication", "authorisation", "schema-validation", "rate-limits", "bot-abuse", "idempotency", "webhook-safety", "logging"],
    "gate": ["authentication", "authorisation", "validation", "rateLimits", "abuseProtection", "idempotency", "webhookSafety", "logging"],
    "description": "Assesses API security and abuse-resistance controls without calling endpoints, creating credentials, changing rate limits or blocking users."
  },
  "34": {
    "slug": "data-sovereignty-transfer",
    "title": "Data Sovereignty and Cross-Border Transfer",
    "mode": "private-owner-data-sovereignty-assurance-only",
    "controls": ["classification", "residency", "transfer-basis", "minimisation", "encryption", "subprocessors", "retention", "deletion"],
    "gate": ["classification", "residency", "transferBasis", "minimisation", "encryption", "subprocessors", "retention", "deletion"],
    "description": "Assesses supplied residency and transfer-governance metadata without moving data, reading records, determining legal compliance or executing deletion."
  },
  "35": {
    "slug": "ai-red-team",
    "title": "AI Red-Team and Adversarial Evaluation",
    "mode": "private-owner-ai-red-team-metadata-only",
    "controls": ["threat-model", "prompt-injection", "jailbreak", "data-exfiltration", "harmful-content", "bias", "tool-abuse", "recovery"],
    "gate": ["threatModel", "promptInjection", "jailbreak", "dataExfiltration", "harmfulContent", "bias", "toolAbuse", "recovery"],
    "description": "Assesses red-team plans and supplied test evidence without executing attacks, invoking models, generating harmful content or probing external systems."
  },
  "36": {
    "slug": "human-oversight",
    "title": "Human Oversight and Approval Governance",
    "mode": "private-owner-human-oversight-assurance-only",
    "controls": ["decision-rights", "approval-levels", "segregation-of-duties", "competence", "explainability", "appeal", "override", "audit"],
    "gate": ["decisionRights", "approvalLevels", "segregation", "competence", "explainability", "appeal", "override", "audit"],
    "description": "Assesses human-oversight structures without granting approvals, making decisions, assigning roles or overriding production controls."
  },
  "37": {
    "slug": "secure-code-execution",
    "title": "Secure Code Execution and Sandbox Assurance",
    "mode": "private-owner-sandbox-assurance-only",
    "controls": ["isolation", "filesystem", "network-egress", "resource-limits", "dependency-policy", "secret-protection", "artifact-handling", "termination"],
    "gate": ["isolation", "filesystem", "networkEgress", "resourceLimits", "dependencies", "secretProtection", "artifactHandling", "termination"],
    "description": "Assesses sandbox and code-execution designs without running code, installing packages, opening network access or creating execution environments."
  },
  "38": {
    "slug": "mlops-llmops",
    "title": "MLOps and LLMOps Lifecycle Governance",
    "mode": "private-owner-mlops-llmops-assurance-only",
    "controls": ["registration", "versioning", "evaluation", "approval", "deployment-plan", "monitoring", "rollback", "retirement"],
    "gate": ["registration", "versioning", "evaluation", "approval", "deploymentPlan", "monitoring", "rollback", "retirement"],
    "description": "Assesses lifecycle evidence without registering, deploying, monitoring, rolling back or retiring models."
  },
  "39": {
    "slug": "ai-incident-recovery",
    "title": "AI Incident Response and Model Recovery",
    "mode": "private-owner-ai-incident-assurance-only",
    "controls": ["detection", "triage", "containment", "evidence", "communications", "rollback", "revalidation", "lessons"],
    "gate": ["detection", "triage", "containment", "evidence", "communications", "rollback", "revalidation", "lessons"],
    "description": "Assesses AI incident and recovery plans without creating incidents, disabling models, sending communications or executing rollback."
  },
  "40": {
    "slug": "trust-centre-operations",
    "title": "Trust Centre and Customer Assurance Operations",
    "mode": "private-owner-trust-centre-assurance-only",
    "controls": ["control-catalogue", "evidence-freshness", "customer-requests", "disclosures", "privacy", "security", "availability", "claims-review"],
    "gate": ["controlCatalogue", "evidenceFreshness", "customerRequests", "disclosures", "privacy", "security", "availability", "claimsReview"],
    "description": "Assesses trust-centre content and customer evidence metadata without publishing material, responding to customers or making certification claims."
  },
  "41": {
    "slug": "third-party-risk",
    "title": "Third-Party and Supply-Chain Risk",
    "mode": "private-owner-third-party-risk-assurance-only",
    "controls": ["inventory", "criticality", "due-diligence", "security", "privacy", "resilience", "contract-controls", "exit-plan"],
    "gate": ["inventory", "criticality", "dueDiligence", "security", "privacy", "resilience", "contractControls", "exitPlan"],
    "description": "Assesses supplier-risk evidence without contacting vendors, accepting contracts, scanning suppliers or changing procurement decisions."
  },
  "42": {
    "slug": "procurement-licensing",
    "title": "Procurement, Licensing and Open-Source Governance",
    "mode": "private-owner-procurement-licensing-assurance-only",
    "controls": ["business-need", "licence", "open-source", "security", "privacy", "cost", "approval", "renewal-exit"],
    "gate": ["businessNeed", "licence", "openSource", "security", "privacy", "cost", "approval", "renewalExit"],
    "description": "Assesses procurement and licensing metadata without purchasing services, accepting licences, approving spend or changing repositories."
  },
  "43": {
    "slug": "financial-controls-fraud",
    "title": "Financial Controls and Fraud Risk",
    "mode": "private-owner-financial-controls-assurance-only",
    "controls": ["segregation", "authorisation", "reconciliation", "fraud-signals", "limits", "evidence", "escalation", "recovery"],
    "gate": ["segregation", "authorisation", "reconciliation", "fraudSignals", "limits", "evidence", "escalation", "recovery"],
    "description": "Assesses financial-control metadata without processing transactions, freezing accounts, determining fraud or providing financial advice."
  },
  "44": {
    "slug": "billing-payments-readiness",
    "title": "Billing and Payments Readiness",
    "mode": "private-owner-billing-payments-readiness-only",
    "controls": ["product-catalogue", "pricing-review", "tax-metadata", "payment-security", "refund-policy", "disputes", "reconciliation", "shutdown"],
    "gate": ["productCatalogue", "pricingReview", "taxMetadata", "paymentSecurity", "refundPolicy", "disputes", "reconciliation", "shutdown"],
    "description": "Assesses billing-readiness metadata only; payment collection, paid plans, taxation decisions and billing activation remain disabled."
  },
  "45": {
    "slug": "communications-reputation",
    "title": "Communications, Brand and Reputation Resilience",
    "mode": "private-owner-communications-assurance-only",
    "controls": ["message-approval", "accuracy", "privacy", "accessibility", "crisis-plan", "channels", "monitoring-plan", "correction"],
    "gate": ["messageApproval", "accuracy", "privacy", "accessibility", "crisisPlan", "channels", "monitoringPlan", "correction"],
    "description": "Assesses communications and crisis-response metadata without publishing content, monitoring people, sending messages or making public statements."
  },
  "46": {
    "slug": "public-sector-critical-infrastructure",
    "title": "Public Sector and Critical Infrastructure Readiness",
    "mode": "private-owner-public-sector-readiness-only",
    "controls": ["mission-impact", "security", "resilience", "supply-chain", "accessibility", "records", "incident-response", "human-authority"],
    "gate": ["missionImpact", "security", "resilience", "supplyChain", "accessibility", "records", "incidentResponse", "humanAuthority"],
    "description": "Assesses readiness evidence without connecting to public systems, operating critical infrastructure, making public decisions or claiming accreditation."
  },
  "47": {
    "slug": "high-stakes-domain-safety",
    "title": "High-Stakes Domain Safety",
    "mode": "private-owner-high-stakes-safety-assurance-only",
    "controls": ["scope-boundary", "qualified-review", "evidence", "uncertainty", "appeal", "privacy", "monitoring-plan", "harm-response"],
    "gate": ["scopeBoundary", "qualifiedReview", "evidence", "uncertainty", "appeal", "privacy", "monitoringPlan", "harmResponse"],
    "description": "Assesses safeguards for health, legal, financial, employment and other high-stakes uses without making domain decisions or replacing qualified professionals."
  },
  "48": {
    "slug": "children-vulnerable-users",
    "title": "Children and Vulnerable-User Protection",
    "mode": "private-owner-vulnerable-user-safety-assurance-only",
    "controls": ["age-appropriate-design", "consent", "data-minimisation", "content-safety", "contact-controls", "reporting", "accessibility", "human-escalation"],
    "gate": ["ageAppropriateDesign", "consent", "dataMinimisation", "contentSafety", "contactControls", "reporting", "accessibility", "humanEscalation"],
    "description": "Assesses protective design metadata without profiling children, collecting consent, contacting vulnerable users or making safeguarding decisions."
  },
  "49": {
    "slug": "global-regional-cultural",
    "title": "Global Expansion, Regional Policy and Cultural Safety",
    "mode": "private-owner-global-regional-assurance-only",
    "controls": ["regional-inventory", "language", "cultural-sensitivity", "privacy", "consumer-protection", "accessibility", "support", "exit-plan"],
    "gate": ["regionalInventory", "language", "culturalSensitivity", "privacy", "consumerProtection", "accessibility", "support", "exitPlan"],
    "description": "Assesses regionalisation and cultural-safety evidence without entering markets, determining legal compliance, publishing translations or committing support."
  },
  "50": {
    "slug": "enterprise-operations-v2",
    "title": "Enterprise Operations v2 Completion",
    "mode": "private-owner-enterprise-operations-completion-only",
    "controls": ["security", "privacy", "ai-safety", "resilience", "operations", "customer-assurance", "financial-control", "global-readiness", "rollback", "independent-review"],
    "gate": ["security", "privacy", "aiSafety", "resilience", "operations", "customerAssurance", "financialControl", "globalReadiness", "rollback", "independentReview"],
    "description": "Provides a final metadata-only owner gate for the advanced assurance programme without deployment, activation, payment, publication, migration or certification claims."
  }
});

export const RUNTIME_WAVE_NUMBERS_31_50 = Object.freeze(
  Object.keys(RUNTIME_WAVES_31_50).map(Number).sort((a, b) => a - b)
);

export function getRuntimeWave31To50(number) {
  return RUNTIME_WAVES_31_50[number] || null;
}
