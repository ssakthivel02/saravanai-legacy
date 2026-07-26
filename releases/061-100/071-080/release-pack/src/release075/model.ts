export interface PublicationRecord {
  publicationId: string;
  tenantId: string;
  title: string;
  contentHash: string;
  sourceIds: string[];
  status: "draft" | "verification" | "approved" | "published" | "withdrawn";
  publisher: string | undefined;
  publishedAt: string | undefined;
}

export const RELEASE_075 = {
  id: "075",
  title: "Knowledge Publishing and Editorial Workflow",
  objective: "Publish evidence-backed knowledge through draft, verification, human approval, scheduled release, correction and withdrawal states.",
  resource: "publications"
} as const;
