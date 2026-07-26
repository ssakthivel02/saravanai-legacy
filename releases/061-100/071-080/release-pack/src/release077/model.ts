export interface MetricDefinition {
  metricId: string;
  tenantId: string;
  name: string;
  unit: string;
  aggregation: "sum" | "average" | "count" | "ratio";
  minimumCohortSize: number;
  owner: string;
  personalDataAllowed: false;
}

export const RELEASE_077 = {
  id: "077",
  title: "Analytics and Executive Insights",
  objective: "Provide privacy-safe KPIs, trends, thresholds and explanations with minimum aggregation and no personal-data exposure.",
  resource: "metric-definitions"
} as const;
