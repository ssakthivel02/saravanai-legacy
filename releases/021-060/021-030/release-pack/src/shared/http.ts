export function json(data: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      ...headers
    }
  });
}

export function problem(status: number, code: string, title: string, requestId: string): Response {
  return json({
    type: `https://sakthiai.omsaravanabhava.org/problems/${code}`,
    title,
    status,
    code,
    requestId
  }, status);
}
