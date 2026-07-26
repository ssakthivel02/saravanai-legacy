import type { MarketplaceConnector } from "./model";

export const RELEASE_071_CONTROL_RULES = ["publisher_identity_required", "egress_allowlist_required", "write_capabilities_need_approval", "revoked_connector_denied"] as const;

export function validateMarketplaceConnector(input: MarketplaceConnector): string[] {
  const errors: string[] = [];
  if (!String(input.connectorId ?? "").trim()) errors.push("connectorId_required");
  if (!input.capabilities.length) errors.push("capabilities_required");
  if (!input.allowedHosts.length) errors.push("allowedHosts_required");
  if (!input.writeCapabilities.length) errors.push("writeCapabilities_required");
  if ((input as any).status === "approved" && !input.approvedBy) errors.push("approved_by_required");
  return [...new Set(errors)];
}

export function release071Ready(input: MarketplaceConnector): boolean {
  return validateMarketplaceConnector(input).length === 0;
}
