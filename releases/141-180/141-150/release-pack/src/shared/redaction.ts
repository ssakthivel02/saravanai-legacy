const patterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/gi,
  /\bghp_[A-Za-z0-9]{30,}\b/g,
  /\bsk-[A-Za-z0-9]{20,}\b/g
];
export function redactSecrets(value: string): string {
  return patterns.reduce((out, pattern) => out.replace(pattern, "[REDACTED]"), value);
}
