export interface FeatureFlag {
  flagId: string;
  owner: string;
  defaultEnabled: false;
  expiresAt: string;
  killSwitchAvailable: true;
  tenantAllowlist: string[];
}
