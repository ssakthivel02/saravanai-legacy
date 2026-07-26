export interface MultimodalAsset {
  assetId: string;
  tenantId: string;
  mediaType: "text" | "image" | "audio" | "video";
  mimeType: string;
  sizeBytes: number;
  sha256: string;
  consentRef: string;
  sensitivity: "internal" | "confidential" | "restricted";
}

export const RELEASE_062 = {
  id: "062",
  title: "Multimodal Intelligence Runtime",
  objective: "Safely ingest and normalise text, image, audio and video assets while retaining provenance, consent and sensitivity metadata.",
  resource: "multimodal-assets"
} as const;
