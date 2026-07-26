import type { AudioTranscript } from "./model";

export const RELEASE_063_CONTROL_RULES = ["source_asset_required", "confidence_range", "voice_cloning_must_be_false", "human_review_for_low_confidence"] as const;

export function validateAudioTranscript(input: AudioTranscript): string[] {
  const errors: string[] = [];
  if (!String(input.transcriptId ?? "").trim()) errors.push("transcriptId_required");
  if (input.confidence < 0 || input.confidence > 1) errors.push("confidence_out_of_range");
  if (input.voiceCloningAllowed !== false) errors.push("voiceCloningAllowed_must_be_false");
  return [...new Set(errors)];
}

export function release063Ready(input: AudioTranscript): boolean {
  return validateAudioTranscript(input).length === 0;
}
