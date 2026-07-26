export interface AudioTranscript {
  transcriptId: string;
  tenantId: string;
  assetId: string;
  language: string;
  confidence: number;
  speakerLabelsEnabled: boolean;
  voiceCloningAllowed: false;
  reviewStatus: "pending" | "approved" | "rejected";
}

export const RELEASE_063 = {
  id: "063",
  title: "Speech and Audio Intelligence",
  objective: "Provide transcription, language detection and audio analysis with consent controls and an explicit prohibition on unauthorised voice cloning.",
  resource: "audio-transcripts"
} as const;
