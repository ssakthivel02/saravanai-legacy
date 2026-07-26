const BLOCKED_KEYS = new Set([
  "prompt", "content", "document", "file", "password", "token", "secret",
  "email", "phone", "address", "privatekey", "authorization"
]);

export function safeMetadata(input: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(input).filter(([key]) => !BLOCKED_KEYS.has(key.replaceAll("_", "").toLowerCase()))
  );
}
