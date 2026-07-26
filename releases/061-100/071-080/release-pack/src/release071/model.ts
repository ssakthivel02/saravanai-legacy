export interface MarketplaceConnector {
  connectorId: string;
  publisherId: string;
  version: string;
  capabilities: string[];
  allowedHosts: string[];
  writeCapabilities: string[];
  status: "draft" | "approved" | "suspended" | "revoked";
  approvedBy: string | undefined;
}

export const RELEASE_071 = {
  id: "071",
  title: "Connector Marketplace Governance",
  objective: "Govern connector discovery, approval, capability scopes, publisher identity, egress allowlists, versioning and revocation.",
  resource: "marketplace-connectors"
} as const;
