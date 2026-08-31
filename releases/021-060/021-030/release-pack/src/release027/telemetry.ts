export interface MetricPoint {
  name: string;
  value: number;
  timestamp: string;
  labels: Record<string, string>;
}

const ALLOWED_LABELS = new Set(["route", "status", "provider", "model", "tenant_tier", "region"]);

export function sanitiseMetric(point: MetricPoint): MetricPoint {
  const labels = Object.fromEntries(
    Object.entries(point.labels).filter(([key]) => ALLOWED_LABELS.has(key))
  );
  return { ...point, labels };
}

export function sliAvailability(successful: number, total: number): number {
  return total === 0 ? 1 : successful / total;
}
