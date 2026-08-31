const BLOCKED_KEYS = new Set(["prompt","content","document","file","email","phone","address","secret","token"]);
export function safeMetadata(input: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(input).filter(([key]) => !BLOCKED_KEYS.has(key.toLowerCase())));
}
