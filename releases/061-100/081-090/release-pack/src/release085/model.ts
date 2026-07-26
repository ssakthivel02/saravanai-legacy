export interface TransparencyRecord {
  recordId: string;
  topic: string;
  version: string;
  summary: string;
  limitations: string[];
  dataUseStatements: string[];
  humanReviewAvailable: boolean;
  publishedAt: string | undefined;
}

export const RELEASE_085 = {
  id: "085",
  title: "Trust and Transparency Centre",
  objective: "Expose clear platform capabilities, limitations, data use, model involvement, human review, incidents and service status.",
  resource: "transparency-records"
} as const;
