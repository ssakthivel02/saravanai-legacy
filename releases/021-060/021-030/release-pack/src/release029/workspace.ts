export interface WorkspaceModule {
  id: string;
  title: string;
  requiredPermission: string;
  enabledByDefault: boolean;
}

export const WORKSPACE_MODULES: WorkspaceModule[] = [
  { id: "research", title: "Research Studio", requiredPermission: "workspace:use", enabledByDefault: true },
  { id: "documents", title: "Document Studio", requiredPermission: "workspace:use", enabledByDefault: true },
  { id: "knowledge", title: "Knowledge Browser", requiredPermission: "workspace:read", enabledByDefault: true },
  { id: "agents", title: "Agent Operations", requiredPermission: "agent:read", enabledByDefault: false },
  { id: "security", title: "Security Centre", requiredPermission: "audit:read", enabledByDefault: false },
  { id: "admin", title: "Administration", requiredPermission: "tenant:write", enabledByDefault: false }
];
